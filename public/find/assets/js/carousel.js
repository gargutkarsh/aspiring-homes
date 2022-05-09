$(document).ready(function () {
//     $('.owl-carousel').owlCarousel({
//     loop:true,
//     margin:10,
//     nav:false,
//     autoplay:true,
//     autoplayTimeout:3000,
//     autoplayHoverPause:true,
//     responsive:{
//         0:{
//             items:1
//         },
//         600:{
//             items:2
//         },
//         1000:{
//             items:3
//         }
//     }
// })
});

$("#divOtherImages").hover(function () {
        // over
        
        document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                console.log("Left key is pressed.");
                break;
            case 38:
                console.log("Up key is pressed.");
                break;
            case 39:
                console.log("Right key is pressed.");
                break;
            case 40:
                console.log("Down key is pressed.");
                break;
        }
    };
        
    }, function () {
        // out
        document.onkeydown = function (event) {
            
        }
    }
);
