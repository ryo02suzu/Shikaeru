/* =====================================================================
   志白歯科（仮）｜ホワイトニング自費転換ファネル v1
   - Before/After スライダー（マウス・タッチ・キーボード対応）
   - 無料診断（3問 → プラン提示）
   - スクロール演出（stagger fade）
   - スムーススクロール／仮ボタンの注意喚起
   ===================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
     1. Before / After スライダー
     ------------------------------------------------------------------- */
  function initBeforeAfter() {
    var stage = document.getElementById("baStage");
    var before = document.getElementById("baBefore");
    var handle = document.getElementById("baHandle");
    if (!stage || !before || !handle) return;

    var dragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      // before レイヤーの右側 (100 - pct)% を隠す
      before.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
      stage.setAttribute("aria-valuenow", Math.round(pct));
    }

    function pctFromClientX(clientX) {
      var rect = stage.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onMove(clientX) {
      if (!dragging) return;
      setPosition(pctFromClientX(clientX));
    }

    // Pointer Events で マウス・タッチ・ペンを一括対応
    stage.addEventListener("pointerdown", function (e) {
      dragging = true;
      stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
      setPosition(pctFromClientX(e.clientX));
    });
    stage.addEventListener("pointermove", function (e) {
      onMove(e.clientX);
    });
    window.addEventListener("pointerup", function () {
      dragging = false;
    });

    // キーボード操作
    stage.addEventListener("keydown", function (e) {
      var current = parseFloat(stage.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") {
        setPosition(current - 4);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        setPosition(current + 4);
        e.preventDefault();
      } else if (e.key === "Home") {
        setPosition(0);
        e.preventDefault();
      } else if (e.key === "End") {
        setPosition(100);
        e.preventDefault();
      }
    });

    setPosition(50);
  }

  /* -------------------------------------------------------------------
     2. 無料診断（3問 → プラン提示）
     ------------------------------------------------------------------- */
  var PLANS = {
    office: {
      name: "オフィス ホワイトニング",
      desc: "医院で行い、短期間で実感しやすいプラン。大切な予定が近い方や、まず変化を感じたい方に向いています。",
    },
    home: {
      name: "ホーム ホワイトニング",
      desc: "ご自宅で、ご自分のペースで進めるプラン。低濃度でゆるやかに、白さを長く保ちたい方に向いています。",
    },
    dual: {
      name: "デュアル ホワイトニング",
      desc: "オフィスとホームを併用するバランス型。早い実感と持続性の両方を求める方に向いています。",
    },
  };

  function recommendPlan(answers) {
    // 重み付けスコアで office / home / dual を選定
    var score = { office: 0, home: 0, dual: 0 };

    switch (answers.when) {
      case "soon": score.office += 2; score.dual += 1; break;
      case "weeks": score.dual += 2; score.office += 1; break;
      case "slow": score.home += 2; score.dual += 1; break;
    }
    switch (answers.priority) {
      case "speed": score.office += 2; score.dual += 1; break;
      case "lasting": score.home += 1; score.dual += 2; break;
      case "easy": score.home += 2; break;
    }
    // 知覚過敏が強い場合は、低濃度で進めやすいホーム寄りに微調整
    if (answers.sensitivity === "yes") {
      score.home += 1;
      score.office -= 1;
    }

    var best = "dual";
    var bestScore = -Infinity;
    ["office", "dual", "home"].forEach(function (key) {
      if (score[key] > bestScore) {
        bestScore = score[key];
        best = key;
      }
    });
    return best;
  }

  function sensitivityNote(level) {
    if (level === "yes") {
      return "歯がしみやすいとのこと。薬剤の濃度や進め方を調整し、知覚過敏に配慮してご提案します。";
    }
    if (level === "some") {
      return "ときどきしみるとのこと。様子を見ながら、無理のないペースで進めます。";
    }
    return "";
  }

  function initQuiz() {
    var form = document.getElementById("quizForm");
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll(".quiz__step"));
    var bar = document.getElementById("quizBar");
    var backBtn = document.getElementById("quizBack");
    var resultBox = document.getElementById("quizResult");
    var resultPlan = document.getElementById("resultPlan");
    var resultDesc = document.getElementById("resultDesc");
    var resultSens = document.getElementById("resultSensitivity");
    var restartBtn = document.getElementById("quizRestart");

    var current = 0;
    var answers = { when: null, sensitivity: null, priority: null };

    function showStep(i) {
      steps.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === i);
      });
      bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      backBtn.hidden = i === 0;
      current = i;
    }

    function showResult() {
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      form.hidden = true;
      backBtn.hidden = true;
      bar.style.width = "100%";

      var key = recommendPlan(answers);
      var plan = PLANS[key];
      resultPlan.textContent = plan.name;
      resultDesc.textContent = plan.desc;

      var note = sensitivityNote(answers.sensitivity);
      if (note) {
        resultSens.textContent = note;
        resultSens.hidden = false;
      } else {
        resultSens.hidden = true;
      }

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // 選択肢クリック
    form.addEventListener("click", function (e) {
      var opt = e.target.closest(".opt");
      if (!opt) return;

      var q = opt.getAttribute("data-q");
      var value = opt.getAttribute("data-value");
      answers[q] = value;

      // 同じ質問内の選択状態を更新
      var group = opt.closest(".quiz__options");
      group.querySelectorAll(".opt").forEach(function (o) {
        o.classList.toggle("is-selected", o === opt);
      });

      // 少し余韻を残して次へ
      window.setTimeout(function () {
        if (current < steps.length - 1) {
          showStep(current + 1);
        } else {
          showResult();
        }
      }, 260);
    });

    backBtn.addEventListener("click", function () {
      if (current > 0) showStep(current - 1);
    });

    restartBtn.addEventListener("click", function () {
      answers = { when: null, sensitivity: null, priority: null };
      form.querySelectorAll(".opt.is-selected").forEach(function (o) {
        o.classList.remove("is-selected");
      });
      resultBox.hidden = true;
      form.hidden = false;
      showStep(0);
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    showStep(0);
  }

  /* -------------------------------------------------------------------
     3. スクロール演出（stagger fade）
     ------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        // 同時に見える要素を順番に出すための簡易 stagger
        var delay = 0;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.style.transitionDelay = delay + "ms";
            el.classList.add("is-visible");
            delay += 90;
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------------------
     4. スムーススクロール（data-scroll）
     ------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('[data-scroll]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id.charAt(0) !== "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* -------------------------------------------------------------------
     5. 仮ボタン（LINE/Web 予約）の注意喚起
        実URL差し替え前に押された場合のフォールバック
     ------------------------------------------------------------------- */
  function initPlaceholders() {
    document.querySelectorAll("[data-placeholder]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var href = el.getAttribute("href");
        if (!href || href === "#") {
          e.preventDefault();
          var label = el.getAttribute("data-placeholder");
          window.alert(
            label + "予約のリンクは仮置きです。\n実際の予約先URLに差し替えてご利用ください。"
          );
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     6. フッターの年号
     ------------------------------------------------------------------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initBeforeAfter();
    initQuiz();
    initReveal();
    initSmoothScroll();
    initPlaceholders();
    initYear();
  });
})();
