// Test source. Builds tests and initializes Test Runner.

function buildTests()
{
    var simpleTests = new TestCollection("Main Collection");
    var phoneGapTests = new TestCollection("Main Collection");
    
    // This test clicks on a button that will change the text of a div-element,
    // and verifies that it was changed.
	simpleTests.addTest(new TestCase("Click button", "index.html",
	[
		function()
		{
			// Get HTML-elements on the page.
			button = document.getElementById("myButton");
			result = document.getElementById("buttonStatus");
			
			// Verify that elements were found.
			assertNotNull(button, "button not found");
			assertNotNull(result, "result element not found");
			
			// Trigger click event.
			button.click();
			
			// Verify that content in result element is as expected.
			if (result.innerHTML != "Clicked.")
			{
				// Throwing an error will make the test fail.
				throw "Button wasn't clicked.";
			}
		}
	]));
	
	// This test will change the page, and verify it by getting a element
	// unique to the new page.
	simpleTests.addTest(new TestCase("Change page", "index.html",
	[
		function(testRunner)
		{
			// Set new URL. When scripts are done, the browser will detect that
			// the URL was changed and load the new page.
			//window.location.href = "page2.html";
			testRunner.loadPage("page2.html");
			
			// Abort script. If not aborted it will immediately continue before
			// the page is changed.
			return false;			
		},
		function()
		{
			// This is phase 2. Test Runner will resume in this phase when the
			// page in previous phase was changed.

			// Get a element thats unique to page 2.
			var element = document.getElementById("page2");
			
			assertNotNull(element, "element 'page2' not found");
		}
	]));
	
	simpleTests.addTest(new TestCase("Submit test", "index.html",
	[
		function()
		{
			var myForm = document.getElementsByTagName("form")[0]; 
			myForm.submit();
			
			// Page is changing. Abort test runner.
			return false;
		},
		function()
		{
			// This is phase 2. Test Runner will resume in this phase when the
			// page in previous phase was changed.

			// Get a element thats unique to page 2.
			var element = document.getElementById("page2");
			
			assertNotNull(element, "element 'page2' not found");
		}
	]));
	
	// This test will make the phone vibrate. We can only assume it worked if
	// there were no errors. The user would need to verify if the phone
	// actually vibrated.
	phoneGapTests.addTest(new TestCase("Vibrate", "index.html", 
	[
 		function()
 		{
 			// Wrapper in app.js.
 			vibrate(150);
 		}
 	]));
	
	// Same as the vibrate test, but beeps twice instead.
	phoneGapTests.addTest(new TestCase("Beep twice", "index.html", 
	[
 		function()
 		{
 			// Wrapper in app.js.
 			beep(2);
 		}
 	]));
	
	phoneGapTests.addTest(new TestCase("find contact", "index.html",
	[
		function(testRunner)
		{
			var txtContact = document.getElementById("txtContact");
			var btnAddContact = document.getElementById("btnAddContact");
			assertNotNull(btnAddContact, "Couldn't find btnAddContact.");
			assertNotNull(txtContact, "Couldn't find txtContact.");
			
			txtContact.value = "Test Contact";
			btnAddContact.click();
			
			// Prepare callback wrappers.
			var onSuccess = testRunner.createCallback(function(contacts)
			{
				assertArrayNotEmpty(contacts, "Contact doesn't exist.");
			});
			var onError = testRunner.createErrorCallback("Contact doesn't exist.");
			
			// Query contact.
			contactExist(txtContact.value, onSuccess, onError);
			
			// Wait for callbacks.
			return false;
		}
	]));
	
	testSuite = new TestSuite("All tests", [simpleTests, phoneGapTests], beforeTest, afterTest);
}

// Called before every test.
function beforeTest()
{
	console.log("'beforeTest' executed");
}

// Called after every test.
function afterTest()
{
	console.log("'afterTest' executed");
}


// ---- Init ----

var deviceReadyFired = false;

// Whether we're displaying the results this time.
var displayResults = false;

/**
 * Initialize tests and Test Runner.
 * 
 * @param results	Whether results should be displayed (boolean). This
 * 					parameter is only used by the result page. Regular
 * 					pages don't need to pass this parameter.
 */
function init(results)
{
	displayResults = results;
	
	buildTests();
	prepareRunner();
	
	if (isPhoneGapReady())
	{
		run();
	}
	else
	{
		// Wait for PhoneGap to load.
		document.addEventListener("deviceready", onDeviceReady, false);
		
		// If the deviceready event isn't fired after a certain time, force init.
		setTimeout("eventFallback()", 500);
	}
}

function isPhoneGapReady()
{
	// Sometimes the deviceready event is fired too fast, before the script adds the event
	// listener. By checking existence of window.device we know if it's already fired.
	return typeof window.device !== "undefined";
}

function onDeviceReady()
{
	console.log("Event: deviceready");
	if (!deviceReadyFired)
	{
		deviceReadyFired = true;
		run();
	}
}

function eventFallback()
{
	if (!deviceReadyFired)
	{
		console.log("Timed out while waiting for deviceready event. Resuming...");
		
		// Mark as fired to prevent double call to run method if event is delayed.
		deviceReadyFired = true;
		
		run();
	}
}

function run()
{
    // Display results if testing is done.
	if (displayResults)
	{
		testRunner.buildResults();
	}
	else
	{
		// Use run to always start testing when the page is loaded.
		// Use runIfActive to only start if a test session is already running.
		
		//testRunner.run();			    // Automatic.
		testRunner.runIfActive();	    // Manual start (with start button).
	}
}

function prepareRunner()
{
	testRunner = new TestRunner(testSuite, "test_results.html");
	console.log("TestRunner ready on page " + window.location.href);
}
