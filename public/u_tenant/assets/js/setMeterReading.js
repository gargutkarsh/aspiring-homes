var floor_id = "";
var tId = "";

function setFloorInfo(data){
    console.log(data);
    floor_id = data.fId;
    tId = data.tId;
    $("#txtFloor").val(data.floor);
    $("#txtEMR").val(data.eReading);
    $("#txtWMR").val(data.wReading);
    
}

function getFloorInfo(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        console.log(record);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "tenant/getDefaultReadings/"+record.username,
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
    
}

$(document).ready(function () {
    setDashboard();
    getFloorInfo();
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
    $("#setMeterReadings").validate({
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
            emReading:{
                required:true,
                number:true
            },
            wmReading:{
                required:true,
                number:true
            }
            
        },
        messages: {
            floor: {
                required: "Please Enter the Floor Number"
            },
            emReading:{
                required:"Please Enter the Present Reading",
                number:"Enter a Valid Reading"
            },
            wmReading:{
                required:"Please Enter the Present Reading",
                number:"Enter a Valid Reading"
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

$('#txtEMR').on("keyup", function () {
    isValid("#txtEMR");
});
$('#txtWMR').on("keyup", function () {
    isValid("#txtWMR");
});

$("#btnSetReading").click(function (e) { 
    e.preventDefault();
    if($("#setMeterReadings").valid()){
            if (!$("#user_otp-error").hasClass("verified")) {
                swal("Warning!", "Verify the Owner Agreement!,", "warning");
            }            
            else{
                
                var record = {
                        eReading:$("#txtEMR").val(),
                        wReading:$("#txtWMR").val(),
                        fId: floor_id                       
                };
                
                //console.log(data);
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    async: true,
                    url: urlbase + "tenant/setInitialReadings",
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
                            swal("Reading Modified","Successfully","success");
                            // getTenantInfo();
                            setTimeout(() => {
                                window.location = "dashboard.html";
                            }, 1500);
                            

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
//send otp
$("#btn_otp").on("click", function () {
     $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "tenant/sendOwnerOTP/"+floor_id+"/"+tId,
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
    var data = { otp: $("#user_otp").val(), tId: tId };
    //var data = { otp: "234356", email: "gkunal13579@gmail.com" };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "tenant/checkOwnerOTP/"+data.tId+"/"+data.otp,
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
                    $("#user_otp-error").addClass("d-none");
                    $("#user_otp-error").addClass("verified");
                    $("#txtEMR").attr('disabled', true);
                    $("#txtWMR").attr('disabled', true);
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