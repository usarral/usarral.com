export interface Project {
  title: string
  techs: string[]
  link: string
  isComingSoon?: boolean
}

const projects: Project[] = [
  {
    title: 'La Receta',
    techs: ['Laravel', 'VueJS', 'TailwindCSS'],
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
  }
]

export default projects
