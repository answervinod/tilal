import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = (source: Image) =>
  builder.image(source).auto('format').fit('max');

/** Convenience: get a string URL with an optional width. */
export function imageUrl(source: Image | undefined, width?: number): string | undefined {
  if (!source) return undefined;
  let b = builder.image(source).auto('format').fit('max');
  if (width) b = b.width(width);
  return b.url();
}
