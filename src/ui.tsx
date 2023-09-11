import * as React from 'react'
import * as ReactDom from 'react-dom'
import { CssStyle } from './buildCssString'
import { UnitType } from './buildSizeStringByUnit'
import { messageTypes } from './messagesTypes'
import styles from './ui.css'
import Spacer from './ui/Spacer'
import UserComponentSettingList from './ui/UserComponentSettingList'
import { UserComponentSetting } from './userComponentSetting'

function escapeHtml(str: string) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

// I tried to use highlight.js https://highlightjs.readthedocs.io/en/latest/index.html
// but didn't like the color. so I give it a go for this dirty style💪
function insertSyntaxHighlightText(text: string) {
  return text
    .replaceAll('const', `const <span class="${styles.variableName}">`)
    .replaceAll(': FunctionComponent', `</span>: FunctionComponent`)
    .replaceAll('= styled.', `</span>= styled.`)
    .replaceAll('FunctionComponent', `<span class="${styles.typeText}">FunctionComponent</span>`)
    .replaceAll('props', `<span class="${styles.typeText}">props</span>`)
    .replaceAll('styles', `<span class="${styles.typeText}">styles</span>`)
    .replaceAll('body ', `<span class="${styles.elemText}">body </span>`)
    .replaceAll('/body', `<span class="${styles.elemText}">body</span>`)
    .replaceAll('div ', `<span class="${styles.elemText}">div </span>`)
    .replaceAll('/div', `<span class="${styles.elemText}">div</span>`)
    .replaceAll('p ', `<span class="${styles.elemText}">p </span>`)
    .replaceAll('/p', `<span class="${styles.elemText}">p</span>`)
    .replaceAll('ul ', `<span class="${styles.elemText}">ul </span>`)
    .replaceAll('/ul', `<span class="${styles.elemText}">ul</span>`)
    .replaceAll('li ', `<span class="${styles.elemText}">li </span>`)
    .replaceAll('/li', `<span class="${styles.elemText}">li</span>`)
    .replaceAll('img ', `<span class="${styles.elemText}">img </span>`)
    .replaceAll('button ', `<span class="${styles.elemText}">button </span>`)
    .replaceAll('/button', `<span class="${styles.elemText}">button</span>`)
    .replaceAll('h1 ', `<span class="${styles.elemText}">h1 </span>`)
    .replaceAll('/h1', `<span class="${styles.elemText}">h1</span>`)
    .replaceAll('h2 ', `<span class="${styles.elemText}">h2 </span>`)
    .replaceAll('/h2', `<span class="${styles.elemText}">h2</span>`)
    .replaceAll('h3 ', `<span class="${styles.elemText}">h3 </span>`)
    .replaceAll('/h3', `<span class="${styles.elemText}">h3</span>`)
    .replaceAll('h4 ', `<span class="${styles.elemText}">h4 </span>`)
    .replaceAll('/h4', `<span class="${styles.elemText}">h4</span>`)
    .replaceAll('h5 ', `<span class="${styles.elemText}">h5 </span>`)
    .replaceAll('/h5', `<span class="${styles.elemText}">h5</span>`)
    .replaceAll('h6 ', `<span class="${styles.elemText}">h6 </span>`)
    .replaceAll('/h6', `<span class="${styles.elemText}">h6</span>`)
    .replaceAll('input ', `<span class="${styles.elemText}">input </span>`)
    .replaceAll('/input', `<span class="${styles.elemText}">input</span>`)
    .replaceAll('return', `<span class="${styles.returnText}">return</span>`)
    .replaceAll(': ', `<span class="${styles.expressionText}">: </span>`)
    .replaceAll('= ()', `<span class="${styles.expressionText}">= ()</span>`)
    .replaceAll('{', `<span class="${styles.expressionText}">{</span>`)
    .replaceAll('}', `<span class="${styles.expressionText}">}</span>`)
    .replaceAll('(', `<span class="${styles.expressionText}">(</span>`)
    .replaceAll(')', `<span class="${styles.expressionText}">)</span>`)
    .replaceAll('&lt;', `<span class="${styles.tagText}">&lt;</span><span class="${styles.tagNameText}">`)
    .replaceAll('&gt;', `</span><span class="${styles.tagText}">&gt;</span>`)
    .replaceAll('=</span><span class="tag-text">&gt;</span>', `<span class="${styles.defaultText}">=&gt;</span>`)
    .replaceAll('.div', `<span class="${styles.functionText}">.div</span>`)
    .replaceAll('`', `<span class="${styles.stringText}">${'`'}</span>`)
}

function insertCssSyntaxHighlightText(text: string) {
  return (
    text
      .replaceAll('.', `.<span class="${styles.variableName}">`)
      .replaceAll(';', `;</span>`)
      // .replaceAll(':', `: <span class="${styles.testText}">`)
      .replaceAll(': ', `<span class="${styles.expressionText}">: </span>`)
      .replaceAll('{', `<span class="${styles.expressionText}">{</span>`)
      .replaceAll('}', `<span class="${styles.expressionText}">}</span>`)
      .replaceAll('(', `<span class="${styles.expressionText}">(</span>`)
      .replaceAll(')', `<span class="${styles.expressionText}">)</span>`)
      .replaceAll('&lt;', `<span class="${styles.tagText}">&lt;</span><span class="${styles.tagNameText}">`)
      .replaceAll('&gt;', `</span><span class="${styles.tagText}">&gt;</span>`)
      .replaceAll('=</span><span class="tag-text">&gt;</span>', `<span class="${styles.defaultText}">=&gt;</span>`)
      .replaceAll('`', `<span class="${styles.stringText}">${'`'}</span>`)
  )
}

const cssStyles: { value: CssStyle; label: string }[] = [
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS(future)' },
  { value: 'styled-components', label: 'styled-components' }
]

const unitTypes: { value: UnitType; label: string }[] = [
  { value: 'px', label: 'px' },
  { value: 'rem', label: 'rem' },
  { value: 'remAs10px', label: 'rem(as 10px)' }
]

const App: React.VFC = () => {
  // const [downloadLink, setDownloadLink] = React.useState('')
  const [code, setCode] = React.useState('')
  const [cssCode, setCssCode] = React.useState('')
  const [selectedCssStyle, setCssStyle] = React.useState<CssStyle>('css')
  const [selectedUnitType, setUnitType] = React.useState<UnitType>('px')
  const [userComponentSettings, setUserComponentSettings] = React.useState<UserComponentSetting[]>([])
  const textCodeRef = React.useRef<HTMLTextAreaElement>(null)
  const textCssRef = React.useRef<HTMLTextAreaElement>(null)

  const copyCodeToClipboard = () => {
    if (textCodeRef.current) {
      textCodeRef.current.select()
      document.execCommand('copy')

      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const copyCssToClipboard = () => {
    if (textCssRef.current) {
      textCssRef.current.select()
      document.execCommand('copy')

      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const notifyChangeCssStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-css-style-set', cssStyle: event.target.value as CssStyle }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyChangeUnitType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-unit-type-set', unitType: event.target.value as UnitType }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyUpdateComponentSettings = (userComponentSettings: UserComponentSetting[]) => {
    const msg: messageTypes = { type: 'update-user-component-settings', userComponentSettings: userComponentSettings }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const onAddUserComponentSetting = (userComponentSetting: UserComponentSetting) => {
    notifyUpdateComponentSettings([...userComponentSettings, userComponentSetting])
  }

  const onUpdateUserComponentSetting = (userComponentSetting: UserComponentSetting, index: number) => {
    const newUserComponentSettings = [...userComponentSettings]
    newUserComponentSettings[index] = userComponentSetting
    notifyUpdateComponentSettings(newUserComponentSettings)
  }

  const onDeleteUserComponentSetting = (name: string) => {
    notifyUpdateComponentSettings(userComponentSettings.filter((setting) => setting.name !== name))
  }

  const syntaxHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(code)), [code])
  // TODO: Add syntax highlighting to CSS
  // const syntaxCssHighlightedCode = React.useMemo(() => insertCssSyntaxHighlightText(escapeHtml(cssCode)), [cssCode])
  const syntaxCssHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(cssCode)), [cssCode])

  // const exportReactComponent = () => {
  //   // TODO: Save code to computer
  //   if (textCodeRef.current) {
  //     const textData: string = textCodeRef.current.select()
  //     const data = new Blob([textData as BlobPart], { type: 'text/plain'})
  //     // const fileData = JSON.stringify(textCodeRef.current)
  //     // const blob = new Blob([fileData], { type: 'text/plain' })
  //     // const url = URL.createObjectURL(blob)
  //     // const link = document.createElement('a')
  //     // link.download = 'user-info.json'
  //     // link.href = url
  //     // link.click()

  //     // const msg: messageTypes = { type: 'notify-save-success' }
  //     // parent.postMessage(msg, '*')
  //   }
  // }

  const exportCssModule = () => {
    // TODO: Save css to computer
  }

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      setCssStyle(event.data.pluginMessage.cssStyle)
      setUnitType(event.data.pluginMessage.unitType)
      const codeStr = event.data.pluginMessage.generatedCodeStr
      const cssStr = event.data.pluginMessage.cssString
      setCode(codeStr)
      setCssCode(cssStr)
      setUserComponentSettings(event.data.pluginMessage.userComponentSettings)
    }
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.code}>
        <h2 className={styles.codeHeading}>React Component</h2>
        <textarea className={styles.textareaForClipboard} ref={textCodeRef} value={code} readOnly />
        <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} />

        <Spacer axis="vertical" size={12} />

        <div className={styles.buttonLayout}>
          <button className={styles.copyButton} onClick={copyCodeToClipboard}>
            Copy React to clipboard
          </button>
          <Spacer axis="horizontal" size={24} />
          <button
            disabled
            // className={`${styles.exportButton}`}
            className={`${styles.exportButton} ${styles.disabledButton}`}
            // onClick={exportReactComponent}
            onClick={() => {
              console.log('export react component')
            }}
          >
            {/* <a download="test.tsx" href={downloadLink}> */}
            Export React code
            {/* </a> */}
          </button>
        </div>

        <h2 className={styles.codeHeading}>CSS module</h2>
        <textarea className={styles.textareaForClipboard} ref={textCssRef} value={cssCode} readOnly />
        <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxCssHighlightedCode }} />

        <Spacer axis="vertical" size={12} />

        <div className={styles.buttonLayout}>
          <button className={styles.copyButton} onClick={copyCssToClipboard}>
            Copy CSS to clipboard
          </button>
          <Spacer axis="horizontal" size={24} />
          <button
            disabled
            className={`${styles.exportButton} ${styles.disabledButton}`}
            onClick={() => {
              console.log('export css module')
            }}
          >
            Export CSS module
          </button>
        </div>
      </div>

      <div className={styles.settings}>
        <h2 className={styles.heading}>Settings</h2>

        <Spacer axis="vertical" size={12} />

        <div className={styles.optionList}>
          {cssStyles.map((style) => (
            <div key={style.value} className={styles.option}>
              <input type="radio" name="css-style" id={style.value} value={style.value} checked={selectedCssStyle === style.value} onChange={notifyChangeCssStyle} />
              <label htmlFor={style.value}>{style.label}</label>
            </div>
          ))}
        </div>

        <Spacer axis="vertical" size={12} />

        <div className={styles.optionList}>
          {unitTypes.map((unitType) => (
            <div key={unitType.value} className={styles.option}>
              <input type="radio" name="unit-type" id={unitType.value} value={unitType.value} checked={selectedUnitType === unitType.value} onChange={notifyChangeUnitType} />
              <label htmlFor={unitType.value}>{unitType.label}</label>
            </div>
          ))}
        </div>

        <Spacer axis="vertical" size={12} />

        <UserComponentSettingList
          settings={userComponentSettings}
          onAdd={onAddUserComponentSetting}
          onDelete={onDeleteUserComponentSetting}
          onUpdate={onUpdateUserComponentSetting}
        />
      </div>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
