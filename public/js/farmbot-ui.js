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
                   callback({token:MY_SHINY_TOKEN, raw_response:data});
               }
      });
    }



    root.FarmbotUI = FarmbotUI;

})();

