import {type MouseEvent, useRef} from 'react';
import {ArrowDownLeft, Sparkles} from 'lucide-react';
import {
  DREAM_OPTIONS,
  type DreamOption,
  type ParticipantGender,
} from '../data/celebrationData';
import {playChimeSound} from '../utils/soundFx';

interface DreamsSectionProps {
  gender: ParticipantGender;
  onChangeGender: (gender: ParticipantGender) => void;
  selectedDreamId: string | null;
  customDream: string;
  participantName: string;
  soundEnabled: boolean;
  onSelectDream: (dreamId: string) => void;
  onChangeCustomDream: (value: string) => void;
  onApplyDreamToCard: (dreamTitle: string, dreamEmoji?: string) => void;
  onBurst: (x: number, y: number, glyphs: string[]) => void;
}

export function DreamsSection({
  gender,
  onChangeGender,
  selectedDreamId,
  customDream,
  participantName,
  soundEnabled,
  onSelectDream,
  onChangeCustomDream,
  onApplyDreamToCard,
  onBurst,
}: DreamsSectionProps) {
  const customInputRef = useRef<HTMLInputElement | null>(null);
  const isCustomSelected = selectedDreamId === 'other';
  const activePreset =
    selectedDreamId && selectedDreamId !== 'other'
      ? DREAM_OPTIONS.find((d) => d.id === selectedDreamId) ?? null
      : null;

  const displayName = participantName.trim() || 'عمر';
  const trimmedCustom = customDream.trim();

  const activeDreamLabel = activePreset
    ? activePreset[gender].title
    : isCustomSelected && trimmedCustom
      ? trimmedCustom
      : '';
  const activeDreamEmoji = activePreset
    ? activePreset[gender].emoji
    : isCustomSelected && trimmedCustom
      ? '🌟'
      : '';

  const handleChoosePreset = (dream: DreamOption, e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    onSelectDream(dream.id);
    playChimeSound(soundEnabled);
    onBurst(x, y, ['⭐', '🌟', '✨', dream[gender].emoji]);
  };

  const handleChooseOther = () => {
    onSelectDream('other');
    window.setTimeout(() => {
      customInputRef.current?.focus();
    }, 50);
  };

  return (
    <section id="dreams" className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#182235]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              02. ماذا أحلم أن أكون؟
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              اختر طفل أو طفلة وحدد حلم المستقبل أو اكتبه في خانة الحلم الأخرى لإضافته لبطاقتك.
            </p>
          </div>

          <div
            role="group"
            aria-label="اختيار المشاركة طفل أو طفلة"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              type="button"
              onClick={() => onChangeGender('boy')}
              aria-pressed={gender === 'boy'}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                gender === 'boy'
                  ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              👦 طفل
            </button>
            <button
              type="button"
              onClick={() => onChangeGender('girl')}
              aria-pressed={gender === 'girl'}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                gender === 'girl'
                  ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              👧 طفلة
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {DREAM_OPTIONS.map((dream) => {
            const option = dream[gender];
            const isSelected = selectedDreamId === dream.id;
            return (
              <button
                key={dream.id}
                type="button"
                onClick={(e) => handleChoosePreset(dream, e)}
                aria-pressed={isSelected}
                className={`inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 py-2.5 text-base font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span aria-hidden="true" className="text-xl">
                  {option.emoji}
                </span>
                <span>{option.title}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleChooseOther}
            aria-pressed={isCustomSelected}
            className={`inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 py-2.5 text-base font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isCustomSelected
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-dashed border-slate-300 bg-slate-50 text-slate-800 hover:border-blue-400 hover:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>حلم آخر (أكتبُه بنفسي)</span>
          </button>
        </div>

        {/* Custom Dream Input Box */}
        <div className="mt-4">
          <label
            htmlFor="custom-dream-input"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {gender === 'girl'
              ? 'خانة أخرى لكتابة حلمكِ الخاص (اختياري):'
              : 'خانة أخرى لكتابة حلمك الخاص (اختياري):'}
          </label>
          <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
            <input
              ref={customInputRef}
              id="custom-dream-input"
              type="text"
              maxLength={40}
              value={customDream}
              onFocus={() => onSelectDream('other')}
              onChange={(e) => {
                onSelectDream('other');
                onChangeCustomDream(e.target.value);
              }}
              placeholder={
                gender === 'girl'
                  ? 'مثال: مهندسة معمارية، مبرمجة، عالمة فضاء...'
                  : 'مثال: مهندس معماري، مبرمج، عالم فضاء...'
              }
              className="min-h-[46px] flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 sm:flex-row sm:items-center dark:border-amber-900/40 dark:bg-amber-950/25">
          <div>
            {activeDreamLabel ? (
              <p className="font-display text-lg font-extrabold text-slate-900 sm:text-xl dark:text-amber-100">
                أنا {displayName}، وحلمي أن أكون {activeDreamLabel} {activeDreamEmoji}
              </p>
            ) : (
              <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                {gender === 'girl'
                  ? `اختاري حلماً من القائمة أو اكتبي حلمكِ في الخانة أعلاه.`
                  : `اختر حلماً من القائمة أو اكتب حلمك في الخانة أعلاه.`}
              </p>
            )}
          </div>

          {activeDreamLabel && (
            <button
              type="button"
              onClick={() => onApplyDreamToCard(activeDreamLabel, activeDreamEmoji)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-extrabold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <span>أضف الحلم إلى بطاقتي</span>
              <ArrowDownLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
