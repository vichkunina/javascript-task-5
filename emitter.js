'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var sub = {};

    return {
        on: function (event, context, handler) {
            if (!(event in sub)) {
                sub[event] = [];
            }
            sub[event].push({
                context, handler
            });

            return this;
        },

        off: function (event, context) {
            for (let element in sub) {
                if (element.includes(event + '.') || element === event) {
                    sub[element] = sub[element].filter(current => current.context !== context);
                }
            }

            return this;
        },

        emit: function (event) {
            let eventList = event.split('.');
            while (eventList.length) {
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
