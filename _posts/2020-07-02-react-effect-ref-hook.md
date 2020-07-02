---
title: React - useRef used in conjunction with useEffect
excerpt: Call useEffect only when one state changes but still using other states inside it.
categories:
    - javascript
tags: 
    - javascript
    - react
    - state
author: gyandeeps
share: true
---

# Problem

Let's say you have to call an external API to submit a name change and every time the name changes you have to call the remove name API and then call the add name API. Alongside this you need to count how many times the API was called regardless of which API you called.

```js
import React, { useEffect, useState } from "react";

export default function RefTest() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [cnt, setCnt] = useState(0);

  // DOM handlers
  const inputChangeHandler = ({ target }) => setText(target.value);
  const sendHandler = () => setName(text);

  // HOOK
  useEffect(() => {
    console.log(`API - Add name: ${name} cnt: ${cnt}`);
    setCnt(cnt + 1);

    return () => {
      console.log(`API - Remove name: ${name} cnt: ${cnt}`);
      setCnt(cnt + 1);
    };
  }, [name, setCnt]);

  return (
    <div>
      <input type="text" value={text} onChange={inputChangeHandler} />
      <button onClick={sendHandler}>Send</button>
      <div>Name: {name}</div>
      <div>Count: {cnt}</div>
    </div>
  );
}
```

_Note: All these examples can be better coded but I am trying to demonstrate a scenario._

There are couple of issues in the code above:

1. `ESLint` issue where We have not added `cnt` as a dependency.
2. If you run the code the count is not correct because of closure it maintains an older value of `cnt` before it can increment.

### Adding `cnt` as a dependency

**_Note: Please do not add `cnt` as dependency as it will cause an infinite render. But if you want to try, do it on a page which you can kill easily._**

The main issue with this approach apart from the infinte render is that it's going to start calling the API even when the `cnt` changes. Which we don't want as we only want to call the API when `name` changes.

# Solution

Maintain the `cnt` as a `ref` so that it can be updated and mutated without impacting the `useEffect` hook execution cycle.

```js
import React, { useEffect, useState, useRef } from "react";

export default function RefTest() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [cnt, setCnt] = useState(0);
  const cntRef = useRef(cnt);

  // DOM handlers
  const inputChangeHandler = ({ target }) => setText(target.value);
  const sendHandler = () => setName(text);

  // HOOKS
  useEffect(() => {
    console.log(`API - Add name: ${name} cnt: ${cntRef.current++}`);
    setCnt(cntRef.current);

    return () => {
      console.log(`API - Remove name: ${name} cnt: ${cntRef.current++}`);
      setCnt(cntRef.current);
    };
  }, [name, setCnt]);

  return (
    <div>
      <input type="text" value={text} onChange={inputChangeHandler} />
      <button onClick={sendHandler}>Send</button>
      <div>Name: {name}</div>
      <div>Count: {cnt}</div>
    </div>
  );
}
```

At this point I am using `cnt` in the state as well so that I can display it on UI otherwise it's not needed.

# Conclusion

* Anytime you want the `useEffect` to execute for state `S1` but you want to use other state values inside it but don't want other states to trigger the `useEffect` for those states than use `useRef` hook to store the other states.
* This is particularly helpful if you subscribe to an API and in your handler you want to do something with the incoming data combined with other state data (not `S1`) before handing it over to some other operation.
