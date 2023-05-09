/* Open Dropdown Menu If Not Open, Close If Open */
function hamburger() {
    var x = document.getElementById("topnav");
    if (x.className === "") {
        x.className += "responsive";
        document.getElementById("Logo").classList.add("inactive");
    } else {
        x.className = "";
        document.getElementById("Logo").classList.remove("inactive");
    }
}

/* Go To Section And Close Dropdown Menu */
function goTo(id){
    var x = document.getElementById("topnav");
    x.className = "";
    document.getElementById("Logo").classList.remove("inactive");
    if (id == "#bio") {
        $('html,body').animate({scrollTop: $(id).offset().top-30},'slow');
    } else {
        $('html,body').animate({scrollTop: $(id).offset().top},'slow');
    }
}


/* Hide Dropdown Menu When User Clicks Outside of Menu */
$(document).mouseup(function(e) {
    var container = $("#topnav");

    console.log("success");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("responsive");
    }
});