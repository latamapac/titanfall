export class AnimationManager {
  private layerRef: HTMLElement | null = null;
  private boardRef: HTMLElement | null = null;

  setRefs(layer: HTMLElement | null, board: HTMLElement | null) {
    this.layerRef = layer;
    this.boardRef = board;
  }

  clear() {
    if (this.layerRef) this.layerRef.innerHTML = '';
  }

  private cellCenter(r: number, c: number): { x: number; y: number } {
    if (!this.boardRef) return { x: 0, y: 0 };
    const cell = this.boardRef.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`) as HTMLElement | null;
    if (!cell) return { x: 0, y: 0 };
    const br = this.boardRef.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    return { x: cr.left - br.left + cr.width / 2, y: cr.top - br.top + cr.height / 2 };
  }

  private spawn(cls: string, x: number, y: number, extra?: Partial<CSSStyleDeclaration>): HTMLElement {
    const el = document.createElement('div');
    el.className = 'anim-el ' + cls;
    el.style.left = (x - 20) + 'px';
    el.style.top = (y - 20) + 'px';
    if (extra) Object.assign(el.style, extra);
    if (this.layerRef) this.layerRef.appendChild(el);
    return el;
  }

  meleeSlash(r: number, c: number) {
    const { x, y } = this.cellCenter(r, c);
    const el = this.spawn('anim-slash', x, y);
    el.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M8 32 L20 8 L24 12 L12 36Z" fill="#fff" opacity=".8"/><path d="M12 30 L28 6 L32 10 L16 34Z" fill="#ffa" opacity=".6"/></svg>';
    setTimeout(() => el.remove(), 360);
  }

  rangedProjectile(fr: number, fc: number, tr: number, tc: number, color?: string): number {
    const from = this.cellCenter(fr, fc);
    const to = this.cellCenter(tr, tc);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dur = Math.max(200, Math.min(500, dist * 2));
    const el = document.createElement('div');
    el.className = 'anim-el anim-proj';
    el.style.left = from.x - 5 + 'px';
    el.style.top = from.y - 5 + 'px';
    el.style.background = color || '#ff0';
    el.style.boxShadow = '0 0 6px ' + (color || '#ff0');
    el.style.setProperty('--sx', '0px');
    el.style.setProperty('--sy', '0px');
    el.style.setProperty('--ex', dx + 'px');
    el.style.setProperty('--ey', dy + 'px');
    el.style.setProperty('--dur', dur + 'ms');
    if (this.layerRef) this.layerRef.appendChild(el);
    setTimeout(() => el.remove(), dur + 50);
    return dur;
  }

  spellBurst(r: number, c: number, color: string) {
    const { x, y } = this.cellCenter(r, c);
    const el = this.spawn('anim-burst', x, y, {
      background: 'radial-gradient(circle,' + color + ' 0%,transparent 70%)',
    });
    setTimeout(() => el.remove(), 460);
  }

  deathShatter(r: number, c: number) {
    const { x, y } = this.cellCenter(r, c);
    const colors = ['#f88', '#fa8', '#ff8', '#aaa', '#888'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('div');
      el.className = 'anim-el anim-death';
      el.style.left = (x - 15 + Math.random() * 10) + 'px';
      el.style.top = (y - 15 + Math.random() * 10) + 'px';
      el.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      el.style.setProperty('--dy', (-10 - Math.random() * 30) + 'px');
      el.style.background = '#' + colors[i].slice(1);
      el.style.width = '6px';
      el.style.height = '6px';
      if (this.layerRef) this.layerRef.appendChild(el);
      setTimeout(() => el.remove(), 420);
    }
  }

  healRise(r: number, c: number) {
    const { x, y } = this.cellCenter(r, c);
    for (let i = 0; i < 4; i++) {
      const el = document.createElement('div');
      el.className = 'anim-el anim-heal';
      el.style.left = (x - 4 + Math.random() * 16 - 8) + 'px';
      el.style.top = (y + 5) + 'px';
      el.style.animationDelay = (i * 0.1) + 's';
      if (this.layerRef) this.layerRef.appendChild(el);
      setTimeout(() => el.remove(), 700);
    }
  }

  aoeFlash(color?: string) {
    const el = document.createElement('div');
    el.className = 'anim-el anim-aoe';
    el.style.background = color || 'rgba(255,100,50,.3)';
    if (this.layerRef) this.layerRef.appendChild(el);
    setTimeout(() => el.remove(), 320);
  }

  dispatch(type: string, ...args: unknown[]) {
    switch (type) {
      case 'meleeSlash': this.meleeSlash(args[0] as number, args[1] as number); break;
      case 'rangedProjectile': this.rangedProjectile(args[0] as number, args[1] as number, args[2] as number, args[3] as number, args[4] as string | undefined); break;
      case 'spellBurst': this.spellBurst(args[0] as number, args[1] as number, args[2] as string); break;
      case 'deathShatter': this.deathShatter(args[0] as number, args[1] as number); break;
      case 'healRise': this.healRise(args[0] as number, args[1] as number); break;
      case 'aoeFlash': this.aoeFlash(args[0] as string | undefined); break;
    }
  }
}

export const anim = new AnimationManager();
