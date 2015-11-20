---
layout: post
title: Game changer: Lazy loading
excerpt: "How lazy loading can have significant impact on module load."
tags: [javascript, eslint, lazy-loading, lazy loading, nodejs, load-perf]
modified: 2015-11-20
comments: true
author: gyandeeps
image:
    feature:
---

Lazy loading concept has been know for a very long time. For definition and more details, [click here](https://en.wikipedia.org/wiki/Lazy_loading)


### Introduction

I have been part of the [ESLint](http://eslint.org/) JavaScript lint library for quite a while now. Overtime as we added more and more rules and started depending on more external dependencies, our load time of the library gradually started increasing. Recently people started talking about how it takes a long time for to load before it can actually start doing any thing. After hearing a lot from people I decided to concentrate on this area and find out whats going on and how we can improve the load time of the library.

### Problems:

* ESLint takes a long time to load before it can actually start doing any thing.
* This time is growing with the increasing number of rules.
* External dependencies are also impacting the load time.

### Investigation:

First step was to benchmark the current loadtime of ESLint. To do that I needed a tool which could measure the require time of ESLint and also the require time of all of its dependencies individually. After setting these 2 goals I started hunting for modules which can do such benchmarking for me. The results was that there was no tool to do such a benchmarking for me.
This led to the creation of a module called [load-perf](https://www.npmjs.com/package/load-perf), which does load benchmarks for your module and its dependencies including devDependencies. After creating this tool I was set to take up the challenge of improving ESLint load time.

#### Phase 1

* Recorded the initial load time of the library.
* Recorded the load time of all the dependencies.

##### Findings

* Load time of the library: `~470ms`
* We were loading all the rules at load time of the library which was costing `~120ms`
* Dependencies which had a significant impact were:
    * escope: `~58ms`
    * handlebars: `~65ms`
    * js-yaml: `~45ms`
    * inquirer: `~101ms`
    * shellsjs: `~35ms`

#### Phase 2

After phase 1, I decided to tackle the problem by doing the following things:

* Do not load rules on load rather load the rules based on the need.
    * This means only load those rules which are needed and when they are needed.
* [inquirer](https://www.npmjs.com/package/inquirer) is a library used by ESLint to help end-user to generate config files.
    * End-users only generate config file when they are first time user of ESLint.
    * 95% times when ESLint is used is not used to generate config files.
    * This tells us that we can only load this library when the user wants to generate config file otherwise don't load it.
    * This would saves us a lot of time because this is the most expensive library load wise.

##### Findings

* Load time of the library: ``~270ms``
* Now we only load rules which are needed and that too only at runtime.
* Only load inquirer dependency when its actually needed and not all the time.

#### Performance Runs

##### With 5 rules active

###### Regular loading

```sh
Makefile run: 958ms
```

###### Lazy loading

```sh
Makefile run: 830ms
```

##### With 41 rules active

###### Regular loading

```sh
Makefile run: 989ms
```

###### Lazy loading

```sh
Makefile run: 882ms
```

##### With ALL rules active

###### Regular loading

```sh
Makefile run: 1173ms
```

###### Lazy loading

```sh
Makefile run: 1128ms
```

### Conclusion

* We improved the load time of the library by `~45%`
* Used a very basic concept of lazy loading to accomplish performance improvements.
* This work led to the creation of a awesome library for load performance testing called [load-perf](https://www.npmjs.com/package/load-perf).


