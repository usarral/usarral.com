import type { CollectionEntry } from "astro:content";
import { dateLocales, defaultLocale, type Locale } from "@/i18n/config";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
	locale: Locale = defaultLocale,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat(dateLocales[locale], {
		...(siteConfig.date.options as Intl.DateTimeFormatOptions),
		...options,
	}).format(date);
}

export function collectionDateSort(a: CollectionEntry<"post">, b: CollectionEntry<"post">) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}
