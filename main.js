// =============================================================
// Nav scroll-down chevron + landing fade-out as user scrolls
// =============================================================
var _isProgrammaticScroll = false;

function _smoothScrollTo(target, duration, onDone) {
	var el = document.scrollingElement || document.documentElement;
	var start = el.scrollTop;
	var dist = target - start;
	if (dist === 0) { if (onDone) onDone(); return; }
	var t0 = null;
	function step(ts) {
		if (!t0) t0 = ts;
		var p = Math.min((ts - t0) / duration, 1);
		var ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
		el.scrollTop = start + dist * ease;
		if (p < 1) { requestAnimationFrame(step); }
		else { if (onDone) onDone(); }
	}
	requestAnimationFrame(step);
}

$(document).ready(function () {
	$("#landing-chevron-btn").click(function () {
		document.dispatchEvent(new CustomEvent("boids-info-close"));
		var targetTop = $("#details-container").offset().top;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			_isProgrammaticScroll = true;
			$("html,body").animate({ scrollTop: targetTop }, "slow", function () {
				_isProgrammaticScroll = false;
			});
			return;
		}
		_isProgrammaticScroll = true;
		_smoothScrollTo(targetTop, 600, function () {
			_isProgrammaticScroll = false;
		});
	});
});

$(window).scroll(function () {
	if (_isProgrammaticScroll) return;
	var opac1 = ($("#heading-name").offset().top - $(window).scrollTop() + 50) / ($("#heading-name").offset().top + 50);
	if (opac1 < 0) opac1 = 0;
	$("#heading-name").css("opacity", opac1);
	$("#heading-title").css("opacity", opac1);
	$("#landing-footer").css("opacity", opac1);
	$("#landing-cta").css("opacity", opac1);
	$("#landing-socials").css("opacity", opac1);
	var boidsInfo = document.getElementById("boids-info");
	var boidsStats = document.getElementById("boids-debug-stats");
	if (boidsInfo) boidsInfo.style.setProperty("--boids-scroll-opacity", opac1);
	if (boidsStats) boidsStats.style.setProperty("--boids-scroll-opacity", opac1);
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
	// Desktop uses an opaque canvas; retain the image cross-fade only for mobile.
	if (!window.matchMedia("(max-width: 900px)").matches) return;
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

			// Two-column body row: performance | (pipeline + abstract)
			var bodyRow = document.createElement("div");
			bodyRow.className = "research-body-row";

			// Column 1: Model performance (narrow, left)
			if (paper.performance && paper.performance.length) {
				var perfCol = document.createElement("div");
				perfCol.className = "research-perf-box";
				var perfTitle = document.createElement("h3");
				perfTitle.className = "research-panel-title";
				perfTitle.textContent = "Model performance";
				perfCol.appendChild(perfTitle);
				var perfGrid = document.createElement("div");
				perfGrid.className = "research-perf-grid";
				paper.performance.forEach(function (m) {
					var metric = document.createElement("div");
					metric.className = "research-perf-metric";
					var val = document.createElement("span");
					val.className = "research-perf-value";
					val.textContent = m.value;
					metric.appendChild(val);
					var lbl = document.createElement("span");
					lbl.className = "research-perf-label";
					lbl.textContent = m.label;
					metric.appendChild(lbl);
					perfGrid.appendChild(metric);
				});
				perfCol.appendChild(perfGrid);
				bodyRow.appendChild(perfCol);
			}

			// Column 2: Pipeline (top) + Abstract (bottom), stacked vertically
			var contentCol = document.createElement("div");
			contentCol.className = "research-body-content";

			// Pipeline (horizontal, top)
			var pipelineWrap = document.createElement("div");
			pipelineWrap.className = "research-body-pipeline";
			paper.pipeline.forEach(function (stage, si) {
				var node = document.createElement("div");
				node.className = "pipeline-node-v";
				var icon = document.createElement("i");
				icon.className = stage.icon;
				node.appendChild(icon);
				var textWrap = document.createElement("div");
				textWrap.className = "pipeline-node-text";
				var titleEl = document.createElement("span");
				titleEl.className = "pipeline-node-title";
				titleEl.textContent = stage.title;
				textWrap.appendChild(titleEl);
				if (stage.subtitle) {
					var sub = document.createElement("span");
					sub.className = "pipeline-node-sub";
					sub.textContent = stage.subtitle;
					textWrap.appendChild(sub);
				}
				node.appendChild(textWrap);
				pipelineWrap.appendChild(node);
				if (si < paper.pipeline.length - 1) {
					var arrow = document.createElement("span");
					arrow.className = "pipeline-arrow-v";
					arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
					pipelineWrap.appendChild(arrow);
				}
			});
			contentCol.appendChild(pipelineWrap);

			// Abstract (bottom)
			if (paper.abstract) {
				var absCol = document.createElement("div");
				absCol.className = "research-body-abstract";
				var absP = document.createElement("p");
				absP.textContent = paper.abstract;
				absCol.appendChild(absP);
				contentCol.appendChild(absCol);
			}

			bodyRow.appendChild(contentCol);
			card.appendChild(bodyRow);
		} else if (paper.abstract) {
			var absWrap = document.createElement("div");
			absWrap.className = "research-body-abstract";
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
		toggle.dataset.tooltip = "Light mode";
	}

	toggle.addEventListener("click", function () {
		body.classList.toggle("dark-mode");
		var isDark = body.classList.contains("dark-mode");
		icon.classList.toggle("fa-moon", !isDark);
		icon.classList.toggle("fa-sun", isDark);
		toggle.dataset.tooltip = isDark ? "Light mode" : "Dark mode";
		localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
	});
})();

// =============================================================
// Boids flocking simulation — hero section background
// Desktop-only: fully mounted/unmounted based on viewport width
// =============================================================
(function () {
	var DESKTOP_BP = 1024;
	var canvas = document.getElementById("boids-canvas");
	var fallback = document.getElementById("boids-fallback");
	if (!canvas) return;

	var ctx = canvas.getContext("2d");
	var boids = [];
	var flocks = [];
	var animId = null;
	var running = false;
	var mouse = null;
	var heroVisible = true;
	var statsVisible = false;
	var initialised = false;
	var worldWidth = 0;
	var worldHeight = 0;
	var pixelRatio = 1;
	var introStartedAt = 0;

	// Stored listener references for clean removal
	var onMouseMove, onMouseLeave, onPointerDown, onPointerUp, onResize, onVisibilityChange;

	// --- Flock config ---
	var FLOCK_COUNT = 4;
	var BOIDS_PER = 25;
	var FEAR_RADIUS = 120;
	var INTERACT_RADIUS = 210;
	var DENSITY_RADIUS = 40;
	var DENSITY_LIMIT = 12;
	var DENSITY_FORCE = 0.06;
	var EXPLORE_INTERVAL = 720;
	var MAX_VISIBLE_GROUPS = 10;
	var GROUP_CHECK_INTERVAL = 30;

	// --- Boid behaviour ---
	var SEP_RADIUS = 22;
	var ALIGN_RADIUS = 90;
	var COH_RADIUS = 90;
	var WSEP = 1.8;
	var WALIGN = 1.0;
	var WCOH = 0.3;
	var WGOAL = 0.005;
	var WFLEE = 0.32;
	var WATTRACT = 0.052;
	var WVORTEX = 0.022;
	var RALLY_SPEED = 1.42;
	var WDRIFT = 0.003;
	var WREGROUP = 0.38;
	var MAX_SPEED = 1.1;
	var MAX_FORCE = 0.04;
	var GOAL_SPEED = 0.15;
	var INTRO_DURATION = 1150;
	var driftAngle = Math.random() * Math.PI * 2;
	var frameCount = 0;
	var regroupTargets = [];

	// --- Debug mode ---
	var isDev = window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1" ||
		window.location.protocol === "file:" ||
		window.location.search.indexOf("debug=true") !== -1;
	var debugOn = statsVisible;
	var debugLabelsAlpha = 1;
	var fpsFrames = 0;
	var fpsLast = performance.now();
	var fpsDisplay = 60;
	var statsLast = 0;
	var focusIdx = -1;
	var focusTimer = 0;
	var FOCUS_RESELECT = 240;

	// Observer references for cleanup
	var heroIo = null;
	var boidsInfo = null;
	var boidsStats = null;

	function isDesktop() {
		return window.innerWidth >= DESKTOP_BP;
	}

	function resize() {
		var rect = canvas.getBoundingClientRect();
		worldWidth = rect.width;
		worldHeight = rect.height;
		pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(worldWidth * pixelRatio);
		canvas.height = Math.round(worldHeight * pixelRatio);
		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	}

	function hslToRgb(h, s, l) {
		s /= 100; l /= 100;
		var c = (1 - Math.abs(2 * l - 1)) * s;
		var x = c * (1 - Math.abs((h / 60) % 2 - 1));
		var m = l - c / 2;
		var r, g, b;
		if (h < 60)       { r = c; g = x; b = 0; }
		else if (h < 120) { r = x; g = c; b = 0; }
		else if (h < 180) { r = 0; g = c; b = x; }
		else if (h < 240) { r = 0; g = x; b = c; }
		else if (h < 300) { r = x; g = 0; b = c; }
		else              { r = c; g = 0; b = x; }
		return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
	}

	function createBoids() {
		boids = [];
		flocks = [];
		regroupTargets = [];
		var pad = 80;
		var cols = 2, rows = 2;
		var zoneW = (worldWidth - pad * 2) / cols;
		var zoneH = (worldHeight - pad * 2) / rows;
		for (var f = 0; f < FLOCK_COUNT; f++) {
			var col = f % cols;
			var row = Math.floor(f / cols);
			var gx = pad + zoneW * col + zoneW * 0.5;
			var gy = pad + zoneH * row + zoneH * 0.5;
			flocks.push({
				goalX: gx, goalY: gy,
				targetX: gx, targetY: gy,
				wanderAngle: Math.random() * Math.PI * 2,
				exploreTimer: Math.floor(Math.random() * EXPLORE_INTERVAL)
			});
			var baseHue = (f / FLOCK_COUNT) * 360 + (Math.random() - 0.5) * 60;
			var sat = 70 + Math.random() * 20;
			var lit = 55 + Math.random() * 10;
			for (var i = 0; i < BOIDS_PER; i++) {
				var angle = Math.random() * Math.PI * 2;
				var depth = Math.random();
				var maxSpeed = MAX_SPEED * (0.78 + depth * 0.34);
				var spd = maxSpeed * (0.7 + Math.random() * 0.3);
				var h = (baseHue + (Math.random() - 0.5) * 24 + 360) % 360;
				var homeX = gx + (Math.random() - 0.5) * 40;
				var homeY = gy + (Math.random() - 0.5) * 40;
				var edge = f % 4;
				var startX = edge === 0 ? -30 : edge === 1 ? worldWidth + 30 : Math.random() * worldWidth;
				var startY = edge === 2 ? -30 : edge === 3 ? worldHeight + 30 : Math.random() * worldHeight;
				boids.push({
					x: startX, y: startY,
					vx: Math.cos(angle) * spd,
					vy: Math.sin(angle) * spd,
					homeX: homeX, homeY: homeY, startX: startX, startY: startY,
					introDelay: f * 150 + Math.random() * 360,
					depth: depth, maxSpeed: maxSpeed,
					size: 3.8 + depth * 4.1,
					opacity: 0.26 + depth * 0.46,
					flock: f,
					color: "hsl(" + h + "," + sat + "%," + lit + "%)",
					colorRGB: hslToRgb(h, sat, lit)
				});
			}
		}
	}

	function limit(ax, ay, max) {
		var m = Math.sqrt(ax * ax + ay * ay);
		if (m > max && m > 0) { ax = (ax / m) * max; ay = (ay / m) * max; }
		return [ax, ay];
	}

	function refreshRegroupTargets() {
		regroupTargets = [];
		var clusters = detectClusters().members;
		if (clusters.length <= MAX_VISIBLE_GROUPS) return;

		clusters.sort(function (a, b) { return b.members.length - a.members.length; });
		var established = clusters.slice(0, MAX_VISIBLE_GROUPS);
		for (var i = MAX_VISIBLE_GROUPS; i < clusters.length; i++) {
			var fragment = clusters[i];
			var nearest = established[0];
			var nearestDistance = Infinity;
			for (var j = 0; j < established.length; j++) {
				var dx = fragment.x - established[j].x;
				var dy = fragment.y - established[j].y;
				var distance = dx * dx + dy * dy;
				if (distance < nearestDistance) { nearestDistance = distance; nearest = established[j]; }
			}
			for (var k = 0; k < fragment.members.length; k++) {
				regroupTargets[fragment.members[k]] = nearest;
			}
		}
	}

	function update() {
		frameCount++;
		driftAngle += (Math.random() - 0.5) * 0.02;
		var introElapsed = performance.now() - introStartedAt;
		var introComplete = introElapsed >= INTRO_DURATION + 810;
		if (introComplete && frameCount % GROUP_CHECK_INTERVAL === 0) refreshRegroupTargets();

		for (var f = 0; f < flocks.length; f++) {
			var g = flocks[f];
			if (!introComplete) continue;
			g.exploreTimer++;
			if (g.exploreTimer >= EXPLORE_INTERVAL) {
				g.exploreTimer = 0;
				g.targetX = 80 + Math.random() * (worldWidth - 160);
				g.targetY = 80 + Math.random() * (worldHeight - 160);
			} else {
				g.wanderAngle += (Math.random() - 0.5) * 0.6;
				g.targetX += Math.cos(g.wanderAngle) * GOAL_SPEED;
				g.targetY += Math.sin(g.wanderAngle) * GOAL_SPEED;
			}
			if (g.targetX < -50) g.targetX = worldWidth * 0.5;
			if (g.targetX > worldWidth + 50) g.targetX = worldWidth * 0.5;
			if (g.targetY < -50) g.targetY = worldHeight * 0.5;
			if (g.targetY > worldHeight + 50) g.targetY = worldHeight * 0.5;
			g.goalX += (g.targetX - g.goalX) * 0.005;
			g.goalY += (g.targetY - g.goalY) * 0.005;
		}

		for (var i = 0; i < boids.length; i++) {
			var b = boids[i];
			var introProgress = Math.max(0, Math.min(1, (introElapsed - b.introDelay) / INTRO_DURATION));
			if (introProgress < 1) {
				var eased = 1 - Math.pow(1 - introProgress, 3);
				b.x = b.startX + (b.homeX - b.startX) * eased;
				b.y = b.startY + (b.homeY - b.startY) * eased;
				b.vx = (b.homeX - b.startX) / INTRO_DURATION * 16;
				b.vy = (b.homeY - b.startY) / INTRO_DURATION * 16;
				continue;
			}
			var sx = 0, sy = 0, sc = 0;
			var ax = 0, ay = 0, ac = 0;
			var cx = 0, cy = 0, cc = 0;
			var nearby = 0;

			for (var j = 0; j < boids.length; j++) {
				if (i === j) continue;
				var o = boids[j];
				var dx = b.x - o.x;
				var dy = b.y - o.y;
				var d = Math.sqrt(dx * dx + dy * dy);

				if (o.flock === b.flock && d < SEP_RADIUS && d > 0) {
					sx += dx / d; sy += dy / d; sc++;
				}
				if (d < ALIGN_RADIUS) { ax += o.vx; ay += o.vy; ac++; }
				if (d < COH_RADIUS) { cx += o.x; cy += o.y; cc++; }
				if (d < DENSITY_RADIUS) nearby++;
			}

			var fx = 0, fy = 0;

			if (sc > 0) {
				sx /= sc; sy /= sc;
				var sm = Math.sqrt(sx * sx + sy * sy);
				if (sm > 0) { sx = (sx / sm) * b.maxSpeed - b.vx; sy = (sy / sm) * b.maxSpeed - b.vy; }
				var sl = limit(sx, sy, MAX_FORCE);
				fx += sl[0] * WSEP; fy += sl[1] * WSEP;
			}

			if (nearby > DENSITY_LIMIT) {
				var densityPush = (nearby - DENSITY_LIMIT) * DENSITY_FORCE;
				var dxAll = 0, dyAll = 0, dCount = 0;
				for (var j = 0; j < boids.length; j++) {
					if (i === j) continue;
					var o = boids[j];
					var ddx = b.x - o.x;
					var ddy = b.y - o.y;
					var dd = Math.sqrt(ddx * ddx + ddy * ddy);
					if (dd < DENSITY_RADIUS && dd > 0) {
						dxAll += ddx / dd; dyAll += ddy / dd; dCount++;
					}
				}
				if (dCount > 0) {
					dxAll /= dCount; dyAll /= dCount;
					var dm = Math.sqrt(dxAll * dxAll + dyAll * dyAll) || 1;
					fx += (dxAll / dm) * densityPush;
					fy += (dyAll / dm) * densityPush;
				}
			}

			if (ac > 0) {
				ax /= ac; ay /= ac;
				var am = Math.sqrt(ax * ax + ay * ay);
				if (am > 0) { ax = (ax / am) * b.maxSpeed - b.vx; ay = (ay / am) * b.maxSpeed - b.vy; }
				var al = limit(ax, ay, MAX_FORCE);
				fx += al[0] * WALIGN; fy += al[1] * WALIGN;
			}

			if (cc > 0) {
				cx = cx / cc - b.x; cy = cy / cc - b.y;
				var cm = Math.sqrt(cx * cx + cy * cy);
				if (cm > 0) { cx = (cx / cm) * b.maxSpeed - b.vx; cy = (cy / cm) * b.maxSpeed - b.vy; }
				var cl = limit(cx, cy, MAX_FORCE);
				fx += cl[0] * WCOH; fy += cl[1] * WCOH;
			}

			var fg = flocks[b.flock];
			var gdx = fg.goalX - b.x;
			var gdy = fg.goalY - b.y;
			var gd = Math.sqrt(gdx * gdx + gdy * gdy);
			if (gd > 1) {
				var gSteerX = (gdx / gd) * b.maxSpeed - b.vx;
				var gSteerY = (gdy / gd) * b.maxSpeed - b.vy;
				var gl = limit(gSteerX, gSteerY, MAX_FORCE);
				fx += gl[0] * WGOAL; fy += gl[1] * WGOAL;
			}

			// If the scene has fragmented beyond its ten-group ceiling, gently
			// rejoin only the excess fragments to their nearest established group.
			var regroup = regroupTargets[i];
			if (regroup) {
				var rdx = regroup.x - b.x;
				var rdy = regroup.y - b.y;
				var rd = Math.sqrt(rdx * rdx + rdy * rdy);
				if (rd > 1) {
					var regroupX = (rdx / rd) * b.maxSpeed - b.vx;
					var regroupY = (rdy / rd) * b.maxSpeed - b.vy;
					var rl = limit(regroupX, regroupY, MAX_FORCE);
					fx += rl[0] * WREGROUP; fy += rl[1] * WREGROUP;
				}
			}

			fx += Math.cos(driftAngle) * WDRIFT;
			fy += Math.sin(driftAngle) * WDRIFT;

			if (mouse) {
				var mdx = b.x - mouse.x;
				var mdy = b.y - mouse.y;
				var md = Math.sqrt(mdx * mdx + mdy * mdy);
				if (mouse.down && md > 0) {
					// Holding the pointer becomes a global rally point: distant flocks
					// turn decisively toward it, then settle into a small orbit on arrival.
					var pull = WATTRACT * (0.45 + 0.55 * Math.min(md / INTERACT_RADIUS, 1));
					fx -= (mdx / md) * pull;
					fy -= (mdy / md) * pull;
					if (md < INTERACT_RADIUS) {
						// A very small tangential force makes the gathered flock feel alive.
						fx += (-mdy / md) * WVORTEX * (1 - md / INTERACT_RADIUS);
						fy += (mdx / md) * WVORTEX * (1 - md / INTERACT_RADIUS);
					}
				} else if (md < FEAR_RADIUS && md > 0) {
					var strength = (1 - md / FEAR_RADIUS) * WFLEE;
					fx += (mdx / md) * strength;
					fy += (mdy / md) * strength;
				}
			}

			b.vx += fx; b.vy += fy;
			var spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
			var speedLimit = mouse && mouse.down ? b.maxSpeed * RALLY_SPEED : b.maxSpeed;
			if (spd > speedLimit) { b.vx = (b.vx / spd) * speedLimit; b.vy = (b.vy / spd) * speedLimit; }

			if (Math.random() < 0.003) {
				b.vx += (Math.random() - 0.5) * 0.15;
				b.vy += (Math.random() - 0.5) * 0.15;
			}

			b.x += b.vx; b.y += b.vy;

			if (b.x < -8) b.x = worldWidth + 8;
			else if (b.x > worldWidth + 8) b.x = -8;
			if (b.y < -8) b.y = worldHeight + 8;
			else if (b.y > worldHeight + 8) b.y = -8;
		}
	}

	function draw() {
		ctx.fillStyle = "#0d0d0d";
		ctx.fillRect(0, 0, worldWidth, worldHeight);

		for (var i = 0; i < boids.length; i++) {
			var b = boids[i];
			var angle = Math.atan2(b.vy, b.vx);
			var s = b.size;
			var rgb = b.colorRGB;

			ctx.save();
			ctx.translate(b.x, b.y);
			ctx.rotate(angle);
			if (b.depth > 0.78) {
				ctx.shadowColor = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.45)";
				ctx.shadowBlur = 5 + b.depth * 5;
			}
			ctx.beginPath();
			ctx.moveTo(s * 2, 0);
			ctx.lineTo(-s, -s * 0.65);
			ctx.lineTo(-s * 0.5, 0);
			ctx.lineTo(-s, s * 0.65);
			ctx.closePath();
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + b.opacity + ")";
			ctx.fill();
			ctx.restore();
		}
	}

	function detectClusters() {
		var EPS = COH_RADIUS;
		var EPS_SQ = EPS * EPS;
		var MIN_PTS = 3;
		var n = boids.length;

		var neighbors = [];
		for (var i = 0; i < n; i++) {
			neighbors[i] = [];
			for (var j = 0; j < n; j++) {
				if (i === j) continue;
				var dx = boids[i].x - boids[j].x;
				var dy = boids[i].y - boids[j].y;
				if (dx * dx + dy * dy < EPS_SQ) neighbors[i].push(j);
			}
		}

		var CORE = 1, BORDER = 2, NOISE = 3;
		var pointType = [];
		for (var i = 0; i < n; i++) {
			pointType[i] = neighbors[i].length >= MIN_PTS ? CORE : NOISE;
		}

		for (var i = 0; i < n; i++) {
			if (pointType[i] !== NOISE) continue;
			for (var k = 0; k < neighbors[i].length; k++) {
				if (pointType[neighbors[i][k]] === CORE) { pointType[i] = BORDER; break; }
			}
		}

		var visited = [];
		var clusterSizes = [];
		var clusters = [];

		for (var i = 0; i < n; i++) {
			if (visited[i] || pointType[i] !== CORE) continue;
			var size = 0;
			var members = [];
			var queue = [i];
			visited[i] = true;
			while (queue.length > 0) {
				var cur = queue.shift();
				size++;
				members.push(cur);
				if (pointType[cur] === NOISE) continue;
				for (var k = 0; k < neighbors[cur].length; k++) {
					var nb = neighbors[cur][k];
					if (!visited[nb]) {
						visited[nb] = true;
						if (pointType[nb] !== NOISE) queue.push(nb);
					}
				}
			}
			if (size > 0) {
				var totalX = 0, totalY = 0;
				for (var m = 0; m < members.length; m++) {
					totalX += boids[members[m]].x;
					totalY += boids[members[m]].y;
				}
				clusters.push({ members: members, x: totalX / members.length, y: totalY / members.length });
				clusterSizes.push(size);
			}
		}

		for (var i = 0; i < n; i++) {
			if (!visited[i]) {
				clusters.push({ members: [i], x: boids[i].x, y: boids[i].y });
				clusterSizes.push(1);
			}
		}

		clusterSizes.sort(function (a, b) { return a - b; });
		return { count: clusterSizes.length, sizes: clusterSizes, members: clusters };
	}

	function drawDebug() {
		fpsFrames++;
		var now = performance.now();
		if (now - fpsLast >= 500) {
			fpsDisplay = Math.round(fpsFrames / ((now - fpsLast) / 1000));
			fpsFrames = 0;
			fpsLast = now;
		}

		var statsEl = document.getElementById("boids-debug-stats");
		if (statsEl && now - statsLast >= 1000) {
			statsLast = now;
			var clusters = detectClusters();
			var sizes = clusters.sizes;
			var largest = sizes.length > 0 ? sizes[sizes.length - 1] : 0;
			var median = sizes.length > 0 ? sizes[Math.floor(sizes.length / 2)] : 0;
			var valuesEl = statsEl.querySelector(".boids-stats-values");
			if (valuesEl) {
				valuesEl.textContent =
					"boids: " + boids.length +
					"\nflocks: " + clusters.count +
					"\nlargest: " + largest + "  median: " + median +
					"\nfps: " + fpsDisplay;
			}
		}

		if (!statsVisible) return;

		focusTimer++;
		if (focusIdx === -1 || focusTimer >= FOCUS_RESELECT) {
			focusTimer = 0;
			var heading = document.getElementById("heading-name");
			var title = document.getElementById("heading-title");
			var qzLeft = 0, qzRight = 0, qzTop = 0, qzBottom = 0;
			if (heading) {
				var hc = heading.getBoundingClientRect();
				var tc = title ? title.getBoundingClientRect() : hc;
				var padX = 120, padY = 70;
				qzLeft = hc.left - padX;
				qzRight = hc.right + padX;
				qzTop = Math.min(hc.top, tc.top) - padY;
				qzBottom = Math.max(hc.bottom, tc.bottom) + padY;
			}
			var bestCount = -1;
			focusIdx = 0;
			for (var i = 0; i < boids.length; i++) {
				var bx = boids[i].x, by = boids[i].y;
				if (heading && bx > qzLeft && bx < qzRight && by > qzTop && by < qzBottom) continue;
				var count = 0;
				for (var j = 0; j < boids.length; j++) {
					if (i === j) continue;
					var ddx = bx - boids[j].x, ddy = by - boids[j].y;
					if (ddx * ddx + ddy * ddy < ALIGN_RADIUS * ALIGN_RADIUS) count++;
				}
				if (count > bestCount) { bestCount = count; focusIdx = i; }
			}
		}
		var fb = boids[focusIdx];

		var circles = [
			{ r: SEP_RADIUS, color: "rgba(255,120,80,0.35)", label: "separation" },
			{ r: ALIGN_RADIUS, color: "rgba(255,220,80,0.3)", label: "alignment" },
			{ r: COH_RADIUS, color: "rgba(80,200,255,0.3)", label: "cohesion" }
		];
		for (var c = 0; c < circles.length; c++) {
			var ci = circles[c];
			ctx.beginPath();
			ctx.arc(fb.x, fb.y, ci.r, 0, Math.PI * 2);
			ctx.strokeStyle = ci.color;
			ctx.lineWidth = 1;
			ctx.stroke();
			if (debugLabelsAlpha > 0.01) {
				ctx.fillStyle = ci.color.replace("0.3", String(0.7 * debugLabelsAlpha));
				ctx.font = "10px monospace";
				ctx.fillText(ci.label, fb.x + ci.r + 4, fb.y + 3);
			}
		}
		if (debugLabelsAlpha > 0.01) debugLabelsAlpha *= 0.995;

		ctx.lineWidth = 0.5;
		for (var j = 0; j < boids.length; j++) {
			if (j === focusIdx) continue;
			var o = boids[j];
			var dx = fb.x - o.x, dy = fb.y - o.y;
			var d = Math.sqrt(dx * dx + dy * dy);
			if (d < COH_RADIUS) {
				var alpha = 0.25 * (1 - d / COH_RADIUS);
				ctx.beginPath();
				ctx.moveTo(fb.x, fb.y);
				ctx.lineTo(o.x, o.y);
				ctx.strokeStyle = "rgba(100,200,255," + alpha + ")";
				ctx.stroke();
			}
		}
	}

	function frame() {
		update();
		draw();
		drawDebug();
		if (running) animId = requestAnimationFrame(frame);
	}

	function start() {
		if (running || !heroVisible) return;
		running = true;
		frame();
	}

	function stop() {
		running = false;
		if (animId) { cancelAnimationFrame(animId); animId = null; }
	}

	function setHeroVisible(visible) {
		heroVisible = visible;
		if (visible && isDesktop()) { resize(); start(); }
		else stop();
	}

	function resetSimulation() {
		stop();
		boids = [];
		flocks = [];
		frameCount = 0;
		fpsFrames = 0;
		fpsLast = performance.now();
		fpsDisplay = 60;
		statsLast = 0;
		driftAngle = Math.random() * Math.PI * 2;
		resize();
		introStartedAt = performance.now();
		createBoids();
		start();
	}

	function toggleStats() {
		statsVisible = !statsVisible;
		debugOn = statsVisible;
		var stats = document.getElementById("boids-debug-stats");
		var socials = document.getElementById("landing-socials");
		if (stats) stats.classList.toggle("is-collapsed", !statsVisible);
		if (socials) socials.classList.toggle("is-shifted", !statsVisible);
	}

	// ── Teardown: cancel rAF, remove listeners, disconnect observers ──
	function teardown() {
		stop();
		boids = [];
		flocks = [];
		if (onMouseMove) { window.removeEventListener("mousemove", onMouseMove); onMouseMove = null; }
		if (onMouseLeave) { window.removeEventListener("mouseleave", onMouseLeave); onMouseLeave = null; }
		if (onPointerDown) { window.removeEventListener("pointerdown", onPointerDown); onPointerDown = null; }
		if (onPointerUp) { window.removeEventListener("pointerup", onPointerUp); onPointerUp = null; }
		if (onResize) { window.removeEventListener("resize", onResize); onResize = null; }
		if (onVisibilityChange) { document.removeEventListener("visibilitychange", onVisibilityChange); onVisibilityChange = null; }
		if (heroIo) { heroIo.disconnect(); heroIo = null; }
		if (boidsInfo) boidsInfo = null;
		if (boidsStats) boidsStats = null;
		initialised = false;
	}

	// ── Init: set up listeners, observers, create boids, start ──
	function init() {
		if (initialised) return;
		initialised = true;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		resize();
		introStartedAt = performance.now();
		createBoids();

		function setMousePosition(e) {
			var rect = canvas.getBoundingClientRect();
			if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return false;
			mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top, down: mouse && mouse.down };
			return true;
		}
		onMouseMove = function (e) { setMousePosition(e); };
		onMouseLeave = function () { mouse = null; };
		onPointerDown = function (e) {
			if (e.target.closest("a, button, input, textarea, select")) return;
			if (setMousePosition(e) && mouse) mouse.down = true;
		};
		onPointerUp = function () { if (mouse) mouse.down = false; };
		onResize = function () {
			resize();
			introStartedAt = performance.now();
			createBoids();
		};
		onVisibilityChange = function () {
			if (document.hidden) stop();
			else { resize(); start(); }
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseleave", onMouseLeave);
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibilityChange);

		// Initialize debug UI to active state on load (dev only)
		(function () {
			var btn = document.getElementById("boids-debug-btn");
			var stats = document.getElementById("boids-debug-stats");
			if (!stats) {
				stats = document.createElement("div");
				stats.id = "boids-debug-stats";

				var header = document.createElement("div");
				header.className = "boids-stats-header";
				var dot = document.createElement("span");
				dot.className = "boids-stats-dot";
				header.appendChild(dot);
				header.appendChild(document.createTextNode("Simulation Stats"));

				var resetBtn = document.createElement("button");
				resetBtn.className = "boids-reset-btn";
				resetBtn.type = "button";
				resetBtn.title = "Reset simulation";
				resetBtn.setAttribute("aria-label", "Reset simulation");
				resetBtn.innerHTML = "&#x21bb;";
				header.appendChild(resetBtn);

				var values = document.createElement("div");
				values.className = "boids-stats-values";

				stats.appendChild(header);
				stats.appendChild(values);

				var landing = document.getElementById("landing-container");
				(landing || document.body).appendChild(stats);
			}
			if (btn && isDev) {
				btn.classList.toggle("is-active", statsVisible);
				btn.setAttribute("aria-pressed", String(statsVisible));
			}
			if (stats) stats.style.display = statsVisible ? "block" : "none";

			// Apply initial collapsed/shifted state on load without triggering transitions
			if (!statsVisible) {
				var socials = document.getElementById("landing-socials");
				if (socials) {
					socials.style.transition = "none";
					socials.classList.add("is-shifted");
				}
				if (stats) {
					stats.style.transition = "none";
					stats.classList.add("is-collapsed");
				}
				var s = socials, st = stats;
				requestAnimationFrame(function () {
					if (s) s.style.transition = "";
					if (st) st.style.transition = "";
				});
			}

			var resetBtnEl = stats.querySelector(".boids-reset-btn");
			if (resetBtnEl) {
				resetBtnEl.addEventListener("click", function (e) {
					e.stopPropagation();
					resetSimulation();
					if (!statsVisible) toggleStats();
				});
			}
		})();

		// Hero visibility: pause animation & hide overlays when scrolled out
		if ("IntersectionObserver" in window) {
			boidsInfo = document.getElementById("boids-info");
			boidsStats = document.getElementById("boids-debug-stats");
			heroIo = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					var vis = entry.isIntersecting;
					setHeroVisible(vis);
					if (boidsInfo) boidsInfo.classList.toggle("is-hidden", !vis);
					if (boidsStats) boidsStats.classList.toggle("is-hidden", !vis);
					if (!vis) document.dispatchEvent(new CustomEvent("boids-info-close"));
				});
			}, { threshold: 0 });
			heroIo.observe(canvas.parentElement);
		}

		start();
	}

	// Stats card toggle — shared by the </> button click
	document.addEventListener("boids-debug-toggle", function () {
		toggleStats();
		var btn = document.getElementById("boids-debug-btn");
		var stats = document.getElementById("boids-debug-stats");
		if (btn) {
			btn.classList.toggle("is-active", statsVisible);
			btn.setAttribute("aria-pressed", String(statsVisible));
		}
		if (stats) stats.style.display = statsVisible ? "block" : "none";
		// Dev-only debug overlay extras
		if (isDev) {
			debugLabelsAlpha = 1;
		}
	});

	// ── Viewport gate: start on desktop, teardown on mobile ──
	if (isDesktop()) {
		canvas.style.display = "";
		if (fallback) fallback.style.display = "none";
		init();
	} else {
		canvas.style.display = "none";
		if (fallback) fallback.style.display = "block";
	}

	// Listen for resizes crossing the breakpoint
	var wasDesktop = isDesktop();
	window.addEventListener("resize", function () {
		var nowDesktop = isDesktop();
		if (nowDesktop === wasDesktop) return;
		wasDesktop = nowDesktop;
		if (nowDesktop) {
			canvas.style.display = "";
			if (fallback) fallback.style.display = "none";
			init();
		} else {
			canvas.style.display = "none";
			if (fallback) fallback.style.display = "block";
			teardown();
		}
	});
})();

// =============================================================
// Boids info tooltip — desktop only
// =============================================================
(function () {
	if (window.innerWidth < 1024) return;
	var btn = document.getElementById("boids-info-btn");
	var tip = document.getElementById("boids-info-tooltip");
	if (!btn || !tip) return;
	var open = false;

	function show() {
		open = true;
		tip.classList.add("is-open");
		tip.setAttribute("aria-hidden", "false");
		btn.setAttribute("aria-expanded", "true");
		btn.classList.add("is-active");
	}

	function hide() {
		open = false;
		tip.classList.remove("is-open");
		tip.setAttribute("aria-hidden", "true");
		btn.setAttribute("aria-expanded", "false");
		btn.classList.remove("is-active");
	}

	btn.addEventListener("click", function (e) {
		e.stopPropagation();
		open ? hide() : show();
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && open) hide();
	});

	// Leaving the hero dismisses the card; returning leaves the choice to the visitor.
	document.addEventListener("boids-info-close", function () {
		if (open) hide();
	});
})();

// =============================================================
// Boids debug mode toggle
// =============================================================
(function () {
	var btn = document.getElementById("boids-debug-btn");
	if (!btn) return;

	var stats = document.getElementById("boids-debug-stats");
	if (!stats) {
		stats = document.createElement("div");
		stats.id = "boids-debug-stats";
		var landing = document.getElementById("landing-container");
		(landing || document.body).appendChild(stats);
	}

	btn.addEventListener("click", function (e) {
		e.stopPropagation();
		document.dispatchEvent(new CustomEvent("boids-debug-toggle"));
	});
})();