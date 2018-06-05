module.exports = function(config) {
  config.set({

    frameworks: ["jasmine", "karma-typescript"],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-typescript'),
      require('karma-coverage')
    ],
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    files: [
      { pattern: "src/test.ts" },
      { pattern: "src/**/*.+(ts|html)" }
    ],

    preprocessors: {
      "**/*.ts": ["karma-typescript"],
      "**/**/*.js": ["coverage"]
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          require("karma-typescript-angular2-transform")
        ]
      },
      compilerOptions: {
        lib: ["ES2015", "DOM"]
      }
    },

    reporters: ["progress", "kjhtml"],

    browsers: ["Chrome"]
  });
};