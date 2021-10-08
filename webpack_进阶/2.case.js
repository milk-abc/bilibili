class AsyncParralleHook {
  //钩子是同步的
  constructor(args) {
    //args=>['name']
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    let finalCallback = args.pop(); //拿出最终的函数
    let done = () => {
      index++;
      if (index == this.task.length) {
        finalCallback();
      }
    };
    this.tasks.forEach((task) => {
      task(...args, done);
    });
  }
}
let hook = new AsyncParralleHook(["name"]);
let total = 0;
hook.tapAsync("react", function (name, cb) {
  setTimeout(() => {
    console.log("react", name);
    cb();
  }, 1000);
});
hook.tapAsync("node", function (name, cb) {
  setTimeout(() => {
    console.log("node", name);
    cb();
  }, 1000);
});
hook.callAsync("jw", function () {
  console.log("end");
});
