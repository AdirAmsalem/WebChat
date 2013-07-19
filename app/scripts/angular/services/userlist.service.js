WebChat.factory('userlist', function() {

	var userlist = [];

	function getUserlist() {
		return userlist;
	}

	function buildUserlist(users) {
		userlist.length = 0;

		for (var i = 0, user; !!(user = users[i]); i++) {
			addUser(user);
		}
	}

	function addUser(user) {
		userlist.push(user);
	}

	function removeUser(userNick) {
		for (var i = 0, user; !!(user = userlist[i]); i++) {
			if (user.nickname === userNick) {
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