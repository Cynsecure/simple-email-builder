import { z } from "zod";
import { HeadingPropsSchema as BaseHeadingPropsSchema } from "@usewaypoint/block-heading";

export const HeadingPropsSchema = z.object({
  style: BaseHeadingPropsSchema.shape.style,
  props: z
    .object({
      text: z.string().optional(),
      richText: z.string().optional(), // For rich text content with HTML formatting
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional(),
    })
    .optional(),
});

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

export const HeadingPropsDefaults = {
  text: "Click to edit heading",
  richText: "",
  level: "h2" as const,
};

export default HeadingPropsSchema;
