var crossImg = 0;

function getProfile(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "president/getProfile",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.data){
                $("#name").val(response.name);
                $("#phone").val(response.phone);
                $("#email").val(response.email);
                $("#username").val(response.username);
                $("#profile-img").attr('src',imgbase + response.profile);
                $("#profile-wrapper").addClass("active");
                $("#imgFront").attr('src',imgbase + response.front);
                $("#imgBack").attr('src',imgbase + response.back);
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
        image.append('profile',img);
        
        $.ajax({
            url: urlbase + 'president/updateProfileImage',
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
        var data = {
            username:dataL.username,
            password:dataL.password,
            name : $("#name").val(),
            phone : $("#phone").val(),
            profile: path
        }
        
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "president/setProfile",
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