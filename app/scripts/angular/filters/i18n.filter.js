angular.module('Localization', []).factory('localization', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {

	var cachedData,
		supportedLanguages = ['en', 'he'],
		language = navigator.language || navigator.userLanguage;

	function getLanguage() {
		for (var key in supportedLanguages) {
			if (supportedLanguages[key] === language) {
				return language;
			}
		}

		return supportedLanguages[0];
	}

	function getLocalization() {
		var deferred = $q.defer();

		function setLocalization(data) {
			cachedData = data;
			deferred.resolve(data);
		}

		$http.get('scripts/lang/' + getLanguage() + '.json')
			.success(setLocalization)
			.error(deferred.reject);

		return deferred.promise;
	}

	getLocalization().then(null, function() {
		console.error('Can\'t load localization file.');
	});

	return {
		getKey: function(key) {
			if (cachedData && cachedData.keys && cachedData.keys[key]) {
				return cachedData.keys[key];
			}
			return '';
		},
		getData: function() {
			var deferred = $q.defer();

			function getCache() {
				if (cachedData) {
					deferred.resolve(cachedData);
					return true;
				}

				setInterval(getCache, 200);
			}

			getCache();

			return deferred.promise;
		}
	};

}])
.filter('i18n', ['localization', function(localization) {
	return function(key) {
		if (!key || !angular.isString(key)) {
			return '';
		}
		return localization.getKey(key);
	};
}]);