class AsyncSeriesWaterfallHook {
  //钩子是同步的
  constructor(args) {
    //args=>['name']
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    let finalCallback = args.pop();
    let index = 0;
    let next = (err, data) => {
      let task = this.tasks[index];
      if (!task) {
        return finalCallback();
      }
      if (index === 0) {
        //执行的是第一个
        task(...args, next);
      } else {
        task(data, next);
      }
      index++;
    };
    next();
  }
}
let hook = new AsyncSeriesWaterfallHook(["name"]);
let total = 0;
hook.tapAsync("react", function (name, cb) {
  setTimeout(() => {
    console.log("react", name);
    cb(null, "结果");
  }, 1000);
});
hook.tapAsync("node", function (data, cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("node", data);
      cb(null);
    }, 1000);
  });
});
hook.callAsync("jw", function () {
  console.log("end");
});
