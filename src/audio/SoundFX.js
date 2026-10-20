/**
 * SoundFX.js - Procedural Web Audio API sound & music engine for TRIBOS
 * Zero external MP3 dependencies, instant low-latency audio for hits, slashes, whooshes, and BGM!
 */
export class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAudio() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmPlaying = false;
    } else if (this.enabled && !this.bgmPlaying) {
      this.startBattleBGM();
    }
    return this.enabled;
  }

  // Heavy Melee Hit / Impact
  playHit(isHeavy = false) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Punch oscillator (fast pitch drop)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isHeavy ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isHeavy ? 180 : 260, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + (isHeavy ? 0.22 : 0.12));

    gain.gain.setValueAtTime(isHeavy ? 0.7 : 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (isHeavy ? 0.22 : 0.12));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + (isHeavy ? 0.25 : 0.15));

    // Noise burst for crunch
    this.playNoiseBurst(isHeavy ? 0.15 : 0.08, isHeavy ? 0.5 : 0.25, 400);
  }

  // Blade Slash / Scepter Swing
  playSlash() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.14);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    this.playNoiseBurst(0.12, 0.2, 1200);
  }

  // Ruach Dash Whoosh (Chakra Dash)
  playDash() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  // Kawarimi / Substitution Jutsu (poof + chime)
  playSubstitution() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Chime
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.3, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.35);
    });

    this.playNoiseBurst(0.2, 0.35, 1800);
  }

  // Ruach Charge Hum
  playCharge(active = true) {
    if (!this.enabled || !this.ctx) return;
    if (active) {
      if (this.chargeOsc) return;
      const now = this.ctx.currentTime;
      this.chargeOsc = this.ctx.createOscillator();
      this.chargeGain = this.ctx.createGain();

      this.chargeOsc.type = 'triangle';
      this.chargeOsc.frequency.setValueAtTime(110, now);
      this.chargeOsc.frequency.linearRampToValueAtTime(220, now + 1.2);

      this.chargeGain.gain.setValueAtTime(0.01, now);
      this.chargeGain.gain.linearRampToValueAtTime(0.25, now + 0.3);

      this.chargeOsc.connect(this.chargeGain);
      this.chargeGain.connect(this.ctx.destination);
      this.chargeOsc.start(now);
    } else {
      if (this.chargeOsc) {
        const now = this.ctx.currentTime;
        this.chargeGain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        this.chargeOsc.stop(now + 0.12);
        this.chargeOsc = null;
        this.chargeGain = null;
      }
    }
  }

  // Projectile Shot (Lion Roar / Energy Blast)
  playShoot() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Ultimate Jutsu Activation (Epic brass fanfare chord + explosion)
  playUltimate() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    const chords = [220, 277.18, 329.63, 440]; // A major triumphant chord
    chords.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
    });

    this.playNoiseBurst(0.6, 0.6, 500);
  }

  // Awakening Mode Fanfare
  playAwakening() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [329.63, 415.30, 493.88, 659.25].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.3, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  // Helper: Filtered noise burst
  playNoiseBurst(duration, volume, filterFreq) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Epic Middle-Eastern / Anime Battle BGM (Dynamic procedural sequencer)
  startBattleBGM() {
    if (!this.enabled || !this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.step = 0;

    // Hijaz / Phrygian Dominant scale: D, Eb, F#, G, A, Bb, C
    const bassline = [146.83, 146.83, 155.56, 146.83, 185.00, 196.00, 155.56, 146.83];
    const melody = [293.66, 311.13, 369.99, 392.00, 440.00, 369.99, 311.13, 293.66];

    this.bgmTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const beat = this.step % 8;

      // 1. Kick / Taiko drum on beats 0, 2, 4, 6
      if (beat === 0 || beat === 4 || beat === 2 || beat === 6) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(110, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        kickGain.gain.setValueAtTime(0.35, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.18);
      }

      // 2. Tribal percussion snare / rim on beats 2, 6
      if (beat === 2 || beat === 6) {
        this.playNoiseBurst(0.07, 0.18, 1400);
      }

      // 3. Bass synth
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassline[beat] / 2, now);
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.2);

      // 4. Melodic lead every 2 beats
      if (beat % 2 === 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(melody[(this.step / 2) % melody.length], now);
        leadGain.gain.setValueAtTime(0.14, now);
        leadGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        leadOsc.connect(leadGain);
        leadGain.connect(this.ctx.destination);
        leadOsc.start(now);
        leadOsc.stop(now + 0.38);
      }

      this.step++;
    }, 180); // ~166 BPM battle tempo
  }
}
