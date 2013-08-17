WebChat.directive('scrollToBottom', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element) {

			function scrollToBottom(delay) {
				setTimeout( function() {
					element[0].scrollTop = element[0].scrollHeight;
				}, delay || 0);
			}

			$rootScope.$on('events:scrollToBottom', function(e, delay) {
				scrollToBottom(delay);
			});
		}
	};
}]);