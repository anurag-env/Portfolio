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

	var sectionIds = ["about", "journey", "research", "projects", "skills", "recognition"];
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

// =============================================================
// Research section — render cards from data
// =============================================================
(function () {
	var papers = window.__researchPapers;
	if (!papers || !papers.length) return;

	var container = document.getElementById("research-cards");
	if (!container) return;

	var list = document.createElement("div");
	list.className = "research-cards-list";

	papers.forEach(function (paper, idx) {
		var card = document.createElement("div");
		card.className = "research-card" + (paper.featured ? " research-card-featured" : "");

		// Eyebrow row: pill left, year right
		var eyebrowRow = document.createElement("div");
		eyebrowRow.className = "research-eyebrow-row";
		var eyebrow = document.createElement("span");
		eyebrow.className = "research-eyebrow";
		eyebrow.textContent = paper.featured ? "ACCEPTED" : "IN PROGRESS";
		eyebrowRow.appendChild(eyebrow);
		var yearTag = document.createElement("span");
		yearTag.className = "research-year";
		yearTag.textContent = paper.year;
		eyebrowRow.appendChild(yearTag);
		card.appendChild(eyebrowRow);

		// Title
		var title = document.createElement("h2");
		title.className = "research-title";
		title.textContent = paper.title;
		card.appendChild(title);

		// Citation
		var cite = document.createElement("p");
		cite.className = "research-citation";
		var citeParts = [paper.authors];
		if (paper.venue) citeParts.push(paper.venue);
		if (paper.publisher) citeParts.push(paper.publisher);
		cite.textContent = citeParts.join(" \u00b7 ");
		card.appendChild(cite);

		// Pipeline diagram (skip if empty)
		if (paper.pipeline && paper.pipeline.length) {
			var pipeline = document.createElement("div");
			pipeline.className = "pipeline";
			paper.pipeline.forEach(function (stage, si) {
				if (si > 0) {
					var arrow = document.createElement("span");
					arrow.className = "pipeline-arrow";
					arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
					pipeline.appendChild(arrow);
				}
				var node = document.createElement("div");
				node.className = "pipeline-node";
				var icon = document.createElement("i");
				icon.className = stage.icon;
				node.appendChild(icon);
				var lbl = document.createElement("span");
				lbl.textContent = stage.label;
				node.appendChild(lbl);
				pipeline.appendChild(node);
			});
			card.appendChild(pipeline);
		}

		// Abstract
		if (paper.abstract) {
			var absWrap = document.createElement("div");
			absWrap.className = "pub-abstract";
			var absP = document.createElement("p");
			absP.textContent = paper.abstract;
			absWrap.appendChild(absP);
			card.appendChild(absWrap);
		}

		// Tech stack tags + publication button row
		if ((paper.stats && paper.stats.length) || (paper.links && paper.links.publication)) {
			var techRow = document.createElement("div");
			techRow.className = "research-tech-tags";
			if (paper.stats && paper.stats.length) {
				paper.stats.forEach(function (s) {
					var tag = document.createElement("span");
					tag.className = "research-tech-tag";
					tag.textContent = s.value;
					techRow.appendChild(tag);
				});
			}
			if (paper.links && paper.links.publication) {
				var pubBtn = document.createElement("a");
				pubBtn.className = "research-btn research-btn-primary";
				pubBtn.href = paper.links.publication;
				pubBtn.target = "_blank";
				pubBtn.rel = "noopener";
				pubBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
				pubBtn.setAttribute("data-tooltip", "View Conference");
				techRow.appendChild(pubBtn);
			}
			card.appendChild(techRow);
		}

		list.appendChild(card);
	});

	container.appendChild(list);
})();

// Project-card links should navigate without also toggling the surrounding
// expandable card. The rest of each card remains clickable to reveal details.
document.querySelectorAll(".project-card a").forEach(function (link) {
	link.addEventListener("click", function (event) {
		event.stopPropagation();
	});
});

// =============================================================
// Dark-mode toggle
// =============================================================
(function () {
	var toggle = document.getElementById("theme-toggle");
	var icon = toggle.querySelector("i");
	var body = document.body;
	var STORAGE_KEY = "theme";

	// Restore saved preference
	if (localStorage.getItem(STORAGE_KEY) === "dark") {
		body.classList.add("dark-mode");
		icon.classList.replace("fa-moon", "fa-sun");
	}

	toggle.addEventListener("click", function () {
		body.classList.toggle("dark-mode");
		var isDark = body.classList.contains("dark-mode");
		icon.classList.toggle("fa-moon", !isDark);
		icon.classList.toggle("fa-sun", isDark);
		localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
	});
})();
