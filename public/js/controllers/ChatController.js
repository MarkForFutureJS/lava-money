angular.module('ChatController', ['ChatFactory', 'SocketFactory', 'SettingFactory'])
	.controller('ChatListController', function($rootScope, $scope, $state, $stateParams, ChatFactory, SettingFactory) {
		var chatList = [];

		$scope.resetName = function() {
			$scope.chatList = chatList;
			$scope.searchName($('#search-name').val());
		};

		$scope.resetGender = function() {
			$scope.chatList = chatList;
			$scope.searchGender($('#search-gender').val());
		};

		$scope.resetHobbies = function() {
			$scope.chatList = chatList;
		};

		$scope.searchName = function(name) {
			$scope.chatList = chatList;

			if (name) {
				var result = [];

				for (var index = 0; index < chatList.length; index++) {
					if (chatList[index].initiator._id == $rootScope.aRootScope.identity.id && chatList[index].companion.name.indexOf(name) > -1) result.push(chatList[index]);
					if (chatList[index].companion._id == $rootScope.aRootScope.identity.id && chatList[index].initiator.name.indexOf(name) > -1) result.push(chatList[index]);
				}

				$scope.chatList = result;
			}
		};

		$scope.searchGender = function(gender) {
			$scope.chatList = chatList;

			if (gender) {
				var result = [];

				for (var index = 0; index < chatList.length; index++) {
					if (chatList[index].initiator._id == $rootScope.aRootScope.identity.id && chatList[index].companion.gender && chatList[index].companion.gender === gender) result.push(chatList[index]);
					if (chatList[index].companion._id == $rootScope.aRootScope.identity.id && chatList[index].initiator.gender && chatList[index].initiator.gender === gender) result.push(chatList[index]);
				}

				$scope.chatList = result;
			}
		};

		$scope.searchHobby = function(hobby) {
			$scope.chatList = chatList;

			if (hobby) {
				var result = [];

				for (var index = 0; index < chatList.length; index++) {
					if (chatList[index].initiator._id == $rootScope.aRootScope.identity.id && chatList[index].companion.hobbies) {
						var matchHobbies = $.grep(chatList[index].companion.hobbies, function(hobbies) {
							return hobbies.hobby === hobby;
						});

						if (matchHobbies.length > 0) result.push(chatList[index]);
					}

					if (chatList[index].companion._id == $rootScope.aRootScope.identity.id && chatList[index].initiator.hobbies) {
						var matchHobbies = $.grep(chatList[index].initiator.hobbies, function(hobbies) {
							return hobbies.hobby === hobby;
						});

						if (matchHobbies.length > 0) result.push(chatList[index]);
					}
				}

				$scope.chatList = result;
			}
		};

		$scope.getChatList = function() {
			ChatFactory.getChatList()
				.then(function(response) {
					$scope.chatList = response.chatList;
					chatList = response.chatList;

					if (response.chatList.length > 0) {
						var result = [];

						for (var index = 0; index < response.chatList.length; index++) {
							if (response.chatList[index].initiator._id == $rootScope.aRootScope.identity.id && response.chatList[index].companion.hobbies) {
								for (var companionIndex = 0; companionIndex < response.chatList[index].companion.hobbies.length; companionIndex++) {
									if (result.indexOf(response.chatList[index].companion.hobbies[companionIndex].hobby) == -1) result.push(response.chatList[index].companion.hobbies[companionIndex].hobby);
								}
							}

							if (response.chatList[index].companion._id == $rootScope.aRootScope.identity.id && response.chatList[index].initiator.hobbies) {
								for (var initiatorIndex = 0; initiatorIndex < response.chatList[index].initiator.hobbies.length; initiatorIndex++) {
									if (result.indexOf(response.chatList[index].initiator.hobbies[initiatorIndex].hobby) == -1) result.push(response.chatList[index].initiator.hobbies[initiatorIndex].hobby);
								}
							}
						}

						$scope.hobbies = result;
					}
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};

		$scope.approveChatList = function(id) {
			ChatFactory.approveChatList(id)
				.then(function(response) {
					$state.go('layout.chat-room', {id: id})
						.then(function() {
							SettingFactory.success(response.message);
						});
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};
	})
	.controller('ChatRoomController', function($rootScope, $scope, $state, $stateParams, chatList, ChatFactory, SocketFactory, SettingFactory) {
		$scope.chatListID = $stateParams.id;
		$scope.chatList = chatList;
		$scope.chatRoom = [];

		SocketFactory.forceConnect();
		SocketFactory.emit('join', {id: $scope.chatListID});
		SocketFactory.on('chat_backend', function(data) {
    		$scope.$apply(function() {
      			$scope.chatRoom.push(data);
    		});
		});

		$scope.getChatRoomByChatListID = function() {
			ChatFactory.getChatRoomByChatListID($scope.chatListID)
				.then(function(response) {
					$scope.chatRoom = response.chatRoom;
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};

		$scope.chatRoomFormSubmit = function() {
			ChatFactory.chatRoom($.extend({}, {chat_list_id: $scope.chatListID, initiator: chatList.initiator._id, companion: chatList.companion._id}, $scope.chat))
				.then(function(response) {
					SocketFactory.emit('chat_frontend', {_id: response.chatRoom._id, chat_list_id: response.chatRoom.chat_list_id, creator: response.chatRoom.creator, message: response.chatRoom.message, created_at: response.chatRoom.created_at});

					$scope.chatRoomForm.$setPristine();
					$scope.chat = {message: ''};
		        })
		        .catch(function(response) {
					SettingFactory.error(response.message);
		        });
		};
	});
