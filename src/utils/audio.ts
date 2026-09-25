// Audio utility for Arabic Speech Synthesis, Dual-Engine Cloud/Local TTS, and Web Audio Effects

export type TtsEngineMode = 'auto' | 'cloud' | 'local';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private ttsMode: TtsEngineMode = 'auto';
  private audioCache = new Map<string, string>(); // text -> blob or url
  private speakingListeners = new Set<(isSpeaking: boolean, text: string) => void>();
  private unlocked = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Auto-unlock audio context and HTMLAudio on first user gesture
      const unlock = () => {
        if (this.unlocked) return;
        this.unlocked = true;
        this.initCtx();
        // Warm up speech synthesis if available
        if (window.speechSynthesis) {
          try {
            window.speechSynthesis.resume();
            this.loadVoices();
          } catch (e) {}
        }
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
      };

      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });

      // Cache voices when loaded
      if (window.speechSynthesis) {
        this.loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            this.loadVoices();
          };
        }
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        this.voices = window.speechSynthesis.getVoices();
      } catch (e) {}
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getTtsMode(): TtsEngineMode {
    return this.ttsMode;
  }

  public setTtsMode(mode: TtsEngineMode) {
    this.ttsMode = mode;
  }

  public hasNativeArabicVoice(): boolean {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices.some((v) =>
      v.lang.toLowerCase().startsWith('ar') ||
      v.lang.toLowerCase().includes('ar-') ||
      v.name.toLowerCase().includes('arabic') ||
      v.name.includes('عربي') ||
      v.name.includes('Maged') ||
      v.name.includes('Tarik') ||
      v.name.includes('Laila')
    );
  }

  public getArabicVoicesList(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices.filter((v) =>
      v.lang.toLowerCase().startsWith('ar') ||
      v.lang.toLowerCase().includes('ar-') ||
      v.name.toLowerCase().includes('arabic') ||
      v.name.includes('عربي')
    );
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setIsMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
  }

  public subscribeSpeaking(listener: (isSpeaking: boolean, text: string) => void): () => void {
    this.speakingListeners.add(listener);
    return () => this.speakingListeners.delete(listener);
  }

  private notifySpeaking(isSpeaking: boolean, text: string = '') {
    this.speakingListeners.forEach((fn) => {
      try {
        fn(isSpeaking, text);
      } catch (e) {}
    });
  }

  // Play synthetic correct sound
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

      osc2.frequency.setValueAtTime(1046.5, now + 0.1); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {}
  }

  // Play synthetic error sound
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Play subtle UI click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Unified audio dispatcher
  public play(type: 'click' | 'correct' | 'wrong' | 'fanfare' | 'star' | 'celebration' | 'success') {
    if (type === 'click') this.playClick();
    else if (type === 'correct' || type === 'success') this.playCorrect();
    else if (type === 'wrong') this.playWrong();
    else if (type === 'fanfare' || type === 'celebration' || type === 'star') this.playFanfare();
    else this.playClick();
  }

  // Play victory fanfare
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = this.ctx!.currentTime + idx * 0.12;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  // Stop any ongoing speech or audio
  public stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      this.currentUtterance = null;
    }

    this.notifySpeaking(false, '');
  }

  /**
   * Speak Arabic text with full Tashkeel and natural inflection.
   * Uses dual-engine architecture:
   * 1. Studio-quality Cloud Arabic Audio (/api/tts or Google TTS) - works on 100% of devices regardless of OS language packs
   * 2. Browser Web Speech API fallback when requested or if offline
   */
  public async speakArabic(text: string, rate: number = 0.85): Promise<void> {
    if (this.isMuted) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    this.stopSpeaking();
    this.initCtx();
    this.notifySpeaking(true, cleanText);

    // If user explicitly chose local Web Speech and device has an Arabic voice
    if (this.ttsMode === 'local' && this.hasNativeArabicVoice()) {
      return this.speakWithWebSpeech(cleanText, rate);
    }

    // Default to high quality Cloud TTS with fallback
    try {
      await this.speakWithCloudAudio(cleanText, rate);
    } catch (err) {
      console.warn('Cloud audio playback failed, falling back to Web Speech:', err);
      try {
        await this.speakWithWebSpeech(cleanText, rate);
      } catch (speechErr) {
        console.error('All speech synthesis methods failed:', speechErr);
      }
    } finally {
      this.notifySpeaking(false, '');
    }
  }

  /**
   * Speaks via HTMLAudioElement using /api/tts proxy, or direct Google TTS
   */
  private speakWithCloudAudio(cleanText: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve, reject) => {
      // Primary source: Local backend proxy with cache
      const primaryUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      // Secondary fallback source: Direct Google Translate TTS endpoint
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

      const clampedRate = Math.max(0.4, Math.min(1.5, rate));
      const audio = new Audio();
      this.currentAudio = audio;
      
      const enforceRate = () => {
        try {
          audio.playbackRate = clampedRate;
          audio.defaultPlaybackRate = clampedRate;
        } catch (e) {}
      };

      audio.defaultPlaybackRate = clampedRate;
      audio.playbackRate = clampedRate;
      audio.addEventListener('loadedmetadata', enforceRate);
      audio.addEventListener('play', enforceRate);
      audio.addEventListener('canplay', enforceRate);

      let hasFallenBack = false;

      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        resolve();
      };

      audio.onerror = () => {
        if (!hasFallenBack) {
          hasFallenBack = true;
          // Try fallback direct URL
          audio.src = fallbackUrl;
          audio.load();
          enforceRate();
          audio.play().catch((playErr) => {
            if (this.currentAudio === audio) this.currentAudio = null;
            reject(playErr);
          });
        } else {
          if (this.currentAudio === audio) this.currentAudio = null;
          reject(new Error('Audio playback failed on both primary and fallback sources'));
        }
      };

      audio.src = primaryUrl;
      audio.load();
      enforceRate();
      audio.play().catch((playErr) => {
        // If play() was blocked or failed, attempt direct URL
        if (!hasFallenBack) {
          hasFallenBack = true;
          audio.src = fallbackUrl;
          audio.load();
          enforceRate();
          audio.play().catch(reject);
        } else {
          reject(playErr);
        }
      });
    });
  }

  /**
   * Speaks Arabic text repeatedly with an intentional pause between repetitions,
   * ideal for articulation training (Listen & Repeat).
   */
  public async speakRepeatedly(
    text: string, 
    rate: number = 0.85, 
    times: number = 2, 
    delayMs: number = 750,
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    for (let i = 0; i < times; i++) {
      if (this.isMuted) break;
      if (onProgress) onProgress(i + 1, times);
      await this.speakArabic(text, rate);
      if (i < times - 1) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  /**
   * Speaks each syllable sequentially with visual highlight callbacks.
   */
  public async speakSyllablesSequentially(
    syllables: string[],
    rate: number = 0.7,
    onSyllableChange?: (index: number) => void,
    gapMs: number = 350
  ): Promise<void> {
    for (let i = 0; i < syllables.length; i++) {
      if (this.isMuted) break;
      if (onSyllableChange) onSyllableChange(i);
      await this.speakArabic(syllables[i], rate);
      if (i < syllables.length - 1) {
        await new Promise((res) => setTimeout(res, gapMs));
      }
    }
    if (onSyllableChange) onSyllableChange(-1);
  }

  /**
   * Speaks via Browser Web Speech API (SpeechSynthesis)
   */
  public speakWithWebSpeech(cleanText: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {}

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      utterance.pitch = 1.05;

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      // Try finding an authentic Arabic voice
      const arVoice = this.voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ar') ||
          v.lang.toLowerCase().includes('ar-') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.includes('عربي') ||
          v.name.includes('Maged') ||
          v.name.includes('Tarik') ||
          v.name.includes('Laila')
      );

      if (arVoice) {
        utterance.voice = arVoice;
      }

      this.currentUtterance = utterance;

      utterance.onend = () => {
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
        resolve();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  }

  // Text-To-Speech with word-by-word highlight callback and synchronized pacing
  public speakArabicWithWordHighlight(
    text: string,
    words: string[],
    rate: number = 0.8,
    onWordChange: (wordIndex: number, word: string) => void,
    onEnd: () => void
  ): { cancel: () => void; pause: () => void; resume: () => void } {
    let cancelled = false;
    let timerId: any = null;
    let boundaryFired = false;
    let isPaused = false;

    if (this.isMuted || typeof window === 'undefined') {
      setTimeout(() => onEnd(), 300);
      return { cancel: () => {}, pause: () => {}, resume: () => {} };
    }

    this.stopSpeaking();

    const cleanText = text.trim();
    if (!cleanText || words.length === 0) {
      onEnd();
      return { cancel: () => {}, pause: () => {}, resume: () => {} };
    }

    this.notifySpeaking(true, cleanText);

    // Initial highlight on first word
    onWordChange(0, words[0]);

    // Calculate word durations weighted by word character count and punctuation
    const wordDurations = words.map((w) => {
      const length = w.length;
      const baseMs = 360;
      const charMs = 45;
      let duration = (baseMs + length * charMs) / rate;
      if (/[.!?،؛:?]/.test(w)) {
        duration += 240 / rate;
      }
      return duration;
    });

    let currentWordIdx = 0;
    const scheduleNextWord = () => {
      if (cancelled || isPaused || currentWordIdx >= words.length - 1) return;
      const delay = wordDurations[currentWordIdx];
      timerId = setTimeout(() => {
        if (cancelled || isPaused) return;
        currentWordIdx++;
        onWordChange(currentWordIdx, words[currentWordIdx]);
        scheduleNextWord();
      }, delay);
    };

    // If device has a verified native Arabic voice and mode is local, we can use speech synthesis boundary
    const useWebSpeech = this.ttsMode === 'local' && this.hasNativeArabicVoice() && typeof window !== 'undefined' && window.speechSynthesis;

    if (useWebSpeech) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const arVoice = this.voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ar') ||
          v.lang.toLowerCase().includes('ar-') ||
          v.name.toLowerCase().includes('arabic')
      );
      if (arVoice) utterance.voice = arVoice;

      this.currentUtterance = utterance;

      utterance.onboundary = (event) => {
        if (cancelled) return;
        boundaryFired = true;
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          // Progress through words
          if (currentWordIdx < words.length - 1) {
            currentWordIdx++;
            onWordChange(currentWordIdx, words[currentWordIdx]);
          }
        }
      };

      utterance.onend = () => {
        if (timerId) clearTimeout(timerId);
        if (!cancelled) {
          onWordChange(words.length - 1, words[words.length - 1]);
          setTimeout(() => {
            this.notifySpeaking(false, '');
            onEnd();
          }, 250);
        }
      };

      utterance.onerror = () => {
        if (timerId) clearTimeout(timerId);
        if (!cancelled) {
          this.notifySpeaking(false, '');
          onEnd();
        }
      };

      window.speechSynthesis.speak(utterance);
      // Start fallback pacing in case boundary events do not fire
      scheduleNextWord();
    } else {
      // Cloud Audio with calibrated timer synchronization
      const audio = new Audio();
      this.currentAudio = audio;
      audio.playbackRate = Math.max(0.5, Math.min(1.5, rate));

      audio.onloadedmetadata = () => {
        if (audio.duration && Number.isFinite(audio.duration)) {
          const totalMs = (audio.duration * 1000) / audio.playbackRate;
          const totalChars = words.reduce((acc, w) => acc + Math.max(w.length, 3), 0);
          // Recalibrate durations based on exact audio duration
          words.forEach((w, i) => {
            const ratio = Math.max(w.length, 3) / totalChars;
            wordDurations[i] = totalMs * ratio;
          });
        }
      };

      audio.onended = () => {
        if (timerId) clearTimeout(timerId);
        if (!cancelled) {
          onWordChange(words.length - 1, words[words.length - 1]);
          setTimeout(() => {
            this.notifySpeaking(false, '');
            onEnd();
          }, 200);
        }
      };

      audio.onerror = () => {
        // Fallback to web speech
        this.speakWithWebSpeech(cleanText, rate).then(() => {
          if (!cancelled) onEnd();
        });
      };

      audio.src = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      audio.load();
      audio.play().catch(() => {
        // Fallback to Google TTS direct
        audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
        audio.load();
        audio.play().catch(() => {
          this.speakWithWebSpeech(cleanText, rate).then(() => {
            if (!cancelled) onEnd();
          });
        });
      });

      scheduleNextWord();
    }

    return {
      cancel: () => {
        cancelled = true;
        if (timerId) clearTimeout(timerId);
        this.stopSpeaking();
      },
      pause: () => {
        isPaused = true;
        if (timerId) clearTimeout(timerId);
        if (this.currentAudio) {
          try { this.currentAudio.pause(); } catch (e) {}
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          try { window.speechSynthesis.pause(); } catch (e) {}
        }
      },
      resume: () => {
        isPaused = false;
        if (this.currentAudio) {
          try { this.currentAudio.play().catch(() => {}); } catch (e) {}
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          try { window.speechSynthesis.resume(); } catch (e) {}
        }
        scheduleNextWord();
      },
    };
  }
}

export const audioManager = new AudioManager();
