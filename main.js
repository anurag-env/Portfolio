// =============================================================
// Nav scroll-down chevron + landing fade-out as user scrolls
// =============================================================
$(document).ready(function () {
	$("#landing-chevron-btn").click(function () {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			$("html,body").animate({ scrollTop: $("#details-container").offset().top }, "slow");
			return;
		}
		var $hero = $("#landing-container");
		$hero.addClass("hero-lift");
		setTimeout(function () {
			$("html,body").animate({ scrollTop: $("#details-container").offset().top }, "slow", function () {
				$hero.removeClass("hero-lift");
			});
		}, 200);
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
// =============================================================
(function () {
	var canvas = document.getElementById("boids-canvas");
	if (!canvas) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	var ctx = canvas.getContext("2d");
	var boids = [];
	var flocks = [];
	var animId = null;
	var running = false;
	var mouse = null;
	var heroVisible = true;

	// --- Flock config ---
	var FLOCK_COUNT = 4;
	var BOIDS_PER = 25;
	var FEAR_RADIUS = 110;
	var DENSITY_RADIUS = 40;
	var DENSITY_LIMIT = 12;
	var DENSITY_FORCE = 0.06;
	var EXPLORE_INTERVAL = 720; // frames (~12s at 60fps)

	// --- Boid behaviour ---
	var SEP_RADIUS = 22;
	var ALIGN_RADIUS = 90;
	var COH_RADIUS = 90;
	var WSEP = 1.8;
	var WALIGN = 1.0;
	var WCOH = 0.3;
	var WGOAL = 0.005;
	var WFLEE = 4.5;
	var WDRIFT = 0.003;
	var MAX_SPEED = 1.1;
	var MAX_FORCE = 0.04;
	var GOAL_SPEED = 0.15;
	var driftAngle = Math.random() * Math.PI * 2;
	var frameCount = 0;

	// --- Debug mode ---
	var isDev = window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1" ||
		window.location.protocol === "file:" ||
		window.location.search.indexOf("debug=true") !== -1;
	var debugOn = isDev;
	var debugLabelsAlpha = 1;
	var fpsFrames = 0;
	var fpsLast = performance.now();
	var fpsDisplay = 60;
	var statsLast = 0;
	var focusIdx = -1;
	var focusTimer = 0;
	var FOCUS_RESELECT = 240; // frames (~4s at 60fps)

	function resize() {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
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
		var pad = 80;
		// Divide canvas into a 2x2 grid — one quadrant per flock
		var cols = 2, rows = 2;
		var zoneW = (canvas.width - pad * 2) / cols;
		var zoneH = (canvas.height - pad * 2) / rows;
		for (var f = 0; f < FLOCK_COUNT; f++) {
			var col = f % cols;
			var row = Math.floor(f / cols);
			// Center of this flock's quadrant
			var gx = pad + zoneW * col + zoneW * 0.5;
			var gy = pad + zoneH * row + zoneH * 0.5;
			flocks.push({
				goalX: gx, goalY: gy,
				targetX: gx, targetY: gy,
				wanderAngle: Math.random() * Math.PI * 2,
				exploreTimer: Math.floor(Math.random() * EXPLORE_INTERVAL)
			});
			// Per-flock base hue, randomized within a ±30° band
			var baseHue = (f / FLOCK_COUNT) * 360 + (Math.random() - 0.5) * 60;
			var sat = 70 + Math.random() * 20;   // 70–90%
			var lit = 55 + Math.random() * 10;   // 55–65%
			for (var i = 0; i < BOIDS_PER; i++) {
				var angle = Math.random() * Math.PI * 2;
				var spd = MAX_SPEED * (0.7 + Math.random() * 0.3);
				// Jitter each boid's hue ±12° from the flock base for natural variety
				var h = (baseHue + (Math.random() - 0.5) * 24 + 360) % 360;
				boids.push({
					x: gx + (Math.random() - 0.5) * 40,
					y: gy + (Math.random() - 0.5) * 40,
					vx: Math.cos(angle) * spd,
					vy: Math.sin(angle) * spd,
					size: 4.5 + Math.random() * 3,
					opacity: 0.45 + Math.random() * 0.25,
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

	function update() {
		frameCount++;
		// Slowly shift global drift direction
		driftAngle += (Math.random() - 0.5) * 0.02;

		// Wander each flock's goal + periodic exploration reset
		for (var f = 0; f < flocks.length; f++) {
			var g = flocks[f];
			g.exploreTimer++;
			if (g.exploreTimer >= EXPLORE_INTERVAL) {
				g.exploreTimer = 0;
				g.targetX = 80 + Math.random() * (canvas.width - 160);
				g.targetY = 80 + Math.random() * (canvas.height - 160);
			} else {
				g.wanderAngle += (Math.random() - 0.5) * 0.6;
				g.targetX += Math.cos(g.wanderAngle) * GOAL_SPEED;
				g.targetY += Math.sin(g.wanderAngle) * GOAL_SPEED;
			}
			// Soft clamp goal to canvas
			if (g.targetX < -50) g.targetX = canvas.width * 0.5;
			if (g.targetX > canvas.width + 50) g.targetX = canvas.width * 0.5;
			if (g.targetY < -50) g.targetY = canvas.height * 0.5;
			if (g.targetY > canvas.height + 50) g.targetY = canvas.height * 0.5;
			// Ease goal
			g.goalX += (g.targetX - g.goalX) * 0.005;
			g.goalY += (g.targetY - g.goalY) * 0.005;
		}

		for (var i = 0; i < boids.length; i++) {
			var b = boids[i];
			var sx = 0, sy = 0, sc = 0;   // separation
			var ax = 0, ay = 0, ac = 0;   // alignment
			var cx = 0, cy = 0, cc = 0;   // cohesion
			var nearby = 0;               // density count

			for (var j = 0; j < boids.length; j++) {
				if (i === j) continue;
				var o = boids[j];
				var dx = b.x - o.x;
				var dy = b.y - o.y;
				var d = Math.sqrt(dx * dx + dy * dy);

				// Separation: same flock only
				if (o.flock === b.flock && d < SEP_RADIUS && d > 0) {
					sx += dx / d; sy += dy / d; sc++;
				}
				// Alignment & cohesion: ALL nearby boids regardless of flock
				if (d < ALIGN_RADIUS) { ax += o.vx; ay += o.vy; ac++; }
				if (d < COH_RADIUS) { cx += o.x; cy += o.y; cc++; }
				// Density: count boids in small radius (all flocks)
				if (d < DENSITY_RADIUS) nearby++;
			}

			var fx = 0, fy = 0;

			// Separation
			if (sc > 0) {
				sx /= sc; sy /= sc;
				var sm = Math.sqrt(sx * sx + sy * sy);
				if (sm > 0) { sx = (sx / sm) * MAX_SPEED - b.vx; sy = (sy / sm) * MAX_SPEED - b.vy; }
				var sl = limit(sx, sy, MAX_FORCE);
				fx += sl[0] * WSEP; fy += sl[1] * WSEP;
			}

			// Density limit — extra separation when too crowded
			if (nearby > DENSITY_LIMIT) {
				var densityPush = (nearby - DENSITY_LIMIT) * DENSITY_FORCE;
				// Push away from center of local mass
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

			// Alignment (ALL nearby boids)
			if (ac > 0) {
				ax /= ac; ay /= ac;
				var am = Math.sqrt(ax * ax + ay * ay);
				if (am > 0) { ax = (ax / am) * MAX_SPEED - b.vx; ay = (ay / am) * MAX_SPEED - b.vy; }
				var al = limit(ax, ay, MAX_FORCE);
				fx += al[0] * WALIGN; fy += al[1] * WALIGN;
			}

			// Cohesion (ALL nearby boids)
			if (cc > 0) {
				cx = cx / cc - b.x; cy = cy / cc - b.y;
				var cm = Math.sqrt(cx * cx + cy * cy);
				if (cm > 0) { cx = (cx / cm) * MAX_SPEED - b.vx; cy = (cy / cm) * MAX_SPEED - b.vy; }
				var cl = limit(cx, cy, MAX_FORCE);
				fx += cl[0] * WCOH; fy += cl[1] * WCOH;
			}

			// Goal-seeking (wander with flock)
			var fg = flocks[b.flock];
			var gdx = fg.goalX - b.x;
			var gdy = fg.goalY - b.y;
			var gd = Math.sqrt(gdx * gdx + gdy * gdy);
			if (gd > 1) {
				var gSteerX = (gdx / gd) * MAX_SPEED - b.vx;
				var gSteerY = (gdy / gd) * MAX_SPEED - b.vy;
				var gl = limit(gSteerX, gSteerY, MAX_FORCE);
				fx += gl[0] * WGOAL; fy += gl[1] * WGOAL;
			}

			// Global drift
			fx += Math.cos(driftAngle) * WDRIFT;
			fy += Math.sin(driftAngle) * WDRIFT;

			// Mouse fear / scatter
			if (mouse) {
				var mdx = b.x - mouse.x;
				var mdy = b.y - mouse.y;
				var md = Math.sqrt(mdx * mdx + mdy * mdy);
				if (md < FEAR_RADIUS && md > 0) {
					var strength = (1 - md / FEAR_RADIUS) * WFLEE;
					fx += (mdx / md) * strength;
					fy += (mdy / md) * strength;
				}
			}

			// Apply
			b.vx += fx; b.vy += fy;
			var spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
			if (spd > MAX_SPEED) { b.vx = (b.vx / spd) * MAX_SPEED; b.vy = (b.vy / spd) * MAX_SPEED; }

			// Periodic random perturbation
			if (Math.random() < 0.003) {
				b.vx += (Math.random() - 0.5) * 0.15;
				b.vy += (Math.random() - 0.5) * 0.15;
			}

			b.x += b.vx; b.y += b.vy;

			// Wrap edges
			if (b.x < -8) b.x = canvas.width + 8;
			else if (b.x > canvas.width + 8) b.x = -8;
			if (b.y < -8) b.y = canvas.height + 8;
			else if (b.y > canvas.height + 8) b.y = -8;
		}
	}

	function draw() {
		ctx.fillStyle = "#0d0d0d";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < boids.length; i++) {
			var b = boids[i];
			var angle = Math.atan2(b.vy, b.vx);
			var s = b.size;
			var rgb = b.colorRGB;

			ctx.save();
			ctx.translate(b.x, b.y);
			ctx.rotate(angle);
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
		var EPS = COH_RADIUS;        // 90px — neighborhood radius
		var EPS_SQ = EPS * EPS;
		var MIN_PTS = 3;             // core-point threshold
		var n = boids.length;

		// Pre-compute neighbor lists (O(n²))
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

		// DBSCAN: label each point as CORE, BORDER, or NOISE
		var CORE = 1, BORDER = 2, NOISE = 3;
		var pointType = [];
		for (var i = 0; i < n; i++) {
			pointType[i] = neighbors[i].length >= MIN_PTS ? CORE : NOISE;
		}

		// Noise points that are within EPS of a core point become BORDER
		for (var i = 0; i < n; i++) {
			if (pointType[i] !== NOISE) continue;
			for (var k = 0; k < neighbors[i].length; k++) {
				if (pointType[neighbors[i][k]] === CORE) { pointType[i] = BORDER; break; }
			}
		}

		// Grow clusters from unvisited core points via BFS
		var visited = [];
		var clusterSizes = [];

		for (var i = 0; i < n; i++) {
			if (visited[i] || pointType[i] !== CORE) continue;
			// BFS from this core point
			var size = 0;
			var queue = [i];
			visited[i] = true;
			while (queue.length > 0) {
				var cur = queue.shift();
				size++;
				if (pointType[cur] === NOISE) continue;
				// CORE or BORDER: claim neighbors
				for (var k = 0; k < neighbors[cur].length; k++) {
					var nb = neighbors[cur][k];
					if (!visited[nb]) {
						visited[nb] = true;
						if (pointType[nb] !== NOISE) queue.push(nb);
					}
				}
			}
			if (size > 0) clusterSizes.push(size);
		}

		// Count singletons (unvisited = no core point reachable)
		for (var i = 0; i < n; i++) {
			if (!visited[i]) clusterSizes.push(1);
		}

		clusterSizes.sort(function (a, b) { return a - b; });
		return { count: clusterSizes.length, sizes: clusterSizes };
	}

	function drawDebug() {
		// FPS tracking — always runs for stats panel
		fpsFrames++;
		var now = performance.now();
		if (now - fpsLast >= 500) {
			fpsDisplay = Math.round(fpsFrames / ((now - fpsLast) / 1000));
			fpsFrames = 0;
			fpsLast = now;
		}

		// Stats panel — throttled to ~1s (cluster detection is O(n²))
		var statsEl = document.getElementById("boids-debug-stats");
		if (statsEl && now - statsLast >= 1000) {
			statsLast = now;
			var clusters = detectClusters();
			var sizes = clusters.sizes;
			var largest = sizes.length > 0 ? sizes[sizes.length - 1] : 0;
			var median = sizes.length > 0 ? sizes[Math.floor(sizes.length / 2)] : 0;
			statsEl.textContent =
				"boids: " + boids.length +
				"\nflocks: " + clusters.count +
				"\nlargest: " + largest + "  median: " + median +
				"\nfps: " + fpsDisplay;
		}

		if (!debugOn) return;

		// Re-select focus boid every ~4 seconds
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
			// Pick boid with the most neighbors within alignment radius
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

		// Draw rule-radius circles
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
			// Fade labels out over 4 seconds
			if (debugLabelsAlpha > 0.01) {
				ctx.fillStyle = ci.color.replace("0.3", String(0.7 * debugLabelsAlpha));
				ctx.font = "10px monospace";
				ctx.fillText(ci.label, fb.x + ci.r + 4, fb.y + 3);
			}
		}
		if (debugLabelsAlpha > 0.01) debugLabelsAlpha *= 0.995;

		// Draw neighbor connection lines
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
		if (visible) { resize(); start(); }
		else stop();
	}

	resize();
	createBoids();
	start();

	window.addEventListener("mousemove", function (e) {
		mouse = { x: e.clientX, y: e.clientY };
	});
	window.addEventListener("mouseleave", function () {
		mouse = null;
	});

	window.addEventListener("resize", function () {
		resize();
		createBoids();
	});

	document.addEventListener("visibilitychange", function () {
		if (document.hidden) stop();
		else { resize(); start(); }
	});

	// Debug toggle listener (dev only)
	document.addEventListener("boids-debug-toggle", function () {
		if (!isDev) return;
		debugOn = !debugOn;
		debugLabelsAlpha = 1;
		var btn = document.getElementById("boids-debug-btn");
		var stats = document.getElementById("boids-debug-stats");
		if (btn) {
			btn.classList.toggle("is-active", debugOn);
			btn.setAttribute("aria-pressed", String(debugOn));
		}
		if (stats) stats.style.display = debugOn ? "block" : "none";
	});

	// Initialize debug UI to active state on load (dev only)
	(function () {
		var btn = document.getElementById("boids-debug-btn");
		var stats = document.getElementById("boids-debug-stats");
		if (!stats) {
			stats = document.createElement("div");
			stats.id = "boids-debug-stats";
			var landing = document.getElementById("landing-container");
			(landing || document.body).appendChild(stats);
		}
		if (btn && isDev) {
			btn.classList.add("is-active");
			btn.setAttribute("aria-pressed", "true");
		}
		if (stats) stats.style.display = isDev ? "block" : "none";
	})();

	// Hero visibility: pause animation & hide overlays when scrolled out
	if ("IntersectionObserver" in window) {
		var boidsInfo = document.getElementById("boids-info");
		var boidsStats = document.getElementById("boids-debug-stats");
		var heroIo = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				var vis = entry.isIntersecting;
				setHeroVisible(vis);
				if (boidsInfo) boidsInfo.classList.toggle("is-hidden", !vis);
				if (boidsStats) boidsStats.classList.toggle("is-hidden", !vis);
			});
		}, { threshold: 0.1 });
		heroIo.observe(canvas.parentElement);
	}
})();

// =============================================================
// Boids info tooltip
// =============================================================
(function () {
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

	// Start open on page load
	show();
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
