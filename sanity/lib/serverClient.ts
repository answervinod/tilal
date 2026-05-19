import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

/**
 * Write-capable Sanity client for server-only routes (e.g. /api/inquiry).
 * Requires SANITY_API_WRITE_TOKEN in the environment.
 *
 * NEVER import this from a client component or page \u2014 the token must stay server-side.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'published',
});

export const hasWriteToken = Boolean(process.env.SANITY_API_WRITE_TOKEN);
