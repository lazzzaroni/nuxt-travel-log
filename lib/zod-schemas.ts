import z from "zod";

export const SearchSchema = z.object(
  {
    q: z.string().min(1, "You must provide a search query."),
  },
);

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string().min(1).max(100).trim();
export const DescriptionSchema = z.string().max(1000).trim().optional().or(z.null());
export const LatSchema = z.coerce.number().min(-90).max(90);
export const LongSchema = z.coerce.number().min(-180).max(180);
