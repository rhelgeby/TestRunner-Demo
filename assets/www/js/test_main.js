/**
 * This function should be called when the page is loaded (onload event). 
 */
function initTesting(alwaysStart)
{
	if (typeof alwaysStart == 'undefined')
	{
		alwaysStart = true;
	}
	
	// (global var)
	testRunnerStarter = new TestRunnerStarter(
			buildTests(),	// testSuite
			alwaysStart,	// alwaysStart
			false,			// showResults
			150);			// eventFallbackDelay
			//10000);		// callbackTimeout (optional, defaults to 10 seconds.)
}

/**
 * This function is only used by the test result page.
 */
function initTestResults()
{
	// TODO: Make this part independent of Test Runner so it doesn't have to
	//		 build tests that are never used.
	
	// (global var)
	testRunnerStarter = new TestRunnerStarter(
			buildTests(),	// testSuite
			false,			// alwaysStart
			true,			// showResults
			150);			// eventFallbackDelay
			//10000);		// callbackTimeout (optional, defaults to 10 seconds.)
}

/**
 * Called when tests should be built.
 * 
 * @returns		Test suite to use.
 */
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
			assertNotNull(button, "Button not found.");
			assertNotNull(result, "Result element not found.");
			
			// Trigger click event.
			button.click();
			
			// Verify content in result element.
			assertEquals(result.innerHTML, "Clicked.", "Button wasn't clicked.");
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
	
	// This test will use a timer to demonstrate use of callbacks in tests.
	simpleTests.addTest(new TestCase("Callback example", "index.html",
	[
		function(testRunner)
		{
			// Create a callback wrapper. Note that this is a global variable
			// because the expression in setTimeout is evaluated at the global
			// context.
			callbackTest = testRunner.createCallback(function(msg)
			{
				console.log("Message in callback: " + msg);
			});
			
			console.log("Callback will be called in 2 seconds...");
			
			// Call the callback in two seconds. Note the use of quotes.
			setTimeout("callbackTest('test');", 2000);
			
			// If not passing any parameters in the callback, it's also
			// possible to use the function variable directly, instead of an
			// expression. In this case the msg parameter will be undefined. 
			//setTimeout(callbackTest, 2000);
			
			return false;
		},
		function(testRunner)
		{
			console.log("After callback.");
		}
	]));
	
	// TODO: Apparently the page isn't changed properly with submit.
	/*
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
	]));*/
	
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
	
	phoneGapTests.addTest(new TestCase("Find contact", "index.html",
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
	
	return new TestSuite("All tests", [simpleTests, phoneGapTests], beforeTest, afterTest);
	//return new TestSuite("All tests", [simpleTests], beforeTest, afterTest);
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
