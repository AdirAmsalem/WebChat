WebChat.controller('LoginFormController', ['$scope', 'server', 'storage', function($scope, server, storage) {

	$scope.nick = '';

	function logout() {
		storage.remove('nick');
		server.disconnect(true);
	}

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
			$scope.$emit('messageAll', { message: 'app:login', data: nick });
		}
	};

	$scope.$on('server:connected', checkPreviousLogin);
	$scope.$on('app:logout', logout);

}]);