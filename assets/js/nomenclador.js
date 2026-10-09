// Practice search demo: mirrors the medical-nomenclator search (substring on code or description,
// separators ignored in codes, sorted by code, minimum 3 characters)
(function () {
    const root = document.querySelector('[data-nomen]');
    const sample = window.NIVO_NOMENCLADOR_SAMPLE;
    if (!root || !sample) return;

    const input = root.querySelector('[data-nomen-input]');
    const results = root.querySelector('[data-nomen-results]');
    const rows = root.querySelector('[data-nomen-rows]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN_CHARS = 3;
    const MAX_RESULTS = 6;
    const MAX_ROWS = 4;

    const selected = [];
    let activeIndex = -1;
    let current = [];
    let userTookOver = false;

    const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function search(query) {
        const clean = query.trim().replace(/[.\-\s]/g, '');
        if (clean.length < MIN_CHARS) return [];
        // Allow optional separators between characters, like the service does
        const pattern = new RegExp(clean.split('').map(escapeRegex).join('[.\\-\\s]*'), 'i');
        return sample
            .filter(p => pattern.test(p.code) || pattern.test(p.description))
            .sort((a, b) => a.code.localeCompare(b.code))
            .slice(0, MAX_RESULTS);
    }

    function label(practice) {
        return `${practice.code} - ${practice.description} (C${practice.complexity})`;
    }

    function renderResults() {
        current = search(input.value);
        activeIndex = current.length ? 0 : -1;
        results.innerHTML = '';

        if (input.value.trim().length >= MIN_CHARS && !current.length) {
            results.innerHTML = '<li class="nomen__none">Sin resultados en la muestra</li>';
        }

        current.forEach((practice, i) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.id = `nomen-opt-${i}`;
            li.className = 'nomen__option' + (i === activeIndex ? ' is-active' : '');
            li.textContent = label(practice);
            li.addEventListener('mousedown', e => {
                e.preventDefault();
                choose(practice);
            });
            results.appendChild(li);
        });

        const open = results.children.length > 0;
        results.classList.toggle('is-open', open);
        input.setAttribute('aria-expanded', String(open));
        input.setAttribute('aria-activedescendant', activeIndex >= 0 ? `nomen-opt-${activeIndex}` : '');
    }

    function renderRows() {
        rows.innerHTML = '';
        if (!selected.length) {
            rows.innerHTML = '<tr class="nomen__empty"><td colspan="5">No hay prácticas nomencladas</td></tr>';
            return;
        }
        selected.forEach((practice, i) => {
            const tr = document.createElement('tr');
            tr.className = 'nomen__row';
            tr.innerHTML = `<td class="nomen__code">${practice.code}</td><td></td><td>C${practice.complexity}</td><td>100</td>`;
            tr.children[1].textContent = practice.description;
            const td = document.createElement('td');
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'nomen__remove';
            remove.setAttribute('aria-label', 'Eliminar');
            remove.innerHTML = '<i class="ph ph-trash" aria-hidden="true"></i>';
            remove.addEventListener('click', () => {
                selected.splice(i, 1);
                renderRows();
            });
            td.appendChild(remove);
            tr.appendChild(td);
            rows.appendChild(tr);
        });
    }

    function choose(practice) {
        if (!selected.some(p => p.code === practice.code)) {
            selected.unshift(practice);
            if (selected.length > MAX_ROWS) selected.pop();
        }
        input.value = '';
        renderResults();
        renderRows();
    }

    function setActive(index) {
        const options = results.querySelectorAll('.nomen__option');
        if (!options.length) return;
        activeIndex = (index + options.length) % options.length;
        options.forEach((opt, i) => opt.classList.toggle('is-active', i === activeIndex));
        input.setAttribute('aria-activedescendant', `nomen-opt-${activeIndex}`);
    }

    // --- Real interaction ---------------------------------------------------------
    function takeOver() {
        if (userTookOver) return;
        userTookOver = true;
        stopDemo();
        input.value = '';
        renderResults();
    }

    input.addEventListener('focus', takeOver);
    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
        if (e.key === 'Enter' && current[activeIndex]) { e.preventDefault(); choose(current[activeIndex]); }
        if (e.key === 'Escape') { input.value = ''; renderResults(); }
    });
    input.addEventListener('blur', () => {
        results.classList.remove('is-open');
        input.setAttribute('aria-expanded', 'false');
    });

    // --- Self-running demo until the visitor takes over -----------------------------
    const script = [
        { query: 'colecist', pick: '01.04.08' },
        { query: '010703', pick: '01.07.03' },
        { query: 'catarata', pick: '10.11.19' },
    ];
    let timers = [];
    let running = false;

    const wait = ms => new Promise(resolve => timers.push(setTimeout(resolve, ms)));

    async function runDemo() {
        if (running || userTookOver || reduceMotion) return;
        running = true;
        input.value = '';
        selected.length = 0;
        renderRows();

        for (const step of script) {
            for (const char of step.query) {
                if (!running) return;
                input.value += char;
                renderResults();
                await wait(110);
            }
            await wait(900);
            if (!running) return;
            const option = [...results.querySelectorAll('.nomen__option')]
                .findIndex(opt => opt.textContent.startsWith(step.pick));
            if (option >= 0) setActive(option);
            await wait(500);
            if (!running) return;
            choose(sample.find(p => p.code === step.pick));
            await wait(1100);
        }

        await wait(3000);
        running = false;
        if (!userTookOver) runDemo();
    }

    function stopDemo() {
        running = false;
        timers.forEach(clearTimeout);
        timers = [];
    }

    if (reduceMotion) {
        [...script].reverse().forEach(step => choose(sample.find(p => p.code === step.pick)));
        return;
    }

    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !document.hidden) runDemo();
        else stopDemo();
    }, { threshold: 0.4 }).observe(root);
})();
