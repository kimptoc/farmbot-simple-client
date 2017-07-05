$(function() {

    function buildButton(name, id){
        return '<div><button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence">'+name+'</button></div>';
    }

    function enableSequenceButtons() {
        $(".trigger-sequence" ).off("click");
        $(".trigger-sequence" ).on("click",function(data) {
//            console.log(JSON.stringify(data));
            var sequenceId = $(this).attr('sequence-id');
            console.log("Will execute sequence:"+$(this).html()+"/"+sequenceId);
            bot.execSequence(sequenceId);
          return false;
        });
    }

    $( "#login" ).click(function() {
      $('#div1').html('working...');
        botui = new FarmbotUI()
        botui.login($('#email').val(),$('#password').val(), function(response) {
                   $('#token').html(response.token);
                   $('#div1').html(JSON.stringify(response.raw_response));
        });
      return false;
    });

    $( "#sequences" ).click(function() {
      $('#div1').html('working...');
        botui.sequences($('#token').html(), function(response) {
            $.each(response.sequences, function(index, sequence){
//                $('#sequence_list').append('<div>'+sequence.name+'/'+sequence.id+'</div>')
                $('#sequence_list').append(buildButton(sequence.name,sequence.id))
                enableSequenceButtons();
//                console.log(sequence.name);
            })
            $('#div1').html('Sequences loaded!');

//                   console.log(JSON.stringify(response.sequences));
        });
      return false;
    });
    $( "#device" ).click(function() {
      $('#div1').html('working...');
      bot = new Farmbot.Farmbot({token:$('#token').html(), secure: true});

      bot.connect();

      $('#div1').html('connected! Status:'+bot.hardware.informational_settings.sync_status);

      bot.on("*", function(data, eventName) {
          console.log("I just got an" + eventName + " event!");
          console.log("This is the payload: " + data);
        })

    });

});

