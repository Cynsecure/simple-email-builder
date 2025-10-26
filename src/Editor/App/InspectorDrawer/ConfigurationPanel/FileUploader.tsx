import React, { useMemo, useState } from "react";
import { EditorFileUploadCallback } from "../../../types";
import {
	Box,
	Typography,
	LinearProgress,
	CircularProgress,
} from "@mui/material";
import { FileUpload } from "@mui/icons-material";

export type FileUploaderProps = {
	onFileUpload?: EditorFileUploadCallback;
	url?: string | null;
	onUrlChange?: (url: string | null) => void;
	shape?: "circle" | "rounded" | "square";
};

function FileUploader({
	onFileUpload,
	url,
	onUrlChange,
	shape,
}: FileUploaderProps) {
	const [progress, setProgress] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	const uploader_id = useMemo(
		() => Math.random().toString(36).substring(7),
		[]
	);

	const handleFileUpload = (file: File) => {
		setProgress(0);
		setError(null);

		console.log(file);

		if (!file.type.startsWith("image/")) {
			setError("Only image files are allowed.");
			setProgress(null);
			return;
		}

		if (!file.size) {
			setError("Empty file.");
			setProgress(null);
			return;
		}

		if (onFileUpload) {
			onFileUpload(file, ({ progress, error, url }) => {
				if (progress !== undefined) {
					setProgress(progress);
				} else if (error) {
					setError(String(error));
					setProgress(null);
				} else if (url) {
					setProgress(null);
					if (onUrlChange) {
						onUrlChange(url);
					}
				}
			});
		}
	};

	return (
		<Box
			sx={{
				border: !url ? "1px dashed" : "1px",
				borderColor: "divider",
				borderRadius: 1,
				width: "100%",
				aspectRatio: "1/1",
				overflow: "hidden",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				gap: 1,
				bgcolor: "background.default",
				cursor: progress !== null ? "not-allowed" : "pointer",
				position: "relative",
			}}
			onClick={() =>
				!url &&
				progress === null &&
				document
					.getElementById(`email-builder-file-upload-${uploader_id}`)
					?.click()
			}
		>
			{url ? (
				<Box
					sx={{
						"width": "100%",
						"height": "100%",
						"position": "relative",

						"&:hover .uwp-image-uploader-remove": {
							opacity: 1,
							visibility: "visible",
						},
					}}
				>
					<img
						src={url}
						alt="Uploaded"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							borderRadius: "inherit",
						}}
					/>
					<Box
						className="uwp-image-uploader-remove"
						sx={{
							position: "absolute",
							inset: 0,
							bgcolor: "rgba(0, 0, 0, 0.5)",
							backdropFilter: "blur(4px)",
							color: "white",
							cursor: "pointer",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							opacity: 0,
							visibility: "hidden",
							transition: "opacity 0.2s",
						}}
						onClick={(e) => {
							e.stopPropagation();
							if (onUrlChange) {
								onUrlChange(null);
							}
						}}
					>
						Remove
					</Box>
				</Box>
			) : progress !== null ? (
				<>
					<CircularProgress />
					<Typography variant="body2" color="text.secondary">
						Uploading...
					</Typography>
				</>
			) : (
				<>
					<FileUpload sx={{ color: "text.secondary" }} />
					<Typography variant="body2" color="text.secondary">
						Click to upload image
					</Typography>
				</>
			)}
			<input
				id={`email-builder-file-upload-${uploader_id}`}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
				onInput={(e) => {
					const file = (e.target as HTMLInputElement).files?.[0];
					if (file) {
						handleFileUpload(file);
					}
				}}
			/>
			{progress !== null && (
				<Box sx={{ width: "100%", position: "absolute", bottom: 0 }}>
					<LinearProgress variant="determinate" value={progress} />
				</Box>
			)}
			{error && (
				<Typography variant="body2" color="error">
					{error}
				</Typography>
			)}
		</Box>
	);
}

export default FileUploader;
