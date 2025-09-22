/**
 * Cloudinary image optimization utilities
 * Provides optimized URLs with automatic format detection, quality optimization, and progressive loading
 */

export interface CloudinaryOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  progressive?: boolean;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
}

/**
 * Transforms a Cloudinary URL with optimization parameters
 * @param url - Original Cloudinary URL
 * @param options - Optimization options
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: CloudinaryOptimizationOptions = {}
): string {
  try {
    // Return original URL if not a Cloudinary URL
    if (!url.includes('res.cloudinary.com')) {
      return url;
    }

    // Extract base URL and version
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
      return url;
    }

    const [baseUrl, imagePath] = urlParts;
    const transformations: string[] = [];

    // Automatic format detection (WebP/AVIF for modern browsers, fallback to original)
    transformations.push('f_auto');

    // Automatic quality optimization
    transformations.push('q_auto');

    // Progressive loading for JPEGs
    if (options.progressive !== false) {
      transformations.push('fl_progressive');
    }

    // Quality override
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }

    // Dimensions
    if (options.width) {
      transformations.push(`w_${options.width}`);
    }
    if (options.height) {
      transformations.push(`h_${options.height}`);
    }

    // Crop mode
    if (options.crop) {
      transformations.push(`c_${options.crop}`);
    }

    // Format override
    if (options.format && options.format !== 'auto') {
      transformations.push(`f_${options.format}`);
    }

    // Construct optimized URL
    const transformationString = transformations.join(',');
    return `${baseUrl}/upload/${transformationString}/${imagePath}`;
  } catch (error) {
    // If anything goes wrong, return the original URL
    console.warn('Cloudinary URL optimization failed, using original URL:', error);
    return url;
  }
}

/**
 * Predefined optimization presets for different use cases
 */
export const cloudinaryPresets = {
  // Hero images - high quality, full width
  hero: {
    quality: 85,
    progressive: true,
  },

  // Events gallery - balanced quality/speed
  events: {
    quality: 80,
    progressive: true,
  },

  // Thumbnails - smaller, optimized
  thumbnail: {
    width: 300,
    height: 200,
    quality: 75,
    crop: 'fill' as const,
    progressive: true,
  },

  // High-res for detailed views
  highRes: {
    quality: 90,
    progressive: true,
  },
};

/**
 * Batch optimize multiple URLs with the same preset
 */
export function optimizeCloudinaryUrls(
  urls: string[],
  preset: keyof typeof cloudinaryPresets | CloudinaryOptimizationOptions
): string[] {
  const options = typeof preset === 'string' ? cloudinaryPresets[preset] : preset;
  return urls.map(url => optimizeCloudinaryUrl(url, options));
}

/**
 * Generate responsive image sources for different breakpoints
 */
export function generateResponsiveSources(
  baseUrl: string,
  breakpoints: { width: number; media: string }[]
): { src: string; media: string }[] {
  return breakpoints.map(({ width, media }) => ({
    src: optimizeCloudinaryUrl(baseUrl, { width, crop: 'fill' }),
    media,
  }));
}
