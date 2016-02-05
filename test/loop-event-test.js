/**
 * Created by hetiezheng711 on 2016/2/5.
 */
"use strict";

var LoopEvent = require("../"),
    fs = require("fs"),
    assert = require("assert"),
    path = require("path");

const root = path.resolve(__dirname, "..");

describe('loop event test', function () {
    it('properties test', function (done) {
        var event = new LoopEvent();
        fs.readdir(root, function (err, files) {
            event.setChildCount(files.length);
            assert.equal(event._childCount, files.length);

            event.addChildCount(files.length);
            assert.equal(event._childCount, files.length * 2);
            done();
        });
    });

    it('total test', function (done) {
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
            done();
        });
        loopdir(root, root);
    });

});