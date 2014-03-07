WebChat.controller('UserListController', ['$scope', 'userlist', function($scope, userlist) {

	$scope.userlist = userlist.getUserlist();

	function buildUserlist(users) {
		userlist.buildUserlist(users);
	}

	function addUser(user) {
		userlist.addUser(user);
	}

	function removeUser(user) {
		userlist.removeUser(user);
	}

	$scope.$on('userlist:current', function(e, users) {
		buildUserlist(users);
	});

	$scope.$on('userlist:add', function(e, user) {
		addUser(user);
	});

	$scope.$on('userlist:remove', function(e, user) {
		removeUser(user);
	});

}]);