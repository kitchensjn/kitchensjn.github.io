window.addEventListener("scroll", function(event){
    if (window.pageYOffset+window.innerHeight >= document.getElementById("bio").offsetTop+100) {
        document.getElementById("contact").classList.remove("unstick");
    } else {
        document.getElementById("contact").classList.add("unstick");
    }
    if(window.pageYOffset >= 0){
        $(".section-title").removeClass("active");
        var activePage = document.getElementById("Home");
        activePage.classList.add("active");
    }
    if(window.pageYOffset > document.getElementById("bio").offsetTop - 250) {
        $(".section-title").removeClass("active");
        var activePage = document.getElementById("Bio");
        activePage.classList.add("active");
    }
    if(window.pageYOffset > document.getElementById("projects").offsetTop - 250) {
        $(".section-title").removeClass("active");
        var activePage = document.getElementById("Projects");
        activePage.classList.add("active");
    }
    if(window.pageYOffset > document.getElementById("blog").offsetTop - 300) {
        $(".section-title").removeClass("active");
        var activePage = document.getElementById("Blog");
        activePage.classList.add("active");
    }
  });


// Select the button element by its ID
const projectsArrow = document.getElementById("ProjectsArrow");

// Add the click event listener
projectsArrow.addEventListener("click", () => {
    var x = document.getElementById("arrowProjects");
    if (x.className == "fas fa-chevron-down arrow") {
        x.classList.add("flip");
        document.getElementById("textProjects").innerText = "Show Less";
    } else {
        x.className = "fas fa-chevron-down arrow";
        document.getElementById("textProjects").innerText = "Show More";
    }
    var p = document.querySelectorAll(".hideProjects");
    var q = document.querySelectorAll(".unhideProjects");
    var j;
    for (j = 0; j < p.length; j++) {
        p[j].classList.remove("hideProjects");
        p[j].classList.add("unhideProjects");
    }
    var k;
    for (k = 0; k < q.length; k++) {
        q[k].classList.remove("unhideProjects");
        q[k].classList.add("hideProjects");
    }
    if (q.length > 0) {
        $('html,body').animate({scrollTop: $("#projects").offset().top},'fast'); 
    }
});


// Select the button element by its ID
const blogArrow = document.getElementById("BlogArrow");

// Add the click event listener
blogArrow.addEventListener("click", () => {
    var x = document.getElementById("arrowBlog");
    if (x.className == "fas fa-chevron-down arrow") {
        x.classList.add("flip");
        document.getElementById("textBlog").innerText = "Show Less";
    } else {
        x.className = "fas fa-chevron-down arrow";
        document.getElementById("textBlog").innerText = "Show More";
    }
    var p = document.querySelectorAll(".hideBlog");
    var q = document.querySelectorAll(".unhideBlog");
    var j;
    for (j = 0; j < p.length; j++) {
        p[j].classList.remove("hideBlog");
        p[j].classList.add("unhideBlog");
    }
    var k;
    for (k = 0; k < q.length; k++) {
        q[k].classList.remove("unhideBlog");
        q[k].classList.add("hideBlog");
    }
    if (q.length > 0) {
        $('html,body').animate({scrollTop: $("#blog").offset().top},'fast'); 
    }
});