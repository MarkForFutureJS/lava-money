angular.module('SocketFactory', [])
    .factory('SocketFactory', function() {
		var socket = null;

		return {
			forceConnect: function() {
				socket = io.connect({'forceNew': true});
			},
			on: function(eventName, callback) {
				if (socket) socket.on(eventName, callback);
			},
			emit: function(eventName, data) {
				if (socket) socket.emit(eventName, data);
			}
		};
    });
