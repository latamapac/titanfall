type LobbyStatus = 'idle' | 'creating' | 'waiting' | 'joining' | 'connected' | 'reconnecting';

interface LobbyScreenProps {
  status: LobbyStatus;
  roomCode: string | null;
  role: 'host' | 'remote' | null;
  error: string | null;
  opponentDisconnected: boolean;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onProceed: () => void;
  onBack: () => void;
  onCancelReconnect: () => void;
}

export function LobbyScreen({ 
  status, 
  roomCode, 
  role: _role, 
  error, 
  opponentDisconnected: _opponentDisconnected,
  onCreateRoom, 
  onJoinRoom, 
  onProceed, 
  onBack,
  onCancelReconnect: _onCancelReconnect 
}: LobbyScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
    }}>
      <h2 style={{
        fontFamily: '"Cinzel", serif',
        fontSize: '48px',
        color: '#FFD700',
      }}>
        Multiplayer Lobby
      </h2>

      {status === 'idle' && (
        <>
          <button
            onClick={onCreateRoom}
            style={{
              padding: '20px 48px',
              fontSize: '20px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            🎮 Create Room
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Enter room code"
              style={{
                padding: '16px 20px',
                fontSize: '18px',
                background: 'rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                width: '200px',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onJoinRoom((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                onJoinRoom(input?.value || '');
              }}
              style={{
                padding: '16px 24px',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Join
            </button>
          </div>
        </>
      )}

      {status === 'waiting' && (
        <>
          <div style={{
            padding: '24px 48px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '12px',
            border: '2px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
              Room Code:
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#FFD700',
              letterSpacing: '4px',
            }}>
              {roomCode}
            </div>
          </div>
          <p style={{ color: '#888' }}>Waiting for opponent...</p>
        </>
      )}

      {status === 'connected' && (
        <>
          <p style={{ color: '#4ADE80', fontSize: '20px' }}>
            ✅ Opponent connected!
          </p>
          <button
            onClick={onProceed}
            style={{
              padding: '20px 48px',
              fontSize: '20px',
              background: 'linear-gradient(135deg, #E84430, #8B2E1C)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Start Battle!
          </button>
        </>
      )}

      {error && (
        <div style={{
          padding: '16px 24px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#EF4444',
        }}>
          {error}
        </div>
      )}
      
      <button
        onClick={onBack}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
