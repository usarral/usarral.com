export type ProjectCategory = "professional" | "freelance" | "personal";

export interface Project {
	name: string;
	description: string;
	tech: string[];
	links?: {
		label: string;
		href: string;
	}[];
	category: ProjectCategory;
	role?: string;
	period?: string;
}

export const projects: Project[] = [
	{
		name: "AM16 Agricultura",
		description:
			"Arquitectura de microservicios para una administración pública del sector agrícola: 22 microservicios en Java 8 y Spring Boot, con frontend en Angular 14. Toma de requisitos directamente con cliente, análisis funcional y resolución de incidencias críticas. Despliegue y mantenimiento sobre Docker, Jenkins y OpenShift.",
		tech: [
			"Java 8",
			"Spring Boot",
			"Angular 14",
			"Node.js 18",
			"Docker",
			"Jenkins",
			"OpenShift",
			"Git",
			"Jira",
		],
		category: "professional",
		role: "Desarrollador Fullstack Java · Minsait (Indra)",
		period: "07/2023 — Actualidad",
	},
	{
		name: "AM16 Cultura",
		description:
			"Evolución y mantenimiento de aplicaciones legacy del sector cultural basadas en Java 7, Servlets y JSP, desplegadas sobre Tomcat 7/9.",
		tech: ["Java 7", "Servlets", "JSP", "Tomcat", "Jenkins"],
		category: "professional",
		role: "Desarrollador Fullstack Java · Minsait (Indra)",
		period: "07/2023 — Actualidad",
	},
	{
		name: "SAP ABAP4 · Cadenas hoteleras",
		description:
			"Desarrollo de funcionalidades y corrección de errores en SAP ABAP4 para grandes cadenas hoteleras, incluyendo frontend en SAP UI5 e integración con flujos de trabajo basados en Node.js 18 y Angular.",
		tech: ["SAP ABAP4", "SAP UI5", "Node.js 18", "Angular"],
		category: "professional",
		role: "Desarrollador SAP ABAP4 · Minsait (Indra)",
		period: "04/2023 — 06/2023",
	},
	{
		name: "I+D para espectáculos y eventos",
		description:
			"Desarrollo de aplicaciones y plataformas web para una empresa de producción de eventos y espectáculos, incluyendo sistemas de control para efectos de ilusionismo basados en IoT (Arduino), WebSockets y Node.js.",
		tech: ["Node.js", "WebSockets", "Arduino", "IoT"],
		category: "freelance",
		role: "Web Developer · Freelance",
		period: "09/2018 — Actualidad",
	},
	{
		name: "GDM La Merced",
		description:
			"Desarrollo y mantenimiento de la web y herramientas internas del club de balonmano local: gestión de jugadores, calendarios de partidos y publicación de resultados.",
		tech: ["Node.js", "Web"],
		links: [{ label: "gdmlamerced.com", href: "https://gdmlamerced.com" }],
		category: "freelance",
		role: "Web Developer · Freelance",
		period: "09/2018 — Actualidad",
	},
	{
		name: "usarral.com",
		description:
			"Web personal y blog técnico centrado en divulgación sobre desarrollo, despliegue en Docker, seguridad y automatización de sistemas. Estática, rápida y desplegada con CI/CD propio.",
		tech: ["Astro", "Node.js", "TailwindCSS", "Docker", "CI/CD"],
		links: [
			{ label: "usarral.com", href: "https://usarral.com" },
			{ label: "GitHub", href: "https://github.com/usarral/usarral.com" },
		],
		category: "personal",
	},
	{
		name: "Astra5 · NASA Space Apps Challenge",
		description:
			"Herramienta de detección de inundaciones a partir de imágenes Sentinel-1, aplicando Machine Learning con PyTorch. Backend en Node.js, modelo en Python y frontend en React.",
		tech: ["Node.js", "Python", "PyTorch", "React", "Machine Learning"],
		links: [{ label: "astra5.usarral.com", href: "https://astra5.usarral.com" }],
		category: "personal",
	},
	{
		name: "NodeBot",
		description:
			"Chatbot escalable para Discord construido sobre Node.js y MongoDB. Alcanzó más de 3 millones de usuarios en 27.000 servidores.",
		tech: ["Node.js", "MongoDB", "Discord API"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/LyricalString/Node-Discord-Bot/tree/master",
			},
		],
		category: "personal",
	},
	{
		name: "butler-ci-cli",
		description:
			"Utilidades de terminal para automatizar pipelines en Jenkins y gestionar tickets en Jira desde la línea de comandos.",
		tech: ["Node.js", "TypeScript", "Jenkins", "Jira"],
		category: "personal",
	},
	{
		name: "Sistemas en desarrollo",
		description:
			"Arquitectura de aplicaciones para rutinas de ejercicio y webs corporativas, explorando distintos frameworks de servidor y de UI sobre PostgreSQL.",
		tech: ["Node.js", "NestJS", "Next.js", "Svelte", "Astro", "PostgreSQL"],
		category: "personal",
	},
];

export const categoryMeta: Record<ProjectCategory, { title: string; description: string }> = {
	professional: {
		title: "Experiencia profesional",
		description: "Proyectos desarrollados como parte de mi trabajo a tiempo completo.",
	},
	freelance: {
		title: "Freelance e I+D",
		description: "Clientes y trabajos por cuenta propia, desde web hasta IoT en directo.",
	},
	personal: {
		title: "Proyectos personales",
		description: "Side projects, herramientas y experimentos que mantengo o he mantenido.",
	},
};

export const categoryOrder: ProjectCategory[] = ["professional", "freelance", "personal"];
