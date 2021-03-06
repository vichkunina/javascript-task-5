'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var sub = {};

    return {
        on: function (event, context, handler) {
            if (!sub.hasOwnProperty(event)) {
                sub[event] = [];
            }
            sub[event].push({
                context, handler
            });

            return this;
        },

        off: function (event, context) {
            for (let element in sub) {
                if (event + '.' === element.substr(0, event.length + 1) || element === event) {
                    sub[element] = sub[element].filter(current => current.context !== context);
                }
            }

            return this;
        },

        emit: function (event) {
            let eventList = event.split('.');
            while (eventList.length > 0) {
                let newEvent = eventList.join('.');
                if (sub[newEvent]) {
                    sub[newEvent].forEach(element => element.handler.call(element.context));
                }
                eventList.pop();
            }

            return this;
        }
    };
}
