import React from "react";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";

import EmailEditor from "./App";
import theme from "./theme";
import { EditorProps } from "./types";

export default function Editor(props: EditorProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box position="relative" bgcolor="white" overflow="hidden">
				<EmailEditor {...props} />
			</Box>
		</ThemeProvider>
	);
}

export { EmailEditor, type EditorProps };
