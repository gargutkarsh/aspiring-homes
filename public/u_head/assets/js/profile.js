function setDashboard(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "admin/setDashboard",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.name != ""){
            $(".headName").html(response.name);
            $("#headProfile").attr('src',imgbase + response.profile);
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

$(document).ready(function () {
    setDashboard();
});