const db = require('../db')

class Job{

    static async get(title, minSalary){
        console.log(title,minSalary, 'inside Job class'.red)
        try{
            if(title && minSalary){
                console.log('inside &&')
                const result = await db.query(
                    `SELECT title, salary, equity,company_handle
                    FROM jobs 
                    WHERE title = $1 AND salary < $2;`,
                    [title, minSalary]
                    
                )
                console.log(result.rows)
                return result.rows
            }else {
                console.log('inside else')
                const result = await db.query(
                `SELECT title, salary, equity,company_handle FROM jobs;`)
                console.log(result.rows)
                return result.rows
            
            }
        

        }catch(err){
            console.log(err)
        }
    }

    static async create({title, salary, equity, company_handle}){
        // console.log(company_handle, 'title'.red)
        const result = await db.query(
            `INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title`,
            [title, salary, equity, company_handle]
        )
        // console.log(result.rows[0], 'result.rows')
        return result.rows[0]
    }



    static async update(parameter, {title, salary, equity, company_handle}){
        console.log(title, 'title'.red)
        console.log(parameter, 'paramet'.red)
        const result = await db.query(
            ` UPDATE jobs
            SET title=$1, salary=$2, equity=$3, company_handle=$4
            WHERE title = $5
            RETURNING title, salary, equity, company_handle`,
            [title, salary, equity, company_handle, parameter]
        )
        console.log(result.rows, 'results in model'.green)
        return result.rows
    }


}

module.exports = Job