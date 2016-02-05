
var events = require("events"),
    util = require('util');

function LoopEvents(parent, childCount) {
    events.EventEmitter.call(this, arguments);
    this._childCount = childCount || 0;
    this._parent = parent;
    this.hadDoneChildCount = 0;

    this.on("childDone", function () {
        ++this.hadDoneChildCount;
        if (this.hadDoneChildCount == this._childCount) {
            this.emit("childAllDone", arguments);
        }
    });
    this.on("childAllDone", function () {
        if (this._parent) {
            this._parent.emit("childDone", arguments);
        } else { //to root
            this.emit("allDone", arguments);
        }
    });
}
LoopEvents.prototype.parent = function (parent) {
    this._parent = parent;
};
LoopEvents.prototype.childCount = function (childCount) {
    this._childCount = childCount;
};

LoopEvents.prototype.addChildCount = function (childCount) {
    return this._childCount = (this._childCount || 0) + childCount;
};
util.inherits(LoopEvents, events.EventEmitter);

module.exports = LoopEvents;
