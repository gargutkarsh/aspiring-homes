var secId = ''
var pStatus = ''

function setSectorStatus(setPage){
    //console.log("in");
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "parking/getSectorStatus/"+record.username,
            data: {},
            datatype: "json",
            success: function (response) {
                secId=parseInt(response.secId), pStatus=parseInt(response.pStatus);
                $("#sectorId").html(response.secId);
                setPage();
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

function setPage(){
    //console.log("in");
    //console.log(secId + " " + pStatus);
    if(secId == 0){
        window.location = "dashboard.html";
    }

    if(pStatus==0){
        $("#profile-tab").click();
        $("#createParking").removeClass("d-none");
        $("#addSlot").addClass("d-none");
        $("#divRecord").addClass("d-none");
        $("#divNoRecord").removeClass("d-none");
        $("#divMain").addClass("d-none");
    }
    else{
        $("#createParking").html("");
        getSlots();
    }
}

function bindSlots(data){
    console.log(data);
    if(data.length>0){
        var tbody = $("#tblEditSlots tbody");
        tbody.html('');
        var row = ``;

        for (var i = 0; i < data.length; i++) {
            var available = "Available";
            if(data[i].status==0){
                available = "Booked";
            }

            row =  `
                <tr>
                    <td id='Id' hidden>
                        <span id='slotId'>${data[i].slotId}</span>
                        <span id='type'>${data[i].type}</span>
                    </td>
                    <td id='sno'>${i+1}</td>
                    <td id='rowNumber'><input class="form-control" type="text" value="${data[i].row}" onkeyup="setIdentity(this)" name="" id="txtrn"></td>
                    <td id='slotNumber'><input class="form-control" type="text" value="${data[i].slot}" name=""  onkeyup="setIdentity(this)" id="txtsn"></td>
                    <td id='Identity'>${data[i].tag}</td>
                    <td id='slotStatus'>${available}</td>
                </tr>
            `;
            tbody.append(row)
        }
    }
    else{
        $("#divRecord").addClass("d-none");
        $("#divNoRecord").removeClass("d-none");
    }
    
    

}

function getSlots(){
    //console.log("in");
    var type = $("#drpType :selected").val();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: urlbase + "parking/getParkingSlots/"+secId+"/"+type,
        data: {},
        datatype: "json",
        success: function (response) {
           bindSlots(response.data)
        },
        error: function (error){
            console.log(error);
        }
    });
}


$(document).ready(()=> {
    setDashboard();

    setSectorStatus(setPage);
    

    $("#txtSlot").focus(function (e) { 
        e.preventDefault();
        if(!$("#txtRow").valid()){
            $("#txtRow").focus();
            //$("#txtFloor").text("");
        }
    });

     $.validator.addMethod("isSlot", function (value) {
        
        var row = $("#txtRow").val();
        var sectorId = $("#sectorId").html();
        if(sectorId==""){
            setSectorStatus();
            value = "";
            return;
        }
        var data = { row:row,slot: value,secId:sectorId};
        //console.log(JSON.stringify(data));
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: JSON.stringify(data),
                url: urlbase + "parking/checkSlot",
                datatype: "json",
                success: function (data) {
                    return data;
                },
                error: function (error) {

                }
            });

        //console.log(found.responseJSON.match);
        if (found.responseJSON.match) {
            return false;
        }
        else {
            return true;
        }
        //return !found.responseJSON.d;
    }, "This slot already exists");
    
    //setting defaults i.e. border colors
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).removeClass('fieldset');
            $(element).addClass('errorhighlight');
        },
        unhighlight: function (element) {
            $(element).removeClass('errorhighlight');
            $(element).addClass('fieldset');
        }
    });
    // validate signup form on keyup and submit
    $("#addSlot").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            row: {
                required: true
            },
            slot: {
                required: true,
                isSlot:true
            }
        },
        messages: {
            row: {
                required: "Please Enter the row Number"
            },
            slot: {
                required: "Please Enter the slot Number"
            }
        }
    });

    $("#createParking").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            aNo: {
                required: true,
                number:true
            },
            aRow: {
                required: true,
                number:true
            },
            bNo: {
                required: true,
                number:true
            },
            bRow: {
                required: true,
                number:true
            }
        },
        messages: {
            aNo: {
                required: "Please Enter the Value",
                number:"Please Enter the Valid Number"
            },
            aRow: {
                required: "Please Enter the Value",
                number:"Please Enter the Valid Number"
            },
            aNo: {
                required: "Please Enter the Value",
                number:"Please Enter the Valid Number"
            },
            aRow: {
                required: "Please Enter the Value",
                number:"Please Enter the Valid Number"
            }
        }
    });
});

function isValid(field) {
    $(field).valid();
}

$('#txtRow').on("keyup", function () {
    isValid("#txtRow");
});
$('#txtSlot').on("keyup", function () {
    isValid("#txtSlot");
});
$('#txtAllotmentSlots').on("keyup", function () {
    isValid("#txtAllotmentSlots");
});
$('#txtAllotmentRow').on("keyup", function () {
    isValid("#txtAllotmentRow");
});
$('#txtBufferSlots').on("keyup", function () {
    isValid("#txtBufferSlots");
});
$('#txtBufferRow').on("keyup", function () {
    isValid("#txtBufferRow");
});


function resetAddSlot(){
    $("#btnInsertSlot").attr("disabled",false);
    $("#txtRow").removeClass("fieldset");
    $("#txtSlot").removeClass("fieldset");
    $("#txtRow").val("");
    $("#txtSlot").val("");
    getSlots();
}

$("#btnInsertSlot").click(function (e) { 
    e.preventDefault();
    if($("#addSlot").valid() && $("#txtSlot").valid()){
        var type = $("#drpType :selected").val();
        var tag = '';
        if(type=="1"){
            tag = "A/R" + $("#txtRow").val() + "-" + $("#txtSlot").val();
        }
        else{
            tag = "B/R" + $("#txtRow").val() + "-" + $("#txtSlot").val();
        }
        var data = {
            secId:secId,
            row:$("#txtRow").val(),
            slot:$("#txtSlot").val(),
            type:type,
            tag:tag,
            booked_status:0
        }
        //console.log(data);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "parking/insertSlot",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                
                $("#btnInsertSlot").attr("disabled",true);
            },
            success: function (response) {
                if(response.done){
                    //getFlatInfo(1);
                    swal("Slot Created","Successfully","success").then(()=>{
                        resetAddSlot();
                    });
                }
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});

$("#btnCreateSlots").click(function (e) { 
    e.preventDefault();
    if($("#createParking").valid()){
        
        var data = {
            secId:secId,
            aRowSize:parseInt($("#txtAllotmentRow").val()),
            aSlots:parseInt($("#txtAllotmentSlots").val()),
            bRowSize:parseInt($("#txtBufferRow").val()),
            bSlots:parseInt($("#txtBufferSlots").val()),
        }
        //console.log(data);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "parking/createParking",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                $("#saving").modal({
                    show: true,
                    backdrop: 'static',
                    keyboard:false
                });
                //$("#btnSaveInfo").attr("disabled",true);
            },
            success: function (response) {
                if(response.done){
                    //getFlatInfo(1);
                    //$("#saving").hide();
                    swal("Parking Created","Successfully","success").then(()=>{
                        window.location= "parking.html";
                    });
                }
                else{
                    swal("Something went wrong","creating parking unsuccessful","error").then(()=>{
                        window.location= "parking.html";
                    });
                }
                //console.log(response);
            },
            error: function (error) {
                swal("Something went wrong","creating parking unsuccessful","error").then(()=>{
                    window.location= "parking.html";
                });
            }
        });
    }
});

function setIdentity(target){
    var row = $(target).closest("tr");
    var txtrn = $(row).find("#rowNumber").find("#txtrn").val();
    var txtsn = $(row).find("#slotNumber").find("#txtsn").val();
    var type = $(row).find("#Id").find("#type").text();
    var identity = $(row).find("#Identity");

    var tag = '';
    if(type=="1"){
        tag = "A/R" + txtrn + "-" + txtsn;
    }
    else{
        tag = "B/R" + txtrn + "-" + txtsn;
    }
    identity.text(tag);

}

const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)


$("#btnSaveEdit").click(function (e) { 
    e.preventDefault();
    var rows = $("#tblEditSlots tbody tr");
    var data = [];
    var identity =[];
    //console.log(rows);
    for(var i=0;i<rows.length;i++){
        var row = $(rows[i]);
  
        var txtrn = $(row).find("#rowNumber").find("#txtrn").val();
        var txtsn = $(row).find("#slotNumber").find("#txtsn").val();

        if(txtrn==""){
            swal("Error","some fields are empty","error").then(()=>{
                $(row).find("#rowNumber").find("#txtrn").focus();
            });
            return;
        }
        if(txtsn==""){
            swal("Error","some fields are empty","error").then(()=>{
                $(row).find("#slotNumber").find("#txtsn").focus();
            });
            return;
        }
        
        var id = $(row).find("#Identity").text();
        var slotId = $(row).find("#Id").find("#slotId").text();
        identity.push(id);

        var obj = {
            slotId:slotId,
            tag:id,
            row:txtrn,
            slot:txtsn
        }

        data.push(obj);
        //console.log(txtrn);
    }

    //console.log(identity);
    //console.log(data);
    //console.log(JSON.stringify(data));
    
    const duplicateElements = toFindDuplicates(identity);
    //console.log(duplicateElements);

    if(duplicateElements.length>0){
        swal("Error",`duplicate values of ${duplicateElements.toString()}`,"error");
        return;
    }
    
    //console.log(data);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "parking/saveParking",
        data: JSON.stringify(data),
        datatype: "json",
        beforeSend: function () {
            $("#saving").modal({
                show: true,
                backdrop: 'static',
                keyboard:false
            });
            //$("#btnSaveInfo").attr("disabled",true);
        },
        success: function (response) {
            if(response.done){
                //getFlatInfo(1);
                //$("#saving").hide();
                swal("Data Saved","Successfully","success").then(()=>{
                    window.location= "parking.html";
                });
            }
            else{
                swal("Something went wrong","save parking unsuccessful","error").then(()=>{
                    window.location= "parking.html";
                });
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
            swal("Something went wrong","save parking unsuccessful","error").then(()=>{
                    window.location= "parking.html";
                });
        }
    });
});

$("#cancelEdit").click(function (e) { 
    e.preventDefault();
    getSlots();
});