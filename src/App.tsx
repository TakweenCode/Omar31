import {useCallback, useEffect, useRef, useState} from 'react';
import {BalloonsSection} from './components/BalloonsSection';
import {CardStudioSection} from './components/CardStudioSection';
import {DreamsSection} from './components/DreamsSection';
import {FloatingParticles, type ParticleItem} from './components/FloatingParticles';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {
  ATTRIBUTION,
  CELEBRATION_PHRASES,
  type ParticipantGender,
} from './data/celebrationData';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gender, setGender] = useState<ParticipantGender>('boy');
  const [participantName, setParticipantName] = useState<string>(ATTRIBUTION.studentDefault);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [customDream, setCustomDream] = useState<string>('');
  const [phrase, setPhrase] = useState<string>(CELEBRATION_PHRASES[0]);
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  const particleIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleBurst = useCallback((x: number, y: number, glyphs: string[]) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const batch: ParticleItem[] = Array.from({length: 6}, (_, i) => {
      particleIdRef.current += 1;
      return {
        id: particleIdRef.current,
        x: x + (i - 2.5) * 20,
        y: y + ((i % 2) - 0.5) * 14,
        glyph: glyphs[i % glyphs.length],
      };
    });

    setParticles((prev) => [...prev, ...batch]);
    window.setTimeout(() => {
      const batchIds = new Set(batch.map((item) => item.id));
      setParticles((prev) => prev.filter((item) => !batchIds.has(item.id)));
    }, 1200);
  }, []);

  const handleSelectDream = (dreamId: string) => {
    setSelectedDreamId(dreamId);
  };

  const handleApplyDreamToCard = (dreamTitle: string, dreamEmoji?: string) => {
    const cleanName = participantName.trim() || ATTRIBUTION.studentDefault;
    const suffix = dreamEmoji ? ` ${dreamEmoji}` : '';
    setPhrase(`أنا ${cleanName}، وحلمي أن أكون ${dreamTitle}${suffix}`);
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 transition-colors duration-200 dark:bg-[#0F172A] dark:text-slate-100">
      <FloatingParticles particles={particles} />

      <Header />

      <main>
        <HeroSection
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />

        <BalloonsSection soundEnabled={soundEnabled} onBurst={handleBurst} />

        <DreamsSection
          gender={gender}
          onChangeGender={setGender}
          selectedDreamId={selectedDreamId}
          customDream={customDream}
          participantName={participantName}
          soundEnabled={soundEnabled}
          onSelectDream={handleSelectDream}
          onChangeCustomDream={setCustomDream}
          onApplyDreamToCard={handleApplyDreamToCard}
          onBurst={handleBurst}
        />

        <CardStudioSection
          participantName={participantName}
          onChangeName={setParticipantName}
          phrase={phrase}
          onChangePhrase={setPhrase}
          soundEnabled={soundEnabled}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-8 text-center dark:border-slate-800 dark:bg-[#182235]/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-display text-base font-extrabold text-slate-800 dark:text-slate-100">
            {ATTRIBUTION.closingQuote} 💛
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <span>مشاركة: {ATTRIBUTION.studentFullName}</span>
            <span className="mx-2 text-slate-400" aria-hidden="true">
              ·
            </span>
            <span>بإشراف: {ATTRIBUTION.teacher}</span>
            <span className="mx-2 text-slate-400" aria-hidden="true">
              ·
            </span>
            <span>{ATTRIBUTION.footerSummary}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
