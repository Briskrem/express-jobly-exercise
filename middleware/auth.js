"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  console.log('authenticateJWT working')
  // console.log(req.session, 'accessToken'.yellow)
  try {
    //WHY &&
    console.log(req.headers)
    console.log(req.headers.authorization)
    const authHeader = req.headers && req.headers.authorization;
  
    
    if (authHeader) {
      //it removes bearer from authHeader  which would interfere in the jwt verification process
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      let payload = jwt.verify(token, SECRET_KEY);
   
      res.locals.user = payload
      res.locals.MAKAMAKA = {car: "benz"}
    }
   
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureAdmin(req,res, next){
  console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
  console.log(res.locals, 'ensureADmin locals'.red)
  // console.log(res.matman)
  // console.log(res)
  
  if(Object.keys(res.locals).length === 0) {
    console.log(res.locals,'fat gyul')
  }

  try{
    // if(!(res.locals.user.isAdmin && res.locals))
    if(!(res.locals.user.isAdmin))
      throw new UnauthorizedError();
      return next()
    }catch(err){
      return next(err)
    }
  
}

function ensureLoggedIn(req, res, next) {
  
  console.log('7777777777777777777777777777777777777777777777777777777'.red)
  //this works on srver but not testing
  console.log(res.locals.user, 'local'.blue)
  try {
    if (!res.locals.user) 
    throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


function adminOrLoggedIn(req, res, next){
  console.log(res.locals)
  try {
    console.log('zababa1')
    
    if(!res.locals.user){
      throw new UnauthorizedError();
    }
    if(!(res.locals.user.username == req.params.username || res.locals.user.isAdmin)){
      console.log('zababa2')
      throw new UnauthorizedError();
    }
    // const user = res.locals.user;
    // if (!(user && (user.isAdmin || user.username === req.params.username))) {
    //   throw new UnauthorizedError();
    // }
    console.log('zababa3')
    return next()
  }catch(err){
    console.log('chikis')
    console.log(err)
    return next(err)
  }
  
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  adminOrLoggedIn
};
