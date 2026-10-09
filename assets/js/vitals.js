// Vitals chart shared by the hero monitor (live) and the scroll story (scrubbed)
window.NivoVitals = (function () {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Plot geometry (viewBox 600 x 280)
    const LEFT = 40, RIGHT = 588, TOP = 12, BOTTOM = 240;
    const Y_MIN = 0, Y_MAX = 180, Y_STEP = 30;
    const WINDOW = 24;              // 2 hours at one record every 5 minutes
    const STEP_X = (RIGHT - LEFT) / (WINDOW - 1);
    const START_MINUTES = 12 * 60;  // 12:00

    const y = value => BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    function timeLabel(minutes) {
        const h = Math.floor(minutes / 60) % 24;
        const m = minutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // Small deterministic PRNG so a seeded series is identical on every scroll pass
    function random(seed) {
        let t = seed;
        return () => {
            t = (t + 0x6D2B79F5) | 0;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }

    // Record generator: one point every 5 minutes, values drifting around a stable anesthesia
    function generator(seed) {
        const rand = seed === undefined ? Math.random : random(seed);
        const drift = (value, target, spread) => value + (rand() * 2 - 1) * spread + (target - value) * 0.25;
        let state = { pas: 128, pad: 72, fc: 68 };
        let index = 0;

        return function next() {
            state = {
                pas: clamp(drift(state.pas, 126, 7), 104, 152),
                pad: clamp(drift(state.pad, 71, 4), 56, 86),
                fc: clamp(drift(state.fc, 68, 3), 56, 88),
            };
            const pas = Math.round(state.pas);
            const pad = Math.round(state.pad);
            const point = {
                minutes: START_MINUTES + index * 5,
                pas,
                pad,
                pam: Math.round((pas + 2 * pad) / 3),
                fc: Math.round(state.fc),
            };
            index += 1;
            return point;
        };
    }

    const shapes = {
        pas: (x, cy) => `<polygon class="vitals__pt vitals__pt--pas" points="${x},${cy - 5} ${x - 5},${cy + 4} ${x + 5},${cy + 4}"/>`,
        pad: (x, cy) => `<polygon class="vitals__pt vitals__pt--pad" points="${x},${cy - 5} ${x + 5},${cy} ${x},${cy + 5} ${x - 5},${cy}"/>`,
        pam: (x, cy) => `<path class="vitals__pt vitals__pt--pam" d="M${x} ${cy - 5}V${cy + 5}M${x - 4.3} ${cy - 2.5}L${x + 4.3} ${cy + 2.5}M${x - 4.3} ${cy + 2.5}L${x + 4.3} ${cy - 2.5}"/>`,
        fc: (x, cy) => `<circle class="vitals__pt vitals__pt--fc" cx="${x}" cy="${cy}" r="4.5"/>`,
    };

    function createChart(svg) {
        const grid = document.createElementNS(SVG_NS, 'g');
        grid.setAttribute('class', 'vitals__grid');
        let gridMarkup = '';
        for (let v = Y_MIN; v <= Y_MAX; v += Y_STEP) {
            gridMarkup += `<line x1="${LEFT}" x2="${RIGHT}" y1="${y(v)}" y2="${y(v)}"/>`;
            gridMarkup += `<text x="${LEFT - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
        }
        grid.innerHTML = gridMarkup;
        svg.appendChild(grid);

        const data = document.createElementNS(SVG_NS, 'g');
        svg.appendChild(data);

        return function render(points, { animateLast = false } = {}) {
            const visible = points.slice(-WINDOW);
            const last = visible.length - 1;
            let markup = '';

            visible.forEach((point, i) => {
                const x = LEFT + i * STEP_X;
                markup += `<g${i === last && animateLast ? ' class="is-new"' : ''}>`;
                markup += shapes.pas(x, y(point.pas));
                markup += shapes.pad(x, y(point.pad));
                markup += shapes.pam(x, y(point.pam));
                markup += shapes.fc(x, y(point.fc));
                markup += '</g>';

                if (point.minutes % 15 === 0) {
                    markup += `<text class="vitals__time" x="${x}" y="${BOTTOM + 24}" text-anchor="middle">${timeLabel(point.minutes)}</text>`;
                }
            });

            if (last >= 0) {
                const nowX = LEFT + last * STEP_X;
                markup += `<line class="vitals__now" x1="${nowX}" x2="${nowX}" y1="${TOP}" y2="${BOTTOM}"/>`;
            }
            data.innerHTML = markup;
        };
    }

    return { createChart, generator, timeLabel, WINDOW };
})();
