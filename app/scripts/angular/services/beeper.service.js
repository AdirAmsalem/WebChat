WebChat.factory('beeper', function() {

	var isOn = true,
		sound = new Audio('beep.wav');

	sound.load();

	function enable() {
		isOn = true;
	}

	function disable() {
		isOn = false;
	}

	function beep() {
		if (isOn) {
			sound.currentTime = 0;
			sound.play();
		}
	}

	function isActive() {
		return isOn;
	}

	// Publish API
	return {
		enable: enable,
		disable: disable,
		beep: beep,
		isActive: isActive
	};

});