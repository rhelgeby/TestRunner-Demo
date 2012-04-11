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

function contactExist(name, onSuccess, onError)
{
	var options = new ContactFindOptions();
    options.filter = name; 
    var fields = ["displayName", "name"];
    
    navigator.contacts.find(fields, onSuccess, onError, options);
}

function addContact(name)
{
	var contact = navigator.contacts.create({"displayName": name});
	contact.save();
}

function verifyContact(name)
{
	var status = document.getElementById("contactStatus");
	status.innerHTML = "Pending...";
	
	var onSuccess = function(contacts)
	{
		// The query was successful. Check if contact was found.
		if (contacts.length > 0)
		{
			status.innerHTML = "Success.";
		}
		else
		{
			status.innerHTML = "Failed.";
		}
	};
	
	var onError = function()
	{
		status.innerHTML = "Query failed.";
	};
	
	contactExist(name, onSuccess, onError);
}
