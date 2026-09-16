/** Blob store is private; images are served through the authed /api/photo route. */
export function photoSrc(blobUrl: string): string {
  return `/api/photo?u=${encodeURIComponent(blobUrl)}`;
}
