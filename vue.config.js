module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        // image loader limit must be changed to allow for proper loading of small images in Phaser 3
        options.limit = 1
        return options
      })
  }
}
