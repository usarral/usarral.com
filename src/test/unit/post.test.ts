import { describe, expect, it } from "vitest";
import { getAllTags, getUniqueTags, getUniqueTagsWithCount, groupPostsByYear } from "@/data/post";

const makePost = (year: number, tags: string[]) =>
	({
		data: {
			publishDate: new Date(year, 0, 1),
			tags,
		},
	}) as any;

describe("groupPostsByYear", () => {
	it("groups posts by publication year", () => {
		const posts = [makePost(2023, []), makePost(2024, []), makePost(2023, [])];
		const grouped = groupPostsByYear(posts);
		expect(grouped["2024"]).toHaveLength(1);
		expect(grouped["2023"]).toHaveLength(2);
	});

	it("returns an empty object for no posts", () => {
		expect(groupPostsByYear([])).toEqual({});
	});
});

describe("getAllTags", () => {
	it("flattens tags from all posts, including duplicates", () => {
		const posts = [makePost(2024, ["a", "b"]), makePost(2024, ["b", "c"])];
		expect(getAllTags(posts)).toEqual(["a", "b", "b", "c"]);
	});

	it("returns empty array for posts with no tags", () => {
		expect(getAllTags([makePost(2024, []), makePost(2024, [])])).toEqual([]);
	});
});

describe("getUniqueTags", () => {
	it("deduplicates tags across posts", () => {
		const posts = [makePost(2024, ["a", "b"]), makePost(2024, ["b", "c"])];
		expect(getUniqueTags(posts).sort()).toEqual(["a", "b", "c"]);
	});
});

describe("getUniqueTagsWithCount", () => {
	it("returns tags sorted by count descending", () => {
		const posts = [makePost(2024, ["a", "b"]), makePost(2024, ["b", "c"])];
		const result = getUniqueTagsWithCount(posts);
		expect(result[0]).toEqual(["b", 2]);
		expect(result.map(([tag]) => tag)).toContain("a");
		expect(result.map(([tag]) => tag)).toContain("c");
	});

	it("returns empty array for no posts", () => {
		expect(getUniqueTagsWithCount([])).toEqual([]);
	});

	it("counts each tag correctly", () => {
		const posts = [
			makePost(2024, ["ts", "web"]),
			makePost(2024, ["ts"]),
			makePost(2024, ["ts", "web"]),
		];
		const result = getUniqueTagsWithCount(posts);
		const counts = Object.fromEntries(result);
		expect(counts["ts"]).toBe(3);
		expect(counts["web"]).toBe(2);
	});
});
