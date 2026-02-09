type AudioCtx = AudioContext & { webkitAudioContext?: typeof AudioContext };

class SFXManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: OscillatorNode | null = null;
  private _ambientLfo: OscillatorNode | null = null;
  private _ambientGain: GainNode | null = null;
  enabled = true;

  init() {
    try {
      const Ctx = window.AudioContext || (window as unknown as AudioCtx).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.4;
      this.master.connect(this.ctx.destination);
    } catch {
      this.enabled = false;
    }
  }

  ensure() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      if (this.ambient) { this.ambient.stop(); this.ambient = null; }
      if (this._ambientLfo) { this._ambientLfo.stop(); this._ambientLfo = null; }
      if (this._ambientGain) { this._ambientGain.disconnect(); this._ambientGain = null; }
    }
    if (this.enabled) this.ambientLoop();
    return this.enabled;
  }

  private _g(v?: number): GainNode {
    const g = this.ctx!.createGain();
    g.gain.value = v || 0.3;
    g.connect(this.master!);
    return g;
  }

  private _noise(dur: number): AudioBufferSourceNode {
    const sr = this.ctx!.sampleRate;
    const buf = this.ctx!.createBuffer(1, sr * dur, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const n = this.ctx!.createBufferSource();
    n.buffer = buf;
    return n;
  }

  swordHit() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.25);
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    const n = this._noise(0.15);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 2000; f.Q.value = 2;
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.15);
    const o = this.ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 120;
    o.connect(g); o.start(t); o.stop(t + 0.08);
  }

  arrowShot() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.2);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    const n = this._noise(0.25);
    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 3000;
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.25);
  }

  fireball() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.3);
    g.gain.setValueAtTime(0.01, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(100, t);
    o.frequency.exponentialRampToValueAtTime(400, t + 0.15);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.5);
    o.connect(g); o.start(t); o.stop(t + 0.5);
    const n = this._noise(0.4);
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 800;
    const ng = this._g(0.15);
    ng.gain.setValueAtTime(0.01, t + 0.1);
    ng.gain.linearRampToValueAtTime(0.15, t + 0.2);
    ng.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    n.connect(f); f.connect(ng); n.start(t + 0.1); n.stop(t + 0.5);
  }

  iceCrack() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const g = this._g(0.15);
      g.gain.setValueAtTime(0.15, t + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.05);
      const o = this.ctx.createOscillator();
      o.type = 'square'; o.frequency.value = 3000 + Math.random() * 2000;
      o.connect(g); o.start(t + i * 0.06); o.stop(t + i * 0.06 + 0.05);
    }
    const sg = this._g(0.1);
    sg.gain.setValueAtTime(0.1, t + 0.2);
    sg.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    const o2 = this.ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = 6000;
    o2.connect(sg); o2.start(t + 0.2); o2.stop(t + 0.6);
  }

  shadowHum() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.15);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    const o1 = this.ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = 80;
    o1.connect(g); o1.start(t); o1.stop(t + 0.6);
    const o2 = this.ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = 83;
    o2.connect(g); o2.start(t); o2.stop(t + 0.6);
  }

  healChime() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784].forEach((f, i) => {
      const g = this._g(0.12);
      g.gain.setValueAtTime(0.12, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.12 + 0.4);
      const o = this.ctx!.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.4);
    });
  }

  arcanePulse() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.2);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    const o = this.ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 300;
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine'; lfo.frequency.value = 15;
    const lg = this.ctx.createGain(); lg.gain.value = 100;
    lfo.connect(lg); lg.connect(o.frequency);
    o.connect(g); o.start(t); o.stop(t + 0.4);
    lfo.start(t); lfo.stop(t + 0.4);
  }

  cardPlay() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.15);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    const n = this._noise(0.08);
    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 4000;
    n.connect(f); f.connect(g); n.start(t); n.stop(t + 0.08);
  }

  uiClick() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.08);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    const o = this.ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 800;
    o.connect(g); o.start(t); o.stop(t + 0.04);
  }

  phaseChange() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    [440, 554].forEach((f, i) => {
      const g = this._g(0.1);
      g.gain.setValueAtTime(0.1, t + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.2);
      const o = this.ctx!.createOscillator();
      o.type = 'triangle'; o.frequency.value = f;
      o.connect(g); o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.2);
    });
  }

  deathSound() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this._g(0.2);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.4);
    o.connect(g); o.start(t); o.stop(t + 0.4);
    const ng = this._g(0.1);
    ng.gain.setValueAtTime(0.1, t + 0.1);
    ng.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    const n = this._noise(0.3);
    n.connect(ng); n.start(t + 0.1); n.stop(t + 0.4);
  }

  victory() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      const g = this._g(0.2);
      g.gain.setValueAtTime(0.2, t + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.18 + 0.5);
      const o = this.ctx!.createOscillator();
      o.type = 'triangle'; o.frequency.value = f;
      o.connect(g); o.start(t + i * 0.18); o.stop(t + i * 0.18 + 0.5);
    });
  }

  defeat() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    [400, 350, 300, 200].forEach((f, i) => {
      const g = this._g(0.15);
      g.gain.setValueAtTime(0.15, t + i * 0.2);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.5);
      const o = this.ctx!.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); o.start(t + i * 0.2); o.stop(t + i * 0.2 + 0.5);
    });
  }

  levelUp() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    [600, 750, 900, 1200].forEach((f, i) => {
      const g = this._g(0.15);
      g.gain.setValueAtTime(0.15, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.3);
      const o = this.ctx!.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.3);
    });
  }

  ambientLoop() {
    if (!this.enabled || !this.ctx || this.ambient) return;
    const o = this.ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 55;
    const g = this.ctx.createGain(); g.gain.value = 0.04;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 200;
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine'; lfo.frequency.value = 0.1;
    const lg = this.ctx.createGain(); lg.gain.value = 30;
    lfo.connect(lg); lg.connect(f.frequency);
    o.connect(f); f.connect(g); g.connect(this.master!);
    o.start(); lfo.start();
    this.ambient = o;
    this._ambientLfo = lfo;
    this._ambientGain = g;
  }

  play(name: string) {
    this.ensure();
    const methods: Record<string, () => void> = {
      swordHit: () => this.swordHit(),
      arrowShot: () => this.arrowShot(),
      fireball: () => this.fireball(),
      iceCrack: () => this.iceCrack(),
      shadowHum: () => this.shadowHum(),
      healChime: () => this.healChime(),
      arcanePulse: () => this.arcanePulse(),
      cardPlay: () => this.cardPlay(),
      uiClick: () => this.uiClick(),
      phaseChange: () => this.phaseChange(),
      deathSound: () => this.deathSound(),
      victory: () => this.victory(),
      defeat: () => this.defeat(),
      levelUp: () => this.levelUp(),
    };
    methods[name]?.();
  }
}

export const sfx = new SFXManager();
