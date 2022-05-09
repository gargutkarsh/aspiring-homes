//http://demo.parassales.in/
var urlbase = "http://localhost:5000/";
var imgbase = "http://localhost:5000/";
var userId = "";
var authId = "0";
var authStatus = "0";
// $("signbtn a").click(function(){
//     localStorage.setItem("rup-user", "");
//     resetView();
// });
function logout(){ 
  localStorage.setItem("rup-user", "");
  //resetView();
  window.location = "../index.html";
}

function getUserdata(){
  $("#findHomes").removeClass("d-none");
  var dataString = localStorage.getItem("rup-user");
  if (dataString) {
    var data = JSON.parse(dataString);
    //console.log(data);
    //console.log(data.username + " " + data.password);
    $.ajax({
      type: "POST",
      contentType: "application/json",
      async: true,
      url: urlbase + "minor/getUserdata",
      data: JSON.stringify(data),
      datatype: "json",
      success: function (response) {
        if(response.status == "1"){
          setView();
          setUser(response);
        }
        else logout();
          //console.log(response);
      },
      error: function (error) {
          console.log(error);
      }
    });
  }
}

$("#btnLogin").click(function (e) { 
  e.preventDefault();
  var u = $("#txtUsername");
  var p = $("#txtPassword")
  u.on('keyup',function(){
    u.addClass("error");
    if(u.val()!=""){
      u.removeClass("error");
      $("#divWC").addClass("d-none");
      $("#divIA").addClass("d-none");
    }
  });
  p.on('keyup',function(){
    p.addClass("error");
    if(p.val()!=""){
      p.removeClass("error");
      $("#divWC").addClass("d-none");
      $("#divIA").addClass("d-none");
    }
  });
  if(u.val()==""){
    u.addClass("error");
    u.focus();
  }
  
  else if(p.val()==""){
    p.addClass("error");
    p.focus();
    
  }
  
  if(u.val()!="" && p.val()!=""){
    var data = {
      username:u.val(),
      password:p.val()
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      async: true,
      url: urlbase + "minor/findUser",
      datatype: "json",
      data: JSON.stringify(data),
      success: function (response) {
        if(response.status == "1"){
          if(response.match){
            $("#login").modal('hide');
            localStorage.setItem("rup-user",JSON.stringify(data));
            getUserdata();
          }
          else{
            $("#divWC").removeClass("d-none");
          }
        }
        else if(response.status == "0"){
          $("#divIA").removeClass("d-none");
          setTimeout(function(){
            $("#login").modal('hide');
          },1500);
        }
        else if(response.status == "2"){
          if(response.match){
            $("#pills-login-tab").addClass("d-none");
            $("#pills-signup-tab").addClass("d-none");
            $("#pills-verify-tab").removeClass("d-none");
            $("#pills-verify-tab").click();

            $("#txtEmail").val(response.email);
            $("#spanName").text(response.name);
            // $("#login").modal({
            //   backdrop: 'static',
            //   keyboard:false
            //   });

            // $("#login").modal('hide');
            localStorage.setItem("rup-user",JSON.stringify(data));
            // getUserdata();
            console.log("here");
          }
          else{
            $("#divWC").removeClass("d-none");
          }
        }
        //console.log(response);
      },
      error: function (error) {
          console.log(error);
      }
    });

    //console.log(data);
    
  }

  //$("#login").modal('hide');
});

$(document).ready(function () {
  getUserdata();
});

function resetView(){
  $("#user-img").addClass("d-none");
  $("#signbtn").removeClass("d-none");
  $("#user-img-mobile").addClass("d-none");
  $("#signbtn-mobile").removeClass("d-none");
  $("#spanMobileUser").addClass("d-none");
  $("#spanMobileDefault").removeClass("d-none");

  var navmenu = `<li>
    <a href="index.html">Home</a>
  </li>
  <li><a href="#">About</a></li>
  <li><a href="faq.html">FAQs</a></li>
  <li><a href="contact.html">Contact</a></li>`;
   $(".user-nav-menu").html("");
   $(".user-nav-menu").append(navmenu);

}
function setView(){
  $("#user-img").removeClass("d-none");
  $("#signbtn").addClass("d-none");
  $("#user-img-mobile").removeClass("d-none");
  $("#signbtn-mobile").addClass("d-none");
  $("#spanMobileUser").removeClass("d-none");
  $("#spanMobileDefault").addClass("d-none");
}

const getAuths = async ()=>{
  
  return Promise.resolve({
    id:authId,
    status:authStatus
  });
}

function setFlatLink(){

  //this is to hide flats link if user is tenant and already in a flat

  // if(authId=="5"&&authStatus=="1"){
  //   var w = ".." + window.location.pathname;
  //   //console.log(w);
  //   if(w.includes("../find/")){
  //     window.location = "../index.html";
  //   }
  //   $("#findHomes").addClass("d-none");
  // }
}

function setUser(record){
  var base = "";
  var deletelink = "";
  //console.log(record.auth);
  
  //console.log($("#findHomes"));
  authId = record.auth;

  var links = "";
  if(record.auth == "1"){
    base = "../u_head/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";


  }
  else if(record.auth == "2"){
    base = "../u_admin/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= '"+ base +"datahandlers.html'><i class='fa fa-pen-nib mr-2'></i>Data Handlers</a></li>";
    links = links + "<li><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>Parking</a></li>";
    links = links + "<li><a href= '"+ base +"guards.html'><i class='fa fa-pen-nib mr-2'></i>Parking Guards</a></li>";
    links = links + "<li><a href= '"+ base +"defaulters.html'><i class='fa fa-bookmark mr-2'></i>Defaulters List</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";

  }
  else if(record.auth == "3"){
    base = "../u_datahandler/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= '"+ base +"billgenerator.html'><i class='fa fa-pen-nib mr-2'></i>Bill Generator</a></li>";
    links = links + "<li><a href= '"+ base +"defaulters.html'><i class='fa fa-bookmark mr-2'></i>Defaulters List</a></li>";
    links = links + "<li><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";

  }
  else if(record.auth == "4"){
    base = "../u_owner/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= '"+ base +"tenants.html'><i class='fa fa-tasks mr-2'></i>My Tenants</a></li>";
    links = links + "<li><a href= '"+ base +"registerflat.html'><i class='fa fa-pen-nib mr-2'></i>Register New Flat</a></li>";
    links = links + "<li><a href= '"+ base +"editflat.html'><i class='fa fa-pen-nib mr-2'></i>Edit Flat</a></li>";
    links = links + "<li><a href= '"+ base +"bills.html'><i class='fa fa-tasks mr-2'></i>My Bills</a></li>";
    links = links + "<li><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>My Parking</a></li>";
    links = links + "<li><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";
    authStatus = record.status;
  }
  else if(record.auth == "5"){
    base = "../u_tenant/";
    //console.log(record);
    if(record.rStatus!="1" && record.tenantStatus!="0"){
      links = links + "<li><a href= '"+ base +"setMeterReading.html'><i class='fa fa-pen-nib mr-2'></i>set Meter Readings</a></li>";
    }
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= 'javascript:checkNoDue();'><i class='fa fa-stamp mr-2'></i>Issue NoDue Certificate</a></li>";
    links = links + "<li><a href= '"+ base +"bills.html'><i class='fa fa-tasks mr-2'></i>My Bills</a></li>";
    links = links + "<li><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>My Parking</a></li>";
    links = links + "<li><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";
    authStatus = record.tenantStatus;
  }

  else if(record.auth == "6"){
    userId = record.userId;
    deletelink =  `<li class="" id="liDeleteAccount">
      <a href="#" id="a_msg_main" class="" data-toggle="modal" data-target="#autho-message"><i class="fa fa-trash mr-2"></i>Delete Account</a>
    </li>`
  }

  else if(record.auth == "7"){
    base = "../u_guard/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";

  }
    //console.log(record);


  var logout = "<li><a href='javascript:logout()'><i class='fa fa-sign-out-alt mr-2'></i>Log Out</a></li>"


  $("#user-name").html("Hi, " + record.name);
  $("#spanNameMobile").text("Hi, " + record.name);
  $("#user-menu").html("");
  $("#user").attr('src', imgbase + record.profilePic);
  $(".userImg").attr('src', imgbase + record.profilePic);
  $("#user-menu").prepend(links);
  $("#user-menu").append(logout);
  $("#user-menu").append(deletelink);
  //console.log(record);


  var links = "";
  if(record.auth == "1"){
    base = "../u_head/";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";


  }
  else if(record.auth == "2"){
    base = "../u_admin/";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"datahandlers.html'><i class='fa fa-pen-nib mr-2'></i>Data Handlers</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>Parking</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"guards.html'><i class='fa fa-pen-nib mr-2'></i>Parking Guards</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"defaulters.html'><i class='fa fa-bookmark mr-2'></i>Defaulters List</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";

  }
  else if(record.auth == "3"){
    base = "../u_datahandler/";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"billgenerator.html'><i class='fa fa-pen-nib mr-2'></i>Bill Generator</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"defaulters.html'><i class='fa fa-bookmark mr-2'></i>Defaulters List</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";

  }
  else if(record.auth == "4"){
    base = "../u_owner/";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"tenants.html'><i class='fa fa-tasks mr-2'></i>My Tenants</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"registerflat.html'><i class='fa fa-pen-nib mr-2'></i>Register New Flat</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"editflat.html'><i class='fa fa-pen-nib mr-2'></i>Edit Flat</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"bills.html'><i class='fa fa-tasks mr-2'></i>My Bills</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>My Parking</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";

  }
  else if(record.auth == "5"){
    base = "../u_tenant/";
    if(record.rStatus!="1" && record.tenantStatus!="0"){
      links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"setMeterReading.html'><i class='fa fa-pen-nib mr-2'></i>set Meter Readings</a></li>";
    }
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= 'javascript:checkNoDue();'><i class='fa fa-stamp mr-2'></i>Issue NoDue Certificate</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"bills.html'><i class='fa fa-tasks mr-2'></i>My Bills</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"parking.html'><i class='fa fa-car mr-2'></i>My Parking</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"addDoner.html'><i class='fa fa-pen-nib mr-2'></i>Add Donner</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";
    links = links + "<li class='d-lg-none d-block'><a href= '"+ base +"change-password.html'><i class='fa fa-unlock-alt mr-2'></i>Change Password</a></li>";

  }

  
  else if(record.auth == "6"){

    deletelink = `<li class="d-lg-none d-block" id="liDeleteAccount">
      <a href="#" id="a_msg_main" class="" data-toggle="modal" data-target="#autho-message"><i class="fa fa-trash mr-2"></i>Delete Account</a>
    </li>`
  }

  else if(record.auth == "7"){
    base = "../u_guard/";
    links = links + "<li><a href= '"+ base +"dashboard.html'><i class='fa fa-tachometer-alt mr-2'></i>Dashboard</a></li>";
    links = links + "<li class='d-lg-none d-inline-block'><a href= '"+ base +"my-profile.html'><i class='fa fa-user-tie mr-2'></i>My Profile</a></li>";

  }

  logout = "<li class='d-lg-none d-block'><a href='javascript:logout()'><i class='fa fa-sign-out-alt mr-2'></i>Log Out</a></li>"
  var navmenu = `<li>
    <a href="../index.html"><i class='fa fa-home mr-2 d-lg-none d-inline-block'></i>Home</a>
  </li>${links}
  <li><a href="../faq.html"><i class='fa fa-tasks mr-2 d-lg-none d-inline-block'></i>FAQs</a></li>
  <li><a href="#"><i class='fa fa-angle-double-right mr-2 d-lg-none d-inline-block'></i>About</a></li>
  <li id='findHomes'><a href="../find/flats.html"><i class='fa fa-search mr-2 d-lg-none d-inline-block'></i>Flats</a></li>

  <li><a href="../contact.html"><i class='fa fa-envelope mr-2 d-lg-none d-inline-block'></i>Contact</a></li>${logout + deletelink}`;
  
   $(".user-nav-menu").html("");
   $(".user-nav-menu").append(navmenu);

   if(record.auth == "7"){
     $(".user-nav-menu").html("");
     $(".user-nav-menu").append(links+logout);
      var w = ".." + window.location.pathname;
      //console.log(w);
      if(!w.includes("../u_guard/")){
        window.location = "../u_guard/dashboard.html";
      }
   }

   if(record.auth != "6"&&record.auth != "4"&&record.auth != "5"){
    var w = ".." + window.location.pathname;
    //console.log(w);
    if(w.includes("../find/")){
      window.location = "../index.html";
    }
    $("#findHomes").addClass("d-none");
  }
   setActiveLink();
   setFlatLink();
}

function setActiveLink(){
  var w = ".." + window.location.pathname;
  //console.log(windowLocation);
  $(".user-nav-menu li").each(function () {
      var a = $(this).find("a");
      var link = a.attr("href");
      //console.log(link);
      if (w == link) {
        $(this).addClass("active")   
      }
      else {
        $(this).removeClass("active")   
      }
  });
}

// $("#btnotp").click(function (e) { 
//   e.preventDefault();



//   //console.log("in otp");
//   //$('#login').removeData('bs.modal').modal({backdrop: true, keyboard: true});
//   // $("#login").modal({
//   //   backdrop: true,
//   //   keyboard:true,
//   //   hide:true
//   // });
//   //$("#login").modal("hide");
// });


//send otp
$("#btnotp").on("click", function () {
    var record = {
                name: $("#spanName").text(),
                phone: "",
                email: $("#txtEmail").val(),
                otp: ""
            };
        
        //console.log(data);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "minor/sendOTP",
            //data: "{'admininfo':" + JSON.stringify(data) + "}",
            data: JSON.stringify(record),
            datatype: "json",
            beforeSend: function () {

                $("#i_sendotp").removeClass("d-none");
                $("#btnotp").attr('disabled', true);
                $("#span_sendotp").text("Sending..");
            },
            success: function (response) {
                //console.log(response);
            },
            complete: function () {
                setTimeout(function () {
                    $("#i_sendotp").addClass("d-none");
                    $("#btnotp").attr('disabled', false);
                    $("#span_sendotp").text("RESEND");
                    $("#userotp").attr('placeholder', "Enter the OTP");
                    $("#userotp").focus();
                    $("#userotp").attr('disabled', false);
                    $("#btn_verifyotp").attr('disabled', false);
                    
                }, 2000);
            },
            error: function (error) {
                //if (!navigator.onLine) {
                //    window.location = "errors-404-error.html";
                //}
                //alert('error : ' + error);
                console.log(error);

            }
        });
});

//validate otp
$("#userotp").on("keyup", function () {
    //console.log("in");
    if (!$("#userotp-error").hasClass("d-none")) {
        $("#userotp-error").addClass("d-none")
    }
    if ($("#userotp").val().length == 0) {
        $("#userotp-error").removeClass("d-none");
        $("#userotp-error").text("Please enter the otp");
        $("#btn_verifyotp").attr('disabled',true);
        return;
    }
    if ($("#userotp").val().length < 6) {
        $("#userotp-error").removeClass("d-none");
        $("#userotp-error").text("Complete the 6 characters");
        $("#btn_verifyotp").attr('disabled',true);
        return;
    }
    $("#userotp-error").addClass("d-none");
    $("#btn_verifyotp").click();
    
});

    //verify otp
$("#btn_verifyotp").on("click", function () {
    if ($("#userotp").val() == "") {
        $("#userotp-error").removeClass("d-none");
        $("#userotp").focus();
        return;
    }
    if ($("#userotp").val().length < 6) {
        $("#userotp-error").removeClass("d-none");
        $("#userotp-error").text("Complete the 6 characters");
        $("#userotp").focus();
        return;
    }
    var data = { otp: $("#userotp").val(), email: $("#txtEmail").val() };
    //var data = { otp: "234356", email: "gkunal13579@gmail.com" };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/checkOTP/"+data.email+"/"+data.otp,
        data: {},
        datatype: "json",
        beforeSend: function () {
            $("#i_checkotp").removeClass("d-none");
            $("#btnotp").attr('disabled', true);
            $("#btn_verifyotp").attr('disabled', true);
            $("#span_verifyotp").text("cheking..");
        },
        success: function (response) {
            console.log(response.match);
            if (response.match) {
                setTimeout(function () {
                    $("#i_checkotp").addClass("d-none");
                    $("#i_verifiedotp").removeClass("d-none");
                    $("#span_verifyotp").text("Verified");
                    $("#userotp").attr('disabled', true);
                    $("#userotp-error").addClass("d-none");
                    $("#userotp-error").addClass("verified");

                    setStatus();
                }, 1000);


            }
            else {
                setTimeout(function () {
                    $("#i_checkotp").addClass("d-none");
                    $("#i_verifiedotp").addClass("d-none");
                    $("#span_verifyotp").text("Verify");
                    $("#userotp").attr('disabled', false);
                    $("#btn_verifyotp").attr('disabled', false);
                    $("#btnotp").attr('disabled', false);

                    $("#userotp-error").removeClass("d-none");
                    $("#userotp-error").text("Wrong OTP!");
                }, 1000);
            }
        },
        complete: function (response) {
            
        },
        error: function (error) {

        }

    });
});

function setStatus(){
    var dataString = localStorage.getItem("rup-user");
    if (dataString) {
      var data = JSON.parse(dataString);
      //console.log(data.username + " " + data.password);
      $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/setStatus",
        data: JSON.stringify(data),
        datatype: "json",
        success: function (response) {
          if(response.done){
            $("#login").modal("hide");
            getUserdata();
          }
          else logout();
            //console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
      });
    }

}

function notifyOwner(username,bills,rentLeft){
  
    $.ajax({
      type: "POST",
      contentType: "application/json",
      async: true,
      url: urlbase + "minor/notifyOwner/"+username+"/"+bills+"/"+rentLeft,
      data: {},
      datatype: "json",
      success: function (response) {
        
      },
      error: function (error) {
          console.log(error);
      }
    });
}

function checkNoDue(){
  var dataString = localStorage.getItem("rup-user");
  if (dataString) {
    var data = JSON.parse(dataString);
    $.ajax({
      type: "POST",
      contentType: "application/json",
      async: true,
      url: urlbase + "tenant/checkNoDue",
      data: JSON.stringify(data),
      datatype: "json",
      success: function (response) {
        if(response.done){
          var billCount = parseInt(response.bills);
          var rentPending = parseInt(response.rentLeft);
          if(billCount==0 && rentPending==0){
            swal("No Due Left", "Good to Go!,", "success");
          }
          else{
            var warning = "Number of Bills Pending : " + billCount + ", Rent Pending : " + rentPending;
            swal("Dues Are Pending!",warning, "warning");
          }
          notifyOwner(data.username,billCount,rentPending);
        }
        else {
          swal("Somthing Wrong!", "Try Again!,", "error");
        }
        
      },
      error: function (error) {
          console.log(error);
      }
    });
  }
}

function notifyCR(data){
  $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/notifyContactRequest",
        data: JSON.stringify(data),
        datatype: "json",
        success: function () {
            
        },
        error: function (error) {
            console.log(error);
        }
    });

}
$("#btnContactRequest").click(function (e) { 
  e.preventDefault();
  let d = moment();
    var record = {
            name: $("#contactName").val(),
            email: $("#contactEmail").val(),
            subject: $("#contactSubject").val(),
            message: $("#contactMessage").val(),
            date: d.format("YYYY-MM-DD")                        
    };
    notifyCR(record);
    //console.log(data);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: true,
        url: urlbase + "minor/insertContactRequest",
        data: JSON.stringify(record),
        datatype: "json",
        beforeSend: function () {
              $("#btnContactRequest").attr("disabled",true);
        },
        success: function (response) {
          if(response.done){
            $("#contactName").val("");
            $("#contactEmail").val("");
            $("#contactSubject").val("");
            $("#contactMessage").val("");
            $("#btnContactRequest").attr("disabled",false);
            swal("Request Considered Successfully","Soon You will be get contact via email ","success");
            setTimeout(() => {
              window.location="../index.html";
            }, 3000);
          }  
        },
        error: function (error) {
            console.log(error);
        }
    });
  
});


$("#register_user").click(function (e) { 
  e.preventDefault();
  //alert("from here");
  window.localStorage.removeItem('flat');
  window.location = "../user.html";

  
});