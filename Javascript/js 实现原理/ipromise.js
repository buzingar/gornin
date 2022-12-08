function resolvePromise(promise, result, resolve, reject) {
  // 循环引用报错
  // 如果 promise 和 result 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (result === promise) {
    // reject 报错抛出
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 锁，防多次调用
  let called;

  // 如果result仍然为Promise的情况
  if (result instanceof IPromise) {
    // 如果result的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值，所以需要继续调用resolvePromise
    if (result.status === 'pending') {
      result.then(
        (val) => resolvePromise(promise, val, resolve, reject),
        reject
      );
    } else {
      // 如果x状态已经确定了，直接取它的状态
      result.then(resolve, reject);
    }
    return;
  }

  // result 不是 null，且 result 是对象或函数
  if (
    result != null &&
    (typeof result === 'object' || typeof result === 'function')
  ) {
    try {
      // A+ 规定，声明 then = result 的then方法
      let then = result.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        // then 执行 第一个参数是 this 后面是成功的回调 和 失败的回调
        // 如果then存在并且为函数，则把result作为then函数的作用域this调用，
        // then方法接收两个参数，resolvePromise和rejectPromise，
        // 如果resolvePromise被执行，则以resolvePromise的参数value作为result继续调用[[Resolve]](promise, value)，直到result不是对象或者函数
        then.call(
          result,
          (res) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // 核心点2：resolve 的结果依旧是 promise 那就继续递归执行
            resolvePromise(promise, res, resolve, reject);
          },
          (err) => {
            // 如果rejectPromise被执行则让promise进入rejected状态
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        if (called) return;
        called = true;
        // 如果then不是函数，说明result不是thenable对象，直接以result的值resolve
        resolve(result);
      }
    } catch (e) {
      // 运行出错
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 不是函数，则需要把 新promise 的状态传递下去
    resolve(result);
  }
}

/**
 * 手撕promise
 * 1、构造函数里传一个函数的两个参数（resolve, reject）
 * 2、resolve 成功时执行的回调
 * 3、reject 失败时执行的回调
 * 4、三种状态
 *   pending [待定] 初始状态
 *   fulfilled [实现] 操作成功
 *   rejected [被否决] 操作失败
 * 5、Promise 对象方法 then
 * 6、异步实现
 * 7、onFulfilled 和 onRejected 的异步调用
 * 8、值穿透
 * 9、Promise 对象方法 catch
 * 10、Promise 对象方法 all
 * 11、Promise 对象方法 race
 * 12、Promise 对象方法 resolve
 * 13、Promise 对象方法 reject
 * 13、Promise 对象方法 allSettled（上个月 TC39 出来的新特性）
 */
class IPromise {
  // 入参为函数 (resolve, reject)=>{}
  constructor(fn) {
    this.status = 'pending'; // promise 对象初始化状态为 pending
    this.data; // resolve 成功的值 或 reject 失败的值
    this.resolveQueue = []; // 成功存放的数组
    this.rejectQueue = []; // 失败存放法数组

    // 成功时执行的回调
    let resolve = (res) => {
      if (this.status === 'pending') {
        this.data = res;
        // 状态一旦转换完成，不能再次转换
        this.status = 'fulfilled'; // 当调用resolve(成功)，会由pending => fulfilled
        // 一旦resolve执行，调用成功数组的函数
        this.resolveQueue.forEach((fnqu) => fnqu());
      }
    };

    // 失败时执行的回调
    let reject = (err) => {
      if (this.status === 'pending') {
        this.data = err;
        this.status = 'rejected'; // 当调用reject(失败)，会由pending => rejected
        // 一旦reject执行，调用失败数组的函数
        this.rejectQueue.forEach((fnqu) => fnqu());
      }
    };

    // 执行传入的函数，resolve和reject需要传入fn中，在fn中满足条件被调用
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // reject
  static reject = (value) => {
    return new IPromise((resolve, reject) => {
      reject(value);
    });
  };

  // resolve
  static resolve = (value) => {
    return new IPromise((resolve, reject) => {
      resolve(value);
    });
  };

  // race
  static race = (promises) => {
    return new IPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  };

  // all
  static all = (promises) => {
    let count = 0;
    let result = [];
    return new IPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then((res) => {
          result.push(res);
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        }, reject);
      }
    });
  };

  // 状态改变会调对应函数
  // 用以处理resolved或rejected状态下的值
  // then方法提供：状态为resolved时的回调函数onResolved，状态为rejected时的回调函数onRejected
  then(onResolved, onRejected) {
    // 值穿透调用 .then().then().then().then().then().then().then()
    // onFulfilled 如果不是函数，就忽略 onFulfilled，直接返回 value!
    onResolved =
      typeof onResolved === 'function' ? onResolved : (value) => value;
    // onRejected 如果不是函数，就忽略 onRejected，直接扔出错误!
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };

    // 服务于链式then().then()调用
    // 通过在 then 中 return 一个新的 Promise，从而实现 then 的链式调用！
    let chainPromise = new IPromise((resolve, reject) => {
      // 如果状态为fulfilled，则执行onResolved
      if (this.status === 'fulfilled') {
        // this.resolveQueue.push(() => onResolved(this.data));
        // 异步，onFulfilled 和 onRejected 的异步调用
        setTimeout(() => {
          // onResolved/onRejected有返回值则把返回值定义为result
          let result = onResolved(this.data);
          // 执行[[Resolve]](promise2, x)
          resolvePromise(chainPromise, result, resolve, reject);
        }, 0);
      }

      // 如果状态为rejected，则执行onRejected
      if (this.status === 'rejected') {
        // this.resolveQueue.push(() => onRejected(this.data));
        // 异步，onFulfilled 和 onRejected 的异步调用
        setTimeout(() => {
          let result = onRejected(this.data);
          resolvePromise(chainPromise, result, resolve, reject);
        }, 0);
      }

      // 如果状态为pending，则把处理函数进行存储
      if (this.status === 'pending') {
        // onResolved传入到成功数组
        this.resolveQueue.push(() => {
          // onResolved(this.data);
          // 异步，onFulfilled 和 onRejected 的异步调用
          setTimeout(() => {
            let result = onResolved(this.data);
            resolvePromise(chainPromise, result, resolve, reject);
          }, 0);
        });
        // onRejected传入到失败数组
        this.rejectQueue.push(() => {
          // onRejected(this.data);
          // 异步，onFulfilled 和 onRejected 的异步调用
          setTimeout(() => {
            let result = onRejected(this.data);
            resolvePromise(chainPromise, result, resolve, reject);
          }, 0);
        });
      }
    });

    return chainPromise;
  }

  // catch 是失败的回调，相当于执行 this.then(null,fn)
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

/* -------------------------------------------------------------------- */
// resolve 为 IPromise 内部的 resolve 函数
// reject 为 IPromise 内部的 reject 函数
// debugger;
const p1 = new IPromise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() < 1) {
      resolve('hello p1');
    } else {
      reject('error p1');
    }
  }, 1000);
});
// const p2 = new IPromise((resolve, reject) => {
//   setTimeout(() => {
//     if (Math.random() < 0.8) {
//       resolve('hello p2');
//     } else {
//       reject('error p2');
//     }
//   }, 2000);
// });
// const p3 = new IPromise((resolve, reject) => {
//   setTimeout(() => {
//     if (Math.random() < 0.9) {
//       resolve('hello p3');
//     } else {
//       reject('error p3');
//     }
//   }, 3000);
// });

// IPromise.all([p1, p2, p3])
IPromise.race([p1])
  .then((res) => {
    return new IPromise((resolve, reject) => {
      resolve('hello');
    });
  })
  .then((res) => {
    console.log(res, ' second');
  })
  .catch((err) => {
    console.error(err);
  });
