"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobSearchSchema = require("../schemas/jobSearch.json");

const router = express.Router({ mergeParams: true });


/** POST / { job } => { job }
 *
 * Creates a new job posting.
 *
 * Returns the newly created job.
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const newJob = await Job.create(req.body);
    return res.status(201).json({ job: newJob });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Retrieves a list of all jobs.
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const query = req.query;
  // Convert query parameters to appropriate types
  if (query.minSalary !== undefined) query.minSalary = +query.minSalary;
  query.hasEquity = query.hasEquity === "true";

  try {
    const validator = jsonschema.validate(query, jobSearchSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const jobs = await Job.findAll(query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /[jobId] => { job }
 *
 * Retrieves details of a specific job by its ID.
 *
 * Returns the job details.
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[jobId]  { fld1, fld2, ... } => { job }
 *
 * Updates details of a specific job by its ID.
 *
 * Data can include: { title, salary, equity }
 *
 * Returns the updated job details.
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const updatedJob = await Job.update(req.params.id, req.body);
    return res.json({ job: updatedJob });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Deletes a job by its ID.
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
