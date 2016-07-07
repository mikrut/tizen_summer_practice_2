
function vibrateOnce() {
	navigator.vibrate(2000);
}

function vibrateTwice() {
	navigator.vibrate([1000, 1000, 1000]);
}

function stopVibrate() {
	navigator.vibrate(0);
}

$(document).ready(function(){
	var slider = $("#slider_bluetooth");
	try {
		if (tizen.bluetooth == undefined) {
			alert("No bluetooth adapter was found!");
			slider.slider();
			slider.disable();
		} else {
			var adapter = tizen.bluetooth.getDefaultAdapter();
			window.setInterval(sliderBT, 200);
			slider.slider();
			slider.val(adapter.powered ? "on" : "off").slider("refresh");
		}
	} catch(error) {
		alert(error);
	}
});

function sliderBT() {
	var adapter = tizen.bluetooth.getDefaultAdapter();
	$("#slider_bluetooth").val(adapter.powered ? "on" : "off").slider("refresh");
}

function onOffBluetooth() {
	var adapter = tizen.bluetooth.getDefaultAdapter();
	
	adapter.setPowered($("#slider_bluetooth").val() == 'on');
}