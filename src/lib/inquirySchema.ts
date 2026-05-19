import { z } from 'zod';

/**
 * Shared validation schema for inquiry form.
 * Used on both the client (react-hook-form resolver) and the server (API route).
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email').max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Please add a short message').max(3000),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  /** Slug of the related project (when inquiry came from a listing detail page). */
  projectSlug: z.string().trim().max(120).optional().or(z.literal('')),
  /**
   * Honeypot \u2014 hidden field. Real users leave it empty. Validation accepts
   * anything; the API route silently 200s if non-empty so bots don't learn.
   */
  website: z.string().max(500).optional().or(z.literal('')),
  locale: z.enum(['en', 'ar']),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
