angular.module('SettingFactory', [])
    .factory('SettingFactory', function($filter, toasty) {
        var factory = {};

        factory.success = function(message) {
            toasty.success({
    			msg: message
			});
        };

        factory.warning = function(message) {
            toasty.warning({
                msg: message,
                timeout: false
            });
        };

        factory.error = function(message) {
        	var errorMessage = '';

            errorMessage += '<ul class="error-message-list-group list-group">';

        	for (field in message) {
        		errorMessage += '<li class="list-group-item">';
                errorMessage += '<span class="v-align">';
                errorMessage += $filter('label')(field);
                errorMessage += '<span class="glyphicon glyphicon-arrow-right"></span>';
                errorMessage += '</span>';
                if (Object.prototype.toString.call(message[field]) === '[object String]') errorMessage += '<span class="v-align">' + message[field] + '</span>';
                if (Object.prototype.toString.call(message[field]) === '[object Array]') {
                    errorMessage += '<ul class="v-align">';
                    for (var index = 0; index < message[field].length; index++) errorMessage += '<li>' + message[field][index] + '</li>';
                    errorMessage += '</ul>';
                }
                errorMessage += '</li>';
        	}

        	errorMessage += '</ul>';

            toasty.error({
    			msg: errorMessage,
    			timeout: false
			});
        };

        return factory;
    });
