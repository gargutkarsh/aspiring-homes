$(document).ready(function () {

    //  var items = $("#ul-others li");
    //  var amenities = [];
    //  for (var i = 0; i < items.length; ++i) {
    //     //console.log(items[i].children[0].checked);
    //     if(!items[i].children[0].checked){
    //         //console.log(items[i].outerText);
    //         amenities.push(items[i].outerText);
    //         //items[i].children[1]
    //     }
    //  }
     //console.log(amenities);
     //console.log(items);

    setDashboard();

    bindchoosearea();
    //console.log("value : " + $("#status").val());
    $("#txtFloor").focus(function (e) { 
        e.preventDefault();
        if(!$("#txtHouse").valid()){
            $("#txtHouse").focus();
            //$("#txtFloor").text("");
        }
    });
    //validator to check Electric Meter Number is unique or not
    $.validator.addMethod("haveMN", function (value) {
        //var data = { email: value };
        //console.log(JSON.stringify(data));
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: {},
                url: urlbase + "owner/checkMN/" + value,
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

   

    $.validator.addMethod("haveFlat", function (value) {
        
        var house = $("#txtHouse").val();
        
        var data = { house:house,flat: value };
        //console.log(JSON.stringify(data));
        var found = $.ajax({
                type: "POST",
                contentType: "application/json",
                async: false,
                data: JSON.stringify(data),
                url: urlbase + "owner/checkFlat",
                datatype: "json",
                success: function (data) {
                    return data;
                },
                error: function (error) {

                }
            });

        //console.log(found.responseJSON.match);
        if (found.responseJSON.match) {
            return false;
        }
        else {
            return true;
        }
        //return !found.responseJSON.d;
    }, "Error! Please contact administrator");
    
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
    $("#registerFlatForm").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            house: {
                required: true
            },
            floor: {
                required: true,
                haveFlat:true
            },
            status: {
                required:true
            },
            bedrooms: {
                required:true
            },
            choosearea: {
                required:true
            },
            facing: {
                required:true
            },
            bathrooms: {
                required:true
            },
            bage: {
                required:true
            },
            area: {
                required: true,
                number : true
            },
            rent: {
                required: true,
                number : true
            },
            price: {
                required: true,
                number : true
            },
            emNumber: {
                required: true,
                haveMN: true
            },
            emReading:{
                required:true
            },
            wmNumber: {
                required: true,
                haveMN: true
            },
            wmReading:{
                required:true
            },
            desc:{
                required:true
            },
            cName: {
                required: true
            },
            cEmail: {
                required: true,
                email:true
            },
            
        },
        messages: {
            house: {
                required: "Please Enter the House Number"
            },
            desc: {
                required: "Please Enter the Description"
            },
            cName: {
                required: "Please enter the contact name"
            },
            cEmail: {
                required: "Please enter the contact email"
            },
            floor: {
                required: "Please Enter the Flat Number"
            },
            status: {
                required: "Please choose an option"
            },
            choosearea: {
                required: "Please choose an option"
            },
            facing: {
                required: "Please choose an option"
            },
            bedrooms: {
                required: "Please choose an option"
            },
            bathrooms: {
                required: "Please choose an option"
            },
            bage: {
                required: "Please choose an option"
            },
            rent: {
                required: "Please Enter the Rent",
                number:"Please Enter Valid Rent"
            },
            price: {
                required: "Please Enter the Price",
                number:"Please Enter Valid Price"
            },
            area: {
                required: "Please Enter the Area",
                number:"Please Enter Valid Value"
            },
            emNumber: {
                required: "Please Enter the EMN"
            },
            emReading:{
                required:"Please Enter Your Previous Reading"
            },
            wmNumber: {
                required: "Please Enter the WMN"
            },
            wmReading:{
                required:"Please Enter Your Previous Reading"
            }
        }
    });


});


function isValid(field) {
    $(field).valid();
}

$('#txtHouse').on("keyup", function () {
    isValid("#txtHouse");
});

$('#txtFloor').on("keyup", function () {
    isValid("#txtFloor");
});
$('#status').on("change", function () {
    isValid("#status");
});
$('#txtArea').on("keyup", function () {
    isValid("#txtArea");
});
$('#bedrooms').on("change", function () {
    isValid("#bedrooms");
});
$('#choosearea').on("change", function () {
    isValid("#choosearea");
});
$('#bathrooms').on("change", function () {
    isValid("#bathrooms");
});
$('#facing').on("change", function () {
    isValid("#facing");
   
});

$('#bage').on("change", function () {
    isValid("#bage");
});

$('#txtRent').on("keyup", function () {
    isValid("#txtRent");
});
$('#txtRent').on("keyup", function () {
    isValid("#txtRent");
});
$('#txtPrice').on("keyup", function () {
    isValid("#txtPrice");
});
$('#txtDescription').on("keyup", function () {
    isValid("#txtDescription");
});
$('#cName').on("keyup", function () {
    isValid("#cName");
});
$('#cEmail').on("keyup", function () {
    isValid("#cEmail");
});
$('#txtEMN').on("keyup", function () {
    isValid("#txtEMN");
});
$('#txtEMR').on("keyup", function () {
    isValid("#txtEMR");
});
$('#txtWMN').on("keyup", function () {
    isValid("#txtWMN");
});
$('#txtWMR').on("keyup", function () {
    isValid("#txtWMR");
});

$("#btnRegisterFlat").click(function (e) { 
e.preventDefault();
var dataString = localStorage.getItem("rup-user");
if (dataString) {
    var record = JSON.parse(dataString);
    

    if(!$("#wrapper1").hasClass("active")||!$("#wrapper2").hasClass("active")||!$("#wrapper3").hasClass("active")||!$("#wrapper4").hasClass("active")){
        //console.log("in");console.log( $("#images-error"))
        $("#images-error").removeClass("d-none");
        //console.log( $("#images-error"));
        //return;
    }

    if($("#registerFlatForm").valid()){
        if(!$("#wrapper1").hasClass("active")||!$("#wrapper2").hasClass("active")||!$("#wrapper3").hasClass("active")||!$("#wrapper4").hasClass("active")){
            $("#images-error").removeClass("d-none");
            return;
        }

        // var items = $("#ul-others li");
        // var amenities = [];
        // for (var i = 0; i < items.length; ++i) {
        //     //console.log(items[i].children[0].checked);
        //     if(items[i].children[0].checked){
        //         //console.log(items[i].outerText);
        //         amenities.push(items[i].outerText);
        //         //items[i].children[1]
        //     }
        // }
        
        var images = new FormData();
        images.append("file1",$("#file1").get(0).files[0]);
        images.append("file2",$("#file2").get(0).files[0]);
        images.append("file3",$("#file3").get(0).files[0]);
        images.append("file4",$("#file4").get(0).files[0]);
        $.ajax({
            url: urlbase + 'owner/saveFlatImages',
            type: "POST",
            async:false,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: images,
            
            success: function (response) {
                insertFlat(response,record);
                //console.log(response);
                
            },
            error: function (err) {
                alert(err.statusText);
            }
        });

        // var data = {
        //     username:record.username,
        //     password:record.password,
        //     houseNo:$("#txtHouse").val(),
        //     floorNo:$("#txtFloor").val(),
        //     status:$('#status :selected').val(),
        //     bedrooms:$('#bedrooms :selected').val(),
        //     bathrooms:$('#bathrooms :selected').val(),
        //     bage:$('#bage :selected').val(),
        //     price:$("#txtPrice").val(),
        //     area:$("#txtArea").val(),
        //     cName:$("#cName").val(),
        //     cEmail:$("#cEmail").val(),
        //     cPhone:$("#cPhone").val(),
        //     desc:$("#txtDescription").val(),
        //     Rent:$("#txtRent").val(),
        //     Emeter:$("#txtEMN").val(),
        //     eReading:$("#txtEMR").val(),
        //     Wmeter:$("#txtWMN").val(),
        //     wReading:$("#txtWMR").val(),
        //     date: d.format("YYYY-MM-DD"),
        //     amenities:amenities
            
        // }


    //     $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     async: true,
    //     url: urlbase + "owner/insertFloor",
    //     data: JSON.stringify(data),
    //     datatype: "json",
    //     beforeSend: function () {
    //         $("#btnRegisterFlat").attr("disabled",true);
    //         //     $("#saving").modal({
    //         //     show: true,
    //         //     backdrop: 'static',
    //         //     keyboard:false
    //         // });
    //     },
    //     success: function (response) {
    //         if(response.done){
    //             resetForm();
    //             swal("Floor Registered","Successfully","success");
    //         }
    //         //console.log(response);
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });
}
}

});

function bindchoosearea(){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "user/getLocations",
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.result.length > 0) {
                $("#choosearea").html("");
                var list = "<option value=''>&nbsp;</option>";
                for (var i = 0; i < response.result.length; i++) {
                    list = list + "<option value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                }

                $("#choosearea").append(list);

            }
            else {
                console.log("no data");
            }
        },
        error: function (error) {
            if (!navigator.onLine) {
                window.location = "errors-404-error.html";
            }
            //alert('error : ' + error);
            console.log(error);

        }
    });
}


function insertFlat(images,record){
    var items = $("#ul-others li");
    let d = moment();
    var amenities = [];
    for (var i = 0; i < items.length; ++i) {
        //console.log(items[i].children[0].checked);
        if(items[i].children[0].checked){
            //console.log(items[i].outerText);
            amenities.push(items[i].outerText);
            //items[i].children[1]
        }
    }
    var data = {
        username:record.username,
        password:record.password,
        houseNo:$("#txtHouse").val(),
        floorNo:$("#txtFloor").val(),
        status:$('#status :selected').val(),
        bedrooms:$('#bedrooms :selected').val(),
        bathrooms:$('#bathrooms :selected').val(),
        facing:$('#facing :selected').val(),
        bage:$('#bage :selected').val(),
        price:$("#txtPrice").val(),
        area:$("#txtArea").val(),
        cName:$("#cName").val(),
        cEmail:$("#cEmail").val(),
        cPhone:$("#cPhone").val(),
        desc:$("#txtDescription").val(),
        Rent:$("#txtRent").val(),
        Emeter:$("#txtEMN").val(),
        eReading:$("#txtEMR").val(),
        Wmeter:$("#txtWMN").val(),
        wReading:$("#txtWMR").val(),
        date: d.format("YYYY-MM-DD"),
        amenities:amenities,
        images:images,
        secId:$('#choosearea :selected').val(),
            
    }

        //console.log(data);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "owner/insertFloor",
        data: JSON.stringify(data),
        datatype: "json",
        beforeSend: function () {
            $("#btnRegisterFlat").attr("disabled",true);
        },
        success: function (response) {
            if(response.done){
                resetForm();
                swal("Floor Registered","Successfully","success");
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function resetForm(){
    $("#btnRegisterFlat").attr("disabled",false);
    // $('#status :selected').val('');
    // $('#bedrooms :selected').val('');
    // $('#bathrooms :selected').val('');
    // $('#bage :selected').val('');
    // $('#facing :selected').val('');
    
    $("#txtFloor").removeClass("fieldset");
    $("#txtRent").removeClass("fieldset");
    $("#txtEMN").removeClass("fieldset");
    $("#txtEMR").removeClass("fieldset");
    $("#txtWMN").removeClass("fieldset");
    $("#txtWMR").removeClass("fieldset");
    $("#txtHouse").removeClass("fieldset");
    $("#txtArea").removeClass("fieldset");
    $("#txtPrice").removeClass("fieldset");
    $("#txtDescription").removeClass("fieldset");
    $("#cName").removeClass("fieldset");
    $("#cEmail").removeClass("fieldset");
    $("#cPhone").removeClass("fieldset");
    $("#cancel1").click();
    $("#cancel2").click();
    $("#cancel3").click();
    $("#cancel4").click();
    $("#reset").click();

}
