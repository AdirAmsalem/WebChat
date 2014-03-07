WebChat.directive('scrollToBottom', [ function() {
	return {
		restrict: 'A',
		link: function($scope, element) {

			function scrollToBottom(delay) {
				setTimeout( function() {
					element[0].scrollTop = element[0].scrollHeight;
				}, delay || 0);
			}

			$scope.$on('events:scrollToBottom', function(e, delay) {
				scrollToBottom(delay);
			});
		}
	};
}]);