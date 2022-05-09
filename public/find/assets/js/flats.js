const norecord = `
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <img style='width:100%' src="../assets/img/no record found.png" class="img-fluid mx-auto" alt="" />
        </div>
`

$(document).ready(function () {
    //console.log($("#priceRange"));
    setPriceRange();
    setAreaRange();
    bindLocations();
    setMap();

    //this should be called from valid.js if want to disabled dropdown as per user authId not from here 
    getFlatsList();
    
    //fixPropertyTo();
    // setTimeout(() => {
            
    //     getFlatsList();
    // }, 200);
    //console.log($("#priceRange").val());
    //console.log($("#priceRange")[0][jQuery341052481550128826742]);

    $('#propertyTo').change(function (e) { 
        e.preventDefault();
        setPriceRange();
    });
});

// function fixPropertyTo(){
//     $('#propertyTo').val("buy").change();
//     $('#propertyTo').attr('disabled',"disabled");
    
// }

$('#ptype').change(function (e) { 
    e.preventDefault();
    //var src = $('#ptype :selected').attr('src');
    //console.log(src);
    
    setMap();
    getFlatsList();
});

function setMap(){
    var div = $("#divMap");
    var frame = $("#frameMap");
    var id = $('#ptype :selected').val();
    if(id!=""){
        div.removeClass('d-none');
        var src = $('#ptype :selected').attr('src');
        frame.attr('src',src);
    }
    else{
        div.addClass('d-none');
    }
}

function setAreaRange(){
    $("#areaRange").ionRangeSlider();
    $("#areaRange").data('ionRangeSlider').update({
        type: "double",
        min: 50,
        max: 2500,
        from: 800,
        to: 2400,
        grid: true,
        postfix:" sqft",
        step:50
    });
}

function setPriceRange(){
    var type = $('#propertyTo :selected').val();
    //console.log("type : " + type);
    $("#priceRange").ionRangeSlider();
    if(type=="buy"){
        $("#priceRange").data('ionRangeSlider').update({
            type: "double",
            min: 600000,
            max: 5000000,
            from: 1000000,
            to: 4000000,
            grid: true,
            prefix:"₹ ",
            step:10000
        });
    }
    else if(type=="rent"){
        $("#priceRange").data('ionRangeSlider').update({
            type: "double",
            min: 3000,
            max: 70000,
            from: 6000,
            to: 40000,
            grid: true,
            prefix:"₹ ",
            step:500
        });
        //console.log($("#priceRange"))
    }
    else{
        $("#priceRange").data('ionRangeSlider').update({
            type: "double",
            min: 3000,
            max: 5000000,
            from: 6000,
            to: 3000000,
            grid: true,
            prefix:"₹ ",
            step:1000
        });
    }

     //$("#priceRange").ionRangeSlider()
}

function bindLocations(){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url:  urlbase +  "user/getLocations",
        data: {},
        datatype: "json",
        success: function (response) {
            if (response.result.length > 0) {
                $("#ptype").html("");
                var list = '<option value="">&nbsp;</option>';
                for (var i = 0; i < response.result.length; i++) {
                    list = list + "<option src='"+response.result[i].src+"' value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                }

                $("#ptype").append(list);

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

function bindFlatsList(data,callslick){
    var container = $("#divFlatsList");
    container.html('');
    var body = '';
    var buy = ''; //for case if no propertyTo is selected and item has status both

    var status = $('#propertyTo :selected').val();
    if(status!=""){
        for(var i=0;i<data.length;i++){
            var category = 'For Rent';
            var price = data[i].rent;
            if(status=="buy"){
                category = 'For Buy';
                price = data[i].price;
            }
            
            var star = Math.ceil(data[i].rating);
            var rate = '';
            for(var j=0;j<star;j++){
                rate = rate + '<i class="fa fa-star"></i>';
            }
            body = `
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div class="property-listing list_view">
                        <div class="listing-img-wrapper">
                            <div class="_exlio_125">${category}</div>
                            <div class="list-img-slide">
                                <div class="click">
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${status}"><img src="${imgbase + data[i].images.img1}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${status}"><img src="${imgbase + data[i].images.img2}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${status}"><img src="${imgbase + data[i].images.img3}" class="img-fluid mx-auto" alt="" /></a></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="list_view_flex">
                        
                            <div class="listing-detail-wrapper mt-1">
                                <div class="listing-short-detail-wrap">
                                    <div class="_card_list_flex mb-2">
                                        <div class="_card_flex_01">
                                            <span class="property_types_vlix buy" style="border-radius: 0;">${data[i].bage}</span>
                                            <span class="_list_blickes types">${data[i].facing}</span>
                                        </div>
                                        <div class="_card_flex_last">
                                            <h6 class="listing-card-info-price mb-0">₹${price}</h6>
                                        </div>
                                    </div>
                                    <div class="_card_list_flex">
                                        <div class="_card_flex_01">
                                            <h4 class="listing-name verified"><a href="flat.html?flat=${data[i]._id}&property=${status}" class="prt-link-detail">${data[i].flat}/${data[i].house}, ${data[i].sector}</a></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="price-features-wrapper">
                                <div class="list-fx-features">
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bed.svg" width="13" alt="" /></div>${data[i].bedrooms} Beds
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bathtub.svg" width="13" alt="" /></div>${data[i].bathrooms} Bath
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/move.svg" width="13" alt="" /></div>${data[i].area} sqft
                                    </div>
                                </div>
                            </div>
                            
                            <div class="listing-detail-footer">
                                <div class="footer-first">
                                    <div class="foot-rates">
                                        <span class="elio_rate good">${data[i].rating}</span>
                                        <div class="_rate_stio">
                                            ${rate}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer-flex">
                                    <a href="flat.html?flat=${data[i]._id}&property=${status}" class="prt-view">View Detail</a>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `
            container.append(body);
        }
    }
    else{
        for(var i=0;i<data.length;i++){
            
            var propertyFor = data[i].status;
            if(propertyFor=="both"){
                propertyFor="rent";
            }

            var category = 'For Rent';
            var price = data[i].rent;
            if(data[i].status == "buy"){
                category = 'For Buy';
                price = data[i].price;
            }

            var star = Math.ceil(data[i].rating);
            var rate = '';
            for(var j=0;j<star;j++){
                rate = rate + '<i class="fa fa-star"></i>';
            }

            body = `
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div class="property-listing list_view">
                        <div class="listing-img-wrapper">
                            <div class="_exlio_125">${category}</div>
                            <div class="list-img-slide">
                                <div class="click">
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img1}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img2}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img3}" class="img-fluid mx-auto" alt="" /></a></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="list_view_flex">
                        
                            <div class="listing-detail-wrapper mt-1">
                                <div class="listing-short-detail-wrap">
                                    <div class="_card_list_flex mb-2">
                                        <div class="_card_flex_01">
                                            <span class="property_types_vlix buy" style="border-radius: 0;">${data[i].bage}</span>
                                            <span class="_list_blickes types">${data[i].facing}</span>
                                        </div>
                                        <div class="_card_flex_last">
                                            <h6 class="listing-card-info-price mb-0">₹${price}</h6>
                                        </div>
                                    </div>
                                    <div class="_card_list_flex">
                                        <div class="_card_flex_01">
                                            <h4 class="listing-name verified"><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}" class="prt-link-detail">${data[i].flat}/${data[i].house}, ${data[i].sector}</a></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="price-features-wrapper">
                                <div class="list-fx-features">
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bed.svg" width="13" alt="" /></div>${data[i].bedrooms} Beds
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bathtub.svg" width="13" alt="" /></div>${data[i].bathrooms} Bath
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/move.svg" width="13" alt="" /></div>${data[i].area} sqft
                                    </div>
                                </div>
                            </div>
                            
                            <div class="listing-detail-footer">
                                <div class="footer-first">
                                    <div class="foot-rates">
                                        <span class="elio_rate good">${data[i].rating}</span>
                                        <div class="_rate_stio">
                                            ${rate}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer-flex">
                                    <a href="flat.html?flat=${data[i]._id}&property=${propertyFor}" class="prt-view">View Detail</a>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `
            if(data[i].status == "both"){
                propertyFor = "buy";

                buy = buy + `
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div class="property-listing list_view">
                        <div class="listing-img-wrapper">
                            <div class="_exlio_125">For Buy</div>
                            <div class="list-img-slide">
                                <div class="click">
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img3}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img4}" class="img-fluid mx-auto" alt="" /></a></div>
                                    <div><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}"><img src="${imgbase + data[i].images.img1}" class="img-fluid mx-auto" alt="" /></a></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="list_view_flex">
                        
                            <div class="listing-detail-wrapper mt-1">
                                <div class="listing-short-detail-wrap">
                                    <div class="_card_list_flex mb-2">
                                        <div class="_card_flex_01">
                                            <span class="property_types_vlix buy" style="border-radius: 0;">${data[i].bage}</span>
                                            <span class="_list_blickes types">${data[i].facing}</span>
                                        </div>
                                        <div class="_card_flex_last">
                                            <h6 class="listing-card-info-price mb-0">₹${data[i].price}</h6>
                                        </div>
                                    </div>
                                    <div class="_card_list_flex">
                                        <div class="_card_flex_01">
                                            <h4 class="listing-name verified"><a href="flat.html?flat=${data[i]._id}&property=${propertyFor}" class="prt-link-detail">${data[i].flat}/${data[i].house}, ${data[i].sector}</a></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="price-features-wrapper">
                                <div class="list-fx-features">
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bed.svg" width="13" alt="" /></div>${data[i].bedrooms} Beds
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/bathtub.svg" width="13" alt="" /></div>${data[i].bathrooms} Bath
                                    </div>
                                    <div class="listing-card-info-icon">
                                        <div class="inc-fleat-icon"><img src="../assets/img/move.svg" width="13" alt="" /></div>${data[i].area} sqft
                                    </div>
                                </div>
                            </div>
                            
                            <div class="listing-detail-footer">
                                <div class="footer-first">
                                    <div class="foot-rates">
                                        <span class="elio_rate good">${data[i].rating}</span>
                                        <div class="_rate_stio">
                                            ${rate}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer-flex">
                                    <a href="flat.html?flat=${data[i]._id}&property=${propertyFor}" class="prt-view">View Detail</a>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                `
            }

            container.append(body);
        }
        container.append(buy);
    }

    if(data.length<=0){
        container.append(norecord);
    }
    
    callslick();
}

function callslick(){
    //console.log("slick");
    //console.log( $('.click'));
    $('.click').slick({
        slidesToShow:1,
        slidesToScroll: 1,
        arrows: false,
        autoplay:true,
        fade: true,
        dots:true,
        autoplaySpeed:4000,
    });
}

function getFlatsList(){
    var filter = getFilters();
    //console.log(filter);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url:  urlbase +  "user/getFlatsList",
        data: JSON.stringify(filter),
        datatype: "json",
        success: function (response) {
            bindFlatsList(response.data,callslick);
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

function getFilters(){
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

    var bedrooms = [];
    for (var option of $('#bedrooms option'))
    {
        if (option.selected) {
            bedrooms.push(option.value);
        }
    }
    var bathrooms = [];
    for (var option of $('#bathrooms option'))
    {
        if (option.selected) {
            bathrooms.push(option.value);
        }
    }
    //alert(selected);

    var data = {
        location:$('#ptype :selected').val(),
        propertyTo:$('#propertyTo :selected').val(),
        bedrooms:bedrooms,
        bathrooms:bathrooms,
        bage:$('#bage :selected').val(),
        area: $("#areaRange").val().split(";"),
        price: $("#priceRange").val().split(";"),
        amenities:amenities
    }

    return data;
}

$("#btnFilter").click(function (e) { 
    e.preventDefault();
    //var type = $('#propertyTo :selected').val();
    var data = getFilters();
    console.log(data);
    getFlatsList();
});

