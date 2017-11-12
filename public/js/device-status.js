"use strict";

(function () {

    var root = self;

    function set_status(status, new_status) {
        var prefix = 'Device ';
        if (status.info && status.info.info) {
            log('got info');
            log_object(status.info);
            prefix = status.info.info.device.name + ' ';
        }
        $(status.status_element).html(prefix+new_status);
    }

    function status_offline(status) {
        set_status(status, 'offline (maybe)');
    }

    function status_online(this_device_status) {
        set_status(this_device_status,'online [X:' + this_device_status.x +
            ", Y:" + this_device_status.y +
            ", Z:" + this_device_status.z +
            " @" + this_device_status.timestamp + "]");
    }

    function DeviceStatus(bot, status_element, info) {
        var this_device_status = this;
        this_device_status.info = info;
        this_device_status.status_element = status_element;
        this_device_status.bot = bot;
        status_offline(this_device_status);
        bot.on("*", function(data, eventName) {
            try {
                if (data.location_data) {
                    this_device_status.x = data.location_data.position.x;
                    this_device_status.y = data.location_data.position.y;
                    this_device_status.z = data.location_data.position.z;
                    this_device_status.is_online = true;
                    this_device_status.timestamp = new Date();
//                } else {
//                    this_device_status.is_online = false;
                }
//                log("Got event " + eventName);
//                log("Event payload: " + JSON.stringify(data));
//            log_object(data);
//                log_object(this_device_status);
                if (this_device_status.timeoutId) clearTimeout(this_device_status.timeoutId);
                if (this_device_status.timeoutIdPing) clearTimeout(this_device_status.timeoutIdPing);
                if (this_device_status.is_online) {
                    status_online(this_device_status);
                } else {
                    status_offline(this_device_status);
                }
                this_device_status.timeoutIdPing = setTimeout(this_device_status.pingFarmbot, 2000, this_device_status);
                this_device_status.timeoutId = setTimeout(this_device_status.handleTimeout, 5000, this_device_status);
            } catch (e) {
                error(e+":"+ e.name+"/"+ e.message);
            }
        });
        this_device_status.bot.readStatus();
    }

    DeviceStatus.prototype.handleTimeout = function(this_device_status) {
        this_device_status.is_online = false;
        log('got timeout');
        $(this_device_status.status_element).html('Device offline (perhaps)');
    }


    DeviceStatus.prototype.pingFarmbot = function(this_device_status){
        this_device_status.bot.readStatus();
    }

    root.DeviceStatus = DeviceStatus;

})();

