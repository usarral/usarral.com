export interface Project {
	name: string;
	description: string;
	tech: string[];
	links?: {
		label: string;
		href: string;
	}[];
	role?: string;
}

export const projects: Project[] = [
	{
		name: "Catalonia's e-vineyard registry",
		description:
			"Microservices platform behind the e-RVC, the public registry where grape growers, wineries and regulatory councils manage plantings, harvests and wine-growing potential in Catalonia. 22 microservices in Java 8 and Spring Boot with an Angular 14 frontend. Direct client work for requirements gathering, functional analysis and critical incident resolution. Deployed on Docker, Jenkins and OpenShift.",
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
		role: "Generalitat de Catalunya · Minsait (Indra)",
	},
	{
		name: "Catalan language services platform",
		description:
			"Evolution and maintenance of the legacy applications run by the Catalan language administration — VxL (Voluntariat per la Llengua, the program that pairs Catalan learners with fluent speakers), GestCerCat (Catalan proficiency exam management), LLC (Catalan language resources portal) and RTIJ (sworn translators and interpreters registry) — built on Java 7, Servlets and JSP, deployed on Tomcat 7/9.",
		tech: ["Java 7", "Servlets", "JSP", "Tomcat", "Jenkins"],
		links: [
			{ label: "VxL", href: "https://www.vxl.cat" },
			{ label: "LLC", href: "https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html" },
		],
		role: "Generalitat de Catalunya · Minsait (Indra)",
	},
	{
		name: "SAP ABAP4 · Hotel chains",
		description:
			"Feature development and bug fixing in SAP ABAP4 for large hotel chains, including frontend work in SAP UI5 and integration with workflows based on Node.js 18 and Angular.",
		tech: ["SAP ABAP4", "SAP UI5", "Node.js 18", "Angular"],
		role: "SAP ABAP4 Developer · Minsait (Indra)",
	},
	{
		name: "Various projects at The Box of the Boss",
		description:
			"Web applications and platforms for an events and shows production company, including IoT-based control systems for stage illusion effects using Arduino, WebSockets and Node.js.",
		tech: ["Node.js", "WebSockets", "Arduino", "IoT"],
		links: [{ label: "theboxoftheboss.com", href: "https://theboxoftheboss.com" }],
		role: "Freelance Web Developer",
	},
	{
		name: "GDM La Merced",
		description:
			"Development and maintenance of the website and internal tooling for a local handball club: player management, match calendars and results publishing.",
		tech: ["Node.js", "Web"],
		links: [{ label: "gdmlamerced.com", href: "https://gdmlamerced.com" }],
		role: "Freelance Web Developer",
	},
	{
		name: "usarral.com",
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
		description:
			"Flood detection tool built on Sentinel-1 imagery using Machine Learning with PyTorch. Backend in Node.js, model in Python and frontend in React.",
		tech: ["Node.js", "Python", "PyTorch", "React", "Machine Learning"],
		links: [{ label: "astra5.usarral.com", href: "https://astra5.usarral.com" }],
	},
	{
		name: "NodeBot",
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
		description:
			"Terminal tooling to automate Jenkins pipelines and manage Jira tickets straight from the command line.",
		tech: ["Node.js", "TypeScript", "Jenkins", "Jira"],
		links: [{ label: "GitHub", href: "https://github.com/usarral/butler-ci-cli" }],
	},
];
