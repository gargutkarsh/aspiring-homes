function show_password(){
    //console.log("in");
    const show = document.querySelector("#show_password i");
    const field = document.querySelector("#Password");
    show.classList.add("hide-btn");
    if (field.type === "password") {
        field.type = "text";
        show.classList.add("hide-btn");
    } else {
        field.type = "password";
        show.classList.remove("hide-btn");
    }
}

function getList(){
     var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var info = JSON.parse(dataString);
        //console.log(JSON.stringify(info));
        $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "president/getGuardList",
        data: JSON.stringify(info),
        datatype: "json",
        success: function (response) {
            if (response.result.length > 0) {
                $("#tblGuardList").html('');
                var table = "<thead><tr><th scope='col' id='cId' class='d-none'>Id</th><th scope='col'>Name</th><th scope='col'>Status</th><th scope='col'>Info</th></tr></thead>";
                table = table + "<tbody>";
                for (var i = 0; i < response.result.length; i++) {
                    var status = "";
                    if(response.result[i].status=="0"){
                        status = "<span class='text-danger status'>On Hold</span>";
                    }
                    else if(response.result[i].status=="1"){
                        status = "<span class='text-success status'>Active</span>";
                    }
                    else if(response.result[i].status=="2"){
                        status = "<span class='text-warning status'>Verification Pending</span>";
                    }
                    // let date = moment(response.result[i].date).format("DD/MM/YYYY");
                    table = table + "<tr><td id='cId' class='d-none'> " + response.result[i].cId + " </td><td> <img src='"+imgbase + response.result[i].profile+"' class='avatar avatar-30 mr-2' alt='pic'/> " + response.result[i].name +" </td><td> " + status + " </td><td><a href='javascript:' aid = " + response.result[i].cId + " onclick='funGuardInfo(this)' ><i class='fas fa-info-circle'></i></a></td></tr>";
                }
                table = table + "</tbody>";
                $("#tblGuardList").append(table);
                //bindRequestInfo();
                //console.log($("#spancId").text());
            }
            else {
                $("#tblGuardList").html('');
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



function setGuardInfo(data){

    //console.log(data);

    $("#divSDI").removeClass("d-none");

    var status = "";
    if(data.status=="0"){
        status = "On Hold";
    }
    else if(data.status=="1"){
        status = "Active";
    }
    else if(data.status=="2"){
        status = "Verification Pending";
    }

    $("#spanStatus").text(status);
    let m1 = moment(data.date).format("DD/MM/YYYY");
    $("#spanDate").text(m1);

    $("#imgProfile").attr('src', imgbase + data.profile);

    $("#txtName").val(data.name);
    $("#txtPhone").val(data.phone);
    $("#txtEmail").val(data.email);
    $("#Username").val(data.username);
    $("#Password").val(data.password);
    
    $("#txtName").addClass("fieldset");
    $("#txtPhone").addClass("fieldset");
    $("#txtEmail").addClass("fieldset");
    $("#Username").addClass("fieldset");
    $("#Password").addClass("fieldset");

    
    $("#txtEmail").attr("disabled", true);
    $("#Username").attr("disabled", true);

    $("#divCreate").addClass("d-none");
    $("#divEdit").removeClass("d-none");
}

function getGuardInfo(){
    var cId = $("#spancId").text();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        async: true,
        url: urlbase + "parking/getGuardInfo/" + cId,
        data: {},
        datatype: "json",
        success: function (response) {
            if(response.found){
                //console.log(response);
                
                //let m1 = moment(response.date).format("DD/MM/YYYY");
                //console.log(m1);
               setGuardInfo(response);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function funGuardInfo(target){
    var cId = $(target).attr("aid");
    $("#spancId").text(cId);
    getGuardInfo();
}

$(document).ready(function () {
    setDashboard();
    getList();
    //validator to check emailId is unique or not
    $.validator.addMethod("haveAccount", function (value) {
        //var data = { email: value };
        //console.log(JSON.stringify(data));
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: {},
                url: urlbase + "parking/checkAccount/" + value,
                datatype: "json",
                success: function (data) {
                    return data;
                },
                error: function (error) {

                }
            });
        if (found.responseJSON.match) {
            return false;
        }
        else {
            return true;
        }
        //return !found.responseJSON.d;
    }, "In Use");
    
    //validator to check user name is available or not
    
    $.validator.addMethod("chkUsername", function (value) {
        
        var data = { username: value };
        var found = $.ajax({
            type: "POST",
            contentType: "application/json",
            async: false,
            url: urlbase + "minor/checkUsername/" + data.username,
            data: {},
            datatype: "json",
            success: function (data) {
                return data;
            },
            error: function (error) {

            }

        });
        //console.log(found);
        //console.log(!found.responseJSON.d);
        if (found.responseJSON.match) {
            return false;
        }
        else {
            return true;
        }
        //return !found.responseJSON.d;
    }, "Not Available");
    
    
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
    $("#guardForm").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            name: {
                required: true,
                minlength: 3,
                maxlength:40
            },
            phone: {
                required: true,
                number:true,
                minlength: 10
            },
            email: {
                required: true,
                email: true,
                haveAccount: true
            },
            username: {
                required: true,
                minlength: 6,
                maxlength: 20,
                chkUsername:true
            },
            password: {
                required: true,
                minlength: 8,
                maxlength: 20
            }
            
        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Minimum 3 characters",
                maxlength:"Maximun 40 characters"
            },
            phone: {
                required: "Please enter your 10 digit number",
                minlength: "Minimum 10 digits",
                number: "Please enter a valid number"
            },
            email: {
                required: "Please enter your email address",
                email: "Please enter a valid email"
            },
            username: {
                required: "Please enter a username",
                minlength: "at least 6 characters",
                maxlength: "at max 20 characters"
            },
            password: {
                required: "Please provide a password",
                minlength: "at least 8 characters long",
                maxlength: "at max 20 characters long"
            }
            
        }
    });

            

});
function isValid(field) {
    $(field).valid();
}
$('#txtName').on("keyup", function () {
    isValid("#txtName");
});
$('#txtPhone').on("keyup", function () {
    isValid("#txtPhone");
});
$('#txtEmail').on("keyup", function () {
    isValid("#txtEmail");
});
$('#Username').on("keyup", function () {
    isValid("#Username");
});
$('#Password').on("keyup", function () {
    isValid("#Password");
});


$("#btnCreateGuard").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        if($("#guardForm").valid()){
        let d = moment();
        var data = {
            aadharFront:record.username,
            name:$("#txtName").val(),
            phone:$("#txtPhone").val(),
            email:$("#txtEmail").val(),
            username:$("#Username").val(),
            password:$("#Password").val(),
            date: d.format("YYYY-MM-DD")
        }

         $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "parking/insertGuard",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                $("#btnCreateGuard").attr("disabled",true);
                //     $("#saving").modal({
                //     show: true,
                //     backdrop: 'static',
                //     keyboard:false
                // });
            },
            success: function (response) {
                if(response.done){
                    resetForm();
                    swal("Parking Guard Created","Successfully","success");
                    getList();
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


$("#btnSaveGuard").click(function (e) { 
    e.preventDefault();
    if($("#guardForm").valid()){
        var data = {
            cId:$("#spancId").text(),
            name:$("#txtName").val(),
            phone:$("#txtPhone").val(),
            email:$("#txtEmail").val(),
            username:$("#Username").val(),
            password:$("#Password").val()
        }

         $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "parking/saveGuard",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                //     $("#saving").modal({
                //     show: true,
                //     backdrop: 'static',
                //     keyboard:false
                // });
            },
            success: function (response) {
                if(response.done){
                    resetForm();
                    swal("Data Saved","Successfully","success");
                    getList();
                }
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    
});

$("#btnDeleteGuard").click(function (e) { 
    e.preventDefault();
     swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        })
        .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                async: true,
                url: urlbase + "parking/deleteGuard/" + $("#spancId").text(),
                data: {},
                datatype: "json",
                beforeSend: function () {
                    //     $("#saving").modal({
                    //     show: true,
                    //     backdrop: 'static',
                    //     keyboard:false
                    // });
                },
                success: function (response) {
                    if(response.done){
                        resetForm();
                        swal("Poof! Your data has been deleted!", {
                        icon: "success",
                        });
                        getList();
                    }
                    //console.log(response);
                },
                error: function (error) {
                    console.log(error);
                }
            });

        } else {
            swal("Your imaginary file is safe!");
        }
        });

    // if($("#dataHandlerForm").valid()){
    //     var data = {
    //         cId:$("#spancId").val(),
    //         name:$("#txtName").val(),
    //         phone:$("#txtPhone").val(),
    //         email:$("#txtEmail").val(),
    //         username:$("#Username").val(),
    //         password:$("#Password").val()
    //     }

    //      $.ajax({
    //         type: "POST",
    //         contentType: "application/json",
    //         async: true,
    //         url: urlbase + "dataHandler/saveDataHandler",
    //         data: JSON.stringify(data),
    //         datatype: "json",
    //         beforeSend: function () {
    //             //     $("#saving").modal({
    //             //     show: true,
    //             //     backdrop: 'static',
    //             //     keyboard:false
    //             // });
    //         },
    //         success: function (response) {
    //             if(response.done){
    //                 resetForm();
    //                 swal("Data Saved","Successfully","success");
    //                 getList();
    //             }
    //             //console.log(response);
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });
    // }
    
});




function resetForm(){
    $("#btnCreateGuard").attr("disabled",false);
    $("#txtName").removeClass("fieldset");
    $("#txtPhone").removeClass("fieldset");
    $("#txtEmail").removeClass("fieldset");
    $("#Username").removeClass("fieldset");
    $("#Password").removeClass("fieldset");
    $("#reset").click();

    
    $("#txtEmail").attr("disabled", false);
    $("#Username").attr("disabled", false);

    
    $("#divSDI").addClass("d-none");
    $("#divEdit").addClass("d-none");
    $("#divCreate").removeClass("d-none");
}