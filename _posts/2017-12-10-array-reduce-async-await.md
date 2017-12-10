---
title: Understanding async/await with Array reduce method
excerpt: "Understand how array reduce can be used with async/await"
categories:
    - Javascript
tags: 
    - javascript
    - async
    - array
author: gyandeeps
share: true
---

I was working on a project when I ran into a use case where I needed to use Array's `reduce` method with some `async/await` (`Promise` based) network calls. That's when things actually became confusing and complicated. Let's learn about how to use async/await with array reduce by running through an example.

## Problem

Get all the pull request objects using GitHub API from a repo who have a commit message **not** starting with `Fix:` or `Docs:`.

We will use a lot of helper methods to talk to GitHub API and do some other operation but will not discuss those in this post as we want to focus `async/await` with array reduce.

## Solution

Let create a function named `getNonSemverPatchPRs` which is going to return all the PR objects from a repo who doesn’t not qualify as semver patch PR based on a the commit message of the PR. Expectation here will be that when we call the `getNonSemverPatchPRs` it should return a `Promise` and that promise should resolve with a array of PR objects.

```js
const getNonSemverPatchPRs = async () => {
    const allOpenPrs = await getAllOpenPRs();

    return allOpenPrs.reduce((collection, pr) => {
        // 1. This is where we want to get all the commits of the PR in context
        // 2. Then we want to see if the commit message of the first commit message starts with `Fix:` or `Docs:`
        // 3. If yes then ignore it otherwise add it to the collection.
    }, []);
};
```

#### Fetch all the commits for a PR

To complete step 1 we need to perform a network call to fetch all the commit for a PR. Now this call will be promised based. Since we have to make `await` the call we need to make the reduce handler function `async`.

```js
const getNonSemverPatchPRs = async () => {
    const allOpenPrs = await getAllOpenPRs();

    return allOpenPrs.reduce(async (collection, pr) => {
        const allCommits = await getAllCommitsForaPR(pr.number);

        // 2. Then we want to see if the commit message of the first commit message starts with `Fix:` or `Docs:`
        // 3. If yes then ignore it otherwise add it to the collection.
    }, []);
};
```

#### Check the commit message from the first commit

Now we are going to check the commit message of the first commit to see if it starts with `Fix:` or `Docs:`. This call is synchronous call to a helper function.

```js
const getNonSemverPatchPRs = async () => {
    const allOpenPrs = await getAllOpenPRs();

    return allOpenPrs.reduce(async (collection, pr) => {
        const allCommits = await getAllCommitsForaPR(pr.number);

        const isNotSemverPatchPR = checkCommitMessageForPatch(allCommits[0]);
        // 3. If yes then ignore it otherwise add it to the collection.
    }, []);
};
```

#### All to collection if PR is not semver patch PR

Now we are going to check if it’s not a semver patch PR then add to collection of reduce otherwise ignore it.

```js
const getNonSemverPatchPRs = async () => {
    const allOpenPrs = await getAllOpenPRs();

    return allOpenPrs.reduce(async (collection, pr) => {
        const allCommits = await getAllCommitsForaPR(pr.number);

        const isNotSemverPatchPR = checkCommitMessageForPatch(allCommits[0]);
        
        if (isNotSemverPatchPR) {
            collection.push(pr);
        }

        return collection;
    }, []);
};
```

### Problem inside reduce with async function handler

* **Thought:** Based on your knowledge of `async/await` and array `reduce`, you would think that it will keep pushing the `pr` objects to the `collection` and return the `collection` so that next iteration of the reduce can use it and keep adding stuff to the collection.

* **Reality:** The reduce callback function is an async function so it will always returns a `Promise`. Since it returns a `Promise` the value of the `collection` parameter is not an array but its a `Promise` from the previous execution.

* **Solution:** Since `collection` always contains a `Promise` then we need to resolve that promise to get the response which will finally become our collection and then we can keep pushing stuff to it and then return that as part of the function.

    * Make the initial value of reduce to be a dummy resolved `Promise` and then we can keep resolving the promises returned by every call.
    * Make a collection inside the function which can be extracted by resolving the passed in Promise.

```js
const getNonSemverPatchPRs = async () => {
    const allOpenPrs = await getAllOpenPRs();

    return allOpenPrs.reduce(async (previousPromise, pr) => {
        const collection = await previousPromise;
        const allCommits = await getAllCommitsForaPR(pr.number);

        const isNotSemverPatchPR = checkCommitMessageForPatch(allCommits[0]);
        
        if (isNotSemverPatchPR) {
            collection.push(pr);
        }

        return collection;
    }, Promise.resolve([]));
};
```

## Conclusion

* Would recommend running through the above example and try to put breakpoints to better understand the flow. Feel free to use the [JSBin](https://jsbin.com/weginet/1/edit?js,console) to play around.
* `async` function always return a `Promise` that is why the reduce function starts accumulating previous `Promise`. When this promise resolves it gives you the real collection retuned inside the function.

I am still working through this but I wanted to write something about this so that I can help others who run into this. Feel free to leave feedback in the comments below.
