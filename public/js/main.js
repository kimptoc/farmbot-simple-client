$(function() {

    function setFieldFromLocalStorage(fieldRef, storageKey){
        var val = localStorage.getItem(storageKey);
        if (val) {
            $(fieldRef).val(val);
        }
        return val;
    }
    $('#main-bit').hide();
    $( "#action_toggle" ).click(function() {
        $('#action_list').toggle();
    });
    $( "#controls_toggle" ).click(function() {
        $('#controls_list').toggle();
    });
    $('#action_list').hide();
    $('#controls_list').hide();

    var email = setFieldFromLocalStorage('#email','fb.email');
    var passwd = setFieldFromLocalStorage('#password','fb.password');

    if (email && passwd) {
        doLogin();
    }

    function buildButton(name, id){
        return '<span><button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence button button-raised button-action button-pill">'+name+'</button></span>';
    }

    function enableSequenceButtons() {
        $(".trigger-sequence" ).off("click");
        $(".trigger-sequence" ).on("click",function(data) {
//            console.log(JSON.stringify(data));
            var execButton = $(this);
            execButton.prop('disabled', true);

            var sequenceId = Number(execButton.attr('sequence-id'));
            var name = execButton.html();
            $('#message').html("Executing sequence:'"+ name+"'");
            var execPromise = bot.sync()
                .then(function(){
                    bot.execSequence(sequenceId);
                })
                .then(function(){
                    $('#message').html("Sequence '"+name+"' has been triggered.");
                    execButton.prop('disabled', false);
                })
                .catch(function(error){
//                    console.log("Got an error..."+error);
                    $('#message').html("Sequence:'"+ name+"'. "+error);
                    execButton.prop('disabled', false);
                });

            log(execPromise);
          return false;
        });
    }

    function getSequences(){
        $('#sequences').prop('disabled', true);
        $('#message').html('Loading sequences...');
          botui.sequences(localStorage.getItem('fb.token'), function(err, response) {
              $('#sequences').prop('disabled', false);
              if (err) {
                  $('#message').html(err);
              } else {
                  var $sequencelist = $('#sequence_list');
                  $sequencelist.empty();
                  $sequencelist.append("<button id='sequence_toggle' class='button button-raised button-rounded'>All Sequences +/-</button>");
//                  $('#sequence_list').append("<h3>Available Sequences:</h3>");
                  $sequencelist.append("<span id='all_sequences' class='flow'></span>")
                  $.each(response.sequences, function (index, sequence) {
                      $('#all_sequences').append(buildButton(sequence.name, sequence.id))
                      enableSequenceButtons();
                  })
                  $( "#sequence_toggle" ).click(function() {
//                      log("sequence_toggle");
                      $('#all_sequences').toggle();
                  });
                  $('#all_sequences').hide();
                  $('#message').html('Sequences loaded!');

                  //                   console.log(JSON.stringify(response.sequences));
              }
          });

    }

    function doLogin(){
        $('#login').prop('disabled', true);
        localStorage.setItem('fb.email',$('#email').val());
        localStorage.setItem('fb.password',$('#password').val());

        $('#message').html('Logging in...');
          botui = new FarmbotUI()
          botui.login($('#email').val(),$('#password').val(), function(err, response) {
              $('#login').prop('disabled', false);
              if (err) {
                  $('#message').html(err);
              } else {
                  localStorage.setItem('fb.token', response.token);
                  $('#debug').html(JSON.stringify(response.raw_response));
                  bot = new Farmbot.Farmbot({token: localStorage.getItem('fb.token'), secure: true, timeout: 30000});
                  bot.connect()
                      .then(function(){
                        device = new DeviceStatus(bot, '#device_status');
                  });
                  getSequences();
                  $('#login-bit').slideUp();
                  $('#main-bit').slideDown();
              }
          });
    }

    $( "#login" ).click(function() {
        doLogin();
      return false;
    });

    $( "#sequences" ).click(function() {
        getSequences();
      return false;
    });
    $( "#arduino_led" ).click(function() {
        bot.togglePin({pin_number: 13});
    });
    $( "#logout" ).click(function() {
        $('#login-bit').slideDown();
        $('#main-bit').slideUp();
    });
    $( "#goto_home" ).click(function() {
      $('#message').html('Moving to home...');
        bot.moveAbsolute({x:0, y:0, z:0});
    });
    $( "#move_x_higher" ).click(function() {
      $('#message').html('Moving to X 100 forward...');
        bot.moveRelative({x:+100, y:0, z:0});
    });
    $( "#move_x_lower" ).click(function() {
      $('#message').html('Moving to X 100 back...');
        bot.moveRelative({x:-100, y:0, z:0});
    });
    $( "#move_y_higher" ).click(function() {
      $('#message').html('Moving to Y 100 forward...');
        bot.moveRelative({x:0, y:+100, z:0});
    });
    $( "#move_y_lower" ).click(function() {
      $('#message').html('Moving to Y 100 back...');
        bot.moveRelative({x:0, y:-100, z:0});
    });
    $( "#move_z_higher" ).click(function() {
      $('#message').html('Moving to Z 100 forward...');
        bot.moveRelative({x:0, y:0, z:+100});
    });
    $( "#move_z_lower" ).click(function() {
      $('#message').html('Moving to Z 100 back...');
        bot.moveRelative({x:0, y:0, z:-100});
    });
    $( "#device" ).click(function() {
      $('#message').html('working...');

//      $('#message').html('connected! Status:'+bot.hardware.informational_settings.sync_status);

      bot.on("*", function(data, eventName) {
          log("I just got a(n) " + eventName + " event!");
          log("This is the payload: " + JSON.stringify(data));
        })
    });


});

