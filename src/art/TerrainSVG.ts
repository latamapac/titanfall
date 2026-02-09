import type { TerrainType } from '../types/game';

const sv = (inner: string) => `<svg viewBox="0 0 60 48" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const TerrainSVG: Record<TerrainType, () => string> = {
  plain: () => sv(
    '<path d="M10,38 Q12,28 14,38" stroke="#5a8a4a" stroke-width="1.5" fill="none"/>' +
    '<path d="M20,40 Q22,26 24,40" stroke="#4a7a3a" stroke-width="1.8" fill="none"/>' +
    '<path d="M18,39 Q20,30 22,39" stroke="#6a9a5a" stroke-width="1.2" fill="none"/>' +
    '<path d="M32,38 Q34,30 36,38" stroke="#5a8a4a" stroke-width="1.5" fill="none"/>' +
    '<path d="M40,39 Q42,32 44,39" stroke="#4a7a3a" stroke-width="1.3" fill="none"/>' +
    '<path d="M28,40 Q30,34 32,40" stroke="#6a9a5a" stroke-width="1" fill="none"/>'
  ),
  forest: () => sv(
    '<polygon points="20,8 28,26 12,26" fill="#1a5a1a"/>' +
    '<polygon points="20,4 26,18 14,18" fill="#2a7a2a"/>' +
    '<rect x="18" y="26" width="4" height="8" fill="#5a3a1a"/>' +
    '<polygon points="38,14 44,28 32,28" fill="#1a5a1a" opacity=".8"/>' +
    '<polygon points="38,10 43,22 33,22" fill="#2a6a2a" opacity=".8"/>' +
    '<rect x="36" y="28" width="4" height="6" fill="#4a2a0a" opacity=".8"/>'
  ),
  mountain: () => sv(
    '<polygon points="30,6 48,40 12,40" fill="#5a5a6a"/>' +
    '<polygon points="30,6 40,40 20,40" fill="#6a6a7a"/>' +
    '<polygon points="30,6 34,16 26,16" fill="#dde8f0" opacity=".7"/>' +
    '<polygon points="30,6 32,12 28,12" fill="#fff" opacity=".5"/>'
  ),
  water: () => sv(
    '<path d="M4,22 Q12,16 20,22 Q28,28 36,22 Q44,16 52,22" fill="none" stroke="#4a8aee" stroke-width="2.5" opacity=".7">' +
    '<animate attributeName="d" dur="3s" repeatCount="indefinite" values="M4,22 Q12,16 20,22 Q28,28 36,22 Q44,16 52,22;M4,22 Q12,28 20,22 Q28,16 36,22 Q44,28 52,22;M4,22 Q12,16 20,22 Q28,28 36,22 Q44,16 52,22"/></path>' +
    '<path d="M2,32 Q10,26 18,32 Q26,38 34,32 Q42,26 50,32" fill="none" stroke="#3a7ade" stroke-width="2" opacity=".5">' +
    '<animate attributeName="d" dur="3.5s" repeatCount="indefinite" values="M2,32 Q10,26 18,32 Q26,38 34,32 Q42,26 50,32;M2,32 Q10,38 18,32 Q26,26 34,32 Q42,38 50,32;M2,32 Q10,26 18,32 Q26,38 34,32 Q42,26 50,32"/></path>'
  ),
  swamp: () => sv(
    '<ellipse cx="30" cy="34" rx="18" ry="8" fill="#2a3a1a" opacity=".6"/>' +
    '<ellipse cx="30" cy="34" rx="12" ry="5" fill="#1a2a0a" opacity=".5"/>' +
    '<circle cx="22" cy="30" r="2" fill="#5a6a2a" opacity=".5"/>' +
    '<circle cx="36" cy="32" r="1.5" fill="#4a5a1a" opacity=".5"/>' +
    '<circle cx="28" cy="28" r="1" fill="#6a7a3a" opacity=".4"/>' +
    '<rect x="40" y="18" width="2" height="14" fill="#3a2a1a"/>' +
    '<path d="M38,18 Q41,14 44,18" fill="none" stroke="#3a2a1a" stroke-width="1.5"/>'
  ),
  hill: () => sv(
    '<ellipse cx="30" cy="36" rx="24" ry="12" fill="#6a6a34"/>' +
    '<ellipse cx="30" cy="34" rx="20" ry="10" fill="#7a7a44"/>' +
    '<ellipse cx="28" cy="33" rx="14" ry="7" fill="#8a8a50" opacity=".5"/>' +
    '<path d="M10,38 Q30,20 50,38" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>'
  ),
  volcano: () => sv(
    '<polygon points="30,8 48,40 12,40" fill="#5a2010"/>' +
    '<polygon points="30,8 42,40 18,40" fill="#6a2a14"/>' +
    '<ellipse cx="30" cy="14" rx="6" ry="3" fill="#e86020" opacity=".7"/>' +
    '<ellipse cx="30" cy="14" rx="4" ry="2" fill="#fc8030" opacity=".6"/>' +
    '<path d="M26,12 Q24,4 28,6" stroke="#f84" stroke-width="1.5" fill="none" opacity=".6"/>' +
    '<path d="M34,12 Q36,2 32,5" stroke="#fa6" stroke-width="1.5" fill="none" opacity=".5"/>' +
    '<path d="M30,11 Q30,3 31,6" stroke="#fc8" stroke-width="1" fill="none" opacity=".5"/>'
  ),
  ruins: () => sv(
    '<rect x="14" y="16" width="5" height="24" fill="#6a5a8a" rx="1"/>' +
    '<rect x="26" y="20" width="5" height="20" fill="#5a4a7a" rx="1"/>' +
    '<rect x="38" y="22" width="5" height="18" fill="#6a5a8a" rx="1" transform="rotate(8,40,40)"/>' +
    '<rect x="12" y="14" width="22" height="3" fill="#7a6a9a" rx="1"/>' +
    '<circle cx="17" cy="28" r="1.5" fill="#a87af5" opacity=".3"/>' +
    '<circle cx="29" cy="32" r="1" fill="#a87af5" opacity=".25"/>'
  ),
};
