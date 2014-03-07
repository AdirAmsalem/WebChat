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

		$rootScope.$broadcast('messageAll', { message: 'server:connected' });
		$rootScope.$apply();
	}

	function onMessage(response) {
		var data, messages = [];

		response = JSON.parse(response.data);
		data = response.data;

		switch (response.type) {
			case 'message':
				messages.push({
					message: 'chat:message',
					data: data
				});
				break;
			case 'history':
				messages.push({
					message: 'app:loggedIn',
					data: data
				});
				messages.push({
					message: 'chat:history',
					data: data
				});
				break;
			case 'nick_error':
				messages.push({ message: 'app:nickError' });
				break;
			case 'new_user':
				messages.push({
					message: 'userlist:add',
					data: data
				});
				break;
			case 'user_list':
				messages.push({
					message: 'userlist:current',
					data: data
				});
				break;
			case 'remove_user':
				messages.push({
					message: 'userlist:remove',
					data: data
				});
				break;
		}

		messages.forEach( function(message) {
			$rootScope.$broadcast('messageAll', message);
		});

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