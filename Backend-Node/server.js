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
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");

var app = express();

app.use(cors());
// app.use(
//   cors({
//     credentials: true,
//     origin:
//       // "http://localhost:5173",
//       "https://w252qq-5173.csb.app",
//     // process.env.NODE_ENV === "production"
//     //   ? process.env.CLIENT_URL
//     //   : "http://localhost:3000",
//   }),
// );
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const jsonErrorHandler = (err, req, res, next) => {
    res.status(err.status).send({
      status: err.status,
      message: err.message,
    });
    return next();
  };
app.use(jsonErrorHandler);
// app.use("/", indexRouter);
app.use("/api", apiRouter);

module.exports = app;
