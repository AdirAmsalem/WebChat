angular.module('Localization', []).factory('localization', ['$rootScope', '$http', '$q', '$timeout', function($rootScope, $http, $q, $timeout) {

	var LANG_DIRECTORY = 'scripts/lang',
		langData,
		language = (navigator.language || navigator.userLanguage).toLowerCase(),
		supportedLanguages = [
			{
				name: 'English',
				languages: ['en', 'en-us'],
				file: 'en.json'
			},
			{
				name: 'Hebrew',
				languages: ['he', 'he-il'],
				file: 'he.json'
			}
		];

	function getLanguageList() {
		var list = [];

		// Basic memoization
		if (this.list) {
			return this.list;
		}

		for (var i = 0, lang; !!(lang = supportedLanguages[i]); i++) {
			list.push({
				name: lang.name,
				value: lang.languages[0]
			});
		}

		this.list = list;

		return list;
	}

	function getLanguage() {
		for (var i = 0, langObject; !!(langObject = supportedLanguages[i]); i++) {
			for (var j = 0, lang; !!(lang = langObject.languages[j]); j++) {
				if (lang === language) {
					return langObject;
				}
			}
		}

		return supportedLanguages[0];
	}

	function setLanguage(lang) {
		if (lang && angular.isString(lang)) {
			language = lang;
		}
	}

	function getKey(key) {
		if (langData && langData.keys && langData.keys[key]) {
			return langData.keys[key];
		}

		return '';
	}

	function getData() {
		var deferred = $q.defer();

		function getLangData() {
			if (langData) {
				deferred.resolve(langData);
				return true;
			}

			$timeout(getLangData, 200);
		}

		getLangData();

		return deferred.promise;
	}

	function getLocalization() {
		var deferred = $q.defer(),
			seperator = LANG_DIRECTORY[LANG_DIRECTORY.length-1] !== '/' ? '/' : '',
			file = getLanguage().file;

		function setLangData(data) {
			langData = data;
			deferred.resolve(data);
		}

		$http.get(LANG_DIRECTORY + seperator + file, { cache: true })
			.success(setLangData)
			.error(deferred.reject);

		return deferred.promise;
	}

	getLocalization().then(null, function() {
		console.error('Can\'t load localization file.');
	});

	// Publish API
	return {
		getLanguageList: getLanguageList,
		getKey: getKey,
		getData: getData,
	};

}])
.filter('i18n', ['localization', function(localization) {
	return function(key) {
		if (key && angular.isString(key)) {
			return localization.getKey(key);
		}
		return '';
	};
}]);