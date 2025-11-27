import { z } from "zod";

import { TextPropsSchema as BaseTextPropsSchema } from "@usewaypoint/block-text";

const TextPropsSchema = z.object({
  style: BaseTextPropsSchema.shape.style,
  props: z
    .object({
      richText: z.string().optional().nullable(), // For rich text content
    })
    .optional()
    .nullable(),
});

export default TextPropsSchema;

export type TextProps = z.infer<typeof TextPropsSchema>;
