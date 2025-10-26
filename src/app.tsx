import React from "react";
import articles from "./articles.json";

import Editor from "./Editor";
import { Box } from "@mui/material";

function App() {
	return (
		<Box>
			<Editor
				onArticleMap={(article) => {
					console.log(article);
				}}
				onChange={(design) => {
					console.log(design);
				}}
				onFileUpload={(file, done) => {
					console.log(file);
					let progress = 0;
					const interval = setInterval(() => {
						done({ progress });
						progress += 10;
						if (progress === 100) {
							clearInterval(interval);
							if (Math.random() > 0.5) {
								done({
									url: "https://assets.usewaypoint.com/sample-image.jpg",
								});
							} else {
								done({ error: "Upload failed" });
							}
						}
					}, 1000);
				}}
				// onSnapshot={(file) => {
				// 	console.log(file);
				// }}
			/>
		</Box>
	);
}

export default App;
