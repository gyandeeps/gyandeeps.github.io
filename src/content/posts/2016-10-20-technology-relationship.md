---
title: Use technology to strengthen your relationship
excerpt: "How technology can help you strengthen your relationship"
categories:
    - Javascript
tags: 
    - javascript 
    - aws
    - relationship
    - messages
author: gyandeeps
share: true
---

I got married in December 2014 and after getting married within a month my wife had to move to Omaha, Nebraska to work towards her MIS degree (2 year course). I was left alone in Kansas City (bachelor again :) ). Since I work during the week and on weekends I do some open source work my life was very busy. Only at night I used to talk to my wife for few minutes and then go off to bed. My wife was never happy with how much time I gave her from the day and I didn't even text her. So her biggest complain was that I don't talk to her enough during the day, even don't send text messages. I know every man alive on the planet has heard the same words from the other half.

After all this, one day I decided to do something about this and being a software engineer my first thought was why not use technology and automate this type of human interaction. And that is when I decided to spend few hours on this project.
Now I am going to switch gear and convert the above situation into technical user story and solve the problem in hand.

## User Story

* Send text messages to wife everyday (I chose to send only 1 message). 
* Make sure the message are appropriately worded with words like "love", "miss you", etc.

## Design

I wanted to automate this process so that I can keep doing what I do and my wife still receives messages. This way I will also learn about AWS since everyone is talking about it.

* Use Amazon web services
* Build a script which picks a nice message and sends the message everyday.
    * I choose to send it at 4PM CDT (random time)

## Technical work

Use these Amazon web services:

1. CloudWatch[^1]
1. Lambda[^2]
1. SNS[^3]

### CloudWatch

Setup cloud watch to run my lambda function at a particular time of the day. Its like a cron job.

* Create a rule with a name of your choice.
* Specify the time interval to run. 
    * used Cron expression `0 21 * * ? *` (4PM CDT)
* Select your lambda function inside the target.

### Lambda

This is the brain of this whole project. When this function is triggered by the CloudWatch, it basically picks up a random message from the array of messages and then posts the message to SNS topic (explained later). 

* Create a Lambda function with hello world template
* Give it some name, description and use NodeJS as the environment.
* Use the below code and fill in the required information as mentioned inside the comments

```js 
var AWS = require("aws-sdk");
var messages = [ // this where you want to put all the messages, I have like 100 messages here
    "hi",
    "bye"    
];

function getRandomMessage(){
    return messages[ Math.floor(Math.random() * messages.length ];
}

exports.handler = (event, context, callback) => {
    var sns = new AWS.SNS();
    var params = {
        Message: getRandomMessage(),
        Subject: "<Give a subject name (I just used my wife's name)>",
        TopicArn: "<use the topic arn number from SNS>"
    };
    sns.publish(params, context.done);
};
```

* Create a role which gives permission to your lambda function to post on SNS topic[^4].

### SNS

We will use SNS to setup a topic and when ever you post on the topic it sends a SMS to all the subscribers.

* Create a topic with any name of your choice
    * You will get the topic arn which you want to use inside your lambda function code
* Inside the topic create subscriptions (You want to do it one here unless you plan to send to to many people :p )
    * Set protocol to SMS
    * Set the cell number

## Conclusion

This helped a lot since my wife gets so excited when she gets these messages everyday. She knows its me who is sending these messages but I always deny it. Now she will find out after reading this post.

##### References

[^1]: [CloudWatch](https://aws.amazon.com/cloudwatch/)
[^2]: [Lambda](https://aws.amazon.com/lambda/)
[^3]: [SNS](https://aws.amazon.com/sns/)
[^4]: [AWS Permission model](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html)
