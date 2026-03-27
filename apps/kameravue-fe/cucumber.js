module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["../tests/gherkin/steps/**/*.ts"],
    format: [
      "@cucumber/pretty-formatter",
      "html:../tests/gherkin/reports/cucumber-report.html",
      "json:../tests/gherkin/reports/cucumber-report.json",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
  },
};
