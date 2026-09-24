// Audio utility for Arabic Speech Synthesis and Web Audio Effects

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
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
    } catch (e) {
      // Audio context might be restricted
    }
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

  // Text-To-Speech for Arabic text
  public speakArabic(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const cleanText = text.trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      utterance.pitch = 1.05; // Friendly tone

      // Try finding an Arabic voice
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Tarik')
      );
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
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

    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => onEnd(), 300);
      return { cancel: () => {}, pause: () => {}, resume: () => {} };
    }

    window.speechSynthesis.cancel();

    const cleanText = text.trim();
    if (!cleanText || words.length === 0) {
      onEnd();
      return { cancel: () => {}, pause: () => {}, resume: () => {} };
    }

    // Build word character offset map for matching boundary events
    const wordOffsets: { index: number; start: number; end: number; word: string }[] = [];
    let searchStart = 0;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const cleanW = w.replace(/[.,،؛!؟:)(]/g, '').trim();
      const pos = cleanText.indexOf(cleanW || w, searchStart);
      const start = pos !== -1 ? pos : searchStart;
      const end = start + w.length;
      wordOffsets.push({ index: i, start, end, word: w });
      searchStart = end;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = rate;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Tarik')
    );
    if (arVoice) {
      utterance.voice = arVoice;
    }

    let currentHighlightedIdx = 0;
    onWordChange(0, words[0]);

    // Track word transitions via boundary events
    utterance.onboundary = (event) => {
      if (cancelled) return;
      boundaryFired = true;
      if (event.name === 'word' || typeof event.charIndex === 'number') {
        const charIdx = event.charIndex;
        const matched = wordOffsets.find((wo) => charIdx >= wo.start && charIdx <= wo.end) ||
                        wordOffsets.reduce((prev, curr) => 
                          Math.abs(curr.start - charIdx) < Math.abs(prev.start - charIdx) ? curr : prev
                        );
        if (matched && matched.index !== currentHighlightedIdx) {
          currentHighlightedIdx = matched.index;
          onWordChange(matched.index, words[matched.index]);
        }
      }
    };

    // Fallback timer in case speech boundary doesn't fire
    const wordDurations = words.map((w) => {
      const length = w.length;
      const baseMs = 380;
      const charMs = 50;
      let duration = (baseMs + length * charMs) / rate;
      if (/[.!?،؛:?]/.test(w)) {
        duration += 280 / rate;
      }
      return duration;
    });

    let wordIdx = 0;
    const scheduleNextWord = () => {
      if (cancelled || wordIdx >= words.length - 1) return;
      const delay = wordDurations[wordIdx];
      timerId = setTimeout(() => {
        if (cancelled) return;
        wordIdx++;
        if (!boundaryFired || wordIdx > currentHighlightedIdx) {
          currentHighlightedIdx = wordIdx;
          onWordChange(wordIdx, words[wordIdx]);
        }
        scheduleNextWord();
      }, delay);
    };

    scheduleNextWord();

    utterance.onend = () => {
      if (timerId) clearTimeout(timerId);
      if (!cancelled) {
        onWordChange(words.length - 1, words[words.length - 1]);
        setTimeout(() => {
          onEnd();
        }, 300);
      }
    };

    utterance.onerror = () => {
      if (timerId) clearTimeout(timerId);
      if (!cancelled) {
        onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => {
        cancelled = true;
        if (timerId) clearTimeout(timerId);
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      },
      pause: () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.pause();
        }
        if (timerId) clearTimeout(timerId);
      },
      resume: () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.resume();
        }
        scheduleNextWord();
      }
    };
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioManager = new AudioManager();
