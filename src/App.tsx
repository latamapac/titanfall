import { useState, useEffect, useCallback } from 'react';
import { MenuScreen } from './components/screens/MenuScreen';
import { NewGameScreen } from './components/screens/NewGameScreen';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { GameScreen } from './components/screens/GameScreen';
import { RulesScreen } from './components/screens/RulesScreen';
import { useGameEngine } from './hooks/useGameEngine';
import { getSocket, disconnectSocket } from './multiplayer/socket';
import type { GameState } from './types/game';
import './styles/globals.css';
import './styles/board.css';
import './styles/cards.css';
import './styles/animations.css';

type Screen = 'menu' | 'newgame' | 'lobby' | 'game' | 'rules';
type GameMode = 'local' | 'host' | 'remote';
type LobbyStatus = 'idle' | 'creating' | 'waiting' | 'joining' | 'connected';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const engine = useGameEngine();

  // Multiplayer state
  const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus>('idle');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [mpRole, setMpRole] = useState<'host' | 'remote' | null>(null);
  const [mpError, setMpError] = useState<string | null>(null);

  // Remote player: receives state from host
  const [remoteGameState, setRemoteGameState] = useState<GameState | null>(null);
  const [remoteLogs, setRemoteLogs] = useState<string[]>([]);
  const [remoteShowTurnOverlay, setRemoteShowTurnOverlay] = useState(false);
  const [remoteVictory, setRemoteVictory] = useState<{ winner: number } | null>(null);

  // Socket event handlers
  useEffect(() => {
    if (gameMode === 'local') return;
    const socket = getSocket();

    const onRoomCreated = ({ code }: { code: string }) => {
      setRoomCode(code);
      setLobbyStatus('waiting');
      setMpRole('host');
    };
    const onRoomJoined = ({ code }: { code: string }) => {
      setRoomCode(code);
      setLobbyStatus('connected');
      setMpRole('remote');
    };
    const onPlayerJoined = () => {
      setLobbyStatus('connected');
    };
    const onJoinError = ({ message }: { message: string }) => {
      setMpError(message);
      setLobbyStatus('idle');
    };
    const onPlayerDisconnected = () => {
      setMpError('Opponent disconnected');
    };

    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('player-joined', onPlayerJoined);
    socket.on('join-error', onJoinError);
    socket.on('player-disconnected', onPlayerDisconnected);

    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('player-joined', onPlayerJoined);
      socket.off('join-error', onJoinError);
      socket.off('player-disconnected', onPlayerDisconnected);
    };
  }, [gameMode]);

  // Host: broadcast state to remote whenever it changes
  useEffect(() => {
    if (gameMode !== 'host' || !engine.gameState) return;
    getSocket().emit('state-update', {
      gameState: engine.gameState,
      logs: engine.logs,
      showTurnOverlay: engine.showTurnOverlay,
      victory: engine.victory,
    });
  }, [gameMode, engine.gameState, engine.logs, engine.showTurnOverlay, engine.victory]);

  // Host: listen for remote player actions
  useEffect(() => {
    if (gameMode !== 'host') return;
    const socket = getSocket();
    const onRemoteAction = (action: { type: string; payload?: Record<string, number> }) => {
      switch (action.type) {
        case 'cellClick': if (action.payload) engine.cellClick(action.payload.r, action.payload.c); break;
        case 'cardClick': if (action.payload) engine.cardClick(action.payload.idx); break;
        case 'activateTitan': engine.activateTitan(); break;
        case 'nextPhase': engine.nextPhase(); break;
        case 'dismissTurnOverlay': engine.dismissTurnOverlay(); break;
      }
    };
    socket.on('remote-action', onRemoteAction);
    return () => { socket.off('remote-action', onRemoteAction); };
  }, [gameMode, engine]);

  // Remote: listen for state updates from host
  useEffect(() => {
    if (gameMode !== 'remote') return;
    const socket = getSocket();
    const onStateUpdate = (data: {
      gameState: GameState;
      logs: string[];
      showTurnOverlay: boolean;
      victory: { winner: number } | null;
    }) => {
      setRemoteGameState(data.gameState);
      setRemoteLogs(data.logs);
      setRemoteShowTurnOverlay(data.showTurnOverlay);
      setRemoteVictory(data.victory);
    };
    socket.on('state-update', onStateUpdate);
    return () => { socket.off('state-update', onStateUpdate); };
  }, [gameMode]);

  // Remote: listen for game start from host
  useEffect(() => {
    if (gameMode !== 'remote') return;
    const socket = getSocket();
    const onGameStart = () => {
      setScreen('game');
    };
    socket.on('game-start', onGameStart);
    return () => { socket.off('game-start', onGameStart); };
  }, [gameMode]);

  // Actions
  const handleStartLocal = useCallback(() => {
    setGameMode('local');
    setScreen('newgame');
  }, []);

  const handleStartMultiplayer = useCallback(() => {
    setGameMode('host');
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setScreen('lobby');
  }, []);

  const handleCreateRoom = useCallback(() => {
    setMpError(null);
    setLobbyStatus('creating');
    getSocket().emit('create-room');
  }, []);

  const handleJoinRoom = useCallback((code: string) => {
    setMpError(null);
    setGameMode('remote');
    setLobbyStatus('joining');
    getSocket().emit('join-room', { code });
  }, []);

  const handleLobbyProceed = useCallback(() => {
    setScreen('newgame');
  }, []);

  const handleStartGame = useCallback((p1TitanId: string, p2TitanId: string, mapIdx: number) => {
    engine.startGame(p1TitanId, p2TitanId, mapIdx, [], []);
    setScreen('game');
    if (gameMode === 'host') {
      getSocket().emit('game-start', { p1TitanId, p2TitanId, mapIdx });
    }
  }, [engine, gameMode]);

  const handleBackToMenu = useCallback(() => {
    engine.resetGame();
    disconnectSocket();
    setRemoteGameState(null);
    setRemoteLogs([]);
    setRemoteShowTurnOverlay(false);
    setRemoteVictory(null);
    setGameMode('local');
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setScreen('menu');
  }, [engine]);

  // Remote player sends actions to host via server
  const remoteOnCellClick = useCallback((r: number, c: number) => {
    getSocket().emit('remote-action', { type: 'cellClick', payload: { r, c } });
  }, []);
  const remoteOnCardClick = useCallback((idx: number) => {
    getSocket().emit('remote-action', { type: 'cardClick', payload: { idx } });
  }, []);
  const remoteOnNextPhase = useCallback(() => {
    getSocket().emit('remote-action', { type: 'nextPhase' });
  }, []);
  const remoteOnActivateTitan = useCallback(() => {
    getSocket().emit('remote-action', { type: 'activateTitan' });
  }, []);
  const remoteOnDismissTurnOverlay = useCallback(() => {
    getSocket().emit('remote-action', { type: 'dismissTurnOverlay' });
  }, []);

  // Pick which state to render
  const isRemote = gameMode === 'remote';
  const gameState = isRemote ? remoteGameState : engine.gameState;
  const logs = isRemote ? remoteLogs : engine.logs;
  const showTurnOverlay = isRemote ? remoteShowTurnOverlay : engine.showTurnOverlay;
  const victory = isRemote ? remoteVictory : engine.victory;
  const myPlayerIdx = isRemote ? 1 : 0;

  return (
    <>
      {screen === 'menu' && (
        <MenuScreen
          onNewGame={handleStartLocal}
          onMultiplayer={handleStartMultiplayer}
          onRules={() => setScreen('rules')}
        />
      )}
      {screen === 'lobby' && (
        <LobbyScreen
          status={lobbyStatus}
          roomCode={roomCode}
          role={mpRole}
          error={mpError}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onProceed={handleLobbyProceed}
          onBack={handleBackToMenu}
        />
      )}
      {screen === 'newgame' && (
        <NewGameScreen
          onStart={handleStartGame}
          onBack={handleBackToMenu}
        />
      )}
      {screen === 'game' && gameState && (
        <GameScreen
          gameState={gameState}
          logs={logs}
          showTurnOverlay={showTurnOverlay}
          victory={victory}
          onNextPhase={isRemote ? remoteOnNextPhase : engine.nextPhase}
          onCellClick={isRemote ? remoteOnCellClick : engine.cellClick}
          onCardClick={isRemote ? remoteOnCardClick : engine.cardClick}
          onActivateTitan={isRemote ? remoteOnActivateTitan : engine.activateTitan}
          onDismissTurnOverlay={isRemote ? remoteOnDismissTurnOverlay : engine.dismissTurnOverlay}
          onBackToMenu={handleBackToMenu}
          myPlayerIdx={myPlayerIdx}
          isMultiplayer={gameMode !== 'local'}
        />
      )}
      {screen === 'rules' && (
        <RulesScreen onBack={() => setScreen('menu')} />
      )}
    </>
  );
}
