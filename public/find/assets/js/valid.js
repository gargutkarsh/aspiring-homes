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
            if(response.auth != "6" && response.auth != "5" && response.auth != "4"  ){
                window.location = "../404.html";
            }

            //to chk this condition valid.js must be after after nav.js
            // if(authId=="5"&&authStatus=="1"){
            //     //window.location = "../404.html";
                
            //     //this is the case is user is tenant and registered in a flat already
            // }
        },
        error: function (error) {
            console.log(error);
        }
        });
    }
    else{
        //console.log("in");
        //window.location = "../404.html";
    }
}
window.addEventListener("load", () => {
    //console.log("call");
    checkAuthority();
    //fixPropertyTo(getFlatsList);
});

function fixPropertyTo(callback){
    //console.log(authId,authStatus);
    if(authId=="4"){
        $('#propertyTo').val("buy").change();
        $('#propertyTo').attr("disabled",true);
        callback();
    }
    else if(authId=="5" && authStatus == "0"){
        $('#propertyTo').val("rent").change();
        //console.log($('#propertyTo :selected').val());
        $('#propertyTo').attr("disabled",true);
        callback();
    }
    else{
        callback();
    }
}


// function setDashboard(){
//     var dataString = localStorage.getItem("rup-user");
//     if (dataString) {
//         var data = JSON.parse(dataString);
//         //console.log(data.username + " " + data.password);
//         $.ajax({
//         type: "POST",
//         contentType: "application/json",
//         async: true,
//         url: urlbase + "owner/setDashboard",
//         data: JSON.stringify(data),
//         datatype: "json",
//         success: function (response) {
//             if(response.name != ""){
//                 $(".ownerName").html(response.name);
//                 $("#ownerProfile").attr('src',imgbase + response.profile);
//                 $("#spanHouse").html(response.house);
//             }
//             //else logout();
//             //console.log(response);
//         },
//         error: function (error) {
//             console.log(error);
//         }
//         });
//     }
// }

