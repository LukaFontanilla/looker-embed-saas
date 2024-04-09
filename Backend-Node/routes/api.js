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
var url = require('url');
var router = express.Router();
const { LookerNodeSDK } = require("@looker/sdk-node");
const sdk = LookerNodeSDK.init40();
const fetch = require("node-fetch");
const { initializeApp, cert } = require("firebase-admin/app");
const {GoogleAuth} = require('google-auth-library');
const googleAuth = new GoogleAuth();
const { getAuth } = require("firebase-admin/auth");
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
const auth = getAuth();

/***********************************************
 * Middleware For Checking User Session cookie *
 ***********************************************/
const requireSessionCookie = (req, res, next) => {
  console.log(req.cookies)
  const sessionCookie = req.cookies.appUserSession || "";
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      next();
    })
    .catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      res.status(404).send({ redirect: "/login" });
    });
};

/***********************************
 * Application User Authentication *
 **********************************/

router.post("/check-user", async (req, res) => {
  if (req.body.user) {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.user.accessToken.toString();
    // Set session expiration to 1 days.
    const expiresIn = 60 * 60 * 24 * 1 * 1000;
    let sessionCookie;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    auth.verifyIdToken(idToken).then(async (decodedIdToken) => {
      // Only process if the user just signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
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
        try {

          const userRef = db.collection("users").doc(uid);
          const userRecord = await userRef.get();
          if (userRecord.exists) {
            await userRef.update({
              visits: FieldValue.increment(1),
              vistDates: FieldValue.arrayUnion(Timestamp.now()),
            });
          } else {
            Promise.all([
              await userRef.set(userTenantPermissions),
              await userRef.update({
                visits: 1,
                vistDates: [Timestamp.now()],
              }),
            ]);
          }
        } catch (e) {
          console.log("There was an error here: ", e)
        }

        // Create session cookie and set it.
        try {
          console.log("Trying session cookie creation")
          sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
          console.log(sessionCookie)
        } catch (e) {
          console.log("Here")
          res.status(401).send("Invalid ID Token")
        }

        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false,
        }

        res.cookie("appUserSession", sessionCookie, options)

        // return user tenant permissions
        res
        .status(200)
        .send({ status: "success", user: userTenantPermissions });

      } else {
        // A user that was not recently signed in is trying to set a session cookie.
        // To guard against ID token theft, require re-authentication.
        res
          .status(401)
          .send({ status: "false", message: "Recent sign in required!" });
      }
    });
  }
});

router.post('/logout-user', (req, res) => {
  res.clearCookie('session');
  res.status(200).send({ status: "success", message: "Cleared session cookie for user"})
});

/*****************************************
 * Looker Authentication                 *
 *****************************************/

router.get("/auth", requireSessionCookie, async (req, res) => {
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
router.get("/getcookie", (req, res) => {
  if(Object.getPrototypeOf(req.cookies) !== null && 'embedSession' in req.cookies) {
    res.json(req.cookies)
  } else {
    console.log("No embed cookies, authenticating")
    res.json({ embedSession: '' })
  }
});

/**
 * Create an API auth token based on the provided embed user credentials
 */
router.get("/embed-user/token", requireSessionCookie, async (req, res) => {
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

router.get("/nlq", requireSessionCookie, async (req,res) => {
  try {
    const client = await googleAuth.getIdTokenClient('https://explore-assistant-api-embed-labs-idhn2cvrpq-uc.a.run.app');
    await client.idTokenProvider.fetchIdToken('https://explore-assistant-api-embed-labs-idhn2cvrpq-uc.a.run.app');
    const clientHeaders = await client.getRequestHeaders();
    // console.log("Auth: ", clientHeaders['Authorization'])
    // console.log("Headers: ", JSON.stringify(clientHeaders))
    const queryData = url.parse(req.url, true).query
    const data = await fetch('https://explore-assistant-api-embed-labs-idhn2cvrpq-uc.a.run.app/',{
      method:'POST',
      headers: {
        'Authorization': clientHeaders['Authorization'],
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model:'thelook',
        explore: 'order_items',
        question: queryData.question
      })
    })

    console.log(data)
      
    const nlqData = await data.text()
    res.status(200).send(nlqData)
  } catch (e) {
    res.status(404).send("Not Authenticated to call this service")
    throw Error(`There was an error: ${e}`)
  }

})

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
