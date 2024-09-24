import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50),
    ownerName: z
      .string()
      .trim()
      .min(3, "Owner name must be at least 3 characters")
      .max(50),
    imageUrl: z.union([
      z.literal(""),
      z.string().url({ message: "Invalid URL" }),
    ]),
    age: z.coerce
      .number()
      .int()
      .positive("Age must be a positive number")
      .max(99, "Age must be less than 99"),
    notes: z.union([
      z.literal(""),
      z.string().trim().max(1000, "Notes must be less than 1000 characters"),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;
