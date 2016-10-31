'use strict';


class StorageService{
	constructor($window) {
		'ngInject';
		this._$window = $window;
	}

	setItem(key, value){
		this._$window.localStorage.setItem(key, JSON.stringify(value));
	}

	getItem(key){
		const value = this._$window.localStorage.getItem(key);
		try {
			return JSON.parse(value);
		}
		catch(error)
		{

		}
		return {};
	}
}

export default StorageService;