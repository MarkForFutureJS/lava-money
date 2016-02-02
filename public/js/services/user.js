angular.module('UserFactory', ['IdentityFactory'])
    .factory('UserFactory', function($q, $http, $state, $filter, IdentityFactory, SettingFactory) {
        var factory = {};

        factory.validateLocalEmail = function(user) {
            return $http.post('/api/validate-local-email', user);
        };

        factory.validatePassword = function(user) {
            return $http.post('/api/validate-password', user);
        }

        factory.user = function() {
            $http.get('/api/user')
                .success(function(response) {
                    IdentityFactory.process(response);
                });
        };

        factory.logout = function(user) {
            $http.post('/api/logout', user)
                .success(function(response) {
                    IdentityFactory.logout(response);
                });
        };

        factory.checkUserByForgetPasswordToken = function(forgetPasswordToken) {
            $http.post('/api/check-user-by-forget-password-token', {forgetPasswordToken: forgetPasswordToken})
                .success(function(response) {
                    SettingFactory.warning($filter('date')(response.forget_password_token_expire_date, 'yyyy-MM-dd HH:mm:ss') + ' is expire date');
                })
                .error(function(response, status) {
                    if (status === 401 || status === 404) {
                        $state.go('layout.home')
                            .then(function() {
                                SettingFactory.error(response.message);
                            });
                    }
                });
        };

        factory.localLogin = function(user) {
            var defer = $q.defer();

            $http.post('/api/local-login', user)
                .success(function(response) {
                    if (response.status) {
                        IdentityFactory.process(response);

                        defer.resolve(response);
                    } else {
                        defer.reject(response);
                    }
                });

            return defer.promise;
        };

        factory.localSignup = function(user) {
            var defer = $q.defer();

            $http.post('/api/local-signup', user)
                .success(function(response) {
                    if (response.status) {
                        IdentityFactory.process(response);

                        defer.resolve(response);
                    } else {
                        defer.reject(response);
                    }
                });

            return defer.promise;
        };

        factory.forgetPassword = function(user) {
            var defer = $q.defer();

            $http.post('/api/forget-password', user)
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                });

            return defer.promise;
        };

        factory.forgetPasswordToken = function(user) {
            var defer = $q.defer();

            $http.post('/api/forget-password-token', user)
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401 || status === 404) {
                        $state.go('layout.home')
                            .then(function() {
                                SettingFactory.error(response.message);
                            });
                    }
                });

            return defer.promise;
        };

        factory.profile = function(user) {
            var defer = $q.defer();

            $http.post('/api/profile', user)
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

        factory.disconnectFacebook = function() {
            var defer = $q.defer();

            $http.get('/api/disconnect-facebook')
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

        factory.resetPassword = function(user) {
            var defer = $q.defer();

            $http.post('/api/reset-password', user)
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.dashboardUsers = function() {
            var defer = $q.defer();

            $http.get('/api/dashboard-users')
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        factory.getAllHobbies = function() {
            var defer = $q.defer();

            $http.get('/api/get-all-hobbies')
                .success(function(response) {
                    if (response.status) defer.resolve(response);
                    else defer.reject(response);
                })
                .error(function(response, status) {
                    if (status === 401) IdentityFactory.logout(response);
                });

            return defer.promise;
        };

        return factory;
    });
