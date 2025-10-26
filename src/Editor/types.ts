export type EditorFileUploadDoneCallback = ({
	url,
	progress,
	error,
}: {
	url?: string;
	progress?: number;
	error?: string;
}) => void;

export type EditorArticle = {
	id: number;
	title: string;
	content: string;
	category: string;
	author: string;
	poster_url: string;
	category_tag: string;
	source_url: string;
	published_at: string;
};

export type EditorCategory = {
	key: string;
	name: string;
	count: number;
};

export type EditorArticleMap = (article: EditorArticle) => void;

export type EditorFileUploadCallback = (
	file: File,
	done: EditorFileUploadDoneCallback
) => void;

export type EditorChangeCallback = ({
	html,
	design,
}: {
	html: string;
	design: any;
}) => void;

export type EditorMetadata = {
	article?: string;
	articles?: EditorArticle[];
	category?: string;
	categories?: EditorCategory[];
	onArticleMap?: EditorArticleMap;
};

export type EditorProps = EditorMetadata & {
	template?: any;
	onChange?: EditorChangeCallback;
	onFileUpload?: EditorFileUploadCallback;
	onSnapshot?: (file: File) => void;
};
