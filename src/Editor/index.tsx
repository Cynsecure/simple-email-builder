import React from "react";

import {  CssBaseline, ThemeProvider } from "@mui/material";

import EmailEditor from "./App";
import theme from "./theme";
import { EditorProps } from "./types";

export default function Editor(props: EditorProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<EmailEditor {...props} />
		</ThemeProvider>
	);
}

export { EmailEditor, type EditorProps };
