WebChat.controller('LoginFormController', ['$rootScope', '$scope', 'server', 'storage', function($rootScope, $scope, server, storage) {

	$scope.nick = '';

	function checkPreviousLogin() {
		var nick = storage.get('nick');

		if (nick) {
			$scope.login(nick);
		}
	}

	$scope.login = function(nick) {
		if (nick.length >= 1 && nick.length <= 15) {
			storage.set('nick', nick);
			server.send(nick);
			$rootScope.$broadcast('app:login', nick);
		}

		return false;
	};

	$rootScope.$on('server:connected', checkPreviousLogin);

}]);