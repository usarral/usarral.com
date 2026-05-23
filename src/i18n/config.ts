export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	en: "English",
	es: "Español",
};

export const dateLocales: Record<Locale, string> = {
	en: "en-US",
	es: "es-ES",
};

export const ogLocales: Record<Locale, string> = {
	en: "en_US",
	es: "es_ES",
};

export function isLocale(value: string | undefined): value is Locale {
	return value !== undefined && (locales as readonly string[]).includes(value);
}
