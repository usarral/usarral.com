interface Social {
  label: string
  link: string
}

interface Presentation {
  mail: string
  title: string
  description: string
  socials: Social[]
  profile?: string
}

const presentation: Presentation = {
  mail: 'carlos@usarral.com',
  title: 'Hi, I’m Carlos 👋',
  // profile: "/profile.webp",
  description:
    "Hi, i'm a *spanish fullstack developer* with over *3 years* of web experience. I am currently working with *PHP, Java and Typescript*. Outside of work I learn new technologies and work on personal projects. I am passionate about *open source* and *community building*.",
  socials: [
    {
      label: 'X',
      link: 'https://twitter.com/usarral_dev'
    },
    {
      label: 'LinkedIn',
      link: 'https://linkedin.com/in/usarral'
    },
    {
      label: 'Github',
      link: 'https://github.com/usarral'
    }
  ]
}

export default presentation
