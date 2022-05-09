function setDefaults(response){
    $("#txtContactName").val(response.name);
    $("#txtPhone").val(response.phone);
    $("#txtEmail").val(response.email);
    $("#spanUsername").text(response.username);
}

function getDefaults(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var data = JSON.parse(dataString);
        //console.log(data.username + " " + data.password);
        $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/getDonnerDefaults",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.data){
                setDefaults(response);
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

function setDonnerAge(data){
    var new_data = {
        lst:data
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/setDonnersAge",
        data: JSON.stingify(new_data),
        datatype: "json",
        success: function (response) {
            getDonnerList();
            //else logout();
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setDonnerList(response){
     $("#tblDonnerList").html('');
    var lst = [];
    let now = moment();
    for (var i = 0; i < response.result.length; i++) {
        var dm = response.result[i].date;
        if(dm!=""){
            var date = moment(response.result[i].date);
            //console.log(date);
            if(now.isAfter(date)){
                var data = {
                    dId:response.result[i].dId,
                    age:parseInt(response.result[i].age)+1,
                    date:date.add(1,'y').format("YYYY-MM-DD")
                }
                //console.log(data);
                lst.push(data);
            }
        }
    }
    if(lst.length>0){
        //console.log(lst);
        setDonnerAge(lst);
    }
    else{
        var table = 
        `<thead class='thead'>
        <tr>
        <th scope='col' id='Id' hidden>Id</th>
        <th scope='col' id='dn'>Donner Name</th>
        <th scope='col' id='age'>Age</th>
        <th scope='col' id='bg'>Blood Group</th>
        <th scope='col' id='info'>info</th>
        </thead>`;
        table = table + "<tbody>";
        for (var i = 0; i < response.result.length; i++) {
            
            var info = "<button class='resetBtn' onclick='donnerInfo(this);'><i class='fas fa-info-circle'></i></button>";
            table = table + `<tr>
            <td id='Id' hidden>
                <span id='spanId'>${response.result[i].dId}</span>
                <span id='spanName'>${response.result[i].name}</span>
                <span id='spanPhone'>${response.result[i].phone}</span>
                <span id='spanEmail'>${response.result[i].email}</span>
                <span id='spanDM' hidden>${response.result[i].date}</span>
                <span id='spanAge' hidden>${response.result[i].age}</span>
            </td>
            <td id='dn'>${response.result[i].mainName}</td>
            <td id='age'>${response.result[i].age}</td>
            <td id='bg'>${response.result[i].bloodGroup}</td>
            <td id='info'>${info}</td></tr>`;
        }
        table = table + "</tbody>";
        $("#tblDonnerList").append(table);
    }

       
}

function getDonnerList(){
     var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var info = JSON.parse(dataString);
        //console.log(JSON.stringify(info));
        $.ajax({
        type: "POST",
        contentType: "application/json",
        url: urlbase + "minor/getDonnerList",
        data: JSON.stringify(info),
        datatype: "json",
        success: function (response) {
            if (response.result.length > 0) {
                setDonnerList(response);
            }
            else {
                $("#tblDonnerList").html('');
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

function donnerInfo(target){
    
    var row = $(target).closest("tr");
    var dId = $(row).find("#Id").find("#spanId").text();
    var cName = $(row).find("#Id").find("#spanName").text();
    var phone = $(row).find("#Id").find("#spanPhone").text();
    var email = $(row).find("#Id").find("#spanEmail").text();
    var date = $(row).find("#Id").find("#spanDM").text();
    var age = $(row).find("#age").html();
    var dName = $(row).find("#dn").html();
    var bloodGroup = $(row).find("#bg").html();

    $("#spandId").text(dId);
    $("#spanDMmain").text(date);
    $("#spanAgemain").text(age);

    $("#txtMainName").val(dName);
    $("#txtContactName").val(cName);
    $("#txtPhone").val(phone);
    $("#txtEmail").val(email);
    $("#txtAge").val(age);
    $('#drpBG').val(bloodGroup);
    
    $("#txtMainName").addClass("fieldset");
    $("#txtContactName").addClass("fieldset");
    $("#txtPhone").addClass("fieldset");
    $("#txtEmail").addClass("fieldset");
    $("#txtAge").addClass("fieldset");
    $('#drpBG').addClass("fieldset");

    $("#divCreate").addClass("d-none");
    $("#divEdit").removeClass("d-none");
}

$(document).ready(function () {
    setDashboard();
    getDefaults();
    getDonnerList();
    //validator to check same Name is unique or not
    $.validator.addMethod("isDonner", function (value) {
        var username = $("#spanUsername").text();
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: {},
                url: urlbase + "minor/isDonner/" + username + "/"+value,
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
    }, "Already Added");
    
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
    $("#donnerForm").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            mainName: {
                required: true,
                minlength: 3,
                isDonner:true,
                maxlength:40
            },
            contactName: {
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
                email: true
            }
            
        },
        messages: {
            mainName: {
                required: "Please enter the name",
                minlength: "Minimum 3 characters",
                maxlength:"Maximun 40 characters"
            },
            contactName: {
                required: "Please enter the name",
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
            }
        }
    });

            

});

function isValid(field) {
    $(field).valid();
}
$('#txtMainName').on("keyup", function () {
    isValid("#txtMainName");
});
$('#txtContactName').on("keyup", function () {
    isValid("#txtContactName");
});
$('#txtPhone').on("keyup", function () {
    isValid("#txtPhone");
});
$('#txtEmail').on("keyup", function () {
    isValid("#txtEmail");
});


$("#btnCreateDonner").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        if($("#donnerForm").valid()){
            var bg = $('#drpBG :selected').val();
            var data = {
                mainName:$("#txtMainName").val(),
                name:$("#txtContactName").val(),
                phone:$("#txtPhone").val(),
                email:$("#txtEmail").val(),
                age:$("#txtAge").val(),
                date:moment().add(1,'y').format("YYYY-MM-DD"),
                bloodGroup :bg,
                username:record.username
            }

            $.ajax({
                type: "POST",
                contentType: "application/json",
                async: true,
                url: urlbase + "minor/createDonner",
                data: JSON.stringify(data),
                datatype: "json",
                beforeSend: function () {
                    $("#btnCreateDonner").attr("disabled",true);
                    //     $("#saving").modal({
                    //     show: true,
                    //     backdrop: 'static',
                    //     keyboard:false
                    // });
                },
                success: function (response) {
                    if(response.done){
                        resetForm();
                        swal("Donner Created Successfully","Thanks For Your Contribution's","success");
                        getDonnerList();
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


$("#btnSaveDonner").click(function (e) { 
    e.preventDefault();
    $("#txtMainName").rules("remove","isDonner");
    if($("#donnerForm").valid()){
        var bg = $('#drpBG :selected').val();
        var date =  $("#spanDMmain").text();
        if(date == "" || $("#txtAge").val()!=$("#spanAgemain").text()){
            // if(parseInt(age)<parseInt($("#spanAge").text())){
            //     age = $("#spanAge").text();
            // }
            date = moment().add(1,'y').format("YYYY-MM-DD");
        }
        var data = {
            dId:$("#spandId").text(),
            mainName:$("#txtMainName").val(),
            name:$("#txtContactName").val(),
            phone:$("#txtPhone").val(),
            email:$("#txtEmail").val(),
            age:$("#txtAge").val(),
            date:date,
            bloodGroup :bg
        }

         $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "minor/saveDonner",
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
                    getDonnerList();
                }
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    
});

$("#btnRemoveDonner").click(function (e) { 
    e.preventDefault();
     swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
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
                    url: urlbase + "minor/removeDonner/" + $("#spandId").text(),
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
                            getDonnerList();
                        }
                        //console.log(response);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

            } 
            else {
                swal("Your imaginary file is safe!");
            }
        });
});




function resetForm(){
    $("#btnCreateDonner").attr("disabled",false);
    $("#txtMainName").removeClass("fieldset");
    $("#txtContactName").removeClass("fieldset");
    $("#txtPhone").removeClass("fieldset");
    $("#txtEmail").removeClass("fieldset");
    $("#txtAge").removeClass("fieldset");
    $('#drpBG').removeClass("fieldset");
    $("#reset").click();
    getDefaults();

    $("#divEdit").addClass("d-none");
    $("#divCreate").removeClass("d-none");
}