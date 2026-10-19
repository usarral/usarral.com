import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

export interface LocalizedString {
	en: string;
	es: string;
}

/** Years only. Omit `end` for a project that happened within `start`. */
export interface ProjectPeriod {
	start: number;
	end?: number | "present";
}

export interface Project {
	name: LocalizedString;
	summary: LocalizedString;
	description: LocalizedString;
	period: ProjectPeriod;
	tech: string[];
	links?: {
		label: string;
		href: string;
	}[];
}

export interface LocalizedProject {
	name: string;
	summary: string;
	description: string;
	/** Human readable, e.g. "2024 – present". */
	period: string;
	/** First year, for structured data. */
	periodStart: string;
	tech: string[];
	links: { label: string; href: string }[] | undefined;
}

// The order shown on the site is computed from `period` (see compareProjects), not from this array.
export const projects: Project[] = [
	{
		name: {
			en: "Pequeñas Raíces Libres · NGO website",
			es: "Pequeñas Raíces Libres · Web de ONG",
		},
		summary: {
			en: "Website rebuilt from Canva into a fast static site that non-technical staff edit themselves.",
			es: "Web reconstruida desde Canva como sitio estático y rápido que el equipo no técnico edita por sí mismo.",
		},
		description: {
			en: "Full rebuild of the website of a non-profit from Huesca that supports children in Guaricano (Dominican Republic). The previous Canva site blocked Google from indexing it and rendered everything with JavaScript. The new one is static HTML built with Astro and Tailwind, with a Sveltia CMS editing panel behind GitHub login so the association updates texts, photos and projects (each one a blog-style page) without touching code. Changes go through pull requests validated by GitHub Actions, photos are resized and compressed automatically on upload, fonts are self-hosted and there are no cookies. Deployed on Cloudflare Pages, scoring 97 on mobile and 100 on desktop in PageSpeed Insights, and 100 in SEO.",
			es: "Reconstrucción completa de la web de una asociación sin ánimo de lucro de Huesca que apoya a la infancia de Guaricano (República Dominicana). La web anterior, hecha con Canva, impedía que Google la indexara y lo pintaba todo con JavaScript. La nueva es HTML estático con Astro y Tailwind, con un panel de edición Sveltia CMS tras el acceso con GitHub, para que la asociación actualice textos, fotos y proyectos (cada uno una página tipo blog) sin tocar código. Los cambios pasan por pull requests validados con GitHub Actions, las fotos se reducen y comprimen solas al subirlas, las fuentes son propias y no hay cookies. Desplegada en Cloudflare Pages, con 97 en móvil y 100 en escritorio en PageSpeed Insights, y 100 en SEO.",
		},
		period: { start: 2026, end: "present" },
		tech: ["Astro", "TailwindCSS", "TypeScript", "Sveltia CMS", "Cloudflare Pages", "CI/CD"],
		links: [{ label: "pequenasraiceslibres.org", href: "https://pequenasraiceslibres.org" }],
	},
	{
		name: {
			en: "usarral.com",
			es: "usarral.com",
		},
		summary: {
			en: "Personal site and technical blog, statically built with Astro.",
			es: "Web personal y blog técnico, construido estáticamente con Astro.",
		},
		description: {
			en: "Personal website and technical blog focused on development, Docker deployments, security and systems automation. Static, fast and shipped through a custom CI/CD pipeline.",
			es: "Web personal y blog técnico centrado en desarrollo, despliegues con Docker, seguridad y automatización de sistemas. Estático, rápido y publicado mediante un pipeline CI/CD propio.",
		},
		period: { start: 2022, end: "present" },
		tech: ["Astro", "Node.js", "TailwindCSS", "Docker", "CI/CD"],
		links: [
			{ label: "usarral.com", href: "https://usarral.com" },
			{ label: "GitHub", href: "https://github.com/usarral/usarral.com" },
		],
	},
	{
		name: {
			en: "butler-ci-cli",
			es: "butler-ci-cli",
		},
		summary: {
			en: "Terminal tooling to drive Jenkins pipelines from the command line.",
			es: "Herramienta de terminal para gestionar pipelines de Jenkins desde la línea de comandos.",
		},
		description: {
			en: "Terminal tooling to automate Jenkins pipelines straight from the command line.",
			es: "Herramienta de terminal para automatizar pipelines de Jenkins directamente desde la línea de comandos.",
		},
		period: { start: 2025, end: "present" },
		tech: ["Node.js", "TypeScript", "Jenkins"],
		links: [{ label: "GitHub", href: "https://github.com/usarral/butler-ci-cli" }],
	},
	{
		name: {
			en: "Astra5 · NASA Space Apps Challenge",
			es: "Astra5 · NASA Space Apps Challenge",
		},
		summary: {
			en: "Machine-learning flood detection on Sentinel-1 satellite imagery.",
			es: "Detección de inundaciones mediante machine learning sobre imágenes del satélite Sentinel-1.",
		},
		description: {
			en: "Flood detection tool built on Sentinel-1 imagery using Machine Learning with PyTorch. Backend in Node.js, model in Python and frontend in React.",
			es: "Herramienta de detección de inundaciones construida sobre imágenes Sentinel-1 con Machine Learning en PyTorch. Backend en Node.js, modelo en Python y frontend en React.",
		},
		period: { start: 2025 },
		tech: ["Node.js", "Python", "PyTorch", "React", "Machine Learning"],
		links: [{ label: "astra5.usarral.com", href: "https://astra5.usarral.com" }],
	},
	{
		name: {
			en: "Various projects at The Box of the Boss",
			es: "Varios proyectos en The Box of the Boss",
		},
		summary: {
			en: "Web platforms and IoT stage effects for an events production company.",
			es: "Plataformas web y efectos escénicos IoT para una productora de eventos y espectáculos.",
		},
		description: {
			en: "Web applications and platforms for an events and shows production company, including IoT-based control systems for stage illusion effects using Arduino, WebSockets and Node.js.",
			es: "Aplicaciones y plataformas web para una productora de eventos y espectáculos, incluyendo sistemas de control IoT para efectos de ilusionismo en escenario con Arduino, WebSockets y Node.js.",
		},
		period: { start: 2025 },
		tech: ["Node.js", "WebSockets", "Arduino", "IoT"],
		links: [
			{ label: "theboxoftheboss.com", href: "https://theboxoftheboss.com" },
			{ label: "plandefuga.es", href: "https://plandefuga.es" },
			{ label: "pedrotercero.com", href: "https://pedrotercero.com" },
		],
	},
	{
		name: {
			en: "e-RVC · Catalonia's vineyard registry",
			es: "e-RVC · Registro vitivinícola de Cataluña",
		},
		summary: {
			en: "Microservices platform for Catalonia's public wine-growing registry.",
			es: "Plataforma de microservicios para el registro vitivinícola público de Cataluña.",
		},
		description: {
			en: "Microservices platform behind the e-RVC, the Generalitat de Catalunya's public registry where grape growers, wineries and regulatory councils manage plantings, harvests and wine-growing potential. 22 microservices in Java 8 and Spring Boot with an Angular 14 frontend. Direct client work for requirements gathering, functional analysis and critical incident resolution. Deployed on Docker, Jenkins and OpenShift.",
			es: "Plataforma de microservicios detrás del e-RVC, el registro público de la Generalitat de Catalunya donde viticultores, bodegas y consejos reguladores gestionan plantaciones, vendimias y potencial vitivinícola. 22 microservicios en Java 8 y Spring Boot con un frontend Angular 14. Trabajo directo con cliente para recogida de requisitos, análisis funcional y resolución de incidencias críticas. Desplegado sobre Docker, Jenkins y OpenShift.",
		},
		period: { start: 2024, end: "present" },
		tech: [
			"Java",
			"Spring Boot",
			"Angular",
			"Node.js",
			"WebSockets",
			"Docker",
			"Jenkins",
			"OpenShift",
			"Git",
			"Jira",
		],
		links: [{ label: "ervc.agricultura.gencat.cat", href: "https://ervc.agricultura.gencat.cat" }],
	},
	{
		name: {
			en: "Catalan language services platform",
			es: "Plataforma de servicios lingüísticos en catalán",
		},
		summary: {
			en: "Legacy Java apps powering Catalan proficiency exams, translation and resources.",
			es: "Aplicaciones legacy en Java que dan soporte a exámenes de catalán, traducción y recursos.",
		},
		description: {
			en: "Evolution and maintenance of the legacy applications run by the Generalitat de Catalunya's language administration — VxL (Voluntariat per la Llengua, the program that pairs Catalan learners with fluent speakers), GestCerCat (Catalan proficiency exam management), LLC (Catalan language resources portal), RTIJ (sworn translators and interpreters registry) and the in-house Apertium-based machine translators for Occitan/Aranese and the rest of the supported language pairs — built on Java 7, Servlets and JSP, deployed on Tomcat 7/9.",
			es: "Evolución y mantenimiento de las aplicaciones legacy de la administración lingüística de la Generalitat de Catalunya — VxL (Voluntariat per la Llengua, el programa que empareja aprendices de catalán con hablantes fluidos), GestCerCat (gestión de exámenes oficiales de catalán), LLC (portal de recursos en catalán), RTIJ (registro de traductores e intérpretes jurados) y los traductores automáticos basados en Apertium para occitano/aranés y el resto de pares de idiomas — construidas sobre Java 7, Servlets y JSP, desplegadas en Tomcat 7/9.",
		},
		period: { start: 2023, end: 2024 },
		tech: ["Java", "Servlets", "JSP", "Tomcat", "Jenkins", "Apertium"],
		links: [
			{ label: "VxL", href: "https://www.vxl.cat" },
			{ label: "LLC", href: "https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html" },
		],
	},
	{
		name: {
			en: "SAP ABAP4 · Hotel chains",
			es: "SAP ABAP4 · Cadenas hoteleras",
		},
		summary: {
			en: "ABAP4 and UI5 customisations for the ERP of large hotel chains.",
			es: "Personalizaciones en ABAP4 y UI5 para el ERP de grandes cadenas hoteleras.",
		},
		description: {
			en: "Feature development and bug fixing in SAP ABAP4 for large hotel chains, including frontend work in SAP UI5 and integration with workflows based on Node.js 18 and Angular.",
			es: "Desarrollo de funcionalidades y resolución de bugs en SAP ABAP4 para grandes cadenas hoteleras, incluyendo trabajo de frontend en SAP UI5 e integración con flujos basados en Node.js 18 y Angular.",
		},
		period: { start: 2023 },
		tech: ["SAP ABAP4", "SAP UI5", "Node.js", "Angular"],
		links: [{ label: "tmsforhotels.com", href: "http://www.tmsforhotels.com/tmshotels" }],
	},
	{
		name: {
			en: "GDM La Merced",
			es: "GDM La Merced",
		},
		summary: {
			en: "Website and back-office tooling for a local handball club.",
			es: "Web y herramientas de back-office para un club local de balonmano.",
		},
		description: {
			en: "Development and maintenance of the website and internal tooling for a local handball club: player management, match calendars and results publishing.",
			es: "Desarrollo y mantenimiento de la web y herramientas internas para un club local de balonmano: gestión de jugadores, calendarios de partidos y publicación de resultados.",
		},
		period: { start: 2022 },
		tech: ["Node.js", "Web"],
		links: [{ label: "gdmlamerced.com", href: "https://gdmlamerced.com" }],
	},
	{
		name: {
			en: "NodeBot",
			es: "NodeBot",
		},
		summary: {
			en: "Discord chatbot that reached 3M users across 27,000 servers.",
			es: "Chatbot de Discord que alcanzó 3 millones de usuarios en 27.000 servidores.",
		},
		description: {
			en: "Scalable Discord chatbot built on Node.js and MongoDB. Reached more than 3 million users across 27,000 servers.",
			es: "Chatbot de Discord escalable construido con Node.js y MongoDB. Llegó a más de 3 millones de usuarios en 27.000 servidores.",
		},
		period: { start: 2021, end: 2023 },
		tech: ["Node.js", "MongoDB", "Discord API"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/LyricalString/Node-Discord-Bot/tree/master",
			},
		],
	},
];

function formatPeriod({ start, end }: ProjectPeriod, locale: Locale): string {
	if (end === "present") return `${start} – ${ui[locale]["projects.present"]}`;
	if (end && end !== start) return `${start} – ${end}`;
	return String(start);
}

/** Newest start first; at equal start, the one that lasted longer (or is ongoing) first. */
function compareProjects(a: Project, b: Project): number {
	const endOf = ({ start, end }: ProjectPeriod) =>
		end === "present" ? Number.POSITIVE_INFINITY : (end ?? start);
	return b.period.start - a.period.start || endOf(b.period) - endOf(a.period);
}

export function localizeProject(project: Project, locale: Locale): LocalizedProject {
	return {
		name: project.name[locale],
		summary: project.summary[locale],
		description: project.description[locale],
		period: formatPeriod(project.period, locale),
		periodStart: String(project.period.start),
		tech: project.tech,
		links: project.links,
	};
}

export function getLocalizedProjects(locale: Locale): LocalizedProject[] {
	// Array.prototype.toSorted is stable, so ties keep the order of the array above.
	return projects.toSorted(compareProjects).map((p) => localizeProject(p, locale));
}
