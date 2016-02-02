angular.module('aRouter', ['ui.router', 'MainController', 'UserController', 'ChatController', 'DashboardController', 'UserFactory', 'ChatFactory', 'IdentityFactory', 'SettingFactory'])
    .config(function($stateProvider, $urlRouterProvider) {
        var getStateNames = function($state) {
            var states = $state.get(),
                statesLength = states.length,
                stateNames = [];

            for (var index = 0; index < statesLength; index++) {
                if (states[index].name) stateNames.push(states[index].name);
            }

            return stateNames;
        }

        var checkLogin = function($q, $state, $timeout, IdentityFactory) {
            if (IdentityFactory.getIdentityStatus()) {
                $timeout(function() {
                    $state.go('layout.home');
                });

                return $q.reject();
            } else {
                return $q.when();
            }
        }

        var checkLogout = function($q, $state, $timeout, IdentityFactory) {
            if (!IdentityFactory.getIdentityStatus()) {
                $timeout(function() {
                    $state.go('layout.home');
                });

                return $q.reject();
            } else {
                return $q.when();
            }
        }

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('layout', {
                url: '',
                abstract: true,
                views: {
                    'header': {
                        controller: 'LayoutController',
                        templateUrl: 'views/header.html'
                    },
                    'footer': {
                        controller: 'LayoutController',
                        templateUrl: 'views/footer.html'
                    }
                },
                resolve: {
                    layout: function(UserFactory) {
                        UserFactory.user();
                    }
                }
            })
            .state('layout.home', {
                url: '/',
                views: {
                    'container@': {
                        templateUrl: 'views/home.html'
                    }
                }
            })
            .state('layout.success', {
                url: '/success?url&message',
                views: {
                    'container@': {
                        controller: 'SuccessController',
                        templateUrl: 'views/temporary.html',
                        resolve: {
                            stateNames: getStateNames
                        }
                    }
                }
            })
            .state('layout.error', {
                url: '/error?url&message',
                views: {
                    'container@': {
                        controller: 'ErrorController',
                        templateUrl: 'views/temporary.html',
                        resolve: {
                            stateNames: getStateNames
                        }
                    }
                }
            })
            .state('layout.local-login', {
                url: '/local-login',
                views: {
                    'container@': {
                        controller: 'LocalLoginController',
                        templateUrl: 'views/local-login.html',
                        resolve: {
                            login: checkLogin
                        }
                    }
                }
            })
            .state('layout.local-signup', {
                url: '/local-signup',
                views: {
                    'container@': {
                        controller: 'LocalSignupController',
                        templateUrl: 'views/local-signup.html',
                        resolve: {
                            login: checkLogin
                        }
                    }
                }
            })
            .state('layout.forget-password', {
                url: '/forget-password',
                views: {
                    'container@': {
                        controller: 'ForgetPasswordController',
                        templateUrl: 'views/forget-password.html',
                        resolve: {
                            login: checkLogin
                        }
                    }
                }
            })
            .state('layout.forget-password-token', {
                url: '/forget-password-token/:token',
                views: {
                    'container@': {
                        controller: 'ForgetPasswordTokenController',
                        templateUrl: 'views/forget-password-token.html',
                        resolve: {
                            login: checkLogin,
                            token: function($stateParams, UserFactory) {
                                UserFactory.checkUserByForgetPasswordToken($stateParams.token);
                            }
                        }
                    }
                }
            })
            .state('layout.profile', {
                url: '/profile',
                views: {
                    'container@': {
                        controller: 'ProfileController',
                        templateUrl: 'views/profile.html',
                        resolve: {
                            logout: checkLogout
                        }
                    }
                }
            })
            .state('layout.reset-password', {
                url: '/reset-password',
                views: {
                    'container@': {
                        controller: 'ResetPasswordController',
                        templateUrl: 'views/reset-password.html',
                        resolve: {
                            logout: checkLogout
                        }
                    }
                }
            })
            .state('layout.chat-list', {
                url: '/chat-list',
                views: {
                    'container@': {
                        controller: 'ChatListController',
                        templateUrl: 'views/chat-list.html',
                        resolve: {
                            logout: checkLogout
                        }
                    }
                }
            })
            .state('layout.chat-room', {
                url: '/chat-room/:id',
                views: {
                    'container@': {
                        controller: 'ChatRoomController',
                        templateUrl: 'views/chat-room.html',
                        resolve: {
                            logout: checkLogout,
                            chatList: function($state, $stateParams, ChatFactory, SettingFactory) {
                                return ChatFactory.getChatListByID($stateParams.id)
                                    .then(function(response) {
                                        return response.chatList;
                                    })
                                    .catch(function(response) {
                                        $state.go('layout.home')
                                            .then(function() {
                                                SettingFactory.error(response.message);
                                            });
                                    });
                            }
                        }
                    }
                }
            })
            .state('layout.dashboard', {
                url: '/dashboard',
                views: {
                    'container@': {
                        controller: 'DashboardController',
                        templateUrl: 'views/dashboard.html',
                        resolve: {
                            logout: checkLogout
                        }
                    }
                }
            });
    });
