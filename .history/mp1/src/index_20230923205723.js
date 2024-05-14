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





const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("nav .container ul li");
const height = window.innerHeight;
window.addEventListener("scroll", () => {
    var bar = document.getElementById('navbar');
    bar.style.height = (15 - 2 * (pageYOffset/height)) + 'vh';
    var container = document.getElementById('navcontainer');
    container.style.fontSize = (20 - 2 * pageYOffset/height) + 'px';
    
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


document.getElementById('modalbutton').addEventListener('click',() => {
  const column = this.parentElement;
  const modalContent = document.querySelector('.modalContent')
  modalContent.innerHTML += column.querySelector('p', 'img').innerHTML;
  document.querySelector('.modelwin').style.display = 'block';
});

document.getElementById('modalClose').addEventListener('click',()=> {
  document.querySelector('.modelwin').style.display = 'none';
});


const images = document.getElementsByClassName('carousel_image');

let index= 0;
document.getElementById('carousel_button').addEventListener('click',() => {
    let i;
    for(i = 0; i < images.length; i++) {
        images[i].style.display = 'none';
    }
    index++;
    if(index > images.length) {
        index = 1;
    }
    images[index - 1].style.display = 'block';
    
    
});
  
