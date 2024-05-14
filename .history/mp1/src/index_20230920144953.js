/*
 * This is the main entry point for Webpack, the compiler & dependency loader.
 * All files that are necessary for your web page and need to be 'watched' for changes should be included here!
 */

// HTML Files
import './index.html';

// Stylesheets
import './css/main.scss';

// Scripts
import './js/main.js';


function scrollDown() {
    var container = document.getElementById('navcontainer');
    var scrollVal = window.pageYOffset;
    let height = window.innerHeight;
    container.style.height = (30 - 10 * parseFloat((scrollVal/height),toFixed(2))) + '%';
}


const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("nav .container ul li");

window.addEventListener("scroll", () => {
    var container = document.getElementById('navcontainer');
    var bar = document.getElementById('navbar');
    var scrollVal = window.pageYOffset;
    
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLi.forEach((li) => {
    li.classList.remove("active");
    if (li.classList.contains(current)) {
      li.classList.add("active");
    }
  });
});
  