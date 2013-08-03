WebChat.factory('chat', function() {

	var messages = [];

	function getMessages() {
		return messages;
	}

	function buildChat(_messages) {
		messages.length = 0;

		for (var i = 0, message; !!(message = _messages[i]); i++) {
			addMessage(message);
		}
	}

	function addMessage(message) {
		var time,
			hour,
			minute,
			text,
			newMessage;

		// Convert timestamp to human-friendly format
		time = new Date(message.time);
		hour = time.getHours();
		minute = time.getMinutes();
		time = ( hour > 9 ? hour : '0' + hour ) + ':' + ( minute > 9 ? minute : '0' + minute );

		text = addIcons(message.message);

		newMessage = {
			nickname: message.nickname,
			color: message.color,
			time: time,
			text: text
		};

		messages.push(newMessage);
	}

	function getIcon(icon) {
		icon = icon || ':)';

		var icons = {
			':)': 'smile',
			':(': 'sad',
			':P': 'tongue',
			':O': 'suprised',
			'<3': 'love',
			':/': 'depressed',
			':\\': 'depressed',
			';)': 'blink',
			':S': 'confused',
			':D': 'bigsmile'
		};

		return '<i class="smiley ' + icons[icon] + '" title="' +  icon + '"></i>';
	}

	function addIcons(message) {
		message = message.replace(':)', getIcon(':)'))
			.replace(/\(:/gi, getIcon(':)'))
			.replace(/:\(/gi, getIcon(':('))
			.replace(/\):/gi, getIcon(':('))
			.replace(/:P/gi, getIcon(':P'))
			.replace(/P:/gi, getIcon(':P'))
			.replace(/:O/gi, getIcon(':O'))
			.replace(/O:/gi, getIcon(':O'))
			.replace(/<3/gi, getIcon('<3'))
			.replace(/3>/gi, getIcon('<3'))
			.replace(/:\//gi, getIcon(':/'))
			.replace(/:\\/gi, getIcon(':/'))
			.replace(/\/:/gi, getIcon(':/'))
			.replace(/\\:/gi, getIcon(':/'))
			.replace(/;\)/gi, getIcon(';)'))
			.replace(/\(;/gi, getIcon(';)'))
			.replace(/:S/gi, getIcon(':S'))
			.replace(/S:/gi, getIcon(':S'))
			.replace(/:D/gi, getIcon(':D'))
			.replace(/D:/gi, getIcon(':D'));

		return message;
	}

	// Publish API
	return {
		getMessages: getMessages,
		buildChat: buildChat,
		addMessage: addMessage
	};

});