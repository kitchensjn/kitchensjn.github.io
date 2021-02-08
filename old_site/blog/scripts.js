function hamburger() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
        document.getElementById("Logo").classList.add("inactiveLink");
    } else {
        x.className = "topnav";
        document.getElementById("Logo").classList.remove("inactiveLink");
    }
    var content = document.getElementById("galleryContent");
    if (content) {
        if (content.style.top === "62px") {
        content.style.top = ((document.getElementById("myTopnav").querySelectorAll("a").length - 1) * 62 + 3).toString() + "px";
        } else {
        content.style.top = "62px";
        }
    }
}

window.addEventListener('resize', function(event){
    var x = document.getElementById("myTopnav");
    var content = document.getElementById("galleryContent");
    if (content) {
        if (window.innerWidth > 768) {
            content.style.top = "53px";
            document.getElementById("Logo").classList.remove("inactiveLink");
        } else if (x.className === "topnav") {
            content.style.top = "53px";
            document.getElementById("Logo").classList.remove("inactiveLink");
        } else {
            content.style.top = ((document.getElementById("myTopnav").querySelectorAll("a").length - 1) * 53 + 3).toString() + "px";
            document.getElementById("Logo").classList.add("inactiveLink");
        }
    };
});