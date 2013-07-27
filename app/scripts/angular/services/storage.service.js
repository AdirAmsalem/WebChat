WebChat.factory('storage', function() {

	var storage = window.localStorage || window.sessionStorage;

	function isJSON(string) {
		try {
			JSON.parse(string);
		} catch(e) {
			return false;
		}
		return true;
	}

	function set(key, value) {
		if (storage) {
			var item = angular.isObject(value) ? JSON.stringify(value) : value;
			storage.setItem(key, item);
		}
	}

	function get(key) {
		if (storage) {
			var item = storage.getItem(key);
			return isJSON(item) ? JSON.parse(item) : item;
		}
	}

	function remove(key) {
		if (storage) {
			storage.removeItem(key);
		}
	}

	function clear() {
		if (storage) {
			storage.clear();
		}
	}

	// Publish API
	return {
		set: set,
		get: get,
		remove: remove,
		clear: clear
	};

});