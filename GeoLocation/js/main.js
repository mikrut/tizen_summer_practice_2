window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};

const HOST_ADDR = "http://192.168.0.25:8081/";
var gameID = null;
var lastPos = null,
	lat = null,
	lng = null;

function game(e) {
	e.preventDefault();
	if (gameID == null) {
		initialize();
		getCurrentLocation();
	} else {
		checkPoint();
	}
	return false;
}

function initialize() {
	const INIT = "init";
	const DEVICE_ID = "#24";
	console.log("Initialization");
	console.log(HOST_ADDR + INIT);
	
	$.ajax({
		method: 'POST',
		url: HOST_ADDR + INIT,
		data: JSON.stringify({device_id: DEVICE_ID}),
		success: function(response) {
			console.log(response);
			gameID = response.game_id;
			$("#content-text").text("Game ID: " + response.game_id);
		},
		error: function(err) {
			console.error(JSON.stringify(err));
		},
		dataType: 'json'
	});
}

function checkPoint() {
	const CHECK = "check_point";
	console.log("Checking point");
	
	$.ajax({
		method: 'POST',
		url: HOST_ADDR + CHECK,
		data: JSON.stringify({game_id: gameID}),
		success: function(response) {
			console.log(response);
			//lat = response.point.latitude;
			//lng = response.point.longitude;
			evalCoords(response.distance);
		},
		error: function(err) {
			console.error(JSON.stringify(err));
		},
		dataType: 'json'
	});
}

function evalCoords(distance) {
	/*if (lastPos != null && lat != null && lng != null) {
		var diff = Math.sqrt(Math.pow(lastPos.latitude - lat) + Math.pow(lastPos.longitude - lng));
		$("#content-text").text("Diff: " + diff);
	} else if (lastPos == null) {
		$("#content-text").text("Waiting for Geo data from phone...");
	} else {
		$("#content-text").text("Click PLAY to get coords from server");
	}*/
	$("#content-text").text("Diff: " + distance);
}

function doFunc() {
	$("#content-text").text($("#content-text").text() == "Basic" ? "Tizen" : "Basic");
}

function getCurrentLocation() {
	console.log("getCurrentLocation");
	if (navigator.geolocation) {
		//navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 0});
		navigator.geolocation.watchPosition(onSuccess, onError, {maximumAge: 0});
	} else {
		const ERR_NO_GEO_MSG = "Geo location is not supported";
		console.warn(ERR_NO_GEO_MSG);
		$("#content-text").text(ERR_NO_GEO_MSG);
	}
}

function onSuccess(position) {
	console.log(JSON.stringify(position));
	// $("#content-text").text("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
	lastPos = position.coords;
	//evalCoords();
}

function onError(error) {
	console.error(JSON.stringify(error));
	// $("#content-text").text("Error: " + error.code + " " + error.message);
}

$(document).ready(function() {
	$("#mysuperbutton").click(game);
});