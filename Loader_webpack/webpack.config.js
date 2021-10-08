const path = require("path");
let DonePlugin = require("./plugins/DonePlugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "loaders")],
    //一种方法是配置别名
    // alias: {
    //   loader1: path.resolve(__dirname, "loaders", "loader1.js"),
    // },
  },
  devtool: "source-map",
  watch: true, //边写边打包
  module: {
    rules: [
      {
        test: /\.jpg$/,
        //目的就是根据图片生成一个md5 发射到dist目录下,file-loader还会返回当前的图片路径
        // use: "file-loader",
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024,
          },
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: "banner-loader",
          options: {
            text: "珠峰",
            filename: path.resolve(__dirname, "banner.js"),
          },
          // loader: "babel-loader",
          // options: {
          //   presets: ["@babel/preset-env"],
          // },
        },
      },
    ],
  },
  plugins: [new DonePlugin()],
};
