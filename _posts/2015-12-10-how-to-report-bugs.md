---
title: How to report bugs or errors
excerpt: "Good practices to follow when reporting bugs or errors."
categories:
    - Javascript
tags: 
    - javascript 
    - programming
    - nodejs
    - code
    - bugs
author: gyandeeps
---

### Introduction

How many times have you received a message/email/IM from your tester or colleague saying "I tried running the code/application and it said there is an error ‘contact the administrator’, can you take a look?" ? 

90% of the time when I receive a request to investigate an error, I only get this message. These are typically generic message shown to users for a multitude of reasons and provides me little if any idea or clue as to the nature of the error.  I must initiate a message back to the reporter of the error to extract more information about the issue which typically leads to a chain of emails back and forth asking standard questions hoping to get an answer from the report that might provide a clue as to where to start the investigation.  This back and forth wastes valuable time in identifying the underlying cause. Instead the reports would add a large amount of value to the investigation process by simply including a few key pieces of data like the steps to reproduce the issue, a log file, or stack trace.  These simple to acquire pieces of information allow us to get started on the investigation or best case scenario is the cause of the error is discovered by the reported and no email to the engineer is needed. It’s like winning a game before even entering the field.

### Key steps

Now with all this said, here is my take on how we can all help each other if we followed these simple steps to exchange messages about errors or bugs.

#### Share the error message

Always share the error message you get when testing the application. Whatever the error message is, it can be generic or specific message. Either copy past the error message or if it’s not possible just take a snapshot of the screen and share that. This would help the person who is trying to investigate based on the error message. Even if it’s a generic error message then also it doesn’t hurt to share it. There is no cost involved here.

#### Share the stack trace or log

This is super important and it’s the source of truth for the error. This is like the key to the castle for the person who will be investigating the error. A lot of time, an experienced person might know the issue by just looking at the stack trace. Providing the stack trace or a log is the most important piece of information an engineer can have to resolve an issue.  It saves us time and frustration when this is presented along with the error message.

#### What is expected and what happened?

This is where reporter or an error should mention the expected outcome and what really happened. Take the opportunity to express what you feel should happen and maybe some ideas of what might be the cause of the error (non-technical). This helps the person who is going to investigate in many different ways. 

> When I hit the left button on the image carousel, the images slide to the left. I would expected them to slide to right.

#### Steps to reproduce

It is also important to understand the workflow to recreate the error. This helps the person who is investigating to recreate the issue on its own by using the steps. If you are not so technical and you are reporting the error then here you can list the steps of what all you did to come to this error. This way even if you don’t provide any information for logs or stack traces this information can help the person who is investigating to reproduce the issue on his end.  

#### Some other useful artifact information

* What is the version of the application being used?
* Anything about the environment you were running the application, like
    * OS
    * Desktop or mobile
    * Screen size 
* Providing information about the domain can be of value as well.

Basically anything you think is important for the person who is going to investigate the issue.

### Conclusion

If you can provide the above information to the person who is going to investigate this issue, then you are  likely to get a quicker response from the engineer and as well you make our jobs less stressful.

Personally, I always follow this practice whenever I report bugs or issue to other people and I expect the same in return and I think everybody wants this kind of response. Once I specially thanked a person who was not at all technical but the person gave me all the above and I was so impressed with the efforts. I specially sent an email to the person and their manager  expressing how this extra bit of time and effort it took to provide the extra information was greatly appreciated.

Let’s all stop the bad practice of just saying "Hey there is an error" and expect the other person to magically know what the issue is.
