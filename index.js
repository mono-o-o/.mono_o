const modal = document.getElementById('msgModal');
const btn = document.getElementById('dropMsg');
const span = document.getElementsByClassName('close-btn')[0];
const form = document.getElementById('msgForm');
const statusMsg = document.getElementById('statusMsg');

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const message = form.elements['message'].value.trim();

    if (!message) {
        statusMsg.innerText = 'type smth, silly';
        return false;
    }

    statusMsg.innerHTML = 'msg otw...';

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyDAJciYfpWxJxSYubJRfeECi778mYXxRYqYhRlepaUghpc5saKnxvLb9hiQ23MVrTK/exec';
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            statusMsg.innerText = "msg sent !";
            form.reset();
            setTimeout(() => {
                modal.style.display = "none";
                statusMsg.innerText = "";
            }, 2000);
        })
        .catch(error => {
            statusMsg.innerText = "msg unsuccessful :(";
            console.error('errro', error.message);
        });
});

const wrapper = document.querySelector('.decor-grid-wrapper');
document.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wrapper.style.setProperty('--x', `${x}px`);
    wrapper.style.setProperty('--y', `${y}px`);
});

function copyDiscord(btn, text) {
    navigator.clipboard.writeText(text);
    const tooltip = btn.querySelector('.copied-text');
    tooltip.classList.add('show');
    setTimeout(() => {tooltip.classList.remove('show');}, 1500);
}

const rigLink = document.getElementById('rigLink');
const navSection = document.getElementById('navSection');

function toggleRigDetails() {
    navSection.classList.toggle('rig-active');
    document.body.style.overflow = navSection.classList.contains('rig-active') ? 'hidden' : '';
}

rigLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleRigDetails();
});

const wasdLink = document.getElementById('wasdLink');
const archiveList = document.getElementById('archiveList');
const playingList = document.getElementById('playingList');

async function loadGameData() {
    try {
        const response = await fetch('wasdlist.json');
        const games = await response.json();

        archiveList.innerHTML = '';
        playingList.innerHTML = '';

        games.sort((a,b) => a.Title.localeCompare(b.Title))
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = game.Title;
            if (game.Category === 'archive') {archiveList.appendChild(li);}
            else if (game.Category === 'playing') {li.textContent = '> ' + game.Title; playingList.appendChild(li);}
        });
    } catch (error) {
        console.error('failed to fetch game list: ', error);
        archiveList.innerHTML = '<li>error fetching list</li>';
    }
}

function toggleWasdDetails() {
    navSection.classList.toggle('wasd-active');
    document.querySelectorAll('.wasd-details .scroll-container').forEach(el => el.scrollTop = 0);
    document.body.style.overflow = navSection.classList.contains('wasd-active') ? 'hidden' : '';
}

if (wasdLink) {
    wasdLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (archiveList.children.length === 0) {loadGameData();}
        toggleWasdDetails();
    })
}

const progLink = document.getElementById('progLink');
const progGrid = document.getElementById('progGrid');

const categories = {
    'media': 'MULTIMEDIA',
    'dev': 'DEVELOPMENT',
    'soc': 'SOCIAL',
    'pers': 'PERSONALISATION',
    'util': 'UTILITIES'
};

const catOrder = ['media', 'dev', 'util', 'pers', 'soc'];

async function loadProgData() {
    try {
        const response = await fetch('programs.json');
        const programs = await response.json();

        progGrid.innerHTML = '';

        const grouped = programs.reduce((acc, item) => {
            const cat = item.progCategory || 'util';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item.prog);
            return acc;
            }, {});

        catOrder.forEach(key => {
            if (grouped[key]) {
                grouped[key].sort((a,b) => a.localeCompare(b));
                const catDiv = document.createElement('div');
                catDiv.className = 'prog-category';
                const h3 = document.createElement('h3');
                h3.className = 'f-bold';
                h3.textContent = categories[key] || key.toUpperCase();

                const ul = document.createElement('ul');
                grouped[key].forEach(progName => {
                    const li = document.createElement('li');
                    li.textContent = `${progName}`;
                    ul.appendChild(li);
                });

                catDiv.appendChild(h3);
                catDiv.appendChild(ul);
                progGrid.appendChild(catDiv);
            }
        });
    } catch (error) {
        console.error('failed to fetch prog list: ', error);
        progGrid.innerHTML = '<li>error fetching list</li>';
    }
}

function toggleProgDetails() {
    navSection.classList.toggle('prog-active');
    document.querySelector('.prog-grid').scrollTop = 0;
    document.body.style.overflow = navSection.classList.contains('prog-active') ? 'hidden' : '';
}

if (progLink) {
    progLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (progGrid.children.length === 0) {loadProgData();}
        toggleProgDetails();
    });
}