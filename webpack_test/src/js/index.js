/* eslint-disable quotes */
/* eslint-disable linebreak-style */
// index.js webpack入口文件
// webpack ./src/index.js -o ./build/built.js --mode=production
// webpack能处理js/json资源，不能处理css/img等其他资源
// 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
// eslint-disable-next-line linebreak-style
// 生产环境比开发环境多以压缩js代码
// eslint-disable-next-line quotes
import "../css/a.css";
import "../css/b.css";
