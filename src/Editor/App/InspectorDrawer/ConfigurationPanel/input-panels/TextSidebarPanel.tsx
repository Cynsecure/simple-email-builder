import React, { useState } from "react";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
import BooleanInput from "./helpers/inputs/BooleanInput";
import TextInput from "./helpers/inputs/TextInput";
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel";

// Import our local schema instead of the external one
import TextPropsSchema, {
  TextProps,
} from "../../../../documents/blocks/Text/TextPropsSchema";

type TextSidebarPanelProps = {
  data: TextProps;
  setData: (v: TextProps) => void;
};
export default function TextSidebarPanel({
  data,
  setData,
}: TextSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = TextPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Text block">
      <TextInput
        label="Plain Text Content"
        rows={3}
        defaultValue={data.props?.text ?? ""}
        onChange={(text) =>
          updateData({ ...data, props: { ...data.props, text } })
        }
      />

      <TextInput
        label="Rich Text Content (HTML)"
        rows={5}
        defaultValue={data.props?.richText ?? ""}
        onChange={(richText) =>
          updateData({ ...data, props: { ...data.props, richText } })
        }
        helperText="You can enter HTML content here or use the rich text editor in the canvas"
      />

      <BooleanInput
        label="Enable Markdown"
        defaultValue={data.props?.markdown ?? false}
        onChange={(markdown) =>
          updateData({ ...data, props: { ...data.props, markdown } })
        }
      />

      <MultiStylePropertyPanel
        names={[
          "color",
          "backgroundColor",
          "fontFamily",
          "fontSize",
          "fontWeight",
          "textAlign",
          "padding",
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
