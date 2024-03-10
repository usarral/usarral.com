import type { TailwindColor } from '@/utils/types/tailwind'

interface Theme {
  colors: {
    primary: TailwindColor
    blur: {
      top: TailwindColor
      bottom: TailwindColor
    }
  }
}

const theme: Theme = {
  colors: {
    primary: 'blue',
    blur: {
      top: 'bluegray',
      bottom: 'bluegray'
    }
  }
}

export default theme
