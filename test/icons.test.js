const test = require('tape')
const nock = require('nock')
const { fetchFavicons } = require('../')
const testCases = require('./fixtures/icons/test-cases')
const path = require('path')

testCases.forEach(testCase => {
  test(`icons - ${testCase.fileName}`, async t => {
    const exampleUrl = 'http://www.example.com/'
    const scope = nock(exampleUrl)
      .get('/')
      .replyWithFile(200, path.join(__dirname, 'fixtures/icons', testCase.fileName))

    try {
      const actual = await fetchFavicons(exampleUrl, testCase.minSize, testCase)
      t.deepEquals(actual, testCase.response)
    } finally {
      scope.done()
    }
  })
})
