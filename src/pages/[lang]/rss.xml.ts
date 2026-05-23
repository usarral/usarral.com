import rss from "@astrojs/rss";
import type { APIContext, GetStaticPaths } from "astro";
import { getPostsByLocale } from "@/data/post";
import { isLocale, locales } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { siteConfig } from "@/site.config";

export const getStaticPaths = (() => {
	return locales.map((lang) => ({ params: { lang } }));
}) satisfies GetStaticPaths;

export const GET = async (context: APIContext) => {
	const { lang } = context.params;
	if (!isLocale(lang)) throw new Error(`Invalid locale: ${lang}`);
	const posts = await getPostsByLocale(lang);

	return rss({
		title: siteConfig.title,
		description: ui[lang]["site.description"],
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `${lang}/posts/${post.id}/`,
		})),
	});
};
