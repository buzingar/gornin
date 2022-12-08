import { useEffect, useRef, useState } from './react.development';

const useXState = (initState) => {
  const [state, setState] = useState(initState);

  let isUpdate = useRef();

  // 相当于setState的包裹函数，代理
  const setXState = (newState, cb) => {
    // 执行更新状态的还是setState，这个prev是形参，调用setState传入的参数即prev
    setState((prev) => {
      isUpdate.current = cb;
      return typeof newState === 'function' ? newState(prev) : newState;
    });
  };

  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current();
    }
  });

  return [state, setXState];
};

export default useXState;
