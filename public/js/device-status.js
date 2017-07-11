"use strict";

(function () {

    var root = self;

    function DeviceStatus(bot, status_element) {
        var this_device_status = this;
        this_device_status.status_element = status_element;
        this_device_status.bot = bot;
        $(this_device_status.status_element).html('Device offline (maybe)');
        bot.on("*", function(data, eventName) {
            log("I just got a(n) " + eventName + " event!");
            log("This is the payload: " + JSON.stringify(data));
            if (this_device_status.timeoutId) clearTimeout(this_device_status.timeoutId);
            if (this_device_status.timeoutIdPing) clearTimeout(this_device_status.timeoutIdPing);
            $(this_device_status.status_element).html('Device online');
            this_device_status.timeoutIdPing = setTimeout(this_device_status.pingFarmbot, 2000, this_device_status);
            this_device_status.timeoutId = setTimeout(this_device_status.handleTimeout, 5000, this_device_status);
        });
        this_device_status.bot.readStatus();
    }

    DeviceStatus.prototype.handleTimeout = function(this_device_status) {
        $(this_device_status.status_element).html('Device offline (perhaps)');
    }


    DeviceStatus.prototype.pingFarmbot = function(this_device_status){
        this_device_status.bot.readStatus();
    }

    root.DeviceStatus = DeviceStatus;

})();

