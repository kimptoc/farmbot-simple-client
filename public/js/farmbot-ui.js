"use strict";

(function () {

    var root = self;

    function FarmbotUI() {}

    FarmbotUI.prototype.login = function(user_email, passwd, callback) {
      $.ajax({
          url: "https://my.farmbot.io/api/tokens",
          type: "POST",
          data: JSON.stringify({user: {email: user_email, password: passwd}}),
          contentType: "application/json",
          success: function (data) {
                   // You can now use your token:
                   var MY_SHINY_TOKEN = data.token.encoded;
                   callback(null, {token:MY_SHINY_TOKEN, raw_response:data});
               },
          error: function( jqXHR, textStatus, errorThrown ) {
              callback(jqXHR.responseText, null);
          }
      });
    }


    FarmbotUI.prototype.device = function(token, callback){
        $.ajax({
            url: "https://my.farmbot.io/api/device",
            type: "GET",
            contentType: "application/json",
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", token);
            },
            success: function (data) {
                     // You can now use your token:
                log_object(data);
                     callback(null, {device:data});
                 },
            error: function( jqXHR, textStatus, errorThrown ) {
                callback(jqXHR.responseText, null);
            }
        })
    }

    FarmbotUI.prototype.sequences = function(token, callback){
        $.ajax({
            url: "https://my.farmbot.io/api/sequences",
            type: "GET",
            contentType: "application/json",
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", token);
            },
            success: function (data) {
                     // You can now use your token:
                     callback(null, {sequences:data});
                 },
            error: function( jqXHR, textStatus, errorThrown ) {
                callback(jqXHR.responseText, null);
            }
        })
    }

    FarmbotUI.prototype.images = function(token, callback){
        $.ajax({
            url: "https://my.farmbot.io/api/images",
            type: "GET",
            contentType: "application/json",
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", token);
            },
            success: function (data) {
                     // You can now use your token:
                     callback(null, {images:data});
                 },
            error: function( jqXHR, textStatus, errorThrown ) {
                callback(jqXHR.responseText, null);
            }
        })
    }

    root.FarmbotUI = FarmbotUI;

})();

