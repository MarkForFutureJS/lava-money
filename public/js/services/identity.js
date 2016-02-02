angular.module('IdentityFactory', ['SocketFactory', 'SettingFactory'])
    .factory('IdentityFactory', function($state, $rootScope, SocketFactory, SettingFactory) {
        var factory = {};

        function objectParser(value) {
            if (Object.prototype.toString.call(value) === '[object Array]') {
                var result = [],
                    valueLength = value.length;

                if (valueLength > 0) {
                    for (var index = 0; index < valueLength; index++) {
                            result.push(value[index]);
                    }
                }

                return result;
            }

            return value;
        }

        factory.logout = function(response) {
            SocketFactory.emit('forceDisconnect');

            $rootScope.aRootScope = {identityStatus: false, identity: null};

            $state.go('layout.home')
                .then(function() {
                    if (response.status) SettingFactory.success(response.message);
                    else SettingFactory.error(response.message);
                });
        }

        factory.process = function(response) {
            $rootScope.aRootScope = {identityStatus: response.status, identity: response.user};
        }

        factory.getIdentityStatus = function() {
            return $rootScope.aRootScope.identityStatus;
        }

        factory.getIdentity = function() {
            return $rootScope.aRootScope.identity;
        }

        factory.getProfile = function() {
            var profile = {},
                identity = Object.create(factory.getIdentity());

            profile.name = objectParser(identity.name);
            profile.gender = objectParser(identity.gender);
            profile.hobbies = objectParser(identity.hobbies);
            profile.picture = objectParser(identity.picture);

            return profile
        }

        return factory;
    });
