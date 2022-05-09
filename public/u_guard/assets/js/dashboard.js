var booking = {}

$(document).ready(function () {
    setDashboard();
    $('#btn2').click(function(){
        $('#main').animate({'left':'0'});
        $('#btn1').removeClass('active2');
        $('#btn2').addClass('active2');
    });
    $('#btn1').click(function(){
        $('#main').animate({'left':'-100%'});
        $('#btn2').removeClass('active2');
        $('#btn1').addClass('active2');
         $("#divCloseScanner").click();
    });

   
    // validate signup form on keyup and submit
    $("#verifyNumber").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            vnum: {
                required: true
            }
        },
        messages: {
            vnum: {
                required: "Please Enter the vehicle Number"
            }
        }
    });
});
function isValid(field) {
    $(field).valid();
}

$('#txtVehicleNumber').on("keyup", function () {
    isValid("#txtVehicleNumber");
});

function startScanner(){
    $("#btnScanner").click();
//     if(navigator.mediaDevices.getUserMedia){
//       navigator.mediaDevices.getUserMedia({video:true});
//     }
//     console.log("hello");
//     let scanner = new Instascan.Scanner({ video: document.getElementById('preview'),scanPeriod: 5, mirror: false});
//     console.log(scanner);
//     scanner.addListener('scan', function (content) {
//     var data = JSON.parse(content)
//         console.log(data);
//         //location.href = "http://pappuhandloom.com/index.html?user="+data.user+"&vehicle="+data.vehicle;
//         //alert(content);
//     });

//     Instascan.Camera.getCameras().then(function (cameras) {
//     if (cameras.length > 0) {
//         if(cameras[1]!=""){
//             scanner.start(cameras[1]);
//         }
//         else{
//             scanner.start(cameras[0]);
//         }
//         //scanner.stop();
//         $("#divCloseScanner").click(function (e) { 
//             e.preventDefault();
//             console.log("in");
//             $("#divScannerStart").removeClass("d-none");
//             $("#divScannerMain").addClass("d-none");
//             scanner.stop();
//         });
//     } else {
//      console.error('No cameras found.');
//     }
//     }).catch(function (e) {
//        console.error(e);
//     });
}

function verifyParking(){
    
    var vnum = $("#txtVehicleNumber").val();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "parking/verifyParking/"+vnum+"/"+$("#sectorId").html(),
        data: {},
        datatype: "json",
        success: function (response) {
            showResult(response.data);
        },
        error: function (error) {
            
            console.log(error);

        }
    });
    
}

function reset(){
    $("#statusResult").html('');
    $("#type").html("-");
    $("#hQRname").html('');
    $("#hQRnumber").html('');
    $("#hQRvehicle").html('');
    $("#hQRslot").html('');

    
    $("#case5").addClass('d-none');
    $("#case4").addClass('d-none');
    $("#case6").addClass('d-none');

    $("#btnProceed").attr('disabled',false);
}

function showResult(data){
    console.log(data);
    // data = {
    //     case:4,
    //     type:1,
    //     name:"Akash Dwivedi",
    //     number:"8708985386",
    //     vehicle:"HR 77 4567",
    //     slot:"A/R30-89",
    //     bookingId:4,
    //     amount:200
    // }
    reset();

    booking.case = data.case;
    booking.bookingId = data.bookingId;
    booking.type = data.type;
    booking.temp_occupied_status = data.temp_occupied_status;
    booking.slotId = data.slotId;
    booking.parkingType = data.parkingType;

    if(data.case==0){
        //case not exists
        $("#statusResult").html('not exists');
        $("#btnProceed").attr('disabled','true');

    }
    
    else{
        $("#scanned_case").html(data.case);
        $("#scanned_bookingId").html(data.bookingId);
        
        $("#type").html("in");
        if(data.type=="2"){$("#type").html("out");}
        $("#hQRname").html(data.name);
        $("#hQRnumber").html(data.number);
        $("#hQRvehicle").html(data.vehicle);
        $("#hQRslot").html(data.slot);
        
        let mnow = moment().add(5,'m');
        let maxDate = moment(data.validTo);
        $('#date-time-in').bootstrapMaterialDatePicker({
            format: 'YYYY-MM-DD HH:mm',
            minDate:mnow,
            maxDate:maxDate
        });

        if(data.case==1){
            //case expired
            $("#statusResult").html('expired');
            $("#btnProceed").attr('disabled','true');

        }
         else if(data.case==2){
        //case in allotment/buffer before time in
            $("#statusResult").html('before time in arrival');
            $("#btnProceed").attr('disabled','true');

        }
         else if(data.case==3){
        //case in allotment/buffer in valid
            $("#statusResult").html('valid');
            $("#btnProceed").attr('disabled',false);
            
        }
        else if(data.case==4){
        //case in buffer out within time
            $("#statusResult").html('valid');
            $("#case4").removeClass('d-none');
            $("#btnProceed").attr('disabled',false);
            
            $("#cancel_4").removeClass('d-none');
            $("#allotment_timeIn").addClass('d-none');
            
        }
        else if(data.case==5){
        //case ask timeIn allotment out
            $("#statusResult").html('valid');
            $("#case5").removeClass('d-none');
            
            $("#cancel_4").addClass('d-none');
            $("#allotment_timeIn").removeClass('d-none');
        }
        else if(data.case==6||data.case==5.1){
        //case in buffer out time limit exceed || allotment out time limit exceed
            $("#statusResult").html('time limit exceeded');
            $("#case6").removeClass('d-none');
            $("#scanned_amount").html('₹ ' + data.amount);
            
        }
        
    }
    $("#result-tab").click();

}

function scannedResult(data){
    console.log(data);
    $("#divCloseScanner").click();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "parking/verifyBooking/"+data.bookingId+"/"+$("#sectorId").html(),
        data: {},
        datatype: "json",
        success: function (response) {
            showResult(response.data);
        },
        error: function (error) {
            
            console.log(error);

        }
    });
}

$("#divScannerStart").click(function (e) { 
    e.preventDefault();
    $("#divScannerStart").addClass("d-none");
    $("#divScannerMain").removeClass("d-none");
    startScanner();
});

$("#divCloseScanner").click(function (e) { 
    e.preventDefault();
    //console.log("in")
    $("#divScannerStart").removeClass("d-none");
    $("#divScannerMain").addClass("d-none");
    $("#btnStop").click();
});


$("#btnVerify").click(function (e) { 
    e.preventDefault();
    // if($("#vefiryNumber").valid()){
    //     verifyParking();
    // }
    if($("#txtVehicleNumber").val()!=""){
        verifyParking();
    }
    else{
        $("#txtVehicleNumber").focus();
    }
});

$("#btnScanNew").click(function (e) { 
    e.preventDefault();
    $("#main-tab").click();
    $("#btn2").click();
    //$("#divScannerStart").click();
});

function proceed(data){
    console.log(data);
    data.m = moment().format("YYYY-MM-DD HH:mm");
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url:  urlbase +  "parking/proceed",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.done){
                $("#btnScanNew").click();
            }
        },
        error: function (error) {
            
            console.log(error);

        }
    });
}

$("#btnProceed").click(function (e) { 
    e.preventDefault();
    $("#txtVehicleNumber").val("");
    if(booking.bookingId!=""){
        var data = {...booking};
        if(booking.case==5||booking.case==4.1){
            if($("#date-time-in").val()==""){
                $("#date-time-in").focus();
                return;
            }
            data.timeIn = $("#date-time-in").val();
        }
        proceed(data);
    }
    else{
        $("#main-tab").click();
    }
});

$("#a_reuse").click(function (e) {
    e.preventDefault(); 
    //console.log("in");
    booking.case=4.1;
    $("#case5").removeClass('d-none');
    $("#case4").addClass('d-none');

    $("#cancel_4").removeClass('d-none');
    $("#allotment_timeIn").addClass('d-none');
});

$("#cancel_4").click(function (e) { 
    e.preventDefault();
    booking.case=4;
    $("#case5").addClass('d-none');
    $("#case4").removeClass('d-none');

    $("#cancel_4").addClass('d-none');
    $("#allotment_timeIn").removeClass('d-none');
});