"use strict";

(function () {

    var root = self;

    function DeviceStatus(bot, status_element) {
        $(status_element).html('Device offline');
        bot.on("*", function(data, eventName) {
            clearTimeout(this.timeoutId);
            $(status_element).html('Device online');
            this.timeoutId = setTimeout(this.handleTimeout, 5000);
        })
        // TODO add timeout, to check if events stop coming
    }

    DeviceStatus.prototype.handleTimeout = function() {
        $(status_element).html('Device offline');
    }


//    DeviceStatus.prototype.sequences = function(token, callback){
//    }

    root.DeviceStatus = DeviceStatus;

})();

