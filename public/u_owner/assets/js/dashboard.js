var forName = "";

$(document).ready(function () {
    setDashboard();
    getPatient();
});

function setCustom(){
    $("#selectName").html('');
    $("#selectName").addClass("d-none");
    $("#txtName").removeClass("d-none");
    $("#txtName").focus();
    
    $("#btnISD").removeClass("d-none");

    $("#btnISD").attr("disabled",false);
    $("#txtAge").attr("disabled",false);
    $("#txtAge").val(0);
}
function setDefault(){
    $("#selectName").removeClass("d-none");
    $("#txtName").addClass("d-none");
    $("#btnISD").addClass("d-none");
    $("#btnISD").attr("disabled",false);
    $("#txtAge").attr("disabled",true);
    $("#tblBGD").html("");

}

function setPatient(response){
    $("#selectName").html("");
    var list = "";
    for (var i = 0; i < response.result.length; i++) {
        list = list + "<option value='" + response.result[i].age + "'>" + response.result[i].mainName + "</option>";
    }
    $("#selectName").append(list);
    $("#selectName").append("<option value = 'other'>Other</option>");
    
    //console.log("forname:"+ forName)
    if(forName!=""){
        $("#selectName option").filter(function() {
            return this.text == forName; 
        }).attr('selected', true);
        
        forName = "";
    }
    getBloodGroupDonner();
}

function getPatient(){
    setDefault();
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        $("#spanNA").addClass("d-none");
        $("#divNR").addClass("d-none");
        var bg = $('#drpBG :selected').val();
        var info = {
            bloodGroup : bg,
            username : data.username
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "minor/getPatient",
            data: JSON.stringify(info),
            datatype: "json",
            success: function (response) {
                if(response.able){
                    if(response.data){
                        setPatient(response);
                    }
                    else{
                        setCustom();
                    }
                }
                
                else{
                    $("#spanNA").removeClass("d-none");
                }
            },
            error: function (error) {
                console.log(error);

            }
        });
    }

}


function makeRequest(target){
    
    var row = $(target).closest("tr");
    var mName = $(row).find("#Id").find("#spanMName").text();
    var cName = $(row).find("#Id").find("#spanName").text();
    var email = $(row).find("#Id").find("#spanEmail").text();
    var age = $(row).find("#age").html();
    
    if($("#txtTime").val()==""){
        $("#txtTime").focus();
        return;
    }
    if($("#txtAddress").val()==""){
        $("#txtAddress").focus();
        return;
    }
    if($("#txtAmount").val()==""){
        $("#txtAmount").focus();
        return;
    }
    if($("#txtContact").val()==""){
        $("#txtContact").focus();
        return;
    }

    var data = {
        cMainName : mName,
        cName : cName,
        cEmail : email,
        cAge : age,
        bg : $('#drpBG :selected').val(),
        pAge : $('#selectName :selected').val(),
        pName : $('#selectName :selected').text(),
        pcName : $(".ownerName").html(),
        withIn : $("#txtTime").val(),
        at : $("#txtAddress").val(),
        amount : $("#txtAmount").val(),
        contacts : $("#txtContact").val()
    }
    //console.log(data);
    //console.log(bg,ageC,pname);
    $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "minor/makeRequest",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                $("#btnISD").attr("disabled",true);
            },
            success: function (response) {
                if(response.done){
                    Lobibox.notify('info', {
                        size:'mini',
                        delay:2000,
                        delayIndicator: false,
                        rounded: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'fa fa-info-circle',
                        msg: `Your Request has been sent to ${mName}, ${age} - ${cName}`
                    })
                }
                else{
                    Lobibox.notify('danger', {
                        size:'mini',
                        delay:2000,
                        delayIndicator: false,
                        rounded: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'fa fa-info-circle',
                        msg: `Something went wrong please try again`
                    })
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    
}


function setBloodGroupDonner(response){
    $("#tblBGD").html('');
    // var table = 
    // `<thead class='thead'>
    // <tr>
    // <th scope='col' id='sno'>SNo.</th>
    // <th scope='col' id='mainName'>Main Name</th>
    // <th scope='col' id='age'>Age</th>
    // <th scope='col' id='contactName'>Contact Name</th>
    // <th scope='col' id='contact'>Contact</th>
    // <th scope='col' id='email'>Email</th>
    // </thead>`;

    // table = table + "<tbody>";
    // for (var i = 0; i < response.result.length; i++) {
    //     table = table + `<tr>
    //     <td id='sno'>${i+1}</td>
    //     <td id='mainName'>${response.result[i].mainName}</td>
    //     <td id='age'>${response.result[i].age}</td>
    //     <td id='contactName'>${response.result[i].name}</td>
    //     <td id='contact'>${response.result[i].phone}</td>
    //     <td id='email'>${response.result[i].email} </td>
    //     </tr>`;
    // }
    // table = table + "</tbody>";

    var table = 
    `<thead class='thead'>
    <tr>
    <th scope='col' id='Id' hidden>Id</th>
    <th scope='col' id='sno'>SNo.</th>
    <th scope='col' id='mainName'>Main Name</th>
    <th scope='col' id='age'>Age</th>
    <th scope='col' id='contactName'>Contact Name</th>
    <th scope='col' id='request'>Contact</th>
    
    </thead>`;

    table = table + "<tbody>";
    for (var i = 0; i < response.result.length; i++) {
        var mkr = "<button class='btn-info pr-2 pl-2' onclick='makeRequest(this);'>Make Request</button>";
        table = table + `<tr>
        <td id='Id' hidden>
            <span id='spanMName'>${response.result[i].mainName}</span>
            <span id='spanName'>${response.result[i].name}</span>
            <span id='spanEmail'>${response.result[i].email}</span>
            <span id='spanAge' hidden>${response.result[i].age}</span>
        </td>
        <td id='sno'>${i+1}</td>
        <td id='mainName'>${response.result[i].mainName}</td>
        <td id='age'>${response.result[i].age}</td>
        <td id='contactName'>${response.result[i].name}</td>
        <td id='request'>${mkr}</td>
        </tr>`;
    }
    table = table + "</tbody>";
    $("#tblBGD").append(table);
}

function getBloodGroupDonner(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        $("#divNR").addClass("d-none");
        var bg = $('#drpBG :selected').val();
        var age = $('#selectName :selected').val();
        $("#txtAge").val(age);
        $("#txtAge").attr("disabled",true);

        var info = {
            bloodGroup : bg,
            age:age,
            username : data.username
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "minor/getBloodGroupDonner",
            data: JSON.stringify(info),
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    setBloodGroupDonner(response);
                }
                else {
                    $("#tblBGD").html('');
                    $("#divNR").removeClass("d-none");
                }
            },
            error: function (error){
                console.log(error);
            }
        });
    }
}

function selectChange(){
    $("#tblBGD").html('');
    //console.log($("#tblBGD").html());
    var val = $('#selectName :selected').val();
    if(val=="other"){
        setCustom();
    }
    else{
        getBloodGroupDonner();
    }
}

$("#btnISD").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        var bg = $('#drpBG :selected').val();
        forName = $("#txtName").val();
        if(forName=="" || forName.length<3){
            $("#txtName").focus();
            return;
        }
        var data = {
            mainName:$("#txtName").val(),
            age:$("#txtAge").val(),
            date:moment().add(1,'y').format("YYYY-MM-DD"),
            bloodGroup :bg,
            username:record.username
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "minor/createDefaultDonner",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                $("#btnISD").attr("disabled",true);
            },
            success: function (response) {
                if(response.done){
                    getPatient();
                }
                else{
                    swal("Something Wrong","Failed to Search Data","danger");
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});