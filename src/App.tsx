import { useState, useEffect, useCallback, useRef } from 'react';
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
import { GameAI, type AIDifficulty } from './ai/GameAI';
import type { GameState } from './types/game';
import './styles/globals.css';
import './styles/board.css';
import './styles/cards.css';
import './styles/animations.css';
import './styles/v2/tokens.css';
import './styles/v2/animations.css';
import './styles/v2/touch.css';

type Screen = 'menu' | 'newgame-local' | 'newgame-ai' | 'lobby' | 'game' | 'rules' | 'deckbuilder' | 'cardcreator' | 'ai-setup';
type GameMode = 'local' | 'host' | 'remote' | 'ai' | null;
type LobbyStatus = 'idle' | 'creating' | 'waiting' | 'joining' | 'connected' | 'reconnecting';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const engine = useGameEngine();
  const aiRef = useRef<GameAI | null>(null);

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

  // Check for saved session on mount
  useEffect(() => {
    const saved = getSavedRoomSession();
    if (saved.code && saved.role) {
      console.log(`Found saved session: room=${saved.code}, role=${saved.role}`);
      const socket = getSocket();
      socket.emit('rejoin-room', { code: saved.code, role: saved.role });
      
      const handleRejoinError = () => {
        console.log('Silent reconnection failed, clearing session');
        clearRoomSession();
      };
      
      socket.once('rejoin-error', handleRejoinError);
      setTimeout(() => socket.off('rejoin-error', handleRejoinError), 5000);
    }
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!gameMode || gameMode === 'local' || gameMode === 'ai') return;
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
      if (!isReconnection) saveRoomSession(code, 'remote');
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

  // Host: broadcast state to remote
  useEffect(() => {
    if (gameMode !== 'host' || !engine.gameState) return;
    getSocket().emit('state-update', {
      gameState: engine.gameState,
      logs: engine.logs,
      showTurnOverlay: engine.showTurnOverlay,
      victory: engine.victory,
    });
  }, [gameMode, engine.gameState, engine.logs, engine.showTurnOverlay, engine.victory]);

  // Host: listen for remote actions
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

  // Remote: listen for state updates
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

  // Remote: listen for game start
  useEffect(() => {
    if (gameMode !== 'remote') return;
    const socket = getSocket();
    const onGameStart = () => setScreen('game');
    socket.on('game-start', onGameStart);
    return () => { socket.off('game-start', onGameStart); };
  }, [gameMode]);

  // AI Turn Processing
  const isProcessingAI = useRef(false);
  
  useEffect(() => {
    if (gameMode !== 'ai' || !engine.gameState) return;
    
    const G = engine.gameState;
    
    // Only process AI when it's player 2's turn, no overlay, game not ended
    if (G.ap !== 1 || engine.showTurnOverlay || engine.victory || isProcessingAI.current) return;
    
    const processAI = async () => {
      isProcessingAI.current = true;
      
      try {
        if (!aiRef.current) aiRef.current = new GameAI(aiDifficulty);
        
        let actionCount = 0;
        const maxActions = 50;
        
        while (actionCount < maxActions) {
          // Check current state
          const currentG = engine.gameState;
          if (!currentG || currentG.ap !== 1 || engine.showTurnOverlay || engine.victory) break;
          
          const action = await aiRef.current.think(currentG);
          
          if (!action || action.type === 'nextPhase') {
            if (action?.type === 'nextPhase') engine.nextPhase();
            break;
          }
          
          // Execute action
          switch (action.type) {
            case 'deploy':
              if (action.payload) {
                engine.cardClick(action.payload.cardIndex as number);
                await new Promise(r => setTimeout(r, 400));
                engine.cellClick(action.payload.r as number, action.payload.c as number);
                await new Promise(r => setTimeout(r, 600));
              }
              break;
            case 'move':
              if (action.payload) {
                engine.cellClick(action.payload.fromR as number, action.payload.fromC as number);
                await new Promise(r => setTimeout(r, 400));
                engine.cellClick(action.payload.toR as number, action.payload.toC as number);
                await new Promise(r => setTimeout(r, 500));
              }
              break;
            case 'attack':
              if (action.payload) {
                engine.cellClick(action.payload.fromR as number, action.payload.fromC as number);
                await new Promise(r => setTimeout(r, 400));
                engine.cellClick(action.payload.toR as number, action.payload.toC as number);
                await new Promise(r => setTimeout(r, 700));
              }
              break;
            case 'titan':
              engine.activateTitan();
              await new Promise(r => setTimeout(r, 600));
              break;
          }
          
          actionCount++;
          await new Promise(r => setTimeout(r, 300));
        }
      } catch (err) {
        console.error('AI error:', err);
      } finally {
        isProcessingAI.current = false;
      }
    };
    
    processAI();
  }, [gameMode, engine.gameState?.turn, engine.gameState?.phase, engine.gameState?.p[1].energy, engine.showTurnOverlay, engine.victory, aiDifficulty]);

  // Menu Actions
  const handleLocalMultiplayer = useCallback(() => {
    clearRoomSession();
    disconnectSocket();
    aiRef.current = null;
    setGameMode('local');
    resetLobbyState();
    setScreen('newgame-local');
  }, []);

  const handleOnlineGame = useCallback(() => {
    aiRef.current = null;
    setGameMode('host');
    resetLobbyState();
    clearRoomSession();
    setScreen('lobby');
  }, []);

  const handleSingleBattle = useCallback(() => {
    setScreen('ai-setup');
  }, []);

  const handleSelectAIDifficulty = useCallback((difficulty: AIDifficulty) => {
    clearRoomSession();
    disconnectSocket();
    aiRef.current = new GameAI(difficulty);
    setAiDifficulty(difficulty);
    setGameMode('ai');
    resetLobbyState();
    setScreen('newgame-ai');
  }, []);

  const resetLobbyState = () => {
    setLobbyStatus('idle');
    setRoomCode(null);
    setMpRole(null);
    setMpError(null);
    setOpponentDisconnected(false);
  };

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
    resetLobbyState();
  }, []);

  const handleLobbyProceed = useCallback(() => {
    setScreen('newgame-local');
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
    aiRef.current = null;
    disconnectSocket();
    setRemoteGameState(null);
    setRemoteLogs([]);
    setRemoteShowTurnOverlay(false);
    setRemoteVictory(null);
    setGameMode(null);
    resetLobbyState();
    setScreen('menu');
  }, [engine]);

  // Remote actions
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

  // Determine state to render
  const isRemote = gameMode === 'remote';
  const isAI = gameMode === 'ai';
  const gameState = isRemote ? remoteGameState : engine.gameState;
  const logs = isRemote ? remoteLogs : engine.logs;
  const showTurnOverlay = isRemote ? remoteShowTurnOverlay : engine.showTurnOverlay;
  const victory = isRemote ? remoteVictory : engine.victory;
  const myPlayerIdx = isRemote ? 1 : 0;

  // Auto-dismiss turn overlay for AI
  useEffect(() => {
    if (isAI && showTurnOverlay && engine.gameState?.ap === 1) {
      const timer = setTimeout(() => engine.dismissTurnOverlay(), 500);
      return () => clearTimeout(timer);
    }
  }, [isAI, showTurnOverlay, engine.gameState?.ap, engine.dismissTurnOverlay]);

  return (
    <>
      {screen === 'menu' && (
        <MenuScreen
          onLocalMultiplayer={handleLocalMultiplayer}
          onOnlineGame={handleOnlineGame}
          onSingleBattle={handleSingleBattle}
          onRules={() => setScreen('rules')}
          onDeckBuilder={() => setScreen('deckbuilder')}
          onCardCreator={() => setScreen('cardcreator')}
        />
      )}
      
      {screen === 'ai-setup' && (
        <AISelectScreen
          onSelect={handleSelectAIDifficulty}
          onBack={() => setScreen('menu')}
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
      
      {screen === 'newgame-local' && (
        <NewGameScreen
          onStart={handleStartGame}
          onBack={handleBackToMenu}
          mode="local"
        />
      )}
      
      {screen === 'newgame-ai' && (
        <NewGameScreen
          onStart={handleStartGame}
          onBack={handleBackToMenu}
          mode="ai"
          aiDifficulty={aiDifficulty}
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
          isMultiplayer={isRemote}
          isAI={isAI}
          aiDifficulty={aiDifficulty}
        />
      )}
      
      {screen === 'rules' && <RulesScreen onBack={() => setScreen('menu')} />}
      {screen === 'deckbuilder' && <DeckBuilderScreen onBack={() => setScreen('menu')} />}
      {screen === 'cardcreator' && <CardCreatorScreen onBack={() => setScreen('menu')} />}
    </>
  );
}

// AI Difficulty Selection Screen
interface AISelectScreenProps {
  onSelect: (difficulty: AIDifficulty) => void;
  onBack: () => void;
}

function AISelectScreen({ onSelect, onBack }: AISelectScreenProps) {
  return (
    <div className="screen">
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        textAlign: 'center',
        padding: '40px',
        background: 'linear-gradient(180deg, var(--bg2), var(--bg))',
        borderRadius: '12px',
        border: '1px solid #3a3a6a',
      }}>
        <h2 style={{ marginBottom: '10px' }}>⚔️ Single Battle</h2>
        <p className="subtitle" style={{ marginBottom: '30px' }}>
          Choose your opponent's difficulty
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <button 
            className="btn-primary" 
            onClick={() => onSelect('easy')}
            style={{ 
              padding: '20px', 
              fontSize: '18px',
              background: 'linear-gradient(135deg, #2a5a3f, #1a3a2f)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌱</div>
            <div>Easy</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
              For beginners - AI makes mistakes and plays safe
            </div>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => onSelect('medium')}
            style={{ 
              padding: '20px', 
              fontSize: '18px',
              background: 'linear-gradient(135deg, #2a5a8f, #1a3a6f)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚔️</div>
            <div>Medium</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
              Balanced challenge - AI plays smart but fair
            </div>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => onSelect('hard')}
            style={{ 
              padding: '20px', 
              fontSize: '18px',
              background: 'linear-gradient(135deg, #5a1a1a, #3a0a0a)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔥</div>
            <div>Hard</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
              Expert AI - Optimized plays, aggressive tactics
            </div>
          </button>
        </div>

        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}
