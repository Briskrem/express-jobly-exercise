const express = require('express')
const router = express.Router()
const Job = require('../models/job')
const {ensureAdmin} = require('../middleware/auth')
const jobPostSchema = require('../schemas/jobPost.json')
const jsonschema = require('jsonschema')
const { BadRequestError } = require("../expressError");
const { adminToken } = require('./_testCommon')


router.get('/', async (req,res,next)=>{
    try{
        // console.log(req.query.title,req.query.minSalary, 'inside rout'.yellow)

        const results = await Job.get(req.query.title, req.query.minSalary,)
        // console.log(results)
        return res.json({jobs:results})
    }catch(err){
        // console.log(err)
        return next(err)
    }
})

router.post('/', ensureAdmin,  async (req,res,next)=>{
    console.log('inside jobs/post')
    try{
        const validator = jsonschema.validate(req.body, jobPostSchema);
        if (!validator.valid) {
            // console.log('error is thrown'.yellow)
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        
        let newPost = req.body.job
        // console.log(newPost, 'newpost'.yellow)
        const results = await Job.create(newPost)
        // console.log(results)
        return res.json({created: results})
    }catch(err){
        console.log(err)
        return next(err)
    }
})

router.patch('/:title', ensureAdmin, async (req,res,next)=>{
    console.log('??????????????????????????????????????????????????????????????????????????')
    console.log(req.body, 'body'.green)
    const job = await Job.update(req.params.title, req.body.job)
    console.log(job, 'updating in routes'.green)
    return res.json({updated:job})
})

module.exports = router