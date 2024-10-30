const express = require('express')

const app = express()
app.use(express.json())

const jsdom = require('jsdom')

app.post('/extract', async (req, res) => {
  const { url, selectors } = req.body

  if (!url || typeof selectors !== 'object') {
    return res
      .status(400)
      .json({ error: 'Provided URL or selectors were invelid.' })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch HTML content.')
    const htmlText = await response.text()

    const dom = new jsdom.JSDOM(htmlText)
    const doc = dom.window.document

    const extractedData = {}
    // rules for CSS selectors: `${type-of-element}:${number}-child`
    for (const [key, selector] of Object.entries(selectors)) {
      const selectorType = selector.split(':')[0]
      const selectorNum =
        transformNums(selector.split(':')[1].split('-')[0]) - 1
      const elements = doc.querySelectorAll(selectorType)

      if (elements && selectorNum < elements.length) {
        const tmpElem = elements[selectorNum]
        extractedData[key] = tmpElem.textContent.trim()
      } else {
        extractedData[key] = null
      }
    }

    console.log('🔥Result:', extractedData)
    res.json(extractedData)
  } catch (error) {
    console.error('Error processing the request:', error)
    res.status(500).json({ error: 'Server-side error while processing HTML.' })
  }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

// function-helper to recognize number word
function transformNums(word) {
  let special = [
    'zeroth',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
    'eleventh',
    'twelvth',
    'thirteenth',
    'fourteenth',
    'fifteenth',
    'sixteenth',
    'seventeenth',
    'eighteenth',
    'nineteenth',
  ]
  for (let i = 0; i < special.length; ++i) {
    if (word === special[i]) {
      return i
    }
  }
  return 0
}
