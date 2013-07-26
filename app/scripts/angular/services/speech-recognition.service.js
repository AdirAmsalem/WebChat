WebChat.factory('speechRecognition', ['$rootScope', 'localization', function($rootScope, localization) {

	var recognition,
		active = false;

	function init() {
		var options;

		recognition = new webkitSpeechRecognition();

		options = {
			continuous: true,
			interimResults: false,
			onstart: onStart,
			onresult: onResult,
			onerror: onError,
			onend: onEnd
		};

		angular.extend(recognition, options);
	}

	function onStart() {
		active = true;
		$rootScope.$broadcast('speech:stateChange');
		$rootScope.$apply();
	}

	function onResult(event) {
		var final;

		for (var i = event.resultIndex, result; !!(result = event.results[i]); i++) {
			if (result.isFinal) {
				final = result[0].transcript;
				$rootScope.$broadcast('speech:message', final);
				$rootScope.$apply();
			}
		}
	}

	function onError() {
		active = false;
		$rootScope.$broadcast('speech:stateChange');
		$rootScope.$apply();
	}

	function onEnd() {
		active = false;
		$rootScope.$broadcast('speech:stateChange');
		$rootScope.$apply();
	}


	function start() {
		recognition.lang = localization.getLanguage().speechCode;
		recognition.start();
	}

	function stop() {
		recognition.stop();
	}

	function isSupported() {
		return !!recognition;
	}

	function isActive() {
		return active;
	}

	// Publish API
	return {
		init: init,
		start: start,
		stop: stop,
		isSupported: isSupported,
		isActive: isActive
	};

}]);