$(document).ready(function() {
	setTime(new Date());
	
	var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
	console.log(reqAppControl);
    if (reqAppControl) {
        console.log(reqAppControl.appControl.data);
        var operation = reqAppControl.appControl.operation;
        console.log(operation);
        
        if (operation == "http://tizen.org/appcontrol/operation/alarm") {
        	doVibrate();
        }
    }
});

function setTime(today) {
    var h=today.getHours();
    var m=today.getMinutes();
    var s=0;//today.getSeconds();
    h = checkTime(h); 
    m = checkTime(m);
    s= checkTime(s);
    
	$("#picker_time").val(h+":"+m+":"+s);
}

function checkTime(i) {
    if (i<10) {i = "0" + i} // add zero in front of numbers < 10
    return i;
}

function pickTime() {
	$("#picker_enable").prop("checked", true);
	resetAlarms();
}

function resetAlarms() {
	var time = $("#picker_time").val();
	var enabled = $("#picker_enable").prop("checked");
	
	console.log("Time " + time);
	console.log("Enabled " + enabled);
	
	var date = new Date();
	
	var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    var seconds = time.split(":")[2];
    
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
	
	console.log(date);
	setTime(date);
	
	tizen.alarm.removeAll();
	if (enabled) {
		var alarm = new tizen.AlarmAbsolute(date, tizen.alarm.PERIOD_DAY);
		var appControl = new window.tizen.ApplicationControl("http://tizen.org/appcontrol/operation/alarm", "http://www.tizen.org",
				null, null, null);
		tizen.alarm.add(alarm, tizen.application.getCurrentApplication().appInfo.id, appControl);
	}
	
	console.log(tizen.alarm.getAll());
}

function doVibrate() {
	console.log("Vibration");
	navigator.vibrate([2000, 1000, 2000, 1000, 2000]);
}