const x = require('x-ray')()
const { URL } = require('url')
const dns = require('dns').promises

const defaults = Object.freeze({
  selectors: Object.freeze([
    'link[rel=apple-touch-icon-precomposed][href]',
    'link[rel=apple-touch-icon][href]',
    'link[rel="shortcut icon"][href]',
    'link[rel=icon][href]',
    'meta[name=msapplication-TileImage][content]',
    'meta[name=twitter\\:image][content]',
    'meta[property=og\\:image][content]'
  ]),

  predicates: Object.freeze([
    (f, s) => f.name === 'apple-touch-icon-precomposed' && f.size >= s,
    (f, s) => f.name === 'apple-touch-icon' && f.size >= s,
    (f, s) => f.name === 'twitter:image' && f.size >= s,
    (f, s) => f.name === 'shortcut icon' && f.size >= s,
    (f, s) => f.name === 'icon' && f.size >= s,
    (f, s) => f.name === 'og:image' && f.size >= s,
    (f, s) => f.name === 'msapplication-TileImage' && f.size >= s,

    (f, s) => f.name === 'apple-touch-icon-precomposed',
    (f, s) => f.name === 'apple-touch-icon',
    (f, s) => f.name === 'twitter:image',
    (f, s) => f.name === 'shortcut icon',
    (f, s) => f.name === 'icon',
    (f, s) => f.name === 'og:image',
    (f, s) => f.name === 'msapplication-TileImage',
    (f, s) => f.name === 'favicon.ico'
  ])
})

function markActiveFavicon (favicons, minSize, config) {
  config = {
    ...defaults,
    ...config
  }
  for (let i = 0; i < config.predicates.length; i++) {
    const result = favicons.find((favicon) => config.predicates[i](favicon, minSize))
    if (result) {
      result.active = true
      break
    }
  }
}

async function getFavicons (url, config) {
  config = {
    ...defaults,
    ...config
  }

  // The version of superagent used by x-ray-crawler is old. It causes an uncaught promise
  // rejection if an URL that points to a non-existent host is passed-in.
  // By resolving the host beforehand we can make sure that the unknown urls are rejected
  // properly.
  const parts = new URL(url)
  await dns.resolve(parts.hostname)

  return await x(url, config.selectors.join(), [{
    href: '@href',
    content: '@content',
    property: '@property',
    rel: '@rel',
    name: '@name',
    sizes: '@sizes'
  }])
}

const emptyDataContents = [
  'data:/,',
  'data:/'
]

function isEmptyData (favicon) {
  if (favicon.href) return emptyDataContents.includes(favicon.href)
  return emptyDataContents.includes(favicon.content)
}

function isNotEmptyData (favicon) {
  return !isEmptyData(favicon)
}

function setFetchFaviconTimeout (ms) {
  return x.timeout(ms)
}

async function fetchFavicon (url, size, config) {
  const favicons = await fetchFavicons(url, size, config)
  const active = favicons.find((favicon) => favicon.active)
  return active.href
}

async function fetchFavicons (url, size, config) {
  let favicons = await getFavicons(url)

  favicons.push({
    href: (new URL('favicon.ico', url)).toString(),
    name: 'favicon.ico'
  })

  favicons = favicons.filter(isNotEmptyData).map((favicon) => {
    const f = {
      href: favicon.href || favicon.content,
      name: favicon.name || favicon.rel || favicon.property,
      size: Math.min.apply(null, (favicon.sizes || '').split(/[^0-9.]+/g)) || undefined
    }

    if (!f.size) {
      delete f.size
    }

    return f
  })

  markActiveFavicon(favicons, size, config)
  return favicons
}

fetchFavicon.fetchFavicon = fetchFavicon
fetchFavicon.fetchFavicons = fetchFavicons
fetchFavicon.setFetchFaviconTimeout = setFetchFaviconTimeout

module.exports = fetchFavicon
