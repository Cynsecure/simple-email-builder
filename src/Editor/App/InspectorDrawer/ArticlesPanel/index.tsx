import React, { useState } from "react";

import {
	setDocument,
	useDocument,
} from "../../../documents/editor/EditorContext";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Divider,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import ImportArticleDialog from "./ImportArticleDialog";
import { ContentCopy } from "@mui/icons-material";
import { EditorArticle, EditorMetadata } from "../../../types";

export type ArticlesPanelProps = {
	metadata: EditorMetadata;
};

export default function ArticlesPanel({ metadata }: ArticlesPanelProps) {
	const block = useDocument();

	const [open, setOpen] = useState(false);
	const [article, setArticle] = useState<EditorArticle | null>(null);

	function addArticle(atBottom: boolean = false) {
		if (!article) {
			return;
		}

		const newTemplate = buildArticleTemplate(block, article, atBottom);

		setDocument(newTemplate);
	}

	return (
		<Box p={2}>
			<Typography variant="h6">Articles</Typography>
			<Typography variant="body1" color="text.secondary">
				Please select an article to edit.
			</Typography>
			<Box my={3} display="flex" justifyContent="center">
				<Button
					onClick={() => setOpen(true)}
					variant="contained"
					color="primary"
				>
					Import Article
				</Button>
			</Box>
			{!article ? (
				<Typography variant="body2" color="text.secondary">
					After selecting an article, you can choose to insert its
					content into the editor manually or insert the complete
					article as a block.
					<br />
					We will load the article in the editor at the start or end
					of the document depending on your selection.
				</Typography>
			) : (
				<Box>
					<Card
						sx={{
							"cursor": "pointer",
							"padding": 1,
							"border": 1,
							"borderColor": "divider",
							"borderRadius": 1,
							"display": "flex",
							"flexDirection": "column",
							"gap": 1,
							"transition": "transform 0.2s",
							"&:hover": {
								transform: "scale(1.025)",
							},
						}}
						onClick={() => {
							window.open(article.source_url, "_blank");
						}}
					>
						<CardContent sx={{ p: 0 }}>
							<Box display="flex" justifyContent="space-between">
								<Box>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										{article.author}
									</Typography>
									<Typography
										variant="body2"
										color="hsla(34, 100%, 50%, 1)"
										fontWeight={600}
									>
										{article.category}
									</Typography>
								</Box>
								<Typography
									variant="caption"
									color="text.secondary"
									fontSize={10}
								>
									{new Date(
										article.published_at
									).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "2-digit",
									})}
									{", "}
									{new Date(
										article.published_at
									).toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</Typography>
							</Box>
							<Typography variant="h6" fontSize={14} noWrap>
								{article.title}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									display: "-webkit-box",
									WebkitBoxOrient: "vertical",
									WebkitLineClamp: 2,
									overflow: "hidden",
								}}
							>
								{article.content}
							</Typography>
						</CardContent>
						<CardMedia
							component="img"
							sx={{
								width: "100%",
								aspectRatio: "16/9",
								borderRadius: 1,
							}}
							image={article.poster_url}
							alt={article.title}
						/>
					</Card>
					<Box my={5}>
						<Typography
							variant="body2"
							color="text.secondary"
							mb={1}
						>
							Select where to insert the article content:
						</Typography>
						<Box display="flex" gap={1}>
							<Button
								variant="outlined"
								fullWidth
								color="secondary"
								onClick={() => addArticle()}
							>
								Insert at Start
							</Button>
							<Button
								variant="outlined"
								color="success"
								fullWidth
								onClick={() => addArticle(true)}
							>
								Insert at End
							</Button>
						</Box>
					</Box>
					<Divider />
					<Box
						my={2}
						display={"flex"}
						flexDirection={"column"}
						gap={2}
						// sx={{
						// 	border: 1,
						// 	borderColor: "divider",
						// 	borderRadius: 1,
						// 	boxShadow: 1,
						// 	padding: 1,
						// }}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							mb={1}
						>
							Or insert the article content manually:
						</Typography>
						<ArticlesPanelManualItem
							title="TITLE"
							value={article.title}
						/>
						<ArticlesPanelManualItem
							title="AUTHOR"
							value={article.author}
						/>
						<ArticlesPanelManualItem
							title="SUMMARY"
							value={article.content}
						/>
						<ArticlesPanelManualItem
							title="POSTER"
							value={article.poster_url}
						/>
						<ArticlesPanelManualItem
							title="PUBLISHED ON"
							value={new Date(
								article.published_at
							).toLocaleString("en-GB", {
								day: "2-digit",
								month: "long",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							})}
						/>
						<ArticlesPanelManualItem
							title="CATEGORY"
							value={article.category}
						/>
						<ArticlesPanelManualItem
							title="LINK"
							value={article.source_url}
						/>
					</Box>
				</Box>
			)}
			<ImportArticleDialog
				metadata={metadata}
				open={open}
				onClose={() => setOpen(false)}
				onSelect={(article?: any) => {
					setOpen(false);
					if (article) {
						setArticle(article);
					} else {
						setArticle(null);
					}
				}}
			/>
		</Box>
	);
}

const buildArticleTemplate = (
	template: any,
	article: any,
	atBottom: boolean = false
) => {
	const tz = Date.now();

	const articleBlock = {
		[`block-${tz}`]: {
			type: "Container",
			data: {
				style: {
					backgroundColor: "#FFFFFF",
					borderRadius: 8,
					padding: {
						top: 8,
						bottom: 8,
						right: 8,
						left: 8,
					},
				},
				props: {
					childrenIds: [
						`block-${tz}_title`,
						`block_${tz}_content`,
						`block-${tz}_column`,
						`block-${tz}_image`,
						`block-${tz}_button`,
					],
				},
			},
		},
		[`block-${tz}_title`]: {
			type: "Heading",
			data: {
				props: {
					text: article.title,
					level: "h3",
				},
				style: {
					padding: {
						top: 4,
						bottom: 4,
						right: 4,
						left: 4,
					},
				},
			},
		},
		[`block_${tz}_content`]: {
			type: "Text",
			data: {
				style: {
					fontSize: 14,
					fontWeight: "normal",
					padding: {
						top: 4,
						bottom: 4,
						right: 4,
						left: 4,
					},
				},
				props: {
					text: article.content,
				},
			},
		},
		[`block-${tz}_column`]: {
			type: "ColumnsContainer",
			data: {
				style: {
					padding: {
						top: 4,
						bottom: 4,
						right: 4,
						left: 4,
					},
				},
				props: {
					columnsCount: 2,
					columnsGap: 16,
					columns: [
						{
							childrenIds: [`block-${tz}_author`],
						},
						{
							childrenIds: [`block-${tz}_published`],
						},
						{
							childrenIds: [],
						},
					],
				},
			},
		},
		[`block-${tz}_author`]: {
			type: "Text",
			data: {
				style: {
					color: "#737373",
					fontSize: 12,
					fontWeight: "normal",
					padding: {
						top: 0,
						bottom: 0,
						right: 0,
						left: 0,
					},
				},
				props: {
					text: `By ${article.author} in ${article.category}`,
				},
			},
		},
		[`block-${tz}_published`]: {
			type: "Text",
			data: {
				style: {
					color: "#737373",
					fontSize: 12,
					fontWeight: "normal",
					textAlign: "right",
					padding: {
						top: 0,
						bottom: 0,
						right: 0,
						left: 0,
					},
				},
				props: {
					text: `Published on ${new Date(
						article.published_at
					).toLocaleString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						hour12: true,
					})}`,
				},
			},
		},
		[`block-${tz}_image`]: {
			type: "Image",
			data: {
				style: {
					padding: {
						top: 0,
						bottom: 0,
						right: 0,
						left: 0,
					},
				},
				props: {
					url: article.poster_url,
					alt: article.title,
					linkHref: article.source_url,
					contentAlignment: "middle",
				},
			},
		},
		[`block-${tz}_button`]: {
			type: "Button",
			data: {
				style: {
					fontWeight: "normal",
					textAlign: "center",
					padding: {
						top: 8,
						bottom: 8,
						right: 8,
						left: 8,
					},
				},
				props: {
					buttonStyle: "pill",
					fullWidth: true,
					size: "small",
					text: "Read full Article",
					url: article.source_url,
				},
			},
		},
	};

	template["root"].data.childrenIds = atBottom
		? [...template["root"].data.childrenIds, `block-${tz}`]
		: [`block-${tz}`, ...template["root"].data.childrenIds];

	template = { ...template, ...articleBlock };

	return template;
};

const ArticlesPanelManualItem = ({
	title,
	value,
}: {
	title: string;
	value: string;
}) => {
	const [copied, setCopied] = useState(false);

	return (
		<Box display="flex" alignItems="center" gap={1}>
			<Box flexGrow={1}>
				<Typography
					variant="body2"
					color="gray"
					fontWeight={600}
					fontSize={10}
					sx={{ userSelect: "none" }}
				>
					{title}
				</Typography>
				<Typography variant="body1" sx={{ wordBreak: "break-word" }}>
					{value}
				</Typography>
			</Box>
			<Tooltip title={copied ? "Copied! ✓" : "Copy to clipboard"}>
				<IconButton
					onClick={() => {
						navigator.clipboard.writeText(value);
						setCopied(true);

						setTimeout(() => {
							setCopied(false);
						}, 2000);
					}}
					sx={{ padding: 0 }}
				>
					<ContentCopy
						sx={{
							width: 16,
							height: 16,
						}}
					/>
				</IconButton>
			</Tooltip>
		</Box>
	);
};
