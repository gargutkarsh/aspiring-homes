var _id = "";
var o_count = 0; //other images count
$(document).ready(function () {
    setDashboard();
    bindChoosearea();
    bindSelectFloor();

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
    $("#saveInfo").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
            }
        } ,
        rules: {
            
            status: {
                required:true
            },
            bedrooms: {
                required:true
            },
            bathrooms: {
                required:true
            },
            bage: {
                required:true
            },
            rent: {
                required: true,
                number : true
            },
            price: {
                required: true,
                number : true
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
            desc: {
                required: "Please Enter the Description"
            },
            cName: {
                required: "Please enter the contact name"
            },
            cEmail: {
                required: "Please enter the contact email"
            },
            status: {
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
        }
    });
});

function isValid(field) {
    $(field).valid();
}


$('#status').on("change", function () {
    isValid("#status");
});
$('#bedrooms').on("change", function () {
    isValid("#bedrooms");
});
$('#bathrooms').on("change", function () {
    isValid("#bathrooms");
});
$('#bage').on("change", function () {
    isValid("#bage");
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


function bindSelectFloor(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
        var record = JSON.parse(dataString);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "owner/getFloors/"+record.username,
            data: {},
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    $("#drpFloors").html("");
                    var list = "";
                    for (var i = 0; i < response.result.length; i++) {
                        list = list + "<option value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                    }

                    $("#drpFloors").append(list);

                    getFlatInfo();
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

function bindChoosearea(){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "minor/getSectors",
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.result.length > 0) {
                //console.log(response.result)
                $("#choosearea").html("");
                var list = "";
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

function bindOtherImages(data){
    $("#OtherCount").html(o_count);
    $("#divOtherImages").html('');
    var body = '';
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            body = `
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                  <div class="property-listing property-2">
                                    
                                    <div class="listing-img-wrapper">
                                      <div class="divchk"><span id="imgId" class="d-none">${data[i].imgId}</span>
                                        <input class="imgchk" style="cursor: pointer;" type="checkbox" name="" id=""></div>
                                      <div class="list-img-slide">
                                        <div class="click">
                                          <div><img src="${imgbase + data[i].path}" class="img-fluid mx-auto" alt="" /></div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    
                                  </div>
                                </div>
            `
            $("#divOtherImages").append(body);
        }

    }
    $(".imgchk").change(function (e) { 
        e.preventDefault();
        //console.log("in");
        var count = 0;
        var list = $(".divchk");
        for(var i =0;i<list.length;i++){
            var chk = list[i].children[1].checked;
            if(chk){
                count++;
                break;
            }
            //console.log(x + " " + chk);
        }
        //console.log(count);
        if(count>0){
            //console.log("to remove disabled");
            $("#btnDeleteOther").attr("disabled", false);
        }
        else{
            //console.log("to add disabled");
            $("#btnDeleteOther").attr("disabled", true);
        }
    });
}

function bindAmenities(amenities){
    //console.log(amenities);
    var items = $("#ul-others li");
    //console.log(items);
    for (var i = 0; i < items.length; ++i) {
        //console.log(items[i].children[0].checked);
        if(amenities.indexOf(items[i].outerText)>-1){
            items[i].children[0].checked=true;
            //console.log(items[i]);
        }
        else{
            items[i].children[0].checked=false;
            //console.log(items[i]);
        }
    }
}

function bindInfo(data){
    $("#choosearea").val(data.secId).change();
    $("#txtHouse").val(data.house);
    $("#txtFloor").val(data.flat);
    $("#status").val(data.status).change();
    $("#txtArea").val(data.area);
    $("#bedrooms").val(data.bedrooms).change();
    $("#bathrooms").val(data.bathrooms).change();
    $("#txtRent").val(data.rent);
    $("#txtPrice").val(data.price);
    $("#bage").val(data.bage).change();
    $("#facing").val(data.facing).change();
    $("#txtDescription").val(data.description);

    bindAmenities(data.amenities);

    $("#cName").val(data.cName);
    $("#cPhone").val(data.cPhone);
    $("#cEmail").val(data.cEmail);
}

function bindGallery(images){
    $("#img1").attr('src',imgbase + images.img1);
    $("#wrapper1").addClass("active");
    $("#img2").attr('src',imgbase + images.img2);
    $("#wrapper2").addClass("active");
    $("#img3").attr('src',imgbase + images.img3);
    $("#wrapper3").addClass("active");
    $("#img4").attr('src',imgbase + images.img4);
    $("#wrapper4").addClass("active");
}

function bindFlatInfo(data,type=0){
    //console.log(data);
    _id = data._id;
    o_count = data.otherImages.length;
    if(type==0){
        bindInfo(data);
        bindGallery(data.images);
        bindOtherImages(data.otherImages);
    }
    else if(type==1){
        bindInfo(data);
    }
    else if(type==2){
        bindGallery(data.images);
    }
    else if(type==3){
        bindOtherImages(data.otherImages);
    }
    
}

function getFlatInfo(type=0){
var fId = $("#drpFloors :selected").val();

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  `owner/getFlatInfo/${fId}`,
        data: {},
        datatype: "json",
        success: function (response) {
            if(response.data!=null){
                bindFlatInfo(response.data,type);
            }
            
            //getSimilarProperties(response.data,params);
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

$("#btnSaveInfo").click(function (e) { 
    e.preventDefault();
    if($("#saveInfo").valid()){
        var items = $("#ul-others li");
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
            _id:_id,
            fId: $("#drpFloors :selected").val(),
            status:$('#status :selected').val(),
            bedrooms:$('#bedrooms :selected').val(),
            bathrooms:$('#bathrooms :selected').val(),
            bage:$('#bage :selected').val(),
            price:$("#txtPrice").val(),
            area:$("#txtArea").val(),
            cName:$("#cName").val(),
            cEmail:$("#cEmail").val(),
            cPhone:$("#cPhone").val(),
            desc:$("#txtDescription").val(),
            Rent:$("#txtRent").val(),
            amenities:amenities
        }
        //console.log(data);
    
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "owner/updateFloor",
            data: JSON.stringify(data),
            datatype: "json",
            beforeSend: function () {
                //$("#btnSaveInfo").attr("disabled",true);
            },
            success: function (response) {
                if(response.done){
                    getFlatInfo(1);
                    swal("Data Saved","Successfully","success");
                }
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });    
    }
    
    
});

$("#cancelGallery").click(function (e) { 
    e.preventDefault();
    getFlatInfo(2);
});

$("#btnSaveGallery").click(function (e) { 
    e.preventDefault();
    $("#images-error").addClass("d-none");
    if(!$("#wrapper1").hasClass("active")||!$("#wrapper2").hasClass("active")||!$("#wrapper3").hasClass("active")||!$("#wrapper4").hasClass("active")){
        $("#images-error").removeClass("d-none");
    }
    else{
        var images = new FormData();
        images.append("file1",$("#file1").get(0).files[0]);
        images.append("file2",$("#file2").get(0).files[0]);
        images.append("file3",$("#file3").get(0).files[0]);
        images.append("file4",$("#file4").get(0).files[0]);
        $.ajax({
            url: urlbase + 'owner/updateFlatImages/'+_id,
            type: "POST",
            async:false,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: images,
            
            success: function (response) {
                $("#file1").val('');
                $("#file2").val('');
                $("#file3").val('');
                $("#file4").val('');
                getFlatInfo(2);
                swal("Done",`Images Saved successfully`,"success");
                
            },
            error: function (err) {
                alert(err.statusText);
            }
        });
    }
    
    
});

$("#i_add_other").click(function (e) { 
    e.preventDefault();
    if(o_count<20){
        $("#otherImages").click();
        // $("#i_add_other").addClass("d-none");
        // $("#i_not_add_other").removeClass("d-none");
        // $("#addImages").removeClass("d-none");        
    }
    else{
        alert("you can upload more that 20 images");
        swal("Warning",`You can't upload more than 20 images`,"warning");
    }
});


$("#i_not_add_other").click(function (e) { 
    e.preventDefault();
    $("#i_add_other").removeClass("d-none");
    $("#i_not_add_other").addClass("d-none");
    $("#addImages").addClass("d-none");
});

function deleteOtherImages(){
    var list = $(".divchk");
    var data = {imgId:[]};
    for(var i =0;i<list.length;i++){
        var chk = list[i].children[1].checked;
        if(chk){
            data.imgId.push(list[i].children[0].innerHTML);
        }
    }


    $.ajax({
        type: "POST",
        async:false,
        contentType: "application/json",
        url: urlbase + 'owner/deleteFlatOtherImages',
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
            if(response.done){
                getFlatInfo(3);
                swal("Done",`Images Removed successfully`,"success");

            }
            //insertFlat(response,record);
            //console.log(response);
            
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}

$("#btnDeleteOther").click(function (e) { 
    e.preventDefault();
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover these images!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteOtherImages();              
            } 
        });

    
});

$(".imgchk").change(function (e) { 
    e.preventDefault();
    //console.log("in");
    var count = 0;
    var list = $(".divchk");
    for(var i =0;i<list.length;i++){
        var chk = list[i].children[1].checked;
        if(chk){
            count++;
            break;
        }
        //console.log(x + " " + chk);
    }
    //console.log(count);
    if(count>0){
        //console.log("to remove disabled");
        $("#btnDeleteOther").attr("disabled", false);
    }
    else{
        //console.log("to add disabled");
        $("#btnDeleteOther").attr("disabled", true);
    }
});

$("#btnUploadOtherImages").click(function (e) { 
    var fId = $("#drpFloors :selected").val();
    e.preventDefault();
    if(o_count<20){
        
        //console.log("in");
        
        var fileslen = $("#otherImages").get(0).files.length;
        var len = Math.min(fileslen,20-o_count);
        
        //console.log(len);
        
        var images = new FormData();
        for(var i = 0;i<len;i++){
            images.append("otherImages",$("#otherImages").get(0).files[i])
        }
        
        
        //images.append("otherImages",files);

        //console.log(images);

        
        $.ajax({
            url: urlbase + 'owner/saveFlatOtherImages/'+ fId,
            type: "POST",
            async:false,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: images,
            
            success: function (response) {
                if(response.done){
                    getFlatInfo(3);
                    swal("Done",`Images Saved successfully`,"success");

                }
                //insertFlat(response,record);
                //console.log(response);
                
            },
            error: function (err) {
                alert(err.statusText);
            }
        });
    
    }
     
});


$("#otherImages").change(function (e) { 
    e.preventDefault();
    if(o_count<20){
        
        
        var fileslen = $("#otherImages").get(0).files.length;

        if(fileslen>20-o_count){
            swal("Warning",`You can't upload more than ${20-o_count} images`,"warning");
            $("#otherImages").val('');
        }
         
        else{
            $("#btnUploadOtherImages").click();
        }
        //console.log(len);
    }
});