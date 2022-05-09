var eRate = 7;
var wRate = 1;
var eADDC = 3;//electric after due date charges
var wADDC = 2;//water after due date charges
var eTotal = 0;
var wTotal = 0;
var rTotal = 0

$(document).ready(function () {
    setDashboard();
    bindSelectFloor();
});

function resetTopAmounts(){
    $("#hEB").html("0");
    $("#hWB").html("0");
    $("#hRB").html("0");
}

function bindFloorBills(){
    resetTopAmounts();
    getElectricityBills();
    getWaterBills();
    getRentBills();
}

function bindSelectFloor(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "owner/getFloors/"+record.username,
            data: {},
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    $("#drpFloors").html("");
                    var list = "";
                    for (var i = 0; i < response.result.length; i++) {
                        list = list + "<option value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                    }

                    $("#drpFloors").append(list);

                    getElectricityBills();
                    getWaterBills();
                    getRentBills();
                }
                else {
                    console.log("no data");
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

function setElectricityBills(response){
    $("#spanEMN").text(response.result[0].meterNo);
    let mnow = moment();
     $("#tblEbills").html('');
    var table = 
    `<thead class='thead'>
    <tr>
    <th scope='col' id='Id' class='d-none'>Id</th>
    <th scope='col' id='fromDate'>From Date</th>
    <th scope='col' id='toDate'>To Date</th>
    <th scope='col' id='units'>Units Consumed</th>
    <th scope='col' id='amount'>Bill Amount</th>
    <th scope='col' id='amountPaid'>Amount Paid</th>
    <th scope='col' id='dueDate'>Due Date</th>
    <th scope='col' id='rate'>Rate</th>
    <th scope='col' id='status'>Status</th>
    <th scope='col' id='pay'>Pay</th></tr>
    </thead>`;

    table = table + "<tbody>";
    eTotal = 0;
    for (var i = 0; i < response.result.length; i++) {
        var recId = response.result[i].recId;
        let from = moment(response.result[i].dateFrom).format("DD/MM/YYYY");
        let to = moment(response.result[i].dateTo).format("DD/MM/YYYY");
        let due = moment(response.result[i].dueDate).format("DD/MM/YYYY");
        var preReading = parseInt(response.result[i].preReading);
        var Reading = parseInt(response.result[i].Reading);
        var units = Reading-preReading;
        var rate = eRate;
        var bill = units*rate;
        var amountPaid = parseInt(response.result[i].amountPaid);
        let dueDate = moment(response.result[i].dueDate);
        
        var pay = "";
        var status = response.result[i].status;
        if(status == "1"){
            status = "<div class='label text-success bg-success-light'>Paid</div>";
            pay = "<button onclick='funPayEBill(this)' disabled>Pay</button>";
        }
        else{
            status = "<div class='label text-warning bg-warning-light'>Pending</div>";
            pay = "<button onclick='funPayEBill(this)'>Pay</button>";
            if(mnow.isAfter(dueDate)){
                bill = bill + eADDC*units;
            }
            eTotal = eTotal + bill - amountPaid;
        }
        table = table + `<tr>
        <td id='Id' class='d-none'><span id='spanrecId'>${recId}</span></td>
        <td id='fromDate'>${from}</td>
        <td id='toDate'>${to}</td>
        <td id='units'>${Reading}-${preReading} = ${units} </td>
        <td id='amount'>${bill}</td>
        <td id='amountPaid'>${amountPaid}</td>
        <td id='dueDate'>${due}</td>
        <td id='rate'> ${rate}/unit </td>
        <td id='status'>${status}</td>
        <td id='pay'>${pay}</td></tr>`;
    }
    table = table + "</tbody>";
    $("#tblEbills").append(table);
    $("#hEB").html(eTotal);
}
function funPayEBill(target){
    
    var row = $(target).closest("tr");
    var recId = $(row).find("#Id").find("#spanrecId").text();
    var bill = $(row).find("#amount").html();
    var status = "1";
    var data = {
        recId:recId,
        amountToPay:bill,
        amountPaid:bill,
        status: status,
        tenantStatus:'1'
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "owner/payBill",
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
            
            console.log(error);

        }
    });
    
}
function funPayWBill(target){
    
    var row = $(target).closest("tr");
    var recId = $(row).find("#Id").find("#spanrecId").text();
    var bill = $(row).find("#amount").html();
    var status = "1";
    var data = {
        recId:recId,
        amountToPay:bill,
        amountPaid:bill,
        status: status,
        tenantStatus:'1'
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "owner/payBill",
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

function getElectricityBills(){
    var floor = $('#drpFloors :selected').val();
    $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "owner/getFloorElectricityBills/"+floor ,
            data: {},
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

function setWaterBills(response){
    $("#spanWMN").text(response.result[0].meterNo);
    let mnow = moment();
     $("#tblWbills").html('');
    var table = 
    `<thead class='thead'>
    <tr>
    <th scope='col' id='Id' class='d-none'>Id</th>
    <th scope='col' id='fromDate'>From Date</th>
    <th scope='col' id='toDate'>To Date</th>
    <th scope='col' id='units'>Units Consumed</th>
    <th scope='col' id='amount'>Bill Amount</th>
    <th scope='col' id='amountPaid'>Amount Paid</th>
    <th scope='col' id='dueDate'>Due Date</th>
    <th scope='col' id='rate'>Rate</th>
    <th scope='col' id='status'>Status</th>
    <th scope='col' id='pay'>Pay</th></tr>
    </thead>`;

    table = table + "<tbody>";
    wTotal = 0;
    for (var i = 0; i < response.result.length; i++) {
        var recId = response.result[i].recId;
        let from = moment(response.result[i].dateFrom).format("DD/MM/YYYY");
        let to = moment(response.result[i].dateTo).format("DD/MM/YYYY");
        let due = moment(response.result[i].dueDate).format("DD/MM/YYYY");
        var preReading = parseInt(response.result[i].preReading);
        var Reading = parseInt(response.result[i].Reading);
        var units = Reading-preReading;
        var rate = wRate;
        var bill = units*rate;
        var amountPaid = parseInt(response.result[i].amountPaid);
        let dueDate = moment(response.result[i].dueDate);
        
        var pay = "";
        var status = response.result[i].status;
        if(status == "1"){
            status = "<div class='label text-success bg-success-light'>Paid</div>";
            pay = "<button onclick='funPayWBill(this)' disabled>Pay</button>";
        }
        else{
            status = "<div class='label text-warning bg-warning-light'>Pending</div>";
            pay = "<button onclick='funPayWBill(this)'>Pay</button>";
            if(mnow.isAfter(dueDate)){
                bill = bill + wADDC*units;
            }
            wTotal = wTotal + bill-amountPaid;
        }
        table = table + `<tr>
        <td id='Id' class='d-none'><span id='spanrecId'>${recId}</span></td>
        <td id='fromDate'>${from}</td>
        <td id='toDate'>${to}</td>
        <td id='units'>${Reading}-${preReading} = ${units} </td>
        <td id='amount'>${bill}</td>
        <td id='amountPaid'>${amountPaid}</td>
        <td id='dueDate'>${due}</td>
        <td id='rate'> ${rate}/unit </td>
        <td id='status'>${status}</td>
        <td id='pay'>${pay}</td></tr>`;
    }
    table = table + "</tbody>";
    $("#tblWbills").append(table);
    $("#hWB").html(wTotal);
}

function getWaterBills(){
    var floor = $('#drpFloors :selected').val();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "owner/getFloorWaterBills/"+floor,
        data: {},
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



function setRentBills(response){
    $("#tblRbills").html('');
    var table = "<thead class='thead'><tr><th scope='col' id='Id' class='d-none'>Id</th><th scope='col' id='name'>Tenant Name</th><th scope='col' id='contact'>Contact</th><th scope='col' id='fromDate'>From Date</th><th scope='col' id='toDate'>To Date</th><th scope='col' id='amount'>Rent Amount</th><th scope='col' id='status'>Status</th></tr></thead>";
    table = table + "<tbody>";
    rTotal = 0;
    for (var i = 0; i < response.result.length; i++) {
        var recId = response.result[i].recId;
        var name = response.result[i].name;
        var contact = response.result[i].contact;
        let from = moment(response.result[i].fromDate).format("DD/MM/YYYY");
        let to = moment(response.result[i].toDate).format("DD/MM/YYYY");
        var rent = parseInt(response.result[i].amount);
        
        var status = response.result[i].status;
        if(status == "1"){
            status = "<div class='label text-success bg-success-light'>Paid</div>";
            rTotal = rTotal + rent;    
        }
        else{
            status = "<div class='label text-warning bg-warning-light'>Pending</div>";
        }
        table = table + "<tr><td id='Id' class='d-none'><span id='spanrecId'> " + recId + "</span></td><td id='name'> " + name + " </td><td id='contact'> " + contact + " </td><td id='fromDate'> " + from + " </td><td id='toDate'> " + to +" </td><td id='amount'>"+rent +"</td><td id='status'> " + status + " </td></tr>";
    }
    table = table + "</tbody>";
    $("#tblRbills").append(table);
    $("#hRB").html(rTotal); 
}

function getRentBills(){
    var floor = $('#drpFloors :selected').val();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "owner/getFloorRentBills/"+floor,
        data: {},
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