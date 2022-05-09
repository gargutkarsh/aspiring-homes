const { response } = require("express");
const express = require("express");
const router = express.Router();
//const multer =require("multer");
const path=require("path");
const sql = require('../models/mssqlcon');
const mail = require('../models/mails');
const upload = require('../models/upload');
const { domainToASCII } = require("url");
const randomstring = require("randomstring");
const fs =require("fs");

router.post("/checkAccount/:email",async (req,res)=>{
    try{
        var found = false;
        var data = await sql.query("Select count(*) as match from tbTenant where email = '" + req.params.email + "'");
        if(data.recordset[0].match!=0){
            found = true;
        }
        res.json({match:found});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/insertTenant", async (req,res)=>{
    try{
        req.body.profile = "assets/images/defaults/user.jpg";
        
        var insertTenantquery = "Insert into tbTenant values('" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','" + req.body.username + "','" + req.body.password + "','" + req.body.profile + "','0','" + req.body.date + "','1','0','0','')";
        var insertUser = "Insert into tbUsers values('" + req.body.username + "','5')";
        var updatetbOTP = "update tbOTP set verified = '1',registered = '1' where email = '" + req.body.email + "'";
        var insertBGInfo = "insert into tbBloodGroupInfo values('" + req.body.name + "','','" + req.body.date + "','" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','','" + req.body.username + "','1')";
        
        var data = await sql.query(insertTenantquery + " " + insertUser + " " + updatetbOTP + " " + insertBGInfo);
        var done = parseInt(data.rowsAffected[0]);
        res.json({insert:done});   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/setDashboard",async (req,res)=>{
    try{
         var data = await sql.query("select A.tId,A.Name as name,A.profileImg as profile,(select houseNo + ' - ' +floorNo from tbFloor where fId = A.fId) as house,(select rvStatus from tbFloor where fId=A.fId) as rStatus,A.tenantStatus from tbTenant A where A.username = '" + req.body.username + "' and A.Password = '" + req.body.password + "'");
        if(data.recordset.length>0){
            res.json({...data.recordset[0]});
        }
        else{
            res.json({name:"",profile:"",house:"",rStatus:"",tenantStatus:"",tId:""})
        }   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.get("/getDefaultReadings/:user",async(req,res)=>{ 
    try{
        var found = false;
        var data = await sql.query("select A.fId,A.floorNo as floor,A.eReading,A.wReading,(select tId from tbTenant where username='"+req.params.user+"') as tId from tbFloor A where A.fId = (select fId from tbTenant where username = '"+req.params.user+"')");
        if(data.recordset.length>0){
            found = true;

            res.json({found:found,...data.recordset[0]});    
        }
        else{
            res.json({found:found});
        }    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})
router.post("/sendOwnerOTP/:fId/:tId",async (req,res)=>{
    try{
        var otp = randomstring.generate(6);
        var data = await sql.query("select (select Email from tbOwner where ownId =  (select ownId from tbFloor where fId = '"+req.params.fId+ "')) as email,(select Name from tbOwner where ownId =  (select ownId from tbFloor where fId = '"+req.params.fId+ "')) as ownerName,(select floorNo from tbFloor where fId='" + req.params.fId + "') as floorNo,(select houseNo from tbFloor where fId='"+req.params.fId+"') as houseNo,(select Name from tbTenant where fId='"+req.params.fId+"') as tenantName  update tbTenant set otp = '"+otp+"' where tId='"+req.params.tId+"'");
        
        if(data.recordset.length>0){
            //console.log(data);
            var email = data.recordset[0].email;
            var floorNo = data.recordset[0].floorNo;
            var houseNo = data.recordset[0].houseNo;
            var ownerName = data.recordset[0].ownerName;
            var tenantName = data.recordset[0].tenantName;

            if(email!=""){
                var params = {
                    email:email,
                    subject: "Setting Initial Meter Readings",
                    text : "Hi " + ownerName + ", " + otp + " is your one time password to Confirm the Readings entered by "+tenantName+" for the FloorNo: " + floorNo + ", HouseNo: " + houseNo
                }
                mail.send(params);
            }
            
        }
        res.json({send:"1"});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})
router.post("/checkOwnerOTP/:tId/:otp",async (req,res)=>{
    try{
        var found = false;
        var data = await sql.query("Select count(*) as match from tbTenant where tId = '" + req.params.tId + "' and otp = '"+req.params.otp+"'");
        if(data.recordset[0].match!=0){
            found = true;
        }
        res.json({match:found});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})
router.post("/setInitialReadings",async(req,res)=>{
    try{
        var done = false;
        var tbFloor = "update tbFloor set eReading = '"+req.body.eReading+"',wReading = '"+req.body.wReading+"',rvStatus='1' where fId='"+req.body.fId+"'";
        
        var data = await sql.query(tbFloor);
        if(data.rowsAffected[0]>0){
            done = true;  
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/changePassword",async(req,res)=>{
    try{
        var done = false;
        var data = await sql.query("update tbTenant set Password  = '"+req.body.newPassword+"' where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
        if(data.rowsAffected[0]>0){
            done = true;
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/updateProfileImage",upload.profile.single('profile'),(req,res)=>{
    var path = req.file.path;
    res.json({path:path});
})

router.post("/getProfile",async(req,res)=>{
    try{
        var found = false;
        var data = await sql.query("select Name as name,Phone as phone,Email as email,username,profileImg as profile,CONVERT(nvarchar(50),date) as date,bloodGroup,(select CONVERT(nvarchar(50),dateModified) from tbBloodGroupInfo where username = '" + req.body.username + "' and auth = '1') as dateModified,(select age from tbBloodGroupInfo where username = '" + req.body.username + "' and auth = '1') as age from tbTenant where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
        if(data.recordset.length>0){
            found = true;
            res.json({data:found,...data.recordset[0]});
        }
        else{
            res.json({data:found});
        }    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/setProfile",async(req,res)=>{ //to verify
    try{
        var done = false;
        
        var insertBGInfo = "";
        var updateBGinfo = "update tbBloodGroupInfo set mainName='"+req.body.name+ "',age='" + req.body.age + "',dateModified='" + req.body.date + "',name = '" + req.body.name + "',phone = '" + req.body.phone + "',bloodGroup = '" + req.body.bloodGroup + "'  where username = '" + req.body.username + "' and auth = '1'";
        var data = await sql.query(updateBGinfo);
        if(data.rowsAffected[0]==0){
            insertBGInfo = "insert into tbBloodGroupInfo values('" + req.body.name + "','" + req.body.age + "','" + req.body.date + "','" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','" + req.body.bloodGroup + "','" + req.body.username + "','1')";
        }

        if(req.body.profile==""){
            var data = await sql.query("update tbOwner set Name = '" + req.body.name + "',Phone = '" + req.body.phone + "',bloodGroup = '"+req.body.bloodGroup+"'  where username = '" + req.body.username + "' and Password = '" + req.body.password + "' " + insertBGInfo);
            if(data.rowsAffected[0]>0){
                done = true;
            }
        }
        else{
            var data = await sql.query("select profileImg as profile from tbTenant where username = '" + req.body.username + "' and Password = '" + req.body.password + "'  update tbTenant set Name = '" + req.body.name + "',Phone = '" + req.body.phone + "',profileImg = '"+req.body.profile+ "',bloodGroup = '" + req.body.bloodGroup + "'  where username = '" + req.body.username + "' and Password = '" + req.body.password + "' " + insertBGInfo);
            if(data.recordset.length>0){
                done = true;
                var previous = String(data.recordset[0].profile);
                var defaultPath = "assets/images/defaults/user.jpg";
                if(previous!=defaultPath){
                    var filePath = "./" + previous;
                    fs.exists(filePath, function(exists) {
                        if(exists) {
                            fs.unlinkSync(filePath);
                        } 
                    });
                }
            }
        }
        
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }

    
})

router.post("/getElectricityBills",async(req,res)=>{
    try{
        var data = await sql.query("select A.recId,A.meterNo,A.PreReading as preReading,A.Reading,CONVERT(nvarchar(50),A.fromDate) as dateFrom,CONVERT(nvarchar(50),A.todate) as dateTo,CONVERT(nvarchar(50),A.duedate) as dueDate,A.tenantStatus,A.amountPaid,(select eReading from tbFloor where fId=(select fId from tbTenant where username = '" + req.body.username + "')) as pReading from tbMeterRecords A where A.meterNo = (select Emeter from tbFloor where fId=(select fId from tbTenant where username = '" + req.body.username+ "')) and Reading>(select eReading from tbFloor where fId=(select fId from tbTenant where username = '"+req.body.username+"')) order by A.tenantStatus,fromDate");
        var rec = data.recordset;
        for(var i = 0;i<rec.length;i++){
            var preReading = parseInt(rec[i].preReading);
            var tenantStartReading = parseInt(rec[i].pReading);
            if(preReading>tenantStartReading){
                rec[i].pReading = String(rec[i].preReading);
            }
        }
        res.json({result:rec});   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
    
})

router.post("/getWaterBills",async(req,res)=>{
    try{
        var data = await sql.query("select A.recId,A.meterNo,A.PreReading as preReading,A.Reading,CONVERT(nvarchar(50),A.fromDate) as dateFrom,CONVERT(nvarchar(50),A.todate) as dateTo,CONVERT(nvarchar(50),A.duedate) as dueDate,A.tenantStatus,A.amountPaid,(select wReading from tbFloor where fId=(select fId from tbTenant where username = '" + req.body.username + "')) as pReading from tbMeterRecords A where A.meterNo = (select Wmeter from tbFloor where fId=(select fId from tbTenant where username = '" + req.body.username+ "')) and Reading>(select wReading from tbFloor where fId=(select fId from tbTenant where username = '"+req.body.username+"')) order by A.tenantStatus,fromDate");
        var rec = data.recordset;
        for(var i = 0;i<rec.length;i++){
            var preReading = parseInt(rec[i].preReading);
            var tenantStartReading = parseInt(rec[i].pReading);
            if(preReading>tenantStartReading){
                rec[i].pReading = String(rec[i].preReading);
            }
        }
        res.json({result:rec});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }

    
})

router.post("/payBill",async(req,res)=>{
    try{
        var done = false;
        var data = await sql.query("update tbMeterRecords set amountPaid = '" + req.body.amountPaid + "',amountToPay = '" + req.body.amountToPay + "',status='" + req.body.status + "',tenantStatus='" + req.body.tenantStatus + "'  where recId = '" + req.body.recId + "'");
        if(data.rowsAffected[0]>0){
            done = true;
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }

    
})

router.post("/getRentBills",async(req,res)=>{
    try{
        var owner = "(select Name from tbOwner where ownId = (select ownId from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "'))) as owner, ";
        var contact = "(select Phone from tbOwner where ownId = (select ownId from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "'))) as contact, ";
        var email = "(select Email from tbOwner where ownId = (select ownId from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "'))) as email, ";
        var lastDate = "(select top 1 CONVERT(nvarchar(50),toDate) from tbRentRecords where tId = (select tId from tbTenant where username = '" + req.body.username+ "') and fId=(select fId from tbTenant where username = '" + req.body.username + "') order by toDate desc) as lastDate";
        
        var data1 = await sql.query("select " + owner + contact + email + lastDate);

        var data2 = await sql.query("select A.recId,CONVERT(nvarchar(50),A.fromDate) as fromDate,CONVERT(nvarchar(50),A.toDate) as toDate,A.Rent as amount,A.status from tbRentRecords A where tId = (select tId from tbTenant where username = '" + req.body.username + "') and fId=(select fId from tbTenant where username = '" + req.body.username + "') order by A.status,fromDate");
        
        var arr = {owner:"",contact:"",email:"",lastDate:""};
        var rec = [];

        if(data1.recordset.length>0){
            arr = data1.recordset[0];
        }
        
        if(data2.recordset.length>0){
            rec = data2.recordset;
        }

        res.json({result:rec,...arr});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }

    
})

router.post("/makeRentRecord",async(req,res)=>{
    try{
        var done = false;
        var data = await sql.query("insert into tbRentRecords values((select tId from tbTenant where username = '"+req.body.username+"'),(select fId from tbTenant where username = '"+req.body.username+ "'),'"+req.body.fromDate+"','"+req.body.toDate+"',(select Rent from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "')),'0')");
        if(data.rowsAffected[0]>0){
            done = true;
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }

    
})

router.post("/payRent/:recId",async(req,res)=>{
    try{
        var done = false;
        var data = await sql.query("update tbRentRecords set status = '1' where recId = '" + req.params.recId + "'");
        if(data.rowsAffected[0]>0){
            done = true;
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/checkNoDue",async (req,res)=>{
    try{
        var done = false;
        var data = await sql.query("select acctype from tbUsers where username = '" + req.body.username + "'")
        if(data.recordset.length>0){
            var uId = parseInt(data.recordset[0].acctype);
            if(uId==5){
                var bills = "(select count(*) from tbMeterRecords where tenantStatus = '0' and meterNo in (select Emeter from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "') union select Wmeter from tbFloor where fId = (select fId from tbTenant where username = '" + req.body.username + "'))) as bills, ";
                var rentLeft = "(select sum(Rent) from tbRentRecords where status=0 and tId = (select tId from tbTenant where username = '" + req.body.username + "') and fId = (select fId from tbTenant where username = '" + req.body.username + "')) as rentLeft";
                data = await sql.query("select " + bills + rentLeft);
                if(data.recordset.length>0){
                    done=true;
                    bills = String(data.recordset[0].bills);
                    rentLeft = String(data.recordset[0].rentLeft);
                    if(rentLeft==""){
                        rentLeft="0";
                    }
                }
                res.json({done:done,bills:bills,rentLeft:rentLeft});        
            }
        }
        res.json({done:done})
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})


router.post("/deleteAccount", async (req,res)=>{
    try{
        var done=false;
        var deleteTenant = "select profileImg from tbTenant where tId='"+req.body.tId+"' delete from tbTenant where tId = '"+req.body.tId+"'"
        var deleteUsername = "delete from tbUsers where username = '"+req.body.username+"'";

        //var deleteBGInfo = "delete from tbBloodGroupInfo where username = '"+req.body.username+"'"
        
        var data = await sql.query(deleteUsername + " " + deleteTenant);
        if(data.recordset.length>0){
            done=true;
            var previous = String(data.recordset[0].profileImg);
            var defaultPath = "assets/images/defaults/user.jpg";
            if(previous!=defaultPath){
                var filePath = "./" + previous;
                fs.exists(filePath, function(exists) {
                    if(exists) {
                        fs.unlinkSync(filePath);
                    } 
                });
            }
        }
        res.json({done:done});   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})
module.exports = router;