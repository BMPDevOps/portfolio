// Keep section navigation useful without hiding any content behind JavaScript.
const sectionLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

function updateCurrentSection() {
    const threshold = window.innerHeight * 0.32;
    let current = sections[0];
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) current = section;
    }
    for (const link of sectionLinks) {
        if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }
}
let scheduled = false;
window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
        updateCurrentSection();
        scheduled = false;
    });
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();

// Printed copies include every project; restore the reader's choices afterward.
let projectStates = [];
window.addEventListener('beforeprint', () => {
    projectStates = [...document.querySelectorAll('details.project')].map(project => [project, project.open]);
    for (const [project] of projectStates) project.open = true;
});
window.addEventListener('afterprint', () => {
    for (const [project, open] of projectStates) project.open = open;
    projectStates = [];
});
