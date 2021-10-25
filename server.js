// server.js
let FileStreamRotator = require("file-stream-rotator");
const express = require("express");
const next = require("next");
const fs = require("fs");
const url = require("url");
var morgan = require("morgan");
var path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require("http");
const https = require("https");

const { PrismaClient, PrismaErrors } = require("@prisma/client");
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

const dayjs = require("dayjs");

var options = {
  key: fs.readFileSync("./ssl/lieyu.fantasyball.tw.key"),
  cert: fs.readFileSync("./ssl/AAACertificateServices.crt"),
};

app.prepare().then(() => {
  const app = express();

  var logDirectory = path.join(__dirname, "log");

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream
  var accessLogStream = FileStreamRotator.getStream({
    date_format: "YYYYMMDD",
    filename: path.join(logDirectory, "access-%DATE%.log"),
    frequency: "daily",
    verbose: false,
  });

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));

  app.all("*", async (req, res) => {
    const reqUrl = url.parse(req.url);
    const urlPath = reqUrl.pathname;
    if (urlPath === "/" || urlPath === "/index") {
      // 寫入登入人數
      try {
        const today = dayjs().format('YYYYMMDD');
        const count = await prisma.pv.upsert({
          where: {
            id: today
          },
          update: {
            number: {
              increment: 1
            }
          },
          create: {
            id: today,
            number: 1,
          }
        });
      } catch (err) {
        console.log(err);
      }

    //   console.log("pathName: " + urlPath);
    }

    return handle(req, res);
  });

  var httpsServer = https.createServer(options, app);

  httpsServer.listen(443, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${443}`);
  });
});
