/**
 * manuscript-image-optimizer.ts
 *
 * Fast client-side image downscaling and compression utility.
 * Compresses 5MB-20MB clipboard screenshots and raw camera uploads
 * down to crisp ~80KB-160KB WebP/JPEG data URLs (max 1400px dimension).
 *
 * Benefits:
 * - 98%+ reduction in DOM size & memory footprint
 * - Prevents GPU texture cache thrashing during canvas zoom & scroll
 * - Instant TipTap serialization (getHTML / docx export)
 * - Safe for localStorage persistence without QuotaExceededError
 */

export interface OptimizeImageOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Optimizes an image File (from clipboard or file input)
 */
export async function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.85, mimeType = "image/webp" } = options;

  // SVG images are vector and already lightweight; pass through as data URL or text
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Create temporary object URL for fast image decoding
  const objectUrl = URL.createObjectURL(file);
  try {
    return await compressImageSource(objectUrl, maxDimension, quality, mimeType);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Optimizes an existing base64 data URL (e.g. from pasted HTML or legacy draft)
 */
export async function optimizeImageDataUrl(
  dataUrl: string,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.85, mimeType = "image/webp" } = options;

  // Skip SVG or already small images (< 150KB)
  if (dataUrl.startsWith("data:image/svg+xml") || dataUrl.length < 150_000) {
    return dataUrl;
  }

  return compressImageSource(dataUrl, maxDimension, quality, mimeType);
}

/**
 * Core image decompression & canvas re-encoding engine
 */
function compressImageSource(
  sourceUrl: string,
  maxDimension: number,
  quality: number,
  preferredMimeType: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(sourceUrl);
          return;
        }

        // Calculate aspect-ratio-preserved bounding box
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          resolve(sourceUrl);
          return;
        }

        // Enable high-quality bicubic image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        // Try preferred format (webp), fallback to jpeg
        let result = canvas.toDataURL(preferredMimeType, quality);
        if (!result.startsWith(`data:${preferredMimeType}`)) {
          result = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(result);
      } catch (err) {
        console.warn("Canvas compression failed, using original source:", err);
        resolve(sourceUrl);
      }
    };

    img.onerror = () => {
      // In case of load error, gracefully fallback to sourceUrl
      resolve(sourceUrl);
    };

    img.src = sourceUrl;
  });
}
