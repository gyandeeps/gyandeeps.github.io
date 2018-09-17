---
title: React - How to use keys to avoid using getDerivedStateFromProps
excerpt: "How to use keys to avoid using getDerivedStateFromProps"
categories:
    - javascript
tags: 
    - javascript
    - react
author: gyandeeps
share: true
---

# Background

Until today I used `key` in `react` only when react dev threw warnings inside the console. Other than that I never cared about keys and never invested time to understand them. This is me being brutally honest to you all readers. :)

# Problem

Have a component which display person name form based on different name and id passed to it. So using that form user can edit person details.

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";

class NameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId || 0,
            name: props.name || ""
        };
    }

    handleChange = event => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = event => {
        console.log("A name was submitted: " + this.state.name);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {
                1: "A",
                2: "B",
                3: "C"
            },
            editUserId: "new"
        };
    }

    onChange = event => {
        const value = event.target.value;

        this.setState(() => ({
            editUserId: value
        }));
    };

    render() {
        const { editUserId, users } = this.state;

        return (
            <div>
                <span>Select Edit userId: </span>
                <select onChange={this.onChange}>
                    <option value="new">New User</option>
                    {Object.entries(users).map(([userId, name]) => (
                        <option value={userId}>{name}</option>
                    ))}
                </select>
                <NameForm userId={editUserId} name={users[editUserId] || ""} />
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### Observations

* Form name field displays no data since by default its set to new user.
* Now when you select user `A` from the select list, it still shows name as empty.
* Since react thinks its the same component so it will not call the `constructor` again.
* At this point you will be thinking that I need to change `state` of `NameForm` component based on `prop` changes.
    * This is called syncing state with props.
* And now yuou will be convinced that you need to use `getDerivedStateFromProps` static method because you need to change state based on prop change.
* This is where you went wrong.
  
# Solution

Let me quote a line from [React documentation](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops):

> If you want to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.

**Make `NameForm` component controlled by using `key` for React elements.**

Thats it.

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";

class NameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId || 0,
            name: props.name || ""
        };
    }

    handleChange = event => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = event => {
        console.log("A name was submitted: " + this.state.name);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {
                1: "A",
                2: "B",
                3: "C"
            },
            editUserId: "new"
        };
    }

    onChange = event => {
        const value = event.target.value;

        this.setState(() => ({
            editUserId: value
        }));
    };

    render() {
        const { editUserId, users } = this.state;

        return (
            <div>
                <span>Select Edit userId: </span>
                <select onChange={this.onChange}>
                    <option value="new">New User</option>
                    {Object.entries(users).map(([userId, name]) => (
                        <option value={userId}>{name}</option>
                    ))}
                </select>
                <NameForm key={editUserId} userId={editUserId} name={users[editUserId] || ""} />
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### Observations

* We added `key` to the `NameForm` component.
    * This tells react to create a new instance of `NameForm` based on the key.
    * With that, component `constructor` will get called and the state is maintained.
* Now when you change values from the dropdown the form values will change.

# Conclusion

* When you think about using `getDerivedStateFromProps`, take a step back and think through the problem and see if you can use `key`.
* Thats why you will see people say that you should avoid or use `getDerivedStateFromProps` rarely.
* This was an eye opener for me when I actually used it. While reading docs I didn't get the whole point.
