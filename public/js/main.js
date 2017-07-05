$(function() {

    $( "#login" ).click(function() {
      $('#div1').html('working...');
        botui = new FarmbotUI()
        botui.login($('#email').val(),$('#password').val(), function(response) {
                   $('#token').html(response.token);
                   $('#div1').html(JSON.stringify(response.raw_response));
        });
      return false;
    });
    $( "#device" ).click(function() {
      $('#div1').html('working...');
      bot = new Farmbot.Farmbot({token:$('#token').html(), secure: true});

      bot.connect();



      $('#div1').html('connected!');

      bot.on("*", function(data, eventName) {
          console.log("I just got an" + eventName + " event!");
          console.log("This is the payload: " + data);
        })

      // $('#div1').html(bot.getState());
      // $('#div1').html('working...');
      // $.ajax({
      // url: "https://my.farmbot.io/api/device",
      // type: "GET",
      // beforeSend: function(request) {
      //   request.setRequestHeader("Authorization", $('#token').html());
      // },
      // contentType: "application/json",
      // success: function (data) {
      //              $('#div1').html(JSON.stringify(data));
      //          }
      // });
      // return false;
    });

});

