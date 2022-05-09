var info = {}


function getSectors(){
   var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "parking/getSectors/4/"+record.username,
            data: {},
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    $("#drpParkingSector").html("");
                    var list = "";
                    for (var i = 0; i < response.result.length; i++) {
                        list = list + "<option value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                    }

                    $("#drpParkingSector").append(list);

                }
                else {
                    console.log("no data");
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

function bindSelectedQRDefault(data){
    $("#sQRname").html(data.name);
    $("#sQRphone").html(data.phone);
    $("#sQRnumber").html(data.vehicleNo);
    $("#sQRslot").html(data.tag);
    $("#sQR").attr("src",data.src);
    $("#sQRbookingId").html(data.bookingId);
}

function bindQRList(data){
    //console.log(data);
    if(data.length>0){
        var component = $("#divQRsList");
        component.html('');
        var item = ``;

        for (var i = 0; i < data.length; i++) {
            var status = "valid"
            let mnow = moment();
            let dueDate = moment(data[i].validTo).format("DD/MM/YYYY"); //to chk why to specify format
            if(mnow.isAfter(dueDate)){
                status = "expired";
            }

            var type = "A";
            if(data[i].type=="2"){
                type = "B";
            }
            var tag = data[i].tag.split("/");

            item =  `
                <div class="col-md-6">
                    <div class="grid_blog_box">
                        <span class="key" hidden>
                            <span class="bookingId">${data[i].bookingId}</span>
                            <span class="name">${data[i].name}</span>
                            <span class="phone">${data[i].phone}</span>
                            <span class="number">${data[i].vehicleNo}</span>
                            <span class="slot">${data[i].tag}</span>
                                <img class="qr" src="${data[i].src}" alt="" />
                        </span>
                        <a href="#selectedQR" onclick="qrInfo(this)">
                        <div class="gtid_blog_thumb">
                            <img src="${data[i].src}" class="img-fluid p-5" alt="" />
                            <div class="gtid_blog_info"><span>${type}</span>${tag[1]}</div>
                        </div></a>					
                        
                        <div class="blog-body">
                            <h4 class="bl-title"><a  href="#selectedQR" onclick="qrInfo(this)">V.no.: ${data[i].vehicleNo}</a><span class="latest_new_post ${status}">${status}</span></h4>
                            <p><b>Name:</b> ${data[i].name}<br><b>From:</b> ${data[i].validFrom}<br><b>To:</b> ${data[i].validTo}</p>
                        </div>
                        
                        
                    </div>
                </div>
            `;
            component.append(item)
        }

        bindSelectedQRDefault(data[0]);
    }
    else{
        $("#divRecord").addClass("d-none");
        $("#divNoRecord").removeClass("d-none");
        
    }
    

}

function getQRList(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "parking/getQRList/"+record.username,
            data: {},
            datatype: "json",
            success: function (response) {
                bindQRList(response.data);
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

function qrInfo(target){
    //console.log(target);
    var key = $(target).closest("div.grid_blog_box").find(".key");
    console.log(key);

    var bookingId = $(key).find(".bookingId").text();
    var name = $(key).find(".name").text();
    var phone = $(key).find(".phone").text();
    var number = $(key).find(".number").text();
    var slot = $(key).find(".slot").text();
    var src = $(key).find(".qr").attr("src");

    //console.log(bookingId);

    $("#sQRbookingId").html(bookingId);
    $("#sQRname").html(name);
    $("#sQRphone").html(phone);
    $("#sQRnumber").html(number);
    $("#sQRslot").html(slot);
    $("#sQR").attr("src",src);

    //console.log(name);
}

$("#date-time-from").change(function (e) { 
    e.preventDefault();
    if($("#date-time-from").val()!=""){
        $("#date-time-to").val("")
        $("#date-time-to").attr("disabled",false);
        
        let maxToDate = moment().add(1,'M');
        let fromDate = $("#date-time-from").val();
        console.log(fromDate);

        let startTo = moment(fromDate).add(2,'h');
        $('#date-time-to').val(startTo.format("YYYY-MM-DD HH:mm").toString());
        console.log(startTo);
        $('#date-time-to').bootstrapMaterialDatePicker({
            format: 'YYYY-MM-DD HH:mm',
            minDate:startTo,
            defaultDate:startTo,
            maxDate:maxToDate
        });
        
    }
    else{
        $("#date-time-to").val("")
        $("#date-time-to").attr("disabled","true");
    }
});

$(document).ready(()=> {
    setDashboard();
    getSectors();
    getQRList();
    
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
    $("#selectSlot").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            vnum: {
                required: true
            },
            fromDate: {
                required: true,
            },
            toDate: {
                required:true
            }
        },
        messages: {
            vnum: {
                required: "Please Enter the vehicle Number"
            },
            fromDate: {
                required: "Please select the duration"
            },
            toDate: {
                required: "Please choose the end date"
            }
        }
    });

    $("#bookSlot").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            cName: {
                required: true
            },
            cPhone: {
                required: true,
                number:true,
                minlength:10
            }
        },
        messages: {
            cName: {
                required: "Please Enter the Contact Name"
            },
            cPhone: {
                required: "Please Enter the Contact Phone",
                number: "Please Enter a valid Phone Number",
                minlength: "Please Enter a valid Phone Number",
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

$('#date-time-from').on("keyup", function () {
    isValid("#date-time-from");
});
$('#date-time-to').on("keyup", function () {
    isValid("#date-time-to");
});

$('#txtCName').on("keyup", function () {
    isValid("#txtCName");
});
$('#txtCPhone').on("keyup", function () {
    isValid("#txtCPhone");
});


function deleteBookedSlot(){
    //console.log("in");
    var bookingId = $("#sQRbookingId").html();
    if(bookingId!=""){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url:  urlbase +  "parking/deleteBooking/"+bookingId,
            data: {},
            datatype: "json",
            success: function (response) {
                if(response.done){
                   swal("Booking Removed","Successfully","success").then(()=>{
                        getQRList();
                    });
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
    else{
        swal("Something went wrong","nothing to delete","error").then(()=>{
            getQRList();
        });
    }

}

function printQR(src){
    
    
    var a = window.open("", "", "width=1000,height=1000");

    var html = `
        <html>
        <head></head>
        <body>
        <img id="printImg" src="${src}">
        <script>
        setTimeout(() => {window.print();window.close();}, 500);
        </script></body></html>
    `
    a.document.write(html);

    //a.close();
    //console.log("in");
    //console.log(src);

    // a.document.write('<html><head></head>');
    // a.document.write('<body><img id="printImg" src="'+src+'">');
    // a.document.write('<script>setTimeout(() => {window.print();}, 800);</scr'+'ipt></body></html>');
            // a.document.close();
        //a.print();
    //a.close();
}

function setBookingType(){
    var type = $("#drpBookingType :selected").val();
    //console.log(type);
    if(type==1){
        $("#allotment-tab").click();
    }
    else{
        $("#buffer-tab").click();
    }
}

function set_sQR_img(){
    $("#sQRphone").removeClass("d-none");
    $("#sQRnumber").addClass("d-none");
    $("#sQRslot").addClass("d-none");
}
function reset_sQR_img(){
    $("#sQRphone").addClass("d-none");
    $("#sQRnumber").removeClass("d-none");
    $("#sQRslot").removeClass("d-none");
}

$("#sQRdelete").click(function (e) { 
    e.preventDefault();
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this slot!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteBookedSlot();              
            } 
        });
});
$("#sQRdownload").click(function (e) { 
    
    e.preventDefault();
    set_sQR_img();
    var element= document.getElementById("sQRImg");
    domtoimage.toPng(element).then(async (result) => {
        saveAs(result,`${$("#sQRslot").html()}.png`);
        reset_sQR_img();
    }).catch((err) => {
        console.error(err);
        reset_sQR_img();
    });
    
});
$("#sQRprint").click(function (e) { 
    e.preventDefault();
    set_sQR_img();
    var element= document.getElementById("sQRImg");
    domtoimage.toPng(element).then(async (result) => {
        printQR(result);
        reset_sQR_img();
    }).catch((err) => {
        console.error(err);
        reset_sQR_img();
    });
});
$("#sQRshare").click(async (e)=> { 
    e.preventDefault();
    // const shareData = {
    //     title: 'MDN',
    //     text: 'Learn web development on MDN!',
    //     url: 'https://developer.mozilla.org'
    // }
    // try {
    //     await navigator.share(shareData)
    //     //resultPara.textContent = 'MDN shared successfully'
    // } catch(err) {
    //     console.log(err);
    // }
    set_sQR_img();
    var element= document.getElementById("sQRImg");
    domtoimage.toPng(element).then(async (result) => {
        const response = await fetch(result);
        const blob = await response.blob();
        const filesArray = [
            new File(
            [blob],
            'meme.jpg',
            {
                type: "image/jpeg",
                lastModified: new Date().getTime()
            }
        )
        ];
        const shareData = {
            files: filesArray,
            
        };
        navigator.share(shareData);
        reset_sQR_img();
    }).catch((err) => {
        console.error(err);
        reset_sQR_img();
    });
});

function setViewAfterNext(data){
       console.log(info);
       $("#available_slotId").html(data.slotId);
       $("#available_vehicle").html(info.vehicleNo);
       $("#available_slot").html(data.slot);
       
       console.log($("#drpParkingSector :selected").text())
       $("#available_location").html($("#drpParkingSector :selected").text());
       $("#available_from").html(info.dateFrom);
       $("#available_to").html(info.dateTo);
       $("#available_number").html(info.vehicleNo);
       $("#available_tag").html(data.slot);
       $("#available_amount").html("₹ "+data.amount);
       info = {...info,...data};
       console.log(info);

       $("#search-tab").click();
       $("#slot-tab").click();

}


function checkSlotAvilability(){
    var type = $("#drpBookingType :selected").val();
    var secId = $("#drpParkingSector :selected").val();
    var vehicleNo = $("#txtVehicleNumber").val();
    var data = {
        type:type,secId:secId,vehicleNo:vehicleNo
    }
    if(type==1){
        var plan = $("#drpPlan :selected").val();
        if(plan==1){
            let m = moment();
            data.dateFrom = m.format("YYYY-MM-DD HH:mm");
            data.dateTo = m.add(6,'M').format("YYYY-MM-DD HH:mm");
        }
        else{
            let m = moment();
            data.dateFrom = m.format("YYYY-MM-DD HH:mm");
            data.dateTo = m.add(1,'y').format("YYYY-MM-DD HH:mm");
        }
    }
    else{
        data.dateFrom = $("#date-time-from").val();
        data.dateTo = $("#date-time-to").val();
    }
    info = {...info,...data};
    //info.vehicleNo = $("#txtVehicleNumber").val();
    //console.log(data);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "parking/checkAvailability",
        data: JSON.stringify(data),
        datatype: "json",
        beforeSend: function () {
            //$("#btnRegisterFlat").attr("disabled",true);
        },
        success: function (response) {
            if(response.available){
                console.log("in");
                setViewAfterNext(response.data);
            }
            else{
                console.log("in");
                $("#notAvailable").removeClass("d-none");
                setTimeout(() => {
                    $("#notAvailable").addClass("d-none");
                }, 2000);
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

$("#btnNext").click(function (e) { 
    e.preventDefault();
    if($("#selectSlot").valid()){
        checkSlotAvilability()
        //$("#search-tab").click();
    }
});
$("#cancelNext").click(function (e) { 
    e.preventDefault();//backend api required to set the status of slotId from 2 to 0 only in cancel back required i guess
    window.location = "./parking.html";
});
$("#btnBack").click(function (e) { 
    e.preventDefault();
    $("#fill-tab").click();
    
});
$("#cancelBack").click(function (e) { 
    e.preventDefault();//backend api required to set the status of slotId from 2 to 0
    swal({
            title: "Are you sure?",
            text: "to cancel the booking!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                window.location="parking.html"
                // $.ajax({
                //     type: "POST",
                //     contentType: "application/json",
                //     async: true,
                //     url: urlbase + "parking/resetSlotStatus",
                //     data: JSON.stringify(info),
                //     datatype: "json",
                //     beforeSend: function () {
                //         //$("#btnRegisterFlat").attr("disabled",true);
                //     },
                //     success: function (response) {
                //         if(response.done){
                //             window.location="parking.html"
                            
                //         }
                //         //console.log(response);
                //     },
                //     error: function (error) {
                //         console.log(error);
                //     }
                // });              
            } 
        });
     
    //window.location = "./parking.html";
    
});
$("#btnBookParking").click(function (e) { 
    e.preventDefault();
     if(!document.getElementById("aj-1").checked){
        swal("Terms and Conditions","Make sure to read and agree the terms and conditions","warning");
        return;
    }
    if($("#bookSlot").valid()){
        var dataString = localStorage.getItem("rup-user");
        if (dataString) {
            var record = JSON.parse(dataString);
            info.username = record.username;
            info.cName = $("#txtCName").val();
            info.cPhone = $("#txtCPhone").val();
            info.timeIn = info.dateFrom;
            info.status = 0;
            bookSlot();
        }
        //$("#search-tab").click();
    }
});

function bookSlot(){
    console.log(info);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "parking/bookParkingSlot",
        data: JSON.stringify(info),
        datatype: "json",
        beforeSend: function () {
            //$("#btnRegisterFlat").attr("disabled",true);
        },
        success: function (response) {
            if(response.done){
                swal("Parking Slot Booked","Successfully","success").then(()=>{
                    window.location="./parking.html"
                });
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });

}