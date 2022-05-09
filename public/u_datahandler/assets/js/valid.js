var urlbase = "http://localhost:5000/";
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
            if(response.status != "1" || response.auth != "3"){
            window.location = "../404.html";
            }
        },
        error: function (error) {
            //console.log(error);
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
        url: urlbase + "dataHandler/setDashboard",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.name != ""){
                $(".dhName").html(response.name);
                $("#dhProfile").attr('src',imgbase + response.profile);
                $("#sectorName").html(response.sector);
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