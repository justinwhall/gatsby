// Hot reload gatsby-plugin-typography in development

let ReactDOMServer = null
let React = null
let GoogleFont = null
let typography = null

if (process.env.BUILD_STAGE === `develop`) {
  ReactDOMServer = require(`react-dom/server`)
  React = require(`react`)
  GoogleFont = require(`react-typography`).GoogleFont
  // typography links to the file set in "pathToConfigModule"
  typography = require(`./.cache/typography.js`).default

  exports.onClientEntry = () => {
    // Inject the CSS Styles
    typography.injectStyles()

    // Hot reload Google CDN links
    if (typography.options.googleFonts.length > 0) {
      if (typeof document !== `undefined`) {
        // Construct the <link /> tag
        const googleFonts = ReactDOMServer.renderToStaticMarkup(
          <GoogleFont key={`GoogleFont`} typography={typography} />
        )
        // Parse the tag
        let doc = new DOMParser().parseFromString(googleFonts, `text/html`)
        let linkElement = doc.head.firstChild
        // Add custom identifier
        linkElement.setAttribute(`data-gatsby-typography`, `true`)
        const head = document.getElementsByTagName(`head`)[0]
        const elem = document.querySelector(`[data-gatsby-typography]`)
        // Remove old <link /> tag
        if (elem) {
          elem.remove()
        }
        head.appendChild(linkElement)
      }
    }
  }
}
