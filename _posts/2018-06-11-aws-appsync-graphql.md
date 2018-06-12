---
title: AWS AppSync App with React and Apollo 
excerpt: "Core pieces needed to build an application using AWS AppSync"
categories:
    - aws
    - javascript
tags: 
    - javascript
    - aws
    - graphql
    - appsync
    - apollo
author: gyandeeps
share: true
---

# Introduction

Walk through on how to build an application using AWS AppSync and what all things are needed on the front end side to get the whole system working. We will not be covering any basics as there are so many blog posts out there for that.

## Prerequisites

Basic understanding of:

* React
* React router
* AWS AppSync setup inside AWS console
* Different Apollo libraries
* GraphQL terminologies - Query, Mutations and Subscriptions

#### Resources

* [Building Serverless React GraphQL Applications with AWS AppSync](https://tylermcginnis.com/building-serverless-react-graphql-apps-with-aws-appsync) by [Nader Dabit](https://twitter.com/dabit3)

If you don't have basic understanding on any of these topics then I would highly recommended learning about that before proceeding ahead.

## What are we going to learn

* Wire up AWS AppSync with all the config
* Authentication using AWS Cognito integration
* Manage mutation and resolvers
* Manage client state and server side state using apollo

## Motivations

* Not able to find any docs which explains how all these pieces work together.
* Not much info for advanced level stuff vs basic getting started.
* Spent so much time trying to figure out all these pieces and how they work together.

# Setup

## Libraries

* [`aws-amplify`, `aws-amplify-react`](https://github.com/aws/aws-amplify) - For Auth and other AWS calls
* [`aws-appsync`, `aws-appsync-react`](https://github.com/awslabs/aws-mobile-appsync-sdk-js) - Wrapper around apollo client which manages communication to `graphql` api endpoint
* [`react-apollo`](https://github.com/apollographql/react-apollo) - Apollo client side library for React framework
* Other apollo libraries like `apollo-link-http`, `apollo-link-state` and `apollo-cache-inmemory`

_Note: Most of the blogs out their doesn’t cover all the aspects of an app and that why they only use sub-set of these libraries._

# Building blocks

## Basic app loading

I assume you already have something loading just using `react` (create using `create-react-app`). We are going to build on top of that. So let’s say you have a div rendering with hello world for now.

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

class App extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
```

## Add AWS AppSync layer to connect to backend

We are going to use `aws-amplify` library provided by AWS AppSync team. This would take care of talking directly to AWS resources like `cognito` for Auth, analytics api, pubsub, API calls, etc. For more detailed info, please use the [readme](https://github.com/aws/aws-amplify/blob/master/README.md).

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Amplify, { Auth } from "aws-amplify";

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
        // REQUIRED - Amazon Cognito Region
        region: "XX-XXXX-X",
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "XX-XXXX-X_abcd1234",
        // OPTIONAL - Amazon Cognito Web Client ID
        userPoolWebClientId: "XX-XXXX-X_abcd1234"
    }
});

class App extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
```

* Once you have configured `Amplify` then in any other module you can import a particular artifact and use it.
    * Docs - https://aws.github.io/aws-amplify/media/developer_guide
* In this case we are only using Auth so we have configured that portion only. But for API or any other modules, you can add a block and its configurations.
* As per the above setup you should be good to go and use `Auth` module anywhere in your app.

## Add cache and state management

We are going to use `aws-appsync` and `aws-appsync-react` libraries to create local cache where the data from graphql and your local state will be saved. The concept is more like `Redux` but here behind the scene `aws-appsync` uses Apollo cache and its libraries to do the heavy lifting.

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Amplify, { Auth } from "aws-amplify";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import AWSAppSyncClient, { createAppSyncLink } from "aws-appsync";

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
        // REQUIRED - Amazon Cognito Region
        region: "XX-XXXX-X",
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "XX-XXXX-X_abcd1234",
        // OPTIONAL - Amazon Cognito Web Client ID
        userPoolWebClientId: "XX-XXXX-X_abcd1234"
    }
});

const cache = new InMemoryCache();
let nextTodoId = 1;
const stateLink = withClientState({
    cache,
    defaults: {
        todos: []
    },
    resolvers: {
        Mutation: {
            addTodo: (_, { text }, { cache }) => {
                const query = gql`
                    query GetTodos {
                        todos @client {
                            id
                            text
                            completed
                        }
                    }
                `;
                const previous = cache.readQuery({ query });
                const newTodo = {
                    id: nextTodoId++,
                    text,
                    completed: false,
                    __typename: "TodoItem"
                };
                const data = {
                    todos: previous.todos.concat([newTodo])
                };
                cache.writeData({ data });
                return newTodo;
            }
        }
    }
});

const authConfig = {
    type: appSyncAtrributes.authenticationType,
    jwtToken: async () =>
        (await Auth.currentSession()).getAccessToken().getJwtToken()
};

const client = new AWSAppSyncClient(
    {
        disableOffline: true,
        url: appSyncAtrributes.graphqlEndpoint,
        region: appSyncAtrributes.region,
        auth: authConfig,
        complexObjectsCredentials: () => Auth.currentCredentials()
    },
    {
        cache,
        link: ApolloLink.from([
            stateLink,
            createAppSyncLink({
                url: appSyncAtrributes.graphqlEndpoint,
                region: appSyncAtrributes.region,
                auth: authConfig,
                complexObjectsCredentials: () => Auth.currentCredentials()
            })
        ])
    }
);

class App extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
```

A lot of stuff happened in the code above. Lets discuss the important pieces here.

#### Cache/State

Based on all the articles out their, when you use `AWSAppSyncClient` directly by providing the first parameter you automagically start maintaining local cache of your remote calls. i.e. when you fetch data from your graphql api then its stored inside cache. But we want to maintain some client side local state as well, which is not coming from the grapghql api. We do that using `apollo-link-state`.

Most important pieces to understand here are:

* `createAppSyncLink` - Default state setup done by the `aws-appsync` library.
* `withClientState` - we create the local state maintained by the app on the front-end. In this case it’s the todo state.
* `ApolloLink.from` - Using this we combine the output from above 2 commands to get a single entry point into the state. Think of this as merging the remote and local state into a single state.
* `ApolloProvider` -  It’s like `react-redux` provider which exposes the client downstream into other components.

## Using state in component

Here I am just going to focus on the `App` component as all the other code around it remains the same. Ideally you should create the `App` component as a separate file and import it.

```js
import * as React from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

const GET_TODOS = gql`
    {
        todos @client {
            id
            completed
            text
        }
    }
`;

const GET_ORDERS = gql`
    {
        listOrders {
            items {
                id
                name
            }
        }
    }
`;

const ADD_TODO = gql`
    mutation addTodo($text: String!) {
        addTodo(text: $text) @client {
            id
        }
    }
`;

class App extends React.Component {
    render() {
        return (
            <Query query={GET_ORDERS}>
                {({ data }) => (
                    <Mutation mutation={ADD_TODO}>
                        {(addTodo) => (
                            <>
                                <div>{JSON.stringify(data)}</div>
                                <button
                                    onClick={() =>
                                        addTodo({
                                            variables: { text: "gyandeep" }
                                        })
                                    }
                                >
                                    add
                                </button>
                            </>
                        )}
                    </Mutation>
                )}
            </Query>
        );
    }
}
```

Most important pieces to understand here are:

* `Query` and `Mutation` - Components for graphql stuff.
* `onClick` `addTodo` call - Add todo calls a mutation on the client side using the directive `@client` inside the mutation definition. This tells the underlying apollo infrastructure that this graphql command is for local changes only.
    * In the main file in `stateLink` using `withClientState`, we defined the mutation resolver for add todo that basically writes to the local cache and then the components refreshes to read the values.
    * Think of this as **`redux` actions and reducers**.
* `GET_ORDERS` - This graphql query doesn’t use the `@client` so it hit's the graphql interface over the network and then when data comes back it updates the cache automagically.

## Authentication

After all the setup done, if you want your route in this case `App` to be authenticated before procedding then you can use the helper to achieve that.

```js
import { withAuthenticator } from "aws-amplify-react";

// App class definition here as seen above

export default withAuthenticator(App);
```

So before this components gets rendered it will route to login page. For more details on this I would recommend using the [guide here](https://aws.github.io/aws-amplify/media/authentication_guide). It explains everything very nicely.

# Conclusion

* You should not use `Redux` as it doesn’t work nicely with apollo cache. I know its hard but once you move over to apollo you will be fine.
    * It took me some time to understand.
* Think of your resolvers as redux reducers, I would recommend writing them separately.
* Think of all `gql` queries as actions, I would recommend writing them separately as well.

## Notes

* Wrote this because I struggled with all these pieces (different libraries) a lot and complained a lot to people and twitter.
* I am just 2-3 weeks old in AppSync world, so this post is like a brain dump.
