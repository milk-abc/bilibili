/* eslint-disable quotes */
/* eslint-disable linebreak-style */
// index.js webpack入口文件
// webpack ./src/index.js -o ./build/built.js --mode=production
// webpack能处理js/json资源，不能处理css/img等其他资源
// 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
// eslint-disable-next-line linebreak-style
// 生产环境比开发环境多以压缩js代码
// eslint-disable-next-line quotes
// import "@babel/polyfill";
// import $ from "jquery";
import print from "./print";
import "../css/a.css";
import "../css/b.css";
// import { mul } from "./test";
// import动态导入语法：能将某个文件单独打包
console.log("index.js");
// import("./test")
//   .then(({ mul, count }) => {
//     console.log(mul(2, 5));
//   })
//   .catch(() => {
//     console.log("文件加载失败");
//   });
document.getElementById("btn").onclick = function () {
  //懒加载：当文件需要使用时才加载
  //预加载prefetch:会在使用之前提前加载js文件：等其他资源加载完毕，浏览器空闲了再加载；兼容性差
  //正常加载可以认为是并行加载(同一时间加载多个文件)
  import(/*webpackChunkName:'test',webpackPrefetch:true*/ "./test")
    .then(({ mul, count }) => {
      console.log(mul(2, 5));
    })
    .catch(() => {
      console.log("文件加载失败");
    });
  // console.log(mul(4, 5));
};

// console.log(mul(2, 3));
// console.log($);
console.log("index.js文件被加载了");
print();
const add = (x, y) => x + y;
console.log(add(2, 9));
const promise = new Promise((resolve, reject) => {
  console.log("定时器执行晚了");
  resolve(2);
});
console.log(promise);
if (module.hot) {
  // 开启了HMR功能，让HMR功能代码生效
  module.hot.accept("./print.js", () => {
    // 方法会监听print.js文件的变化，一旦发生变化，其他默认不会重新打包构建
    // 会执行后面的回调函数
    print();
  });
}
//注册serviceworker
//处理兼容性问题
//sw代码必须运行在服务器上
//nodejs serve -s build
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        console.log("成功");
      })
      .catch(() => {
        console.log("失败");
      });
  });
}
