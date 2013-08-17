WebChat.directive('ieClass', function() {

	var isIE = /msie/i.exec(navigator.userAgent) !== null;

	return {
		restrict: 'A',
		link: function(scope, element) {
			if (isIE) {
				element.addClass('ie');
			}
		}
	};
});