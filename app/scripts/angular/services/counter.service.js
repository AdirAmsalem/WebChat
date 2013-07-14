WebChat.factory('counter', function() {

	var counter = {
		total: 0,
		isOn: false
	};

	function increase() {
		counter.total++;
	}

	function enable() {
		counter.total = 0;
		counter.isOn = true;
	}

	function disable() {
		counter.isOn = false;
	}

	function isActive() {
		return counter.isOn;
	}

	function getValue() {
		return counter.total;
	}

	// Publish API
	return {
		enable: enable,
		disable: disable,
		increase: increase,
		isActive: isActive,
		getValue: getValue
	};

});