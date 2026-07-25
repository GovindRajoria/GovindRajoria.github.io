import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useMotionPrefs";

type Tracked = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  label: string;
  confidence: number;
  /** Frames since the object entered, used for the lock-on animation. */
  age: number;
};

const CLASSES = [
  { label: "car", w: 116, h: 52 },
  { label: "truck", w: 168, h: 70 },
  { label: "bus", w: 152, h: 74 },
  { label: "motorcycle", w: 64, h: 44 },
  { label: "car", w: 104, h: 48 },
];

const LANES = [0.3, 0.52, 0.74];

function spawn(width: number, height: number, direction: 1 | -1): Tracked {
  const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const lane = LANES[Math.floor(Math.random() * LANES.length)];
  const scale = 0.55 + lane * 0.75;
  const w = cls.w * scale;
  const h = cls.h * scale;

  return {
    x: direction === 1 ? -w - Math.random() * 260 : width + w + Math.random() * 260,
    y: height * lane - h / 2,
    w,
    h,
    vx: direction * (0.35 + Math.random() * 0.5) * scale,
    label: cls.label,
    confidence: 0.72 + Math.random() * 0.27,
    age: 0,
  };
}

/** Rounded rectangle path, standing in for a vehicle silhouette. */
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Corner brackets, the way detection overlays are usually drawn. */
function drawBrackets(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, progress: number) {
  const arm = Math.min(w, h) * 0.28 * progress;
  ctx.beginPath();
  // top-left
  ctx.moveTo(x, y + arm); ctx.lineTo(x, y); ctx.lineTo(x + arm, y);
  // top-right
  ctx.moveTo(x + w - arm, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + arm);
  // bottom-right
  ctx.moveTo(x + w, y + h - arm); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - arm, y + h);
  // bottom-left
  ctx.moveTo(x + arm, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - arm);
  ctx.stroke();
}

/**
 * Ambient canvas that mimics a live object-detection overlay: silhouettes drift
 * across lanes and acquire tracked bounding boxes with class labels and
 * confidence scores.
 *
 * Deliberately cheap — a handful of rectangles per frame, paused whenever the
 * tab is hidden or the element scrolls out of view, and reduced to a single
 * static frame when the visitor prefers reduced motion.
 */
export function DetectionCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let objects: Tracked[] = [];
    let frame = 0;
    let sweep = 0;
    let running = true;

    const styles = getComputedStyle(document.documentElement);
    const readVar = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      objects = [];
      const count = width < 480 ? 3 : 5;
      for (let i = 0; i < count; i += 1) {
        const obj = spawn(width, height, i % 2 === 0 ? 1 : -1);
        // Distribute along the width so the scene starts populated.
        obj.x = Math.random() * width;
        obj.age = 40 + Math.random() * 60;
        objects.push(obj);
      }
    };

    const draw = () => {
      const accent = readVar("--accent", "#3ddbc7");
      const border = readVar("--border", "#1d2635");
      const faint = readVar("--text-faint", "#75839a");

      ctx.clearRect(0, 0, width, height);

      // Faint reference grid.
      ctx.strokeStyle = border;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      const step = 48;
      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = 0; y <= height; y += step) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Scanning sweep.
      if (!reduced) {
        const sweepX = (sweep % (width + 240)) - 120;
        const gradient = ctx.createLinearGradient(sweepX - 90, 0, sweepX + 90, 0);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, accent);
        gradient.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = gradient;
        ctx.fillRect(sweepX - 90, 0, 180, height);
        ctx.globalAlpha = 1;
      }

      for (const obj of objects) {
        // Silhouette.
        ctx.fillStyle = faint;
        ctx.globalAlpha = 0.18;
        roundedRect(ctx, obj.x, obj.y, obj.w, obj.h, obj.h * 0.28);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Lock-on progress over the first ~30 frames.
        const progress = Math.min(1, obj.age / 30);
        if (progress <= 0) continue;

        const pad = 7 * progress;
        const bx = obj.x - pad;
        const by = obj.y - pad;
        const bw = obj.w + pad * 2;
        const bh = obj.h + pad * 2;

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.75;
        ctx.globalAlpha = 0.35 * progress;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.globalAlpha = progress;
        drawBrackets(ctx, bx, by, bw, bh, progress);

        // Label, once the box has settled.
        if (progress > 0.85) {
          const text = `${obj.label} ${obj.confidence.toFixed(2)}`;
          ctx.font = "500 11px ui-monospace, SFMono-Regular, Consolas, monospace";
          const textWidth = ctx.measureText(text).width;
          const labelH = 17;
          const labelY = by - labelH - 3 < 4 ? by + bh + 3 : by - labelH - 3;

          ctx.globalAlpha = 0.92;
          ctx.fillStyle = accent;
          roundedRect(ctx, bx, labelY, textWidth + 12, labelH, 3);
          ctx.fill();

          ctx.globalAlpha = 1;
          ctx.fillStyle = readVar("--bg", "#070b13");
          ctx.fillText(text, bx + 6, labelY + 12);
        }
        ctx.globalAlpha = 1;
      }
    };

    const step2 = () => {
      if (!running) return;

      sweep += 2.4;
      for (let i = objects.length - 1; i >= 0; i -= 1) {
        const obj = objects[i];
        obj.x += obj.vx;
        obj.age += 1;
        // Recycle once fully off-screen, entering from the opposite side.
        if (obj.vx > 0 && obj.x > width + obj.w + 40) {
          objects[i] = spawn(width, height, 1);
        } else if (obj.vx < 0 && obj.x < -obj.w - 40) {
          objects[i] = spawn(width, height, -1);
        }
      }

      draw();
      frame = requestAnimationFrame(step2);
    };

    resize();
    seed();

    if (reduced) {
      // One static frame: the scene is legible without motion.
      for (const obj of objects) obj.age = 60;
      draw();
      return;
    }

    frame = requestAnimationFrame(step2);

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    // Stop burning frames when the tab is backgrounded.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(step2);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Stop when scrolled away from the hero.
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const visible = entries.some((entry) => entry.isIntersecting);
              if (!visible && running) {
                running = false;
                cancelAnimationFrame(frame);
              } else if (visible && !running && !document.hidden) {
                running = true;
                frame = requestAnimationFrame(step2);
              }
            },
            { threshold: 0 },
          );
    observer?.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
