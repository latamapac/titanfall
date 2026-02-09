import type { TerrainType, Unit, Highlight } from '../../types/game';
import { TerrainSVG } from '../../art/TerrainSVG';
import { UnitToken } from './UnitToken';

interface CellProps {
  r: number;
  c: number;
  terrain: TerrainType;
  height: number;
  unit: Unit | null;
  highlight: Highlight | null;
  selected: boolean;
  onClick: () => void;
}

export function Cell({ r, c, terrain, height, unit, highlight, selected, onClick }: CellProps) {
  const terrainClass = `t-${terrain}`;
  const heightClass = height > 0 ? `h-${Math.min(height, 3)}` : '';
  let hlClass = '';
  if (selected) hlClass = 'hl-selected';
  else if (highlight) hlClass = `hl-${highlight.type}`;

  const terrainSvg = TerrainSVG[terrain]?.();

  return (
    <div
      className={`cell ${terrainClass} ${heightClass} ${hlClass}`}
      data-r={r}
      data-c={c}
      onClick={onClick}
    >
      {terrainSvg && (
        <div
          className="terrain-icon"
          dangerouslySetInnerHTML={{ __html: terrainSvg }}
        />
      )}
      {unit && <UnitToken unit={unit} />}
    </div>
  );
}
