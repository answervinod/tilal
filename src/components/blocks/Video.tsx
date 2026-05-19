import Image from 'next/image';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface VideoData {
  _type: 'videoBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  source?: 'url' | 'file';
  url?: string;
  file?: { asset?: { url: string } };
  poster?: SanityImage;
  autoplay?: boolean;
}

/**
 * Convert a YouTube/Vimeo URL into an embeddable iframe URL.
 * Returns undefined if the URL doesn't match a known provider.
 */
function toEmbedUrl(url: string): string | undefined {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export function Video({ data }: { data: VideoData }) {
  const posterSrc = imageUrl(data.poster, 1600);

  let player: React.ReactNode = null;
  if (data.source === 'file' && data.file?.asset?.url) {
    player = (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={data.file.asset.url}
        controls
        playsInline
        poster={posterSrc}
        autoPlay={data.autoplay}
        muted={data.autoplay}
        loop={data.autoplay}
      />
    );
  } else if (data.url) {
    const embed = toEmbedUrl(data.url);
    if (embed) {
      player = (
        <iframe
          src={embed}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={data.heading || 'Video'}
        />
      );
    } else {
      // Fallback: direct mp4-style URL
      player = (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={data.url}
          controls
          playsInline
          poster={posterSrc}
        />
      );
    }
  }

  return (
    <section className="container py-16 md:py-24">
      {(data.heading || data.subheading) && (
        <div className="max-w-2xl mb-8">
          {data.heading && (
            <h2 className="font-display text-3xl md:text-5xl text-brand leading-tight">
              {data.heading}
            </h2>
          )}
          {data.subheading && (
            <p className="mt-3 text-neutral-600 leading-relaxed">{data.subheading}</p>
          )}
        </div>
      )}
      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
        {posterSrc && !player && (
          <Image src={posterSrc} alt="" fill className="object-cover" sizes="100vw" />
        )}
        {player}
      </div>
    </section>
  );
}
