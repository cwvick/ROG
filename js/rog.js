var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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

    $('#countdown').remove();
    $('.timer').prepend('<div id="countdown"></div>');

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

      var video_id = $(this).data('video-id');
      loadVideo(video_id);
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

  // Youtube api
  var YT_player;

  function onPlayerReady(event) {
    // event.target.playVideo();
  }

  var done = false;

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }

  function stopVideo() {
    YT_player.stopVideo();
  }

  var loadVideo = function(video_id) {
    if ( YT_player ) {
      YT_player.destroy();
    }

    if ( !YT_player || !YT_player.getIframe() ) {
      YT_player = new YT.Player('video_player', {
        height: $('.screen .video').outerHeight(),
        width: $('.screen .video').outerWidth(),
        videoId: video_id,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    } else {
      YT_player.loadVideoById(video_id);
    }

    $('.screen .video').css('visibility', 'visible');
  };

  // resize
  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
    }

    // resize youtube player
    if ( YT_player ) {
      YT_player.setSize($('.screen .video').outerWidth() , $('.screen .video').outerHeight());
    }

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
    var bgPosition = parseInt($('.btn_scrolldown').css('background-position-y'));
    var updateH = -91;

    if ( bgPosition <= updateH*3 ) {
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

  var gamerHeightHandler = function() {

    var wHeight = $(".special").height();
    $(".gamer,.team").height(wHeight);
  };

  gamerHeightHandler();

});
