const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

require('dotenv').config()

module.exports = (env, agrv) => {
  const isDev = agrv.mode === 'development'
  const isAnalyze = process.env.BUILD_TOOL_ENABLE_BUNDLE_ANALYZER === 'true'
  const commonLibs = ['react', 'react-dom', 'react-redux', 'redux']
  const basePlugins = [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      minify: {
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      templateParameters: {
        BUILD_TIME: new Date(),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          globOptions: {
            ignore: ['index.html'],
          },
          to: '',
          context: path.resolve('public'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : 'static/css/[name].[contenthash:6].css',
    }),
    new webpack.ProgressPlugin(),
  ]

  const prodPlugins = [
    ...basePlugins,
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      test: /\.(css|js|html|svg)$/,
    }),
  ]
  if (isAnalyze) {
    prodPlugins.push(
      new BundleAnalyzerPlugin({
        reportFilename: 'report.html',
      }),
    )
  }

  return {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|tsx|js|jsx)$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      '@babel/preset-env',
                      '@babel/preset-react',
                      '@babel/preset-typescript',
                    ],
                    plugins: [
                      'babel-plugin-transform-export-extensions',
                      '@babel/plugin-proposal-class-properties',
                      '@babel/plugin-proposal-object-rest-spread',
                      '@babel/plugin-transform-runtime',
                      'babel-plugin-add-react-displayname',
                    ],
                  },
                },
                'eslint-loader',
              ],
              exclude: /node_modules/,
            },
            {
              test: /\.global\.(s[ac]ss|css)$/,
              use: [
                isDev
                  ? MiniCssExtractPlugin.loader
                  : { loader: 'style-loader' },
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: isDev ? true : false,
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: isDev ? true : false,
                  },
                },
              ],
            },
            {
              test: /\.(s[ac]ss|css)$/,
              use: [
                isDev
                  ? MiniCssExtractPlugin.loader
                  : { loader: 'style-loader' },
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: isDev ? true : false,
                    modules: {
                      mode: 'local',
                      localIdentName: '[local]_[hash:base64:4]',
                      exportLocalsConvention: 'camelCase',
                    },
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: isDev ? true : false,
                  },
                },
              ],
            },
            {
              test: /\.(eot|ttf|woff|woff2)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: isDev
                      ? '[path][name].[ext]'
                      : 'static/fonts/[name].[ext]',
                  },
                },
              ],
            },
            {
              test: /\.icon\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    icon: true,
                    svgo: true,
                  },
                },
              ],
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 5120,
                    name: isDev
                      ? '[path][name].[ext]'
                      : 'static/media/[name].[contenthash:6].[ext]',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      path: path.resolve('build'),
      publicPath: '/',
      filename: 'static/js/main.[contenthash:6].js',
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false,
      },
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      contentBase: 'public',
      port: process.env.PORT,
      hot: true,
      host: process.env.HOST || 'localhost',
      watchContentBase: true,
      historyApiFallback: true,
      open: true,
    },
    plugins: isDev ? basePlugins : prodPlugins,
    optimization: {
      minimize: true,
      usedExports: true,
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      splitChunks: {
        automaticNameDelimiter: '.',
        chunks: 'all',
        maxSize: 1024 * 1024,

        cacheGroups: {
          common: {
            test: new RegExp(
              `[\\/]node_modules[\\/](${commonLibs.join('|')})[\\/]`,
            ),
            name: 'c',
            chunks: 'all',
            priority: 99,
          },
          'vendors-async': {
            reuseExistingChunk: true,
            chunks: 'async',
            priority: -10,
          },
          default: {
            priority: -30,
          },
        },
      },
    },
    performance: {
      maxEntrypointSize: 800000,
      maxAssetSize: 3000000,
      hints: 'warning',
    },
  }
}
