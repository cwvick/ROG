$(function() {
  // Count down
  var setCountdown = function() {
    var date = new Date('Thu May 07 2015 00:00:00 GMT+0800 (Taipei Standard Time)');
    var size = 28;
    var winWidth = $(window).width();
    
    if ( winWidth <= 1400 ) {
      size = 22;
    } else if ( winWidth <= 1024 ) {
      size = 18;
    }

    $('#countdown').empty().removeAttr('style').removeAttr('class');

    $('#countdown').timeTo({
      timeTo: date,
      fontSize: size
    });
  };

  setCountdown();

  $(document).on('click', '.btn-menu-buy, .btn-menu-pro', function(event) {
    event.preventDefault();
    $('body').animate({
      scrollTop: $('.product').offset().top
    },200);
  });

  $(document).on('click', '.btn-menu-download', function(event) {
    event.preventDefault();
    $('.lightbox-wrapper').height($(window).height());
    $('.lightbox.download').show();
  });

  $(document).on('click', '.btn-buy', function(event) {
    event.preventDefault();
    var countryList = $(this).parents('li.list_item').data('country-list');
    if (countryList) {
      setBuyContent(countryList);
      $('.lightbox.toBuy').show().css('visibility', 'hidden');

      $('.country_list li').css('height', $('.country_list').height());
      $('.lightbox-wrapper').height($(window).height());
      $('.lightbox.toBuy').css('visibility', 'visible');
    }
  });

  var setBuyContent = function(countryList) {
    var content = '';
    $.each(countryList, function(index, country) {
      content += '<li>' +
                    '<div class="country_icon ' + country.countryName + '"></div>' +
                    '<div class="store">' +
                      getStoreContent(country.storeList) +
                    '</div>' +
                  '</li>';
    });

    $('.lightbox.toBuy ul.country_list').html(content);
  };

  var getStoreContent = function(storeList) {
    var storeContent = '';
    $.each(storeList, function(index, store) {
      if ( store.buyLink ) {
        storeContent += '<a href="' + store.buyLink + '" class="name" target="_blank">' + store.storeName + '</a>';
      } else if ( store.variations ) {
        storeContent += '<div><div class="name">' + store.storeName + '</div>';

        $.each(store.variations, function(index, prod) {
           storeContent += '<a href="' + prod.buyLink + '" class="variation_name" target="_blank">' + prod.name + '</a>';
        });

        storeContent += '</div>';
      }
    });

    return storeContent;
  };

  $(document).on('click', '.lightbox .close', function(event) {
    event.preventDefault();
    $('.lightbox').hide();
  });

  $(document).on('click', '.movie_list li', function(event) {
    event.preventDefault();
    if ( !$(this).hasClass('selected') ) {
      $('.movie_list li').removeClass('selected');
      $(this).addClass('selected');

      var video_type = $(this).data('type');
      var video_id = $(this).data('video-id');

      $('#video_player').empty();
      $('.video').css('visibility', 'hidden');

      if ( video_type == 'youtube' ) {
        loadVideo(video_id);
      } else if ( video_type == 'twitch' ) {
        playTwitch(video_id);
      }
      
    }
  });

  $(document).on('click', '.scrolldown_container', function(event) {
    event.preventDefault();
    $('body').animate({
      scrollTop: $('.video').offset().top + $('.video').outerHeight()
    },
    500,
    function() {
      $('.scrolldown_container').css('bottom', $('.index').outerHeight() - $('.video').offset().top -$('.video').outerHeight());
    });
  });

  var loadVideo = function(video_id) {
    var youtubeObj = '<iframe width="' + $('.screen .video').outerWidth() + '" height="' + $('.screen .video').outerHeight() + '" src="https://www.youtube.com/embed/' + video_id + '" frameborder="0" allowfullscreen></iframe>';

    $('#video_player').html(youtubeObj);
    $('.screen .video').css('visibility', 'visible');
  };

  var playTwitch = function(video_id) {
    var twitchObj = '<object bgcolor="#000000" data="http://www.twitch.tv/swflibs/TwitchPlayer.swf" height="' + $('.screen .video').outerHeight() + '"  width="' + $('.screen .video').outerWidth() + '" id="clip_embed_player_flash" type="application/x-shockwave-flash"><param name="movie" value="http://www.twitch.tv/swflibs/TwitchPlayer.swf" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="allowFullScreen" value="true" /><param name="flashvars" value="channel=esl_heroes&amp;auto_play=false&amp;start_volume=25&amp;videoId=v' + video_id + '&amp;device_id=8a4b98c5339d86c3" /></object>';
    
    $('#video_player').html(twitchObj);

    $('.screen .video').css('visibility', 'visible');
  };

  // resize
  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
    }

    bageHandler();
    // setCountdown();
    $('.lightbox-wrapper').height($(window).height());
  });

  var setBuyLinkData = function() {
  	$.ajax({
      url: 'buyLink.json'
    })
    .done(function(data) {
      $.each(data, function(index, obj) {
        var prooduct_id = obj.productId;
        $('.list_item.' + prooduct_id).data('country-list', obj.countryList);
      });
    });
	};

  setBuyLinkData();

  $(window).scroll(function() {
    bageHandler();
  });

  var bageHandler = function() {
    var sectionA_height = $('.container .index').outerHeight();
    var winHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    if ( sectionA_height <= winHeight + scrollTop ) {
      $('.box-bage, .scrolldown_container').addClass('stop');
      $('.scrolldown_container').css('bottom', $('.index').outerHeight() - $('.video').offset().top -$('.video').outerHeight());
    } else {
      $('.box-bage, .scrolldown_container').removeClass('stop');
      $('.scrolldown_container').removeAttr('style');
    }
  };

  bageHandler();

  var scrolldownHandler = function() {
    var bgPosition = parseInt($('.btn_scrolldown').css('background-position-y'));
    var updateH = -155;

    if ( bgPosition <= updateH*6 ) {
      bgPosition = 0;
    } else {
      bgPosition = bgPosition + updateH;
    }

    $('.btn_scrolldown').css('background-position-y', bgPosition + 'px');
  };

  var scrolldownTimer = setInterval(function(){ scrolldownHandler(); }, 175);

  // team rotation
  var teamRotation = function() {
    if ( $('.banner_teams .group1').is(':visible') ) {
      $('.banner_teams .group1').hide();
      $('.banner_teams .group2').fadeIn('slow');
    } else {
      $('.banner_teams .group2').hide();
      $('.banner_teams .group1').fadeIn('slow');
    }
  };

  var teamRotationTimer = setInterval(function(){ teamRotation(); }, 4000);

  $(window).load(function() {
    // Load the first video
    $('.movie_list li:first').trigger('click');

    if ($(window).width() < 1024) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
    }

    setProdListHeight();
  });

  var setting_rmHeight = 120;

  // read more for product info
  $('.product .list_item .info').readmore({
    collapsedHeight: setting_rmHeight,
    moreLink: '<div class="readmore_container clearfix"><div class="rm_arrow down"></div><a href="#">read more</a></div>',
    lessLink: '<div class="readmore_container clearfix"><div class="rm_arrow up"></div><a href="#">close</a></div>',
    beforeToggle: function(trigger, element, expanded) {
      if(expanded) {
        $(element).css('padding-bottom', 0);
      }
    },
    afterToggle: function(trigger, element, expanded) {
      var maxHeight = $(element).height() + $(element).prev('.model').height();

      $(element).parents('.list').find('li.list_item').each(function(index, el) {
        if ( $(this).find('.info').height() + $(this).find('.model').height() > maxHeight ) {
          maxHeight = $(this).find('.info').height() + $(this).find('.model').height();
        }
      });

      $(element).parents('.list').find('.info').each(function(index, el) {
        var selfHeight = $(this).height() + $(this).prev('.model').height();
        if ( $(this).height() > setting_rmHeight && selfHeight < maxHeight ) {
          $(this).next('.readmore_container').css('padding-bottom', maxHeight - selfHeight + 'px');
        }        
      });

      if (!expanded) {
        $(element).css('padding-bottom', 0);
      }

      setProdListHeight();
    }
  });

  // product info init
  var setProdListHeight = function() {
    $('.product .list li.list_item').height('auto');

    $('.product .list').each(function(index, el) {
      var minHeight = 0;
      $(this).find('li.list_item').each(function(index, el) {
        if ( $(this).height() > minHeight ) {
          minHeight = $(this).height();
        }
      });
      $(this).find('li.list_item').height(minHeight);
    });
  };

});
