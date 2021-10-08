let loaderUtils = require("loader-utils");
function loader(source) {
  //file-loader需要返回路径
  //需要将图片转化为二进制
  let filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content: source,
  });
  this.emitFile(filename, source); //发射文件
  return `module.exports="${filename}"`;
}
loader.raw = true; //二进制·
module.exports = loader;
