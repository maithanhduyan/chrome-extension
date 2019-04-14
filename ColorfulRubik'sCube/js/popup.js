//jQuery(document).ready(function($) {
//});

//function Scrolldown() { 
//	window.location = '#gameColumnWidth';
//}

//window.onload = Scrolldown;


(function($) {
			
	var userIsReading = false;
	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
			if (!uniqueId) {
				uniqueId = "Don't call this twice without a uniqueId";
			}
			if (timers[uniqueId]) {
				clearTimeout (timers[uniqueId]);
			}
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();
	
	//$(window).on('scroll', function() {
	//	//stop repositioning screen if user is reading about ttt
	//	if(!userIsReading && $(this).scrollTop() >= ($(".scores").offset().top + 100)){
	//		userIsReading = true;
	//	}
	//});
	
	$(window).resize(function() {
		
		waitForFinalEvent(function(){
	//		var wh = window.innerHeight;
	//		var cw = $('.game-column-width').width();
		
	//		var s = wh*0.7;
	//		var h = wh;
	//		if(cw/0.7 <= wh){
				
	//			h = cw/0.7;
	//			s = cw;
	//		}
	//		s = s < cw ? s : cw;
	//		$('.game-container').css('height',h);
	//		$('.game-container').css('width',s);
	//		$('.game').css('height', s);
			
			//SVGs are huge upon first loading when using percents. So, set initial values then remove
			$(".scores svg").removeAttr("style");
			//document.querySelector('.movescounter')
			
			
	//		if(!userIsReading){
	//			Scrolldown();
	//		}
		}, 500, "ID1");
	});
	
})( jQuery );
//TODO
//look at playing and turn and look at query selectors that try to find items that are no longer there

var ui = {
		mute: document.querySelector('.mute'),
		scores: {
			scores: document.querySelector('.scores'),
			swap: document.querySelector('.swap'),
			player1: document.querySelector('.player1 .score'),
			player2: document.querySelector('.player2 .score'),
			ties: document.querySelector('.ties .score'),
			turn1: document.querySelector('.player1'),
			turn2: document.querySelector('.player2'),
			turnTies: document.querySelector('.ties')
		}
	},		
	audio = {},
	hasLocalStorage, muted, playing, turn = true

function loadAudio(name) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/assets/audio/' + name + '.mp3', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function() {
		context.decodeAudioData(xhr.response, function(buffer) {
			audio[name] = buffer;
		}, function() {});
	};
	xhr.send();
}

function playAudio(name) {
	if (muted || !audio[name]) {
	   return;
	}
	if (context && context.resume) {
		context.resume();
	}
	var source = context.createBufferSource();
	source.buffer = audio[name];
	source.connect(context.destination);
	if (source.start) {
		source.start(0);
	} else {
		source.noteOn(0);
	}
}

function updateMuteIcon() {
	var muteSoundWaves = ui.mute.querySelectorAll('path');
	for (var i = muteSoundWaves.length; i--;) {
		muteSoundWaves[i].style.display = muted ? 'none' : '';
	}
}

function toggleMute() {
	muted = !muted;
	if (hasLocalStorage) {
		try {
			localStorage.setItem('muted', muted.toString());
		} catch (e) {}
	}
	updateMuteIcon();
} 

(function() {

    function init() {	
		
        try {
            hasLocalStorage = 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            hasLocalStorage = false;
        }
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (window.AudioContext) {
            context = new AudioContext();
            loadAudio('solve');
            loadAudio('move');
            if (hasLocalStorage) {
                try {
                   muted = localStorage.getItem('muted') === 'true';
               } catch (e) {
                   muted = false;
               }
            }
            updateMuteIcon();
            ui.mute.ontouchstart = ui.mute.onclick = function(event) {
				event.stopPropagation();//avoid triggering tap from causing solve to be called
                event.preventDefault();
                toggleMute();
            };


        } else {
            ui.mute.style.display = 'none';
        }
        
        ui.scores.scores.ontouchend = ui.scores.scores.onclick = function(event) {
            event.preventDefault();
            if(!isSolved){
				//selecting solve after it's been solve causes bad things. Just close and reopen to reset
				solveCube(300);
				wasClickedToSolve = true;
			}			
        };

    }
	init();
}());

