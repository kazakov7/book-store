$(".nav-logout").on("click", function (e) {
  e.preventDefault(); // avtomatik o'tishni to'xtatadi

  const isConfirmed = confirm("Do you really want to log out of the system?");

  if (isConfirmed) {
    window.location.href = $(this).attr("href");
  }
});

$(function () {
  "use strict";

  var $stage = $("#insightsStage");
  var $stageInner = $("#stageInner");
  var $particlesEl = $("#particles");
  var $miniChart = $("#miniChart");

  if ($stage.length === 0) return;

  /* ---- 1. scatter soft floating particles ---------------------- */
  function createParticles(count) {
    var frag = $(document.createDocumentFragment());
    for (var i = 0; i < count; i++) {
      var $p = $("<span>")
        .addClass("particle")
        .css({
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          animationDuration: 7 + Math.random() * 6 + "s",
          animationDelay: Math.random() * 5 + "s",
        });
      frag.append($p);
    }
    $particlesEl.append(frag);
  }
  createParticles(14);

  /* ---- 2. build the decorative mini bar chart -------------------- */
  function createBars(count) {
    var frag = $(document.createDocumentFragment());
    for (var i = 0; i < count; i++) {
      var height = 14 + Math.random() * 32; // px
      var $bar = $("<span>")
        .addClass("bar")
        .css({
          height: height + "px",
          animationDelay: i * 0.18 + "s",
        });
      frag.append($bar);
    }
    $miniChart.append(frag);
  }
  createBars(10);

  /* ---- 3. subtle hover tilt (mouse-driven, capped + eased) ------- */
  var maxTilt = 4; // degrees, kept intentionally small/premium
  var rafId = null;
  var targetX = 0,
    targetY = 0,
    currentX = 0,
    currentY = 0;

  function onMove(e) {
    var rect = $stage[0].getBoundingClientRect();
    var relX = (e.clientX - rect.left) / rect.width - 0.5;
    var relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetY = relX * maxTilt * 2; // rotateY follows horizontal position
    targetX = -relY * maxTilt * 2; // rotateX follows vertical position
    if (!rafId) rafId = requestAnimationFrame(applyTilt);
  }

  function applyTilt() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    $stageInner.css(
      "transform",
      "rotateX(" +
        currentX.toFixed(2) +
        "deg) rotateY(" +
        currentY.toFixed(2) +
        "deg)",
    );
    if (
      Math.abs(targetX - currentX) > 0.02 ||
      Math.abs(targetY - currentY) > 0.02
    ) {
      rafId = requestAnimationFrame(applyTilt);
    } else {
      rafId = null;
    }
  }

  function reset() {
    targetX = 0;
    targetY = 0;
    if (!rafId) rafId = requestAnimationFrame(applyTilt);
  }

  $stage.on("mousemove", onMove);
  $stage.on("mouseleave", reset);
});
