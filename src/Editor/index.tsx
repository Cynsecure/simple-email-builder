import React from "react";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";

import EmailEditor from "./App";
import theme from "./theme";
import { EditorProps } from "./types";

export default function Editor(props: EditorProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
		<Box position="relative" bgcolor="white" overflow="hidden" height="100vh" display="flex" flexDirection="column">
			<Box height={100} width={"100%"} bgcolor="red">
				demo
			</Box>
			<Box flex={1} overflow="hidden">
				<EmailEditor {...props} />
			</Box>
		</Box>
		</ThemeProvider>
	);
}

export { EmailEditor, type EditorProps };
