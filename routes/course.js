const express = require("express");
// chalk
const { error, log, info, good } = require("../utils/chalk");
const {
  save,
  fetch,
  fetchAll,
  deleteCourse,
} = require("../utils/course/functions");

const router = express.Router();

// auth
const { verifyBearer } = require("../utils/secure");

// pages
const { notFound } = require("../utils/pages");

const load = require("../utils/loading");

router.post("/save", async (req, res) => {
  if (req.headers.authorization) {
    if (req.headers.authorization.indexOf("Bearer ") === 0) {
      const verified = verifyBearer(req.headers.authorization);
      if (verified) {
        log(info("Saving course"));
        load.start();
        try {
          const {
            id,
            title,
            url,
            price,
            shortDescription,
            description,
            photo,
          } = req.body;
          const result = await save(
            id,
            title,
            url,
            price,
            shortDescription,
            description,
            photo
          );
          load.stop();
          if (result.status === 200) {
            log(good(`${title} saved successful`));
            res.send(result);
          } else if (result.status === 422) {
            log(error(`${title} ${result.data.error}`));
            res.send(result);
          } else {
            log(error(result.error));
            res.send({ error: result.error });
          }
          return;
        } catch (err) {
          load.stop();
          log(error(err));
          res.sendStatus(500);
          return;
        }
      }
    }
  }
  res.send(notFound(req.baseUrl, "POST")).status(404);
});

router.post("/delete", async (req, res) => {
  if (req.headers.authorization) {
    if (req.headers.authorization.indexOf("Bearer ") === 0) {
      const verified = verifyBearer(req.headers.authorization);
      if (verified) {
        log(info("Deleting course"));
        load.start();
        try {
          const { id } = req.body;
          const result = await deleteCourse(id);
          load.stop();
          if (result.status === 200) {
            log(good(`${id} deleted successful`));
            res.send(result);
          } else if (result.status === 422) {
            log(error(`${id} ${result.data.error}`));
            res.send(result);
          } else {
            log(error(result.error));
            res.send({ error: result.error });
          }
          return;
        } catch (err) {
          load.stop();
          log(error(err));
          res.sendStatus(500);
          return;
        }
      }
    }
  }
  res.send(notFound(req.baseUrl, "POST")).status(404);
});

router.get("/fetch", async (req, res) => {
  log(info("Fetching course"));
  load.start();
  try {
    const { id } = req.query;
    const result = await fetch(id);
    load.stop();
    if (result.status === 200) {
      log(good(`${id} fetched successful`));
      res.send(result);
    } else if (result.status === 422) {
      log(error(`${id} ${result.data.error}`));
      res.send(result);
    } else {
      log(error(result.error));
      res.send({ error: result.error });
    }
  } catch (err) {
    load.stop();
    log(error(err));
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  log(info("Fetching all courses"));
  load.start();
  try {
    const result = await fetchAll();
    load.stop();
    if (result.error == undefined) {
      log(good(`all courses fetched successful`));
      res.send(result);
    } else {
      log(error(result.error));
      res.send({ error: result.error });
    }
  } catch (err) {
    load.stop();
    log(error(err));
    res.sendStatus(500);
  }
});

module.exports = router;
