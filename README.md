
# Canrequest

**Canrequest** is an express middleware that helps to check required request information *(headers, query, and body)*.

**Warning!** Package still in early development stages.

## Installation

Install canrequest using [npm](https://www.npmjs.com/package/canrequest): `npm install canrequest`

## Usage

First import required packages

```
// Well this is an Express Middleware
const express = require('express');

// You will need Express Middleware `body-parser`
// to handle `HTTP POST` request in Express.js version 4 and above
var bodyParser = require('body-parser');

// require canrequest
const canrequest = require("canrequest");
const { MethodValuePost } = canrequest;
```

Create express instance and use bodyParser as express middleware.

```
const app = express();
// Use body-parser before canrequest
app.use(bodyParser.json());
```

Create a `requestConfig` so that canrequest will understand what to require in a request
```
const requestConfig = canrequest.createConfig({
  scope: {
    url: '/hello', 
    method: [
      MethodValuePost,
    ]
  },
  require: {
    headers: [
	  'foo',
	  'bar'
    ],
    query: [
      'foo',
      'bar',
      'baz'
    ],
    body: [
      'foo',
      'bar'
    ],
  },
  onError: (error, next)=>{
	// some requirements not found, you can check it if you want
	console.log("We found some errors:",error);
	
	// do something else	
	
	// IMPORTANT
	// when your done call next()
    return next(new Error("canrequest_error_found"));

  }
});

```
Set the canrequest middleware with your `requestConfig`
```
app.use(canrequest.check(requestConfig));
```
And that's it!

*Full example coming soon*

## License

Code released under the [MIT License](https://github.com/joananespina/randominator/blob/master/LICENSE).