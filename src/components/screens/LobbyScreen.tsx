import { useState } from 'react';

interface LobbyScreenProps {
  status: 'idle' | 'creating' | 'waiting' | 'joining' | 'connected';
  roomCode: string | null;
  role: 'host' | 'remote' | null;
  error: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onProceed?: () => void;
  onBack: () => void;
}

export function LobbyScreen({ status, roomCode, role, error, onCreateRoom, onJoinRoom, onProceed, onBack }: LobbyScreenProps) {
  const [joinCode, setJoinCode] = useState('');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', padding: '20px', paddingTop: '80px',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(40,40,80,.6) 0%, transparent 60%)',
    }}>
      <h1>Multiplayer</h1>

      {error && (
        <div style={{ background: 'rgba(200,50,50,.3)', border: '1px solid #f44', borderRadius: '6px', padding: '10px 20px', marginBottom: '16px', color: '#f88' }}>
          {error}
        </div>
      )}

      {status === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px', marginTop: '20px' }}>
          <button className="btn-primary" onClick={onCreateRoom} style={{ width: '100%' }}>
            Create Room
          </button>
          <div style={{ textAlign: 'center', color: 'var(--dim)', margin: '8px 0' }}>or</div>
          <input
            type="text"
            placeholder="Enter room code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            style={{
              width: '100%', padding: '12px', fontSize: '1.2em', textAlign: 'center',
              background: 'var(--bg2)', border: '2px solid #555', borderRadius: '6px',
              color: 'var(--text)', letterSpacing: '4px', fontWeight: 'bold',
              boxSizing: 'border-box',
            }}
          />
          <button
            className="btn-primary"
            onClick={() => joinCode.length >= 4 && onJoinRoom(joinCode)}
            disabled={joinCode.length < 4}
            style={{ width: '100%' }}
          >
            Join Room
          </button>
        </div>
      )}

      {status === 'creating' && (
        <div style={{ marginTop: '30px', color: 'var(--dim)' }}>Creating room...</div>
      )}

      {status === 'waiting' && roomCode && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ color: 'var(--dim)', marginBottom: '10px' }}>Room Code:</div>
          <div style={{
            fontSize: '2.5em', fontWeight: 'bold', letterSpacing: '8px',
            color: 'var(--gold)', background: 'var(--bg2)', padding: '16px 32px',
            borderRadius: '8px', border: '2px solid var(--gold)',
          }}>
            {roomCode}
          </div>
          <div style={{ color: 'var(--dim)', marginTop: '16px', fontSize: '14px' }}>
            Share this code with your opponent
          </div>
          <div style={{ marginTop: '10px', color: 'var(--dim)' }}>
            Waiting for opponent...
          </div>
        </div>
      )}

      {status === 'joining' && (
        <div style={{ marginTop: '30px', color: 'var(--dim)' }}>Joining room...</div>
      )}

      {status === 'connected' && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ color: '#4a4', fontSize: '1.2em', fontWeight: 'bold' }}>
            Connected!
          </div>
          <div style={{ color: 'var(--dim)', marginTop: '8px' }}>
            You are Player {role === 'host' ? '1 (Host)' : '2'}
          </div>
          {role === 'host' && onProceed && (
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={onProceed}>
              Set Up Game
            </button>
          )}
          {role === 'remote' && (
            <div style={{ color: 'var(--dim)', marginTop: '16px' }}>
              Waiting for host to start the game...
            </div>
          )}
        </div>
      )}

      <button className="btn-secondary" style={{ marginTop: '30px' }} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
