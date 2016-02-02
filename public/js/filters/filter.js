angular.module('aFilter', [])
	.filter('label', function() {
		return function(value) {
			return (value.substr(0, 1).toUpperCase() + value.substr(1)).replace(/([A-Z])/g, ' $1');
		};
	});
