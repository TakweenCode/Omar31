import {useState} from 'react';
import {Moon, Palette, Sparkles, Sun, Volume2, VolumeX} from 'lucide-react';
import heroIllustration from '../assets/images/omar_childrens_day_hero_1794934657554.jpg';
import {ATTRIBUTION} from '../data/celebrationData';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function HeroSection({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}: HeroSectionProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 lg:pt-12 lg:pb-14">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7 dark:border-slate-800 dark:bg-[#182235]">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>مشاركة الطالب: {ATTRIBUTION.studentDefault}</span>
              <span className="mx-2 text-slate-400" aria-hidden="true">
                ·
              </span>
              <span>إشراف: {ATTRIBUTION.teacher}</span>
              <span className="mx-2 text-slate-400" aria-hidden="true">
                ·
              </span>
              <span>{ATTRIBUTION.school}</span>
            </p>

            <h1 className="font-display mt-4 text-3xl leading-snug font-extrabold text-slate-900 sm:text-4xl lg:text-[2.65rem] [text-wrap:balance] dark:text-white">
              أنا عمر، وأحتفل معكم بيوم الطفل العالمي
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
              الطفولة لعبٌ وضحكٌ وأحلامٌ كبيرة. فجّر البالونات لتقرأ أمنياتي، واكتشف ما أحلم أن أكونه
              في المستقبل، ثم ارسم رسمتك وصمّم بطاقة تهنئة جميلة باسمك في {ATTRIBUTION.dateLabel}.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#studio"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Palette className="h-5 w-5" aria-hidden="true" />
                <span>ابدأ تصميم بطاقتك</span>
              </a>
              <a
                href="#wishes"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-base font-bold text-slate-800 hover:bg-slate-100 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <span>افتح بالونات الأمنيات</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {ATTRIBUTION.occasion} · {ATTRIBUTION.dateLabel} · يعمل محليًا بخصوصية كاملة
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleSound}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  )}
                  <span>{soundEnabled ? 'الصوت مفعّل' : 'الصوت مكتوم'}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label={theme === 'dark' ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                  )}
                  <span>{theme === 'dark' ? 'وضع النهار' : 'الوضع الليلي'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-amber-50 lg:col-span-5 dark:border-slate-800 dark:bg-slate-800">
          {!imgFailed ? (
            <img
              src={heroIllustration}
              alt="رسم قصصي لطفل سعيد يحمل بالونات ملونة وفرشاة رسم في حديقة الروضة"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full min-h-[260px] object-cover lg:h-full"
            />
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 p-8 text-center dark:from-slate-800 dark:to-slate-900">
              <span className="text-6xl" aria-hidden="true">
                🎨🎈
              </span>
              <p className="font-display mt-4 text-xl font-bold text-slate-800 dark:text-white">
                {ATTRIBUTION.occasion}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                مشاركة عمر · {ATTRIBUTION.school}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
