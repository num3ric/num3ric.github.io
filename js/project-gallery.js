/* Native scroll galleries with optional previous/next controls. */
document.querySelectorAll('.gallery-controls').forEach(function (controls) {
    var gallery = controls.previousElementSibling;
    var slides = Array.from(gallery.querySelectorAll('figure'));
    var previous = controls.querySelector('[data-gallery-prev]');
    var next = controls.querySelector('[data-gallery-next]');
    if (slides.length < 2) return;

    function index() {
        var closest = 0;
        slides.forEach(function (slide, i) {
            if (Math.abs(slide.offsetLeft - slides[0].offsetLeft - gallery.scrollLeft) <
                Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - gallery.scrollLeft)) closest = i;
        });
        return closest;
    }
    function update() {
        var current = index();
        previous.disabled = current === 0;
        next.disabled = current === slides.length - 1;
    }
    function move(direction) {
        var target = Math.max(0, Math.min(slides.length - 1, index() + direction));
        gallery.scrollTo({left: slides[target].offsetLeft - slides[0].offsetLeft, behavior: 'instant'});
        update();
    }
    previous.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    gallery.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    controls.hidden = false;
    update();
});
