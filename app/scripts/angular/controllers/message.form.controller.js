WebChat.controller('MessageFormController', ['$scope', 'server', 'localization', 'speechRecognition', function($scope, server, localization, speechRecognition) {

	$scope.message = '';
	$scope.speech = speechRecognition;

	function updateSpeechTooltip() {
		$scope.speechTooltip = speechRecognition.isActive() ? 'disable_speech_recognition' : 'enable_speech_recognition';
	}

	$scope.toggleSpeech = function() {
		var langCode = localization.getLanguage().speechCode;

		if (speechRecognition.isActive()) {
			speechRecognition.stop();
		} else {
			speechRecognition.start(langCode);
		}
	};

	$scope.send = function(message) {
		if (message.length >= 1) {
			server.send(message);
			$scope.message = '';
		}
	};

	updateSpeechTooltip();

	$scope.$on('speech:stateChange', updateSpeechTooltip);

	$scope.$on('speech:message', function(e, data) {
		$scope.message += data;
	});

}]);