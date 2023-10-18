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
var router = express.Router();
const { LookerNodeSDK } = require("@looker/sdk-node");
const sdk = LookerNodeSDK.init40();
const fetch = require("node-fetch");

/**
 * Setting up Admin API for Firebase
 */

// const { initializeApp } = require('firebase-admin/app');
// //Define path to secret key generated for service account
// const serviceAccount = require(PATH TO KEY);
// //Initialize the app
// const app = initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

/***********************************************
 * Middleware For Checking User Session cookie *
 ***********************************************/
const requireSessionCookie = (request, response, next) => {
  if (!request.cookies && !request.cookies.embedSession) {
    response.status(404).send({ redirect: "/login" });
  } else {
    next();
  }
};

/*****************************************
 * Authentication                        *
 *****************************************/

router.get("/auth", async (req, res) => {
  let options = {
    maxAge: 3600000, // expires in an hour
    httpOnly: true, // The cookie only accessible by the web server
    signed: false, // Indicates if the cookie should be signed
  };

  const src = req.query.src;
  const fullEmbedUrl = "https://" + process.env.LOOKERSDK_EMBED_HOST + src;
  const user = {
    ...config.authenticatedUser[req.headers.usertoken],
    external_user_id: req.headers.userid,
  };

  try {
    const { url } = await sdk.ok(
      sdk.create_sso_embed_url({ target_url: fullEmbedUrl, ...user }),
    );
    // Set cookie
    res.cookie(
      "embedSession",
      { setTime: Date.now(), validFor: 3600000, userID: req.headers.userid },
      options,
    );

    res.json({ url });
  } catch (e) {
    console.log(e);
  }
});

// Route for getting all the cookies
router.get("/getcookie", function (req, res) {
  res.json(req.cookies);
});

/**
 * Create an API auth token based on the provided embed user credentials
 */
router.get("/embed-user/token", requireSessionCookie, async (req, res) => {
  const userCred = await sdk.ok(
    sdk.user_for_credential("embed", req.cookies.embedSession.userID),
  );
  const embed_user_token = await sdk.login_user(userCred.id.toString());
  const u = {
    user_token: embed_user_token.value,
    token_last_refreshed: Date.now(),
  };
  res.json({ ...u });
});

/**
 * Update the embed users permissions
 */

router.post("/permissions", requireSessionCookie, async (req, res) => {
  const { permissions, userAttributes } = req.body;
  let user = config.authenticatedUser["user1"];

  const userObject = {
    ...user,
    external_user_id: req.cookies.embedSession.userID,
  };

  userObject["user_attributes"] = userAttributes;
  userObject["permissions"] = !permissions.pdf
    ? [...userObject["permissions"]]
    : [...userObject["permissions"], permissions.pdf];

  const { url } = await sdk.ok(
    sdk.create_sso_embed_url({
      target_url: `https://${process.env.LOOKERSDK_EMBED_HOST}/embed/dashboards/1`,
      ...userObject,
    }),
  );
  await fetch(url);
  res.status(200).send({ message: "Updated Permissions" });
});

module.exports = router;
