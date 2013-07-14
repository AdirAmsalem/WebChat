WebChat.controller('LoginFormController', ['$rootScope', '$scope', 'server', function($rootScope, $scope, server) {

	$scope.nick = '';

	$scope.login = function() {
		if ($scope.nick.length >= 1 && $scope.nick.length <= 15) {
			server.send($scope.nick);
			$rootScope.$broadcast('app:login', $scope.nick);
		}
	};

}]);