import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
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
      {/* <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Rich Text Content
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            minHeight: 120,
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
          }}
        >
          {data.props?.richText ? (
            <Box
              dangerouslySetInnerHTML={{ __html: data.props.richText }}
              sx={{
                "& p": { margin: "0 0 8px 0" },
                "& p:last-child": { margin: 0 },
                "& h1, & h2, & h3, & h4, & h5, & h6": { margin: "0 0 8px 0" },
                "& ul, & ol": { margin: "0 0 8px 0", paddingLeft: "20px" },
                "& li": { margin: "0 0 4px 0" },
                fontSize: "14px",
                lineHeight: 1.4,
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Click on the text block in the canvas to edit content
            </Typography>
          )}
        </Paper>
      </Box> */}

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
