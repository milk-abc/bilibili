let fs = require("fs");
let loaderUtils = require("loader-utils");
let { validate, ValidationError } = require("schema-utils"); //校验
function loader(source) {
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  let schema = {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
      filename: {
        type: "string",
      },
    },
  };
  validate(schema, options, "banner-loader");
  if (options.filename) {
		this.cacheable(false);//不要缓存
    this.addDependency(options.filename);//自动添加文件依赖
    fs.readFile(options.filename, "utf8", function (err, data) {
      cb(err, `/**${data}**/${source}`);
    });
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
}
module.exports = loader;
