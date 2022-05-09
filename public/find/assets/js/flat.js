const norecord = `<div class="sides_list_property">
        <img style='width:100%' src="../assets/img/no record found.png" class="img-fluid mx-auto" alt="" />
    </div>`
const sitebase = 'http://pappuhandloom.com'

var flat_id = '';
var flat_status = '';
var flat_secId = '';

$(document).ready(function () {
    const get = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    var params = {
        _id:get.flat,
        propertyFor:get.property
    }
    flat_id = params._id;
    flat_status = params.propertyFor;
    getFlatDetails(params);
    
});

function bindSimilarProperties(data,params){
    
    //console.log(data);

    var container = $("#divSP");
    container.html('');
    var body = '';
    var status = 'For Rent'
    if(params.propertyFor=="buy"){
        status = 'For Buy'
    }
    for(var i=0;i<data.length;i++){
        var price = data[i].rent;
        if(params.propertyFor=="buy"){
            
            price = data[i].price;
        }
        
        body = `
            <div class="sides_list_property">
                <div class="sides_list_property_thumb">
                    <img src="${imgbase + data[i].images.img1}" class="img-fluid" alt="" />
                </div>
                <div class="sides_list_property_detail">
                    <h4><a href="flat.html?id=${data[i]._id}&propertyFor=${params.propertyFor}">${data[i].house}/${data[i].flat}, ${data[i].facing}</a></h4>
                    <span><i class="ti-location-pin"></i>${data[i].sector}</span>
                    <div class="lists_property_price">
                        <div class="lists_property_types">
                            <div class="property_types_vlix sale">${status}</div>
                        </div>
                        <div class="lists_property_price_value">
                            <h4>₹${price}</h4>
                        </div>
                    </div>
                </div>
            </div>`
        
            container.append(body);
        }

    if(data.length<=0){
        container.append(norecord);
    }
    
}

function getSimilarProperties(data,params){
    var price = [];
    if(params.propertyFor=="rent"){
        price.push(parseInt(data.rent)-4000);
        price.push(parseInt(data.rent)+7000);
    }
    else{
        price.push(parseInt(data.price)-500000);
        price.push(parseInt(data.price)+1000000);
    }
    var filter = {
        _id:params._id,
        propertyTo:params.propertyFor,
        amenities:data.amenities,
        location:data.secId,
        area:[parseInt(data.area)-500,parseInt(data.area)+500],
        price:price
    }
    //console.log(filter);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url:  urlbase +  `user/getSimilarProperties`,
        data: JSON.stringify(filter),
        datatype: "json",
        success: function (response) {
            bindSimilarProperties(response.data,params);
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

function setOwlCarousel(){
    //console.log($('.owl-carousel').html())
     $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        autoplay:true,
        autoplayTimeout:3000,
        autoplayHoverPause:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    })
}

function bindOtherImages(data,callback){
    //console.log(data);

    if(data.length==0){
        $("#divOtherImages").addClass("d-none");
    }
    else{
        var container = $(".owl-carousel");
        container.html('');
        var body = '';
        for(var i=0;i<data.length;i++){
            body = `<div class="item"><a href="${imgbase+data[i].path}" class="mfp-gallery"><img src="${imgbase+data[i].path}" class="img-fluid mx-auto" alt="" /></a></div>`
            container.append(body);
        }
        //$('.owl-carousel').owlCarousel('refresh');
        //$('.owl-carousel').data('owlCarousel').destroy();

        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            nav:true,
            autoplay:true,
            autoplayTimeout:3000,
            autoplayHoverPause:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
        })

    }
    
}

function getOtherImages(fId){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  `user/getFlatOtherImages/${fId}`,
        data: {},
        datatype: "json",
        success: function (response) {
            bindOtherImages(response.data,setOwlCarousel);
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

function bindFlat(data,params){
    //console.log(data);
    if(data!=''){
        flat_secId=data.secId;
        $("#a_img1").attr("href", imgbase + data.images.img1);
        $("#a_img2").attr("href",imgbase + data.images.img2);
        $("#a_img3").attr("href",imgbase + data.images.img3);
        $("#a_img4").attr("href",imgbase + data.images.img4);
        $("#a_img5").attr("href",imgbase + data.images.img1);
        $("#a_img6").attr("href",imgbase + data.images.img2);
        $("#a_img7").attr("href",imgbase + data.images.img3);
        $("#a_img8").attr("href",imgbase + data.images.img4);
        
        $("#img1").attr("src",imgbase + data.images.img1);
        $("#img2").attr("src",imgbase + data.images.img2);
        $("#img3").attr("src",imgbase + data.images.img3);
        $("#img4").attr("src",imgbase + data.images.img4);
        $("#img5").attr("src",imgbase + data.images.img1);
        $("#img6").attr("src",imgbase + data.images.img2);
        $("#img7").attr("src",imgbase + data.images.img3);
        $("#img8").attr("src",imgbase + data.images.img4);

        $("#b_age").html(data.bage);
        $("#face").html(data.facing);
        $("#beds").html(data.bedrooms + ' Beds');
        $("#bath").html(data.bathrooms + ' Bath');
        $("#sqft").html(data.area + ' sqft');

        $("#h_loc").html(data.flat + '/' + data.house + ', ' + data.sector);
        $("#spanfId").html(data.fId);
        
        getOtherImages(data.fId);
        
        $("#div_about").html(data.description);


        var items = $("#ul_amenities li");
        //console.log(items);
        for (var i = 0; i < items.length; ++i) {
            //console.log(items[i].children[0].checked);
            if(data.amenities.indexOf(items[i].innerText)>-1){
                items[i].classList.add('active');
            }
            else{
                items[i].classList.remove("active");
            }
        }


        
        $("#mapFrame").attr("src",data.src);
        
        $("#owner").attr("src",imgbase + data.owner);
        $("#a_cName").html(data.cName);
        $("#a_cEmail").html(data.cEmail);
        $("#number").attr("data-last", '+91'+data.cPhone);

        if(params.propertyFor=="rent"){
            $("#h_price").html('₹'+data.rent);
            $("#divFor").html('For Rent');
            var ul = $("#u_ptax");
            ul.html('');
            var li = `
            <li>Price<span>₹${data.rent}</span></li>
            <li>Security<span>₹${data.rent}</span></li>
            `;
            ul.append(li);
            var tp = 2*parseInt(data.rent);
            $("#h_tp").html('₹'+tp);
            $("#a_btn_main_chk").html("Book It Now");
            $("#a_btn_main").html("Book It Now");
        }
        else{
            $("#h_price").html('₹'+data.price);
            $("#divFor").html('For Buy');
            var ul = $("#u_ptax");
            ul.html('');
            var x = Math.floor(data.price/10);
            var li = `
            <li>Price<span>₹${data.price}</span></li>
            <li>Sale Deed Tax<span>₹${x}</span></li>
            <li>Mutation Charges<span>₹${x}</span></li>
            `;
            ul.append(li);
            var tp = parseInt(data.price)+x+x;
            $("#h_tp").html('₹'+tp);
            $("#a_btn_main_chk").html("Buy It Now");
            $("#a_btn_main").html("Buy It Now");
        }
    }
    else{
        window.location = '../flats.html';
    }
    //console.log(data);
}

function getFlatDetails(params){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  `user/getFlatDetails/${params._id}`,
        data: {},
        datatype: "json",
        success: function (response) {
            bindFlat(response.data,params);
            getSimilarProperties(response.data,params);
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

$("#a_msg_tst").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    if(dataString){
        $("#a_msg_main").click();
    }
    else{
        $("#signbtn a").click();   
    }
    
});

$("#btnSendMsg").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    var record = JSON.parse(dataString);
    var data = {
        username:record.username,
        password:record.password,
        subject:$("#msg_sub").val(),
        message:$("#msg_text").val(),
        email:$("#a_cEmail").html(),
        name: $("#a_cName").html(),
        location:$("#h_loc").html()
    }
    console.log(data);
    if(data.subject==""||data.message==""){
        console.log("in");
        swal("Invalid Message","This message is invalid","warning");
        return;
    }

        //console.log(data);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "user/message",
        data: JSON.stringify(data),
        datatype: "json",
        beforeSend: function () {
            $("#btnSendMsg").attr("disabled",true);
        },
        success: function (response) {
            if(response.done){
                $("#btnSendMsg").attr("disabled",false);
                                
                $("#closeMsg").click();
                swal("Message Sent","Successfully","success");
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });

});


$("#a_btn_main_chk").click(function (e) { 
    e.preventDefault();
    var dataString = localStorage.getItem("rup-user");
    if(dataString){
        $("#a_btn_main").click();
    }
    else{
        $("#signbtn a").click();   
    }
});

$("#a_btn_main").click(async (e) => { 
    e.preventDefault();
    if(!document.getElementById("aj-1").checked){
        swal("Terms and Conditions","Make sure to read and agree the terms and conditions","warning");
        return;
    }
    var auth = await getAuths();

    //console.log(flat_status);
    //console.log(auth);
    if(auth.id=="4" && flat_status == "rent"){
        //case if owner wants to be a tenant
        //console.log("case if owner wants to be a tenant");
        swal("Request of Owner as Tenant","You can't be a owner as well as tenant on the same account if you want to be a tenant then either create a new user account or a new tenant account and then make this request","info").then(()=>{
            //window.location = "../user.html";
            $("#a_register").click();
        });
    }
    else if(auth.id=="5" && flat_status == "buy"){
        //case if tenant wants to be a owner
        //console.log("case if tenant wants to be a owner");
        swal("Request of Tenant as Owner","You can't be a owner as well as tenant on the same account if you want to be a owner then either create a new user account or a new owner account and then make this request","info").then(()=>{
            //window.location = "../user.html";
            $("#a_register").click();
        });;

    }
    else if(auth.id == "5" && auth.status == "1"){
        //case if tenant wants to a tenant if he is already a tenant
        //console.log("case if tenant wants to a tenant if he is already a tenant");
        swal("Request of tenant as new tenant","You can't be a tenant on more than one flats on the same account if you want to a tenant on another flat also then either create a new user account or a new tenant account and then make this request","info").then(()=>{
            //window.location = "../user.html";
            $("#a_register").click();
        });;
    }
    else{
        final_proceed();
        //console.log("proceed");
    }
    
});

function final_proceed(){
    var dataString = localStorage.getItem("rup-user");
    var record = JSON.parse(dataString);
    let d = moment();
    var data = {
        username:record.username,
        password:record.password,
        _id:flat_id,
        status:flat_status,
        fId:$("#spanfId").html(),
        date: d.format("YYYY-MM-DD"),
        todate:d.add(1,'M').format("YYYY-MM-DD"),
        secId:flat_secId,
        uId:authId
    }
    console.log(data);
    
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "user/setPropertyStatus",
        data: JSON.stringify(data),
        datatype: "json",
        
        success: function (response) {
            if(response.done){
                swal("Done","go to your dashboard","success");
                setTimeout(() => {
                    window.location='../index.html';
                }, 1500);
            }
            else{
                swal("Something Went Wrong","Try Again","info");
            }
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
            swal("Something Went Wrong","server side error","info");
        }
    });
}

$("#a_register").click(function (e) { 
    e.preventDefault();
    var flat = {
        _id:flat_id,
        status:flat_status
    }
    localStorage.setItem("flat",JSON.stringify(flat));
    window.location = "../user.html";
});

$("#iconShare").on("click",async (e)=> { 
    e.preventDefault();
    
    var element= document.getElementById("img1");
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
            title: 'Aspiring Homes',
            text: $("#h_loc").html(),
            // url: `http://oilbazaar.in`
            url: `${sitebase}/find/flat.html?flat=${flat_id}&property=${flat_status}#${$("#h_loc").html()}`
            
        };
        navigator.share(shareData);
        
    }).catch((err) => {
        console.error(err);
       
    });

    // const shareData = {
    //     title: 'Aspiring Homes',
    //     text: $("#h_loc").html(),
    //     // url: `http://oilbazaar.in`
    //     url: `${sitebase}/find/flat.html?id=${flat_id}&propertyFor=${flat_status}`
    // }

    // try {
    //     await navigator.share(shareData)
    // } catch(err) {
    //     console.log(err);
    // }
    //console.log(shareData);
});