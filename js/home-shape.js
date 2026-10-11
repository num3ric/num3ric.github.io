// Small characters beside the homepage name, read left to right as red,
// green, and blue. Each <path> is a layer that rests as a circle, triangle,
// or square, then crouches, hops, spins clockwise, and lands as the next
// shape, taking its color from its position. Layers hop with a short stagger.
// Overlaps add like light and are all cut to the same depth. Hovering or
// tapping asks for a hop. Reduced-motion users get instant shape changes.
(function () {
    var svg = document.querySelector('[data-home-shape]');
    if (!svg) return;
    var POINTS = 96;
    var SIZE = 11.2; // Every shape is the name's cap height and sits on the ground.
    var PIVOT_Y = -SIZE / 2; // Rotate around a shape's middle; scale from the ground.

    // Every outline is sampled clockwise from its top-center point, with the
    // ground at y = 0, so morphs interpolate matching points.
    function polygon(vertices) {
        var closed = vertices.concat([vertices[0]]);
        var lengths = [0];
        for (var i = 1; i < closed.length; i++) {
            var dx = closed[i][0] - closed[i - 1][0];
            var dy = closed[i][1] - closed[i - 1][1];
            lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
        }
        var total = lengths[lengths.length - 1];
        var points = [];
        var edge = 1;
        for (var p = 0; p < POINTS; p++) {
            var distance = total * p / POINTS;
            while (lengths[edge] < distance) edge++;
            var t = (distance - lengths[edge - 1]) / (lengths[edge] - lengths[edge - 1]);
            var a = closed[edge - 1];
            var b = closed[edge];
            points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
        return points;
    }

    function circle(radius) {
        var points = [];
        for (var p = 0; p < POINTS; p++) {
            var angle = -Math.PI / 2 + 2 * Math.PI * p / POINTS;
            points.push([radius * Math.cos(angle), -radius + radius * Math.sin(angle)]);
        }
        return points;
    }

    var CIRCLE = 0, TRIANGLE = 1, SQUARE = 2;
    var r = SIZE / 2;
    var side = SIZE * 2 / Math.sqrt(3); // Equilateral triangle, SIZE tall.
    var shapes = [
        circle(r),
        polygon([[0, -SIZE], [side / 2, 0], [-side / 2, 0]]),
        polygon([[0, -SIZE], [r, -SIZE], [r, 0], [-r, 0], [-r, -SIZE]])
    ];
    var halfWidth = [r, side / 2, r];

    // Distance between neighbouring centers so that each straight edge cuts
    // the same depth, 0.3 of SIZE, into its neighbour, measured at right
    // angles to the edge. Both circle overlaps are the same segment, one
    // upright and one tilted 30 degrees. Shapes cycle in step, so only these
    // left-to-right pairs occur: square | circle, circle | triangle, and
    // triangle | square, where the square cuts the triangle's base corner.
    var DEPTH = SIZE * 0.3;
    function spacing(left, right) {
        if (left === CIRCLE && right === TRIANGLE) return side / 4 + (r - DEPTH) / Math.sin(Math.PI / 3);
        return halfWidth[left] + halfWidth[right] - DEPTH;
    }

    // Center positions for an arrangement, with its left edge at x = 0.
    function layout(order) {
        var xs = [halfWidth[order[0]]];
        for (var i = 1; i < order.length; i++) xs.push(xs[i - 1] + spacing(order[i - 1], order[i]));
        return xs;
    }

    var paths = Array.prototype.slice.call(svg.querySelectorAll('path'));
    var layers = paths.map(function (path, i) {
        return { path: path, current: i % shapes.length, hop: null, x: 0, toX: 0 };
    });
    function arrange(key) { return layout(layers.map(key)); }
    arrange(function (layer) { return layer.current; }).forEach(function (x, i) { layers[i].x = x; });

    function render(layer, from, to, progress, y, sx, sy, angle) {
        var d = '';
        for (var p = 0; p < POINTS; p++) {
            var x = shapes[from][p][0] + (shapes[to][p][0] - shapes[from][p][0]) * progress;
            var py = shapes[from][p][1] + (shapes[to][p][1] - shapes[from][p][1]) * progress;
            d += (p ? 'L' : 'M') + x.toFixed(2) + ' ' + py.toFixed(2);
        }
        var cx = layer.x + ((layer.hop ? layer.toX : layer.x) - layer.x) * progress;
        layer.path.setAttribute('d', d + 'Z');
        layer.path.setAttribute('transform',
            'translate(' + cx.toFixed(2) + ' ' + y.toFixed(2) + ') scale(' + sx.toFixed(3) + ' ' + sy.toFixed(3) + ') rotate(' + angle.toFixed(1) + ' 0 ' + PIVOT_Y.toFixed(1) + ')');
    }

    function rest(layer) { render(layer, layer.current, layer.current, 0, 0, 1, 1, 0); }

    function clamp01(t) { return Math.max(0, Math.min(1, t)); }
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 2); }
    function random(min, max) { return min + Math.random() * (max - min); }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Reduced motion: no animation, but the shapes still change when asked.
    function nextStill() {
        layers.forEach(function (layer) { layer.current = (layer.current + 1) % shapes.length; });
        arrange(function (layer) { return layer.current; }).forEach(function (x, i) { layers[i].x = x; });
        layers.forEach(rest);
    }

    // Timings in milliseconds.
    var CROUCH = 170;
    var FLIGHT = 540;
    var LAND = 720;
    var STAGGER = 90;
    var restUntil = 0;
    var visible = true;
    var frame = 0;

    function hopping() {
        return layers.some(function (layer) { return layer.hop; });
    }

    function planHops(now) {
        // Mostly morph to the next shape; now and then just a playful hop.
        var morph = Math.random() > 0.15;
        var spin = morph ? 360 : 0; // Positive SVG rotation is clockwise.
        var height = morph ? random(12, 17) : random(5, 8);
        layers.forEach(function (layer, i) {
            layer.hop = {
                start: now + i * STAGGER,
                to: morph ? (layer.current + 1) % shapes.length : layer.current,
                height: height * random(0.85, 1.15),
                spin: spin
            };
        });
        arrange(function (layer) { return layer.hop.to; }).forEach(function (x, i) { layers[i].toX = x; });
    }

    function animate(layer, now) {
        var hop = layer.hop;
        var t = now - hop.start;
        var from = layer.current;
        if (t < 0) {
            rest(layer);
        } else if (t < CROUCH) {
            // Anticipation: squash down before the jump.
            var c = easeOut(t / CROUCH);
            render(layer, from, from, 0, 0, 1 + 0.16 * c, 1 - 0.2 * c, 0);
        } else if (t < CROUCH + FLIGHT) {
            var f = (t - CROUCH) / FLIGHT;
            var stretch = 0.14 * Math.max(0, 1 - f * 2.5);
            render(layer, from, hop.to, easeInOut(clamp01(f * 1.15 - 0.05)), -hop.height * 4 * f * (1 - f),
                1 - stretch * 0.6, 1 + stretch, hop.spin * easeInOut(f));
        } else if (t < CROUCH + FLIGHT + LAND) {
            // Landing: a damped squash-and-stretch wobble.
            var l = t - CROUCH - FLIGHT;
            var wobble = 0.24 * Math.exp(-l / 140) * Math.cos(l * 2 * Math.PI / 260);
            render(layer, hop.to, hop.to, 1, 0, 1 + wobble * 0.7, 1 - wobble, 0);
        } else {
            layer.current = hop.to;
            layer.x = layer.toX;
            layer.hop = null;
            rest(layer);
        }
    }

    function tick(now) {
        frame = 0;
        if (!hopping() && now >= restUntil) planHops(now);
        var wasHopping = hopping();
        layers.forEach(function (layer, i) {
            if (layer.hop) {
                animate(layer, now);
            } else {
                // Resting: breathe slowly, a little out of step with each other.
                var breath = 0.025 * Math.sin((now / 1600 + i / 3) * 2 * Math.PI);
                render(layer, layer.current, layer.current, 0, 0, 1 - breath * 0.5, 1 + breath, 0);
            }
        });
        if (wasHopping && !hopping()) restUntil = now + random(1800, 3400);
        schedule();
    }

    function schedule() {
        if (frame || !visible || reduceMotion.matches) return;
        frame = requestAnimationFrame(tick);
    }

    function poke() {
        if (reduceMotion.matches) nextStill();
        else if (!hopping()) restUntil = 0;
    }
    svg.addEventListener('pointerenter', poke);
    svg.addEventListener('pointerdown', poke);

    reduceMotion.addEventListener('change', function () {
        layers.forEach(function (layer) {
            layer.hop = null;
            rest(layer);
        });
        schedule();
    });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            schedule();
        }).observe(svg);
    }

    restUntil = performance.now() + 1200;
    layers.forEach(rest);
    schedule();
})();
