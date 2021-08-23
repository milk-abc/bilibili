let fs = require("fs");
let path = require("path");
let babylon = require("babylon");
let traverse = require("@babel/traverse").default;
let t = require("@babel/types");
let generator = require("@babel/generator").default;
//babylon 将源码转换成ast
//babel/traverse 遍历
//babel/types 替换
//babel/genertor 生成
class Compiler {
  constructor(config) {
    //包含所有的参数 entry output
    this.config = config;
    //需要保存入口文件的路径
    this.entryId;
    //需要保存所有的模块依赖
    this.modules = {};
    this.entry = config.entry; //入口路径
    //工作路径
    this.root = process.cwd();
  }
  getSource() {
    let content = fs.readFileSync(modulePath, "utf-8");
    return content;
  }
  //解析源码
  parse(source, parentPath) {
    //AST解析语法树
    let ast = babylon.parse(source);
    let depencies = [];
    //遍历ast并修改ast
    traverse(ast, {
      CallExpression(p) {
        let node = p.node; //对应的节点
        if (node.callee.name === "require") {
          node.callee.name = __webpack_require__;
          let moduleName = node.arguments[0].value; //模块名
          moduleName = moduleName + (path.extname(moduleName) ? "" : ".js"); // ./a.js
          modulename = path.join(parentPath, moduleName); // .src/a.js
          depencies.push(moduleName);
          node.arguments = [t.stringLiteral(moduleName)];
        }
      },
    });
    //重新编译成源码
    let sourceCode = generator(ast).code;
    return { sourceCode, depencies };
  }
  //构建模块
  buildModule(modulePath, isEntry) {
    //拿到当前模块的内容
    let source = this.getSource(modulePath);
    //模块id modulePath = modulePath-this.root src/index.js
    let moduleName = "./" + path.relative(this.root, modulePath);
    if (isEntry) {
      //保存入口的名字
      this.entryId = moduleName;
    }
    //解析需要把source源码进行改造，返回一个依赖列表
    let { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(moduleName)
    ); // ./src
    //把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode;

    dependencies.forEach((dep) => {
      //附模块的递归加载
      this.buildModule(path.join(this.root, dep), false);
    });
  }
  emitFile() {
    //用数据渲染我们的模板
    //输出路径
    let main = path.join(this.config.output.path, this.config.output.filename);
    //模板路径
    let templateStr = fs.getSource(path.join(__dirname, main.ejs));
		//渲染的结果
    let code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules,
    });
    this.assets = {};
    //资源中路径对应的代码
    this.assets[main] = code;
    fs.writeFileSync(this.assets[main]);
  }
  run() {
    //执行 并且创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);
    //发射一个文件 打包后的文件
    this.emitFile();
  }
}
module.exports = Compiler;
