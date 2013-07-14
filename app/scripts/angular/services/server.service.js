WebChat.factory('server', ['$rootScope', function($rootScope) {

	var socket = {};

	function connect() {
		var options;

		console.log('[1/2] Connecting to the server.');
		socket = new WebSocket('ws://adircdn.com:8081');

		options = {
			onopen: onOpen,
			onmessage: onMessage,
			onerror: onError,
			onclose: onClose
		};

		angular.extend(socket, options);
	}

	function send(message) {
		socket.send(message);
	}

	function onOpen() {
		console.log('[2/2] Connected to the server.');

		$rootScope.$apply( function() {
			$rootScope.$broadcast('server:connected');
		});
	}

	function onMessage(response) {
		var data;

		response = JSON.parse(response.data);
		data = response.data;

		$rootScope.$apply( function() {
			switch (response.type) {
				case 'message':
					$rootScope.$broadcast('chat:message', data);
					break;
				case 'history':
					$rootScope.$broadcast('app:loggedIn', data);
					$rootScope.$broadcast('chat:history', data);
					break;
				case 'nick_error':
					$rootScope.$broadcast('app:nickError');
					break;
				case 'new_user':
					$rootScope.$broadcast('userlist:add', data);
					break;
				case 'user_list':
					$rootScope.$broadcast('userlist:current', data);
					break;
				case 'remove_user':
					$rootScope.$broadcast('userlist:remove', data);
					break;
			}
		});
	}

	function onError(error) {
		console.error('Error!\n', 'Code: ' + error.code, '\nReason: ' + (error.reason || '-Unknown-'));
	}

	function onClose(error) {
		if (!error.wasClean) {
			console.error('Error!\n', 'Code: ' + error.code, '\nReason: ' + (error.reason || '-Unknown-'));
		}

		console.log('Disconnected.');
	}

	// Publish API
	return {
		connect: connect,
		send: send
	};

}]);