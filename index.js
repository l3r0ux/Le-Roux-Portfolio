const landingPage = document.getElementById('landing');
const homePage = document.getElementById('home');
const scrollPos = document.querySelector(':root');
// To animate home text svgs
const homeText = document.querySelectorAll('#svg-text path');

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
    console.log(isInit);
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
}), 1000)

// Making initial stars on page load
makeStars(80);
// Remove hidden class when SVG animation is finished
setTimeout(() => {
    // remove hidden class from stars when SVG animation has finished
    document.querySelectorAll('.star').forEach((star) => {
        star.classList.remove('hidden');
    });
}, 2000)

applyStarCount.addEventListener('click', () => {
    // Remove all stars
    removeStars();

    // Make new amount of stars
    makeStars(starCountInput.value, false);
})

// Web animations API to animate each letter in javascript
for (let i = 0; i < homeText.length; i++) {
    // The stroke-dasharray and the stroke-offset must start with the full length of the path

    // Set each letters corresponding dasharray and offset values
    // Setting stroke-dasharray to full length of path, then ofsetting it by that length aswell to make it dissapear
    let specificLetter = homeText[i];
    specificLetter.style.strokeWidth = '2px';
    specificLetter.style.strokeDasharray = specificLetter.getTotalLength();
    specificLetter.style.strokeDashoffset = specificLetter.getTotalLength();

    // Make keyframes and options for each letter(path)
    const keyframes = [
        { strokeDashoffset: 0 },
    ];

    const options = {
        duration: 2000,
        easing: 'ease',
        fill: 'forwards',
    }

    // Animate SVG paths
    homeText[i].animate(keyframes, options);
}
// Add visible class to image after 2 seconds
// const landingImage = document.getElementById('landing-image');
// setTimeout(() => {
//     landingImage.classList.add('visible');
// }, 2000)

// Click listener for scrolling to landing page from main page
document.getElementById('continue-to-portfolio').addEventListener('click' , () => {
    window.scrollBy(0, window.innerHeight);
})

// Setting the page height to the height of the landing page and home page combined
// so that the page is scrollable
document.body.style.height = `${homePage.scrollHeight + landingPage.scrollHeight}px`;

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