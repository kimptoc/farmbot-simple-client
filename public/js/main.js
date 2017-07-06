$(function() {

    function setFieldFromLocalStorage(fieldRef, storageKey){
        var val = localStorage.getItem(storageKey);
        if (val) {
            $(fieldRef).val(val);
        }
        return val;
    }
    var email = setFieldFromLocalStorage('#email','fb.email');
    var passwd = setFieldFromLocalStorage('#password','fb.password');

    if (email && passwd) {
        doLogin();
    }

    function buildButton(name, id){
        return '<div><button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence">'+name+'</button></div>';
    }

    function enableSequenceButtons() {
        $(".trigger-sequence" ).off("click");
        $(".trigger-sequence" ).on("click",function(data) {
//            console.log(JSON.stringify(data));
            var sequenceId = Number($(this).attr('sequence-id'));
            var name = $(this).html();
            console.log("Will execute sequence:"+ name+"/"+sequenceId);
            var execPromise = bot.sync()
                .then(function(){bot.execSequence(sequenceId);})
                .then(function(){console.log("Sequence "+name+" has been triggered.")});

            console.log(execPromise);
          return false;
        });
    }

    function doLogin(){
        localStorage.setItem('fb.email',$('#email').val());
        localStorage.setItem('fb.password',$('#password').val());

        $('#div1').html('working...');
          botui = new FarmbotUI()
          botui.login($('#email').val(),$('#password').val(), function(response) {
              localStorage.setItem('fb.token',response.token);
              $('#div1').html(JSON.stringify(response.raw_response));
              bot = new Farmbot.Farmbot({token:localStorage.getItem('fb.token'), secure: true, timeout: 30000});
              bot.connect();
          });
    }

    $( "#login" ).click(function() {
        doLogin();
      return false;
    });

    $( "#sequences" ).click(function() {
      $('#div1').html('working...');
        botui.sequences(localStorage.getItem('fb.token'), function(response) {
            $('#sequence_list').empty();
            $.each(response.sequences, function(index, sequence){
                $('#sequence_list').append(buildButton(sequence.name,sequence.id))
                enableSequenceButtons();
            })
            $('#div1').html('Sequences loaded!');

//                   console.log(JSON.stringify(response.sequences));
        });
      return false;
    });
    $( "#arduino_led" ).click(function() {
        bot.togglePin({pin_number: 13});
    });
    $( "#device" ).click(function() {
      $('#div1').html('working...');

//      $('#div1').html('connected! Status:'+bot.hardware.informational_settings.sync_status);

      bot.on("*", function(data, eventName) {
          console.log("I just got an" + eventName + " event!");
          console.log("This is the payload: " + JSON.stringify(data));
        })

    });

});

