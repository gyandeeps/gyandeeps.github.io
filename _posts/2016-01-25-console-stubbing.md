---
layout: post
title: Side effects of stubbing console in tests
excerpt: "Avoid stubbing console inside tests as it can have unintentional effects on the out comes."
tags: [javascript, mock, console, open source, nodejs, stub, sinonjs]
modified: 2016-01-25
comments: true
author: gyandeeps
share: true
image:
    feature:
---

We all love stubbing objects in unit test as it makes our life easier when writing tests. You can stub objects created by your source code or objects which our environment specific like node or browser. On [ESLint](https://github.com/eslint/eslint) project, we were stubbing `console` object so that we can see a clean output for the test runs. But later on we figured out that if the test has some errors then it will not be displayed by the testing framework on the cmd because we have stubbed the console object completely.

For better understanding of stubbing please reference excellent article by [Elijah Manor](https://twitter.com/elijahmanor) - [Unit Test like a Secret Agent with Sinon.js](http://elijahmanor.com/unit-test-like-a-secret-agent-with-sinon-js/). {: .notice }

Lets run through some scenarios of what happens when you do mock console vs when you don't mock console. We will be using the following libraries for demonstration purposes:

1. [Mocha](https://mochajs.org/)
1. [Sinon.JS](http://sinonjs.org/)
1. [Chai asserts](http://chaijs.com/api/assert/)
1. [Proxyquire](https://github.com/thlorenz/proxyquire)

## Scenarios {#id}

#### Test pass and console is not mocked {#id}

Without mocking anything, if we run a sample test with all test passing.

{% highlight JavaScript %}
var assert = require("chai").assert;
var sinon = require("sinon");

describe("validation", function(){
    it("Expect it to be true", function(){
        assert.isTrue(true);
    });

    it("Expect it to be false", function(){
        assert.isFalse(false);
    });
});
{% endhighlight %}

The output will be

{% highlight Bash %}
$ ./node_modules/.bin/mocha test.js

  validation
    √ Expect it to be true
    √ Expect it to be false


  2 passing (6ms)
{% endhighlight %}

Everything works as expected and mocha is able to easily display the output for the test.

#### Test fail and console is not mocked {#id}

Without mocking anything, if we run a sample test in which one test has failure.

{% highlight JavaScript %}
var assert = require("chai").assert;
var sinon = require("sinon");

describe("validation", function(){
    it("Expect it to be true", function(){
        assert.isTrue(false);
    });

    it("Expect it to be false", function(){
        assert.isFalse(false);
    });
});
{% endhighlight %}

The output will be

{% highlight Bash %}
$ ./node_modules/.bin/mocha test.js

  validation
    1) Expect it to be true
    √ Expect it to be false


  1 passing (8ms)
  1 failing

  1) validation Expect it to be true:
     AssertionError: expected false to be true
      stack trace...
{% endhighlight %}

Everything works as expected and mocha is able to easily display the output for the test failure and the stack trace for information about the error.

#### Test fail and console is mocked {#id}

We will mock some common methods on `console` object and then the test which has some failures.

{% highlight JavaScript %}
var assert = require("chai").assert;
var sinon = require("sinon");

describe("validation", function(){
    beforeEach(function(){
        this.cStub1 = sinon.stub(console, "info");
        this.cStub2 = sinon.stub(console, "log");
        this.cStub3 = sinon.stub(console, "error");
        this.cStub4 = sinon.stub(console, "trace");
    });
    afterEach(function(){
        this.cStub1.restore();
        this.cStub2.restore();
        this.cStub3.restore();
        this.cStub4.restore();
    });

    it("Expect it to be true", function(){
        assert.isTrue(false);
    });

    it("Expect it to be false", function(){
        assert.isFalse(false);
    });
});
{% endhighlight %}

The output will be

{% highlight Bash %}
$ ./node_modules/.bin/mocha test.js

  validation

  1 passing (13ms)
  1 failing

  1) validation Expect it to be true:
     AssertionError: expected false to be true
      stack trace...
{% endhighlight %}

Everything works as expected and mocha is able to easily display the output for the test failure. But if you see closely the individual test run checks didn't get printed. Now that is because your test stubbed the console object. Since this is very simple example that is why the damage is minimum but it can lead to more bigger issues.

#### Worst scenario {#id}

when you do all the mocking inside the test (inside `it`) and not inside `beforeEach`. Then if a test fails the stub never restores itself. 

{% highlight JavaScript %}
var assert = require("chai").assert;
var sinon = require("sinon");

describe("validation", function(){
    it("Expect it to be true", function(){
        this.cStub1 = sinon.stub(console, "info");
        this.cStub2 = sinon.stub(console, "log");
        this.cStub3 = sinon.stub(console, "error");
        this.cStub4 = sinon.stub(console, "trace");
        
        assert.isTrue(false);
        
        this.cStub1.restore();
        this.cStub2.restore();
        this.cStub3.restore();
        this.cStub4.restore();
    });

    it("Expect it to be false", function(){
        assert.isFalse(false);
    });
});
{% endhighlight %}

The output will be

{% highlight Bash %}
$ ./node_modules/.bin/mocha test.js

  validation
{% endhighlight %}

Here nothing gets displayed because `console` never got restored to its original state. If you have many tests then this can lead to potential undetected issues. Debugging is a nightmare in this situation.

## Solution {#id}

Best way to tackle such scenarios is to extract the logging logic into its own module and then stub that module inside your tests.

Create `logging.js` module to be consumed.

{% highlight JavaScript %}
module.exports = {
    info: function() {
        console.log.apply(console, Array.prototype.slice.call(arguments));
    },

    error: function() {
        console.error.apply(console, Array.prototype.slice.call(arguments));
    }
};
{% endhighlight %}

Consume `logging` module created above inside your `app.js` module.

{% highlight JavaScript %}
var log = require("./logging.js");

module.exports = {
    sayHi: function(name){
        log.info("Hi " + name);
    }
};
{% endhighlight %}

So this way when you write unit test for the `app` module you can actually stub `logging` module.

{% highlight JavaScript %}
var assert = require("chai").assert;
var sinon = require("sinon");
var proxyquire = require("proxyquire");

proxyquire = proxyquire.noCallThru().noPreserveCache();

describe("validation", function(){
    var log = {
        info: sinon.spy(),
        error: sinon.spy()
    };

    it("Expect it to be true", function(){
        var app = proxyquire("../lib/app", {
            "./logging": log
        });
        app.sayHi("test");
        assert.isTrue(log.info.calledOnce);
    });

    it("Expect it to be false", function(){
        assert.isFalse(false);
    });
});
{% endhighlight %}

## Conclusion {#id}

Always avoid stubbing `console` as there is always a better way to achieve what you are trying to do. Sometimes stubbing like this may lead to issue where you will not know that there are issues since they all are silently getting ignored.

##### References

* Some of the code examples have been taken from [ESLint](http://eslint.org/) library.
* For list of libraries used please reference the top section of the article.
