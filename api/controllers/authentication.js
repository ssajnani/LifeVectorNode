'use strict';

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function login(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var username = req.swagger.params.username.value || null;
  var password = req.swagger.params.username.value || null;

  // this sends back a JSON response which is a single string
  res.json(hello);
}
