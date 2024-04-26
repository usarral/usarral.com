export interface Project {
  title: string
  techs: string[]
  link: string
  linkText?: string
  isComingSoon?: boolean
}

const projects: Project[] = [
  {
    title: 'La Receta',
    techs: ['Laravel', 'VueJS', 'TailwindCSS'],
    link: '#',
    linkText: 'Github',
    isComingSoon: true

  },
  {
    title: 'PerformSquad',
    techs: ['Javascript', 'Svelte', 'TailwindCSS'],
    link: 'https://github.com/usarral/tfg',
    linkText: 'Github',
    isComingSoon: false
  },
  {
    title: 'Blog Usarral',
    techs: ['Astro'],
    link: '/',
    linkText: 'Web',
    isComingSoon: false
  },
  {
    title: 'RafaelPalmero.com',
    techs: ['NextJS', 'TailwindCSS'],
    link: 'https://rafaelpalmero.com',
    linkText: 'Web',
    isComingSoon: false
  }
]

export default projects
