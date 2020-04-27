---
title: Garage door operations using Raspberry Pi
excerpt: Different garage door operations using raspberry pi
categories:
    - automation
tags: 
    - nodejs
    - raspberrypi
    - automation
author: gyandeeps
share: true
---

# Expectation

In this post I am going to explain how I automated certain garage door operation using raspberry pi. If you find it useful then you can follow this guide and build your own too.

* Open/Close garage door from your phone
* Know the status (open or close) of the garage door.
* Auto close garage door in 5 mins.
* Override auto close in 5 mins.
* Know the time it was last closed/opened.

# Parts needed

1. Raspberry Pi - `~$35`
   1. You can use any kind 3 or 4. I used 4 because I got it for `$5` price difference.
   2. Buy link - [Microcenter](https://www.microcenter.com/product/608436/raspberry-pi-4-model-b---2gb-ddr4)
2. Breadboard jumper wires - [Amazon](https://www.amazon.com/gp/product/B07GD2BWPY)
3. Relay module - [Amazon](https://www.amazon.com/gp/product/B00E0NTPP4)
4. 20 Gauge 2 pin wire - [Amazon](https://www.amazon.com/gp/product/B07SJ44SN1)
   1. You can buy a lower gauge wire also.
5. Magnetic switch - [Amazon](https://www.amazon.com/gp/product/B07YVG637M)

# Setup

### Raspberry Pi

I am not going to go into detail on how to setup Raspberry Pi as most of the setup instructions are avilable out in the wild.

Here is what I used:

* Youtube video - https://www.youtube.com/watch?v=BpJCAafw2qE
* Docs - https://crosstalksolutions.com/getting-started-with-raspberry-pi-4/

Thanks to [@crosstalksol](https://twitter.com/crosstalksol) for the awesome setup guide.

_Note: Please read up on raspberry pi GPIO pins as it will help you when you work on this project._ 

### IP address

First, note down the current IP address of the Pi. Second. makesure you make the ip of the Pi static because we dont want to keep changing it after restarts. This is not a necessary step but it helps while you work on this.

In my setup i have google fiber, so i logged into the router setup page and in the clinet list select raspberry pi. Activated the `reserved` flag on pi client so that it keeps the same ip address. Feel free to google on how to do this on your router.

### Computer

* I installed [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) on my windows machine to `ssh` into raspberry pi from my windows laptop.
* Feel free to use any other `ssh` client which works best for you.

# Let's get to work

## Hardware setup

Lets setup all the different parts to get door working first. At this point dont worry about all these connection as we will go in detail when we start programming them.

We will use `BCM` conventions for GPIO pin numbers. When using pin numbers those will denote physical pin numbers. Run `gpio readall` inside bash session on your raspberry pi to get more details.

#### Find the manual button wire connection into your garage door

I have a Chamberlain garage door opener, I was able to trace the button (from the wall) wires going into one terminal in your garage door opener. It looks like a thin looking wire as compared to regular electric wires in your house. Do not confuse the wires coming from the safety sensors hooked up to your garage door sides.

#### Connect wires from your garage opener sockets to relay module

* Make sure you connect the negative to center terminal of the relay module and hot (positive) wire to left terminal on the relay module.
* Concept is that when we connect these two wires, it completets the circuit which inturn trigger the garage open/close operation.

#### Connect relay to raspberry pi

* Connect GND to pin 6
* Connect VCC to pin 2 ie 5v supply
* Connect IN1 to GPIO 4

IN1 pin is what will be used to trigger the changes. Other 2 wires is to provide power (5v) to the relay.

#### Connect mechanical switch to raspberry pi

* Connect COM to pin 1 ie 3v supply
* Connect NO to GPIO 2
  * This is pin is an pull-up type which means it outputs 3.3v
  * I am still trying to better understand this area.
  * I think you can use other pins as pull-up by configuration but i did not try it.




