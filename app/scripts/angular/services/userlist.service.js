WebChat.factory('userlist', function() {

	var userlist = [];

	function getUserlist() {
		return userlist;
	}

	function buildUserlist(users) {
		userlist.length = 0;

		for (var i = 0, length = users.length; i < length; i++) {
			addUser(users[i]);
		}
	}

	function addUser(user) {
		userlist.push(user);
	}

	function removeUser(userNick) {
		for (var i = 0, length = userlist.length; i < length; i++) {
			if (userlist[i].nickname === userNick) {
				return userlist.splice(i, 1);
			}
		}

		return false;
	}

	// Publish API
	return {
		getUserlist: getUserlist,
		buildUserlist: buildUserlist,
		addUser: addUser,
		removeUser: removeUser
	};

});