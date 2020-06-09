'use strict'

const x = require('x-ray')()
const config = require('./config')
const markActiveFavicon = require('./markActiveFavicon').default
const Url = require('url')

function getFavicons (url) {
  return x(url, config.selectors.join(), [{
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

export { fetchFavicon as default, setFetchFaviconTimeout }

export
function fetchFavicon (url, size) {
  return fetchFavicons(url, size)
  .then((favicons) => {
    const active = favicons.find((favicon) => favicon.active)
    return active.href
  })
}

export
function fetchFavicons (url, size) {
  return new Promise(function (resolve, reject) {
    getFavicons(url)((err, favicons) => {
      if (err) {
        return reject(err)
      }

      favicons.push({
        href: Url.resolve(url, 'favicon.ico'),
        name: 'favicon.ico'
      })

      favicons = favicons.filter(isNotEmptyData).map((favicon) => {
        const f = {
          href: favicon.href || favicon.content,
          name: favicon.name || favicon.rel || favicon.property,
          size: Math.min.apply(null, (favicon.sizes || '').split(/[^0-9\.]+/g)) || undefined
        }

        if (!f.size) {
          delete f.size
        }

        return f
      })

      markActiveFavicon(favicons, size)
      return resolve(favicons)
    })
  })
}
