WebChat.factory('server', ['$rootScope', function($rootScope) {

	var socket;

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
		if (socket) {
			socket.send(message);
		}
	}

	function disconnect(reconnect) {
		if (socket) {
			socket.close();

			if (reconnect) {
				connect();
			}
		}
	}

	function onOpen() {
		console.log('[2/2] Connected to the server.');

		$rootScope.$broadcast('server:connected');
		$rootScope.$apply();
	}

	function onMessage(response) {
		var data;

		response = JSON.parse(response.data);
		data = response.data;

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

		$rootScope.$apply();
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
		send: send,
		disconnect: disconnect
	};

}]);