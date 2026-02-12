import { useEffect, useState } from 'react';

interface DefeatOverlayProps {
  loser: string;
  loserFaction?: string;
  winner?: string;
  onRetry?: () => void;
  onMainMenu?: () => void;
  onViewStats?: () => void;
}

export function DefeatOverlayEnhanced({ 
  loser,
  loserFaction = 'kargath', 
  winner,
  onRetry,
  onMainMenu,
  onViewStats
}: DefeatOverlayProps) {
  const [showContent, setShowContent] = useState(false);
  
  const screenPath = `/assets/ui/screen_defeat_${loserFaction}.png`;
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      className="defeat-overlay-enhanced"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <img
        src={screenPath}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.8) 100%)',
          zIndex: -1,
        }}
      />
      
      {/* Ash particles effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
          opacity: 0.3,
          animation: 'ash-fall 20s linear infinite',
          zIndex: 0,
        }}
      />
      
      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1,
        }}
      >
        {/* Defeat Title */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '8px',
              background: 'linear-gradient(180deg, #6B7280 0%, #4B5563 50%, #374151 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(100, 100, 100, 0.3)',
              marginBottom: '8px',
            }}
          >
            DEFEAT
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#9CA3AF',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {winner ? `${winner} has prevailed...` : 'The battle is lost...'}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#6B7280',
              marginTop: '8px',
              fontStyle: 'italic',
            }}
          >
            But your titan will rise again
          </div>
        </div>
        
        {/* Tips Box */}
        <div
          style={{
            maxWidth: '500px',
            padding: '20px 24px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            💡 Tips for Next Battle
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#D1D5DB',
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            <li>Manage your energy efficiently - don't overspend early</li>
            <li>Use your titan's active ability at key moments</li>
            <li>Position units strategically on the board</li>
            <li>Save spells for high-value targets</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
              }}
            >
              🔄 Try Again
            </button>
          )}
          
          {onViewStats && (
            <button
              onClick={onViewStats}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              📊 View Stats
            </button>
          )}
          
          {onMainMenu && (
            <button
              onClick={onMainMenu}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#9CA3AF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#9CA3AF';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              🏠 Main Menu
            </button>
          )}
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes ash-fall {
          0% { transform: translateY(-10%); }
          100% { transform: translateY(10%); }
        }
      `}</style>
    </div>
  );
}
