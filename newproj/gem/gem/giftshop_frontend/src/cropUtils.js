export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Applies identical geometric clipping to the 2D canvas context matching CSS preview definitions.
 */
function applyShapeClip(ctx, width, height, shape = 'circle') {
  ctx.beginPath();
  const w = width;
  const h = height;

  switch (shape) {
    case 'circle': {
      const radius = Math.min(w, h) / 2;
      ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'heart': {
      // Mathematically identical to svg-mask-heart (0-1 normalized space scaled by w and h)
      ctx.moveTo(w * 0.5, h * 0.88);
      ctx.bezierCurveTo(w * 0.5, h * 0.88, w * 0.05, h * 0.58, w * 0.05, h * 0.32);
      ctx.bezierCurveTo(w * 0.05, h * 0.12, w * 0.22, h * 0.04, w * 0.38, h * 0.04);
      ctx.bezierCurveTo(w * 0.46, h * 0.04, w * 0.5, h * 0.1, w * 0.5, h * 0.16);
      ctx.bezierCurveTo(w * 0.5, h * 0.1, w * 0.54, h * 0.04, w * 0.62, h * 0.04);
      ctx.bezierCurveTo(w * 0.78, h * 0.04, w * 0.95, h * 0.12, w * 0.95, h * 0.32);
      ctx.bezierCurveTo(w * 0.95, h * 0.58, w * 0.5, h * 0.88, w * 0.5, h * 0.88);
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'square': {
      const r = Math.min(w, h) * 0.12; // proportional rounded corners
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, w, h, r);
      } else {
        ctx.rect(0, 0, w, h);
      }
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'shield': {
      // TN Vehicle Tag Shield Mask
      ctx.moveTo(w * 0.5, h * 0.02);
      ctx.lineTo(w * 0.96, h * 0.12);
      ctx.lineTo(w * 0.96, h * 0.65);
      ctx.bezierCurveTo(w * 0.96, h * 0.82, w * 0.5, h * 0.98, w * 0.5, h * 0.98);
      ctx.bezierCurveTo(w * 0.5, h * 0.98, w * 0.04, h * 0.82, w * 0.04, h * 0.65);
      ctx.lineTo(w * 0.04, h * 0.12);
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'oval': {
      ctx.ellipse(w * 0.5, h * 0.5, w * 0.48, h * 0.38, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'hexagon': {
      ctx.moveTo(w * 0.25, h * 0.05);
      ctx.lineTo(w * 0.75, h * 0.05);
      ctx.lineTo(w * 0.98, h * 0.5);
      ctx.lineTo(w * 0.75, h * 0.95);
      ctx.lineTo(w * 0.25, h * 0.95);
      ctx.lineTo(w * 0.02, h * 0.5);
      ctx.closePath();
      ctx.clip();
      break;
    }
    case 'star': {
      const points = 5;
      const outerRadius = Math.min(w, h) / 2 * 0.95;
      const innerRadius = outerRadius * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / points;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < points; i++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.clip();
      break;
    }
    default:
      // No clipping
      break;
  }
}

export default async function getCroppedImg(imageSrc, pixelCrop, shape = 'circle') {
  if (!imageSrc || !pixelCrop) return null;
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply unified shape clipping mask
  applyShapeClip(ctx, pixelCrop.width, pixelCrop.height, shape);

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (file) => {
        if (!file) {
          resolve(null);
          return;
        }
        resolve(URL.createObjectURL(file));
      },
      'image/png',
      0.95
    );
  });
}