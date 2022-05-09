const { response } = require("express");
const express = require("express");
const moment = require("moment");
const qrcode = require('qrcode');
const router = express.Router();
const path=require("path");
const fs =require("fs");
const sql = require('../models/mssqlcon');
const mail = require('../models/mails');
const upload = require('../models/upload');

router.post("/checkAccount/:email",async (req,res)=>{
    try{
        var found = false;
        var data = await sql.query("Select count(*) as match from tbController where email = '" + req.params.email + "'");
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

router.post("/insertGuard", async (req,res)=>{
    try{
        var done = false;
        req.body.profile = "assets/images/defaults/gdefault.png";
        var insertGuardQuery = "Insert into tbController values((select secId from tbController where username = '" + req.body.aadharFront + "'),'" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','" + req.body.username + "','" + req.body.password + "','1','3','','','" + req.body.profile + "','" + req.body.date + "','')";
        var insertUser = "Insert into tbUsers values('" + req.body.username + "','7')";
        
        var data = await sql.query(insertGuardQuery + " " + insertUser);
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

router.post("/saveGuard",async(req,res)=>{
    try{
        var done = false;
        var data = await sql.query("update tbController set Name = '" + req.body.name + "',Phone =  '" + req.body.phone + "',Email = '" + req.body.email + "',username = '" + req.body.username + "',Password = '" + req.body.password + "' where cId = '"+req.body.cId+"'");
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

router.post("/deleteGuard/:cId",async(req,res)=>{
    try{
        var done = false;
        var deleteGuardQuery = "delete from tbController where cId = '" + req.params.cId + "'";
        var deleteUsernameQuery = "delete from tbUsers where username = (select username from tbController where cId = '"+req.params.cId+"')";
        
        var data = await sql.query(deleteUsernameQuery + " " + deleteGuardQuery);
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

router.get("/getGuardInfo/:cId",async(req,res)=>{
    try{
        var found = false;
        var data = await sql.query("select A.Name as name,A.Phone as phone,A.Email as email,A.username,A.Password as password,A.Status as status,CONVERT(nvarchar(50),A.Date) as date,A.profile from tbController A where A.cId='" + req.params.cId + "'");
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

router.post("/setDashboard",async (req,res)=>{
    try{
        var data = await sql.query("select A.secId,A.Name as name,A.profile,(select secInfo from tbSectors where secId = A.secId) as sector from tbController A where A.username = '" + req.body.username + "' and A.Password = '" + req.body.password + "' and Position = '3'");
        if(data.recordset.length>0){
            res.json({...data.recordset[0]});
        }
        else{
            res.json({name:"",profile:"",sector:"",secId:""})
        }    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/checkSlot",async (req,res)=>{
    try{
        var found = false;
        //console.log(req.body);
        var data = await sql.query("Select count(*) as match from tbParkingSlots where row = '" + req.body.row + "' and slot = '"+req.body.slot+"' and secId = '"+req.body.secId+"'");
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

router.get("/getSectorStatus/:username",async (req,res)=>{
    try{
        var data = await sql.query("select A.secId,A.pStatus from tbSectors A where secId = (select secId from tbController where username = '"+req.params.username+"')");
        if(data.recordset.length>0){
            res.json({...data.recordset[0]});
        }
        else{
            res.json({secId:0,pStatus:0})
        }    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
})

router.post("/createParking",async(req,res)=>{
    try{
        var obj = req.body;
        var done = false;
        //console.log(obj);
        var values = ``;var row = 1;
        for(var i=1;i<=obj.aSlots;i++){
            if(values!=""){
                values = values + ",";
            }
            values = values + `('${row}','${i}','1','A/R${row}-${i}','${obj.secId}','0')`;
            
            if(i%obj.aRowSize==0){row++;}
        }
        row=1;
        for(var i=1;i<=obj.bSlots;i++){
            if(values!=""){
                values = values + ",";
            }
            values = values + `('${row}','${i}','2','B/R${row}-${i}','${obj.secId}','0')`;
            if(i%obj.bRowSize==0){row++;}
        }
        var insert = `insert into tbParkingSlots values ${values}`;
        var sectorParkingStatus = `update tbSectors set pStatus = '1' where secId = '${obj.secId}'`
        var data = await sql.query(insert + " " + sectorParkingStatus);
        if(data.rowsAffected[0]>0){
            done=true;
        }
        //console.log(values);
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/saveParking",async(req,res)=>{
    try{
        var obj = req.body;
        var done = false;
        //console.log(obj);
        var query = ``;
        for(var i=0;i<obj.length;i++){
            query = query + `update tbParkingSlots set tag='${obj[i].tag}',row='${obj[i].row}',slot='${obj[i].slot}' where slotId='${obj[i].slotId}' `
        }

        var data = await sql.query(query);
        if(data.rowsAffected[0]>0){
            done=true;
        }
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/insertSlot",async(req,res)=>{
    try{
        var obj = req.body;
        var done = false;
        //console.log(obj);
        var data = await sql.query(`insert into tbParkingSlots values ('${obj.row}','${obj.slot}','${obj.type}','${obj.tag}','${obj.secId}','${obj.booked_status}')`);
        if(data.rowsAffected[0]>0){
            done=true;
        }
        res.json({done:done});   
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.get("/getParkingSlots/:secId/:type",async(req,res)=>{
    try{
        var data = await sql.query("select slotId,row,slot,tag,booked_status,type from tbParkingSlots where type='"+req.params.type+"' and secId = '"+req.params.secId+"' order by row,slot");
        res.json({data:data.recordset});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.get("/getQRList/:username",async(req,res)=>{
    try{
        var data = await sql.query(`select A.bookingId,A.slotId,A.name,A.contact as phone,A.vehicleNo,A.validFrom,A.validTo,A.valid_status,(select type from tbParkingSlots where slotId = A.slotId) as type,(select tag from tbParkingSlots where slotId = A.slotId) as tag from tbBooking A where A.username='${req.params.username}'`);
        for(var i=0;i<data.recordset.length;i++){
            var text  = JSON.stringify({bookingId:data.recordset[i].bookingId});
            data.recordset[i].src = await qrcode.toDataURL(text);
            data.recordset[i].validTo = moment(data.recordset[i].validTo).subtract(5,'h').subtract(30,'m').format("Do MMM YYYY, hh:mm a");
            data.recordset[i].validFrom = moment(data.recordset[i].validFrom).subtract(5,'h').subtract(30,'m').format("Do MMM YYYY, hh:mm a");
        }
        res.json({data:data.recordset});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/deleteBooking/:bookingId",async(req,res)=>{
    try{
        var data = await sql.query(`select bookingId,temp_occupied_status,slotId from tbBooking where bookingId = '${req.params.bookingId}'`);
        if(data.recordset.length>0){
            var obj = {
                bookingId:data.recordset[0].bookingId,
                temp_occupied_status:data.recordset[0].temp_occupied_status,
                slotId:data.recordset[0].slotId
            }

            var deleteQuery = `delete from tbBooking where bookingId = '${obj.bookingId}'`;
            var slotFree = `update tbParkingSlots set booked_status = '0' where slotId = ${obj.slotId}`;
            if(obj.temp_occupied_status=="1"){
                slotFree = `update tbBooking set temp_occupied_status = 0 where bookingId = (select parent_bookingId from tbBooking where bookingId = '${obj.bookingId}')`;
            }
            data = await sql.query(slotFree + " " + deleteQuery);
        }
        res.json({done:true});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

const calculate_amount = (isForCharged=false,dateFrom="",dateTo="")=>{
    var charges = {
        month:150,
        day:30,
        hour:7,
        minute:0.50,
        six_month:300,
        year:500    
    }

    let m1 = moment(dateFrom);
    let m2 = moment(dateTo);
    var duration = moment.duration(m2.diff(m1))._data;
    //console.log(duration);
    
    var amount = 0;
    if(!isForCharged && ((duration.months==5 && (duration.days>25))||(duration.months==6 && (duration.days<5)))){
        amount=300;
    }
    else if((!isForCharged && (duration.months==11 && (duration.days>25))||(duration.years==1 && (duration.days<5)))){
        amount=500;
    }
    else{
        if(duration.months >= 6){
            amount = amount + charges.six_month;
            duration.months = duration.months - 6;
        }
        amount = amount + duration.years * charges.year + duration.months * charges.month + duration.days * charges.day + duration.hours * charges.hour + duration.minutes * charges.minute;
    }
    //console.log(amount);
    return Promise.resolve(amount);
}

router.post("/checkAvailability",async(req,res)=>{
    try{
        var obj = req.body;
        //console.log(obj);
        var found = false;
        var pslot={slotId:'',slot:'',amount:0,temp_request_status:0,parent_bookingId:0};
        var data = await sql.query(`select top 1 slotId,tag as slot from tbParkingSlots where secId = '${obj.secId}' and type = '${obj.type}' and booked_status='0'`);
        if(data.recordset.length>0){
            found = true;
            pslot.slotId = data.recordset[0].slotId;
            pslot.slot = data.recordset[0].slot;
        }
        if(!found && obj.type=="2"){  //case only if buffer slot is requested and to chk if any allotment slot is free or not in parkingSlotTable
            var data = await sql.query(`select top 1 slotId,tag as slot from tbParkingSlots where secId = '${obj.secId}' and type = '1' and booked_status='0'`);
            if(data.recordset.length>0){
                found = true;
                pslot.slotId = data.recordset[0].slotId;
                pslot.slot = data.recordset[0].slot;
            }
        }
        if(!found && obj.type=="2"){  //case only if buffer slot is requested and to chk if any allotment slot is free or not in booking table
            var data = await sql.query(`select top 1 A.bookingId,A.slotId,(select tag from tbParkingSlots where slotId=A.slotId) as slot from tbBooking A where secId = '${obj.secId}' and temp_occupied_status='0' and in_status='0' and timeIn > '${obj.dateTo}'`);
            if(data.recordset.length>0){
                found = true;
                pslot.slotId = data.recordset[0].slotId;
                pslot.slot = data.recordset[0].slot;
                pslot.parent_bookingId = data.recordset[0].bookingId;
                pslot.temp_request_status = 1;
            }
        }
        if(found){
            pslot.amount = await calculate_amount(false,obj.dateFrom,obj.dateTo);
        }
        //console.log(found);
        //console.log(pslot);
        res.json({available:found,data:pslot});
    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.get("/getSectors/:uId/:username",async(req,res)=>{
    try{
        if(req.params.uId=="4"){  //owner
            var data = await sql.query(`select A.secId as id,A.secInfo as name from tbSectors A where secId in (select distinct secId from tbFloor where ownId = (select ownId from tbOwner where username='${req.params.username}'))`);
            res.json({result:data.recordset});

        }
        else if(req.params.uId=="5"){  //tenant
            var data = await sql.query(`select A.secId as id,A.secInfo as name from tbSectors A where secId = (select secId from tbFloor where fId = (select fId from tbTenant where username='${req.params.username}'))`);
            res.json({result:data.recordset});

        }
            
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/bookParkingSlot",async(req,res)=>{
    try{
        var obj = req.body;
        //console.log(obj);
        var done = false
        if(obj.temp_request_status!=1){  //genuine slot is available  1. allotment to allotment  2. buffer to buffer  3.allotment to buffer
            
            var insertBooking = `insert into tbBooking values('${obj.username}','${obj.cName}','${obj.cPhone}','${obj.vehicleNo}','${obj.dateFrom}','${obj.dateTo}','${obj.timeIn}','','${obj.slotId}','0','1','0','${obj.secId}','')`;
            var setSlot = `update tbParkingSlots set booked_status = '1' where slotId = '${obj.slotId}'`;

            var data = await sql.query(insertBooking + " " + setSlot);
            if(data.rowsAffected[0]>0){
                done=true;
            }
        }
        else{  //temporarily using the allotment slot
            var insertBooking = `insert into tbBooking values('${obj.username}','${obj.cName}','${obj.cPhone}','${obj.vehicleNo}','${obj.dateFrom}','${obj.dateTo}','${obj.timeIn}','','${obj.slotId}','0','1','1','${obj.secId}','${obj.parent_bookingId}')`;
            //imp here at present we had set temp_occupied_status = 1 for this new booking but if we set it to 0 scope of functionality may be increased -- testing required for it  

            var setSlot = `update tbBooking set temp_occupied_status = '1' where bookingId = '${obj.parent_bookingId}'`;

            var data = await sql.query(insertBooking + " " + setSlot);
            if(data.rowsAffected[0]>0){
                done=true;
            }
        }
        //var data = await sql.query("select cId,Name as name ,Status as status,profile from tbController where Position = '2' and secId=(select secId from tbController where username = '"+req.body.username+"' and Password = '"+req.body.password+"') order by Status desc,Name");
        res.json({done:done});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})



const verify = async (obj)=>{
    try{
        //console.log(obj);
        let m = moment();    //imp Note : do not take time string values in moment methods else error [method] is not a function {like if we here it is moment().format('YYYY-MM-DD HH:mm') see the error} 
        var data = {
            case:0,
            type:1,//in/out
            name:'',
            number:'',
            vehicle:'',
            slot:'',
            bookingId:'',
            amount:''
        }
        //console.log(data);
        //console.log(m);
        var result = await sql.query(`select A.bookingId,A.slotId,A.name,A.contact as number,A.vehicleNo as vehicle,(select tag from tbParkingSlots where slotId = A.slotId) as slot,(select type from tbParkingSlots where slotId = A.slotId) as parkingType,A.validTo,A.valid_status,A.temp_occupied_status,A.timeIn,A.in_status from tbBooking A where A.bookingId = '${obj.bookingId}' and A.secId = '${obj.secId}'`);
        if(result.recordset.length>0){
            obj = {...obj,...result.recordset[0]};
            //console.log(obj);
            let validTo = moment(obj.validTo).subtract(5,'h').subtract(30,'m');
            //let validTo = moment(obj.validTo).utc();
            let timeIn = moment(obj.timeIn).subtract(5,'h').subtract(30,'m');

            //console.log(m.diff(validTo,'minute'))
            //console.log(validTo);
            //console.log(timeIn);

            if(obj.in_status!=0){data.type = 2;}
            data = {...data,
                name:obj.name,
                number:obj.number,
                vehicle:obj.vehicle,
                slot:obj.slot,
                slotId:obj.slotId,
                parkingType:obj.parkingType,
                bookingId:obj.bookingId,
                validTo:obj.validTo,
                temp_occupied_status:obj.temp_occupied_status

            }
            if(data.type==1){  //vehicle in
                if(m.isSameOrAfter(validTo,'minute')||obj.valid_status==0){
                    //case 1 : expired
                    var expired = await setExpired(obj.bookingId,obj.parkingType,obj.temp_occupied_status);
                    data.case = 1;
                }
                else if(m.isBefore(timeIn,'minute') && obj.temp_occupied_status==1){
                    //case 2 : before timeIn arrivals and slot temporarily booked
                    data.case = 2;
                }
                else if(obj.valid_status==1){
                    //case 3 : valid in
                    data.case = 3;
                }
            }
            else{   //vehicle out
                if((obj.parkingType == 2||obj.temp_occupied_status == 1) && m.isSameOrBefore(obj.validTo,'minute')){
                    //buffer either pure buffer(parking type) of allotment as buffer (temp-occupied status)
                    //case 4 : buffer out within time valid option (in proceed 4 checkout, 4.1 : reuse)
                    data.case = 4;
                }
                else if((obj.parkingType==1||obj.temp_occupied_status == 0) && m.isAfter(obj.validTo,'minute')){
                    //case 5 : allotment > out  limit exceed
                    data.case = 5.1;
                    data.amount = await calculate_amount(true,validTo.format("YYYY-MM-DD HH:mm"),m.format("YYYY-MM-DD HH:mm"));
                }
                else if(obj.parkingType==1||obj.temp_occupied_status == 0){
                    //case 5 : allotment > out  ask to time in
                    data.case = 5;
                }
                else if((obj.parkingType == 2||obj.temp_occupied_status == 1) && m.isAfter(obj.validTo,'minute')){
                    //case 6 : buffer out time limit exceed
                    data.case = 6;
                    data.amount = await calculate_amount(true,validTo.format("YYYY-MM-DD HH:mm"),m.format("YYYY-MM-DD HH:mm"));
                }
            }
            
        }
        else{
            //case 0 : not exists
        }
        //console.log(data);
        return Promise.resolve(data);
        // res.json({data:data.recordset});
        //return data;
            
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
}

const setExpired = async (bookingId=0,parkingType=0,temp_occupied_status=0)=>{
    if(bookingId!=0){
        var queryExpired = '';
        var slotFree = '';
        if((parkingType=="1" && temp_occupied_status=="0")||parkingType=="2"){
            
            queryExpired = `update tbBooking set in_status='0',valid_status='0' where bookingId='${bookingId}'`;
            slotFree = `update tbParkingSlots set booked_status='0' where slotId=(select slotId from tbBooking where bookingId='${bookingId}')`;
        }
        else if(parkingType=="1" && temp_occupied_status=="1"){
            
            queryExpired = `update tbBooking set in_status='0',valid_status='0' where bookingId='${bookingId}'`;
            slotFree = `update tbBooking set temp_occupied_status='0' where bookingId= (select parent_bookingId from tbBooking where bookingId = '${obj.bookingId}')`;
        }

        var query = await sql.query(queryExpired + ' ' + slotFree);

    }

    else{
        //for cron job
    }
    return Promise.resolve(1);
}

router.get("/verifyBooking/:bookingId/:secId",async(req,res)=>{
    try{
        var obj = req.params;
        var data = {
            case:0,
            type:'',//in/out
            name:'',
            number:'',
            vehicle:'',
            slot:'',
            bookingId:'',
            amount:''
        }
        if(obj.bookingId!=""){
            data = await verify(obj);
        }
        res.json({data:data});
            
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.get("/verifyParking/:vnum/:secId",async(req,res)=>{
    try{
        var obj = req.params;
        var data = {
            case:0,
            type:'',//in/out
            name:'',
            number:'',
            vehicle:'',
            slot:'',
            bookingId:'',
            amount:''
        }
        if(obj.vnum!=""){
            var bookingId = await sql.query(`select top 1 bookingId from tbBooking where vehicleNo='${obj.vnum}' and secId = '${obj.secId}' order by bookingId desc`);
            if(bookingId.recordset.length>0){
                obj.bookingId = parseInt(bookingId.recordset[0].bookingId);
                data = await verify(obj);
                //console.log(data);
            }
        }
        res.json({data:data}); 
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

router.post("/proceed",async(req,res)=>{
    try{
        //3,4,4.1,5,6
        var query = "";
        var obj = req.body;

        if(obj.case==3){
            //valid in
            query = await sql.query(`update tbBooking set in_status='1' where bookingId='${obj.bookingId}'`);
        }
        else if(obj.case==4 || obj.case==6 || obj.case==5.1){
            //buffer checkout || buffer time limit exceed checkout || allotment checkout limit exceed
            var queryExpired = `update tbBooking set in_status='0',valid_status='0' where bookingId='${obj.bookingId}'`;
            var slotFree = '';
            if(obj.parkingType==2 || obj.case==5.1){
                //pure buffer : checkout case : todo - slot free || allotment checkout limit exceed :parking type 1
                slotFree = `update tbParkingSlots set booked_status='0' where slotId='${obj.slotId}'`;
            }
            else if(obj.parkingType==1){  //else 
                //allotment as buffer : checkout case : todo - setting temp_occupied_status of parent to 0
                slotFree = `update tbBooking set temp_occupied_status='0' where bookingId= (select parent_bookingId from tbBooking where bookingId = '${obj.bookingId}')`;
            }
            query = await sql.query(queryExpired + ' ' + slotFree);
            
        }
        else if(obj.case==4.1){
            //buffer reuse
            query = await sql.query(`update tbBooking set timeIn = '${obj.m}',in_status='0' where bookingId = '${obj.bookingId}'`);
            
        }
        else if(obj.case==5){
            //allotment out timeIn  //here temp status in already set-ed to 0 before his entry to the parking
            query = await sql.query(`update tbBooking set timeIn = '${obj.m}',in_status='0' where bookingId = '${obj.bookingId}'`);
            
        }
        res.json({done:true});    
    }
    catch(err){
        //console.warn(err);
        //res.status(500).send(err.message);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
    
})

// function momentTest(){
//     let m1 = "2023-04-08 22:20";
//     let m2 = "2023-10-08 22:20";
//     var amount = calculate_amount(false,m1,m2);
//     console.log(amount);
// }
// momentTest();

module.exports = router;