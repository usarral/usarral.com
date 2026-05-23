export interface Project {
	name: string;
	summary: string;
	description: string;
	tech: string[];
	links?: {
		label: string;
		href: string;
	}[];
}

export const projects: Project[] = [
	{
		name: "e-RVC · Catalonia's vineyard registry",
		summary: "Microservices platform for Catalonia's public wine-growing registry.",
		description:
			"Microservices platform behind the e-RVC, the Generalitat de Catalunya's public registry where grape growers, wineries and regulatory councils manage plantings, harvests and wine-growing potential. 22 microservices in Java 8 and Spring Boot with an Angular 14 frontend. Direct client work for requirements gathering, functional analysis and critical incident resolution. Deployed on Docker, Jenkins and OpenShift.",
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
		links: [{ label: "ervc.agricultura.gencat.cat", href: "https://ervc.agricultura.gencat.cat" }],
	},
	{
		name: "Catalan language services platform",
		summary: "Legacy Java apps powering Catalan proficiency exams, translation and resources.",
		description:
			"Evolution and maintenance of the legacy applications run by the Generalitat de Catalunya's language administration — VxL (Voluntariat per la Llengua, the program that pairs Catalan learners with fluent speakers), GestCerCat (Catalan proficiency exam management), LLC (Catalan language resources portal), RTIJ (sworn translators and interpreters registry) and the in-house Apertium-based machine translators for Occitan/Aranese and the rest of the supported language pairs — built on Java 7, Servlets and JSP, deployed on Tomcat 7/9.",
		tech: ["Java 7", "Servlets", "JSP", "Tomcat", "Jenkins", "Apertium"],
		links: [
			{ label: "VxL", href: "https://www.vxl.cat" },
			{ label: "LLC", href: "https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html" },
		],
	},
	{
		name: "SAP ABAP4 · Hotel chains",
		summary: "ABAP4 and UI5 customisations for the ERP of large hotel chains.",
		description:
			"Feature development and bug fixing in SAP ABAP4 for large hotel chains, including frontend work in SAP UI5 and integration with workflows based on Node.js 18 and Angular.",
		tech: ["SAP ABAP4", "SAP UI5", "Node.js 18", "Angular"],
		links: [{ label: "tmsforhotels.com", href: "https://www.tmsforhotels.com/tmshotels" }],
	},
	{
		name: "Various projects at The Box of the Boss",
		summary: "Web platforms and IoT stage effects for an events production company.",
		description:
			"Web applications and platforms for an events and shows production company, including IoT-based control systems for stage illusion effects using Arduino, WebSockets and Node.js.",
		tech: ["Node.js", "WebSockets", "Arduino", "IoT"],
		links: [
			{ label: "theboxoftheboss.com", href: "https://theboxoftheboss.com" },
			{ label: "plandefuga.es", href: "https://plandefuga.es" },
			{ label: "pedrotercero.com", href: "https://pedrotercero.com" },
		],
	},
	{
		name: "GDM La Merced",
		summary: "Website and back-office tooling for a local handball club.",
		description:
			"Development and maintenance of the website and internal tooling for a local handball club: player management, match calendars and results publishing.",
		tech: ["Node.js", "Web"],
		links: [{ label: "gdmlamerced.com", href: "https://gdmlamerced.com" }],
	},
	{
		name: "usarral.com",
		summary: "Personal site and technical blog, statically built with Astro.",
		description:
			"Personal website and technical blog focused on development, Docker deployments, security and systems automation. Static, fast and shipped through a custom CI/CD pipeline.",
		tech: ["Astro", "Node.js", "TailwindCSS", "Docker", "CI/CD"],
		links: [
			{ label: "usarral.com", href: "https://usarral.com" },
			{ label: "GitHub", href: "https://github.com/usarral/usarral.com" },
		],
	},
	{
		name: "Astra5 · NASA Space Apps Challenge",
		summary: "Machine-learning flood detection on Sentinel-1 satellite imagery.",
		description:
			"Flood detection tool built on Sentinel-1 imagery using Machine Learning with PyTorch. Backend in Node.js, model in Python and frontend in React.",
		tech: ["Node.js", "Python", "PyTorch", "React", "Machine Learning"],
		links: [{ label: "astra5.usarral.com", href: "https://astra5.usarral.com" }],
	},
	{
		name: "NodeBot",
		summary: "Discord chatbot that reached 3M users across 27,000 servers.",
		description:
			"Scalable Discord chatbot built on Node.js and MongoDB. Reached more than 3 million users across 27,000 servers.",
		tech: ["Node.js", "MongoDB", "Discord API"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/LyricalString/Node-Discord-Bot/tree/master",
			},
		],
	},
	{
		name: "butler-ci-cli",
		summary: "Terminal tooling to drive Jenkins pipelines from the command line.",
		description: "Terminal tooling to automate Jenkins pipelines straight from the command line.",
		tech: ["Node.js", "TypeScript", "Jenkins"],
		links: [{ label: "GitHub", href: "https://github.com/usarral/butler-ci-cli" }],
	},
];
