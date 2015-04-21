var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var YT_player;

function onYouTubeIframeAPIReady() {
  YT_player = new YT.Player('video_player', {
    height: $('.screen .video').outerHeight(),
    width: $('.screen .video').outerWidth(),
    videoId: '5Ng-8AqhB1Y',
    playerVars: {
      // 'autoplay': 0,
      // 'showinfo': 0,
      // 'controls': 0,
      // 'autohide': 1
      // 'modestbranding': 1,
      // 'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
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

$(function() {
  // Count down
  var setCountdown = function() {
    var date = new Date('Thu May 07 2015 00:00:00 GMT+0800 (Taipei Standard Time)');
    var size = 28;
    var winWidth = $(window).width() 
    
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
    },
    200,
    function() {
      //
    });
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
      $('.country_list li .store').readmore({
        collapsedHeight: 120,
        beforeToggle: function(trigger, element, expanded) {
          $('.country_list li').css('height', '100%');
        },
        afterToggle: function(trigger, element, expanded) {
          $('.country_list li').css('height', $('.country_list').height());
        }
      });
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

  var loadVideo = function(video_id) {
    YT_player.destroy();

    if ( !YT_player || !YT_player.getIframe() ) {
      YT_player = new YT.Player('video_player', {
        height: $('.screen .video').outerHeight(),
        width: $('.screen .video').outerWidth(),
        videoId: video_id,
        playerVars: {
          // 'showinfo': 0,
          // 'controls': 0,
          // 'autohide': 1
          // 'modestbranding': 1,
          // 'rel': 0
        },
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
//zek
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
  });


});
