import { z } from "zod";
import {
  SUPPORT_CATEGORY_VALUES,
  SUPPORT_PRIORITY_VALUES,
  SUPPORT_STATUS_VALUES,
} from "@/types/support";

/* -------------------------------------------------------------------------- */
/*                               Helper Schemas                               */
/* -------------------------------------------------------------------------- */

export const supportTimelineEventSchema = z.object({
  id: z.string().min(1),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters.")
    .max(500, "Description cannot exceed 500 characters."),

  createdAt: z.string(),

  createdBy: z
    .string()
    .trim()
    .min(2)
    .max(100),
});

/* -------------------------------------------------------------------------- */
/*                             Support Ticket Schema                          */
/* -------------------------------------------------------------------------- */

export const supportTicketSchema = z.object({
  id: z.string().min(1),

  ticketNumber: z.string().min(1),

  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters.")
    .max(120, "Subject cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),

  employeeId: z.string().min(1),

  employeeName: z.string().min(2),

  employeeAvatar: z.string().optional(),

  department: z.string().min(1),

  category: z.enum(SUPPORT_CATEGORY_VALUES),

  priority: z.enum(SUPPORT_PRIORITY_VALUES),

  status: z.enum(SUPPORT_STATUS_VALUES),

  assignedTo: z.string().optional(),

  resolutionNotes: z
    .string()
    .max(2000)
    .optional(),

  createdAt: z.string(),

  updatedAt: z.string(),

  timeline: z.array(supportTimelineEventSchema),
});

/* -------------------------------------------------------------------------- */
/*                             Support Form Schema                            */
/* -------------------------------------------------------------------------- */

export const supportFormSchema = supportTicketSchema.omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
  timeline: true,
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type SupportTicketSchema = z.infer<typeof supportTicketSchema>;

export type SupportFormValues = z.infer<typeof supportFormSchema>;

export type SupportTimelineEventSchema = z.infer<
  typeof supportTimelineEventSchema
>;