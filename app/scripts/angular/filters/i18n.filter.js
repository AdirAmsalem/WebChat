angular.module('Localization', []).factory('localization', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {

	var LANG_DIRECTORY = 'scripts/lang',
		langData,
		language,
		supportedLanguages = [
			{
				name: 'English',
				languages: ['en', 'en-us'],
				file: 'en.json'
			},
			{
				name: 'עברית',
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
		if (language) {
			for (var i = 0, langObject; !!(langObject = supportedLanguages[i]); i++) {
				for (var j = 0, lang; !!(lang = langObject.languages[j]); j++) {
					if (lang === language) {
						return langObject;
					}
				}
			}
		}

		return supportedLanguages[0];
	}

	function setLanguageByCode(langCode) {
		if (langCode && angular.isString(langCode)) {
			language = langCode.toLowerCase();
		}

		return getLocalization();
	}

	function setLanguageByName(langName) {
		if (langName && angular.isString(langName)) {
			for (var i = 0, lang; !!(lang = supportedLanguages[i]); i++) {
				if (lang.name === langName) {
					language = lang.languages[0];
				}
			}
		}

		return getLocalization();
	}

	function getKey(key) {
		if (langData && langData.keys && langData.keys[key]) {
			return langData.keys[key];
		}

		return '';
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

	// Publish API
	return {
		getLanguageList: getLanguageList,
		setLanguageByCode: setLanguageByCode,
		setLanguageByName: setLanguageByName,
		getLanguage: getLanguage,
		getKey: getKey
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