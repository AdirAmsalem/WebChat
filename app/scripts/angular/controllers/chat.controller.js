WebChat.controller('ChatController', ['$rootScope', '$scope', 'chat', function($rootScope, $scope, chat) {

	$scope.messages = chat.getMessages();

	function buildChat(messages) {
		chat.buildChat(messages);
		$rootScope.$broadcast('events:scrollToBottom', 1000);
	}

	function addMessage(message) {
		chat.addMessage(message);
		$rootScope.$broadcast('events:scrollToBottom');
	}

	$rootScope.$on('chat:history', function(e, messages) {
		buildChat(messages);
	});

	$rootScope.$on('chat:message', function(e, message) {
		addMessage(message);
	});

}]);