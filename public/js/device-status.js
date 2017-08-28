"use strict";

(function () {

    var root = self;

    function DeviceStatus(bot, status_element) {
        var this_device_status = this;
        this_device_status.status_element = status_element;
        this_device_status.bot = bot;
        $(this_device_status.status_element).html('Device offline (maybe)');
        bot.on("*", function(data, eventName) {
            try {
                if (data.location_data) {
                    this_device_status.x = data.location_data.position.x;
                    this_device_status.y = data.location_data.position.y;
                    this_device_status.z = data.location_data.position.z;
                    this_device_status.timestamp = new Date();
                }
                log("Got event " + eventName);
//                log("Event payload: " + JSON.stringify(data));
//            log(data);
                if (this_device_status.timeoutId) clearTimeout(this_device_status.timeoutId);
                if (this_device_status.timeoutIdPing) clearTimeout(this_device_status.timeoutIdPing);
                $(this_device_status.status_element).html('Device online [X:' + this_device_status.x +
                    ", Y:" + this_device_status.y +
                    ", Z:" + this_device_status.z +
                    " @" + this_device_status.timestamp + "]");
                this_device_status.timeoutIdPing = setTimeout(this_device_status.pingFarmbot, 2000, this_device_status);
                this_device_status.timeoutId = setTimeout(this_device_status.handleTimeout, 5000, this_device_status);
            } catch (e) {
                error(e+":"+ e.name+"/"+ e.message);
            }
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

