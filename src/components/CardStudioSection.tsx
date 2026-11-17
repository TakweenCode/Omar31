import {useCallback, useEffect, useRef, useState, type PointerEvent} from 'react';
import {
  Check,
  Download,
  Eraser,
  Paintbrush,
  RotateCcw,
  Share2,
  Trash2,
  Undo2,
} from 'lucide-react';
import {
  ATTRIBUTION,
  CANVAS_STAMPS,
  CARD_THEMES,
  CELEBRATION_PHRASES,
  DRAW_COLORS,
  type CardTheme,
} from '../data/celebrationData';
import {renderCelebrationCard} from '../utils/cardRenderer';
import {playPopSound} from '../utils/soundFx';

interface CardStudioSectionProps {
  participantName: string;
  onChangeName: (name: string) => void;
  phrase: string;
  onChangePhrase: (phrase: string) => void;
  soundEnabled: boolean;
}

const BRUSH_SIZES = [
  {size: 8, label: 'رفيع', dotSize: 6},
  {size: 16, label: 'وسط', dotSize: 11},
  {size: 30, label: 'سميك', dotSize: 18},
];

export function CardStudioSection({
  participantName,
  onChangeName,
  phrase,
  onChangePhrase,
  soundEnabled,
}: CardStudioSectionProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{x: number; y: number} | null>(null);

  const [brushColor, setBrushColor] = useState<string>(DRAW_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState<number>(16);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [themeId, setThemeId] = useState<CardTheme['id']>('twilight');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const syncPreview = useCallback(() => {
    const cardCanvas = cardCanvasRef.current;
    if (!cardCanvas) return;
    void renderCelebrationCard({
      targetCanvas: cardCanvas,
      drawingCanvas: drawCanvasRef.current,
      hasDrawing,
      participantName,
      phrase,
      themeId,
    });
  }, [hasDrawing, participantName, phrase, themeId]);

  // Initialize white drawing canvas once on mount
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    syncPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render high-res preview whenever metadata, phrase, or theme changes
  useEffect(() => {
    syncPreview();
  }, [syncPreview]);

  const showTempStatus = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? '' : prev));
    }, 4000);
  };

  const pushHistorySnapshot = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 15) {
      historyRef.current.shift();
    }
    setHistoryCount(historyRef.current.length);
  };

  const getCanvasPoint = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const drawSegment = (a: {x: number; y: number}, b: {x: number; y: number}) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = isEraser ? '#FFFFFF' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x + 0.01, b.y + 0.01);
    ctx.stroke();
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasPoint(e);
    pushHistorySnapshot();

    if (activeStamp) {
      ctx.save();
      ctx.font = '96px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, pt.x, pt.y);
      ctx.restore();
      setHasDrawing(true);
      playPopSound(soundEnabled);
      syncPreview();
      return;
    }

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = pt;
    drawSegment(pt, pt);
    if (!isEraser) {
      setHasDrawing(true);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeStamp) return;
    const pt = getCanvasPoint(e);
    if (lastPointRef.current) {
      drawSegment(lastPointRef.current, pt);
    }
    lastPointRef.current = pt;
  };

  const handlePointerEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    syncPreview();
  };

  const handleUndo = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prev = historyRef.current.pop();
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      setHistoryCount(historyRef.current.length);
      if (historyRef.current.length === 0) {
        setHasDrawing(false);
      }
      syncPreview();
    }
  };

  const handleClearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setHistoryCount(0);
    setHasDrawing(false);
    syncPreview();
  };

  const handleResetAll = () => {
    handleClearCanvas();
    onChangeName(ATTRIBUTION.studentDefault);
    onChangePhrase(CELEBRATION_PHRASES[0]);
    setActiveStamp(null);
    setIsEraser(false);
    showTempStatus('تم تجهيز مساحة جديدة لبطاقة جديدة.');
  };

  const getCardBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const card = cardCanvasRef.current;
      if (!card) return resolve(null);
      card.toBlob((blob) => resolve(blob), 'image/png');
    });

  const handleDownloadCard = async () => {
    await renderCelebrationCard({
      targetCanvas: cardCanvasRef.current!,
      drawingCanvas: drawCanvasRef.current,
      hasDrawing,
      participantName,
      phrase,
      themeId,
    });
    const blob = await getCardBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'omar-world-childrens-day-card.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    showTempStatus('تم حفظ البطاقة كصورة PNG بنجاح.');
  };

  const handleShareCard = async () => {
    const blob = await getCardBlob();
    if (!blob) return;
    const file = new File([blob], 'omar-world-childrens-day-card.png', {type: 'image/png'});
    if (navigator.canShare && navigator.canShare({files: [file]})) {
      try {
        await navigator.share({
          files: [file],
          title: `${ATTRIBUTION.occasion} - مشاركة ${participantName.trim() || ATTRIBUTION.studentDefault}`,
          text: `مشاركة ${participantName.trim() || ATTRIBUTION.studentDefault} بإشراف ${ATTRIBUTION.teacher}`,
        });
        return;
      } catch {
        // User canceled share dialog
        return;
      }
    }
    await handleDownloadCard();
    showTempStatus('تم حفظ البطاقة على جهازك؛ يمكنك إرسالها الآن للمعلمة من المعرض.');
  };

  return (
    <section id="studio" className="mx-auto max-w-6xl px-4 py-6 pb-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#182235]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              03. استوديو الرسم وتصميم بطاقة التهنئة
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              ارسم رسمتك أو أضف ملصقات ممتعة، واختر عبارتك لتظهر البطاقة مباشرة بإشراف{' '}
              {ATTRIBUTION.teacher}.
            </p>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            🔒 يعمل محليًا بالكامل · لا تُرسل الأسماء أو الرسومات لأي خادم
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Controls & Interactive Canvas Column */}
          <div className="space-y-7 lg:col-span-7">
            {/* Step A: Participant Name & Theme */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="participant-name"
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  اسم الطفل أو الطفلة
                </label>
                <input
                  id="participant-name"
                  type="text"
                  maxLength={20}
                  value={participantName}
                  onChange={(e) => onChangeName(e.target.value)}
                  placeholder="مثال: عمر أو سارة"
                  className="mt-2 w-full min-h-[46px] rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                />
              </div>

              <div>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  ألوان خلفية البطاقة
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {CARD_THEMES.map((t) => {
                    const selected = themeId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemeId(t.id)}
                        aria-pressed={selected}
                        className={`flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-all cursor-pointer ${
                          selected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-white shadow-xs"
                          style={{background: t.previewBg}}
                          aria-hidden="true"
                        />
                        <span className="truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step B: Drawing Canvas */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  لوحة الرسم (ارسم بإصبعك أو الفأرة، أو اختر ختماً)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyCount === 0}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>تراجع</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>مسح اللوحة</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white dark:border-slate-700">
                <canvas
                  ref={drawCanvasRef}
                  width={900}
                  height={900}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  onPointerLeave={handlePointerEnd}
                  className="aspect-square w-full touch-none cursor-crosshair block"
                />
              </div>

              {/* Colors Palette */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {DRAW_COLORS.map((c) => {
                  const active = !isEraser && !activeStamp && brushColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setBrushColor(c.hex);
                        setIsEraser(false);
                        setActiveStamp(null);
                      }}
                      aria-label={`لون ${c.name}`}
                      aria-pressed={active}
                      className={`h-9 w-9 rounded-full border-2 border-white transition-transform cursor-pointer ${
                        active
                          ? 'scale-115 ring-2 ring-slate-900 dark:ring-white'
                          : 'ring-1 ring-slate-300 hover:scale-105 dark:ring-slate-600'
                      }`}
                      style={{backgroundColor: c.hex}}
                    />
                  );
                })}
              </div>

              {/* Brush Sizes, Eraser & Fun Stamps */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEraser(false);
                    setActiveStamp(null);
                  }}
                  aria-pressed={!isEraser && !activeStamp}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    !isEraser && !activeStamp
                      ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Paintbrush className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>فرشاة</span>
                </button>

                {BRUSH_SIZES.map((b) => {
                  const selected = !activeStamp && brushSize === b.size;
                  return (
                    <button
                      key={b.size}
                      type="button"
                      onClick={() => {
                        setBrushSize(b.size);
                        setActiveStamp(null);
                      }}
                      aria-label={`حجم الخط ${b.label}`}
                      aria-pressed={selected}
                      className={`grid h-10 w-10 place-items-center rounded-xl border cursor-pointer ${
                        selected
                          ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/60'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      <span
                        className="rounded-full bg-slate-800 dark:bg-slate-100"
                        style={{width: b.dotSize, height: b.dotSize}}
                      />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setIsEraser((prev) => !prev);
                    setActiveStamp(null);
                  }}
                  aria-pressed={isEraser && !activeStamp}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isEraser && !activeStamp
                      ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>ممحاة</span>
                </button>

                <span className="mx-1 text-xs text-slate-400" aria-hidden="true">
                  |
                </span>

                <div className="flex flex-wrap items-center gap-1.5" aria-label="أختام الرسم">
                  {CANVAS_STAMPS.map((stamp) => {
                    const active = activeStamp === stamp;
                    return (
                      <button
                        key={stamp}
                        type="button"
                        onClick={() => {
                          setActiveStamp(active ? null : stamp);
                          setIsEraser(false);
                        }}
                        aria-label={`ختم ${stamp}`}
                        aria-pressed={active}
                        className={`grid h-10 w-10 place-items-center rounded-xl border text-lg cursor-pointer transition-transform ${
                          active
                            ? 'scale-105 border-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        {stamp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step C: Phrase Picker */}
            <div>
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                اختر عبارة للبطاقة أو اكتب رسالتك
              </span>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CELEBRATION_PHRASES.map((item) => {
                  const selected = phrase.trim() === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onChangePhrase(item)}
                      aria-pressed={selected}
                      className={`flex min-h-[46px] items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-right text-sm font-bold transition-colors cursor-pointer ${
                        selected
                          ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>{item}</span>
                      {selected && (
                        <Check
                          className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <label htmlFor="custom-phrase" className="sr-only">
                اكتب عبارتك الخاصة
              </label>
              <textarea
                id="custom-phrase"
                maxLength={90}
                rows={2}
                value={phrase}
                onChange={(e) => onChangePhrase(e.target.value)}
                placeholder="أو اكتب عبارتك الخاصة هنا..."
                className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* Live High-Res Card Preview & Export Column */}
          <div className="lg:sticky lg:top-20 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900/70">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                  معاينة البطاقة النهائية
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                  1080 × 1350 PNG
                </span>
              </div>

              <canvas
                ref={cardCanvasRef}
                width={1080}
                height={1350}
                className="w-full rounded-2xl shadow-md"
              />

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                  <span>حفظ البطاقة كصورة (PNG)</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleShareCard}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    <span>مشاركة</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>بطاقة جديدة</span>
                  </button>
                </div>
              </div>

              {statusMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-200"
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
