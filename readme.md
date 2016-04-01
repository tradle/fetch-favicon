# ![fetch-favicon](/img/logo.png)

[![Circle CI](https://circleci.com/gh/meltwater/fetch-favicon.svg?style=svg&circle-token=58431fbfc2ecc57479f4b9255afb806ccff83c6b)](https://circleci.com/gh/meltwater/fetch-favicon)
[![Dependency Status](https://david-dm.org/meltwater/fetch-favicon.svg)](https://david-dm.org/meltwater/fetch-favicon)
[![devDependency Status](https://david-dm.org/meltwater/fetch-favicon/dev-status.svg)](https://david-dm.org/meltwater/fetch-favicon#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

Favicons can be difficult. They come in several different formats, no page seems to have them all, and it is hard to know which one to use when you want the best. `fetch-favicon` takes the complexity out by finding them all and choosing the best.

## Installation

```
npm install @meltwater/fetch-favicon
```

## Using fetch-favicon
### getFavicon(url, [size])

```javascript
const getFavicon = require('@meltwater/fetch-favicon')

getFavicon('https://www.github.com')

/*
'https://github.com/apple-touch-icon.png'
*/
```
#### Arguments
- __url__: the address of the web page to be searched for favicons
- __size__: _(optional)_ an integer that represents a prefered minimum width/height of the favicon. If none of the retrieved favicons meet this constraint or the size information is not available, fetch-favicon will still return a favicon.

- __returns__: the address of a favicons. If no favicons are found it will return the address of the `favicon.ico` off of the root (i.e. `https://www.github.com/favicon.ico`)

### getFavicons(url)

```javascript
const getFavicons = require('@meltwater/fetch-favicon')

getFavicons('https://www.github.com')

/*
[
  {"href":"http://github.com/apple-touch-icon.png","name":"apple-touch-icon"},
  {"href":"http://github.com/apple-touch-icon-57x57.png","name":"apple-touch-icon","size":57,"active":true},
  {"href":"http://github.com/apple-touch-icon-60x60.png","name":"apple-touch-icon","size":60},
  {"href":"http://github.com/apple-touch-icon-72x72.png","name":"apple-touch-icon","size":72},
  {"href":"http://github.com/apple-touch-icon-76x76.png","name":"apple-touch-icon","size":76},
  {"href":"http://github.com/apple-touch-icon-114x114.png","name":"apple-touch-icon","size":114},
  {"href":"http://github.com/apple-touch-icon-120x120.png","name":"apple-touch-icon","size":120},
  {"href":"http://github.com/apple-touch-icon-144x144.png","name":"apple-touch-icon","size":144},
  {"href":"http://github.com/apple-touch-icon-152x152.png","name":"apple-touch-icon","size":152},
  {"href":"http://github.com/apple-touch-icon-180x180.png","name":"apple-touch-icon","size":180},
  {"href":"https://assets-cdn.github.com/images/modules/open_graph/github-logo.png","name":"og:image"},
  {"href":"https://assets-cdn.github.com/images/modules/open_graph/github-mark.png","name":"og:image"},
  {"href":"https://assets-cdn.github.com/images/modules/open_graph/github-octocat.png","name":"og:image"},
  {"href":"/windows-tile.png","name":"msapplication-TileImage"},
  {"href":"https://assets-cdn.github.com/favicon.ico","name":"icon"},
  {"href":"http://github.com/favicon.ico","name":"favicon.ico"}
]
*/
```
#### Arguments
- __url__: the address of the web page to be searched for favicons
- __size__: _(optional)_ an integer that represents a prefered minimum width/height of the favicon.

- __returns__: an array of all the favicons found on the web page.
  - _href_: _(string)_ location of the favicon image
  - _name_: _(string)_ type of favicon
  - _size_: _(int)_ size of favicon (if available)
  - _active_: _(bool)_ `true` for the favicon returned by `getFavicon`. `undefined` for all others.

## Contributing

## Additional Information

- [favicon-cheat-sheet](https://github.com/audreyr/favicon-cheat-sheet) is a great resource for understanding all the idiosyncrasies of favicons.

## License

MIT
