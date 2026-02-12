import { useState } from 'react';

interface ActionButtonProps {
  action: 'attack' | 'defend' | 'move' | 'deploy' | 'endTurn' | 'home' | 'deck' | 'settings';
  faction?: string;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({ 
  action, 
  faction = 'kargath', 
  label, 
  disabled = false, 
  onClick,
  size = 'md'
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const iconPath = `/assets/ui/icon_${action}_${faction}.png`;
  
  const sizeMap = {
    sm: { width: 36, height: 36, fontSize: 10 },
    md: { width: 48, height: 48, fontSize: 12 },
    lg: { width: 64, height: 64, fontSize: 14 },
  };
  
  const { width, height, fontSize } = sizeMap[size];
  
  const actionLabels: Record<string, string> = {
    attack: 'Attack',
    defend: 'Defend',
    move: 'Move',
    deploy: 'Deploy',
    endTurn: 'End Turn',
    home: 'Home',
    deck: 'Deck',
    settings: 'Settings',
  };
  
  return (
    <button
      className={`action-btn ${action} ${disabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        background: 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        padding: '4px',
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: '8px',
          background: isPressed 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))'
            : isHovered && !disabled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
          border: `2px solid ${isHovered && !disabled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: isPressed
            ? 'inset 0 3px 6px rgba(0,0,0,0.4)'
            : isHovered && !disabled
            ? '0 0 15px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)'
            : '0 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          transform: isPressed ? 'scale(0.95)' : isHovered && !disabled ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <img
          src={iconPath}
          alt={action}
          style={{
            width: width * 0.7,
            height: height * 0.7,
            objectFit: 'contain',
            filter: isHovered && !disabled ? 'brightness(1.2) drop-shadow(0 0 5px rgba(255,255,255,0.5))' : 'brightness(1)',
            transition: 'filter 0.15s ease',
          }}
        />
      </div>
      {label !== '' && (
        <span
          style={{
            fontSize,
            fontWeight: 'bold',
            color: isHovered && !disabled ? '#fff' : '#aaa',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.15s ease',
          }}
        >
          {label ?? actionLabels[action]}
        </span>
      )}
    </button>
  );
}

interface EndTurnButtonProps {
  faction?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function EndTurnButton({ faction = 'kargath', disabled = false, onClick }: EndTurnButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      className="end-turn-btn"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 24px',
        background: isPressed
          ? 'linear-gradient(135deg, #DC2626, #991B1B)'
          : isHovered && !disabled
          ? 'linear-gradient(135deg, #EF4444, #DC2626)'
          : 'linear-gradient(135deg, #991B1B, #7F1D1D)',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: isPressed
          ? 'inset 0 4px 8px rgba(0,0,0,0.4)'
          : isHovered && !disabled
          ? '0 0 20px rgba(239, 68, 68, 0.5), 0 4px 12px rgba(0,0,0,0.4)'
          : '0 4px 8px rgba(0,0,0,0.3)',
        transform: isPressed ? 'scale(0.98)' : isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s ease',
      }}
    >
      <img
        src={`/assets/ui/icon_end_turn_${faction}.png`}
        alt="End Turn"
        style={{
          width: '28px',
          height: '28px',
          objectFit: 'contain',
          filter: 'brightness(1.2)',
        }}
      />
      <span
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        End Turn
      </span>
    </button>
  );
}

interface PhaseActionButtonsProps {
  faction?: string;
  phase: number;
  canEndPhase: boolean;
  onEndPhase: () => void;
}

export function PhaseActionButtons({ faction = 'kargath', phase, canEndPhase, onEndPhase }: PhaseActionButtonsProps) {
  const phaseNames: Record<number, string> = {
    1: 'Refresh',
    2: 'Draw',
    3: 'Deploy',
    4: 'Move',
    5: 'Combat',
    6: 'End',
  };
  
  const phaseIcons: Record<number, string> = {
    1: 'home',
    2: 'deck',
    3: 'deploy',
    4: 'move',
    5: 'attack',
    6: 'endTurn',
  };
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(0,0,0,0.5)',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Current Phase Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
        }}
      >
        <img
          src={`/assets/ui/icon_${phaseIcons[phase] || 'home'}_${faction}.png`}
          alt=""
          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
          {phaseNames[phase] || 'Unknown'} Phase
        </span>
      </div>
      
      {/* End Phase Button */}
      <EndTurnButton faction={faction} disabled={!canEndPhase} onClick={onEndPhase} />
    </div>
  );
}
