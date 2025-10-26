import React from "react";

import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Input,
	Tooltip,
	Typography,
} from "@mui/material";
import { EditorArticle, EditorCategory, EditorMetadata } from "../../../types";
import { Close, FilterListOff, Launch } from "@mui/icons-material";
import useSWR from "swr";

type ImportArticleDialogProps = {
	onSelect: (article?: EditorArticle | null) => void;
	open: boolean;
	onClose: () => void;
	metadata: EditorMetadata;
};
export default function ImportArticleDialog({
	onSelect,
	open,
	onClose: onCloseInit,
	metadata,
}: ImportArticleDialogProps) {
	const [filters, setFilters] = React.useState<{
		query: string | null;
		date: string | null;
		category: string | null;
		order: "latest" | "oldest";
	}>({
		query: null,
		date: null,
		category: null,
		order: "latest",
	});

	const {
		data: articleData,
		isLoading: articleLoading,
		isValidating: articleValidating,
	} = useSWR<EditorArticle[]>(
		`${metadata.article}?query=${filters.query ?? ""}&date=${filters.date ?? ""}&category=${filters.category ?? ""}&order=${filters.order}`,
		{
			revalidateOnFocus: false,
			revalidateOnMount: true,
			revalidateOnReconnect: false,
		}
	);

	const { data: categoryData, isLoading: categoryLoading } = useSWR<
		EditorCategory[]
	>(metadata.category, {
		revalidateOnFocus: false,
		revalidateOnMount: true,
		revalidateOnReconnect: false,
	});

	function onClose(article?: any) {
		onCloseInit();
		onSelect(article);
	}

	const articles = articleData ?? metadata.articles ?? [];
	const categories = categoryData ?? metadata.categories ?? [];

	return (
		<Dialog
			open={open}
			onClose={() => onClose()}
			fullWidth
			maxWidth="xl"
			PaperProps={{
				style: {
					height: "100%",
				},
			}}
		>
			<DialogTitle>
				Select Article
				<Box
					component="span"
					sx={{ position: "absolute", right: 8, top: 8 }}
				>
					<IconButton onClick={() => onClose()}>
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const form = e.target as HTMLFormElement;
					const search = form.elements.namedItem(
						"search"
					) as HTMLInputElement;
					const date = form.elements.namedItem(
						"date"
					) as HTMLInputElement;
					const category = form.elements.namedItem(
						"category"
					) as HTMLSelectElement;
					const sort = form.elements.namedItem(
						"sort"
					) as HTMLSelectElement;

					setFilters({
						query: search.value,
						date: date.value,
						category: category.value,
						order: sort.value as "latest" | "oldest",
					});
				}}
			>
				<Box
					display="flex"
					gap={1}
					px={2}
					pb={1}
					sx={{
						borderBottom: 1,
						borderColor: "divider",
					}}
				>
					<Input
						placeholder="Search articles"
						fullWidth
						disableUnderline
						name="search"
						sx={{
							border: 1,
							borderColor: "divider",
							borderRadius: 1,
							padding: "8px 12px",
						}}
					/>
					<Input
						type="date"
						fullWidth
						name="date"
						disableUnderline
						sx={{
							border: 1,
							flex: 1,
							borderColor: "divider",
							borderRadius: 1,
							padding: "8px 12px",
						}}
					/>
					<select
						name="category"
						style={{
							border: "1px solid #ddd",
							borderRadius: "4px",
							padding: "8px 12px",
						}}
					>
						<option value="">All Categories</option>
						{(categories || []).map((category, index) => (
							<option key={category.key} value={category.key}>
								{category.name}
							</option>
						))}
					</select>
					<select
						name="sort"
						style={{
							border: "1px solid #ddd",
							borderRadius: "4px",
							padding: "8px 12px",
						}}
					>
						<option value="latest">Latest</option>
						<option value="oldest">Oldest</option>
					</select>
					<Button
						variant="contained"
						type="submit"
						sx={{
							padding: "8px 20px",
							minWidth: 100,
						}}
					>
						Filter
					</Button>
					<Tooltip title="Reset Filters">
						<IconButton
							color="error"
							type="reset"
							sx={{
								padding: "8px",
								minWidth: 50,
								borderRadius: 1,
							}}
							onClick={() => {
								setFilters({
									query: null,
									date: null,
									category: null,
									order: "latest",
								});
							}}
						>
							<FilterListOff />
						</IconButton>
					</Tooltip>
				</Box>
			</form>
			<DialogContent>
				{articleLoading || articleValidating || categoryLoading ? (
					<Box display="flex" justifyContent="center" py={3}>
						<CircularProgress />
					</Box>
				) : (
					<>
						{!articles || articles.length === 0 ? (
							<Box
								sx={{
									m: 3,
									p: 1,
									border: "1px dashed",
									borderColor: "divider",
								}}
							>
								<Typography
									color="text.secondary"
									textAlign={"center"}
								>
									No article matches the filter.
								</Typography>
							</Box>
						) : (
							<Box
								display="grid"
								gap={2}
								gridTemplateColumns={
									"repeat(auto-fit, minmax(320px, 1fr))"
								}
								py={2}
							>
								{articles.map((article, index) => (
									<Card
										key={index}
										onClick={() => {
											onClose(article);
											metadata.onArticleMap?.(article);
										}}
										sx={{
											"position": "relative",
											"cursor": "pointer",
											"padding": 2,
											"border": 1,
											"borderColor": "divider",
											"borderRadius": 3,
											"display": "flex",
											"flexDirection": "column",
											"gap": 2,
											"transition": "transform 0.2s",
											"&:hover": {
												transform: "scale(1.025)",
											},
										}}
									>
										<CardContent
											sx={{
												p: 0,
												display: "flex",
												flexDirection: "column",
												gap: 1,
											}}
										>
											<Box
												display="flex"
												justifyContent="space-between"
												gap={1}
											>
												<Box
													display="flex"
													alignItems="center"
													justifyContent="center"
													bgcolor="primary.main"
													color="white"
													height={40}
													sx={{
														aspectRatio: "1/1",
														borderRadius: 1,
													}}
												>
													{article.category_tag}
												</Box>
												<Box flex={1}>
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
													pr={3}
												>
													{new Date(
														article.published_at
													).toLocaleDateString(
														"en-GB",
														{
															day: "2-digit",
															month: "short",
															year: "2-digit",
														}
													)}
													,{" "}
													{new Date(
														article.published_at
													).toLocaleTimeString(
														"en-GB",
														{
															hour: "2-digit",
															minute: "2-digit",
															hour12: true,
														}
													)}
												</Typography>
											</Box>
											<Typography
												variant="h6"
												fontSize={14}
												noWrap
											>
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
											loading="lazy"
											alt={article.title}
										/>
										<Box
											position="absolute"
											top={7}
											right={2}
										>
											<Tooltip title="Read More">
												<IconButton
													href={article.source_url}
													onClick={(e) => {
														e.stopPropagation();
													}}
													target="_blank"
													rel="noopener noreferrer"
													size="small"
													sx={{
														width: 32,
														height: 32,
													}}
												>
													<Launch
														sx={{
															width: 16,
														}}
													/>
												</IconButton>
											</Tooltip>
										</Box>
									</Card>
								))}
							</Box>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
