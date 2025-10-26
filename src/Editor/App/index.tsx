import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

import { Box, Stack, useTheme } from "@mui/material";

import {
	resetDocument,
	useDocument,
	useInspectorDrawerOpen,
} from "../documents/editor/EditorContext";

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from "./InspectorDrawer";
import TemplatePanel from "./TemplatePanel";
import { Reader, renderToStaticMarkup } from "@usewaypoint/email-builder";
import { EditorProps } from "../types";
import html2canvas from "html2canvas";

function useDrawerTransition(
	cssProperty: "margin-left" | "margin-right",
	open: boolean
) {
	const { transitions } = useTheme();
	return transitions.create(cssProperty, {
		easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
		duration: !open
			? transitions.duration.leavingScreen
			: transitions.duration.enteringScreen,
	});
}

export default function Editor({
	template,
	onChange,
	onFileUpload,
	onSnapshot,
	...metadata
}: EditorProps) {
	const inspectorDrawerOpen = useInspectorDrawerOpen();
	const document = useDocument();

	const marginRightTransition = useDrawerTransition(
		"margin-right",
		inspectorDrawerOpen
	);

	const [takingSnapshot, setTakingSnapshot] = React.useState(false);
	const snapshotRef = React.useRef<HTMLDivElement>(null);

	const triggerSnapshot = () => {
		if (!onSnapshot) return;
		if (takingSnapshot) return;
		const snapshotElement = snapshotRef.current;
		if (!snapshotElement) return;

		setTakingSnapshot(true);
		html2canvas(snapshotElement, {
			allowTaint: true,
			useCORS: true,
			backgroundColor: "white",
		})
			.then((canvas) => {
				canvas.toBlob((blob) => {
					if (blob) {
						const file = new File(
							[blob],
							`${Date.now()}-${uuid()}.png`,
							{ type: "image/png" }
						);

						onSnapshot?.(file);
					}

					setTakingSnapshot(false);
				}, "image/png");
			})
			.catch((e) => {
				console.error("Failed to take snapshot", e);
				setTakingSnapshot(false);
			});
	};

	useEffect(() => {
		if (template) {
			resetDocument(template);
		}
	}, [template]);

	useEffect(() => {
		if (onChange) {
			onChange({
				html: renderToStaticMarkup(document, { rootBlockId: "root" }),
				design: document,
			});
		}
		triggerSnapshot();
	}, [document]);

	useEffect(() => {
		let interval: NodeJS.Timeout = null as any;
		if (onSnapshot) {
			interval = setInterval(() => {
				triggerSnapshot();
			}, 1000);
		}
		return () => {
			clearInterval(interval);
		};
	}, [onSnapshot]);

	return (
		<>
			<InspectorDrawer metadata={metadata} onFileUpload={onFileUpload} />

			<Stack
				sx={{
					marginRight: inspectorDrawerOpen
						? `${INSPECTOR_DRAWER_WIDTH}px`
						: 0,
					transition: [marginRightTransition].join(", "),
				}}
			>
				<TemplatePanel />
			</Stack>
			<Box
				sx={{
					position: "fixed",
					inset: 0,
					zIndex: -1,
					opacity: 0,
					pointerEvents: "none",
				}}
			>
				<div ref={snapshotRef} style={{ width: "100%", maxWidth: 600 }}>
					<Reader document={document} rootBlockId="root" />
				</div>
			</Box>
		</>
	);
}
