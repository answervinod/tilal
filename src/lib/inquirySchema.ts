import { z } from 'zod';

/**
 * Shared validation schema for inquiry form.
 * Used on both the client (react-hook-form resolver) and the server (API route).
 */
export const inquirySchema = z.object({
  firstName: z.string().trim().min(2, 'Please enter your first name').max(120),
  lastName: z.string().trim().min(2, 'Please enter your last name').max(120),
  workEmail: z.string().trim().email('Please enter a valid work email').max(160),
  phone: z.string().trim().min(5, 'Please enter a valid phone number').max(40),
  nationality: z.string().trim().min(2, 'Please enter your nationality').max(120),
  message: z.string().trim().min(2, 'Please add a short message').max(3000).optional().or(z.literal('')),
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
