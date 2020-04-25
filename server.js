const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ["RS256"],
});

const app = express();
app.get("/public", function(req, resp) {
  resp.json({
    message: "This is the public API",
  });
});

function checkRole(role) {
  return function(req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}

app.get("/private", checkJwt, function(req, resp) {
  resp.json({
    message: "This is the private API",
  });
});

app.get("/courses", checkJwt, checkScope(["read:courses"]), function(
  req,
  resp
) {
  // in real life this would read the sub (subscriber ID) from the access token and query the courses list by ID
  resp.json({
    courses: [
      { id: 1, title: "React and redux 1" },
      { id: 2, title: "React and auth 2" },
      { id: 3, title: "Fundamentals 3" },
    ],
  });
});

app.get("/admin", checkJwt, checkRole("admin"), function(req, resp) {
  resp.json({
    message: "This is the admin API",
  });
});

app.listen(3005);

console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
