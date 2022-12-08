import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Counter() {
  let [count, setCount] = useState(0);
  return (
    <>
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </>
  );
}

ReactDOM.render(<Counter />, document.querySelector('#root'));
