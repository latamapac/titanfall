import { forwardRef } from 'react';
import type { GameState, Highlight } from '../../types/game';
import { Cell } from './Cell';
import { MAPS } from '../../data/maps';

interface BoardProps {
  gameState: GameState;
  onCellClick: (r: number, c: number) => void;
}

export const Board = forwardRef<HTMLDivElement, BoardProps>(({ gameState, onCellClick }, ref) => {
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
    <div className="board" ref={ref}>
      {map.tiles.map((row, r) =>
        row.map((tile, c) => (
          <Cell
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

Board.displayName = 'Board';
