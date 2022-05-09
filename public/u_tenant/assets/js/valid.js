var urlbase = "http://localhost:5000/";
var tenantStatus = "";
var tId = "";

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
            if(response.status != "1" || response.auth != "5"){
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
        url: urlbase + "tenant/setDashboard",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.name != ""){
                $(".tenantName").html(response.name);
                $("#tenantProfile").attr('src',imgbase + response.profile);
                $("#spanHouse").html(response.house);
                tenantStatus = response.tenantStatus;
                tId = response.tId;
                if(response.rStatus=="1" || response.tenantStatus=="0"){
                    $("#optionSetReading").addClass("d-none");
                     var w = window.location.pathname;
                    if(w=="/u_tenant/setMeterReading.html"){
                        window.location = "../404.html";
                    }
                }

                if(response.tenantStatus=="0"){

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




