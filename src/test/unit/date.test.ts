import { describe, expect, it } from "vitest";
import { collectionDateSort, getFormattedDate } from "@/utils/date";

describe("getFormattedDate", () => {
	it("returns 'Invalid Date' for undefined", () => {
		expect(getFormattedDate(undefined)).toBe("Invalid Date");
	});

	it("formats a valid date in en-US locale", () => {
		const date = new Date(2024, 0, 15); // Jan 15, 2024
		expect(getFormattedDate(date)).toBe("Jan 15, 2024");
	});

	it("accepts custom options that override the default format", () => {
		const date = new Date(2024, 5, 1); // Jun 1, 2024
		expect(getFormattedDate(date, { month: "long" })).toBe("June 1, 2024");
	});

	it("formats a date with year only option", () => {
		const date = new Date(2023, 11, 31);
		expect(getFormattedDate(date, { year: "numeric", month: undefined, day: undefined })).toBe(
			"2023",
		);
	});
});

describe("collectionDateSort", () => {
	const makePost = (year: number) =>
		({
			data: { publishDate: new Date(year, 0, 1) },
		}) as any;

	it("sorts newer posts first (descending chronological)", () => {
		const posts = [makePost(2022), makePost(2024), makePost(2023)];
		const sorted = [...posts].sort(collectionDateSort);
		expect(sorted[0].data.publishDate.getFullYear()).toBe(2024);
		expect(sorted[1].data.publishDate.getFullYear()).toBe(2023);
		expect(sorted[2].data.publishDate.getFullYear()).toBe(2022);
	});

	it("returns 0 for posts with identical dates", () => {
		const a = makePost(2024);
		const b = makePost(2024);
		expect(collectionDateSort(a, b)).toBe(0);
	});
});
