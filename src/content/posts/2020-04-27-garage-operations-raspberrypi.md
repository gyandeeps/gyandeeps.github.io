---
title: Garage door operations using Raspberry Pi
excerpt: Automating garage door operations using raspberry pi and other electronic parts
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

_Note: This is my first take at this and I am still learning._

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

I am not going to go into detail on how to setup Raspberry Pi as most of the setup instructions are available out in the wild.

Here is what I used:

* Youtube video - https://www.youtube.com/watch?v=BpJCAafw2qE
* Docs - https://crosstalksolutions.com/getting-started-with-raspberry-pi-4/

Thanks to [@crosstalksol](https://twitter.com/crosstalksol) for the awesome setup guide.

_Note: Please read up on raspberry pi GPIO pins as it will help you when you work on this project._ 

### gpio module on raspberry pi

Inside raspberry pi, open a terminal and write `gpio -v`. We need atleast `2.52` version.

If an update is needed, then follow this: http://wiringpi.com/wiringpi-updated-to-2-52-for-the-raspberry-pi-4b/

### IP address

First, note down the current IP address of the Pi. Second. make sure you make the ip of the Pi static because we don't want to keep changing it after restarts. This is not a necessary step, but it helps while you work on this.

In my setup i have google fiber, so I logged into the router setup page and in the client list select raspberry pi. Activated the `reserved` flag on pi client so that it keeps the same ip address. Feel free to google on how to do this on your router.

### Computer

* I installed [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) on my windows machine to `ssh` into raspberry pi from my windows laptop.
* Feel free to use any other `ssh` client which works best for you.

# Let us get to work

## Hardware setup

Let's setup all the different parts to get door working first. At this point don't worry about all these connection as we will go in detail when we start programming them.

We will use `BCM` conventions for GPIO pin numbers. When using pin numbers those will denote physical pin numbers. Run `gpio readall` inside bash session on your raspberry pi to get more details.

#### Find the manual button wire connection into your garage door

I have a Chamberlain garage door opener, I was able to trace the button (from the wall) wires going into one terminal in your garage door opener. It looks like a thin looking wire as compared to regular electric wires in your house. Do not confuse the wires coming from the safety sensors hooked up to your garage door sides. In my case red was positive and white was negative.

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/garage-machine.jpg){: .align-center}

#### Connect wires from your garage opener sockets to relay module

* Make sure you connect the negative (black in pic) to center terminal of the relay module and hot (red in pic) wire to left terminal on the relay module.
* Concept is that when we connect these two wires, it completes the circuit which in turn trigger the garage open/close operation.

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/relay.jpg){: .align-center}

#### Connect relay to raspberry pi

* Connect GND to pin 6 (other orange looking wire)
* Connect VCC to pin 2 ie 5v supply (red wire in pic)
* Connect IN2 to GPIO 4 (orange wire in pic)

IN2 pin is what will be used to trigger the changes. Other 2 wires is to provide power (5v) to the relay.

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/relay-connection.jpg){: .align-center}

#### Connect magnetic switch to raspberry pi

* Connect COM to ground on pin 6
  * Black wire from the switch to orange looking wire 
* Connect NO to GPIO 2 (red wire in pic)
  * This is pin is an pull-up type which means it outputs 3.3v
  * I am still trying to better understand this area.
  * I think you can use other pins as pull-up by configuration but i did not try it.

Mechanical switch connections

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/magnetic-switch.jpg){: .align-center}

Connection to the raspberry pi

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/raspberrypi.jpg){: .align-center}

#### Mechanical switch to the garage door

* Hook up the mechanical switch on the side of the garage door panel as show in the picture above.
* Hook up the other piece on the movable garage door so that when its closed it comes very close to the other side.
* Basically, it detects close when they are close to each other and open when they are not close to each other.

## Software

Complete code: [Github](https://github.com/gyandeeps/garage)

#### Using `onoff` npm package

* This package only works on Linux so make sure you code on the raspberry pi
  * You can use vscode via ssh to code inside raspberry pi (Google is your friend here)
* Lets setup `GPIO 4` to `out` since we are going to use that pin to trigger the open close.
* Configure `GPIO 2` to `in` as we are going to read high (1) and low (0) based on the magnetic switch changes.
  * Configure this pin to call out function in both direction (high and low)
  * This library allows to read in one direction also.

```js
const buttonTrigger = new Gpio(4, "out", undefined, {
    reconfigureDirection: false
});
const doorSensor = new Gpio(2, "in", "both", {
    reconfigureDirection: false,
    debounceTimeout: 1000
});
```

#### Open close action

* When we want to close/open the garage door we are going to output a low on `GPIO 4` then wait for 1 second and then output high.
* The reason we flip flop is that we want to just output a pulse and then get back to its original state.
* Think of this as a button click, press and release action kind of a deal.
* When you do this at this point it sends the signal to the relay where its output state is disconnected.
* When the trigger happens, it completes the relay switch circuit on the other side.
* That complete circuit allows the current to flow from inside the garage opener and that's why its start to work.
* Sorry I am not an electrician so that's the best I can explain.

```js
export const openCloseGarage = async () => {
    buttonTrigger.write(Gpio.LOW);
    await sleep();
    buttonTrigger.write(Gpio.HIGH);
};
```

#### Bonus stuff

If you use the garage module, I have setup then it should get you all started. Follow these steps inside your raspberry pi:

1. `git clone https://github.com/gyandeeps/garage.git`
2. `npm install` (This is going to take a long time)
3. `sudo sh prod.sh`

#### Phone

* On your phone you should be able to hit `http://<ip address to pi>:3000`
* Then open close the garage.

## Closing thoughts

* This is my first project and i am still trying to figure a lot of things out.
* Please provide feedback or anything which can be improved.
* Any ideas on what else can be done.

Overall picture (needs to find a good place for this but they work for now)

![image-center]({{ site.url }}{{ site.baseurl }}/assets/images/garage/overall.jpg){: .align-center}

## References

* https://crosstalksolutions.com/getting-started-with-raspberry-pi-4/
* https://www.instructables.com/id/Raspberry-Pi-Garage-Door-Opener/
* https://www.driscocity.com/idiots-guide-to-a-raspberry-pi-garage-door-opener/
* http://wiringpi.com/wiringpi-updated-to-2-52-for-the-raspberry-pi-4b/
