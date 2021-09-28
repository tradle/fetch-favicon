const test = require('tape')
const nock = require('nock')
const fetchFavicon = require('../')
const testCases = require('./fixtures/icon/test-cases')
const path = require('path')

testCases.forEach(testCase => {
  test(`icon - ${testCase.fileName}`, async t => {
    const exampleUrl = 'http://example.com/'
    const scope = nock(exampleUrl)
      .get('/')
      .replyWithFile(200, path.join(__dirname, 'fixtures/icon', testCase.fileName))

    try {
      const actual = await fetchFavicon(exampleUrl, testCase.minSize, testCase)
      t.equals(actual, testCase.response)
    } finally {
      scope.done()
    }
  })
})

test('non existant domain', async t => {
  try {
    await fetchFavicon('https://foo.bar.foo_non-existant_domain.com')
  } catch (err) {
    if (err.code !== 'ENOTFOUND') {
      throw err
    }
    return
  }
  t.fail('unexpected pass')
})