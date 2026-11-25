// Bộ phát giai điệu piano & hộp nhạc dịu dàng chạy trực tiếp bằng Web Audio API
// Giúp người nhận luôn nghe được nhạc nền nhẹ nhàng ngay cả khi chưa thêm file MP3.

const NOTE_FREQ = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5,
};

// Bản 1: "Giai Điệu Dịu Dàng" - Piano ấm áp (32 giây, 8 nhịp x 4s)
const WARM_LETTER_EVENTS = [
  // Bar 1: Cmaj7 (0s - 4s)
  { t: 0.0, n: 'C3', d: 3.6, v: 0.34 }, { t: 0.5, n: 'G3', d: 2.8, v: 0.24 },
  { t: 1.0, n: 'E4', d: 2.4, v: 0.28 }, { t: 1.5, n: 'G4', d: 2.0, v: 0.34 },
  { t: 2.0, n: 'B4', d: 2.2, v: 0.36 }, { t: 3.0, n: 'A4', d: 1.4, v: 0.32 },
  { t: 3.5, n: 'G4', d: 1.2, v: 0.3 },

  // Bar 2: Am7 (4s - 8s)
  { t: 4.0, n: 'A3', d: 3.6, v: 0.34 }, { t: 4.5, n: 'E4', d: 2.8, v: 0.24 },
  { t: 5.0, n: 'G4', d: 2.4, v: 0.28 }, { t: 5.5, n: 'C5', d: 2.2, v: 0.38 },
  { t: 6.5, n: 'B4', d: 1.6, v: 0.34 }, { t: 7.25, n: 'A4', d: 1.5, v: 0.3 },

  // Bar 3: Fmaj7 (8s - 12s)
  { t: 8.0, n: 'F3', d: 3.6, v: 0.34 }, { t: 8.5, n: 'C4', d: 2.8, v: 0.24 },
  { t: 9.0, n: 'A4', d: 2.4, v: 0.36 }, { t: 10.0, n: 'G4', d: 1.8, v: 0.32 },
  { t: 10.75, n: 'E4', d: 1.6, v: 0.3 }, { t: 11.5, n: 'F4', d: 1.2, v: 0.32 },

  // Bar 4: G6 (12s - 16s)
  { t: 12.0, n: 'G3', d: 3.6, v: 0.34 }, { t: 12.5, n: 'D4', d: 2.8, v: 0.24 },
  { t: 13.0, n: 'G4', d: 2.5, v: 0.34 }, { t: 14.0, n: 'B4', d: 1.8, v: 0.34 },
  { t: 15.0, n: 'A4', d: 1.5, v: 0.3 },

  // Bar 5: Em7 (16s - 20s)
  { t: 16.0, n: 'E3', d: 3.6, v: 0.34 }, { t: 16.5, n: 'B3', d: 2.8, v: 0.24 },
  { t: 17.0, n: 'G4', d: 2.4, v: 0.34 }, { t: 17.75, n: 'B4', d: 2.0, v: 0.38 },
  { t: 18.5, n: 'D5', d: 2.0, v: 0.38 }, { t: 19.5, n: 'C5', d: 1.4, v: 0.32 },

  // Bar 6: Am9 (20s - 24s)
  { t: 20.0, n: 'A3', d: 3.6, v: 0.34 }, { t: 20.5, n: 'E4', d: 2.8, v: 0.24 },
  { t: 21.0, n: 'B4', d: 2.2, v: 0.36 }, { t: 22.0, n: 'C5', d: 2.0, v: 0.36 },
  { t: 23.0, n: 'G4', d: 1.8, v: 0.3 },

  // Bar 7: Dm7 (24s - 28s)
  { t: 24.0, n: 'D3', d: 3.6, v: 0.34 }, { t: 24.5, n: 'A3', d: 2.8, v: 0.24 },
  { t: 25.0, n: 'F4', d: 2.2, v: 0.32 }, { t: 25.75, n: 'A4', d: 2.0, v: 0.36 },
  { t: 26.5, n: 'G4', d: 1.8, v: 0.32 }, { t: 27.25, n: 'F4', d: 1.4, v: 0.3 },

  // Bar 8: Gsus4 -> G7 (28s - 32s)
  { t: 28.0, n: 'G3', d: 3.6, v: 0.34 }, { t: 28.5, n: 'D4', d: 2.6, v: 0.24 },
  { t: 29.0, n: 'C5', d: 1.8, v: 0.34 }, { t: 30.0, n: 'B4', d: 2.2, v: 0.34 },
  { t: 31.0, n: 'G4', d: 1.8, v: 0.28 },
];

// Bản 2: "Đêm Yên Bình" - Hộp nhạc trong trẻo (28 giây)
const MUSIC_BOX_EVENTS = [
  { t: 0.0, n: 'C5', d: 2.2, v: 0.32 }, { t: 0.7, n: 'E5', d: 2.0, v: 0.3 },
  { t: 1.4, n: 'G5', d: 2.2, v: 0.34 }, { t: 2.1, n: 'B5', d: 2.4, v: 0.28 },
  { t: 2.8, n: 'G5', d: 1.8, v: 0.26 },

  { t: 3.5, n: 'A4', d: 2.2, v: 0.32 }, { t: 4.2, n: 'C5', d: 2.0, v: 0.3 },
  { t: 4.9, n: 'E5', d: 2.2, v: 0.34 }, { t: 5.6, n: 'A5', d: 2.4, v: 0.3 },
  { t: 6.3, n: 'G5', d: 1.8, v: 0.28 },

  { t: 7.0, n: 'F4', d: 2.4, v: 0.32 }, { t: 7.7, n: 'A4', d: 2.0, v: 0.3 },
  { t: 8.4, n: 'C5', d: 2.2, v: 0.32 }, { t: 9.1, n: 'F5', d: 2.2, v: 0.3 },
  { t: 9.8, n: 'E5', d: 1.8, v: 0.28 },

  { t: 10.5, n: 'G4', d: 2.4, v: 0.32 }, { t: 11.2, n: 'B4', d: 2.0, v: 0.3 },
  { t: 11.9, n: 'D5', d: 2.4, v: 0.34 }, { t: 12.6, n: 'G5', d: 2.2, v: 0.3 },
  { t: 13.3, n: 'D5', d: 1.8, v: 0.26 },

  { t: 14.0, n: 'E4', d: 2.4, v: 0.3 }, { t: 14.7, n: 'G4', d: 2.0, v: 0.28 },
  { t: 15.4, n: 'B4', d: 2.2, v: 0.32 }, { t: 16.1, n: 'E5', d: 2.4, v: 0.34 },
  { t: 16.8, n: 'D5', d: 1.8, v: 0.28 },

  { t: 17.5, n: 'A4', d: 2.4, v: 0.32 }, { t: 18.2, n: 'E5', d: 2.0, v: 0.3 },
  { t: 18.9, n: 'A5', d: 2.2, v: 0.32 }, { t: 19.6, n: 'G5', d: 2.0, v: 0.3 },
  { t: 20.3, n: 'E5', d: 1.8, v: 0.28 },

  { t: 21.0, n: 'F4', d: 2.4, v: 0.32 }, { t: 21.7, n: 'C5', d: 2.0, v: 0.3 },
  { t: 22.4, n: 'A5', d: 2.2, v: 0.32 }, { t: 23.1, n: 'G5', d: 2.0, v: 0.3 },
  { t: 23.8, n: 'F5', d: 1.8, v: 0.28 },

  { t: 24.5, n: 'G4', d: 2.6, v: 0.32 }, { t: 25.2, n: 'D5', d: 2.2, v: 0.3 },
  { t: 25.9, n: 'G5', d: 2.2, v: 0.3 }, { t: 26.6, n: 'E5', d: 2.2, v: 0.28 },
];

const PRESETS = {
  'warm-letter': {
    duration: 32,
    events: WARM_LETTER_EVENTS,
    tone: 'piano',
  },
  'music-box': {
    duration: 28,
    events: MUSIC_BOX_EVENTS,
    tone: 'bell',
  },
};

export class RomanticSynthPlayer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.presetKey = 'warm-letter';
    this.volume = 0.65;
    this.isPlaying = false;
    this.position = 0;
    this.lastTickWall = 0;
    this.timerId = null;
    this.scheduledIndices = new Set();
    this.onEnded = null;
  }

  _ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Subtle warm delay for dreamy room ambiance
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.value = 0.32;

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 1400;

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.24;

      const wetGain = this.ctx.createGain();
      wetGain.gain.value = 0.28;

      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(wetGain);
      wetGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _playNote(freq, startTime, duration, velocity, tone) {
    if (!this.ctx || !this.masterGain || !freq) return;

    const now = Math.max(startTime, this.ctx.currentTime + 0.01);
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (tone === 'bell') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + duration);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      const g2 = this.ctx.createGain();
      g2.gain.value = 0.14;

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.42, now + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(g2);
      g2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } else {
      // Soft felt piano tone
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1650, now);
      filter.frequency.exponentialRampToValueAtTime(420, now + duration);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      const g2 = this.ctx.createGain();
      g2.gain.value = 0.18;

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.46, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(velocity * 0.16, now + duration * 0.55);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(g2);
      g2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.06);
      osc2.stop(now + duration + 0.06);
    }
  }

  setPreset(presetKey) {
    if (PRESETS[presetKey]) {
      this.presetKey = presetKey;
      this.position = 0;
      this.scheduledIndices.clear();
    }
  }

  getDuration() {
    return (PRESETS[this.presetKey] || PRESETS['warm-letter']).duration;
  }

  getCurrentTime() {
    if (!this.isPlaying) return this.position;
    const elapsed = (performance.now() - this.lastTickWall) / 1000;
    return Math.min(this.getDuration(), this.position + elapsed);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.03);
    }
  }

  seek(time) {
    const dur = this.getDuration();
    this.position = Math.max(0, Math.min(dur, time));
    this.lastTickWall = performance.now();
    this.scheduledIndices.clear();

    const preset = PRESETS[this.presetKey] || PRESETS['warm-letter'];
    preset.events.forEach((ev, idx) => {
      if (ev.t < this.position - 0.05) {
        this.scheduledIndices.add(idx);
      }
    });
  }

  play() {
    this._ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTickWall = performance.now();
    this._scheduleWindow();
    this.timerId = window.setInterval(() => this._tick(), 100);
  }

  pause() {
    if (!this.isPlaying) return;
    this.position = this.getCurrentTime();
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  _tick() {
    if (!this.isPlaying) return;
    const nowWall = performance.now();
    const dt = (nowWall - this.lastTickWall) / 1000;
    this.position += dt;
    this.lastTickWall = nowWall;

    const dur = this.getDuration();
    if (this.position >= dur) {
      this.position = 0;
      this.scheduledIndices.clear();
      if (typeof this.onEnded === 'function') {
        this.onEnded();
      }
    }

    if (this.isPlaying) {
      this._scheduleWindow();
    }
  }

  _scheduleWindow() {
    if (!this.ctx) return;
    const preset = PRESETS[this.presetKey] || PRESETS['warm-letter'];
    const lookAhead = 0.25;
    const windowEnd = this.position + lookAhead;

    preset.events.forEach((ev, idx) => {
      if (this.scheduledIndices.has(idx)) return;
      if (ev.t >= this.position - 0.05 && ev.t <= windowEnd) {
        this.scheduledIndices.add(idx);
        const offset = Math.max(0, ev.t - this.position);
        const freq = NOTE_FREQ[ev.n];
        this._playNote(freq, this.ctx.currentTime + offset, ev.d, ev.v, preset.tone);
      }
    });
  }

  destroy() {
    this.pause();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
