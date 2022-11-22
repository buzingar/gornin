# React 中的重新渲染是什么?

当谈到 React 的性能时，我们需要关注两个主要阶段：

- 初始渲染——当组件第一次出现在屏幕上时发生
- 重新渲染——已经在屏幕上的组件第二次及任何连续渲染

当 React 更新应用程序数据时，就会发生 re-render，如**用户与应用程序交互**或**通过异步请求**或**某些订阅模型**传入一些外部数据。
没有任何异步数据更新的非交互式应用程序永远不会重新渲染，因此也就无需关心重新渲染的性能优化了。

# 什么是必要的和不必要的 re-render？

- **必要的 re-render**—— 作为更改源的组件，或直接使用新数据的组件。例如，如果用户在 input 中输入，管理其状态的组件需要在每次按键时更新自己，就会重新渲染。
- **不必要的 re-render**—— 由于错误或低效的应用程序架构，通过不同的机制传递数据的组件而被重新渲染。例如，用户在 input 中输入，每次按键时都重新渲染整个页面，那么页面就是不必要地重新渲染了。

不必要的 re-render 本身不是什么大问题，React 足够快，大多数情况下都能够在用户没有注意到的情况下刷新页面。但是如果 re-render 发生得太频繁或在非常重的组件上，可能会导致用户体验出现“滞后”，每次交互都有明显的延迟，这就需要我们进行性能优化了。

# React 组件何时会 re-render?

组件重新渲染自己有四个原因

- 状态变化
- 父级组件重新渲染
- Context 变化
- hooks 变化
  > 一个误区：当组件的 props 改变时，会发生重新渲染。其实这是由于父组件重新渲染传播给子组件而造成的，与 props 变化与否无直接关系，详见下文。

## 状态更改

当组件的状态发生变化时，它将重新渲染，常发生在回调或 useEffect 钩子中。
状态更改是所有 re-render 的“根”源。

```tsx
import { useEffect, useState } from "react";

const App = () => {
  const [state, setState] = useState(0);

  const onClick = () => {
    setState(state + 1);
  };

  console.log("重新渲染次数: ", state);

  useEffect(() => {
    console.log("re-mount");
  }, []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>每次点击都会输出log，因为状态改变，页面重新渲染</p>
      <p>re-render count: {state}</p>
      <button onClick={onClick}>点击{state}次</button>
    </>
  );
};

export default App;
```

## 父级组件重新渲染

如果父组件重新渲染，则当前组件也会重新渲染。换个角度讲，当一个组件重新渲染，其所有子组件都会重新渲染。
re-render 总是沿着树“向下”：子节点的重新渲染不会触发父节点的重新渲染。

```tsx
import { useState } from "react";

const Child = () => {
  console.log("子组件 re-render，字体颜色改变");
  const r = Math.ceil(Math.random() * 255);
  const g = Math.ceil(Math.random() * 255);
  const b = Math.ceil(Math.random() * 255);
  return <p style={{ color: `rgb(${r},${g},${b})` }}>child</p>;
};

const App = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  console.log("当前组件re-render 次数: ", state);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>每次点击都会输出log，因为状态改变，页面重新渲染</p>
      <Child />
      <button onClick={onClick}>点击{state}</button>
    </>
  );
};

export default App;
```

## context 变化

当`Context Provider`中的值`value`发生变化时，所有使用该 Context 的组件都将 re-render，即使它们不直接使用变化的那部分数据。
这些 re-render 不能通过记忆 memo 直接阻止，但也有一些办法可以阻止由上下文引起的 re-render。

```tsx
import { useState, createContext, useContext, useMemo, ReactNode } from "react";

const Context = createContext<{ value: number }>({ value: 1 });

const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const value = useMemo(
    () => ({
      value: state,
    }),
    [state]
  );
  return (
    <Context.Provider value={value}>
      <button onClick={onClick}>点击</button>
      {children}
    </Context.Provider>
  );
};

const useValue = () => useContext(Context);

const Child1 = () => {
  // 依赖变化的value
  const { value } = useValue();
  console.log("Child1 re-renders: ", value);
  return <></>;
};

const Child2 = () => {
  // 依赖变化的value
  const { value } = useValue();
  console.log("Child2 re-renders: ", value);
  return <></>;
};

const App = () => {
  return (
    <Provider>
      <h2>打开控制台，点击按钮</h2>
      <p>两个child页面都会重新渲染</p>

      <Child1 />
      <Child2 />
    </Provider>
  );
};

export default App;
```

## hooks 变化

hook 内部发生的一切都“属于”使用它的组件。关于 Context 和 State 更改的相同规则也适用于这里：

- hook 内部的状态更改将触发“host”组件不可避免的 re-render
- 如果 hook 使用了 Context，而 Context 的值发生了变化，它将触发“host”组件不可避免的 re-render

hook 可以链式调用。链中的每个 hook 仍然“属于”“host”组件，并且相同的规则适用于它们中的任何一个。

> host：宿主

```tsx
import { useState, createContext, useContext, useMemo, ReactNode } from "react";

const Context = createContext<{ value: number }>({ value: 1 });

const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const value = useMemo(
    () => ({
      value: state,
    }),
    [state]
  );

  return (
    <Context.Provider value={value}>
      <button onClick={onClick}>点击</button>
      {children}
    </Context.Provider>
  );
};

const useValue = () => useContext(Context);

// hooks chain
const useSomething = () => {
  const count = useValue();
  return count.value;
};

const Child = () => {
  const value = useSomething();
  console.log("Child re-renders:", value);
  return <></>;
};

const App = () => {
  return (
    <Provider>
      <h2>打开控制台，点击按钮</h2>
      <p>hooks链式作用，Child将re-render</p>

      <Child />
    </Provider>
  );
};

export default App;
```

## props 变化

未 memoized 组件，props 不改变，child 依旧重新渲染
re-render 未记忆的组件，组件的 props 是否改变并不重要。为了改变 props，它们需要由父组件更新。这意味着父组件必须重新渲染，这将触发子组件的重新渲染，而不管它的 props 是什么。
只有在使用记忆技巧时(React.memo, useMemo)，那么 props 的改变就变得重要了。

```tsx
import { useState, memo } from "react";

const Child = ({ data }: { data: string; state?: number }) => {
  console.log("Child re-renders");
  return <p>{data}</p>;
};

const ChildMemo = memo(Child);

const value = "test";

const App = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>prop未变化，Child依旧重渲染了</p>
      <button onClick={onClick}>点击{state}</button>

      <Child data={value} />
      <p>props如果有变化的值，即便child未用到，也会导致child重渲染</p>
      <ChildMemo data={value} state={state} />
    </>
  );
};

export default App;
```

## 在渲染函数中创建组件

> 不推荐的写法

在另一个组件的渲染函数中创建组件是一种反模式，它可能是最大的性能杀手。在每次重新渲染时，React 都会重新挂载这个组件(即销毁它并从头重新创建它)，这比正常的重新渲染要慢得多。这将导致以下错误:

- 在重新渲染过程中可能出现的内容“闪烁”
- 在每次重新渲染时重置组件中的状态
- 在每次重新渲染时不触发依赖
- 如果一个组件被聚焦，焦点就会丢失

```tsx
import { useState, useEffect } from "react";

const Component = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  // 每次渲染时，都会创建这个重型组件，性能很差
  const VerySlowComponent = () => {
    console.log("Very slow component re-renders");

    useEffect(() => {
      console.log("Very slow component re-mounts");
    }, []);

    return <div>Very slow component</div>;
  };

  return (
    <>
      <button onClick={onClick}>点击</button>
      <VerySlowComponent />
    </>
  );
};

const App = () => {
  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>每次点击，重型组件都会重新挂载</p>

      <Component />
    </>
  );
};

export default App;
```

# 如何减少重新渲染？

## state 下放

当重型组件管理状态时，此模式非常有用，并且 state 仅用于呈现树的一小部分独立部分。一个典型的例子是，在呈现页面重要部分的复杂组件中，通过单击按钮打开/关闭对话框。
在这种情况下，控制模态对话框外观的状态、对话框本身和触发更新的按钮可以封装在更小的组件中。因此，较大的组件不会在这些状态更改时重新渲染。

```tsx
import { useState } from "react";

const VerySlowComponent = () => {
  console.log("Very slow component re-render");
  return <div>Very slow component</div>;
};

// 事件交互与重型组件平铺在同一个父组件
const FullComponent = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <h3>一般写法，平铺在一起</h3>
      <p>事件交互时，影响重型组件也跟着一起re-render</p>
      <p>re-render count: {state}</p>
      <button onClick={onClick}>点击</button>
      <VerySlowComponent />
    </>
  );
};

// 拆分组件一，事件交互部分组件，内聚
const ComponentWithButton = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <p>re-render count: {state}</p>
      <button onClick={onClick}>点击</button>
    </>
  );
};

// 拆分后组件，包含两个子组件
const SplitComponent = () => {
  return (
    <>
      <h3>拆分后组件，包含两个子组件：交互组件 & 重型组件</h3>
      <p>事件交互时，只有交互组件会re-render，重型组件不受影响</p>
      <ComponentWithButton />
      <VerySlowComponent />
    </>
  );
};

export default function App() {
  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>平铺代码</p>
      <FullComponent />
      <hr />
      <p>拆分代码</p>
      <SplitComponent />
    </>
  );
}
```

逻辑更内聚，确保影响范围最小，性能会更好。细粒度控制，不会影响不相关组件。

## children 作为 props

这也可以被称为“wrap state around children”。此模式类似于上一种方式：它将状态更改封装在较小的组件中。这里的不同之处在于，state 是在封装渲染树中较慢部分的元素上使用的，因此不能那么容易地提取它。一个典型的例子是附加到组件根元素的 onScroll 或 onMouseMove 回调函数。
在这种情况下，状态管理和使用该状态的组件可以被提取到更小的组件中，而速度较慢的组件可以作为子组件传递给它。从较小组件的角度来看，子组件只是 props，所以它们不会受到状态变化的影响，因此不会重新渲染。

```tsx
import React, { useState, ReactNode } from "react";

const VerySlowComponent = () => {
  console.log("Very slow component re-renders");
  return <div>Very slow component</div>;
};

// 平铺写法，事件交互，会影响无关组件
const FullComponent = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  // 注意交互区域包含重型组件，也就是重型组件也参与交互，但不依赖变化的值
  return (
    <div onClick={onClick} style={{ background: "#dfa" }}>
      <p>Re-render count: {state}</p>
      <h3>平铺写法，事件交互，会影响无关组件</h3>
      <p>事件交互时，重型组件也跟着re-render</p>
      <p>
        注意交互区域包含重型组件，也就是重型组件也参与交互，但不依赖变化的值
      </p>
      <VerySlowComponent />
    </div>
  );
};

const ComponentWithClick = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  // 把重型组件从其父级组件中去除，适用children代替其位置，通过children展示重型组件
  return (
    <div onClick={onClick} style={{ background: "#afd" }}>
      <p>Re-render count: {state}</p>
      {children}
    </div>
  );
};

const SplitComponent = () => {
  return (
    <>
      <ComponentWithClick>
        <>
          <h3>
            把重型组件从其父级组件中去除，用children代替其位置，通过children展示重型组件
          </h3>
          <p>点击交互区域，重型组件不再re-render</p>

          <VerySlowComponent />
        </>
      </ComponentWithClick>
    </>
  );
};

export default function App() {
  return (
    <>
      <h2>打开控制台，点击按钮</h2>

      <FullComponent />
      <hr />
      <SplitComponent />
    </>
  );
}
```

## 组件作为 props

与前面的模式基本相同，具有相同的行为：它将状态封装在一个较小的组件中，重的组件作为 props 传递给它。props 不受状态变化的影响，所以重的组件不会重新渲染。
当少数重型组件独立于状态时可以有用，但不能抽取成 children 来使用。

```tsx
import { useState, ReactNode } from "react";

const VerySlowComponent = () => {
  console.log("Very slow component re-renders");
  return <div>Very slow component</div>;
};

const AnotherSlowComponent = () => {
  console.log("Another slow component re-renders");
  return <div>Another slow component</div>;
};

const FullComponent = () => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <div onClick={onClick} style={{ background: "#19b" }}>
      <h3>糟糕的写法</h3>
      <p>点击交互，重型组件re-render</p>
      <p>Re-render count: {state}</p>
      <VerySlowComponent />
      <p>Something</p>
      <p>Something</p>
      <p>Something</p>
      <AnotherSlowComponent />
    </div>
  );
};

const ComponentWithClick = ({
  upup,
  down,
}: {
  upup: ReactNode;
  down: ReactNode;
}) => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <div onClick={onClick} style={{ background: "#b19" }}>
      <p>Re-render count: {state}</p>
      {upup}
      <p>Something</p>
      <p>Something</p>
      <p>Something</p>
      {down}
    </div>
  );
};

const SplitComponent = () => {
  const up = (
    <>
      <h3>交互区域内部的多个不连续重型组件，被当作props分别传入</h3>
      <p>交互时，重型组件不再随着re-render</p>

      <VerySlowComponent />
    </>
  );

  const down = <AnotherSlowComponent />;

  return (
    <>
      <ComponentWithClick upup={up} down={down} />
    </>
  );
};

export default function App() {
  return (
    <>
      <h2>打开控制台，点击按钮</h2>

      <FullComponent />
      <hr />
      <SplitComponent />
    </>
  );
}
```

## React.memo

### 简单组件，无 props

使用 React.memo 包裹的组件，其下游组件不会被重新渲染，除非该组件的 props 发生了变化。

```tsx
import React, { useState } from "react";

const Child = () => {
  console.log("Child re-renders");
  const r = Math.ceil(Math.random() * 255);
  const g = Math.ceil(Math.random() * 255);
  const b = Math.ceil(Math.random() * 255);
  return <p style={{ color: `rgb(${r},${g},${b})` }}>child</p>;
};

// Child 组件被React.memo() 包裹，组件没拆分，也能阻止重新渲染
const ChildMemo = React.memo(Child);

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <h2>打开控制台，点击按钮</h2>

      <button onClick={onClick}>点击 {state}</button>
      <p>未被React.memo()包裹，组件会重新渲染，字体颜色会改变</p>
      <Child />
      <p>被React.memo()包裹，组件不会重新渲染，字体颜色不会改变</p>
      <ChildMemo />
    </>
  );
}
```

### 带 props 组件

要让 React.memo 生效，所有不是简单数据类型的 props 都必须被记住（memorized）

```tsx
import React, { useState, useMemo } from "react";

const Child = ({ data }: { data: { value: string } }) => {
  console.log("Child re-renders", data.value);
  return <>{data.value}</>;
};

// 只组件被memo还不行，如果props是对象，就需要把props也memo处理
const ChildMemo = React.memo(Child);

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const memoValue = useMemo(() => ({ value: "second" }), []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>Second child doesn't re-render</p>

      <button onClick={onClick}>点击</button>

      <p>props为复杂数据类型，未被useMemo记忆，导致组件re-renders</p>
      <ChildMemo data={{ value: "first" }} />

      <p>props为复杂数据类型但被useMemo记忆，组件不会re-renders</p>
      <ChildMemo data={memoValue} />
    </>
  );
}
```

### 组件作为 children 或 props

当组件作为 props 或 children 传递时，"React.memo"必须应用于这些元素上，只是 memo 父组件不起作用

```tsx
import React, { useState, useMemo, ReactNode } from "react";

const Child = ({ data }: { data: { value: string } }) => {
  console.log("Child re-renders", data.value);
  return <p>{data.value}</p>;
};

const ChildMemo = React.memo(Child);

const Parent = ({
  left,
  children,
}: {
  children: ReactNode;
  left?: ReactNode;
}) => {
  // parent一直都会re-render
  console.log("parent re-render");
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <aside style={{ background: "#abc", marginRight: "16px" }}>{left}</aside>
      <main style={{ background: "#cba" }}>{children}</main>
    </div>
  );
};

const ParentMemo = React.memo(Parent);

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const memoValue = useMemo(() => ({ value: "memoized data" }), []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <button onClick={onClick}>点击</button>

      <p>memoized 父，未 memoized 子 将 re-render</p>
      {/* 父memo，子未memo，作为props和children */}
      <ParentMemo left={<Child data={{ value: "left child of ParentMemo" }} />}>
        <Child data={{ value: "child of ParentMemo" }} />
      </ParentMemo>

      <p>
        未Memoized父，Memoized 子 将不会
        re-render；适用上一条原则，要React.memo生效，props需被记忆
      </p>
      {/* 父未memo，子memo，作为props和children */}
      <Parent left={<ChildMemo data={memoValue} />}>
        <ChildMemo data={memoValue} />
      </Parent>
    </>
  );
}
```

## useMemo/useCallback

### 仅记忆 props

> 不推荐：props 上不必要的使用 useMemo/useCallback

单独记忆 props 并不会阻止子组件的重新渲染。如果父组件重新渲染，它将触发子组件的重新渲染，而不管它的 props 是什么。

```tsx
import React, { useState, useMemo } from "react";

const Child = ({ data }: { data: { value: string } }) => {
  console.log("Child re-renders", data.value);
  return <p>Child：value一直是{data.value}，未改变</p>;
};

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const memoValue = useMemo(() => ({ value: "child" }), []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>非必要的使用useMemo/useCallback（二者同质）</p>
      <p>
        组件没有使用React.memo包裹，只是使用useMemo记忆value，依旧会重新渲染
      </p>
      <p>子组件props未改变，但依旧重新渲染</p>

      <button onClick={onClick}>点击</button>

      <Child data={memoValue} />
    </>
  );
}
```

### useMemo 处理子组件的复杂数据类型 props

```tsx
import React, { useState, useMemo } from "react";

const Child = ({ data }: { data: { value: number } }) => {
  console.log("Child re-render:", data.value);
  return <p>{data.value}</p>;
};
const ChildMemo = React.memo(Child);

const values = [1, 2, 3];

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  console.log("当前组件re-render");

  const items = useMemo(() => {
    return values.map((val) => <Child data={{ value: val }} key={val} />);
  }, []);

  const vals = useMemo(() => {
    return values.map((val) => ({
      value: val,
    }));
  }, []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>
        使用useMemo记忆子组件列表，不用分别使用memo记忆子组件，useMemo记忆props
        value值
      </p>

      <button onClick={onClick}>改变 {state}，当前组件重新渲染</button>

      {/* 1、使用useMemo记忆整体列表，不会重新渲染 */}
      {items}

      {/* 2、使用memo记忆组件，使用useMemo记忆对象类型props，不会重新渲染 */}
      {values.map((val, index) => (
        // <ChildMemo data={vals[index]} key={val} />

        // 3、未使用useMemo记忆对象类型props，重新渲染
        <ChildMemo data={{ value: val }} key={val} />
      ))}
    </>
  );
}
```

### 当前组件 hook 依赖复杂数据类型

如果一个组件在 useEffect、useMemo、useCallback 等钩子中使用复杂数据类型作为依赖项，那么它应该被记忆。

```tsx
import React, { useState, useMemo, useEffect } from "react";

export default function App() {
  // 复杂数据类型
  const val = { value: "not memoized" };
  const memoValue = useMemo(() => ({ value: "memoized" }), []);
  const [value] = useState({ value: "memoized? possibly" });
  const [state, setState] = useState(0);

  const onClick = () => {
    setState(state + 1);
  };

  useEffect(() => {
    console.log("我被memo，再点你也看不见我");
  }, [memoValue]);

  useEffect(() => {
    console.log("我在state, 一样看不见我");
  }, [value]);

  useEffect(() => {
    console.log("val 我比较可爱，一点我就出来啦");
  }, [val]);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>

      <button onClick={onClick}>点击了{state}次</button>
    </>
  );
}
```

### 情况四：昂贵的计算

useMemo 的一个用例是避免在每次重新渲染时进行昂贵的计算。
useMemo 有它的成本(消耗一点内存并使初始渲染稍微变慢)，所以不应该在每次计算中都使用它。大多数情况下，挂载和更新组件是最昂贵的计算。
因此，useMemo 的典型用例是记忆 React 元素。通常是现有渲染树的一部分或生成渲染树的结果，如返回新元素的 map 函数。
与组件更新相比，“纯”javascript 操作(如排序或筛选数组)的成本通常可以忽略不计。

```tsx
import React, { useState, useMemo } from "react";

const ExpensiveChild = ({ data }: { data: { value: number } }) => {
  console.log("Expensive Child re-renders", data.value);
  return <p>{data.value}</p>;
};

const values = [1, 2, 3];

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  const items = useMemo(() => {
    return values.map((val) => (
      <ExpensiveChild data={{ value: val }} key={val} />
    ));
  }, []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>CPU密集型子组件不会重新渲染</p>

      <button onClick={onClick}>点击 {state}</button>

      {items}
    </>
  );
}
```

## 优化列表性能

除了常规的重新渲染规则和模式外，key 属性还会影响 React 中列表的性能。

仅仅提供 key 属性不会提高列表的性能。为了防止列表元素的重新渲染，将列表元素用 React.memo 包裹，并遵循以下最佳实践：

key 中的 value 应该是一个字符串，它在列表中的每个元素的重新渲染之间是一致的。通常，使用元素的 id 或数组的索引。

如果列表是静态的，即元素没有添加/删除/插入/重新排序，那么使用数组的下标作为键也是可以的。

不过在动态列表中使用数组的索引会导致:

- 如果项目有状态或任何未受控元素(如表单输入)，则会出现错误
- 如果项目被包裹在 React.memo 中，则会降低性能

### 静态列表

```tsx
import React, { useEffect, useState } from "react";

const Child = ({ value }: { value: number }) => {
  console.log("Child re-renders", value);
  return <li>{value}</li>;
};

// const ChildMemo = Child;
// memo子组件
const ChildMemo = React.memo(Child);

const values = [1, 2, 3];

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  console.log("父级组件由于state变化，re-render");

  useEffect(() => {
    console.log("父级组件 re-mount");
  }, []);

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>静态列表，分别使用value和index作为key，都可以的</p>
      <p>子组件都不会重新渲染</p>

      <button onClick={onClick}>点击 {state}</button>

      <ul>
        {values.map((val, index) => (
          <ChildMemo value={val} key={index} />
        ))}
      </ul>
      <ol>
        {values.map((val) => (
          <ChildMemo value={val} key={val} />
        ))}
      </ol>
    </>
  );
}
```

### 动态列表

```tsx
import React, { useState } from "react";

const Child = ({ value }: { value: string }) => {
  console.log("Child re-renders", value);
  return <div>{value}</div>;
};

const values = [3, 1, 2];

const ChildMemo = React.memo(Child);

export default function App() {
  const [state, setState] = useState<"ascend" | "descend">("ascend");

  const onClick = () => {
    setState(state === "ascend" ? "descend" : "ascend");
  };

  const sortedValues =
    state === "ascend" ? values.sort() : values.sort().reverse();

  return (
    <>
      <h2>打开控制台，点击按钮</h2>
      <p>动态列表，分别使用id value和index作为key</p>
      <p>index作为key的组件会重新渲染，value作为key的组件不会</p>

      <button onClick={onClick}>切换排序 {state}</button>

      {/* 借助React Developer Tools观察组件 */}

      {/* 切换排序状态，只有index 0、2 会重新渲染，因为key=0的组件，切换状态前后value发生了变化，会重新渲染 */}
      {sortedValues.map((val, index) => (
        <ChildMemo value={`Child of index: ${val}`} key={index} />
      ))}

      {/* 同一个组件，props（key/value）都没有改变，状态改变前后还是同一个组件，组件只是发生了移动，并未重新渲染 */}
      {sortedValues.map((val, index) => (
        <ChildMemo value={`Child of id: ${val}`} key={val} />
      ))}
    </>
  );
}
```

### 随机值作为列表中的键

> 不推荐的用法

随机生成的值不应该用作列表中 key 属性的值。它们将导致 React 在每次重新渲染时重新挂载元素，导致

- 性能很差的列表
- 如果列表有状态或任何未受控元素(如表单输入)，则会出现 bug

```tsx
import React, { useState, useEffect } from "react";

const Child = ({ value }: { value: number }) => {
  console.log("Child re-renders", value);

  // 类似componentDidMount()，证明挂载了此组件
  useEffect(() => {
    console.log("Child re-mounts");
  }, []);

  return <div>{value}</div>;
};
const ChildMemo = React.memo(Child);

const values = [1, 2, 3];

export default function App() {
  // 状态改变，此组件重新渲染，无memo的子组件也会重新渲染
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <h2>打开控制台，点击按钮</h2>

      <button onClick={onClick}>点击 {state}</button>

      {/* memo失效，组件的props随每次改变state都会变化，key在不断变化，组件非同一个，就会重新挂载 */}
      {values.map((val) => (
        <ChildMemo value={val} key={Math.random()} />
      ))}
    </>
  );
}
```

## 使用 Context 时如何防止重新渲染

### 记忆 Provider 的值

如果 Context Provider 不是放在应用的根位置，且组件有可能因为其祖先的更改而重新渲染，那么此组件的值应该被记住。

```tsx
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

const Context = createContext<{ value: number }>({ value: 1 });
const Context2 = createContext<{ value: number }>({ value: 1 });

const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  //   const onClick = () => {
  //     setState(state + 1);
  //   };

  const data = useMemo(
    () => ({
      value: state,
    }),
    [state]
  );
  return <Context.Provider value={data}>{children}</Context.Provider>;
};

const Provider2 = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  //   const onClick = () => {
  //     setState(state + 1);
  //   };

  // 这里没有memo
  const data = {
    value: state,
  };

  //   const data = useMemo(
  //     () => ({
  //       value: state,
  //     }),
  //     [state]
  //   );

  return <Context.Provider value={data}>{children}</Context.Provider>;
};

const useValue = () => useContext(Context);
const useValue2 = () => useContext(Context2);

const Child1 = () => {
  const { value } = useValue();
  const { value: value2 } = useValue2();
  console.log("Child1 re-renders: ", value, value2);
  return <></>;
};

const Child2 = () => {
  const { value } = useValue();
  const { value: value2 } = useValue2();
  console.log("Child2 re-renders: ", value, value2);
  return <></>;
};

const Child1Memo = React.memo(Child1);
const Child2Memo = React.memo(Child2);

export default function App() {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <Provider>
      <Provider2>
        <h2>打开控制台，点击按钮</h2>
        <p>
          切换Provider2中的data，一个使用useMemo，另一个没使用memo，查看控制台输出
        </p>
        <p>没有memoize value时，两个组件会被非必需的重新渲染</p>
        <button onClick={onClick}>button {state}</button>
        <Child1Memo />
        <Child2Memo />
      </Provider2>
    </Provider>
  );
}
```

### 分割数据和 API

如果在 Context 中有 data 和 api 的组合(getter 和 setter)，它们可以被分割到同一个组件下的不同提供者。这样，仅使用 API 的组件就不会在数据更改时重新渲染。

```tsx
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// 两个context
const ContextData = createContext<number>(1);
const ContextApi = createContext<Dispatch<SetStateAction<number>>>(
  () => undefined
);

// Provider组件
const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  return (
    <ContextData.Provider value={state}>
      {/* 提供setState函数，api上下文 */}
      <ContextApi.Provider value={setState}>{children}</ContextApi.Provider>
    </ContextData.Provider>
  );
};

// 事件所在组件，不会重新渲染
const Child1 = () => {
  const useApi = () => useContext(ContextApi);
  const api = useApi();

  console.log("使用API的子组件 re-renders");

  const onClick = () => {
    api(Math.random() * 10);
  };

  return <button onClick={onClick}>在context中设置随机数</button>;
};

// 使用data，会重新渲染
const Child2 = () => {
  const useData = () => useContext(ContextData);
  const value = useData();

  console.log(`使用Data (${value}) 的子组件 re-renders`);

  return <p>{value}</p>;
};

export default function App() {
  return (
    <Provider>
      <h2>打开控制台，点击按钮</h2>
      <p>只使用data的子组件会re-render</p>
      <p>触发方法所在组件不会更新</p>

      <Child1 />
      <Child2 />
    </Provider>
  );
}
```

### 将数据分割成块

如果 Context 管理几个独立的数据块，则可以将它们拆分为同一 Provider 下的更小的 Providers。这样，只有更改块的消费者 consumers 才会重新渲染。

```tsx
import { useState, createContext, useContext, ReactNode } from "react";

const ContextData1 = createContext<number>(123);
const ContextData2 = createContext<string>("abc");

const Provider = ({ children }: { children: ReactNode }) => {
  const [numState, setNumState] = useState(123);
  const [strState, setStrState] = useState("abc");

  // 由两个provider分别提供number和string类型的数据
  return (
    <ContextData1.Provider value={numState}>
      <ContextData2.Provider value={strState}>
        {/* 点击更改number */}
        <button onClick={() => setNumState(numState + 1)}>改变 number</button>
        {/* 点击更改string */}
        <button onClick={() => setStrState(`${strState}d`)}>改变 string</button>
        {children}
      </ContextData2.Provider>
    </ContextData1.Provider>
  );
};

const ChildNum = () => {
  const useNumData = () => useContext(ContextData1);
  const num = useNumData();
  console.log("依赖 num data 子组件 re-render");

  return <p>{num}</p>;
};

const ChildStr = () => {
  const useStrData = () => useContext(ContextData2);
  const str = useStrData();
  console.log("依赖 string data 子组件 re-render");

  return <p>{str}</p>;
};

export default function App() {
  return (
    <Provider>
      <h2>打开控制台，点击按钮</h2>
      <p>拆分多个不同的providers提供独立的数据，子组件独立更新</p>
      <ChildNum />
      <ChildStr />
    </Provider>
  );
}
```

### 上下文选择器

即使使用 useMemo，数据块没有更改，也无法阻止使用部分 Context 值的组件重新渲染。

使用高阶组件和 React.memo 可以伪造上下文选择器 Context selectors。

```tsx
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

const Context = createContext<{ value: number; staticValue: string }>({
  value: 1,
  staticValue: "",
});

const useValue = () => useContext(Context);

// Provider
const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  // state改变，只value变化，data是复杂类型，对象
  const data = useMemo(
    () => ({
      value: state,
      staticValue: "1",
    }),
    [state]
  );

  return (
    <Context.Provider value={data}>
      <button onClick={onClick}>点击</button>
      {children}
    </Context.Provider>
  );
};

const Child1 = () => {
  // 拿到context传来的 value
  const { value } = useValue();
  console.log("value 子组件渲染了：", value);
  // value变化，re-render
  return <p>{value}</p>;
};

// HOC 高阶组件
const withStaticValueFromContext = (Component) => {
  // memo Child2
  const ComponentMemo = React.memo(Component);

  return () => {
    // 拿到context传来的 staticValue
    const { staticValue } = useValue();
    return <ComponentMemo staticValue={staticValue} />;
  };
};

const Child2 = ({ staticValue }: { staticValue: string }) => {
  console.log("staticValue 子组件渲染了：", staticValue);
  return <p>{staticValue}</p>;
};

const Child2WithStaticValue = withStaticValueFromContext(Child2);

const Selector = () => {
  return (
    <Provider>
      <h2>打开控制台，点击按钮</h2>
      <p>
        仅接收动态内容的子组件 <strong>会</strong> 重新渲染
      </p>
      <Child1 />
      <p>
        context "selector"的子组件 <strong>不会</strong> 重新渲染
      </p>
      <Child2WithStaticValue />
    </Provider>
  );
};

export default Selector;
```
