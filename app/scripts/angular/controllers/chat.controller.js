WebChat.controller('ChatController', ['$scope', 'chat', function($scope, chat) {

	$scope.messages = chat.getMessages();

	function buildChat(messages) {
		chat.buildChat(messages);
		$scope.$emit('messageAll', { message: 'events:scrollToBottom', data: 1000 });
	}

	function addMessage(message) {
		chat.addMessage(message);
		$scope.$emit('messageAll', { message: 'events:scrollToBottom' });
	}

	$scope.$on('chat:history', function(e, messages) {
		buildChat(messages);
	});

	$scope.$on('chat:message', function(e, message) {
		addMessage(message);
	});

}]);