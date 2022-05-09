var crossImg = 0;

function setDonnerAge(data){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/setDonnerAge",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.done){
                getProfile();
            }
            //else logout();
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getProfile(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "tenant/getProfile",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.data){
                let m = moment();
                let m2 = moment(response.dateModified);
                if(m.isAfter(m2)){
                    var bind = {
                        dId:0,
                        username:data.username,
                        age:parseInt(response.age) + 1,
                        date : m2.add(1,'y').format("YYYY-MM-DD")
                    }
                    setDonnerAge(bind);
                }
                else{
                    $("#name").val(response.name);
                    $("#phone").val(response.phone);
                    $("#email").val(response.email);
                    $("#username").val(response.username);
                    $("#profile-img").attr('src',imgbase + response.profile);
                    $("#profile-wrapper").addClass("active");
                    let m1 = moment(response.date).format("DD/MM/YYYY");
                    $("#spanDate").text(m1);

                    $('#drpBG').val(response.bloodGroup);
                    $("#age").val(parseInt(response.age));
                    // $("#age").attr("min",parseInt(response.age));
                    $("#spanAge").text(response.age);
                    $("#spanDM").text(response.dateModified);

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

$("#btnSaveProfile").click(function (e) { 
    e.preventDefault();
    console.log(crossImg);
    
    if($("#profile-wrapper").hasClass("active") && crossImg==1){
        var img = $("#profile_choose").get(0).files[0];
        
        var image = new FormData();
        image.append("profile",img);
        
        $.ajax({
            url: urlbase + 'tenant/updateProfileImage',
            type: "POST",
            async:false,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: image,
            beforeSend: function () {
                // $("#saving").modal({
                //     show: true,
                //     backdrop: 'static',
                //     keyboard:false
                // });
            },
            success: function (response) {
                updateProfile(response.path);
                $("#user").attr('src', imgbase + response.path);
                //console.log(response);
                
            },
            error: function (err) {
                alert(err.statusText);
            }
        });
    }

    else{
        updateProfile("");
    }
});


function updateProfile(path){
    var dataString = localStorage.getItem("rup-user");
    
    if (dataString) {
        var dataL = JSON.parse(dataString);
        
        var bg = $('#drpBG :selected').val();
        var datem =  $("#spanDM").text();
        if(datem == "" || $("#age").val()!=$("#spanAge").text()){
            // if(parseInt(age)<parseInt($("#spanAge").text())){
            //     age = $("#spanAge").text();
            // }
            datem = moment().add(1,'y').format("YYYY-MM-DD");
        }

        var data = {
            username:dataL.username,
            password:dataL.password,
            name : $("#name").val(),
            phone : $("#phone").val(),
            email : $("#email").val(),
            bloodGroup :bg, 
            profile: path,
            age : $("#age").val(),
            date: datem
        }
        
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "tenant/setProfile",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
           if(response.done){
                swal("Changes Saved","Successfully","success");
                setDashboard();
                getProfile();
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
    getProfile();

    var custom_profile_btn = $("#choose-profile");
    var main_profile_btn = document.querySelector("#profile_choose");
    custom_profile_btn.on("click", function () {
        
        main_profile_btn.click();
    });
    main_profile_btn.addEventListener("change", function () {
        
        const wrapper = document.querySelector("#profile-wrapper");
        const img_src = document.querySelector("#profile-img");
        const cancel_btn = document.querySelector("#profile-cancel");

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                crossImg=1;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                crossImg = 1;
                wrapper.classList.remove("active");
            });
            reader.readAsDataURL(file);
        }

    });

    $("#profile-cancel").click(function(){
        const wrapper = document.querySelector("#profile-wrapper");
        const img_src = document.querySelector("#profile-img");
        img_src.src = "";
        crossImg = 1;
        wrapper.classList.remove("active");
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