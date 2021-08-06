// webpack的配置文件
// 开发环境的配置：能让代码自动化运行
// 生产环境的配置：压缩、兼容
// 作用：指示webpack干哪些活，运行webpack指令时，会加载里面的配置
// HMR:hot module replacement 热模块替换
// 作用：一个模块发生变化，只会重新打包这一个模块，而不是打包所有模块
// 极大提升构建速度
// 样式文件：可以使用HMR功能：因为style-loader中实现了
// js文件：默认没有HMR功能-->需要修改js代码，添加支持HMR功能的代码
// 注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
// html文件：默认不能使用HMR功能，同时会导致问题：html文件不能热更新了(不用做HMR功能)
// 解决：修改entry入口，将html文件引入
// 所有的构建工具都是基于nodejs平台运行的!模块化默认采用commonjs
// 项目的代码和配置的代码是两方面ES6/CommonJs
// resolve用来拼接绝对路径的方法
// tree shaking:去除无用代码
// 必须使用ES6模块化 开启production环境
// 减少代码体积
// 在package.json中配置sideEffects:false 所有代码都没有副作用(都可以进行treeshaking)
// 问题：可能会把css/@babel/polyfill文件去掉
// 解决sideEffects:['*.css','*.less']
const { resolve } = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxWebpackPlugin = require("workbox-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 定义nodejs环境变量：决定使用browserslist的哪个环境
// process.env.NODE_ENV = "production";
// PWA:渐进式网络开发应用程序(离线可访问)  workbox

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    // 还需要在package.json中定义browserslist
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()],
    },
  },
];

// optimize-css-assets-webpack-plugin
module.exports = {
  // webpack的配置
  // 单入口
  // entry: ["./src/js/index.js", "./src/index.html"],
  // 多入口:一个入口，就输出一个对应的bundle
  entry: {
    main: "./src/js/index.js",
    // test: "./src/js/test.js",
  },
  output: {
    // [name]：取文件名
    filename: "js/[name].[contenthash:10].js",
    // __dirname nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, "build"),
  },
  // loader的配置
  module: {
    rules: [
      // 详细loader配置
      {
        // 匹配哪些文件
        test: /\.css$/,
        use: ["style-loader", ...commonCssLoader],
        // 使用哪些loader
        // use: [
        //   // use数组中loader执行顺序，从右到左，从下到上，依次执行
        //   // 创建style标签，将js中的样式资源插入进去，添加到head中生效
        //   // "style-loader",
        //   // 这个loader取代了style-loader。作用：提取js中的css成单独文件
        //   MiniCssExtractPlugin.loader,
        //   // 将css文件变成commonjs模块加载到js中，里面内容是样式字符串
        //   "css-loader",
        //   // css兼容性处理:postcss-->postcss-loader  postcss-preset-env
        //   // 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
        //   // browserslist默认是生产环境，需要设置node环境变量:process.env.NODE_ENV=development
        //   {
        //     loader: "postcss-loader",
        //     options: {
        //       ident: "postcss",
        //       plugins: () => [
        //         // postcss的插件
        //         require("postcss-preset-env")(),
        //       ],
        //     },
        //   },
        // ],
      },
      {
        // 匹配哪些文件
        test: /\.less$/,
        use: ["style-loader", ...commonCssLoader, "less-loader"],
        // 使用哪些loader
        // use: [
        //   // use数组中loader执行顺序，从右到左，从下到上，依次执行
        //   // 创建style标签，将js中的样式资源插入进去，添加到head中生效
        //   "style-loader",
        //   // 将css文件变成commonjs模块加载到js中，里面内容是样式字符串
        //   "css-loader",
        //   {
        //     loader: "postcss-loader",
        //     options: {
        //       ident: "postcss",
        //       plugins: () => [
        //         // postcss的插件
        //         require("postcss-preset-env")(),
        //       ],
        //     },
        //   },
        //   // 将less文件编译成css文件
        //   "less-loader",
        // ],
      },
      {
        // 问题：默认处理不了html中img图片
        test: /\.(jpg|png|gif)$/,
        // 下载url-loader file-loader
        // 处理样式中url
        loader: "url-loader",
        options: {
          // 图片大小小于8kb，就会被base64处理,变成字符串可以直接显示后面不需要再请求
          // 优点：减少请求数量(减轻服务器压力)
          // 缺点：图片体积会更大(文件请求速度更慢)
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          outputPath: "imgs",
        },
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
        loader: "html-loader",
      },
      {
        // 打包其他资源(除了html/js/css资源意外的资源)
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: "file-loader",
      },
      // {
      //   // 语法检查：eslint-loader eslint
      //   // 注意：只检查自己写的源代码，第三方的库是不用检查的
      //   // 设置检查规则：package.json中eslintConfig中设置~airbnb
      //   // eslint-config-airbnb-base eslint eslint-plugin
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   //优先执行
      //   enforce: "pre",
      //   loader: "eslint-loader",
      //   options: {
      //     fix: true,
      //   },
      // },
      {
        // js兼容性处理，将es6转换为es5
        // 1.基本js兼容性处理-->@babel/preset-env
        // 问题：只能转换基本语法，promise不能转换等
        // 2.全部js兼容性处理-->@babel/polyfill
        // 问题：我只需要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大
        // 3.需要做兼容性处理用按需加载-->core-js
        // 一个文件只能被一个loader处理，当一个文件要被多个loader处理
        // 那么一定要指定loader执行的顺序，先执行eslint再执行babel
        // 缓存
        // babel缓存
        // cacheDirectory:true  第二次打包构建速度更快
        // 文件资源缓存
        // hash:每次都会生成不同的hash
        // chunkhash:不同chunk生成不同的hash
        // contenthash:内容改变生成不同的hash
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          // 开启多进程打包
          // 进程启动大概为600ms，进程通信也有开销
          // 只有工作消耗时间比较长，才需要多进程打包
          {
            loader: "thread-loader",
            options: {
              workers: 2,
            },
          },
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  // 按需加载
                  {
                    useBuiltIns: "usage",
                    // 指定core-js版本
                    corejs: { version: 3 },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17",
                    },
                  },
                ],
              ],
              // 开启babel缓存
              // 第二次构建时会读取之前的缓存
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  // plugins的配置
  // 会默认创建一个空的HTML，自动引入打包输出的所有资源js/css
  plugins: [
    new HtmlPlugin({
      template: "./src/index.html",
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({ filename: "css/built.[contenthash:10].css" }),
    new OptimizeCssAssetsWebpackPlugin(),
    new workboxWebpackPlugin.GenerateSW({
      // 帮助serviceworker快速启动
      // 删除旧的serviceworker
      // 生成一个serviceworker的配置文件
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  // 可以将node_modules中代码单独打包成一个chunk最终输出
  // 自动分析多入口chunk中有没有公共的文件。如果有会单独打包成一个chunk
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  // 生产环境下会自动压缩js代码
  mode: "production",
  // 开发服务器devServer:用来自动化(自动编译，自动打开浏览器，自动刷新浏览器)
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为:npx webpack-dev-server  需要安装webpack-dev-server
  // devServer: {
  //   // 项目构建后路径
  //   contentBase: resolve(__dirname, "build"),
  //   // 启动gzip压缩
  //   compress: true,
  //   // 指定开发服务器端口号
  //   port: 3000,
  //   // 自动打开默认浏览器
  //   open: true,
  //   // 开启HMR功能
  //   // 当修改了webpack配置，新配置想要生效，必须重启webpack服务
  //   hot: true,
  // },
};
