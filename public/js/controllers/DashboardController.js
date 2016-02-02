angular.module('DashboardController', ['UserFactory', 'ChatFactory', 'SettingFactory'])
	.controller('DashboardController', function($rootScope, $scope, $state, UserFactory, ChatFactory, SettingFactory) {
		var users = [];

		$scope.getDashboardUsers = function() {
			UserFactory.dashboardUsers()
				.then(function(response) {
					$scope.users = response.users;
					users = response.users;
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};

		$scope.getAllHobbies = function() {
			UserFactory.getAllHobbies()
				.then(function(response) {
					$scope.hobbies = response.hobbies;
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};

		$scope.getAllChatList = function() {
			ChatFactory.getAllChatList()
				.then(function(response) {
					$scope.chatList = response.chatList;
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};

		$scope.filterUserByHobby = function(hobby) {
			$scope.users = users;

			if (hobby) {
				var result = [];

				for (var index = 0; index < $scope.users.length; index++) {
					var matchHobbies = $.grep($scope.users[index].hobbies, function(hobbies, index) {
						return hobbies.hobby === hobby;
					});

					if (matchHobbies.length > 0) result.push($scope.users[index]);
				}

				$scope.users = result;
			}
		}

		$scope.createChatList = function(id, $event) {
			ChatFactory.createChatList(id)
				.then(function(response) {
					SettingFactory.success(response.message);
					angular.element($event.currentTarget).replaceWith('<a class="btn btn-info disabled" role="button">Requesting</a>');
			    })
			    .catch(function(response) {
					SettingFactory.error(response.message);
			    });
		};
	});
