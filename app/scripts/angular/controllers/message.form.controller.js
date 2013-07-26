WebChat.controller('MessageFormController', ['$rootScope', '$scope', 'server', 'localization', 'speechRecognition', function($rootScope, $scope, server, localization, speechRecognition) {

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

	$scope.send = function() {
		if ($scope.message.length >= 1) {
			server.send($scope.message);
			$scope.message = '';
		}

		return false;
	};

	updateSpeechTooltip();

	$rootScope.$on('speech:stateChange', updateSpeechTooltip);

	$rootScope.$on('speech:message', function(e, data) {
		$scope.message += data;
	});

}]);