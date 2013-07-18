WebChat.controller('AppController', ['$rootScope', '$scope', '$window', 'server', 'beeper', 'counter', 'localization', 'i18nFilter', function($rootScope, $scope, $window, server, beeper, counter, localization, i18nFilter) {

	function serverConnected() {
		console.log('WebChat is ready!');
	}

	function updateUserNick(nick) {
		$scope.user.newNick = nick;
	}

	function loggedIn() {
		$scope.user.nick = $scope.user.newNick;
		$scope.user.loggedIn = true;
		bindCounter();
	}

	function bindCounter() {
		$window.addEventListener('focus', disableCounter);
		$window.addEventListener('blur', enableCounter);
	}

	function displayCounter() {
		$scope.title = $scope.appName + ' (' + counter.getValue() + ')';
	}

	function enableCounter() {
		counter.enable();
	}

	function disableCounter() {
		counter.disable();
		$scope.title = $scope.appName;
	}

	localization.getData().then( function(data) {
		$scope.i18n = data;
	});

	$scope.appName = 'Web Chat';
	$scope.title = $scope.appName;

	// Default user information
	$scope.user = {
		nick: '',
		newNick: '',
		loggedIn: false
	};

	$scope.templates = {
		userList:		'templates/general/user_list.html',
		loginMessage:	'templates/general/login_message.html',
		chatMessages:	'templates/general/messages.html',
		loginForm:		'templates/forms/login.html',
		messageForm:	'templates/forms/message.html'
	};

	$scope.beeperActive = beeper.isActive;
	$scope.beeperTooltip = beeper.isActive() ? 'disable_sound' : 'enable_sound';

	$scope.toggleBeeper = function() {
		if (beeper.isActive()) {
			beeper.disable();
			$scope.beeperTooltip = 'enable_sound';
		} else {
			beeper.enable();
			$scope.beeperTooltip = 'disable_sound';
		}
	};

	$rootScope.$on('server:connected', function() {
		serverConnected();
	});

	$rootScope.$on('app:login', function(e, nick) {
		updateUserNick(nick);
	});

	$rootScope.$on('app:nickError', function(e) {
		$window.alert(i18nFilter('nick_is_already_in_use'));
	});

	$rootScope.$on('app:loggedIn', function(e) {
		loggedIn();
	});

	$rootScope.$on('chat:message', function(e) {
		beeper.beep();

		if (counter.isActive()) {
			counter.increase();
			displayCounter();
		}
	});

}]).run( ['server', function(server) {

	if ('WebSocket' in window) {
		console.log('Preparing WebChat..');
		server.connect();
	} else {
		console.error('We are sorry, you cannot use WebChat.');
		return false;
	}

}]);