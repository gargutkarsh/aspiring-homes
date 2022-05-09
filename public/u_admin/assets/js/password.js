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
                url: urlbase + "president/changePassword",
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
