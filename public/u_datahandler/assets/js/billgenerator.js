$(document).ready(function () {
    setDashboard();
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
            return true;
        }
        else {
            return false;
        }
        //return !found.responseJSON.d;
    }, "!");

    //validator to check Electric Meter Number is unique or not
    $.validator.addMethod("validReading", function (value) {
        var pReading = parseInt($("#txtPR").val());
        if (value>=pReading) {
            return true;
        }
        else {
            return false;
        }
        //return !found.responseJSON.d;
    }, "Can't be Less Than Previous Reading");


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
    $("#generateBillForm").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            meterNo: {
                required: true,
                haveMN:true
            },
            pReading: {
                required: true,
                number:true
            },
            Reading: {
                required: true,
                number:true,
                validReading:true 
            }
            
        },
        messages: {
             meterNo: {
                required: ""
            },
            pReading: {
                required: "This Field is Required",
                number:"Please Enter Valid Reading"
            },
            Reading: {
                required: "This Field is Required",
                number:"Please Enter Valid Reading",
                
            }
        }
    });

});

function isValid(field) {
    $(field).valid();
}
$('#txtMN').on("keyup", function () {
    isValid("#txtMN");
});
$('#txtPR').on("keyup", function () {
    isValid("#txtPR");
});
$('#txtRN').on("keyup", function () {
    isValid("#txtRN");
});

function setMeter(data){

    $("#spanType").text(data.type);
    let m1 = moment(data.date).format("DD/MM/YYYY");
    let m2 = moment().format("DD/MM/YYYY");
    $("#txtPRD").val(m1);
    $("#txtDate").val(m2);
    $("#txtPR").val(data.pReading);
    $("#txtRN").focus();
    if(data.status != "1"){
        $("#txtPR").attr("disabled", false);
        $("#txtPR").focus();
    }
}

$("#btnBind").click(function (e) { 
    
    e.preventDefault();
    if($('#txtMN').valid()){
        $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "dataHandler/getMeterInfo/"+$('#txtMN').val(),
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.found) {
                setMeter(response);
                $("#btnGenerateBill").attr("disabled",false);
            }
            else {
                setAllotTenant();
                getFloorInfo();
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
    else $('#txtMN').focus();
});

$("#btnGenerateBill").click(function (e) { 
    e.preventDefault();
    let d = moment();
    if($("#generateBillForm").valid()){
        var data = {
            meterNo:$("#txtMN").val(),
            type:$("#spanType").text(),
            pReading:$("#txtPR").val(),
            Reading:$("#txtRN").val(),
            dateTo: d.format("YYYY-MM-DD"),
            dueDate:d.add(15,'d').format("YYYY-MM-DD")
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "dataHandler/generateBill",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                $("#btnGenerateBill").attr("disabled",true);
                //     $("#saving").modal({
                //     show: true,
                //     backdrop: 'static',
                //     keyboard:false
                // });
            },
            success: function (response) {
                if(response.done){
                    resetForm();
                    swal("Bill Generated","Successfully","success");
                }
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

});

function resetForm(){
    $("#btnGenerateBill").attr("disabled",false);
    $("#txtMN").removeClass("fieldset");
    $("#txtDate").removeClass("fieldset");
    $("#txtPRD").removeClass("fieldset");
    $("#txtPR").removeClass("fieldset");
    $("#txtRN").removeClass("fieldset");
    $("#reset").click();

}
