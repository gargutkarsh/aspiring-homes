require('dotenv').config();
const sql = require('mssql/msnodesqlv8')
const config = {
//   user: process.env.MSSQL_USER,
//   password: process.env.MSSQL_PASS,
//   database: process.env.MSSQL_DATABASE,
//   server: process.env.MSSQL_SERVER,
  user: "user_kunal",
  password: "RamSita@13@",
  database: "db_kunal",
  server: "101.53.155.68",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

var obj = {};


obj.query= async (query)=>{
     try{
        let pool = await sql.connect(config);
        var result = await pool.request().query(query);
        //console.log(result);
        pool.close();
        return result;
    }
    catch(error){
        //console.log(error);
        sql.close();
        throw new Error(error.message);
    }
}

obj.callProcedure = async (proc,params)=>{
    try{
        
        let pool = await sql.connect(config);
        var result = await pool.request().query(`exec ${proc} ${params.ch},${params.username},${params.password}`);
        //console.log(result);
        sql.close();
        return result;
    }
    catch(error){
        //console.log(error);
        sql.close();
        throw new Error(error.message);
    }
}
module.exports = obj;