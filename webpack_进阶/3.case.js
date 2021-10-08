class AsyncParralleHook {
  //钩子是同步的
  constructor(args) {
    //args=>['name']
    this.tasks = [];
  }
  tapPromise(name, task) {
    this.tasks.push(task);
  }
  promise(...args) {
    let tasks = this.tasks.map((task) => task(...args));
    return Promise.all(tasks);
  }
}
let hook = new AsyncParralleHook(["name"]);
let total = 0;
hook.tapPromise("react", function (name, cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("react", name);
      reslove();
    }, 1000);
  });
});
hook.tapPromise("node", function (name, cb) {
  return new Promise((resolve, rejetc) => {
    setTimeout(() => {
      console.log("node", name);
      resolve();
    }, 1000);
  });
});
hook.promise("jw").then(function () {
  console.log("end");
});
