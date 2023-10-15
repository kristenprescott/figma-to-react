import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'
import { buildSpaces } from './buildCode'

export type CssStyle = 'css' | 'styled-components' | 'scss'

function buildClosingCurlies(level: number) {
  let closingCurlies = ''

  for (let i = 0; i < level; i++) {
    closingCurlies += '\n' + buildSpaces(4, level) + '}'
  }

  return closingCurlies
}

function buildChildScssString(tag: Tag, cssStyle: CssStyle, level: number, cssData: CSSData): string {
  const hasChildren = tag.children.length > 0
  const spaceString = buildSpaces(4, level)

  if (hasChildren) {
    return '\n' + tag.children.map((child) => spaceString + buildScssString(child, cssStyle, level + 1, cssData)).join('\n')
  }

  return ''
}

function buildScssString(tag: Tag, cssStyle: CssStyle, level: number, cssData: CSSData) {
  if (!tag) {
    return ''
  }

  const hasChildren = tag.children.length > 0
  const spaceString = buildSpaces(4, level)

  const openingBlock =
    `.${buildClassName(cssData?.className)} {
${spaceString}${cssData.properties.map((prop) => `${spaceString}${prop.name}: ${prop.value};`).join('\n')}` + '\n'
  const childBlocks = buildChildScssString(tag, cssStyle, level, cssData)
  const closingBlock = hasChildren ? spaceString + '\n' : spaceString + '}' + '\n\n'

  return spaceString + openingBlock + childBlocks + closingBlock
}

function buildArray(tag: Tag, arr: CSSData[]): CSSData[] {
  if (!tag.isComponent) {
    arr.push(tag.css)
  }

  tag.children.forEach((child) => {
    arr = buildArray(child, arr)
  })

  return arr
}

export function buildCssString(tag: Tag, cssStyle: CssStyle): string {
  let codeStr = ''
  const cssArray = buildArray(tag, [])

  if (!cssArray) {
    return codeStr
  }

  cssArray.forEach((cssData, i) => {
    if (!cssData || cssData.properties.length === 0) {
      return
    }

    const cssStr =
      cssStyle === 'styled-components'
        ? `const ${cssData?.className.replace(/\s/g, '')} = styled.div\`
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
\`\n`
        : cssStyle === 'css'
        ? `.${buildClassName(cssData?.className)} {
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
}\n\n`
        : cssStyle === 'scss'
        ? buildScssString(tag, cssStyle, 0, cssData) + buildClosingCurlies(i)
        : ''

    codeStr += cssStr
  })

  return codeStr
}
