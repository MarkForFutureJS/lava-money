angular.module('MainController', ['UserFactory'])
	.controller('LayoutController', function($rootScope, $scope, UserFactory, toasty) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        	toasty.clear();
            $scope.collapse = true;
        });

		$scope.logout = function() {
			UserFactory.logout();
			$scope.collapse = true;
		};
	})
	.controller('SuccessController', function($timeout, $scope, $state, $stateParams, stateNames, toasty) {
		$scope.loading = true;

		$timeout(function() {
			$scope.loading = false;

			if ($stateParams.url && $stateParams.url !== 'layout.success' && stateNames.indexOf($stateParams.url) > -1) {
				$state.go($stateParams.url)
					.then(function() {
						if ($stateParams.message) {
							toasty.success({
								msg: $stateParams.message
							});
						}
					});
			} else {
				$state.go('layout.home');
			}
		}, 3000);
	})
	.controller('ErrorController', function($timeout, $scope, $state, $stateParams, stateNames, toasty) {
		$scope.loading = true;

		$timeout(function() {
			$scope.loading = false;

			if ($stateParams.url && $stateParams.url !== 'layout.error' && stateNames.indexOf($stateParams.url) > -1) {
				$state.go($stateParams.url)
					.then(function() {
						if ($stateParams.message) {
							toasty.error({
								msg: $stateParams.message,
								timeout: false
							});
						}
					});
			} else {
				$state.go('layout.home');
			}
		}, 3000);
	});
