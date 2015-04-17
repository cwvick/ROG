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

  // resize
  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
    }
  });

  var setBuyLinkData = function() {
  	$.ajax({
      url: 'buyLink.json'
    })
    .done(function(data) {
      console.log(data);
    });
	};

});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video_player', {
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
  player.stopVideo();
}
