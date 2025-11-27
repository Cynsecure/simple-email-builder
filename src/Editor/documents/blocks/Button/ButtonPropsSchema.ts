import { z } from "zod";

// Create a custom style schema for buttons that includes border color
const ButtonStyleSchema = z
  .object({
    color: z.string().nullable().optional(),
    backgroundColor: z.string().nullable().optional(),
    fontSize: z.number().nullable().optional(),
    fontFamily: z
      .enum([
        "MODERN_SANS",
        "BOOK_SANS",
        "ORGANIC_SANS",
        "GEOMETRIC_SANS",
        "HEAVY_SANS",
        "ROUNDED_SANS",
        "MODERN_SERIF",
        "BOOK_SERIF",
        "MONOSPACE",
      ])
      .nullable()
      .optional(),
    fontWeight: z.enum(["bold", "normal"]).nullable().optional(),
    textAlign: z
      .enum(["left", "center", "right"])
      .nullable()
      .optional(),
    padding: z
      .object({
        top: z.number(),
        bottom: z.number(),
        left: z.number(),
        right: z.number(),
      })
      .nullable()
      .optional(),
    borderColor: z.string().nullable().optional(), // Add border color
  })
  .nullable()
  .optional();

export const ButtonPropsSchema = z.object({
  style: ButtonStyleSchema,
  props: z
    .object({
      text: z.string().optional(),
      url: z.string().optional(),
      variant: z.enum(["fill", "bordered"]).optional(),
      size: z.enum(["small", "medium", "large"]).optional(),
      fullWidth: z.boolean().optional(),
      alignment: z.enum(["left", "center", "right"]).optional(),
    })
    .optional(),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

export const ButtonPropsDefaults = {
  text: "Click me",
  url: "www.creatorxg.com",
  variant: "fill" as const,
  size: "medium" as const,
  fullWidth: false,
  alignment: "center" as const,
  backgroundColor: "#007bff",
  color: "#ffffff",
  borderColor: "#007bff",
  margin: { top: 4, bottom: 4, left: 24, right: 24 },
};

export default ButtonPropsSchema;
