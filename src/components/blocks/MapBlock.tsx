export interface MapBlockData {
  _type: 'mapBlock';
  _key: string;
  heading?: string;
  location?: { lat: number; lng: number };
  embedUrl?: string;
  zoom?: number;
}

/**
 * Build an OpenStreetMap embed URL from a geopoint.
 * No API key required \u2014 good enough for a marketing site.
 */
function osmEmbed(lat: number, lng: number, zoom = 14): string {
  const delta = 0.04 / Math.pow(2, Math.max(0, zoom - 12));
  const minLng = lng - delta;
  const maxLng = lng + delta;
  const minLat = lat - delta;
  const maxLat = lat + delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function MapBlock({ data }: { data: MapBlockData }) {
  let src: string | undefined = data.embedUrl;
  if (!src && data.location) {
    src = osmEmbed(data.location.lat, data.location.lng, data.zoom);
  }
  if (!src) return null;

  return (
    <section className="container py-16 md:py-24">
      {data.heading && (
        <h2 className="font-display text-3xl md:text-5xl text-brand max-w-2xl mb-8 leading-tight">
          {data.heading}
        </h2>
      )}
      <div className="relative aspect-[16/10] md:aspect-[16/7] bg-neutral-100 overflow-hidden">
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={data.heading || 'Map'}
        />
      </div>
    </section>
  );
}
