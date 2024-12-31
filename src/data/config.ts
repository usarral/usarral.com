import type MenuItem from "@lib/interfaces/MenuItem";
import type Project from "@lib/interfaces/Project";

export const SITE_TITLE = "Usarral | Software Developer";
export const SITE_TITLE_SHORT = "Usarral";
export const SITE_URL = "https://usarral.com";
export const NAME = "Carlos";
export const TWITTER_AUTHOR = "@usarral_";
export const SUBTITLE = "Software Developer";
export const SITE_DESCRIPTION =
  "Articles, resources y tutorials about Web Development, Backend, Typescript, Java ☕, DDD, Web Performance,...";
export const PERSONAL_DESCRIPTION = `
  I'm a software developer based in Spain, with experience in web development. 
  I'm passionate about technology and I love to learn new things. I'm always looking for new challenges and opportunities to grow as a professional.
  I work with technologies like Spring Boot, Angular, TypeScript, NestJS, PHP, and more.
`;
export const GENERATE_SLUG_FROM_TITLE = true;

export const TRANSITION_API = true;

export const MENU_ITEMS: MenuItem[] = [
  {
    Page: "Home",
    Link: "/",
    id: "home",
  },
  {
    Page: "Projects",
    Link: "/projects",
    id: "projects",
  },
  {
    Page: "Blog",
    Link: "/blog",
    id: "blog",
  },
  {
    Page: "Resume",
    Link: "/resume",
    id: "resume",
  },
  //{
  //  Page: "Contact",
  //  Link: "/contact",
  //  id: "contact",
  //},
];

export const PROJECTS: Project[] = [
  {
    title: "GDM La Merced",
    image: "gdmlamerced.webp",
    techs: ["Astro", "Typescript"],
    link: "https://gdmlamerced.com",
    description:
      "Website of a handball club from Corella, Spain, where information about the club, teams, competitions, etc. is shown.",
    isComingSoon: false,
    postDate: "2024-08-01",
  },
  {
    title: "Blog | Usarral",
    image: "usarral.png",
    techs: ["Astro"],
    link: "https://old.usarral.com",
    description:
      "This is my personal blog, where I post about software development, architecture, different technologies, and more.",
    isComingSoon: false,
    refactoring: true,
  },
  {
    title: "La Receta",
    image: "lareceta.png",
    techs: ["NestJS", "TypeScript"],
    description:
      "Platform to share recipes, tips and tricks about cooking, baking and more. The platform is still in development.",
    link: "#",
    isComingSoon: true,
  },
  {
    title: "Aszendix",
    image: "aszendix.png",
    techs: ["Express", "TypeScript", "Angular"],
    description: "CRM for small and medium businesses",
    link: "#",
    isComingSoon: true,
  },
  {
    title: "PerformSquad",
    image: "performsquad.png",
    description: "A platform to help you improve your league management",
    techs: ["Express", "TypeScript"],
    link: "#",
    isComingSoon: true,
  },
];
export const SOCIALS = [
  {
    title: "GitHub",
    link: "https://github.com/usarral",
    icon: "github",
  },
  {
    title: "LinkedIn",
    link: "https://linkedin.com/in/usarral",
    icon: "linkedin",
  },
  {
    title: "Email",
    link: "mailto:cv@usarral.com",
    icon: "mail",
  },
  {
    title: "RSS",
    link: "/rss.xml",
    icon: "rss",
  }
];
export const WORK_EXPERIENCE = [
  {
    title: "Fullstack Java Developer",
    subtitle: "July 2023 - Present at Minsait (Indra), [Remote, Spain]",
    description: `
Initially, I worked with Java 7, Java Servlets, and JSP, deploying applications on Tomcat 7 and 9, where I maintained and developed new features for a government client's customer culture project.`,
    description2: `Currently, I am working with Java 8, Spring Boot, and Angular 14 (TypeScript) deploying with Jenkins, Openshift and Docker, developing microservices for a government client's agriculture project.`,
    description3: `On both projects I have worked with technologies like Git, Jira, Confluence, Oracle Database, and more.`,
  },
  {
    title: "SAP ABAP4 Developer",
    subtitle: "April 2023 - June 2024 at Minsait (Indra), [Remote, Spain]",
    description: `
    I worked with SAP ABAP4, developing new features and fixing bugs for a hotel chain project. I also worked with SAP UI5, developing new features for the same project.`,
  },
  {
    title: "Web Developer",
    subtitle:
      "September 2018 - November 2022 at Ilusionista Pedro III, [Tudela, Spain]",
    description: `
    I developed and maintained the website of the magician Pedro III, where I implemented new features, fixed bugs, and more.`,
    description2: `I also developed internal tools for the company.`,
  },
  {
    title: "Application Developer",
    subtitle: "March 2021 - June 2021 at Valortic, [Cintruénigo, Spain]",
    description: `
    I worked with the Power Platform environment, developing utilities, creating flows with Power Automate, R&D of proof of concepts with Power Apps, and more.`,
    description2: `I also developed utilities such as internal APIs, database management pages, etc., based on Office 365, SharePoint...`,
  },
];
export const EDUCATION = [
  {
    title: "Higher Technician in Web Application Development",
    subtitle: "2021 to 2023 at CPIFP Los Enlaces, Zaragoza, Spain",
  },
  {
    title: "Technician in Microcomputer Systems and Networks",
    subtitle: "2019 to 2021 at CIP ETI Tudela, Tudela, Spain",
  },
];
export const FEATURED = [
  {
    title: "NodeBot",
    link: "https://github.com/LyricalString/Node-Discord-Bot",
    description:
      "NodeBot was a Discord bot that allows you to play music, moderate your server, and more. It was used in more than 27.000 servers and had more than 3M users.",
  },
  {
    title: "AragonSkills",
    link: "https://skills.aragon.es/",
    description: `I participated in the AragonSkills 2023 competition representing CPIFP Los Enlaces in the Web Development category. I got the 3rd place in the competition.`,
  },
];
