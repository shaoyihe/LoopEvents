# Loop EventEmit

multiple asynchronous event for eventemit

## Installation

     npm install loop-events
      
## Usage
      
multiple asynchronous event complete :

    var LoopEvent = require("loop-events"),
        https = require("https");
    
    var urlEvent = new LoopEvent();
    var urls = ["https://github.com/", "https://github.com/", "https://github.com/"];
    
    urlEvent.setChildCount(urls.length);
    urlEvent.on("allDone", function () {
        console.log("allDone");
    });
    urls.forEach(function (url) {
        https.request(url, function () {
            urlEvent.emit("childDone");
        }).end();
    });
    
 
more complex (recursion folder complete event):

    var LoopEvent = require("loop-events"),
        fs = require("fs"),
        path = require("path");
    
    var root = path.resolve(__dirname, "..");
    var event = new LoopEvent();
    function loopdir(folder, parent) {
        fs.readdir(folder, function (err, files) {
            if (files.length == 0) {
                parent.emit("childAllDone")
                return;
            }
            parent.setChildCount(files.length);
            files.forEach(function (file) {
                var curLoopEvents = new LoopEvent(parent);
                var absPath = path.join(folder, file);
                fs.stat(absPath, function (err, stas) {
                    if (stas.isDirectory()) {
                        loopdir(absPath, curLoopEvents);
                    } else {
                        curLoopEvents.emit("childAllDone", absPath);
                    }
                })
            })
        })
    }

    event.on("allDone", function () {
        console.log("allDone");
    });
    loopdir(root, event);