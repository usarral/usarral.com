import { type CollectionEntry, getCollection } from "astro:content";
import type { Locale } from "@/i18n/config";

/** true while a post must stay reachable only by URL: `unlisted` and `listedAt` not reached yet */
export function isUnlisted(
	data: { unlisted: boolean; listedAt?: Date | undefined },
	now: Date = new Date(),
): boolean {
	return data.unlisted && !(data.listedAt && data.listedAt <= now);
}

/** filter out draft posts and future-dated posts. Posts still unlisted are built whatever their
 *  publishDate, so their page and OG image can be checked and shared before they go public. */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	const now = new Date();
	return await getCollection("post", ({ data }) => {
		if (data.draft) return false;
		if (isUnlisted(data, now)) return true;
		return data.publishDate <= now;
	});
}

/** published posts for the listings, RSS and tags: unlisted ones are left out (use getAllPosts to get them) */
export async function getPostsByLocale(locale: Locale): Promise<CollectionEntry<"post">[]> {
	const all = await getAllPosts();
	const now = new Date();
	return all.filter(
		(post) =>
			post.data.lang === locale && !isUnlisted(post.data, now) && post.data.publishDate <= now,
	);
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => {
		return entry.id === tag;
	});
	return tagEntries[0];
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: CollectionEntry<"post">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
