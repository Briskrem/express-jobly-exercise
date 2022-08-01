"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin, adminOrLoggedIn} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: login
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  
  
  try {
    const users = await User.findAll();
    // console.log(res.locals, 'get all')
    // console.log(res.locals.user.isAdmin, 'ADMIN'.yellow)
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *
 * Authorization required: login
 **/

router.get("/:username", adminOrLoggedIn, async function (req, res, next) {
  try {
    console.log('before get req')
    const user = await User.get(req.params.username);
    console.log('/////////////////////////////////////////////////////////////////')
    console.log(user)
    console.log(user.applications.jobIds)
    return res.json({ user });
    
  } catch (err) {
    console.log('logged NOT')
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login
 **/

router.patch("/:username", adminOrLoggedIn, async function (req, res, next) {
  console.log('patchhy')
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login
 **/

router.delete("/:username", adminOrLoggedIn, async function (req, res, next) {
  try {
    console.log('yakaka1')
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


router.post("/:username/jobs/:id", ensureLoggedIn, async (req,res,next)=>{
  console.log('///////////////////////////////////////////////////////////////////')
    try{
      console.log(req.params.username)
      const result = await User.apply(req.params.username, req.params.id)
      console.log(result, 'result inside route'.green)
      return res.json({applied: result[0].job_id})
    }catch(err){
      console.log(err)
      return next(err)
    }
})

module.exports = router;
