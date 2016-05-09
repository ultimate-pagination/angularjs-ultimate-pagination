module.exports = {
  entry: './src/angular-ultimate-pagination.js',
  output: {
    path: './dist',
    library: 'ngUltimatePagination',
    libraryTarget: 'umd',
  },
  externals: ['angular'],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }
};
