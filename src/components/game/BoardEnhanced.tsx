import { forwardRef } from 'react';
import type { GameState, Highlight } from '../../types/game';
import { CellEnhanced } from './CellEnhanced';
import { MAPS } from '../../data/maps';

interface BoardProps {
  gameState: GameState;
  onCellClick: (r: number, c: number) => void;
}

export const BoardEnhanced = forwardRef<HTMLDivElement, BoardProps>(({ gameState, onCellClick }, ref) => {
  const map = MAPS[gameState.mapIdx];
  const highlightMap = new Map<string, Highlight>();
  for (const hl of gameState.highlights) {
    highlightMap.set(`${hl.r},${hl.c}`, hl);
  }

  const isCellSelected = (r: number, c: number) => {
    if (!gameState.sel || gameState.sel.type !== 'unit') return false;
    return gameState.sel.r === r && gameState.sel.c === c;
  };

  return (
    <div 
      className="board-enhanced" 
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${map.cols}, 1fr)`,
        gridTemplateRows: `repeat(${map.rows}, 1fr)`,
        gap: '4px',
        width: '100%',
        height: '100%',
        padding: '8px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {map.tiles.map((row, r) =>
        row.map((tile, c) => (
          <CellEnhanced
            key={`${r}-${c}`}
            r={r}
            c={c}
            terrain={tile.t}
            height={tile.h}
            unit={gameState.board[r]?.[c] || null}
            highlight={highlightMap.get(`${r},${c}`) || null}
            selected={isCellSelected(r, c)}
            onClick={() => onCellClick(r, c)}
          />
        ))
      )}
    </div>
  );
});

BoardEnhanced.displayName = 'BoardEnhanced';
