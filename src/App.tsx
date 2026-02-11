import { useState, useEffect, useCallback } from 'react';
import { MenuScreen } from './components/screens/MenuScreen';
import { NewGameScreen } from './components/screens/NewGameScreen';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { GameScreen } from './components/screens/GameScreen';
import { RulesScreen } from './components/screens/RulesScreen';
import { DeckBuilderScreen } from './components/screens/DeckBuilderScreen';
import { CardCreatorScreen } from './components/screens/CardCreatorScreen';
import { useGameEngine } from './hooks/useGameEngine';
import { generateDefaultDeck, loadCustomCardsFromStorage } from './engine/utils';
import { TITANS } from './data/titans';
import { getSocket, disconnectSocket, saveRoomSession, clearRoomSession, getSavedRoomSession } from './multiplayer/socket';
import type { GameState } from './types/game';
import './styles/globals.css';
import './styles/board.css';
import './styles/cards.css';
import './styles/animations.css';
import './styles/v2/tokens.css';
import './styles/v2/animations.css';
import './styles/v2/touch.css';

type Screen = 'menu' | 'newgame' | 'lobby' | 'game' | 'rules' | 'deckbuilder' | 'cardcreator';
type GameMode = 'local' | 'host' | 'remote';
type LobbyStatus = 'idle' | 'creating' | 'waiting' | 'joining' | 'connected' | 'reconnecting';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const engine = useGameEngine();

  // Load custom cards on mount
  useEffect(() => {
    loadCustomCardsFromStorage();
  }, []);

  // Multiplayer state
  const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus>('idle');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [mpRole, setMpRole] = useState<'host' | 'remote' | null>(null);
  const [mpError, setMpError] = useState<string | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Remote player: receives state from host
  const [remoteGameState, setRemoteGameState] = useState<GameState | null>(null);
  const [remoteLogs, setRemoteLogs] = useState<string[]>([]);
  const [remoteShowTurnOverlay, setRemoteShowTurnOverlay] = useState(false);
  const [remoteVictory, setRemoteVictory] = useState<{ winner: number } | null>(null);

  // Check for saved session on mount (for page refresh recovery)
  useEffect(() => {
    const saved = getSavedRoomSession();
    if (saved.code && saved.role) {
      console.log(`Found saved session: room=${saved.code}, role=${saved.role}`);
      // Only auto-reconnect if we're in multiplayer mode (not local)
      // and user explicitly clicks multiplayer
      // For now, just clear old sessions to prevent stuck state
      const socket = getSocket();
      
      // Try silent reconnection, but don't block the UI
      socket.emit('rejoin-room', { code: saved.code, role: saved.role });
      
      // Set up one-time error handler - if reconnection fails, clear session
      const handleRejoinError = () => {
        console.log('Silent reconnection failed, clearing session');
        clearRoomSession();
      };
      
      socket.once('rejoin-error', handleRejoinError);
      
      // Clean up handler after 5 seconds
      setTimeout(() => {
        socket.off('rejoin-error', handleRejoinError);
      }, 5000);
    }
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (gameMode === 'local') return;
    const socket = getSocket();

    const onRoomCreated = ({ code }: { code: string }) => {
      setRoomCode(code);
      setLobbyStatus('waiting');
      setMpRole('host');
      saveRoomSession(code, 'host');
    };
    
    const onRoomJoined = ({ code, isReconnection }: { code: string; isReconnection?: boolean }) => {
      setRoomCode(code);
      setLobbyStatus('connected');
      setMpRole(isReconnection ? mpRole : 'remote');
      if (!isReconnection) {
        saveRoomSession(code, 'remote');
      }
      setOpponentDisconnected(false);
    };
    
    const onPlayerJoined = ({ isReconnection }: { isReconnection?: boolean }) => {
      setLobbyStatus('connected');
      setOpponentDisconnected(false);
      if (isReconnection) {
        setMpError('Opponent reconnected!');
        setTimeout(() => setMpError(null), 3000);
      }
    };
    
    const onPlayerRejoined = ({ role }: { role: string }) => {
      setOpponentDisconnected(false);
      setMpError(`${role === 'host' ? 'Host' : 'Opponent'} reconnected!`);
      setTimeout(() => setMpError(null), 3000);
    };
    
    const onJoinError = ({ message }: { message: string }) => {
      setMpError(message);
      setLobbyStatus('idle');
      clearRoomSession();
    };
    
    const onRejoinError = ({ message }: { message: string }) => {
      setMpError(`Reconnection failed: ${message}`);
      setLobbyStatus('idle');
      clearRoomSession();
    };
    
    const onHostDisconnected = ({ message }: { message: string }) => {
      setMpError(message);
      setOpponentDisconnected(true);
    };
    
    const onRemoteDisconnected = ({ message }: { message: string }) => {
      setMpError(message);
      setOpponentDisconnected(true);
    };

    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('player-joined', onPlayerJoined);
    socket.on('player-rejoined', onPlayerRejoined);
    socket.on('join-error', onJoinError);
    socket.on('rejoin-error', onRejoinError);
    socket.on('host-disconnected', onHostDisconnected);
    socket.on('remote-disconnected', onRemoteDisconnected);

    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('player-joined', onPlayerJoined);
      socket.off('player-rejoined', onPlayerRejoined);
      socket.off('join-error', onJoinError);
      socket.off('rejoin-error', onRejoinError);
      socket.off('host-disconnected', onHostDisconnected);
      socket.off('remote-disconnected', onRemoteDisconnected);
    };
  }, [gameMode, mpRole]);

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
    // Clear any existing multiplayer session when starting local
    clearRoomSession();
    disconnectSocket();
    setGameMode('local');
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setOpponentDisconnected(false);
    setScreen('newgame');
  }, []);

  const handleStartMultiplayer = useCallback(() => {
    setGameMode('host');
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setOpponentDisconnected(false);
    clearRoomSession();
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

  const handleCancelReconnect = useCallback(() => {
    clearRoomSession();
    disconnectSocket();
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setOpponentDisconnected(false);
  }, []);

  const handleLobbyProceed = useCallback(() => {
    setScreen('newgame');
  }, []);

  const handleStartGame = useCallback((p1TitanId: string, p2TitanId: string, mapIdx: number) => {
    const t1 = TITANS.find(t => t.id === p1TitanId);
    const t2 = TITANS.find(t => t.id === p2TitanId);
    const p1Deck = generateDefaultDeck(t1?.elem || 'fire');
    const p2Deck = generateDefaultDeck(t2?.elem || 'earth');
    engine.startGame(p1TitanId, p2TitanId, mapIdx, p1Deck, p2Deck);
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
    setOpponentDisconnected(false);
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
          onDeckBuilder={() => setScreen('deckbuilder')}
          onCardCreator={() => setScreen('cardcreator')}
        />
      )}
      {screen === 'lobby' && (
        <LobbyScreen
          status={lobbyStatus}
          roomCode={roomCode}
          role={mpRole}
          error={mpError}
          opponentDisconnected={opponentDisconnected}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onProceed={handleLobbyProceed}
          onBack={handleBackToMenu}
          onCancelReconnect={handleCancelReconnect}
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
      {screen === 'deckbuilder' && (
        <DeckBuilderScreen onBack={() => setScreen('menu')} />
      )}
      {screen === 'cardcreator' && (
        <CardCreatorScreen onBack={() => setScreen('menu')} />
      )}
    </>
  );
}
