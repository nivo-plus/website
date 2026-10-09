(function () {
    const featured = document.getElementById('recoFeatured');
    if (!featured) return;

    const quoteEl = featured.querySelector('.reco__quote');
    const avatarEl = featured.querySelector('.reco__avatar');
    const nameEl = featured.querySelector('.reco__name');
    const roleEl = featured.querySelector('.reco__role');
    const placeEl = featured.querySelector('.reco__place');
    const dots = featured.querySelectorAll('.reco__dot');
    const cards = document.querySelectorAll('.reco__card');
    // First group holds the source cards; the second is a visual duplicate for the loop
    const sources = document.querySelectorAll('.reco__group:first-child .reco__card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ROTATE_MS = 8000;

    let current = 0;
    let timer = null;

    function show(index) {
        if (index === current) return;
        current = index;
        const source = sources[index];

        featured.classList.add('is-fading');
        setTimeout(() => {
            quoteEl.innerHTML = source.querySelector('.reco__card-quote').innerHTML;
            avatarEl.textContent = source.querySelector('.reco__avatar').textContent;
            nameEl.textContent = source.querySelector('.reco__name').textContent;
            roleEl.textContent = source.querySelector('.reco__role').textContent;
            placeEl.textContent = source.querySelector('.reco__place').textContent;
            featured.classList.remove('is-fading');
        }, reduceMotion ? 0 : 350);

        dots.forEach(dot => dot.classList.toggle('is-active', Number(dot.dataset.index) === index));
        cards.forEach(card => card.classList.toggle('is-active', Number(card.dataset.index) === index));
    }

    function start() {
        if (reduceMotion) return;
        stop();
        timer = setInterval(() => show((current + 1) % sources.length), ROTATE_MS);
    }

    function stop() {
        clearInterval(timer);
    }

    [...dots, ...cards].forEach(el => {
        el.addEventListener('click', () => {
            show(Number(el.dataset.index));
            start();
        });
    });

    featured.addEventListener('mouseenter', stop);
    featured.addEventListener('mouseleave', start);

    start();
})();
