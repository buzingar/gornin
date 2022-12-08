class IPromise {
  // static race = () => {};
  // static all = () => {};
  // static resolve = () => {};
  // static reject = () => {};

  constructor(fn) {
    this.status = 'pending';
    this.data;
    // 异步时保存then中用户定义的onResolved处理函数
    this.resolvedFns = [];
    // 异步时保存then中用户定义的onRejected处理函数
    this.rejectedFns = [];
    this.startTime = 0;

    // 调用这个函数，就是告诉promise用户的逻辑已成功
    const resolve = (val) => {
      const last = Date.now() - this.startTime;
      console.log(
        last + 'ms后，更改状态，保存成功态数据，执行异步时then中暂存的逻辑'
      );
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.data = val;
        // 异步，then中pending时暂存的onResolved处理函数，在状态改变后要执行
        this.resolvedFns.forEach((fn) => fn());
      }
    };

    // 调用这个函数，表示用户的逻辑失败了
    const reject = (err) => {
      const last = Date.now() - this.startTime;
      console.log(
        last + 'ms更改状态，保存失败态信息，执行异步时then中暂存的逻辑'
      );
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.data = err;
        // 改变状态后调用暂存的onRejected处理函数
        this.rejectedFns.forEach((fn) => fn());
      }
    };

    try {
      console.log('构造函数中执行传入Promise的主函数');
      this.startTime = Date.now();
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  resolvePromise(promise, x, resolve, reject) {
    let called = false;

    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'));
    }

    // 如果x仍然为Promise的情况
    if (x instanceof Promise) {
      // 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值，所以需要继续调用resolvePromise
      if (x.status === 'pending') {
        x.then((value) => {
          resolvePromise(promise, value, resolve, reject);
        }, reject);
      } else {
        // 如果x状态已经确定了，直接取它的状态
        x.then(resolve, reject);
      }
      return;
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        // 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用，所以通过变量called进行控制
        const then = x.then;
        // then是函数，那就说明x是thenable，继续执行resolvePromise函数，直到x为普通值
        if (typeof then === 'function') {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // 如果then不是函数，那就说明x不是thenable，直接resolve x
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  then(onResolved, onRejected) {
    console.log('由promise实例调用then，进入then函数');

    // 值穿透，如果 onResolved, onRejected 不为函数，直接返回值
    onResolved = typeof onResolved === 'function' ? onResolved : (val) => val;
    onRejected = typeof onRejected === 'function' ? onRejected : (val) => val;

    const npromise = new IPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        // 用宏任务代替promise.then来实现异步
        setTimeout(() => {
          try {
            // 如果状态为fulfilled，则执行onResolved
            const x = onResolved(this.data);
            this.resolvePromise(npromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.data);
            this.resolvePromise(npromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // 由于settimeout导致未resolve而先进入then，
      // pending状态时先把处理函数暂存起来，等resolve后再调用处理
      if (this.status === 'pending') {
        console.log('then函数pending状态，暂存自定义的处理逻辑');
        this.resolvedFns.push(() => {
          setTimeout(() => {
            try {
              const x = onResolved(this.data);
              this.resolvePromise(npromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.rejectedFns.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.data);
              this.resolvePromise(npromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return npromise;
  }
}

/**
 * 使用promise，需要我们提供一个函数进去，最后得到promise实例
 * 提供的函数用于执行初始逻辑，得到运算结果后，成功的话调用resolve，失败则调用reject
 * resolve和reject为构造函数中固定形式的函数，这两个函数会改变状态
 * 状态改变后得到promise实例，调用then方法
 * 根据条件执行then中的onResolved, onRejected，这两个函数为我们自定义的，用于处理对应状态下的处理逻辑
 */
new Promise((resolve, reject) => {
  console.log('开始用户自定义主函数');
  setTimeout(() => {
    console.log('主函数执行完毕，开始去更改状态');
    if (Math.random() < 0.8) {
      // 调用构造函数中的resolve函数，val='hello'
      resolve('hello');
    } else {
      reject('goodbye');
    }
  }, 1000);
})
  .then(
    (val) => {
      console.log('then成功态处理逻辑:', val);
    },
    (err) => {
      console.error('then失败态处理逻辑:', err);
    }
  )
  .then(
    (val) => {
      console.log('then成功态处理逻辑111:', val);
    },
    (err) => {
      console.error('then失败态处理逻辑111:', err);
    }
  );
