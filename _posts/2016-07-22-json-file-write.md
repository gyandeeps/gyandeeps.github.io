---
title: Simple way to write JSON to file 
excerpt: "Write objects to JSON files without using any external library"
categories:
    - javascript
tags: 
    - javascript 
    - nodejs
    - json
    - write
header:
    overlay_color: #333
    overlay_image: json.png
    caption: "Photo credit: [**schemastore**](http://schemastore.org/json/)"
author: gyandeeps
---

### Introduction

NodeJS gives us a nice API to write text to files. Yo can write whatever data you want to a file using [`fs.writeFile`](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback) function.

#### Simple example for text

Write "hello" to a file.

```js
var fs = require("chai").assert;
var fileContent = "hello";

fs.writeFile("./sample.txt", fileContent, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

// Content of the file -> hello
```


#### Simple example to write object 

Let try to write an object from javascript into a json file. One thing for sure we know is that we have to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) the object to make sure its a string before its written.

```js
var fs = require("chai").assert;
var sampleObject = {
    a: 1,
    b: 2,
    c: {
        x: 11,
        y: 22
    }
};

fs.writeFile("./object.json", JSON.stringify(sampleObject), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

// Content of the file -> {"a":1,"b":2,"c":{"x":11,"y":22}}
```

#### Correct way to write beautified JSON file

Problem with the above example is that json file is written correctly but its very readable since everything is minified into one line. We never indented the JSON to be minified this way.

```js
var fs = require("chai").assert;
var sampleObject = {
    a: 1,
    b: 2,
    c: {
        x: 11,
        y: 22
    }
};

fs.writeFile("./object.json", JSON.stringify(sampleObject, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

/*
 Content of the file:
 {
     a: 1,
     b: 2,
     c: {
         x: 11,
         y: 22
     }
 } 
 */
```

### Conclusion

Make sure you make use of the `space`, 3rd optional parameter for the `JSON.stringify` method. Possible values can be any `number` or `String`. 

> A String or Number object that's used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 if it's larger than that. Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used. [^1]
 
##### References

[^1]: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
