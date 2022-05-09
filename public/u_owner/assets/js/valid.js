var urlbase = "http://localhost:5000/";
var ownId = ""
function checkAuthority(){
    //console.log("there");
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        //console.log("have");
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: false,
        url: urlbase + "minor/getUserdata",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            //console.log(response);
            if(response.status != "1" || response.auth != "4"){
            window.location = "../404.html";
            }
        },
        error: function (error) {
            console.log(error);
        }
        });
    }
    else{
        //console.log("in");
        window.location = "../404.html";
    }
}
window.addEventListener("load", () => {
    //console.log("call");
    checkAuthority();
});

function setDashboard(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "owner/setDashboard",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.name != ""){
                $(".ownerName").html(response.name);
                $("#ownerProfile").attr('src',imgbase + response.profile);
                $("#spanHouse").html(response.house);
                ownId = response.ownId;
                if(response.ownCount=="0"){
                    $("#liDeleteAccount").removeClass("d-none");
                }
            }
            //else logout();
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
        });
    }
}

$("#delete_password").keyup(function (e) { 
    if($("#delete_password").val().length>0){
        $("#lblIPE").addClass("d-none");
    }
});

function deleteAccount(data){
    console.log(data);
    $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlbase + "owner/deleteAccount",
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
            ownId:ownId,
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

$("#closeMsg").click(function (e) { 
    e.preventDefault();
    $("#delete_password").val('');
});