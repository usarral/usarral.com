import { describe, expect, it } from "vitest";
import { generateToc } from "@/utils/generateToc";

describe("generateToc", () => {
	it("returns an empty array for no headings", () => {
		expect(generateToc([])).toEqual([]);
	});

	it("filters out h1 and h5 by default", () => {
		const headings = [
			{ depth: 1, slug: "h1", text: "H1" },
			{ depth: 2, slug: "h2", text: "H2" },
			{ depth: 5, slug: "h5", text: "H5" },
		];
		const toc = generateToc(headings);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.slug).toBe("h2");
	});

	it("nests h3 as a child of h2", () => {
		const headings = [
			{ depth: 2, slug: "h2", text: "H2" },
			{ depth: 3, slug: "h3", text: "H3" },
		];
		const toc = generateToc(headings);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.children).toHaveLength(1);
		expect(toc[0]?.children[0]?.slug).toBe("h3");
	});

	it("handles multiple top-level h2 headings", () => {
		const headings = [
			{ depth: 2, slug: "a", text: "A" },
			{ depth: 2, slug: "b", text: "B" },
			{ depth: 2, slug: "c", text: "C" },
		];
		const toc = generateToc(headings);
		expect(toc).toHaveLength(3);
		expect(toc.map((item) => item.slug)).toEqual(["a", "b", "c"]);
	});

	it("respects custom minHeadingLevel", () => {
		const headings = [
			{ depth: 2, slug: "h2", text: "H2" },
			{ depth: 3, slug: "h3", text: "H3" },
		];
		const toc = generateToc(headings, { minHeadingLevel: 3 });
		expect(toc).toHaveLength(1);
		expect(toc[0]?.slug).toBe("h3");
	});

	it("respects custom maxHeadingLevel", () => {
		const headings = [
			{ depth: 2, slug: "h2", text: "H2" },
			{ depth: 3, slug: "h3", text: "H3" },
			{ depth: 4, slug: "h4", text: "H4" },
		];
		const toc = generateToc(headings, { maxHeadingLevel: 3 });
		const children = toc[0]?.children ?? [];
		expect(children).toHaveLength(1);
		expect(children[0]?.slug).toBe("h3");
	});

	it("deeply nests h4 under h3 under h2", () => {
		const headings = [
			{ depth: 2, slug: "h2", text: "H2" },
			{ depth: 3, slug: "h3", text: "H3" },
			{ depth: 4, slug: "h4", text: "H4" },
		];
		const toc = generateToc(headings);
		const h3 = toc[0]?.children[0];
		expect(h3?.slug).toBe("h3");
		expect(h3?.children[0]?.slug).toBe("h4");
	});
});
