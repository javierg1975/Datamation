function createRequestObject() {
	var req;

	if(window.XMLHttpRequest){
		// Firefox, Safari, Opera...
		req = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		// Internet Explorer 5+
		req = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		// There is an error creating the object,
		// just as an old browser is being used.
		alert('Problem creating the XMLHttpRequest object');
	}
	return req;

}

// Make the XMLHttpRequest object
var http = createRequestObject();

function sendRequest(webpage) {
	// Open PHP script for requests
	http.open('post', webpage);
	http.onreadystatechange = handleResponse;
	
	http.send(null);
}

function handleResponse() {
	if(http.readyState == 4 && http.status == 200){

		// Text returned FROM the PHP script
		var response = http.responseText;

		if(response) {
			// UPDATE ajaxTest content
			//alert(response);
			document.getElementById("content").innerHTML = response;
		}
	}
}