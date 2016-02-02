angular.module('UserController', ['UserFactory', 'SettingFactory'])
	.controller('LocalLoginController', function($rootScope, $scope, $state, UserFactory, SettingFactory) {
		$scope.localLoginFormName = 'localLoginForm';
		$scope.emailFieldName = 'email';
		$scope.passwordFieldName = 'password';

		$scope.localLoginFormSubmit = function() {
			$scope.localLoginForm.$setPristine();

			UserFactory.localLogin($scope.user)
				.then(function(response) {
					$state.go('layout.home')
						.then(function() {
							SettingFactory.success(response.message);
						});
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};
	})
	.controller('LocalSignupController', function($rootScope, $scope, $state, UserFactory, SettingFactory) {
		$scope.localSignupFormName = 'localSignupForm';
		$scope.emailFieldName = 'email';
		$scope.passwordFieldName = 'password';

		$scope.localSignupFormSubmit = function() {
			$scope.localSignupForm.$setPristine();

			UserFactory.localSignup($scope.user)
				.then(function(response) {
					$state.go('layout.home')
						.then(function() {
							SettingFactory.success(response.message);
						});
	            })
	            .catch(function(response) {
					SettingFactory.error(response.message);
	            });
		};
	})
	.controller('ForgetPasswordController', function($rootScope, $scope, $state, $stateParams, UserFactory, SettingFactory) {
		$scope.forgetPasswordFormName = 'forgetPasswordForm';
		$scope.emailFieldName = 'email';
		$scope.loading = false;

		$scope.forgetPasswordFormSubmit = function() {
			$scope.forgetPasswordForm.$setPristine();
			$scope.loading = true;

			UserFactory.forgetPassword($scope.user)
				.then(function(response) {
					$scope.loading = false;
					$state.go('layout.local-login')
						.then(function() {
							SettingFactory.success(response.message);
						});
	            })
	            .catch(function(response) {
	            	$scope.loading = false;
					SettingFactory.error(response.message);
	            });
		};
	})
	.controller('ForgetPasswordTokenController', function($rootScope, $scope, $state, $stateParams, UserFactory, SettingFactory) {
		$scope.user = {forgetPasswordToken: $stateParams.token};
		$scope.forgetPasswordTokenFormName = 'forgetPasswordTokenForm';
		$scope.passwordFieldName = 'password';
		$scope.passwordConfirmationFieldName = 'passwordConfirmation';

		$scope.forgetPasswordTokenFormSubmit = function() {
			$scope.forgetPasswordTokenForm.$setPristine();

			UserFactory.forgetPasswordToken($scope.user)
				.then(function(response) {
					$state.go('layout.local-login')
						.then(function() {
							SettingFactory.success(response.message);
						});
	            })
	            .catch(function(response) {
					SettingFactory.error(response.message);
	            });
		};
	})
	.controller('ProfileController', function($rootScope, $scope, $state, Upload, UserFactory, IdentityFactory, SettingFactory) {
		$scope.user = IdentityFactory.getProfile();
		$scope.profileFormName = 'profileForm';
		$scope.nameFieldName = 'name';
		$scope.genderFieldName = 'gender';
		$scope.hobbiesFieldName = 'hobbies';
		$scope.pictureFieldName = 'picture';

		$scope.disconnectFacebook = function() {
			UserFactory.disconnectFacebook()
				.then(function(response) {
					SettingFactory.success(response.message);
	            })
	            .catch(function(response) {
					SettingFactory.error(response.message);
	            });
		};

		$scope.profileFormSubmit = function(pictureModel) {
			$scope.profileForm.$setPristine();

			Upload.base64DataUrl(pictureModel)
				.then(function(pictureBase64DataUrl) {
					var profileObject = {};

					if ($scope.user.name) profileObject.name = $scope.user.name;
					if ($scope.user.gender) profileObject.gender = $scope.user.gender;
					if ($scope.user.hobbies) profileObject.hobbies = $scope.user.hobbies;
					if (pictureBase64DataUrl) profileObject.picture = pictureBase64DataUrl;

					UserFactory.profile($.extend({}, {gender: null, hobbies: [], picture: null}, profileObject))
						.then(function(response) {
							$state.go('layout.home')
								.then(function() {
									SettingFactory.success(response.message);
								});
			            })
			            .catch(function(response) {
							SettingFactory.error(response.message);
			            });
				});
		};
	})
	.controller('ResetPasswordController', function($rootScope, $scope, $state, UserFactory, SettingFactory) {
		$scope.resetPasswordFormName = 'resetPasswordForm';
		$scope.passwordFieldName = 'password';
		$scope.newPasswordFieldName = 'newPassword';
		$scope.newPasswordConfirmationFieldName = 'newPasswordConfirmation';

		$scope.resetPasswordFormSubmit = function() {
			$scope.resetPasswordForm.$setPristine();

			UserFactory.resetPassword($scope.user)
				.then(function(response) {
					$state.go('layout.home')
						.then(function() {
							SettingFactory.success(response.message);
						});
	            })
	            .catch(function(response) {
					SettingFactory.error(response.message);
	            });
		};
	});
