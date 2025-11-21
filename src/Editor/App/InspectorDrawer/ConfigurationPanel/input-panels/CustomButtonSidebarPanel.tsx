import React, { useState } from "react";

import { ToggleButton } from "@mui/material";
import {
  ButtonProps,
  ButtonPropsDefaults,
  ButtonPropsSchema,
} from "../../../../documents/blocks/Button/ButtonPropsSchema";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
import ColorInput from "./helpers/inputs/ColorInput";
import RadioGroupInput from "./helpers/inputs/RadioGroupInput";
import TextInput from "./helpers/inputs/TextInput";
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel";

type CustomButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};

export default function CustomButtonSidebarPanel({
  data,
  setData,
}: CustomButtonSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url =
    data.props?.url && data.props.url !== "#" && data.props.url !== ""
      ? data.props.url
      : ButtonPropsDefaults.url;
  const variant = data.props?.variant ?? ButtonPropsDefaults.variant;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const alignment = data.props?.alignment ?? ButtonPropsDefaults.alignment;
  const backgroundColor =
    data.style?.backgroundColor ?? ButtonPropsDefaults.backgroundColor;
  const textColor = data.style?.color ?? ButtonPropsDefaults.color;
  const borderColor =
    data.style?.borderColor ?? ButtonPropsDefaults.borderColor;

  return (
    <BaseSidebarPanel title="Button block">
      {/* Button Content Display */}

      <TextInput
        label="URL"
        defaultValue={url}
        onChange={(url) =>
          updateData({ ...data, props: { ...data.props, url } })
        }
      />

      <RadioGroupInput
        label="Variant"
        defaultValue={variant}
        onChange={(variant) => {
          const updatedStyle = { ...data.style };

          // Update text color based on variant
          if (variant === "bordered") {
            updatedStyle.color = "#000000"; // Black text for secondary
          } else if (variant === "fill") {
            updatedStyle.color = "#ffffff"; // White text for primary
          }

          updateData({
            ...data,
            props: { ...data.props, variant },
            style: updatedStyle,
          });
        }}
      >
        <ToggleButton value="fill">Primary</ToggleButton>
        <ToggleButton value="bordered">Secondary</ToggleButton>
      </RadioGroupInput>

      <RadioGroupInput
        label="Size"
        defaultValue={size}
        onChange={(size) =>
          updateData({ ...data, props: { ...data.props, size } })
        }
      >
        <ToggleButton value="small">Small</ToggleButton>
        <ToggleButton value="medium">Medium</ToggleButton>
        <ToggleButton value="large">Large</ToggleButton>
      </RadioGroupInput>

      <RadioGroupInput
        label="Width"
        defaultValue={fullWidth ? "FULL_WIDTH" : "AUTO"}
        onChange={(v) =>
          updateData({
            ...data,
            props: { ...data.props, fullWidth: v === "FULL_WIDTH" },
          })
        }
      >
        <ToggleButton value="AUTO">Auto</ToggleButton>
        <ToggleButton value="FULL_WIDTH">Full Width</ToggleButton>
      </RadioGroupInput>

      <RadioGroupInput
        label="Alignment"
        defaultValue={alignment}
        onChange={(alignment) =>
          updateData({ ...data, props: { ...data.props, alignment } })
        }
      >
        <ToggleButton value="left">Left</ToggleButton>
        <ToggleButton value="center">Center</ToggleButton>
        <ToggleButton value="right">Right</ToggleButton>
      </RadioGroupInput>

      {variant === "fill" && (
        <ColorInput
          label="Background Color"
          defaultValue={backgroundColor}
          onChange={(backgroundColor) =>
            updateData({
              ...data,
              style: { ...data.style, backgroundColor },
            })
          }
        />
      )}

      <ColorInput
        label="Text Color"
        defaultValue={textColor}
        onChange={(color) =>
          updateData({
            ...data,
            style: { ...data.style, color },
          })
        }
      />

      {variant === "bordered" && (
        <ColorInput
          label="Border Color"
          defaultValue={borderColor}
          onChange={(borderColor) =>
            updateData({
              ...data,
              style: { ...data.style, borderColor },
            })
          }
        />
      )}

      <MultiStylePropertyPanel
        names={["fontFamily", "fontSize", "fontWeight", "padding"]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
