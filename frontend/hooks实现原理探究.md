```javascript
const newHook: Hook = {
  memoizedState: currentHook.memoizedState,

  baseState: currentHook.baseState,
  baseQueue: currentHook.baseQueue,
  queue: currentHook.queue,

  next: null,
};
```

useState(initialState) ->

rerenderState(initialState) ->

basicStateReducer(state, action)

rerenderReducer(basicStateReducer, initialState)
