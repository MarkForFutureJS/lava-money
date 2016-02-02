angular.module('aDirective', ['UserFactory'])
	.directive('carouselHome', function() {
	    return function(scope, element) {
	    	element.carousel('cycle');
	    };
	})
	.directive('carouselImage', function($window) {
	    return function(scope, element) {
	        var window = angular.element($window);

	        scope.getWindowHeight = function() {
	            return window.height();
	        };

	        scope.$watch(scope.getWindowHeight, function(newValue, oldValue) {
	            scope.resizeCarouselImageHeight = function() {
	            	var height = (newValue - 130) + 'px';

	                return {
	                	'min-height': height,
	                    'max-height': height
	                };
	            };
	        }, true);

	        window.bind('resize', function() {
	            scope.$apply();
	        });
	    };
	})
	.directive('validateEmail', function(UserFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attributes, ngModelController) {
				if (!ngModelController) return;

				ngModelController.$parsers.unshift(function(value) {
					var valid = true;

					if (value) {
						valid = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(value);
						ngModelController.$setValidity('emailFormat', valid);

						if (valid) {
							var unique = null;

							if (attributes.unique === 'true') unique = true;
							if (attributes.unique === 'false') unique = false;

							if (unique === true || unique === false) {
								UserFactory.validateLocalEmail({email: value, unique: unique})
									.success(function(response) {
					                	valid = response.status;

					                	if (unique) ngModelController.$setValidity('uniqueTrueLocalEmail', valid);
					                	if (!unique) ngModelController.$setValidity('uniqueFalseLocalEmail', valid);

					                	return valid ? value : undefined;
					            	});
							}
						}
					}

					return valid ? value : undefined;
				});
			}
		};
	})
	.directive('validatePassword', function($rootScope, UserFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attributes, ngModelController) {
				if (!ngModelController) return;

				ngModelController.$parsers.unshift(function(value) {
					var valid = true;

					if (value) {
						UserFactory.validatePassword({id: $rootScope.aRootScope.identity.id, password: value})
							.success(function(response) {
			                	valid = response.status;
			                	ngModelController.$setValidity('validatePassword', valid);

			                	return valid ? value : undefined;
			            	});
					}

					return valid ? value : undefined;
				});
			}
		};
	})
	.directive('scrollChat', function($timeout) {
		return {
			scope: {
				scrollChat: '='
			},
			link: function(scope, element, attributes) {
				scope.$watchCollection('scrollChat', function(newValue, oldValue) {
					if (newValue) {
						$timeout(function() {
							element.scrollTop(element[0].scrollHeight);
						});
					}
				});
			}
		};
	})
	.directive('resizeChat', function($window) {
	    return function(scope, element) {
	        var window = angular.element($window);

	        scope.getWindowHeight = function() {
	            return window.height();
	        };

	        scope.$watch(scope.getWindowHeight, function(newValue, oldValue) {
	            scope.resizeChatBoxMainHeight = function() {
	            	var height = (newValue - 240) + 'px';

	                return {
	                	'min-height': height,
	                    'max-height': height
	                };
	            };
	        }, true);

	        scope.getElementParentWidth = function() {
	            return element.parent().width();
	        };

	        scope.$watch(scope.getElementParentWidth, function(newValue, oldValue) {
	            scope.resizeChatBoxWidth = function() {
	                return {
	                    'max-width': (newValue - 60) + 'px'
	                };
	            };
	        }, true);

	        window.bind('resize', function() {
	            scope.$apply();
	        });
	    };
	})
	.directive('sameHeight', function($window) {
	    return function(scope, element) {
	        scope.getElementWidth = function() {
	            return element.width();
	        };

	        scope.$watch(scope.getElementWidth, function(newValue, oldValue) {
	            element.height(newValue);
	        }, true);

	        angular.element($window).bind('resize', function() {
	            scope.$apply();
	        });
	    };
	})
	.directive('dashboardButton', function($compile) {
		return {
			replace: true,
			scope: {
				user: '=',
				identity: '=',
				chatList: '='
			},
			link: function(scope, element, attributes) {
				scope.$watch('chatList', function(newValue, oldValue) {
					if (newValue) {
						var status = false,
							dashboardButtonTemplate = '';

						for (var index = 0; index < scope.chatList.length; index++) {
							if (scope.chatList[index].initiator === scope.identity.id && scope.chatList[index].companion === scope.user._id) {
								status = true;
								dashboardButtonTemplate = '<a class="btn btn-info disabled" role="button">Requesting</a>';

								if (scope.chatList[index].decision_status === 1) dashboardButtonTemplate = '<a class="btn btn-success disabled" role="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> Matching</a>';
							}

							if (scope.chatList[index].companion === scope.identity.id && scope.chatList[index].initiator === scope.user._id) {
								status = true;
								dashboardButtonTemplate = '<a class="btn btn-info disabled" role="button">Responsing</a>';

								if (scope.chatList[index].decision_status === 1) dashboardButtonTemplate = '<a class="btn btn-success disabled" role="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> Matching</a>';
							}
						}

						if (status) element.replaceWith($compile(dashboardButtonTemplate)(scope));
					}
    			}, true);
			}
		};
	});
