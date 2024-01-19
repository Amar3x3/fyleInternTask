window.addEventListener('scroll', reveal);
window.addEventListener('scroll', reveal_absolute);
window.addEventListener('scroll', reveal_right);
window.addEventListener('scroll', reveal_left);
function reveal(){
    var reveals = document.querySelectorAll('.reveal');

    for (var  i=0; i<reveals.length; i++){
        var windowheight= window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 10;

        if(revealtop < windowheight - revealpoint){
            reveals[i].classList.add('active');

        }
        else{
            reveals[i].classList.remove('active');
        }

    }
}
function reveal_absolute(){
    var reveals1 = document.querySelectorAll('.reveal_absolute');

    for (var  i=0; i<reveals1.length; i++){
        var windowheight1= window.innerHeight;
        var revealtop1 = reveals1[i].getBoundingClientRect().top;
        var revealpoint1 = 25;

        if(revealtop1 < windowheight1 - revealpoint1){
            reveals1[i].classList.add('active_absolute_div');

        }
        else{
            reveals1[i].classList.remove('active_absolute_div');
        }

    }
}
function reveal_right(){
    var reveals2 = document.querySelectorAll('.reveal-from-right');

    for (var  i=0; i<reveals2.length; i++){
        var windowheight2= window.innerHeight;
        var revealtop2 = reveals2[i].getBoundingClientRect().top;
        var revealpoint2 = 10;

        if(revealtop2 < windowheight2 - revealpoint2){
            reveals2[i].classList.add('active-right');

        }
        else{
            reveals2[i].classList.remove('active-right');
        }

    }
}
function reveal_left(){
    var reveals3 = document.querySelectorAll('.reveal-from-left');

    for (var  i=0; i<reveals3.length; i++){
        var windowheight3= window.innerHeight;
        var revealtop3 = reveals3[i].getBoundingClientRect().top;
        var revealpoint3 = 10;

        if(revealtop3 < windowheight3 - revealpoint3){
            reveals3[i].classList.add('active-left');

        }
        else{
            reveals3[i].classList.remove('active-left');
        }

    }
}