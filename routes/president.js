const { response } = require("express");
const express = require("express");
const router = express.Router();
const fs =require("fs");
//const path=require("path");
const sql = require('../models/mssqlcon');
const mail = require('../models/mails');
const upload = require('../models/upload');

router.post("/setDashboard",async (req,res)=>{
    try{
        var data = await sql.query("select A.Name as name,A.profile,(select secInfo from tbSectors where secId = A.secId) as sector from tbController A where A.username = '" + req.body.username + "' and A.Password = '" + req.body.password + "'");
        if(data.recordset.length>0){
            res.json({...data.recordset[0]});
        }
        else{
            res.json({name:"",profile:"",sector:""})
        }    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

const upload_adh = upload.adhaar.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]);

router.post("/saveImages",upload_adh,(req,res)=>{
    var front = req.files.front[0].path;
    var back = req.files.back[0].path;
    res.json({front:front,back:back});
})

router.post("/updateProfileImage",upload.profile.single('profile'),(req,res)=>{
    var path = req.file.path;
    res.json({path:path});
})

router.post("/insertPresident", async (req,res)=>{
    try{
        req.body.profile = "assets/images/defaults/user.jpg";
        var insertPresidentquery = "Insert into tbController values('" + req.body.secId + "','" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','" + req.body.username + "','" + req.body.password + "','0','1','" + req.body.aadharFront + "','" + req.body.aadharBack + "','" + req.body.profile + "','" + req.body.date + "','')";
        var insertUser = "Insert into tbUsers values('" + req.body.username + "','2')";
        var updateOnwerPrStatus = "Update tbOwner set prStatus = '2' where Email = '" + req.body.email + "'";
        var data = await sql.query(insertPresidentquery + " " + updateOnwerPrStatus + " " + insertUser + " select secInfo from tbSectors where secId = '"+req.body.secId+"'");
        if(data.recordset.length>0){
            var sector = data.recordset[0].secInfo;
            var params = {
                email:req.body.email,
                subject: "Registered as President Notifications",
                text: "Hi, " + req.body.name + " Your account has been registered and sent to the administrator for verification, soon you will be able to use it. You will be notified when your data is verified."
            }
            mail.send(params);
            params = {
                email:"agarwalkunal5301@gmail.com",
                subject: "New President Application",
                text: "Name: " + req.body.name + ", Phone: "+ req.body.phone + ", Sector: " + sector + ", Email: " + req.body.email
            }
            mail.send(params);
        }
        res.json({insert:"1"});   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/getDHList",async(req,res)=>{
    try{
        var data = await sql.query("select cId,Name as name ,Status as status,profile from tbController where Position = '2' and secId=(select secId from tbController where username = '"+req.body.username+"' and Password = '"+req.body.password+"') order by Status desc,Name");
        res.json({result:data.recordset});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/getGuardList",async(req,res)=>{
    try{
        var data = await sql.query("select cId,Name as name ,Status as status,profile from tbController where Position = '3' and secId=(select secId from tbController where username = '"+req.body.username+"' and Password = '"+req.body.password+"') order by Status desc,Name");
        res.json({result:data.recordset});    
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
        var data = await sql.query("update tbController set Password  = '"+req.body.newPassword+"' where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
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

router.post("/getProfile",async(req,res)=>{
    try{
        var found = false;
        var data = await sql.query("select Name as name,Phone as phone,Email as email,username,profile,aadharFront as front,aadharBack as back,bloodGroup from tbController where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
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
        if(req.body.profile==""){
            var data = await sql.query("update tbController set Name = '" + req.body.name + "',Phone = '" + req.body.phone + "',bloodGroup = '"+req.body.bloodGroup+"'  where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
            if(data.rowsAffected[0]>0){
                done = true;
            }
        }
        else{
            var data = await sql.query("select profile from tbController where username = '" + req.body.username + "' and Password = '" + req.body.password + "'  update tbController set Name = '" + req.body.name + "',Phone = '" + req.body.phone + "',profile = '"+req.body.profile+ "',bloodGroup = '" + req.body.bloodGroup + "'  where username = '" + req.body.username + "' and Password = '" + req.body.password + "'");
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


module.exports = router;