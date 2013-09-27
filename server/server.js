var WebSocketServer = require('websocket').server;
var http = require('http');

// Some utilities
function escapeHtml(unsafe) {
	return unsafe.replace(/&/g, "&amp;")
				 .replace(/</g, "&lt;")
				 .replace(/>/g, "&gt;")
				 .replace(/"/g, "&quot;")
				 .replace(/'/g, "&#039;");
};

function trim(s) {
	return s.replace(/^\s+|\s+$/g,"");
};

function originIsAllowed(origin) {
	return true;
};

function getClientIndex(nick) {
	var found = null;

	clients.forEach( function(client, index) {
		if (client.nickname === nick) {
			found = index;
		}
	});

	return found;
};

// Storage
var clients = [];
var history = [];
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];

// Randomize colors order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

// Initialize the server
var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' - Received a request for ' + request.url);
	response.writeHead(404);
	response.end();
});

var PORT = 8081;
server.listen(PORT, function() {
	console.log((new Date()) + ' - Server is listening on port ' + PORT);
});

var wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

// Handle new connections
wsServer.on('request', function(request) {

	// Validates request origin
	if (!originIsAllowed(request.origin)) {
		console.log((new Date()) + ' - Connection from origin ' + request.origin + ' has been rejected.');
		request.reject();
		return;
	}

	var connection = request.accept(null, request.origin);
	var client = {};

	console.log((new Date()) + ' - Connection accepted from ' + connection.remoteAddress + '.');

	// Handle messages from users
	connection.on('message', function(message) {

		if (message.type === 'utf8') {

			// If the user doesn't have a nickname (first message)
			if (!client.nickname) {
				var tmpNick = escapeHtml(trim(message.utf8Data));

				// If the nickname is available and contains less than 15 characters
				if (tmpNick.length <= 15 && getClientIndex(tmpNick) === null) {
					client.nickname = tmpNick;
					client.color = colors.shift();

					clients.push(client);

					wsServer.broadcast( JSON.stringify({ type: 'new_user', data: client }) );

					connection.sendUTF( JSON.stringify({ type: 'history', data: history }) );
					connection.sendUTF( JSON.stringify({ type: 'user_list', data: clients }) );

					console.log((new Date()) + ' - ' + connection.remoteAddress + ' is identified as ' + client.nickname);

				// If the nickname is already in use
				} else {
					connection.sendUTF(JSON.stringify({ type: 'nick_error', data: tmpNick }));
				}

			// If the user is already logged in
			} else {
				console.log((new Date()) + ' - Received the message: ' + message.utf8Data + ', from: ' + client.nickname + ' (' + connection.remoteAddress + ')');

				var data = {
					nickname: client.nickname,
					color: client.color,
					message: escapeHtml(trim(message.utf8Data)),
					time: (new Date()).getTime()
				};

				history.push(data);
				history = history.slice(-20);

				wsServer.broadcast(JSON.stringify({ type: 'message', data: data }));
			}
		}
	});

	// Handle disconnections
	connection.on('close', function(reasonCode, description) {
		console.log((new Date()) + ' - ' + client.nickname + ' (' + connection.remoteAddress + ') disconnected.');

		clients.splice(getClientIndex(client.nickname), 1);
		colors.push(client.color);

		wsServer.broadcast( JSON.stringify({ type: 'remove_user', data: client.nickname }) );

	});
});
