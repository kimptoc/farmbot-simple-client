
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
        return '<span> &nbsp;<button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence button button-raised button-action button-pill" style="margin-top: 0.3em;margin-bottom:0.3em;">'+name+'</button>&nbsp; </span>';
    }

    function buildImageLink(id, attachment_processed_at, created_at, updated_at, attachment_url, x, y ){
        return ' &nbsp;<a href="'+attachment_url+'" target="_blank">'+id+'</a>&nbsp; ';
        //return '<span><button id="sequence-'+id+'" sequence-id="'+id+'" class="trigger-sequence button button-raised button-action button-pill">'+name+'</button></span>';
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

    function setup_sequence_buttons(response, target_element, button_title, demo_only) {
        var $sequencelist = $("#"+target_element);
        var show_toggle_button = ( $('#'+target_element).attr('show_button') != 'false' );
        $sequencelist.empty();

        if (show_toggle_button) {
            var toggle_button = target_element + '_toggle';
            $sequencelist.append("<button id='" + toggle_button + "' class='button button-raised button-rounded'>" + button_title + "</button>");
            $("#" + toggle_button).click(function () {
                $('#' + all_buttons).toggle();
            });
        }

        var all_buttons = "all_"+target_element;
        $sequencelist.append("<span id='"+all_buttons+"' class='flow'></span>")
        $.each(response.sequences, function (index, sequence) {
            if ( (demo_only && /demo/i.test(sequence.name)) || (!demo_only && !/demo/i.test(sequence.name)) ) {
                $('#' + all_buttons).append(buildButton(sequence.name.toUpperCase(), sequence.id));
                enableSequenceButtons();
            }
        })
        if (!demo_only) $('#'+all_buttons).hide();
        $('#message').html('Sequences loaded!');
    }

    function setup_images(response, target_element, button_title, demo_only) {
        var $sequencelist = $("#"+target_element);
        $sequencelist.empty();
        var toggle_button = target_element+'_toggle';
        $sequencelist.append("<button id='"+toggle_button+"' class='button button-raised button-rounded'>"+button_title+"</button>");
        var all_buttons = "all_"+target_element;
        $sequencelist.append("<span id='"+all_buttons+"' class='flow'></span>")
        $.each(response.images, function (index, image) {
            // console.log(sequence);
            // attachment_processed_at, created_at, updated_at, attachment_url, meta.x, meta.y, 
            $('#' + all_buttons).append(buildImageLink(image.id, image.attachment_processed_at, 
            image.created_at, image.updated_at, image.attachment_url, image.meta.x, image.meta.y));
            // enableSequenceButtons();
        })
        $("#"+toggle_button).click(function () {
            $('#'+all_buttons).toggle();
        });
        $('#'+all_buttons).hide();
        $('#message').html('Images loaded!');
    }

    function getSequences(){
        $('#sequences').prop('disabled', true);
        $('#message').html('Loading sequences...');
          botui.sequences(localStorage.getItem('fb.token'), function(err, response) {
              $('#sequences').prop('disabled', false);
              if (err) {
                  $('#message').html(err);
              } else {
                  setup_sequence_buttons(response, 'sequence_list','All Sequences +/-', false);
                  setup_sequence_buttons(response, 'demo_sequence_list','Demo Sequences +/-', true);
              }
          });

    }

    function getImages(){
        $('#image_list').prop('disabled', true);
        $('#message').html('Loading image list...');
          botui.images(localStorage.getItem('fb.token'), function(err, response) {
              $('#image_list').prop('disabled', false);
              if (err) {
                  $('#message').html(err);
              } else {
                  setup_images(response, 'image_list','Images +/-', false);
              }
          });

    }

    function getDevice(device_info){
          botui.device(localStorage.getItem('fb.token'), function(err, response) {
              if (err) {
                  $('#message').html(err);
              } else {
//                  log_object(response);
                  device_info['info'] = response;
                  log_object(device_info);
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
                  device_info = {};
                  localStorage.setItem('fb.token', response.token);
                  $('#debug').html(JSON.stringify(response.raw_response));
                  bot = new Farmbot.Farmbot({token: localStorage.getItem('fb.token'), timeout: 30000});
                  bot.connect()
                      .then(function(){
                        device = new DeviceStatus(bot, '#device_status', device_info);
                  });
                  getSequences();
                  getImages();
                  getDevice(device_info);
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
    $( "#arduino_pump" ).click(function() {
        bot.togglePin({pin_number: 10});
    });
    $( "#arduino_water" ).click(function() {
        bot.togglePin({pin_number: 9});
    });
    $( "#arduino_led" ).click(function() {
        bot.togglePin({pin_number: 13});
    });
    $( "#take_photo" ).click(function() {
        bot.takePhoto({});
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
      var distance = $('#distance').val();
      $('#message').html('Moving to X '+distance+' forward...');
      bot.moveRelative({x:+distance, y:0, z:0});
    });
    $( "#move_x_lower" ).click(function() {
      var distance = $('#distance').val();
      $('#message').html('Moving to X '+distance+' back...');
      bot.moveRelative({x:-distance, y:0, z:0});
    });
    $( "#move_y_higher" ).click(function() {
      var distance = $('#distance').val();
      $('#message').html('Moving to Y '+distance+' forward...');
      bot.moveRelative({x:0, y:+distance, z:0});
    });
    $( "#move_y_lower" ).click(function() {
      var distance = $('#distance').val();
      $('#message').html('Moving to Y '+distance+' back...');
      bot.moveRelative({x:0, y:-distance, z:0});
    });
    $( "#move_z_higher" ).click(function() {
      var distance = $('#distance').val();
      $('#message').html('Moving to Z '+distance+' forward...');
      bot.moveRelative({x:0, y:0, z:+distance});
    });
    $( "#move_z_lower" ).click(function() {
      var distance = $('#distance').val();
      $('#message').html('Moving to Z '+distance+' back...');
      bot.moveRelative({x:0, y:0, z:-distance});
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

