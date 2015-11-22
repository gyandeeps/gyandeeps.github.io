---
layout: post
title: Git helpers - Simplify your git workflow
excerpt: "Streamline your git workflows"
tags: [javascript, git, github, open source, nodejs]
modified: 2015-11-21
comments: true
author: gyandeeps
share: true
image:
    feature:
---

Being a git lover, I got tired of typing same commands over and over again. This motivated me to build some alias for my git workflow I use every day. Most of the alias was inherited from [Nicholas C. Zakas's gist](https://gist.github.com/nzakas/c6c98856a5eac76f06e3#file-alias-sh). I took that a step further by creating more alias which I use every time I contribute to open source projects like [Eslint]( http://eslint.org/).

### Commands

#### Work on an issue

When you plan to work on an issue on an open source project, you will want to create a new branch on your project and then start work on it. For that you have to go through couple of steps. To stream line that process now on top of your project you can just run the command:

{% highlight Bash %}
ws 34
{% endhighlight %}

This command will update the master branch with the updates from the remote and then create a new branch on it with name `issue34`.

#### Remove a branch after work is done

Once you are done with your work on the branch. Then you can simply run the below command to delete the branch from local and remote git.

{% highlight Bash %}
wd 34
{% endhighlight %}

#### Update your branch with remote master

let’s say after working on your branch, you want to update your branch with latest content from the remote master. This is important in scenarios where you want to rebase your branch with latest content.

{% highlight Bash %}
update
{% endhighlight %}

#### Squash your commits

I always prefer to keep my changes history clean by squashing my commits. Once you are working on a branch and you want to squash your commits, simple run the following command to rebase. You can pass in a parameter of how many commits you want to include in your rebase from the HEAD. By default it will run rebase on last 2 commits.

{% highlight Bash %}
rebase 4 # This will rebase on last 4 commits, default is 2
{% endhighlight %}

#### Push your changes to remote

After you have finished your work, you want to push your changes to remote. Here mostly you will be doing a regular `push` but if you have done some rebases on your branch then your only option is to `force push`.

Regular push:

{% highlight Bash %}
push # This will push your branch changes but will not push on master
{% endhighlight %}

Force push:

{% highlight Bash %}
fpush # This will push your branch changes but will not push on master
{% endhighlight %}

Both commands will not allow you to push it to master because it considered a good practice to always branch off your changes and then merge it to master using a PR. This is completely my view.

#### Log commits

Quick and easy way to view your commit log in oneline.

{% highlight Bash %}
log
{% endhighlight %}

### Setup

To use all these command follow the steps below to setup:

1. Go to your user directory, for windows user it will be `C:\Users\<your user>`.
1. Create a `.bashrc` file you do not have that file.
1. Add/append the content from the below gist to that file.
1. Open bash window. If already open then close it and then reopen bash window.
1. Run `alias` command and you should see the list of all the alias defined.

**Note:** Feel free to change the function based on your need.

### Gist for all the above commands

{% gist gyandeeps/c7872187585de4fa7153 %}

I hope this helps people to streamline their git workflows. Please share your suggestions.
