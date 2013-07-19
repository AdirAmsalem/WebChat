WebChat.factory('chat', function() {

	var messages = [];

	function getMessages() {
		return messages;
	}

	function buildChat(messages) {
		for (var i = 0, message; !!(message = messages[i]); i++) {
			addMessage(message);
		}
	}

	function addMessage(message) {
		var time,
			hour,
			minute,
			text,
			newMessage = {};

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

		return '<img src="images/smileys/' + icons[icon] + '.jpg" alt="' +  icon + '" title="' +  icon + '">';
	}

	function addIcons(message) {
		message = message.replace(':)', getIcon(':)'))
			.replace('(:', getIcon(':)'))
			.replace(':(', getIcon(':('))
			.replace('):', getIcon(':('))
			.replace(':P', getIcon(':P'))
			.replace('P:', getIcon(':P'))
			.replace(':p', getIcon(':P'))
			.replace('p:', getIcon(':P'))
			.replace(':O', getIcon(':O'))
			.replace('O:', getIcon(':P'))
			.replace('<3', getIcon('<3'))
			.replace('3>', getIcon('3>'))
			.replace(':/', getIcon(':/'))
			.replace(':\\', getIcon(':/'))
			.replace('/:', getIcon(':/'))
			.replace('\\:', getIcon(':/'))
			.replace(';)', getIcon(';)'))
			.replace('(;', getIcon(';)'))
			.replace(':S', getIcon(':S'))
			.replace('S:', getIcon(':S'))
			.replace(':s', getIcon(':S'))
			.replace('s:', getIcon(':S'))
			.replace(':D', getIcon(':D'))
			.replace('D:', getIcon(':D'));

		return message;
	}

	// Publish API
	return {
		getMessages: getMessages,
		buildChat: buildChat,
		addMessage: addMessage
	};

});