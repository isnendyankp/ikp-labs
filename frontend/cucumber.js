module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/e2e/steps/**/*.ts'],
    format: [
      '@cucumber/pretty-formatter',
      'html:tests/e2e/reports/cucumber-report.html',
      'json:tests/e2e/reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};