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
const { initializeApp, cert } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

/**
 * Setting up Admin API for Firebase
 */

//Define path to secret key generated for service account
// const serviceAccount = require("../firebase-admin.json");
//Initialize the app
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // replace `\` and `n` character pairs w/ single `\n` character
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

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

/***********************************
 * Application User Authentication *
 **********************************/

router.post("/check-user", async (req, res) => {
  if (req.body.user) {
    const { uid, email, displayName } = req.body.user;
    // Construct user object to be sent to Firestore db, which includes:
    // there unique id, app user information, and Looker user information
    const userTenantPermissions = {
      id: uid,
      appUser: {
        ...{ uid, email, displayName, createdAt: Timestamp.now() },
      },
      lookerUser: {
        ...config.authenticatedUser["advancedUser"],
        external_user_id: email,
      },
    };

    // add user to firestore db
    // with a simple example of incrementing session count for the user
    const userRef = db.collection("users").doc(uid);
    const userRecord = await userRef.get();
    console.log("User Record: ", userRecord);
    if (userRecord.exists) {
      await userRef.update({
        visits: FieldValue.increment(1),
        vistDates: FieldValue.arrayUnion(Timestamp.now()),
      });
      res.status(200).send({ status: "success", user: userTenantPermissions });
    } else {
      Promise.all([
        await userRef.set(userTenantPermissions),
        await userRef.update({
          visits: 1,
          vistDates: [Timestamp.now()],
        }),
      ]);
      res.status(200).send({ status: "success", user: userTenantPermissions });
    }
  }
  // res.status(400).send({ status: "bad request" });
});

/*****************************************
 * Looker Authentication                 *
 *****************************************/

router.get("/auth", async (req, res) => {
  let options = {
    maxAge: 3600000, // expires in an hour
    httpOnly: true, // The cookie only accessible by the web server
    signed: false, // Indicates if the cookie should be signed
  };

  const src = req.query.src;
  const fullEmbedUrl = "https://" + process.env.LOOKERSDK_EMBED_HOST + src;
  // check db for user & their config
  const userRef = db
    .collection("users")
    .doc(JSON.parse(req.headers.userid).uid);
  const userData = await userRef.get();
  const user = {
    ...userData.data().lookerUser,
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

    res.status(200).json({ url });
  } catch (e) {
    console.log(e);
  }
});

// Route for getting all the cookies
router.get("/getcookie", function (req, res) {
  console.log("Cookies: ", req.cookies);
  res.json(req.cookies);
});

/**
 * Create an API auth token based on the provided embed user credentials
 */
router.get("/embed-user/token", requireSessionCookie, async (req, res) => {
  console.log(req.cookies);
  const userCred = await sdk.ok(
    sdk.user_for_credential(
      "embed",
      JSON.parse(req.cookies.embedSession.userID).email,
    ),
  );
  const embed_user_token = await sdk.login_user(userCred.id.toString());
  const u = {
    user_token: embed_user_token.value,
    token_last_refreshed: Date.now(),
  };
  res.status(200).json({ ...u });
});

/**
 * Update the embed users permissions
 */

router.post("/permissions", requireSessionCookie, async (req, res) => {
  const { permissions, userAttributes } = req.body;
  const userRef = db
    .collection("users")
    .doc(JSON.parse(req.cookies.embedSession.userID).uid);
  // const userRecord = await userRef.get();
  await userRef.update({
    "lookerUser.user_attributes": userAttributes,
  });
  await userRef.update({
    "lookerUser.permissions":
      permissions.userType === "basic"
        ? FieldValue.arrayRemove(
            "save_content",
            "explore",
            "embed_browse_spaces",
          )
        : FieldValue.arrayUnion(
            "save_content",
            "explore",
            "embed_browse_spaces",
          ),
  });
  const userData = await userRef.get();
  console.log("User data: ", userData.data());

  const { url } = await sdk.ok(
    sdk.create_sso_embed_url({
      target_url: `https://${process.env.LOOKERSDK_EMBED_HOST}/embed/dashboards/1`,
      ...userData.data().lookerUser,
    }),
  );
  await fetch(url);
  res.status(200).send({ message: "Updated Permissions" });
});

module.exports = router;
