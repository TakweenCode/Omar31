import {ATTRIBUTION, CARD_THEMES, type CardTheme} from '../data/celebrationData';

export interface RenderCardOptions {
  targetCanvas: HTMLCanvasElement;
  drawingCanvas: HTMLCanvasElement | null;
  hasDrawing: boolean;
  participantName: string;
  phrase: string;
  themeId: CardTheme['id'];
}

function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r * 0.45 : r;
    const px = cx + Math.cos(angle) * rad;
    const py = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawBalloon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
) {
  ctx.strokeStyle = 'rgba(255,255,255,0.82)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 1.2);
  ctx.bezierCurveTo(
    cx - 22,
    cy + r * 1.2 + 50,
    cx + 22,
    cy + r * 1.2 + 90,
    cx,
    cy + r * 1.2 + 140,
  );
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 1.2);
  ctx.lineTo(cx - 10, cy + r * 1.2 + 16);
  ctx.lineTo(cx + 10, cy + r * 1.2 + 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.35, cy - r * 0.45, r * 0.18, r * 0.3, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (ctx.measureText(candidate).width > maxW && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function renderCelebrationCard({
  targetCanvas,
  drawingCanvas,
  hasDrawing,
  participantName,
  phrase,
  themeId,
}: RenderCardOptions): Promise<void> {
  try {
    await document.fonts.load('800 60px Cairo');
    await document.fonts.load('600 40px Cairo');
  } catch {
    // Fallback gracefully to system fonts if offline font cache isn't ready
  }

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const W = 1080;
  const H = 1350;
  const FONT = 'Cairo, Tajawal, Tahoma, Arial, sans-serif';
  const theme = CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];

  targetCanvas.width = W;
  targetCanvas.height = H;

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
  grad.addColorStop(0, theme.gradientStops[0]);
  grad.addColorStop(0.55, theme.gradientStops[1]);
  grad.addColorStop(1, theme.gradientStops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Confetti
  const rng = createRng(20);
  const confettiColors = ['#FFD60A', '#FFFFFF', '#7BF1A8', '#FF9F1C', '#9AD7FF'];
  for (let i = 0; i < 65; i++) {
    ctx.save();
    ctx.translate(rng() * W, rng() * H);
    ctx.rotate(rng() * Math.PI);
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.globalAlpha = 0.72;
    ctx.fillRect(-7, -14, 14, 28);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Festive balloons & stars
  drawBalloon(ctx, 118, 182, 60, '#FF5D73');
  drawBalloon(ctx, 232, 122, 48, '#FFD60A');
  drawBalloon(ctx, 962, 172, 62, '#4CD6A3');
  drawBalloon(ctx, 850, 118, 46, '#6AB7FF');

  drawStar(ctx, 540, 42, 22, '#FFFFFF');
  drawStar(ctx, 62, 330, 20, '#FFD60A');
  drawStar(ctx, 1022, 340, 22, '#FFFFFF');

  // Card Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 88px ${FONT}`;
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillText(ATTRIBUTION.occasion, W / 2, 145);

  ctx.shadowColor = 'transparent';
  ctx.font = `700 42px ${FONT}`;
  ctx.fillText(ATTRIBUTION.dateLabel, W / 2, 222);

  // Main White Card Frame
  const PX = 60;
  const PY = 285;
  const PW = 960;
  const PH = 875;

  ctx.shadowColor = 'rgba(0,0,0,0.24)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, PX, PY, PW, PH, 44);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  const drawPic = (sz: number, X: number, Y: number) => {
    if (!drawingCanvas) return;
    ctx.save();
    roundRect(ctx, X, Y, sz, sz, 28);
    ctx.clip();
    ctx.drawImage(drawingCanvas, X, Y, sz, sz);
    ctx.restore();

    ctx.strokeStyle = theme.accentBorder;
    ctx.lineWidth = 6;
    roundRect(ctx, X, Y, sz, sz, 28);
    ctx.stroke();
  };

  const cleanPhrase = phrase.trim();
  ctx.fillStyle = '#1E293B';

  if (hasDrawing && drawingCanvas && cleanPhrase) {
    drawPic(650, (W - 650) / 2, PY + 32);
    ctx.font = `800 50px ${FONT}`;
    let lines = wrapLines(ctx, cleanPhrase, 840);
    if (lines.length > 2) {
      ctx.font = `800 42px ${FONT}`;
      lines = wrapLines(ctx, cleanPhrase, 840);
    }
    const lh = 62;
    const areaTop = PY + 32 + 650;
    const areaH = PH - 32 - 650;
    const y0 = areaTop + areaH / 2 - ((lines.length - 1) * lh) / 2;
    lines.forEach((line, idx) => ctx.fillText(line, W / 2, y0 + idx * lh));
  } else if (hasDrawing && drawingCanvas) {
    drawPic(770, (W - 770) / 2, PY + 52);
  } else {
    const displayPhrase =
      cleanPhrase || 'أحب أن ألعب وأتعلم وأضحك كل يوم مع أصدقائي في الروضة';
    let fs = 78;
    ctx.font = `800 ${fs}px ${FONT}`;
    let lines = wrapLines(ctx, displayPhrase, 800);
    while (lines.length > 5 && fs > 46) {
      fs -= 6;
      ctx.font = `800 ${fs}px ${FONT}`;
      lines = wrapLines(ctx, displayPhrase, 800);
    }
    const lh = fs * 1.45;
    const y0 = PY + PH / 2 - ((lines.length - 1) * lh) / 2 + 24;
    drawStar(ctx, W / 2, PY + 130, 56, '#FFD60A');
    lines.forEach((line, idx) => ctx.fillText(line, W / 2, y0 + idx * lh));
  }

  // Attribution Footer
  const safeName = participantName.trim() || ATTRIBUTION.studentDefault;
  const attrText = `مشاركة ${safeName} – بإشراف ${ATTRIBUTION.teacher}`;
  let attrSize = 44;
  ctx.fillStyle = '#FFFFFF';
  do {
    ctx.font = `800 ${attrSize}px ${FONT}`;
    attrSize -= 2;
  } while (ctx.measureText(attrText).width > 960 && attrSize > 26);

  ctx.fillText(attrText, W / 2, 1234);

  ctx.font = `600 32px ${FONT}`;
  ctx.globalAlpha = 0.94;
  ctx.fillText(ATTRIBUTION.footerSummary, W / 2, 1300);
  ctx.globalAlpha = 1;
}
