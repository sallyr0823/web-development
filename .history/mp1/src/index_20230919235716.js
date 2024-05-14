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
window.addEventListener('scroll',() => 
{
    let currnt = "";
    sections.forEach(section =>{
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }

    }
        )
}
)