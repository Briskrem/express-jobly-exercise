const request = require('supertest')
const app = require('../app')
const {commonBeforeAll, commonAfterAll, commonAfterEach, u1Token, adminToken} = require('./_testCommon')

beforeAll(commonBeforeAll)
afterAll(commonAfterAll);

describe('GET /jobs', function(){
    test('test route works', async function(){

        let response = await request(app).get('/jobs')
        console.log(response.body, 'response.body'.red)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            jobs:[{
                title: "DR OC", 
                salary: 55, 
                equity: '0',
                company_handle: "c2" 
            },
               { title: "max", 
                salary: 550, 
                equity: '0.5',
                company_handle: "c1" 
         }]
        })
    })
    


        test('testing GET /jobs filters', async function(){
            let response = await request(app).get('/jobs').query({title: "DR OC", minSalary: 100 })
        // console.log(response)
            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual({
                jobs:[{
                    title: "DR OC", 
                    salary: 55, 
                    equity: '0',
                    company_handle: "c2" 
                }]
            })
        })
        
        
})

describe('POST /jobs', ()=>{

    // test('test post route', async ()=>{
    //     const response = await request(app).post('/jobs').send({ 
    //         "job": { 
    //             "title": "oo", 
    //             "salary": 1000, 
    //             "equity": 0,
    //             "company_handle": "c1" }
    //     }).set('Authorization', `bearer ${adminToken}`)
    //     // console.log(response)
    //     expect(response.body).toEqual({ 
            
    //             "created": {
    //                 "title": "oo"
    //             }
            
    //     })
    // })

    test('test if unauthorized user unable to add job', async ()=>{
        const response = await request(app).post('/jobs').send({ 
            "job": { 
                "title": "oo", 
                "salary": 1000, 
                "equity": 0,
                "company_handle": "c1" }
        }).set("authorization", `Bearer ${u1Token}`);
        console.log(response.body)
        expect(response.statusCode).toEqual(401)

    })

    test('testing POST /jobs schema validation', async function(){

        const response = await request(app).post('/jobs').send({ 
                        "job": { 
                            "title": "oo", 
                            "salary": 1000, 
                            "equity": 0,
                            "company_handle": 0 }
                    }).set("authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toEqual(400)

    })




})

describe('PATCH  /jobs', function(){
    test('testing PATCH /jobs/:title authorized', async function(){
        const response = await request(app).patch(`/jobs/max`).send({
            job:{
                title: "tax", 
                salary: 777, 
                equity: 0,
                company_handle: "c1"
            }
        }).set("authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            updated:[{
                title: "tax", 
                salary: 777, 
                equity: '0',
                company_handle: "c1"
            }]
        })
    })
})
