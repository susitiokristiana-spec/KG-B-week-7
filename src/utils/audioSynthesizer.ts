// Web Audio Synthesizer for Children's Animal Sounds & Feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play UI Click Bubble
export function playClickBubble(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (err) {
    console.warn('Audio error:', err);
  }
}

// Play Star Twinkle
export function playStarTwinkle(): void {
  try {
    const ctx = getAudioContext();
    const notes = [880, 1108, 1320, 1760];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  } catch (err) {
    console.warn('Audio error:', err);
  }
}

// Play Success Fanfare
export function playSuccessFanfare(): void {
  try {
    const ctx = getAudioContext();
    const chords = [
      { freq: 523.25, time: 0.0, dur: 0.18 }, // C5
      { freq: 659.25, time: 0.15, dur: 0.18 }, // E5
      { freq: 783.99, time: 0.3, dur: 0.22 }, // G5
      { freq: 1046.50, time: 0.48, dur: 0.6 }, // C6
    ];

    chords.forEach(({ freq, time, dur }) => {
      const now = ctx.currentTime + time;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc2.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + dur + 0.05);
      osc2.stop(now + dur + 0.05);
    });
  } catch (err) {
    console.warn('Audio error:', err);
  }
}

// Gentle, encouraging feedback when guessing incorrectly (not harsh!)
export function playEncouragingSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle cheerful wobble (e.g. 380Hz -> 320Hz -> 350Hz)
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(290, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.28);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (err) {
    console.warn('Audio error:', err);
  }
}

// Individual Animal Sound Synthesizers
export function playAnimalSound(animalId: string): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (animalId) {
      case 'kucing': {
        // "Meoowww"
        const osc = ctx.createOscillator();
        const formant = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        // Pitch envelope: starts 480Hz -> climbs to 780Hz -> gently drops to 520Hz
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.linearRampToValueAtTime(740, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.95);

        // Formant vowel filter for "m-e-o-w"
        formant.type = 'bandpass';
        formant.frequency.setValueAtTime(700, now);
        formant.frequency.linearRampToValueAtTime(1400, now + 0.35);
        formant.frequency.linearRampToValueAtTime(600, now + 0.95);
        formant.Q.setValueAtTime(3.5, now);

        // Amplitude envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.15);
        gain.gain.setValueAtTime(0.22, now + 0.55);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc.connect(formant);
        formant.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.05);
        break;
      }

      case 'anjing': {
        // "Guk! Guk! Guk!" (3 energetic barks)
        [0, 0.22, 0.46].forEach((offset) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(340, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.14);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(750, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.18);
        });
        break;
      }

      case 'sapi': {
        // "Mooooo"
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc2.type = 'triangle';

        // Base frequency 115Hz with slight drop
        osc.frequency.setValueAtTime(125, now);
        osc.frequency.linearRampToValueAtTime(110, now + 1.4);
        osc2.frequency.setValueAtTime(125.5, now);
        osc2.frequency.linearRampToValueAtTime(109.5, now + 1.4);

        // Vocal vibrato
        lfo.frequency.setValueAtTime(4.5, now);
        lfoGain.gain.setValueAtTime(4, now);
        lfo.connect(osc.frequency);
        lfo.connect(osc2.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, now);
        filter.frequency.linearRampToValueAtTime(260, now + 1.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.25);
        gain.gain.setValueAtTime(0.32, now + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        osc2.start(now);
        lfo.stop(now + 1.55);
        osc.stop(now + 1.55);
        osc2.stop(now + 1.55);
        break;
      }

      case 'ayam-jago': {
        // "Ku-ku-ru-yuuuk!"
        const notes = [
          { freq: 392, dur: 0.14, start: 0.0 }, // Ku
          { freq: 440, dur: 0.15, start: 0.16 }, // ku
          { freq: 523, dur: 0.18, start: 0.33 }, // ru
          { freq: 659, dur: 0.75, start: 0.53, endFreq: 540 }, // yuuuk
        ];

        notes.forEach(({ freq, dur, start, endFreq }) => {
          const t = now + start;
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);
          if (endFreq) {
            osc.frequency.linearRampToValueAtTime(endFreq, t + dur);
          }

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1100, t);
          filter.Q.setValueAtTime(2.5, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.28, t + 0.03);
          gain.gain.setValueAtTime(0.25, t + dur * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + dur + 0.02);
        });
        break;
      }

      case 'ayam-betina': {
        // "Petok... petok... petooook!"
        const clucks = [
          { freq: 380, time: 0.0, dur: 0.1 },
          { freq: 420, time: 0.15, dur: 0.1 },
          { freq: 360, time: 0.32, dur: 0.12 },
          { freq: 440, time: 0.48, dur: 0.3, glide: 320 },
        ];

        clucks.forEach(({ freq, time, dur, glide }) => {
          const t = now + time;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          if (glide) {
            osc.frequency.exponentialRampToValueAtTime(glide, t + dur);
          }

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.24, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + dur + 0.02);
        });
        break;
      }

      case 'bebek': {
        // "Kwek! Kwek! Kwek!"
        [0.0, 0.24, 0.5].forEach((offset) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, t);
          osc.frequency.linearRampToValueAtTime(260, t + 0.18);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(950, t);
          filter.Q.setValueAtTime(4.5, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.2);
        });
        break;
      }

      case 'kambing': {
        // "Mbeeek~ Mbeeek~" with characteristic throat tremolo
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(320, now + 1.1);

        // Fast goat flutter tremolo (11.5 Hz)
        lfo.frequency.setValueAtTime(11.5, now);
        lfoGain.gain.setValueAtTime(25, now);
        lfo.connect(osc.frequency);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gain.gain.setValueAtTime(0.28, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 1.2);
        osc.stop(now + 1.2);
        break;
      }

      case 'kuda': {
        // "Hiii-ha-ha-ha!" whinny
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        // Pitch rises fast then shakes
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.linearRampToValueAtTime(980, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(450, now + 1.2);

        lfo.frequency.setValueAtTime(14, now);
        lfoGain.gain.setValueAtTime(40, now);
        lfo.connect(osc.frequency);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
        gain.gain.setValueAtTime(0.22, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 1.3);
        osc.stop(now + 1.3);
        break;
      }

      case 'kelinci': {
        // "Cute hop boing & munch crunch"
        // Munch 1, 2, 3 + boing
        [0.0, 0.14, 0.28].forEach((offset) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(700, t);
          osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);

          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.1);
        });

        // Soft cute bounce boing
        const tBoing = now + 0.45;
        const boingOsc = ctx.createOscillator();
        const boingGain = ctx.createGain();
        boingOsc.type = 'sine';
        boingOsc.frequency.setValueAtTime(320, tBoing);
        boingOsc.frequency.exponentialRampToValueAtTime(720, tBoing + 0.25);

        boingGain.gain.setValueAtTime(0.2, tBoing);
        boingGain.gain.exponentialRampToValueAtTime(0.001, tBoing + 0.35);

        boingOsc.connect(boingGain);
        boingGain.connect(ctx.destination);
        boingOsc.start(tBoing);
        boingOsc.stop(tBoing + 0.38);
        break;
      }

      case 'domba': {
        // "Baa-aaa~"
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(220, now + 1.2);

        // Fluffy woolly vibrato (8.5 Hz)
        lfo.frequency.setValueAtTime(8.5, now);
        lfoGain.gain.setValueAtTime(14, now);
        lfo.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.setValueAtTime(0.25, now + 0.9);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 1.3);
        osc.stop(now + 1.3);
        break;
      }

      case 'burung': {
        // "Cuit cuit cuit~"
        const chirps = [
          { start: 0.0, f1: 2400, f2: 3100, f3: 2600 },
          { start: 0.18, f1: 2600, f2: 3300, f3: 2700 },
          { start: 0.36, f1: 2500, f2: 3400, f3: 2800 },
        ];

        chirps.forEach(({ start, f1, f2, f3 }) => {
          const t = now + start;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f1, t);
          osc.frequency.linearRampToValueAtTime(f2, t + 0.06);
          osc.frequency.linearRampToValueAtTime(f3, t + 0.12);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.14);
        });
        break;
      }

      default:
        playClickBubble();
    }
  } catch (err) {
    console.warn('Animal audio error:', err);
  }
}

// Indonesian Web Speech Synthesis Helper with warm maternal preschool teacher cadence
export function speakIndonesian(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.92; // Slightly measured and clear for young ears
    utterance.pitch = 1.2; // Friendly and cheerful

    // Attempt to pick an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

// Stop any current speech
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
