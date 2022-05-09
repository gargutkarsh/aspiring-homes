$(document).ready(function () {
    setDashboard();
$("#changePassword").validate({
    rules: {
        password: {
            required: true,
            minlength: 8,
            maxlength: 20
        },
        cPassword:{
            required:true,
            equalTo:"#np"
        }
    },
    messages: {
        
        password: {
            required: "Please provide a password",
            minlength: "at least 8 characters long",
            maxlength: "at max 20 characters long"
        },

        cPassword:{
            required:"Please Enter this Field",
            equalTo: "Password Mismatch"
        }
        
    }
});

function isValid(field) {
    $(field).valid();
}
$('#np').on("keyup", function () {
    isValid("#np");
});
$('#cnp').on("keyup", function () {
    isValid("#cnp");
});

$('#op').on("keyup", function () {
    $("#divWp").addClass("d-none");
});

$("#btnChangePassword").click(function (e) { 
    e.preventDefault();
    if($("#changePassword").valid()){
        var dataString = localStorage.getItem("rup-user");
        if (dataString) {
            var dataL = JSON.parse(dataString);
            if($("#op").val()==dataL.password){
                var data  = {
                    username:dataL.username,
                    password:dataL.password,
                    newPassword:$("#np").val()
                }

                $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                url: urlbase + "tenant/changePassword",
                data: JSON.stringify(data),
                datatype: "json",
                success: function (response) {
                    if(response.done){
                        $("#op").val("");
                        $("#np").val("");
                        $("#cnp").val("");
                        dataL.password = data.newPassword;
                        localStorage.setItem("rup-user",JSON.stringify(dataL));
                        swal("Password Changed","Successfully","success");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
                });
            }
            else{
                //console.log($("#divWp"));

                $("#divWp").removeClass("d-none");
                 //console.log($("#divWp"));

            }
            
        }
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