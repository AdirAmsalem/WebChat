WebChat.factory('userlist', function() {

	var userlist = [];

	function getUserlist() {
		return userlist;
	}

	function buildUserlist(users) {
		userlist.length = 0;
		users.forEach(addUser);
	}

	function addUser(user) {
		userlist.push(user);
	}

	function removeUser(userNick) {
		userlist.some( function(user, index) {
			if (user.nickname === userNick) {
				userlist.splice(index, 1);
				return true;
			}
		});
	}

	// Publish API
	return {
		getUserlist: getUserlist,
		buildUserlist: buildUserlist,
		addUser: addUser,
		removeUser: removeUser
	};

});