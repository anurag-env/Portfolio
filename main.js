// =============================================================
// Nav scroll-down chevron + landing fade-out as user scrolls
// =============================================================
$(document).ready(function () {
	$("#landing-chevron-btn").click(function () {
		$("html,body").animate({ scrollTop: $("#details-container").offset().top }, "slow");
	});
});

$(window).scroll(function () {
	var opac1 = ($("#heading-name").offset().top - $(window).scrollTop() + 50) / ($("#heading-name").offset().top + 50);
	if (opac1 < 0) opac1 = 0;
	$("#heading-name").css("opacity", opac1);
	$("#heading-title").css("opacity", opac1);
	$("#landing-footer").css("opacity", opac1);
});

// =============================================================
// Landing background — two-layer cross-fade rotator
//
//   How it works:
//   - Two stacked <div class="landing-bg"> layers, A and B.
//   - One is visible (opacity 1), the other is hidden (opacity 0).
//   - To rotate: set the next image on the hidden layer, then swap
//     opacities. CSS handles the cross-fade.
//   - Auto-rotates every ROTATE_MS; tweak the constant below.
//   - Pauses when the landing area is offscreen (battery + perf).
//   - When the landing comes back into view after being out, it
//     advances by one (so a different photo greets you each time
//     you scroll back up).
// =============================================================
(function () {
	var images = window.__landingImages;
	var startIdx = typeof window.__landingInitialIdx === "number" ? window.__landingInitialIdx : 0;
	if (!images || images.length === 0) return;

	var ROTATE_MS = 3000;  // ⚙ tweak: time between swaps (each image is shown for this long)
	var FADE_MS   = 1500;  // ⚙ tweak: cross-fade duration (must match CSS transition)

	var layerA = document.getElementById("landing-bg-a");
	var layerB = document.getElementById("landing-bg-b");
	var landing = document.getElementById("landing-container");
	if (!layerA || !layerB || !landing) return;

	// Layer A is initially visible (the inline <head> script set its background).
	// Track which layer is currently the "front".
	var front = layerA;
	var back  = layerB;
	var currentIdx = startIdx;
	var timer = null;
	var isVisible = true;  // landing area visibility

	function applyToLayer(layer, idx) {
		var img = images[idx];
		layer.style.backgroundImage = 'url("' + img.src + '")';
		layer.style.backgroundPosition = img.pos || "center center";
	}

	function next() {
		var nextIdx = (currentIdx + 1) % images.length;
		applyToLayer(back, nextIdx);
		// Force a frame before the opacity swap so the new image paints
		requestAnimationFrame(function () {
			back.style.opacity  = "1";
			front.style.opacity = "0";
			// Swap roles
			var tmp = front; front = back; back = tmp;
			currentIdx = nextIdx;
		});
	}

	function startTimer() {
		stopTimer();
		timer = setInterval(next, ROTATE_MS);
	}
	function stopTimer() {
		if (timer) { clearInterval(timer); timer = null; }
	}

	// Lazy-load the OTHER images after first paint, in idle time
	function lazyLoadRest() {
		images.forEach(function (entry, i) {
			if (i === startIdx) return; // already loading via inline preload
			var img = new Image();
			img.src = entry.src;
		});
	}
	if ("requestIdleCallback" in window) {
		requestIdleCallback(lazyLoadRest, { timeout: 2000 });
	} else {
		setTimeout(lazyLoadRest, 1500);
	}

	// Visibility tracking: pause when offscreen, advance one + resume when back
	if ("IntersectionObserver" in window) {
		var wasOut = false;
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						if (wasOut) {
							next();      // advance once on scroll-back
							wasOut = false;
						}
						isVisible = true;
						startTimer();
					} else {
						isVisible = false;
						wasOut = true;
						stopTimer();
					}
				});
			},
			{ threshold: 0.3 }
		);
		io.observe(landing);
	} else {
		// Fallback: just start the timer
		startTimer();
	}

	// Pause when the tab is in the background (no point fading hidden pixels)
	document.addEventListener("visibilitychange", function () {
		if (document.hidden) {
			stopTimer();
		} else if (isVisible) {
			startTimer();
		}
	});
})();

// =============================================================
// Active section highlight on the sidebar nav
//
//   Uses IntersectionObserver to detect which section is in the
//   middle of the viewport. Adds .active to the matching nav <a>.
//   CSS lights it up with the same green-fill treatment used for
//   hover, so visitors always know where they are.
// =============================================================
(function () {
	if (!("IntersectionObserver" in window)) return;

	var sectionIds = ["about", "journey", "projects", "skills", "recognition"];
	var navLinks = {};
	sectionIds.forEach(function (id) {
		var el = document.querySelector('#side-nav a[href="#' + id + '"]');
		if (el) navLinks[id] = el;
	});

	var sections = sectionIds
		.map(function (id) { return document.getElementById(id); })
		.filter(Boolean);
	if (sections.length === 0) return;

	// Track the most-visible section
	var ratios = {};
	function setActive(id) {
		Object.keys(navLinks).forEach(function (k) {
			navLinks[k].classList.toggle("nav-active", k === id);
		});
	}

	var io = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				ratios[entry.target.id] = entry.intersectionRatio;
			});
			// Pick the section with the highest visible ratio (ties = first defined)
			var best = null, bestRatio = 0;
			sectionIds.forEach(function (id) {
				var r = ratios[id] || 0;
				if (r > bestRatio) { bestRatio = r; best = id; }
			});
			if (best) setActive(best);
		},
		{ threshold: [0, 0.25, 0.5, 0.75, 1] }
	);

	sections.forEach(function (s) { io.observe(s); });
})();

// Project-card links should navigate without also toggling the surrounding
// expandable card. The rest of each card remains clickable to reveal details.
document.querySelectorAll(".project-card a").forEach(function (link) {
	link.addEventListener("click", function (event) {
		event.stopPropagation();
	});
});
