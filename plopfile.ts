import { NodePlopAPI } from 'plop'

import route from './plop-templates/route'

const generator = async (plop: NodePlopAPI): Promise<void> => {
  // await plop.load("@bradgarropy/plop-helper-includes")

  plop.setHelper('includes', (array, string, options) => {
    const arr = string.split('|')
    if (arr.length > 1) {
      for (const s of arr) {
        if (array.includes(s)) {
          return options.fn(this)
        }
      }
      return options.inverse(this)
    } else if (array.includes(string)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  })
  plop.setDefaultInclude({ helpers: true })

  plop.setDefaultInclude({ generators: true })
  plop.setGenerator('route', route)
}

export default generator
