WebChat.controller('MessageFormController', ['$scope', 'server', function($scope, server) {

	$scope.message = '';

	$scope.send = function() {
		if ($scope.message.length >= 1) {
			server.send($scope.message);
			$scope.message = '';
		}
	};

}]);