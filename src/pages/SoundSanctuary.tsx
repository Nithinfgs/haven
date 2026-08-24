import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, CloudRain, Waves, Radio, Moon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { soundEngine } from '../utils/audioSynth';

interface SoundTrack {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  defaultVolume: number;
}

const TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Gentle Rain on Glass',
    category: 'Nature',
    description: 'Rhythmic soft raindrops against a window pane.',
    icon: CloudRain,
    defaultVolume: 0.6,
  },
  {
    id: '432hz',
    name: '432Hz Calm Binaural Beat',
    category: 'Meditation',
    description: 'Harmonic sine frequency for deep mental focus and alpha wave balance.',
    icon: Radio,
    defaultVolume: 0.5,
  },
  {
    id: 'ocean',
    name: 'Deep Ocean Swell',
    category: 'Nature',
    description: 'Slow, rhythmic waves rolling against a peaceful shore.',
    icon: Waves,
    defaultVolume: 0.55,
  },
  {
    id: 'lofi',
    name: 'Warm Study Brown Noise',
    category: 'Focus',
    description: 'Deep low-frequency acoustic warmth that blocks background distractions.',
    icon: Moon,
    defaultVolume: 0.5,
  },
];

export const SoundSanctuary: React.FC = () => {
  const [activeSounds, setActiveSounds] = useState<{ [key: string]: boolean }>({});
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({
    rain: 0.6,
    '432hz': 0.5,
    ocean: 0.55,
    lofi: 0.5,
  });

  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);

  const toggleSound = (track: SoundTrack) => {
    const isPlaying = !!activeSounds[track.id];
    if (isPlaying) {
      soundEngine.stopSound(track.id);
      setActiveSounds((prev) => ({ ...prev, [track.id]: false }));
    } else {
      const vol = volumes[track.id] ?? track.defaultVolume;
      if (track.id === 'rain') soundEngine.startRain(vol);
      else if (track.id === '432hz') soundEngine.start432Hz(vol);
      else if (track.id === 'ocean') soundEngine.startOcean(vol);
      else if (track.id === 'lofi') soundEngine.startLoFi(vol);
      setActiveSounds((prev) => ({ ...prev, [track.id]: true }));
    }
  };

  const handleVolumeChange = (id: string, newVol: number) => {
    setVolumes((prev) => ({ ...prev, [id]: newVol }));
    soundEngine.setVolume(id, newVol);
  };

  const handleStopAll = () => {
    soundEngine.stopAll();
    setActiveSounds({});
    setTimerMinutes(null);
    setTimerSecondsLeft(null);
  };

  // Timer Countdown Logic
  useEffect(() => {
    let interval: any;
    if (timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      handleStopAll();
    }
    return () => clearInterval(interval);
  }, [timerSecondsLeft]);

  const setTimer = (mins: number) => {
    setTimerMinutes(mins);
    setTimerSecondsLeft(mins * 60);
  };

  const isAnyPlaying = Object.values(activeSounds).some(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Sanctuary</span>
        </Link>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-light text-brand-primary border border-brand-primary/20 text-[10.5px] font-extrabold uppercase tracking-wider">
          <Volume2 size={13} />
          <span>Ambient Audio Sanctuary</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-surface-main border border-border-primary rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            Soundscapes for Focus, Breath & Rest
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Multi-layered acoustic soundscapes generated dynamically in your browser. Mix rain, binaural frequencies, and ocean swells to block environmental noise and soothe nervous tension.
          </p>
        </div>

        {/* Master Control & Timer */}
        <div className="p-4 bg-surface-sec rounded-2xl border border-border-primary space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-text-secondary">Master Control</span>
            {isAnyPlaying && (
              <button
                type="button"
                onClick={handleStopAll}
                className="text-[10px] font-bold text-accent-rose hover:underline cursor-pointer"
              >
                Mute All
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTimer(mins)}
                className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                  timerMinutes === mins
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-surface-main text-text-secondary border-border-primary hover:bg-surface-sec'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {timerSecondsLeft !== null && timerSecondsLeft > 0 && (
            <div className="text-[10px] text-brand-primary font-mono font-bold flex items-center space-x-1">
              <Clock size={11} />
              <span>
                Timer: {Math.floor(timerSecondsLeft / 60)}:{(timerSecondsLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sound Mixer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRACKS.map((track) => {
          const isPlaying = !!activeSounds[track.id];
          const Icon = track.icon;
          const currentVol = volumes[track.id] ?? track.defaultVolume;

          return (
            <div
              key={track.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                isPlaying
                  ? 'bg-surface-main border-brand-primary/60 shadow-xs ring-1 ring-brand-primary/20'
                  : 'bg-surface-main border-border-primary shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isPlaying
                      ? 'bg-brand-light text-brand-primary border-brand-primary/30'
                      : 'bg-surface-sec text-text-muted border-border-primary'
                  }`}>
                    <Icon size={22} className={isPlaying ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-text-primary">{track.name}</h3>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {track.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSound(track)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary'
                  }`}
                  title={isPlaying ? 'Pause sound' : 'Play sound'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {track.description}
              </p>

              {/* Volume Slider */}
              <div className="space-y-1.5 pt-2 border-t border-border-primary/60">
                <div className="flex items-center justify-between text-[10.5px] font-bold text-text-secondary">
                  <span>Track Layer Volume</span>
                  <span className="font-mono text-brand-primary">{Math.round(currentVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={currentVol}
                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer h-1.5 bg-surface-sec rounded-lg"
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
