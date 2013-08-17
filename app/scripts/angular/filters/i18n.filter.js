angular.module('Localization', []).factory('localization', ['$http', '$q', function($http, $q) {

	var LANG_DIRECTORY = 'scripts/lang',
		langData,
		language,
		supportedLanguages = [
			{
				name: 'English',
				icon: 'usa',
				languages: ['en', 'en-us'],
				speechCode: 'en-US',
				file: 'en.json'
			},
			{
				name: 'עברית',
				icon: 'israel',
				languages: ['he', 'he-il'],
				speechCode: 'he-IL',
				file: 'he.json'
			}
		];

	LANG_DIRECTORY += LANG_DIRECTORY[LANG_DIRECTORY.length-1] !== '/' ? '/' : '';

	function getLanguageList() {
		var self = this;

		// Basic memoization
		if (this.list) {
			return this.list;
		}

		this.list = [];

		supportedLanguages.forEach( function(lang) {
			self.list.push({
				name: lang.name,
				icon: lang.icon
			});
		});

		return this.list;
	}

	function getLanguage() {
		var result = supportedLanguages[0];

		if (language) {
			supportedLanguages.some( function(langObject) {
				if (langObject.languages.indexOf(language) !== -1) {
					result = langObject;
					return true;
				}
			});
		}

		return result;
	}

	function setLanguageByCode(langCode) {
		if (langCode && typeof langCode === 'string') {
			language = langCode.toLowerCase();
		}

		return getLocalization();
	}

	function setLanguageByName(langName) {
		if (langName && typeof langName === 'string') {
			supportedLanguages.some( function(lang) {
				if (lang.name === langName) {
					language = lang.languages[0];
					return true;
				}
			});
		}

		return getLocalization();
	}

	function getKey(key) {
		if (langData && langData.keys && langData.keys.hasOwnProperty(key)) {
			return langData.keys[key];
		}

		return key;
	}

	function getLocalization() {
		var deferred = $q.defer(),
			file = getLanguage().file;

		function setLangData(data) {
			langData = data;
			deferred.resolve(data);
		}

		$http.get(LANG_DIRECTORY + file, { cache: true })
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
		if (key && typeof key === 'string') {
			return localization.getKey(key);
		}
		return key;
	};
}]);
