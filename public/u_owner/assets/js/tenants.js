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

                    getTenantInfo();
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

function setShowTenant(){
    $("#btnRemoveTenant").removeClass("d-none");
    $("#divShowTenant").removeClass("d-none");

    $("#btnAllotTenant").addClass("d-none");
    $("#divAllotTenant").addClass("d-none");
}

function setAllotTenant(){
    $("#btnRemoveTenant").addClass("d-none");
    $("#divShowTenant").addClass("d-none");

    $("#btnAllotTenant").removeClass("d-none");
    $("#divAllotTenant").removeClass("d-none");

}

function setFloorInfo(data){
    $("#txtFloor").val(data.floor);
    $("#txtRent").val(data.rent);
    $("#txtEMR").val(data.eReading);
    $("#txtWMR").val(data.wReading);
    
}

function getFloorInfo(){
    var floor = $('#drpFloors :selected').val();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "owner/getFloorInfo/"+floor,
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.found) {
                setFloorInfo(response);
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

function setTenantInfo(data){
     $("#spanFN").text(data.floor);
     $("#spanRent").text(data.rent);
     $("#spanEMR").text(data.eReading);
     $("#spanWMR").text(data.wReading);
    let m1 = moment(data.date).format("DD/MM/YYYY");
    $("#spanDate").text(m1);

    $("#imgProfile").attr('src', imgbase + data.profile);
    $("#spantId").text(data.tId);
    $("#spanName").text(data.name);
    $("#spanPhone").text(data.phone);
    $("#spanEmail").text(data.email);
}

function getTenantInfo(){
    var floor = $('#drpFloors :selected').val();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "owner/getTenantInfo/"+floor,
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.found) {
                setShowTenant();
                setTenantInfo(response);
            }
            else {
                setAllotTenant();
                getFloorInfo();
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

$("#btnAllotFloor").click(function (e) { 
    e.preventDefault();
    if($("#registerFloorTenantForm").valid()){
            if (!$("#user_otp-error").hasClass("verified")) {
                swal("Warning!", "Verify your Email first!,", "warning");
            }            
            else{
                
                var floor = $('#drpFloors :selected').val();
                let d = moment();
                var record = {
                        eReading:$("#txtEMR").val(),
                        wReading:$("#txtWMR").val(),
                        username: $("#txtTU").val(),
                        fId: floor,
                        date: d.format("YYYY-MM-DD"),
                        houseNo:d.add(1,'M').format("YYYY-MM-DD")                        
                };
                
                //console.log(data);
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    async: true,
                    url: urlbase + "owner/setFloorTenant",
                    data: JSON.stringify(record),
                    datatype: "json",
                    beforeSend: function () {
                        //  $("#saving").modal({
                        //     show: true,
                        //     backdrop: 'static',
                        //     keyboard:false
                        // });
                    },
                    success: function (response) {
                        if(response.done){
                            // swal("Tenant Registered","Successfully","success");
                            // getTenantInfo();
                            window.location = "tenants.html";

                        }
                        //console.log(response);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            

          }
    
});


$("#btnRemoveTenant").click(function (e) { 
    e.preventDefault();
     swal({
        title: "Are you sure?",
        text: "Once removed, All this Imaginary data can't be restored Note: All of the Rents and Bills are supposed to be paid",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        })
        .then((willDelete) => {
        if (willDelete) {
            var floor = $('#drpFloors :selected').val();
            
            $.ajax({
                type: "POST",
                contentType: "application/json",
                async: true,
                url: urlbase + "owner/removeFloorTenant/"+$("#spantId").text() + "/" + floor,
                data: {},
                datatype: "json",
                beforeSend: function () {
                    //     $("#saving").modal({
                    //     show: true,
                    //     backdrop: 'static',
                    //     keyboard:false
                    // });
                },
                success: function (response) {
                    if(response.done){
                        //resetForm();
                        //     swal("Poof! Tenant has been removed!", {
                        //     icon: "success",
                        // });
                        window.location = "tenants.html";
                    }
                    //console.log(response);
                },
                error: function (error) {
                    console.log(error);
                }
            });

        } else {
            swal("Your imaginary file is safe!");
        }
        });

});

$(document).ready(function () {
    setDashboard();
    bindSelectFloor();
    //validator to check emailId is unique or not
    $.validator.addMethod("validUsername", function (value) {
        //var data = { email: value };
        //console.log(JSON.stringify(data));
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: {},
                url: urlbase + "owner/checkTenantUser/" + value,
                datatype: "json",
                success: function (data) {
                    return data;
                },
                error: function (error) {

                }
            });
        if (found.responseJSON.match) {
            return true;
        }
        else {
            return false;
        }
        //return !found.responseJSON.d;
    }, "Invalid Username");

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
    $("#registerFloorTenantForm").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            floor: {
                required: true
            },
            rent: {
                required: true,
                number : true
            },
            emReading:{
                required:true
            },
            wmReading:{
                required:true
            },
            username:{
                required:true,
                minlength:6,
                validUsername:true
            }
            
        },
        messages: {
             floor: {
                required: "Please Enter the Floor Number"
            },
            rent: {
                required: "Please Enter the Rent",
                number:"Please Enter Valid Rent"
            },
            emReading:{
                required:"Please Enter the Present Reading"
            },
            wmReading:{
                required:"Please Enter the Present Reading"
            },
            username:{
                required:"Please Fill this Field",
                minlength:""
            }
        }
    });

    

});

function isValid(field) {
    $(field).valid();
}
$('#txtFloor').on("keyup", function () {
    isValid("#txtFloor");
});
$('#txtRent').on("keyup", function () {
    isValid("#txtRent");
});
$('#txtEMR').on("keyup", function () {
    isValid("#txtEMR");
});
$('#txtWMR').on("keyup", function () {
    isValid("#txtWMR");
});
$('#txtTU').on("keyup", function () {
    isValid("#txtTU");
});

//send otp
$("#btn_otp").on("click", function () {
    if ($("#txtTU").valid()) {
        var floor = $('#drpFloors :selected').val();
        //console.log(data);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "minor/sendTenantOTP/" + $("#txtTU").val() + "/"+floor,
            //data: "{'admininfo':" + JSON.stringify(data) + "}",
            data: {},
            datatype: "json",
            beforeSend: function () {

                $("#i_send_otp").removeClass("d-none");
                $("#btn_otp").attr('disabled', true);
                $("#span_send_otp").text("Sending..");
            },
            success: function (response) {
                //console.log(response);
            },
            complete: function () {
                setTimeout(function () {
                    $("#i_send_otp").addClass("d-none");
                    $("#btn_otp").attr('disabled', false);
                    $("#span_send_otp").text("RESEND");
                    $("#user_otp").attr('placeholder', "Enter the OTP");
                    $("#user_otp").focus();
                    $("#user_otp").attr('disabled', false);
                    $("#btn_verify_otp").attr('disabled', false);
                    
                }, 2000);
            },
            error: function (error) {
                //if (!navigator.onLine) {
                //    window.location = "errors-404-error.html";
                //}
                //alert('error : ' + error);
                console.log(error);

            }
        });

    }
    else{ $("#txtTU").focus() }
    
    
});

//validate otp
$("#user_otp").on("keyup", function () {
    //console.log("in");
    if (!$("#user_otp-error").hasClass("d-none")) {
        $("#user_otp-error").addClass("d-none")
    }
    if ($("#user_otp").val().length == 0) {
        $("#user_otp-error").removeClass("d-none");
        $("#user_otp-error").text("Please enter the otp");
        $("#btn_verify_otp").attr('disabled',true);
        return;
    }
    if ($("#user_otp").val().length < 6) {
        $("#user_otp-error").removeClass("d-none");
        $("#user_otp-error").text("Complete the 6 characters");
        $("#btn_verify_otp").attr('disabled',true);
        return;
    }
    $("#user_otp-error").addClass("d-none");
    $("#btn_verify_otp").click();
    
});

    //verify otp
$("#btn_verify_otp").on("click", function () {
    if ($("#user_otp").val() == "") {
        $("#user_otp-error").removeClass("d-none");
        $("#user_otp").focus();
        return;
    }
    if ($("#user_otp").val().length < 6) {
        $("#user_otp-error").removeClass("d-none");
        $("#user_otp-error").text("Complete the 6 characters");
        $("#user_otp").focus();
        return;
    }
    var data = { otp: $("#user_otp").val(), username: $("#txtTU").val() };
    //var data = { otp: "234356", email: "gkunal13579@gmail.com" };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/checkTenantOTP/"+data.username+"/"+data.otp,
        data: {},
        datatype: "json",
        beforeSend: function () {
            $("#i_check_otp").removeClass("d-none");
            $("#btn_otp").attr('disabled', true);
            $("#btn_verify_otp").attr('disabled', true);
            $("#span_verify_otp").text("cheking..");
        },
        success: function (response) {
            console.log(response.match);
            if (response.match) {
                setTimeout(function () {
                    $("#i_check_otp").addClass("d-none");
                    $("#i_verified_otp").removeClass("d-none");
                    $("#span_verify_otp").text("Verified");
                    $("#user_otp").attr('disabled', true);
                    $("#txtTU").attr('disabled', true);
                    $("#user_otp-error").addClass("d-none");
                    $("#user_otp-error").addClass("verified");
                }, 1000);


            }
            else {
                setTimeout(function () {
                    $("#i_check_otp").addClass("d-none");
                    $("#i_verified_otp").addClass("d-none");
                    $("#span_verify_otp").text("Verify");
                    $("#user_otp").attr('disabled', false);
                    $("#btn_verify_otp").attr('disabled', false);
                    $("#btn_otp").attr('disabled', false);
                    $("#txtTU").attr('disabled', false);

                    $("#user_otp-error").removeClass("d-none");
                    $("#user_otp-error").text("Wrong OTP!");
                }, 1000);
            }
        },
        complete: function (response) {
            
        },
        error: function (error) {

        }

    });
});

