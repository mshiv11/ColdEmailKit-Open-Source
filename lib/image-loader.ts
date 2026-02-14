type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}

/**
 * Custom image loader for Next.js
 * 
 * In production on Vercel, we use wsrv.nl (free image proxy) for optimization
 * In development or preview, we just pass through the original URL
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // In development or preview deployments, just return the source
  if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
    // For relative URLs, just add width param
    if (src.startsWith("/")) {
      return `${src}?w=${width}`
    }
    return src
  }

  // For production, handle different image sources

  // If it's a relative URL (local image), let Next.js handle it normally
  if (src.startsWith("/")) {
    return `${src}?w=${width}`
  }

  // For external URLs, use wsrv.nl as a free image proxy/optimizer
  // This service provides image resizing, format conversion, and caching
  // See: https://images.weserv.nl/docs/
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: (quality || 75).toString(),
    output: "webp", // Modern format with good compression
    we: "", // Enable WebP lossless when it's better
  })

  return `https://wsrv.nl/?${params.toString()}`
}
