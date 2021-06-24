const landingPage = document.getElementById('landing');
const homePage = document.getElementById('home');
const scrollPos = document.querySelector(':root');
// To animate home text svgs
const homeText = document.querySelectorAll('#svg-text path');

const starCountContainer = document.getElementById('star-count');
const starCountTrigger = document.querySelector('#mystery svg')
const starCountInput = document.getElementById('star-count-input')
const applyStarCount = document.getElementById('submit')
const colors = ['#97e1ff', '#ffae80', '#6171ff'];
const shadows = ['#c0edff', '#ffd4bb', '#c0c1ff'];
// Array containing all the stars and its related animation object so that we can check when a star is off screen and restart their animation
const stars = [];

const makeAndMoveStars = (i, isInit) => {
    // Generate random top position, select correct colors and randomize size for star
    const randSelectedColor = Math.floor(Math.random() * colors.length);
    const randVerticalPos = Math.random() * landingPage.offsetHeight + landingPage.offsetTop;
    const randSize = Math.floor(Math.random() * (7 - 1) + 1)

    let horizontalPos = Math.random() * landingPage.offsetWidth + landingPage.offsetLeft;

    // Make star
    const star = document.createElement('span');
    star.style.width = `${randSize}px`;
    star.style.height = `${randSize}px`;
    star.style.backgroundColor = `${colors[randSelectedColor]}`;
    star.style.boxShadow = `0 0 10px ${shadows[randSelectedColor]}`;
    star.style.top = `${randVerticalPos}px`;
    star.style.left = `${horizontalPos}px`;
    star.classList.add('star');
    // Add hidden class initially, remove after SVG Animation has finished (2s)
    isInit ? star.classList.add('hidden') : '';
    star.id = `${i}`
    landingPage.append(star);

    // Put corresponding animation duration/speed depending on size
    let duration = 0;
    switch (randSize) {
        case 1:
            duration = 90000;
            break;
        case 2:
            duration = 80000;
            break;
        case 3:
            duration = 70000;
            break;
        case 4:
            duration = 60000;
            break;
        case 5:
            duration = 50000;
            break;
        case 6:
            duration = 40000;
            break;
    }

    // Move star
    const moveStarKeyframes = {
        transform: 'translateX(0)',
        transform: 'translateX(-105vw)'
    }
    const options = {
        duration: duration,
        fill: 'forwards',
    }

    // Push star to array to check on each one later
    const specificStar = document.getElementById(`${i}`);

    // Stars is an array of objects, each object containing the star, and its related animation object
    stars.push({ specificStar, animationObj: specificStar.animate(moveStarKeyframes, options) });
}

// Function to make initial stars
function makeStars(starCount, isInit = true) {
    for (i = 0; i < starCount; i++) {
        // Make stars
        makeAndMoveStars(i, isInit);
    }

    // Prefill starcount with amount currently on screen
    starCountInput.value = starCount;
}
// function to remove stars
function removeStars() {
    // reset stars array
    stars.length = 0;

    // delete all stars on page
    let starsInDOM = document.querySelectorAll('span');
    for (let star of starsInDOM) {
        star.remove()
    }
}

// Periodically check when star is out of bounds of container -
// - then cancel animation, restart it, and move it back to start
let id = setInterval((function () {
    for (let star of stars) {
        if (star.specificStar.getBoundingClientRect().left <= landingPage.offsetLeft - 6) {
            star.animationObj.cancel();
            star.specificStar.style.left = `${landingPage.offsetLeft + landingPage.offsetWidth}px`;
            star.specificStar.style.top = `${Math.random() * landingPage.offsetHeight + landingPage.offsetTop}px`
            star.animationObj.play();
        }
    }
}), 1)

// Making initial stars on page load
makeStars(80);
// Remove hidden class when SVG animation is finished
setTimeout(() => {
    // remove hidden class from stars when SVG animation has finished
    document.querySelectorAll('.star').forEach((star) => {
        star.classList.remove('hidden');
    });
}, 2000)

const starCountForm = document.getElementById('star-count-form');
starCountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Not allow values under 1 or more than 3000
    if (starCountInput.value < 1 || starCountInput.value > 400) {
        // play popup message based on if user puts too much or too less
        starCountInput.style.backgroundColor = 'rgba(255, 0, 0, 0.527)';
        setTimeout(() => {
            starCountInput.style.backgroundColor = '';
        }, 200)
        return;
    }

    // Remove all stars
    removeStars();

    // Make new amount of stars
    makeStars(starCountInput.value, false);
});

starCountTrigger.addEventListener('click', () => {
    starCountContainer.classList.toggle('hidden');
})

// Web animations API to animate shadow light and each letter with javascript 
const heroText = document.querySelector('#hero-text');
const keyframes = [
    { filter: 'drop-shadow(0 0 50px #55d7ff)' },
    { filter: 'drop-shadow(0 0 30px #55d7ff)' }
]
const options = {
    duration: 500,
    delay: 1800,
    easing: 'ease',
    fill: 'forwards'
}
heroText.animate(keyframes, options);

for (let i = 0; i < homeText.length; i++) {
    // The stroke-dasharray and the stroke-offset must start with the full length of the path

    // Set each letters corresponding dasharray and offset values
    // Setting stroke-dasharray to full length of path, then ofsetting it by that length aswell to make it dissapear
    let specificLetter = homeText[i];
    specificLetter.style.strokeWidth = '2px';
    specificLetter.style.strokeDasharray = specificLetter.getTotalLength();
    specificLetter.style.strokeDashoffset = specificLetter.getTotalLength();

    // Make keyframes and options for each letter(path)
    const keyframes1 = [
        { strokeDashoffset: 0 },
    ];
    const keyframes2 = [
        { fill: '#00c3ff' }
    ]

    const options1 = {
        duration: 2000,
        easing: 'ease',
        fill: 'forwards',
    }
    const options2 = {
        duration: 500,
        delay: 1800,
        easing: 'ease',
        fill: 'forwards'
    }

    // Animate SVG paths
    homeText[i].animate(keyframes1, options1);
    homeText[i].animate(keyframes2, options2)
}
// Add visible class to other elements after 2 seconds
const elements = document.querySelectorAll('.fade-in-element');
setTimeout(() => {
    for (let element of elements) {
        element.classList.add('visible');
    }
}, 2000);

// To animate the "..." on the continue button
const continueButton = document.querySelector('#continue-to-portfolio');
const text = 'Continue...';
let idx = 8;

writeText();

function writeText() {
    continueButton.innerText = `Continue${text.slice(8, idx)}`;
    idx++;
    if (idx > text.length) {
        idx = 8;
    }
    setTimeout(writeText, 800)
}

// Click listener for scrolling to landing page from main page
document.getElementById('continue-to-portfolio').addEventListener('click', () => {
    window.scrollTo(0, window.innerHeight);
})

// Setting the page height to the height of the landing page and home page combined
// so that the page is scrollable
document.body.style.height = `${homePage.scrollHeight + landingPage.scrollHeight}px`;
window.addEventListener('resize', () => {
    document.body.style.height = `${homePage.scrollHeight + landingPage.scrollHeight}px`;
})

// === 3D TRANSFORM ===
window.addEventListener('scroll', () => {
    // If bottom of landing page is still not at the top of the page, send transform degrees to css
    if (landingPage.getBoundingClientRect().bottom > 0) {
        scrollPos.style.setProperty('--transform', `${(parseFloat(90 - landingPage.getBoundingClientRect().bottom / window.innerHeight * 90)).toFixed(2)}deg`)
        landingPage.style.opacity = `${landingPage.getBoundingClientRect().bottom / window.innerHeight}`
        homePage.style.opacity = `${0.9 - landingPage.getBoundingClientRect().bottom / window.innerHeight}`

        // If landing page bottom it still not at top -
        // AND there are no stars(scrolled up from below the landing page, since stars are removed when scroll below landing page):
        // add stars again
        if (stars.length <= 0) {
            // Make new amount of stars
            // makeStars(starCountInput.value);
            makeStars(80, false);
        }
    }
    // if bottom of landing page is higher than top of screen, set degrees to 90 incase it couldnt update quick enough
    else {
        scrollPos.style.setProperty('--transform', '90deg')
        landingPage.style.opacity = '1';
        homePage.style.opacity = '0.9';

        // Remove all stars
        removeStars();
    }
})

// To transfrom project images
// Getting amount of projects
const projects = document.querySelectorAll('.project');
const img = document.querySelector('.img');
// To get dynamic ending index for each different project
const imgs = document.querySelectorAll('.project__image-container');

for (let i = 0; i < projects.length; i++) {
    let imageIndex = 0;

    setInterval(run, 4000);

    function run() {
        imageIndex++;
        changeImage();
    }

    // function to call if change image manually by clicking
    function changeImage() {
        if (imageIndex > imgs[i].children.length - 1) {
            imageIndex = 0
        } else if (imageIndex < 0) {
            imageIndex = imgs[i].children.length - 1
        }

        imgs[i].style.transform = `translateX(${-imageIndex * (window.innerWidth > 1024 ? 600 : img.offsetWidth)}px)`
    }
}