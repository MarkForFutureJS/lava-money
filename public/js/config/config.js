angular.module('aConfig', ['angular-toasty'])
	.config(function(toastyConfigProvider) {
		toastyConfigProvider.setConfig({
			limit: 1,
			showClose: false,
			clickToClose: true,
			position: 'top-right',
			timeout: 6000,
			html: true,
			sound: false,
			shake: false,
			theme: 'bootstrap'
		});
	});
