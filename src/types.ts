export interface SiteConfig {
	author: string;
	date: {
		options: Intl.DateTimeFormatOptions;
	};
	description: string;
	email: string;
	lang: string;
	ogLocale: string;
	title: string;
	url: string;
}

export interface PaginationLink {
	srLabel?: string;
	text?: string;
	url: string;
}

export interface SiteMeta {
	articleDate?: string | undefined;
	description?: string;
	noindex?: boolean | undefined;
	ogImage?: string | undefined;
	title: string;
}

export type AdmonitionType = "tip" | "note" | "important" | "caution" | "warning";
