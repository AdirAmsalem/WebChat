WebChat.controller('UserListController', ['$rootScope', '$scope', 'userlist', function($rootScope, $scope, userlist) {

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

	$rootScope.$on('userlist:current', function(e, users) {
		buildUserlist(users);
	});

	$rootScope.$on('userlist:add', function(e, user) {
		addUser(user);
	});

	$rootScope.$on('userlist:remove', function(e, user) {
		removeUser(user);
	});

}]);