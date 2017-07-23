---
title: Understanding state changes inside Alexa skill
excerpt: "Understand how the state changes and flow of control works in alexa skill"
categories:
    - Javascript
tags: 
    - javascript 
    - alexa
    - alexa-skill
    - state
author: gyandeeps
share: true
---

## Introduction

I will be explaining how the execution flow of an alexa program works based on state changes inside a single user session. All my examples will be written in JavaScript as you can build skills using NodeJS. In this blog, I expect the readers to have basic understanding of building an alexa skill. We will be using [`alexa-sdk`](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) NodeJS package for the example code.

It's not necessary to use states as you can do a lot of stuff by just using the default handler. But separate handlers are very beneficial when you want to break down you skill into different areas. I would recommend using these for medium to advance level alexa skills.

## Basic - skill registration

This is how your basic setup looks like for a lambda function used by the alexa skill. I am showing this code because this is where you register all your different handlers.

```js
exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);

    alexa.appId = process.env.APP_ID; // alexa skill id
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers); // important part where we are going to focus.
    alexa.execute();
};
```

## State handlers

The important part in the above basic setup example is the `registerHandlers` function call. Let's discuss what the different arguments to that function mean.

### `newSessionHandler`

This is a required handler needed by the alexa skill. This handler is called when the user uses the skill. This contains introduction level information and it sets the next state the skill is going to move to.

```js
const newSessionHandler = {
    LaunchRequest() {
        this.handler.state = "ASKMODE";
        this.emit(":ask", "Welcome to Custom Alexa skill, are you ready to begin?");
    }
};
```

it will welcome the user and maybe ask him if he is ready to perform certain actions. The important part here is that we set the `state` to `ASKMODE`. What it's going to do is that the next time call comes back to the lambda function in the same session then it will execute the handlers inside `startGameHandlers`.

### `startGameHandlers` 

This is the extra handler we have added which depends upon a separate state. The core is the same as all the handlers but the only difference is that this handlers is attached to a particular `ASKMODE` state. So if state of session is `ASKMODE` then the call will be handled by all the handlers defined inside this function.

```js
const startGameHandlers = Alexa.CreateStateHandler("ASKMODE", {
    "AMAZON.YesIntent": function () {
        this.emitWithState("AskQuestionIntent");
    },
    "AskQuestionIntent": function() {
        this.handler.state = "ANSWERMODE";

        const randomQuestion = getRandomQuestion();
        this.attributes.questions[randomQuestion.id] = null;  // maintain questions within the same session
        this.attributes.questionId = randomQuestion.id;
        this.emit(":ask", randomQuestion.display);
    },
    "FinishIntent": function() {
        this.emit(":tell", "All your answers are correct. Thanks for playing");
    },
});
```

Again, if you watch here the state gets changed to the `ANSWERMODE` which is going to handle the answer to the question asked here.

### `askQuestionHandlers`

This is the extra handler we have added which depends upon a separate state.

```js
const askQuestionHandlers = Alexa.CreateStateHandler("ANSWERMODE", {
    "AMAZON.YesIntent": function () {
        this.handler.state = "ASKMODE";

        this.attributes.questions[this.attributes.questionId] = 1; // Yes
        this.emitWithState(allThreeQuestionsAnswered(this.attributes.questions) ? "FinishIntent" : "AskQuestionIntent");
    },
    "AMAZON.NoIntent": function () {
        this.handler.state = "ASKMODE";

        this.attributes.questions[this.attributes.questionId] = 0; // No
        this.emitWithState(allThreeQuestionsAnswered(this.attributes.questions) ? "FinishIntent" : "AskQuestionIntent");
    }
});
```

In here it maps the answers for the questions asked from `startGameHandlers`. Here it transfers the `state` back to `ASKMODE` so that the next interaction will be handled by `startGameHandlers`.

## Conclusion

* `state` helps you switch between different handlers.
* State is maintained for each user session and not across sessions.
* State dectates which handlers is active at that point. Then all the calls to the lambda will be directed towards that handler.
* It's easy to build different blocks of the skill and then make them work cohesively. 


_Note: I am still learning so if you find something wrong please leave a comment._
