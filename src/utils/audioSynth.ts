// Pure Web Audio API Generative Soundscape Engine (Zero external MP3 dependencies, 100% offline)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: { [key: string]: { gain: GainNode; sources: AudioNode[] } } = {};

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Rain Generator (Filtered White Noise with modulation)
  public startRain(volume: number) {
    this.initCtx();
    if (!this.ctx) return;
    this.stopSound('rain');

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low pass filter for rain timbre
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.nodes['rain'] = { gain: gainNode, sources: [whiteNoise, filter] };
  }

  // 2. 432Hz Calm Tone (Binaural sine wave for focus/calm)
  public start432Hz(volume: number) {
    this.initCtx();
    if (!this.ctx) return;
    this.stopSound('432hz');

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 432; // Root calm frequency
    osc2.frequency.value = 436; // 4Hz Alpha beat

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume * 0.4;

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    this.nodes['432hz'] = { gain: gainNode, sources: [osc1, osc2] };
  }

  // 3. Ocean Waves (Modulated Pink Noise)
  public startOcean(volume: number) {
    this.initCtx();
    if (!this.ctx) return;
    this.stopSound('ocean');

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = b0 + b1 + b2;
    }

    const oceanNoise = this.ctx.createBufferSource();
    oceanNoise.buffer = noiseBuffer;
    oceanNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // LFO for wave surging
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // Wave cycle every 8 seconds
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume * 0.7;

    oceanNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oceanNoise.start();
    lfo.start();
    this.nodes['ocean'] = { gain: gainNode, sources: [oceanNoise, filter, lfo, lfoGain] };
  }

  // 4. Lo-Fi Warm Study Hum (Brownian deep noise)
  public startLoFi(volume: number) {
    this.initCtx();
    if (!this.ctx) return;
    this.stopSound('lofi');

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume * 0.8;

    noiseSource.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noiseSource.start();
    this.nodes['lofi'] = { gain: gainNode, sources: [noiseSource] };
  }

  public setVolume(id: string, volume: number) {
    if (this.nodes[id]) {
      this.nodes[id].gain.gain.value = volume;
    }
  }

  public stopSound(id: string) {
    if (this.nodes[id]) {
      this.nodes[id].sources.forEach((s: any) => {
        try {
          if (s.stop) s.stop();
          if (s.disconnect) s.disconnect();
        } catch {}
      });
      delete this.nodes[id];
    }
  }

  public stopAll() {
    Object.keys(this.nodes).forEach((k) => this.stopSound(k));
  }
}

export const soundEngine = new SoundEngine();
