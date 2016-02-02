angular.module('ChatFactory', ['IdentityFactory'])
    .factory('ChatFactory', function($q, $http, IdentityFactory) {
        var factory = {};

        factory.getAllChatList = function() {
            var defer = $q.defer();

            $http.get('/api/get-all-chat-list')
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.createChatList = function(id) {
            var defer = $q.defer();

            $http.post('/api/create-chat-list', {companion: id})
                .success(function(response) {
                    if (response.status) {
                        IdentityFactory.process(response);

                        defer.resolve(response);
                    } else {
                        defer.reject(response);
                    }
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.getChatList = function() {
            var defer = $q.defer();

            $http.get('/api/get-chat-list')
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.approveChatList = function(id) {
            var defer = $q.defer();

            $http.post('/api/approve-chat-list', {id: id})
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.getChatListByID = function(id) {
            var defer = $q.defer();

            $http.post('/api/get-chat-list-by-id', {id: id})
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.getChatRoomByChatListID = function(id) {
            var defer = $q.defer();

            $http.post('/api/get-chat-room-by-chat-list-id', {id: id})
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.chatRoom = function(chat) {
            var defer = $q.defer();

            $http.post('/api/chat-room', chat)
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        }

        return factory;
    });
