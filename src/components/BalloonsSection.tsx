import {useState, type MouseEvent} from 'react';
import {RotateCcw} from 'lucide-react';
import {WISH_BALLOONS} from '../data/celebrationData';
import {playPopSound} from '../utils/soundFx';

interface BalloonsSectionProps {
  soundEnabled: boolean;
  onBurst: (x: number, y: number, glyphs: string[]) => void;
}

export function BalloonsSection({soundEnabled, onBurst}: BalloonsSectionProps) {
  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [activeWish, setActiveWish] = useState<string>(
    'اضغط على أي بالون لتفجيره وقراءة أمنية من أمنيات عمر...',
  );

  const handlePop = (id: string, wish: string, e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    if (!poppedIds.includes(id)) {
      setPoppedIds((prev) => [...prev, id]);
    }
    setActiveWish(wish);
    playPopSound(soundEnabled);
    onBurst(x, y, ['✨', '🎉', '⭐', '💛']);
  };

  const handleReset = () => {
    setPoppedIds([]);
    setActiveWish('اضغط على أي بالون لتفجيره وقراءة أمنية من أمنيات عمر...');
  };

  return (
    <section id="wishes" className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#182235]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              01. فجّر البالونات واقرأ أمنياتي
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              أربعة بالونات ملونة تحمل أمنيات عمر لجميع أطفال العالم.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-600 tabular-nums dark:text-slate-300">
              تم فتح {poppedIds.length} من {WISH_BALLOONS.length} أمنيات
            </span>
            {poppedIds.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>إعادة نفخ البالونات</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {WISH_BALLOONS.map((balloon, idx) => {
            const isPopped = poppedIds.includes(balloon.id);
            return (
              <button
                key={balloon.id}
                type="button"
                onClick={(e) => handlePop(balloon.id, balloon.wish, e)}
                aria-label={`${balloon.label}${isPopped ? ' (تم فتحه)' : ''}`}
                style={{animationDelay: `${idx * 0.35}s`}}
                className={`group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border p-4 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isPopped
                    ? 'border-slate-200 bg-slate-50 opacity-55 scale-95 dark:border-slate-800 dark:bg-slate-900/60'
                    : 'animate-float-slow border-slate-200/80 bg-[#F8FAFC] hover:-translate-y-1 hover:border-blue-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800'
                }`}
              >
                <svg
                  viewBox="0 0 80 110"
                  className="h-24 w-20 drop-shadow-sm transition-transform group-hover:scale-105"
                  aria-hidden="true"
                >
                  <path
                    d="M40 76 Q32 90 42 100 T38 108"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-slate-400 dark:text-slate-500"
                  />
                  {!isPopped ? (
                    <>
                      <ellipse cx="40" cy="40" rx="28" ry="34" fill={balloon.color} />
                      <polygon points="40,74 34,80 46,80" fill={balloon.color} />
                      <ellipse
                        cx="30"
                        cy="28"
                        rx="6"
                        ry="11"
                        transform="rotate(-20 30 28)"
                        fill={balloon.highlight}
                        opacity="0.7"
                      />
                    </>
                  ) : (
                    <text x="40" y="48" textAnchor="middle" fontSize="28">
                      ✨
                    </text>
                  )}
                </svg>
                <span className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isPopped ? 'تم قراءة الأمنية' : balloon.label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="status"
          aria-live="polite"
          className="mt-6 flex min-h-[72px] items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-center dark:border-blue-900/50 dark:bg-blue-950/40"
        >
          <p className="font-display text-lg font-bold text-slate-900 sm:text-xl dark:text-blue-100">
            {activeWish}
          </p>
        </div>
      </div>
    </section>
  );
}
