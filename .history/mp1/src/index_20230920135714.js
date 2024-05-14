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
    var headerdiv = document.getElementById('header');
    var scrollVal = window.pageYOffset;
    let height = window.innerHeight;
    headerdiv.style.fontSize = (20 - 8 * scrollVal/height) + 'px';
}

const sections = document.querySelectorAll('content','foot');
const hyperlink = document.querySelectorAll('nav2')
window.addEventListener("scroll", () => {
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
  
  // *********************
  // This Code is for only the floating card in right bottom corner
  // **********************
  
  const WebCifarIcon = document.querySelector("#webCifar-icon");
  const WebCifarEl = document.querySelector("#webCifar");
  const close = WebCifarEl.querySelector(".close");
  const youtubeLink = document.querySelector(".youtubeLink");
  
  WebCifarIcon.addEventListener("click", () => {
    WebCifarEl.classList.add("active");
  });
  close.addEventListener("click", () => {
    WebCifarEl.classList.remove("active");
  });