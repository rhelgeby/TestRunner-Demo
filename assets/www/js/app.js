// Wait for PhoneGap to load
//
/*document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    // Empty
}*/

function myButtonClicked()
{
	var status = document.getElementById("buttonStatus");
	status.innerHTML = "Clicked.";
}

function vibrate(duration)
{
	navigator.notification.vibrate(duration);
}

function beep(times)
{
	navigator.notification.beep(times);
}

function contactExist(name)
{
	// TODO
	
	//var options = new ContactFindOptions();
    //options.filter="Bob"; 
    //var fields = ["displayName", "name"];
    //navigator.contacts.find(fields, onSuccess, onError, options);
	
	// TODO: Test Runner doesn't support callbacks...
	
	return false;
}

function addContact(name)
{
	// TODO
	console.log("addContact(" + name + ")");
}
