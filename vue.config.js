const path = require('path')

module.exports = {
  configureWebpack: {
    entry: './example/main.js',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'example')
      }
    }
  }
}
