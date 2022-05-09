var eRate = 7;
var wRate = 1;
var eADDC = 3;//electric after due date charges
var wADDC = 2;//water after due date charges
var eTotal = 0;
var wTotal = 0;
var rTotal = 0

$(document).ready(function () {
    setDashboard();
    getElectricityBills();
    getWaterBills();
    getRentBills();
});

function setElectricityBills(response){
    $("#spanEMN").text(response.result[0].meterNo);
    let mnow = moment();
     $("#tblEbills").html('');
    var table = "<thead class='thead'><tr><th scope='col' id='Id' class='d-none'>Id</th><th scope='col' id='fromDate'>From</th><th scope='col' id='toDate'>To</th><th scope='col' id='units'>Units Consumed</th><th scope='col' id='amount'>Bill Amount</th><th scope='col' id='dueDate'>Due Date</th><th scope='col' id='rate'>Rate</th><th scope='col' id='status'>Status</th><th scope='col' id='pay'>Pay</th></tr></thead>";
    table = table + "<tbody>";
    eTotal = 0;
    for (var i = 0; i < response.result.length; i++) {
        var recId = response.result[i].recId;
        let from = moment(response.result[i].dateFrom).format("DD/MM/YYYY");
        let to = moment(response.result[i].dateTo).format("DD/MM/YYYY");
        let due = moment(response.result[i].dueDate).format("DD/MM/YYYY");
        var preReading = parseInt(response.result[i].preReading);
        var pReading = parseInt(response.result[i].pReading);
        var Reading = parseInt(response.result[i].Reading);
        var units = Reading-pReading;
        var amountPaid = parseInt(response.result[i].amountPaid);
        var rate = eRate;
        var AToPay = (Reading - preReading)*rate;
        var bill = units*rate;
        let dueDate = moment(response.result[i].dueDate);
        
        var pay = "";
        var status = response.result[i].tenantStatus;
        if(status == "1"){
            status = "<div class='label text-success bg-success-light'>Paid</div>";
            pay = "<button recId = " + recId + " onclick='funPayEBill(this)' disabled>Pay</button>";
            if(pReading==preReading){
                bill = amountPaid;
            }
            else{
                if(amountPaid>AToPay){
                    bill = bill + eADDC*units;
                }
            }
        }
        else{
            status = "<div class='label text-warning bg-warning-light'>Pending</div>";
            pay = "<button onclick='funPayEBill(this)'>Pay</button>";
            if(mnow.isAfter(dueDate)){
                bill = bill + eADDC*units;
                AToPay = AToPay + eADDC*units;
            }
            eTotal = eTotal + bill;
        }
        table = table + "<tr><td id='Id' class='d-none'><span id='spanrecId'> " + recId + "</span><span id='spanAToPay'>" + AToPay + "</span> </td><td id='fromDate'> " + from + " </td><td id='toDate'> " + to +" </td><td id='units'> " + Reading + "-" + pReading + " = " + units + " </td><td id='amount'>"+bill +"</td><td id='dueDate'> " + due + " </td><td id='rate'> " + rate + "/unit </td><td id='status'> " + status + " </td><td id='pay'>"+pay+"</td></tr>";
    }
    table = table + "</tbody>";
    $("#tblEbills").append(table);
    $("#hEB").html(eTotal);
}

function getElectricityBills(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "tenant/getElectricityBills",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    setElectricityBills(response);
                }
                else {
                    $("#tblEbills").html('');
                }
            },
            error: function (error) {
                // if (!navigator.onLine) {
                //     window.location = "errors-404-error.html";
                // }
                //alert('error : ' + error);
                console.log(error);

            }
        });
    }
}

function setWaterBills(response){
    $("#spanWMN").text(response.result[0].meterNo);
    let mnow = moment();
     $("#tblWbills").html('');
    var table = "<thead class='thead'><tr><th scope='col' id='Id' class='d-none'>Id</th><th scope='col' id='fromDate'>From</th><th scope='col' id='toDate'>To</th><th scope='col' id='units'>Units Consumed</th><th scope='col' id='amount'>Bill Amount</th><th scope='col' id='dueDate'>Due Date</th><th scope='col' id='rate'>Rate</th><th scope='col' id='status'>Status</th><th scope='col' id='pay'>Pay</th></tr></thead>";
    table = table + "<tbody>";
    wTotal = 0;
    for (var i = 0; i < response.result.length; i++) {
        var recId = response.result[i].recId;
        let from = moment(response.result[i].dateFrom).format("DD/MM/YYYY");
        let to = moment(response.result[i].dateTo).format("DD/MM/YYYY");
        let due = moment(response.result[i].dueDate).format("DD/MM/YYYY");
        var preReading = parseInt(response.result[i].preReading);
        var pReading = parseInt(response.result[i].pReading);
        var Reading = parseInt(response.result[i].Reading);
        var units = Reading-pReading;
        var amountPaid = parseInt(response.result[i].amountPaid);
        var rate = wRate;
        var AToPay = (Reading - preReading)*rate;
        var bill = units*rate;
        let dueDate = moment(response.result[i].dueDate);
        
        var pay = "";
        var status = response.result[i].tenantStatus;
        if(status == "1"){
            status = "<div class='label text-success bg-success-light'>Paid</div>";
            pay = "<button onclick='funPayWBill(this)' disabled>Pay</button>";
            if(pReading==preReading){
                bill = amountPaid;
            }
            else{
                if(amountPaid>AToPay){
                    bill = bill + wADDC * units;
                }
            }
        }
        else{
            status = "<div class='label text-warning bg-warning-light'>Pending</div>";
            pay = "<button onclick='funPayWBill(this)'>Pay</button>";
            if(mnow.isAfter(dueDate)){
                bill = bill + wADDC * units;
                AToPay = AToPay + wADDC * units;
            }
            wTotal = wTotal + bill;
        }
        table = table + "<tr><td id='Id' class='d-none'><span id='spanrecId'> " + recId + "</span><span id='spanAToPay'>" + AToPay + "</span> </td><td id='fromDate'> " + from + " </td><td id='toDate'> " + to +" </td><td id='units'> " + Reading + "-" + pReading + " = " + units + " </td><td id='amount'>"+bill +"</td><td id='dueDate'> " + due + " </td><td id='rate'> " + rate + "/unit </td><td id='status'> " + status + " </td><td id='pay'>"+pay+"</td></tr>";
    }
    table = table + "</tbody>";
    $("#tblWbills").append(table);
    $("#hWB").html(wTotal);
}

function getWaterBills(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
         $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "tenant/getWaterBills",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    setWaterBills(response);
                }
                else {
                    $("#tblWbills").html('');
                }
            },
            error: function (error) {
                // if (!navigator.onLine) {
                //     window.location = "errors-404-error.html";
                // }
                //alert('error : ' + error);
                console.log(error);

            }
        });
    }
}

function funPayEBill(target){
    //console.log(target);
    //console.log($(target).closest("tr"));
    
    //vvImpConcept
    // pay = "<button recId = " + recId + " atp = "+ AToPay +" onclick='funPayBill(this)'>Pay</button>";
    // var recId = $(target).attr("recId");
    // var atp = $(target).attr("atp");
    
    var row = $(target).closest("tr");
    var recId = $(row).find("#Id").find("#spanrecId").text();
    var AToPay = $(row).find("#Id").find("#spanAToPay").text();
    var Apaid = $(row).find("#amount").html();
    var status = "0";
    if(Apaid==AToPay){
        status = "1";
    }
    var data = {
        recId:recId,
        amountToPay:AToPay,
        amountPaid:Apaid,
        status: status,
        tenantStatus:'1'
    }
    $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "tenant/payBill",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
                if (response.done) {
                    swal("Bill Paid","Successfully","success");
                    getElectricityBills();
                }
                else {
                    swal("Somthing Wrong!", "Transaction Failed!,", "error");
                }
            },
            error: function (error) {
                // if (!navigator.onLine) {
                //     window.location = "errors-404-error.html";
                // }
                //alert('error : ' + error);
                console.log(error);

            }
        });
    

    //var row = target.parentElement.parentElement;
    //console.log(row);
    //var AToPay = $(row).find("#Id").find("#spanAToPay").text();
    //console.log(AToPay);
    // var cId = $(target).attr("aid");
    // $("#spancId").text(cId);
}
function funPayWBill(target){
    
    var row = $(target).closest("tr");
    var recId = $(row).find("#Id").find("#spanrecId").text();
    var AToPay = $(row).find("#Id").find("#spanAToPay").text();
    var Apaid = $(row).find("#amount").html();
    var status = "0";
    if(Apaid==AToPay){
        status = "1";
    }
    var data = {
        recId:recId,
        amountToPay:AToPay,
        amountPaid:Apaid,
        status: status,
        tenantStatus:'1'
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "tenant/payBill",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if (response.done) {
                swal("Bill Paid","Successfully","success");
                getWaterBills();
            }
            else {
                swal("Somthing Wrong!", "Transaction Failed!,", "error");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    

}

function funPayRent(target){
    var recId = $(target).attr("recId");
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "tenant/payRent/" + recId,
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.done) {
                swal("Rent Paid","Successfully","success");
                getRentBills();
            }
            else {
                swal("Somthing Wrong!", "Transaction Failed!,", "error");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    

}

function makeRentRecord(data){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "tenant/makeRentRecord",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if (response.done) {
                getRentBills();
            }
        },
        error: function (error) {
           
            console.log(error);

        }
    });
}

function setRentBills(response){
    $("#spanOwner").text(response.owner);
    $("#spanContact").text(response.contact);
    $("#spanEmail").text(response.email);
    let lastDate = moment(response.lastDate);
    let mnow = moment();
    if(mnow.isAfter(lastDate)){
        var dataString = localStorage.getItem("rup-user");
        var dataL = JSON.parse(dataString);
        var data = {
            username:dataL.username,
            fromDate:lastDate.format("YYYY-MM-DD"),
            toDate:lastDate.add(1,'M').format("YYYY-MM-DD")
        }
        makeRentRecord(data);
    }
    else{
        $("#tblRbills").html('');
        var table = "<thead class='thead'><tr><th scope='col' id='Id' class='d-none'>Id</th><th scope='col' id='fromDate'>From</th><th scope='col' id='toDate'>To</th><th scope='col' id='amount'>Rent Amount</th><th scope='col' id='status'>Status</th><th scope='col' id='pay'>Pay</th></tr></thead>";
        table = table + "<tbody>";
        rTotal = 0;
        for (var i = 0; i < response.result.length; i++) {
            var recId = response.result[i].recId;
            let from = moment(response.result[i].fromDate).format("DD/MM/YYYY");
            let to = moment(response.result[i].toDate).format("DD/MM/YYYY");
            var rent = parseInt(response.result[i].amount);
            
            var pay = "";
            var status = response.result[i].status;
            if(status == "1"){
                status = "<div class='label text-success bg-success-light'>Paid</div>";
                pay = "<button recId = " + recId + " onclick='funPayRent(this)' disabled>Pay</button>";
                
            }
            else{
                status = "<div class='label text-warning bg-warning-light'>Pending</div>";
                pay = "<button recId = " + recId + " onclick='funPayRent(this)'>Pay</button>";
                rTotal = rTotal + rent;
            }
            table = table + "<tr><td id='Id' class='d-none'><span id='spanrecId'> " + recId + "</span></td><td id='fromDate'> " + from + " </td><td id='toDate'> " + to +" </td><td id='amount'>"+rent +"</td><td id='status'> " + status + " </td><td id='pay'>"+pay+"</td></tr>";
        }
        table = table + "</tbody>";
        $("#tblRbills").append(table);
        $("#hRB").html(rTotal);
    }

     
}

function getRentBills(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "tenant/getRentBills",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    setRentBills(response);
                }
                else {
                    $("#tblRbills").html('');
                }
            },
            error: function (error) {
                // if (!navigator.onLine) {
                //     window.location = "errors-404-error.html";
                // }
                //alert('error : ' + error);
                console.log(error);

            }
        });
    }
}


function hideAllCards(){
    $("#cardEB").addClass("d-none");
    $("#cardWB").addClass("d-none");
    $("#cardRB").addClass("d-none");
}

$("#divEB").click(function (e) { 
    e.preventDefault();
    hideAllCards();
    getElectricityBills();
    $("#cardEB").removeClass("d-none");
});

$("#divWB").click(function (e) { 
    e.preventDefault();
    hideAllCards();
    getWaterBills();
    $("#cardWB").removeClass("d-none");
    
});

$("#divRB").click(function (e) { 
    e.preventDefault();
    hideAllCards();
    getRentBills();
    $("#cardRB").removeClass("d-none");
    
});

$("#delete_password").keyup(function (e) { 
    if($("#delete_password").val().length>0){
        $("#lblIPE").addClass("d-none");
    }
});

function deleteAccount(data){
    //console.log(data);
    $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "tenant/deleteAccount",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
                swal("Poof! Your Account has been deleted!", {
                    icon: "success",
                });
                setTimeout(() => {
                    logout();
                }, 1000);
            },
            error: function (error){
                console.log(error);
            }
        });
}

$("#btnDeleteAccount").click(function (e) { 
    e.preventDefault();
    //console.log(tId);
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        var data = {
            tId:tId,
            username:record.username,
            password:$("#delete_password").val()
        }

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover Your Account!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                
                if(record.password!=data.password){
                    $("#lblIPE").removeClass("d-none");
                }
                else{
                    deleteAccount(data);
                }
                
            } else {
                $("#closeMsg").click();
            }
        });
   
        
    }
    
});