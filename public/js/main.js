$(function() {

    function setFieldFromLocalStorage(fieldRef, storageKey){
        var val = localStorage.getItem(storageKey);
        if (val) {
            $(fieldRef).val(val);
        }
        return val;
    }
    $('#main-bit').hide();

    var email = setFieldFromLocalStorage('#email','fb.email');
    var passwd = setFieldFromLocalStorage('#password','fb.password');

    if (email && passwd) {
        doLogin();
    }

    function buildButton(name, id){
        return '<div><button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence button button-raised button-action button-pill">'+name+'</button></div>';
    }

    function enableSequenceButtons() {
        $(".trigger-sequence" ).off("click");
        $(".trigger-sequence" ).on("click",function(data) {
//            console.log(JSON.stringify(data));
            var execButton = $(this);
            execButton.prop('disabled', true);

            var sequenceId = Number(execButton.attr('sequence-id'));
            var name = execButton.html();
            $('#message').html("Executing sequence:"+ name);
            var execPromise = bot.sync()
                .then(function(){
                    bot.execSequence(sequenceId);
                })
                .then(function(){
                    $('#message').html("Sequence "+name+" has been triggered.");
                    execButton.prop('disabled', false);
                })
                .catch(function(error){
//                    console.log("Got an error..."+error);
                    $('#message').html("Sequence:"+ name+". "+error);
                    execButton.prop('disabled', false);
                });

            console.log(execPromise);
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
                  $('#sequence_list').empty();
                  $('#sequence_list').append("<h3>Available Sequences:</h3>");
                  $.each(response.sequences, function (index, sequence) {
                      $('#sequence_list').append(buildButton(sequence.name, sequence.id))
                      enableSequenceButtons();
                  })
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
    $( "#device" ).click(function() {
      $('#message').html('working...');

//      $('#message').html('connected! Status:'+bot.hardware.informational_settings.sync_status);

      bot.on("*", function(data, eventName) {
          console.log("I just got an" + eventName + " event!");
          console.log("This is the payload: " + JSON.stringify(data));
        })

    });

});

