(function () {
    const blocks = document.querySelectorAll('[data-words]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    blocks.forEach(block => {
        // Wrap every word in a span, keeping <br> line breaks intact
        const fragment = document.createDocumentFragment();
        block.childNodes.forEach(node => {
            if (node.nodeType !== Node.TEXT_NODE) {
                fragment.appendChild(node.cloneNode(true));
                return;
            }
            node.textContent.split(/(\s+)/).forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    fragment.appendChild(document.createTextNode(part));
                    return;
                }
                const word = document.createElement('span');
                word.className = 'tagline__word';
                word.textContent = part;
                fragment.appendChild(word);
            });
        });
        block.replaceChildren(fragment);
    });

    const words = document.querySelectorAll('.tagline__word');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        words.forEach(word => word.classList.add('is-on'));
        return;
    }

    // Trigger line sits at 60% of the viewport; words crossing it together light up in reading order
    const observer = new IntersectionObserver((entries) => {
        entries
            .filter(entry => entry.isIntersecting)
            .forEach((entry, index) => {
                entry.target.style.transitionDelay = `${index * 80}ms`;
                entry.target.classList.add('is-on');
                observer.unobserve(entry.target);
            });
    }, { rootMargin: '0px 0px -40% 0px', threshold: 1 });

    words.forEach(word => observer.observe(word));
})();
