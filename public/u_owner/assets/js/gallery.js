function pic(x){
    var custom_btn =  $("#choose"+x);
    var main_btn = document.querySelector("#file"+x);
    custom_btn.on("click", function () {
        main_btn.click();
    });
    main_btn.addEventListener("change", function () {
        $("#images-error").addClass("d-none");
        const wrapper = document.querySelector("#wrapper"+x);
        const img_src = document.querySelector("#img"+x);
        const cancel_btn = document.querySelector("#cancel"+x);

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                wrapper.classList.remove("active");
                this.val('');
            });
            reader.readAsDataURL(file);
        }
    
    });
}

$(document).ready(function () {
   var custom_btn1 =  $("#choose1");
    var main_btn1 = document.querySelector("#file1");
    custom_btn1.on("click", function () {
        main_btn1.click();
    });
    main_btn1.addEventListener("change", function () {
        $("#images-error").addClass("d-none");
        const wrapper = document.querySelector("#wrapper1");
        const img_src = document.querySelector("#img1");
        const cancel_btn = document.querySelector("#cancel1");

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                wrapper.classList.remove("active");
                this.val('');
            });
            reader.readAsDataURL(file);
        }
    
    });
    
    
    var custom_btn2 =  $("#choose2");
    var main_btn2 = document.querySelector("#file2");
    custom_btn2.on("click", function () {
        main_btn2.click();
    });
    main_btn2.addEventListener("change", function () {
        $("#images-error").addClass("d-none");
        const wrapper = document.querySelector("#wrapper2");
        const img_src = document.querySelector("#img2");
        const cancel_btn = document.querySelector("#cancel2");

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                wrapper.classList.remove("active");
            });
            reader.readAsDataURL(file);
        }
    
    });


    var custom_btn3 =  $("#choose3");
    var main_btn3 = document.querySelector("#file3");
    custom_btn3.on("click", function () {
        main_btn3.click();
    });
    main_btn3.addEventListener("change", function () {
        $("#images-error").addClass("d-none");
        const wrapper = document.querySelector("#wrapper3");
        const img_src = document.querySelector("#img3");
        const cancel_btn = document.querySelector("#cancel3");

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                wrapper.classList.remove("active");
            });
            reader.readAsDataURL(file);
        }
    
    });


    var custom_btn4 =  $("#choose4");
    var main_btn4 = document.querySelector("#file4");
    custom_btn4.on("click", function () {
        main_btn4.click();
    });
    main_btn4.addEventListener("change", function () {
        $("#images-error").addClass("d-none");
        const wrapper = document.querySelector("#wrapper4");
        const img_src = document.querySelector("#img4");
        const cancel_btn = document.querySelector("#cancel4");

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                img_src.src = result;
                wrapper.classList.add("active");
            };
            cancel_btn.addEventListener("click", function () {
                img_src.src = "";
                wrapper.classList.remove("active");
            });
            reader.readAsDataURL(file);
        }
    
    });
    
});