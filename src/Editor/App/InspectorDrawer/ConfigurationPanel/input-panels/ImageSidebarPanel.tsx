import React, { useState } from "react";

import {
	VerticalAlignBottomOutlined,
	VerticalAlignCenterOutlined,
	VerticalAlignTopOutlined,
} from "@mui/icons-material";
import { Stack, ToggleButton } from "@mui/material";
import { ImageProps, ImagePropsSchema } from "@usewaypoint/block-image";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
import RadioGroupInput from "./helpers/inputs/RadioGroupInput";
import TextDimensionInput from "./helpers/inputs/TextDimensionInput";
import TextInput from "./helpers/inputs/TextInput";
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel";
import { EditorFileUploadCallback } from "../../../../types";
import FileUploader from "../FileUploader";

type ImageSidebarPanelProps = {
	data: ImageProps;
	setData: (v: ImageProps) => void;
	onFileUpload?: EditorFileUploadCallback;
};
export default function ImageSidebarPanel({
	data,
	setData,
	onFileUpload,
}: ImageSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);
	const [url, setUrl] = useState<string | null>(data.props?.url ?? null);

	const updateData = (d: unknown) => {
		const res = ImagePropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel title="Image block">
			<FileUploader
				onFileUpload={onFileUpload}
				url={data.props?.url}
				onUrlChange={(url) => {
					updateData({ ...data, props: { ...data.props, url } });
					setUrl(url);
				}}
			/>
			<TextInput
				label="Source URL"
				value={url ?? ""}
				defaultValue={url ?? ""}
				onChange={(v) => {
					const url = v.trim().length === 0 ? null : v.trim();
					updateData({ ...data, props: { ...data.props, url } });
					setUrl(url);
				}}
			/>

			<TextInput
				label="Alt text"
				defaultValue={data.props?.alt ?? ""}
				onChange={(alt) =>
					updateData({ ...data, props: { ...data.props, alt } })
				}
			/>
			<TextInput
				label="Click through URL"
				defaultValue={data.props?.linkHref ?? ""}
				onChange={(v) => {
					const linkHref = v.trim().length === 0 ? null : v.trim();
					updateData({ ...data, props: { ...data.props, linkHref } });
				}}
			/>
			<Stack direction="row" spacing={2}>
				<TextDimensionInput
					label="Width"
					defaultValue={data.props?.width}
					onChange={(width) =>
						updateData({ ...data, props: { ...data.props, width } })
					}
				/>
				<TextDimensionInput
					label="Height"
					defaultValue={data.props?.height}
					onChange={(height) =>
						updateData({
							...data,
							props: { ...data.props, height },
						})
					}
				/>
			</Stack>

			<RadioGroupInput
				label="Alignment"
				defaultValue={data.props?.contentAlignment ?? "middle"}
				onChange={(contentAlignment) =>
					updateData({
						...data,
						props: { ...data.props, contentAlignment },
					})
				}
			>
				<ToggleButton value="top">
					<VerticalAlignTopOutlined fontSize="small" />
				</ToggleButton>
				<ToggleButton value="middle">
					<VerticalAlignCenterOutlined fontSize="small" />
				</ToggleButton>
				<ToggleButton value="bottom">
					<VerticalAlignBottomOutlined fontSize="small" />
				</ToggleButton>
			</RadioGroupInput>

			<MultiStylePropertyPanel
				names={["backgroundColor", "textAlign", "padding"]}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
