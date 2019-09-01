var contentFrame = document.getElementById('content-frame');
var navElements = document.getElementsByClassName('nav-target');

var changeVisual = () => {
    var hash = window.location.hash.toLowerCase().substring(1);
    if (hash) {
        // contentFrame.src = '';
        contentFrame.src = './' + hash + '.html';
        for (var i=0; i < navElements.length; i++) {
            navElements[i].classList.remove('selected');
        }
        document.querySelector('[data-nav-target="' + hash + '"').classList.add('selected');
    } else {
        window.location.hash = '#' + hash;
    }
};

changeVisual();

window.addEventListener('hashchange', changeVisual, false);

for (var i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', (event) => {
        var targetHash = event.target.getAttribute('data-nav-target');
        window.location.hash = '#' + targetHash;
    });
}
