const landingPage = document.getElementById('landing');
const homePage = document.getElementById('home');
const scrollPos = document.querySelector(':root');

// To animate the text

// Setting the page height to the height of the landing page and home page combined
// so that the page is scrollable
document.body.style.height = `${homePage.scrollHeight + landingPage.scrollHeight}px`

// === 3D TRANSFORM ===
window.addEventListener('scroll', () => {
    // If bottom of landing page is still not at the top of the page, send transform degrees to css
    if (landingPage.getBoundingClientRect().bottom > 0) {
        scrollPos.style.setProperty('--transform', `${parseFloat(90 - landingPage.getBoundingClientRect().bottom / window.innerHeight * 90)}deg`)
        landingPage.style.opacity = `${landingPage.getBoundingClientRect().bottom / window.innerHeight}`
        homePage.style.opacity = `${1 - landingPage.getBoundingClientRect().bottom / window.innerHeight}`
    }
    // if bottom of landing page is higher than top of screen, set degrees to 90 incase it couldnt update quick enough
    else {
        scrollPos.style.setProperty('--transform', '90deg')
        landingPage.style.opacity = '1';
        homePage.style.opacity = '1';
    }
})

// === STARS ===
const colors = ['#97e1ff', '#ffae80', '#6171ff'];
const shadows = ['#c0edff', '#ffd4bb', '#c0c1ff'];
// Array for collecting stars so that we can check and remove them
// Since we dont have access to them becuase of the setInterval
const stars = [];

const makeStars = (isInitial = false, i = 0) => {
    // Generate random top position, select correct colors and randomize size
    const randSelectedColor = Math.floor(Math.random() * colors.length);
    const randVerticalPos = Math.random() * landingPage.offsetHeight + landingPage.offsetTop;
    const randSize = Math.floor(Math.random() * (7 - 1) + 1)

    let horizontalPos;
    if (isInitial === true) {
        horizontalPos = Math.random() * landingPage.offsetWidth + landingPage.offsetLeft;
    } else {
        horizontalPos = landingPage.offsetLeft + landingPage.offsetWidth;
    }

    const star = document.createElement('span');
    star.style.width = `${randSize}px`;
    star.style.height = `${randSize}px`;
    star.style.backgroundColor = `${colors[randSelectedColor]}`;
    star.style.boxShadow = `0 0 10px ${shadows[randSelectedColor]}`;
    star.style.top = `${randVerticalPos}px`;
    star.style.left = `${horizontalPos}px`;
    star.classList.add('star')
    // Give initial stars different ID so that they dont clash with generated stars when removing
    star.id = isInitial ? `${i}` : `${i / 100}`
    landingPage.append(star)

    const specificStar = document.getElementById(isInitial ? `${i}` : `${i / 100}`);
    stars.push(specificStar);

    // Put corresponding animation duration/speed depending on size
    switch (randSize) {
        case 1:
            specificStar.style.animationDuration = '90s';
            break;
        case 2:
            specificStar.style.animationDuration = '70s';
            break;
        case 3:
            specificStar.style.animationDuration = '50s';
            break;
        case 4:
            specificStar.style.animationDuration = '40s';
            break;
        case 5:
            specificStar.style.animationDuration = '30s';
            break;
        case 6:
            specificStar.style.animationDuration = '20s';
            break;
    }
}

// Making 180 initial stars
for (let i = 0; i < 90; i++) {
    makeStars(true, i);
}

// Making one star every 250ms
// Averages out to around 180 stars on screen at one time
// The purpose of variable "i" is just to give stars id's
let i = 0;
setInterval(function () {
    i++;
    makeStars(false, i);
}, 500);

// Periodically check when star is out of bounds of landingPage, then remove from DOM and array
setInterval((function () {
    for (let specificStar of stars) {
        if (specificStar.getBoundingClientRect().left <= landingPage.offsetLeft - 6) {
            specificStar.remove();
            const starIndex = stars.indexOf(specificStar);
            stars.splice(starIndex, 1);
        }
    }
    // console.log(`STARS ARRAY: ${stars.length}`);
    // console.log(`STARS BROWSER: ${document.querySelectorAll('.star').length}`);
}), 50)

