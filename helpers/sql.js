const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
//no kiddin.
//When a user updates a company info, .patch("/:handle" route runs and calls the update method in the company Class
// which then calls the sqlForPartialUpdate(dataToUpdate, jsToSql) function. The route parameter and request body
//is passed into the update method as "dataToupdate" along with { numEmployees: "num_employees", logoUrl: "logo_url",});
//as jsToSql. Inside the sqlForPartialUpdate(dataToUpdate, jsToSql) function it collects the keys from the request body
//then creates a new array(cols). New pairs are created with the names of the collected keys from the request body
//being re-assigned a new value..($idx + 1) to be used to prevent SQL injection.


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  // console.log(cols,'cols')
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
