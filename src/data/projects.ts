export interface Project {
  title: string
  techs: string[]
  link: string
  isComingSoon?: boolean
}

const projects: Project[] = [
  {
    title: 'Aszendix',
    techs: ['Express', 'Typescript', 'Angular'],
    link: '#',
    isComingSoon: true
  },
  {
    title: 'PerformSquad',
    techs: ['Express', 'TypeScript'],
    link: '#',
    isComingSoon: true
  },
  {
    title: 'Blog Usarral',
    techs: ['Astro'],
    link: '/posts',
    isComingSoon: false
  },
  {
    title: 'RafaelPalmero.com',
    techs: ['NextJS', 'TailwindCSS'],
    link: 'https://rafaelpalmero.com',
    isComingSoon: false
  }
]

export default projects
