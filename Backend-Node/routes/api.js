// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var express = require("express");
var config = require("../config");
var cookieSession = require('cookie-session')
var router = express.Router();
var cookieParser = require('cookie-parser')
const { LookerNodeSDK } = require("@looker/sdk-node");
const sdk = LookerNodeSDK.init40();
const fetch = require("node-fetch");
var app = express()

app.use(cookieParser())

/*****************************************
 * Authentication                        *
 *****************************************/

/**
 * Create an API auth token based on the provided embed user credentials
 */
router.get("/embed-user/token", async (req, res) => {
  const userCred = await sdk.ok(sdk.user_for_credential("embed", req.query.id));
  const embed_user_token = await sdk.login_user(userCred.id.toString());
  const u = {
    user_token: embed_user_token.value,
    token_last_refreshed: Date.now(),
  };
  res.json({ ...u });
});

/**
 * Create an API Only User that can be used to "sudo" as the embed user. This is for making calls as that embed user either from the backend or from the frontend while logged in as that user
 */
router.post("/api-user/token", async (req, res) => {
  const { id } = await sdk.ok(sdk.create_user({first_name: "API User"}))

  // role id 2 is the admin role, this is needed for sudoing
  await sdk.ok(sdk.set_user_roles(id, [2]))

  // this endpoint will return the client id AND secret
  const credentials = await sdk.ok(sdk.create_user_credentials_api3(id))
  console.log("credentials: ", credentials)
});

/**
 * Update the embed users permissions
 */
router.post("/embed-user/:id/update", async (req, res) => {
  const userCred = await sdk.ok(
    sdk.user_for_credential("embed", req.params.id)
  );
  const attrs = {
    value: "Jeans",
  };
  await sdk.set_user_attribute_user_value(userCred.id, 23, attrs);
  res.json({ status: "updated" });
});

/**
 * Update the embed users permissions
 */

router.post("/permissions", async (req, res) => {
  const { permissions, userAttributes } = req.body;
  let user = config.authenticatedUser['user1'];

  const userObject = { ...user }

  console.log("Request: ", permissions, userObject)

  userObject["user_attributes"] = userAttributes;
  userObject["permissions"] = !permissions.pdf ? [...userObject["permissions"]] : [...userObject["permissions"], permissions.pdf]

  
 
  const { url } = await sdk.ok(sdk.create_sso_embed_url({target_url: `https://${process.env.LOOKERSDK_EMBED_HOST}/embed/dashboards/1`,...userObject}))
  await fetch(url)
  res.status(200).send({ message: "Updated Permissions" });

})

router.get("/auth", async (req, res) => {
  let options = {
    maxAge: 3600000, // expires in an hour
    httpOnly: true, // The cookie only accessible by the web server
    signed: false // Indicates if the cookie should be signed
  }

  // Set cookie
  res.cookie('embedSession', {'setTime': Date.now(),'validFor': 3600000}, options) // options is optional
  console.log("auth endpoint hit")
  const src = req.query.src;
  console.log(src)
  const fullEmbedUrl = 'https://' + process.env.LOOKERSDK_EMBED_HOST + src;
  const user = config.authenticatedUser[req.headers.usertoken];
  
  try {
    const { url } = await sdk.ok(sdk.create_sso_embed_url({target_url: fullEmbedUrl,...user}))
    res.json({url});
  } catch (e) {
    console.log(e)
  }
  // console.log("url: ", url);
  //createSignedUrl(src, user, host, secret);
});

// Route for getting all the cookies
router.get('/getcookie', function (req, res) {
  console.log(req.cookies)
  res.json(req.cookies);
})

/**
 * Endpoint for signing an embed URL. Embed SSO parameters can be passed in as
 * part of the body
 */
// router.post("/sso-url", async (req, res) => {
//   const body = req.body;
//   const targetUrl = body.target_url;
//   const response = {
//     url: await sdk.ok(sdk.create_sso_embed_url(sdk, body))
//     //createSignedUrl(targetUrl, body, host, secret),
//   };
//   res.setHeader("Content-Type", "application/json");
//   res.status(200).send(response);
// });

/****************************************
 * Backend Data API calls               *
 ****************************************/

/**
 * Get details of the current authenticated user
 */
router.get("/me", async (req, res, next) => {
  const me = await sdk.ok(sdk.me()).catch((e) => console.log(e));
  res.send(me);
});

/**
 * Get a list of all looks the authenticated user can access
 */
router.get("/looks", async (req, res, next) => {
  const looks = await sdk
    .ok(sdk.all_looks("id,title,embed_url,query_id"))
    .catch((e) => console.log(e));
  res.send(looks);
});

/**
 * Run the query associated with a look, and return that data as a json response
 */
router.get("/looks/:id", async (req, res, next) => {
  let target_look = req.params.id;
  let query_data = await sdk
    .ok(sdk.look(target_look, "query"))
    .catch((e) => console.log(e));
  delete query_data.query.client_id;

  let newQuery = await sdk
    .ok(sdk.create_query(query_data.query))
    .catch((e) => console.log(e));

  let newQueryResults = await sdk
    .ok(sdk.run_query({ query_id: Number(newQuery.id), result_format: "json" }))
    .catch((e) => {
      console.log(e);
      res.send({ error: e.message });
    });
  res.send(newQueryResults);
});

module.exports = router;
