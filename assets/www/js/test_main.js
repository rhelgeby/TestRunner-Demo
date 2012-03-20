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
			assertNotUndefined(button, "button not found");
			assertNotUndefined(result, "result element not found");
			
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
		function()
		{
			// Set new URL. When scripts are done, the browser will detect that
			// the URL was changed and load the new page.
			window.location.href = "page2.html";
			
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
			
			assertNotUndefined(element, "element 'page2' not found");
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

// Hook deviceready event in PhoneGap. Native features in PhoneGap cannot be
// used before this event is fired.
document.addEventListener("deviceready", onDeviceReady, true);
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
	
	// If the deviceready event isn't fired after a certain time, force init.
	// We don't know why it isn't always fired, but PhoneGap works after a
	// certain time. You may experiment with this value. 150ms is safe, but
	// shorter delays may work fine too.
	// Note: This delay is added between _each_ test. It could also be used to
	//       slow down testing speed.
	setTimeout("eventFallback()", 250);
}

function onDeviceReady()
{
	if (!deviceReadyFired)
	{
		deviceReadyFired = true;
		console.log("DeviceReady fired...");
		run();
	}
}

function eventFallback()
{
	if (!deviceReadyFired)
	{
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
		
		testRunner.run();			    // Automatic.
		//testRunner.runIfActive();	    // Manual start.
	}
}

function prepareRunner()
{
	testRunner = new TestRunner(testSuite, "test_results.html");
	console.log("TestRunner ready on page " + window.location.href);
}
