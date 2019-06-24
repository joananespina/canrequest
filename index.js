const MethodValuePost = 'POST';
const MethodValueGet = 'GET';
const MethodValuePut = 'PUT';
const MethodValueDelete = 'DELETE';

/*
// not yet implementated
const TypeString = 'STRING';
const TypeInteger = 'INTEGER';
const TypeBoolean = 'BOOLEAN';
const IsOptional = 'OPTIONAL';
const IsRequired = 'REQUIRED';
*/

const createConfig = function(options) {
  /*
    const requestConfig = canrequest.createConfig({
      scope: {
        url: '/hello',
        method: [
          MethodValuePost,
          MethodValueGet,
          MethodValuePut,
          MethodValueDelete
        ]
      },
      require: {
        headers: [
          String
        ],
        query: [
          String
        ],
        body: [
          String
        ],
      },
      onError: (error, next)=>{

        console.log("CANT REQUEST", error);

        next(new Error("canrequest_error_found"));

      }
    });
  */

  if (options.scope !== undefined
  && options.scope.method !== undefined
  && Array.isArray(options.scope.method) === false) {
    throw new Error('invalid_config_scope_method_value:' + (typeof options.scope.method));
  }

  if (options.onError === undefined) {
    throw new Error('Missing required property "onError" in canrequest.createConfig().');
  }

  if (typeof options.onError !== 'function') {
    throw new Error('Invalid config.onError must be a function');
  }

  if (options.require !== undefined) {
    for (const x of ['headers', 'body', 'query', 'method']) {
      if (options.require[x] !== undefined
      && Array.isArray(options.require[x]) === false) {
        // error there is an option set and it does not have an array as a value
        throw new Error('invalid_config_require_value:'+ x);
      }
    }
  }

  options._isValidConfig = true;

  return options;
};

const check = function(config) {
  return function(req, res, next) {
    const error = [];

    if (config === undefined
    || config._isValidConfig === undefined) {
      error.push('invalid_config');
    } else {
      // const {config.scope.url, config.scope.method} = config.scope;

      const requestUrl = req.url.split('?')[0];
      const requestMethod = req.method;

      let shouldCheck = true;

      if (config.scope.url !== undefined) {
        if (config.scope.url !== requestUrl) {
          shouldCheck = false;
        }
      }

      if (config.scope.method !== undefined) {
        if (config.scope.method.includes(requestMethod) === false) {
          shouldCheck = false;
        }
      }

      if (shouldCheck === false) {
        // does not match scope
        next();
        return false;
      }

      // const {config.require.headers, config.require.query, config.require.body} = config.require;
      // const {requestHeaders, requestQuery, requestBody} = req;
      const requestHeaders = req.headers;
      const requestQuery = req.query;
      const requestBody = req.body;

      if (config.require.headers !== undefined) {
        // request has header requirements
        if (requestHeaders === undefined) {
          error.push('missing_request_header');
        } else {
          // check config headers
          for (const x of config.require.headers) {
            if (requestHeaders[x] === undefined) {
              const headerError = 'missing_header:' + x;
              error.push(headerError);
            }
          }
        }
      }

      if (config.require.query !== undefined) {
        // request has query requirements
        if (requestQuery === undefined) {
          error.push('missing_request_query');
        } else {
          // check config body
          for (const x of config.require.query) {
            if (requestQuery[x] === undefined) {
              const queryError = 'missing_query:' + x;
              error.push(queryError);
            }
          }
        }
      }

      if (config.require.body !== undefined) {
        // request has body requirements
        if (requestBody === undefined) {
          error.push('missing_request_body');
        } else {
          // check config body
          for (const x of config.require.body) {
            if (requestBody[x] === undefined) {
              const bodyError = 'missing_body:' + x;
              error.push(bodyError);
            }
          }
        }
      }
    }

    if (error.length > 0) {
      if (error.includes('invalid_config') === true) {
        throw new Error('Invalid canrequest config object. Use canrequest.createConfig() to create valid canrequest config object.');
      }

      if (error.includes('missing_on_error_handler') === true) {
        throw new Error('Missing canrequest config.onError handler. Assign onError property during createConfig - canrequest.createConfig({onError: (error, next)=>{}})');
      }

      if (config.onError !== undefined
      && typeof config.onError === 'function') {
        config.onError(error, next);
        // return here. onError will handle next()
        return false;
      }
    }

    if (next) {
      next();
    }

    return false;
  };
};

/*
  TypeString,
  TypeInteger,
  TypeBoolean,
  IsOptional,
  IsRequired,
*/

module.exports = {
  MethodValuePost,
  MethodValueGet,
  MethodValuePut,
  MethodValueDelete,
  check,
  createConfig
};
