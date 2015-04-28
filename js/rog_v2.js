// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(function() {
  // video list init
  getVideoList();

  // Count down
  var setCountdown = function() {
    var date = new Date('Fri May 01 2015 08:00:00 GMT+0200');
    var size = 28;
    var winWidth = $(window).width();
    
    if ( winWidth <= 1400 ) {
      size = 22;
    } else if ( winWidth <= 1024 ) {
      size = 18;
    }

    $('#countdown').remove();
    $('.timer').prepend('<div id="countdown"></div>');

    $('#countdown').timeTo({
      timeTo: date,
      fontSize: size,
      displayDays: 2
    });
  };

  setCountdown();

  $(document).on('click', '.btn-menu-buy, .btn-menu-pro', function(event) {
    event.preventDefault();
    $('body, html').animate({
      scrollTop: $('.product').offset().top
    },200);
  });

  $(document).on('click', '.btn-menu-download', function(event) {
    event.preventDefault();
    $('.lightbox-wrapper').height($(window).height());
    $('.lightbox.download').show();
    $('.screen .video').css('visibility', 'hidden');
  });

  $(document).on('click', '.btn-buy', function(event) {
    event.preventDefault();
    var countryList = $(this).parents('li.list_item').data('country-list');
    if (countryList) {
      setBuyContent(countryList);
      $('.lightbox.toBuy').show().css('visibility', 'hidden');
      // $('.country_list li .store').readmore({
      //   collapsedHeight: 120,
      //   beforeToggle: function(trigger, element, expanded) {
      //     $('.country_list li').css('height', '100%');
      //   },
      //   afterToggle: function(trigger, element, expanded) {
      //     $('.country_list li').css('height', $('.country_list').height());
      //   }
      // });
      $('.country_list li').css('height', $('.country_list').height());
      $('.lightbox-wrapper').height($(window).height());
      $('.lightbox.toBuy').css('visibility', 'visible');
      $('.screen .video').css('visibility', 'hidden');
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
    $('.screen .video').css('visibility', 'visible');
  });

  $(document).on('click', '.movie_list li', function(event) {
    event.preventDefault();
    if ( !$(this).hasClass('selected') ) {
      $('.movie_list li').removeClass('selected');
      $(this).addClass('selected');

      var video_type = $(this).data('type');
      var video_id = $(this).data('video-id');
      var video_channel = $(this).data('video-channel');

      $('#video_player').empty();
      $('.video').css('visibility', 'hidden');

      if ( video_type == 'youtube' ) {
        loadVideo(video_id);
      } else if ( video_type == 'twitch' ) {
        playTwitch(video_id, video_channel);
      }   
    }
  });

  $(document).on('click', '.scrolldown_container', function(event) {
    event.preventDefault();
    $('body, html').animate({
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

  var playTwitch = function(video_id, video_channel) {
    var twitchObj = '';

    if ( !video_id && video_channel ) {
      twitchObj = '<iframe src="http://www.twitch.tv/' + video_channel + '/embed" frameborder="0" scrolling="no" height="' + $('.screen .video').outerHeight() + '" width="' + $('.screen .video').outerWidth() + '"></iframe>';
    } else if ( video_id && video_channel ) {
      twitchObj = '<object bgcolor="#000000" data="http://www.twitch.tv/swflibs/TwitchPlayer.swf" height="' + $('.screen .video').outerHeight() + '"  width="' + $('.screen .video').outerWidth() + '" id="clip_embed_player_flash" type="application/x-shockwave-flash"><param name="movie" value="http://www.twitch.tv/swflibs/TwitchPlayer.swf" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="allowFullScreen" value="true" /><param name="flashvars" value="channel=' + video_channel + '&amp;auto_play=false&amp;start_volume=25&amp;videoId=v' + video_id + '&amp;device_id=8a4b98c5339d86c3" /></object>';
    }
    
    if (twitchObj) {
      $('#video_player').html(twitchObj);
      $('.screen .video').css('visibility', 'visible');
    }
    
  };

  // Load the first video
  $('.movie_list li:first').trigger('click');

  // resize
  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
    }

    // resize player
    $('.movie_list ul li.selected').removeClass('selected').trigger('click');

    bageHandler();
    setCountdown();
    $('.lightbox-wrapper').height($(window).height());

    gamerHeightHandler();
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
    var bgPosition = $('.btn_scrolldown').css('background-position');
    var bgPositionY = parseInt(bgPosition.split(' ')[1]);
    var updateH = -91;

    if ( bgPositionY <= updateH*3 ) {
      bgPositionY = 0;
    } else {
      bgPositionY = bgPositionY + updateH;
    }

    $('.btn_scrolldown').css('background-position', '0 ' + bgPositionY + 'px');
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
    gamerHeightHandler();
  });

  var setting_rmHeight = 120;

  // read more for product info
  $('.product .list_item .info').readmore({
    collapsedHeight: setting_rmHeight,
    moreLink: '<div class="readmore_container clearfix"><a href="#">...(more)</a></div>',
    lessLink: '<div class="readmore_container clearfix"><div class="rm_arrow up"></div><a href="#">close</a></div>',
    beforeToggle: function(trigger, element, expanded) {
      if(expanded) {
        $(element).css('padding-bottom', 0);
      }

      if ( internetExplorer9andLess() ) {
        setTimeout( function() { prodInfoHeight_IE9(element, expanded); }, 50);       
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

  // read more IE9 issue
  var prodInfoHeight_IE9 = function(element, expanded) {
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
  };

  var gamerHeightHandler = function() {

    var wHeight = $(".special").height();
    $(".gamer,.team").height(wHeight);
  };

  var internetExplorer9andLess = function() {
    return $.browser.msie && (parseFloat($.browser.version) < 10 || parseFloat(document.documentMode) < 10);
  };

  // Back to top
  $(window).scroll(function(event) {
    if ( $(this).scrollTop() >= 400 ) {
      $('.btn_backtop').show();
    } else {
      $('.btn_backtop').hide();
    }
  });

  $(document).on('click', '.btn_backtop', function(event) {
    event.preventDefault();
    $('body, html').animate({
      scrollTop: 0
    },200);
  });

  function getVideoList() {
    $('.movie_list ul').empty();
    $('.container .index .movie').hide();

    $.ajax({
      url: 'videos.csv',
    })
    .done(function(data) {
      var videoList = JSON.parse(CSV2JSON(data));
      var content = '';
      $.each(videoList, function(index, video) {
        var isShow = (!video.isShow || video.isShow == 'Y') && (!video.displayDate || compareDate(video.displayDate));
        if ( isShow ) {
          if ( video.videoType ) {
            var vName = video.videoName ? video.videoName : '';
            var vDate = video.videoDate ? video.videoDate : '';
            var vImage = video.thumbnailImage ? video.thumbnailImage : 'vThumbnail_01.jpg';
            var vType = video.videoType.toLowerCase();

            content += '<li class="frame" data-type="' + vType + '" data-video-id="' + video.videoId + '" data-video-channel="' + video.videoChannel + '">' +
                          '<div class="thumbnail">' +
                            '<img src="imgs/video-thumbnails/' + vImage + '">' +
                          '</div>' +
                          '<div class="play_wrapper">' +
                            '<div class="btn_play"></div>' +
                          '</div>' +
                          '<div class="text_wrapper">' +
                            '<div class="text_size_04 video_name">' + vName + '</div>' +
                            '<div class="video_date">' + vDate + '</div>' +
                          '</div>' +
                        '</li>';
          }
        }
      });

      if ( content.length > 0 ) {
        $('.movie_list ul').html(content);
        $('.container .index .movie').show();
      }

      if ( !$('.movie_list li:first').hasClass('selected') ) {
        $('.movie_list li:first').trigger('click');
      }
    })
    .fail(function() {
      console.log("error");
    });
  }

  var compareDate = function(dateString) {
    var now = new Date().toUTCString();
    var nowTime = new Date(now).getTime();
    var date = new Date(dateString+ ' GMT+0200').toUTCString();
    var dateTime = new Date(date).getTime();

    if ( dateTime <= nowTime ) {
      return true;
    } else {
      return false;
    }
  };

  // var getVideoId = function(videoId, videoUrl) {
  //   var video_id;
  //   if () {

  //   }
  //   var video_id = uri.split('v=')[1];
  //   if ( video_id ) {
  //     var ampersandPosition = video_id.indexOf('&');
  //     if(ampersandPosition != -1) {
  //       video_id = video_id.substring(0, ampersandPosition);
  //     } 
  //   } else {
  //     video_id = uri.split('embed/')[1];
  //   }
  // };

});
