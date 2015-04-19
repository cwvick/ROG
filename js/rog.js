$(function() {
  // Count down
  $('#countdown').timeTo(new Date('Thu May 07 2015 00:00:00 GMT+0800 (Taipei Standard Time)'));

  $(document).on('click', '.btn-menu-buy, .btn-menu-pro', function(event) {
    event.preventDefault();
    $('body').animate({
        scrollTop: 5547
      },
      200,
      function() {
        /* stuff to do after animation is complete */
      });
  });

  $(document).on('click', '.btn-buy', function(event) {
    event.preventDefault();
    $('.lightbox.toBuy').show();
  });

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
      /* stuff to do after animation is complete */
    });
  });

  var loadVideo = function(video_id) {
    if ( !YT_player || !YT_player.getIframe() ) {
      YT_player = new YT.Player('video_player', {
        height: $('.screen .video').outerHeight(),
        width: $('.screen .video').outerWidth(),
        videoId: video_id,
        playerVars: {
          // 'showinfo': 0,
          // 'controls': 0,
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
  });

  var setBuyLinkData = function() {
  	$.ajax({
      url: 'buyLink.json'
    })
    .done(function(data) {
      console.log(data);
    });
	};

  $(window).scroll(function() {
    bageHandler();
  });

  var bageHandler = function() {
    var sectionA_height = $('.container .index').outerHeight();
    var winHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    if ( sectionA_height <= winHeight + scrollTop ) {
      $('.box-bage, .scrolldown_container').addClass('stop');
    } else {
      $('.box-bage, .scrolldown_container').removeClass('stop');
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

});

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
