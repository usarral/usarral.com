import type { AstroExpressiveCodeOptions } from "astro-expressive-code";
import type { Locale } from "@/i18n/config";
import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	author: "usarral",
	date: {
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	description:
		"I'm a software developer based in Spain, with experience in web development. I'm passionate about technology and I love to learn new things. I'm always looking for new challenges and opportunities to grow as a professional. I work with technologies like Spring Boot, Angular, TypeScript, NestJS, PHP, and more.",
	lang: "en-US",
	ogLocale: "en_US",
	title: "Usarral",
	url: "https://usarral.com",
};

export type MenuTitleKey = "nav.home" | "nav.projects" | "nav.blog" | "nav.about";

export interface MenuLink {
	path: string;
	titleKey: MenuTitleKey;
}

const baseMenu: MenuLink[] = [
	{ path: "/", titleKey: "nav.home" },
	{ path: "/projects/", titleKey: "nav.projects" },
	{ path: "/posts/", titleKey: "nav.blog" },
];

export function getLocalizedMenuLinks(locale: Locale): MenuLink[] {
	return baseMenu.map(({ path, titleKey }) => ({
		path: path === "/" ? `/${locale}/` : `/${locale}${path}`,
		titleKey,
	}));
}

// https://expressive-code.com/reference/configuration/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	styleOverrides: {
		borderRadius: "4px",
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		codeFontSize: "0.875rem",
		codeLineHeight: "1.7142857rem",
		codePaddingInline: "1rem",
		frames: {
			frameBoxShadowCssValue: "none",
		},
		uiLineHeight: "inherit",
	},
	themeCssSelector(theme, { styleVariants }) {
		// If one dark and one light theme are available
		// generate theme CSS selectors compatible with cactus-theme dark mode switch
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
		}
		// return default selector
		return `[data-theme="${theme.name}"]`;
	},
	// One dark, one light theme => https://expressive-code.com/guides/themes/#available-themes
	themes: ["dracula", "github-light"],
	useThemedScrollbars: true,
};
