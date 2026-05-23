import { defaultLocale, isLocale, type Locale, locales } from "./config";
import { type TranslationKey, ui } from "./ui";

export function getLocaleFromUrl(url: URL | string): Locale {
	const pathname = typeof url === "string" ? url : url.pathname;
	const segment = pathname.split("/").filter(Boolean)[0];
	return isLocale(segment) ? segment : defaultLocale;
}

export function useTranslations(locale: Locale) {
	return function t(key: TranslationKey): string {
		return ui[locale][key] ?? ui[defaultLocale][key];
	};
}

export function getLocalizedPath(path: string, locale: Locale): string {
	const cleaned = path.startsWith("/") ? path : `/${path}`;
	if (cleaned === "/") return `/${locale}/`;
	return `/${locale}${cleaned}`;
}

export function switchLocaleInPath(currentPath: string, targetLocale: Locale): string {
	const parts = currentPath.split("/").filter(Boolean);
	if (parts.length === 0) return `/${targetLocale}/`;
	if (isLocale(parts[0])) {
		parts[0] = targetLocale;
	} else {
		parts.unshift(targetLocale);
	}
	const trailing = currentPath.endsWith("/") ? "/" : "";
	return `/${parts.join("/")}${trailing}`;
}

export function getAlternateLocalePaths(currentPath: string): { locale: Locale; path: string }[] {
	return locales.map((locale) => ({
		locale,
		path: switchLocaleInPath(currentPath, locale),
	}));
}
