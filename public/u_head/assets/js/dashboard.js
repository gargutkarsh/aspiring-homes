function setDashboard(){
        var dataString = localStorage.getItem("rup-user");
        if (dataString) {
          var data = JSON.parse(dataString);
          //console.log(data.username + " " + data.password);
          $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "admin/setDashboard",
            data: JSON.stringify(data),
            datatype: "json",
            success: function (response) {
              if(response.name != ""){
                $(".headName").html(response.name);
                $("#headProfile").attr('src',imgbase + response.profile);
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
      function bindSelectSector(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url:  urlbase +  "minor/getSectors",
            data: {},
            datatype: "json",
            success: function (response) {
                if (response.result.length > 0) {
                    $("#drpSectors").html("");
                    var list = "";
                    for (var i = 0; i < response.result.length; i++) {
                        list = list + "<option value='" + response.result[i].id + "'>" + response.result[i].name + "</option>";
                    }

                    $("#drpSectors").append(list);
                    bindtblRequests();
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

      function bindtblRequests(){
        var secId = $('#drpSectors :selected').val();

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: urlbase + "admin/getSectorPresidentRecords/" + secId,
                data: {},
                //data: "{'name':'" + name + "','phone':'" + Phone + "','address':'" + Address + "'}",
                datatype: "json",
                success: function (response) {
                    if (response.result.length > 0) {
                        $("#tblRequests").html('');
                        var table = "<thead><tr><th scope='col' id='cId' class='d-none'>Id</th><th scope='col' id='status' class='d-none'>status</th><th scope='col'>Name</th><th scope='col'>Email</th><th scope='col'>Date</th><th scope='col'>Info</th></tr></thead>";
                        table = table + "<tbody>";
                        for (var i = 0; i < response.result.length; i++) {
                            var active = "";
                            if(i==0){
                              $("#spancId").text(response.result[i].cId);
                            }
                            if(response.result[i].status=="1"){
                                active = "<span class='spanactive text-white px-1 ml-2 bg-success'>Active</span>";
                            }
                            let date = moment(response.result[i].date).format("DD/MM/YYYY");
                            table = table + "<tr><td id='cId' class='d-none'> " + response.result[i].cId + " </td><td id='status' class='d-none'> " + response.result[i].status + " </td><td> " + response.result[i].name + active +" </td><td> " + response.result[i].email + " </td><td> " + date + " </td><td><a href='javascript:void(0);' aid = " + response.result[i].cId + " onclick='funRequestInfo(this)' ><i class='fas fa-info-circle'></i></a></td></tr>";
                        }
                        table = table + "</tbody>";
                        $("#tblRequests").append(table);
                        bindRequestInfo();
                        //console.log($("#spancId").text());
                    }
                    else {
                        $("#tblRequests").html('');
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
      function bindRequestInfo(){
        var cId = $("#spancId").text();
         $.ajax({
            type: "GET",
            contentType: "application/json",
            async: true,
            url: urlbase + "admin/getRequestInfo/" + cId,
            data: {},
            datatype: "json",
            success: function (response) {
              if(response.found){
                $("#spanSector").text(response.sector);
                let m1 = moment(response.date).format("DD/MM/YYYY");
                $("#spanDate").text(m1);
                $("#spanName").text(response.name);
                $("#spanPhone").text(response.phone);
                $("#spanEmail").text(response.email);
                var status = response.status;
                if(status=="0"){status="In Queue"}
                else if(status == "1"){status="Active"}
                else{status="invalid"}
                $("#spanStatus").text(status);
                $("#imgFront").attr('src', imgbase + response.front);
                $("#imgBack").attr('src', imgbase + response.back);
              }
            },
            error: function (error) {
                console.log(error);
            }
          });
      }
      
      function funRequestInfo(target){
        var cId = $(target).attr("aid");
        $("#spancId").text(cId);
        bindRequestInfo();
      }
      
      function disable() {
        $("#btndeallot").attr("disabled", true);
        $("#btnallot").attr("disabled", true);
        $("#btndismiss").attr("disabled", true);
      }
      function enable() {
        $("#btndeallot").attr("disabled", false);
        $("#btnallot").attr("disabled", false);
        $("#btndismiss").attr("disabled", false);
      }

      function deAllot() {
        var cId = $("#spancId").text();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "admin/deAllotPresident/" + cId,
            data: {},
            datatype: "json",
            beforeSend:function(){
              disable();
              $("#ideallot").removeClass("d-none");
            },
            success: function (response) {
              if(response.done){
                bindtblRequests();
                enable();
                $("#ideallot").addClass("d-none");
              }
            },
            error: function (error) {
                console.log(error);
            }
          });
      }
      function dismissed() {
        var data = $("#txtDismissed").val();
        //console.log(data);
        if(data==""){
          $("#txtDismissed").focus();
        }
        else{
          var cId = $("#spancId").text();
          $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "admin/dismissedPresident/" + cId + "/"+data,
            data: {},
            datatype: "json",
            beforeSend:function(){
              disable();
              $("#idismiss").removeClass("d-none");
            },
            success: function (response) {
              if(response.done){
                $("#txtDismissed").val("");
                bindtblRequests();
                enable();
                $("#idismiss").addClass("d-none");
              }
            },
            error: function (error) {
                console.log(error);
            }
          });
        }
        
      }
      function allot() {
        var cId = $("#spancId").text();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            async: true,
            url: urlbase + "admin/allotPresident/" + cId,
            data: {},
            datatype: "json",
            beforeSend:function(){
              disable();
              $("#iallot").removeClass("d-none");
            },
            success: function (response) {
              if(response.done){
                bindtblRequests();
                enable();
                $("#iallot").addClass("d-none");
              }
            },
            error: function (error) {
                console.log(error);
            }
          });
      }

      $(document).ready(function () {
        setDashboard();
        bindSelectSector();
        $('.single-select').select2();
      });
      