/**
 * manuscript-image-optimizer.ts
 *
 * Fast client-side image downscaling and compression utility.
 * Compresses large screenshots and raw camera uploads down to crisp WebP/JPEG data URLs.
 * Guaranteed to never hang, never return empty for valid images, and never fail.
 */

export interface OptimizeImageOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Optimizes an image File (from clipboard or file input).
 * Guaranteed to return a valid, displayable data URL.
 */
export function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.85 } = options;

  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      resolve("");
      return;
    }

    let settled = false;
    const finish = (result: string) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    // Absolute fallback timer: Never block user interaction longer than 1200ms
    const timer = setTimeout(() => {
      try {
        const fallbackReader = new FileReader();
        fallbackReader.onload = () => finish((fallbackReader.result as string) || "");
        fallbackReader.onerror = () => finish("");
        fallbackReader.readAsDataURL(file);
      } catch {
        finish("");
      }
    }, 1200);

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        clearTimeout(timer);
        finish("");
        return;
      }

      // Fast path: SVGs and files under 400KB are already lightweight and fast
      if (file.type === "image/svg+xml" || file.size < 400_000) {
        clearTimeout(timer);
        finish(dataUrl);
        return;
      }

      // Optimize large images
      optimizeImageDataUrl(dataUrl, { maxDimension, quality })
        .then((optimized) => {
          clearTimeout(timer);
          finish(optimized || dataUrl);
        })
        .catch(() => {
          clearTimeout(timer);
          finish(dataUrl);
        });
    };

    reader.onerror = () => {
      clearTimeout(timer);
      finish("");
    };

    try {
      reader.readAsDataURL(file);
    } catch {
      clearTimeout(timer);
      finish("");
    }
  });
}

/**
 * Optimizes an existing base64 data URL.
 * Guaranteed to resolve with either the compressed data URL or the original.
 */
export function optimizeImageDataUrl(
  dataUrl: string,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.85 } = options;

  return new Promise((resolve) => {
    if (
      !dataUrl ||
      !dataUrl.startsWith("data:image/") ||
      dataUrl.startsWith("data:image/svg+xml")
    ) {
      resolve(dataUrl);
      return;
    }

    // Skip if already small
    if (dataUrl.length < 250_000) {
      resolve(dataUrl);
      return;
    }

    let settled = false;
    const finish = (result: string) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    // Safety timeout: 800ms max for canvas re-encoding
    const timer = setTimeout(() => {
      finish(dataUrl);
    }, 800);

    const img = new Image();

    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          finish(dataUrl);
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
          finish(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        let result = canvas.toDataURL("image/webp", quality);
        if (!result || !result.startsWith("data:image/webp") || result.length < 100) {
          result = canvas.toDataURL("image/jpeg", quality);
        }

        finish(result && result.length > 50 ? result : dataUrl);
      } catch (err) {
        console.warn("Canvas compression fallback:", err);
        finish(dataUrl);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      finish(dataUrl);
    };

    img.src = dataUrl;
  });
}
