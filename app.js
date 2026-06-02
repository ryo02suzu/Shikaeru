/* =====================================================================
   シカエル（Shikaeru）｜患者側アプリ モック
   - サンプルデータ（医院は将来 管理側で追加する前提）
   - タブ切替 / 症例・クリニック描画 / 検索フィルタ / 詳細オーバーレイ
   - Before/After スライダー / 保存（お気に入り）/ 予約フォーム（モック）
   ===================================================================== */
(function () {
  "use strict";

  /* ============ サンプルデータ ============ */
  // リスク（限定解除：主なリスク・副作用）を施術カテゴリごとに用意
  var RISKS = {
    "ホワイトニング": ["施術中・後に歯がしみる（知覚過敏）ことがあります", "歯ぐきが一時的に白くなる・しみる場合があります", "時間とともに色が戻る（後戻り）ため定期的なメンテナンスを推奨", "被せ物・詰め物・差し歯は白くなりません"],
    "矯正": ["装着初期に痛み・違和感が出ることがあります", "ごくまれに歯根吸収が起こる場合があります", "装置を外した後は後戻りするため保定（リテーナー）が必要です", "適応外となる歯並びの場合があります"],
    "セラミック": ["健康な歯を削る必要がある場合があります", "治療中・後に知覚過敏が出ることがあります", "強い衝撃で割れる・欠けることがあります", "歯ぐきの状態により見た目が変化する場合があります"],
    "ガムピール": ["施術後に一時的なヒリつき・白い膜が生じることがあります", "体質や生活習慣により色素が再沈着する場合があります", "効果や必要回数には個人差があります"],
    "クリーニング": ["施術後に一時的な知覚過敏・歯ぐきの出血が出ることがあります", "着色や歯石の程度により複数回必要な場合があります"]
  };

  var clinics = [
    { id:"c1", name:"シロカ デンタルクリニック銀座", area:"東京・銀座", rating:4.8, reviews:312, img:"ph--pearl",
      tags:["土日診療","カウンセリング無料","個室"],
      menu:[["オフィスホワイトニング","¥22,000〜"],["ホームホワイトニング","¥33,000〜"],["ガムピーリング","¥11,000〜"],["セラミック（1歯）","¥99,000〜"]],
      access:"各線「銀座駅」A2出口より徒歩2分",
      reviewList:[["S.K","20代","カウンセリングが丁寧で、リスクの説明もしっかりありました。"],["M.T","30代","個室で人目が気にならず通いやすいです。"]] },
    { id:"c2", name:"アオバ ホワイトニング表参道", area:"東京・表参道", rating:4.7, reviews:540, img:"ph--ivory",
      tags:["ホワイトニング専門","当日予約OK","21時まで"],
      menu:[["オフィスホワイトニング","¥19,800〜"],["デュアルホワイトニング","¥49,500〜"],["ホームホワイトニング","¥33,000〜"]],
      access:"東京メトロ「表参道駅」B2出口より徒歩4分",
      reviewList:[["R.I","20代","仕事帰りに寄れる時間まで開いていて助かります。"],["Y.N","40代","しみないか不安でしたが相談しながら進められました。"]] },
    { id:"c3", name:"みなとデンタル＆矯正 横浜", area:"神奈川・みなとみらい", rating:4.6, reviews:221, img:"ph--mint",
      tags:["矯正認定医","分割払い可","駐車場あり"],
      menu:[["マウスピース矯正","¥330,000〜"],["ワイヤー矯正","¥440,000〜"],["矯正相談","¥0"]],
      access:"みなとみらい線「みなとみらい駅」より徒歩5分",
      reviewList:[["A.S","30代","矯正の選択肢を丁寧に比較してくれました。"],["K.M","20代","分割ができて始めやすかったです。"]] },
    { id:"c4", name:"うめだ審美歯科", area:"大阪・梅田", rating:4.9, reviews:410, img:"ph--coral",
      tags:["セラミック","個室","女性医師在籍"],
      menu:[["セラミック（1歯）","¥99,000〜"],["前歯セラミック","¥132,000〜"],["ホワイトニング","¥22,000〜"]],
      access:"各線「梅田駅」より徒歩6分",
      reviewList:[["N.H","30代","仕上がりの色味の相談に親身でした。"],["T.W","40代","見た目が自然で満足しています。"]] },
    { id:"c5", name:"さくら歯科クリニック 名古屋栄", area:"愛知・栄", rating:4.5, reviews:168, img:"ph--aqua",
      tags:["夜間診療","女性医師","クリーニング"],
      menu:[["クリーニング/PMTC","¥8,800〜"],["ホワイトニング","¥24,200〜"],["クリーニング+ホワイトニング","¥30,800〜"]],
      access:"地下鉄「栄駅」より徒歩3分",
      reviewList:[["E.K","20代","定期的に通っています。清潔感があります。"],["J.O","50代","夜も開いていて通いやすいです。"]] }
  ];

  // 症例：before/after の色トーンで見た目を表現（写真は将来差し替え）
  var cases = [
    { id:"k1", cat:"ホワイトニング", treat:"オフィスホワイトニング", shade:"A3.5 → A1", priceFrom:22000, clinic:"c2", saves:1240, before:"ph--ivory", after:"ph--white", duration:"約60分 / 1回" },
    { id:"k2", cat:"矯正", treat:"マウスピース矯正（すきっ歯）", shade:"前歯のすき間を改善", priceFrom:330000, clinic:"c3", saves:980, before:"ph--slate", after:"ph--white", duration:"約6〜12か月" },
    { id:"k3", cat:"セラミック", treat:"セラミック（銀歯→白く・2歯）", shade:"メタル → セラミック", priceFrom:99000, clinic:"c4", saves:760, before:"ph--slate", after:"ph--pearl", duration:"約2〜3回" },
    { id:"k4", cat:"ホワイトニング", treat:"ホームホワイトニング", shade:"A3 → A2", priceFrom:33000, clinic:"c1", saves:540, before:"ph--ivory", after:"ph--white", duration:"約2〜4週間" },
    { id:"k5", cat:"ガムピール", treat:"ガムピーリング（歯ぐきの黒ずみ）", shade:"くすみ → ピンク", priceFrom:11000, clinic:"c1", saves:410, before:"ph--coral", after:"ph--pearl", duration:"約1〜2回" },
    { id:"k6", cat:"ホワイトニング", treat:"デュアルホワイトニング", shade:"A4 → A1", priceFrom:49500, clinic:"c2", saves:690, before:"ph--ivory", after:"ph--white", duration:"院内+自宅 約3週間" },
    { id:"k7", cat:"セラミック", treat:"前歯セラミック（形と色）", shade:"形・色を改善", priceFrom:132000, clinic:"c4", saves:850, before:"ph--pearl", after:"ph--white", duration:"約2〜4回" },
    { id:"k8", cat:"クリーニング", treat:"クリーニング / PMTC", shade:"着色 → すっきり", priceFrom:8800, clinic:"c5", saves:220, before:"ph--aqua", after:"ph--white", duration:"約45分" }
  ];

  var CATEGORIES = ["すべて","ホワイトニング","矯正","セラミック","ガムピール","クリーニング"];
  var GOALS = [
    ["歯を白くしたい","ホワイトニング"],
    ["歯並びを整えたい","矯正"],
    ["銀歯を白くしたい","セラミック"],
    ["歯ぐきの色が気になる","ガムピール"]
  ];

  /* ============ 状態 ============ */
  var saved = loadSaved();          // 保存した症例ID
  var searchMode = "case";          // case | clinic
  var activeCat = "すべて";
  var keyword = "";

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem("shikaeru_saved") || "[]"); }
    catch (e) { return []; }
  }
  function persistSaved() {
    try { localStorage.setItem("shikaeru_saved", JSON.stringify(saved)); } catch (e) {}
  }
  function isSaved(id) { return saved.indexOf(id) !== -1; }
  function toggleSaved(id) {
    var i = saved.indexOf(id);
    if (i === -1) { saved.push(id); toast("保存しました"); }
    else { saved.splice(i, 1); toast("保存を解除しました"); }
    persistSaved();
    syncSavedUI(id);
    if (current === "saved") renderSaved();
  }

  /* ============ ユーティリティ ============ */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var clinicById = function (id) { for (var i=0;i<clinics.length;i++) if (clinics[i].id===id) return clinics[i]; };
  var yen = function (n) { return "¥" + n.toLocaleString("ja-JP"); };

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }

  function heartSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  }
  function starSVG() { return '<svg viewBox="0 0 24 24"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6L12 16.6 6.5 19.2l1-6L3 8.9 9 8z"/></svg>'; }

  /* ============ カード生成 ============ */
  function caseCard(c) {
    var cl = clinicById(c.clinic);
    var node = el(
      '<button class="case" data-case="' + c.id + '">' +
        '<div class="case__ba">' +
          '<div class="half before"><div class="ph ' + c.before + '"></div><span>Before</span></div>' +
          '<div class="half after"><div class="ph ' + c.after + '"></div><span>After</span></div>' +
          '<div class="divider"></div>' +
          '<div class="case__save' + (isSaved(c.id) ? " is-saved" : "") + '" data-save="' + c.id + '">' + heartSVG() + '</div>' +
        '</div>' +
        '<div class="case__body">' +
          '<div class="case__treat">' + c.treat + '</div>' +
          '<div class="case__shade">' + c.shade + '</div>' +
          '<div class="case__price">' + yen(c.priceFrom) + '〜 <small>税込・自由診療</small></div>' +
          '<div class="case__meta"><span class="tagpin">◎</span>' + cl.name + '・' + cl.area + '</div>' +
        '</div>' +
      '</button>'
    );
    return node;
  }

  function clinicRowCard(cl) { // 横スクロール用
    return el(
      '<button class="clinic-card" data-clinic="' + cl.id + '">' +
        '<div class="clinic-card__img"><div class="ph ' + cl.img + '"></div><div class="ph__lbl">医院イメージ（サンプル）</div></div>' +
        '<div class="clinic-card__body">' +
          '<div class="case__treat">' + cl.name + '</div>' +
          '<div class="clinic__area">' + cl.area + '</div>' +
          '<div class="case__meta"><span class="rating">' + starSVG() + cl.rating + ' <small>(' + cl.reviews + ')</small></span></div>' +
        '</div>' +
      '</button>'
    );
  }

  function clinicRow(cl) { // 縦リスト用
    var tags = cl.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("");
    return el(
      '<button class="clinic" data-clinic="' + cl.id + '">' +
        '<div class="clinic__thumb"><div class="ph ' + cl.img + '"></div></div>' +
        '<div class="clinic__info">' +
          '<div class="clinic__name">' + cl.name + '</div>' +
          '<div class="clinic__area">' + cl.area + ' ・ <span class="rating">' + starSVG() + cl.rating + '</span> <small style="color:var(--ink-soft)">(' + cl.reviews + ')</small></div>' +
          '<div class="clinic__tags">' + tags + '</div>' +
        '</div>' +
      '</button>'
    );
  }

  /* ============ ホーム描画 ============ */
  function renderHome() {
    // カテゴリチップ
    var cats = $("#homeCats"); cats.innerHTML = "";
    CATEGORIES.forEach(function (c, i) {
      var b = el('<button class="chip' + (i===0?" is-on":"") + '">' + c + '</button>');
      b.addEventListener("click", function () {
        activeCat = c; searchMode = "case"; keyword = "";
        goto("search"); syncSearchUI();
      });
      cats.appendChild(b);
    });
    // 目的タイル
    var goals = $("#homeGoals"); goals.innerHTML = "";
    GOALS.forEach(function (g) {
      var b = el('<button class="goal">' + g[0] + '<small>' + g[1] + 'の症例を見る</small></button>');
      b.addEventListener("click", function () { activeCat = g[1]; goto("search"); syncSearchUI(); });
      goals.appendChild(b);
    });
    // 人気の症例（保存数順）
    var popular = cases.slice().sort(function (a, b) { return b.saves - a.saves; });
    fill("#homeCases", popular.slice(0, 6).map(caseCard));
    // 注目クリニック（評価順）
    var topClinics = clinics.slice().sort(function (a, b) { return b.rating - a.rating; });
    fill("#homeClinics", topClinics.map(clinicRowCard));
    // 新着（末尾から）
    fill("#homeNew", cases.slice().reverse().slice(0, 4).map(caseCard));
  }

  function fill(sel, nodes) {
    var box = $(sel); box.innerHTML = "";
    nodes.forEach(function (n) { box.appendChild(n); });
  }

  /* ============ さがす描画 ============ */
  function renderSearchFilters() {
    var bar = $("#searchFilters"); bar.innerHTML = "";
    var defs = [["カテゴリ", "cat"], ["エリア", "area"], ["価格", "price"], ["並び替え", "sort"]];
    defs.forEach(function (d) {
      var on = (d[1] === "cat" && activeCat !== "すべて");
      var b = el('<button class="filterbtn' + (on?" is-on":"") + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M7 12h10M10 18h4"/></svg>' +
        (d[1]==="cat" && activeCat!=="すべて" ? activeCat : d[0]) + '</button>');
      b.addEventListener("click", function () { openSheet(d[1]); });
      bar.appendChild(b);
    });
  }

  function renderSearchResults() {
    var box = $("#searchResults"); box.innerHTML = "";
    var kw = keyword.trim();
    if (searchMode === "case") {
      var list = cases.filter(function (c) {
        var cl = clinicById(c.clinic);
        var okCat = activeCat === "すべて" || c.cat === activeCat;
        var okKw = !kw || (c.treat + cl.name + cl.area + c.cat).indexOf(kw) !== -1;
        return okCat && okKw;
      });
      $("#searchCount").textContent = list.length + " 件の症例";
      var grid = el('<div class="grid"></div>');
      list.forEach(function (c) { grid.appendChild(caseCard(c)); });
      box.appendChild(grid);
      if (!list.length) box.appendChild(emptyState("該当する症例がありません"));
    } else {
      var cl2 = clinics.filter(function (c) {
        var okKw = !kw || (c.name + c.area + c.tags.join("")).indexOf(kw) !== -1;
        return okKw;
      });
      $("#searchCount").textContent = cl2.length + " 件のクリニック";
      cl2.forEach(function (c) { box.appendChild(clinicRow(c)); });
      if (!cl2.length) box.appendChild(emptyState("該当するクリニックがありません"));
    }
  }

  function emptyState(msg) {
    return el('<div class="empty"><div class="emo">🔍</div><p>' + msg + '</p></div>');
  }

  function syncSearchUI() {
    // トグル
    document.querySelectorAll(".toggle button").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-mode") === searchMode);
    });
    renderSearchFilters();
    renderSearchResults();
  }

  /* ============ フィルタシート ============ */
  function openSheet(type) {
    var body = $("#sheetBody");
    if (type === "cat") {
      body.innerHTML = '<h3>カテゴリ</h3><div class="opts" id="optWrap"></div>';
      buildOpts(CATEGORIES, activeCat, function (v) { activeCat = v; closeSheet(); syncSearchUI(); });
    } else if (type === "area") {
      var areas = ["すべて","東京","神奈川","大阪","愛知"];
      body.innerHTML = '<h3>エリア</h3><div class="opts" id="optWrap"></div>';
      buildOpts(areas, "すべて", function (v) {
        keyword = (v === "すべて") ? "" : v; $("#searchInput").value = keyword; closeSheet(); renderSearchResults();
      });
    } else if (type === "price") {
      body.innerHTML = '<h3>価格帯（モック）</h3><div class="opts" id="optWrap"></div>';
      buildOpts(["指定なし","〜2万円","〜5万円","〜10万円","10万円〜"], "指定なし", function () { closeSheet(); toast("価格フィルタはモックです"); });
    } else {
      body.innerHTML = '<h3>並び替え</h3><div class="opts" id="optWrap"></div>';
      buildOpts(["人気順","新着順","価格が安い順","価格が高い順"], "人気順", function (v) {
        if (v === "価格が安い順") cases.sort(function(a,b){return a.priceFrom-b.priceFrom;});
        else if (v === "価格が高い順") cases.sort(function(a,b){return b.priceFrom-a.priceFrom;});
        else if (v === "人気順") cases.sort(function(a,b){return b.saves-a.saves;});
        closeSheet(); renderSearchResults();
      });
    }
    $("#sheetMask").classList.add("is-open");
  }
  function buildOpts(arr, cur, onPick) {
    var wrap = $("#optWrap");
    arr.forEach(function (v) {
      var b = el('<button class="opt' + (v===cur?" is-on":"") + '">' + v + '</button>');
      b.addEventListener("click", function () { onPick(v); });
      wrap.appendChild(b);
    });
  }
  function closeSheet() { $("#sheetMask").classList.remove("is-open"); }

  /* ============ 保存タブ ============ */
  function renderSaved() {
    var box = $("#savedList"); box.innerHTML = "";
    var list = cases.filter(function (c) { return isSaved(c.id); });
    if (!list.length) {
      box.appendChild(el('<div class="empty"><div class="emo">🤍</div><p>保存した症例はまだありません。<br>気になる症例の♥を押すとここに集まります。</p></div>'));
      return;
    }
    var grid = el('<div class="grid"></div>');
    list.forEach(function (c) { grid.appendChild(caseCard(c)); });
    box.appendChild(grid);
  }

  /* ============ 予約フォーム ============ */
  function setupBooking() {
    var sel = $("#bkClinic");
    sel.innerHTML = '<option value="">選択してください</option>';
    clinics.forEach(function (c) { sel.appendChild(el('<option>' + c.name + '（' + c.area + '）</option>')); });
    $("#bookingForm").addEventListener("submit", function (e) {
      e.preventDefault();
      toast("予約リクエストを受け付けました（モック）");
    });
  }

  /* ============ 詳細オーバーレイ ============ */
  function openCase(id) {
    var c = null; for (var i=0;i<cases.length;i++) if (cases[i].id===id) c = cases[i];
    if (!c) return;
    var cl = clinicById(c.clinic);
    var risks = (RISKS[c.cat] || []).map(function (r) { return '<li>' + r + '</li>'; }).join("");
    var content =
      '<div class="ba-slider" id="baSlider">' +
        '<div class="layer after"><div class="ph ' + c.after + '"></div><span class="lbl">After</span></div>' +
        '<div class="clip" id="baClip"><div class="layer before"><div class="ph ' + c.before + '"></div><span class="lbl">Before</span></div></div>' +
        '<div class="handle" id="baHandle"><div class="grip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-4 6 4 6M15 6l4 6-4 6"/></svg></div></div>' +
      '</div>' +
      '<div class="detail-body">' +
        '<div class="detail-treat">' + c.treat + '</div>' +
        '<span class="detail-shade">' + c.shade + '</span>' +
        '<div class="detail-price">' + yen(c.priceFrom) + '〜 <small>税込・自由診療（保険適用外）</small></div>' +
        '<p class="detail-note">標準的な費用の目安です。回数・口腔内の状態により変動します。効果には個人差があります。</p>' +
        '<div class="divline"></div>' +
        '<dl style="margin:0">' +
          '<div class="spec"><dt>施術内容</dt><dd>' + c.cat + '（' + c.treat + '）</dd></div>' +
          '<div class="spec"><dt>目安期間</dt><dd>' + c.duration + '</dd></div>' +
          '<div class="spec"><dt>標準費用</dt><dd>' + yen(c.priceFrom) + '〜（税込）</dd></div>' +
          '<div class="spec"><dt>クリニック</dt><dd><button class="more" style="color:var(--pink);font-weight:700" data-clinic="' + cl.id + '">' + cl.name + ' ›</button></dd></div>' +
        '</dl>' +
        '<div class="risk"><h4>主なリスク・副作用</h4><ul>' + risks + '</ul></div>' +
        '<div class="divline"></div>' +
        '<h3 style="font-size:1rem;margin-bottom:6px;">このクリニックの口コミ <small style="color:var(--ink-soft);font-weight:400;">（サンプル）</small></h3>' +
        reviewsHTML(cl) +
      '</div>' +
      detailCTA(c.id);
    showOverlay(c.treat, content);
    initBASlider();
    bindDetailCTA(c.id);
  }

  function openClinic(id) {
    var cl = clinicById(id); if (!cl) return;
    var tags = cl.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(" ");
    var menu = cl.menu.map(function (m) { return '<div class="spec"><dt style="width:auto;flex:1">' + m[0] + '</dt><dd>' + m[1] + '</dd></div>'; }).join("");
    var clinicCases = cases.filter(function (c) { return c.clinic === id; });
    var content =
      '<div style="position:relative;aspect-ratio:16/9"><div class="ph ' + cl.img + '"></div><div class="ph__lbl">医院イメージ（サンプル）</div></div>' +
      '<div class="detail-body">' +
        '<div class="detail-treat">' + cl.name + '</div>' +
        '<div class="case__meta" style="margin-top:6px;font-size:.82rem;"><span class="rating">' + starSVG() + cl.rating + ' <small>(' + cl.reviews + '件)</small></span> ・ ' + cl.area + '</div>' +
        '<div class="clinic__tags" style="margin-top:10px;">' + tags + '</div>' +
        '<div class="divline"></div>' +
        '<h3 style="font-size:1rem;margin-bottom:8px;">メニュー・料金 <small style="color:var(--ink-soft);font-weight:400;">（税込・サンプル）</small></h3>' +
        '<dl style="margin:0">' + menu + '</dl>' +
        '<p class="detail-note" style="margin-top:8px;">自由診療（保険適用外）の場合があります。主なリスク・副作用は各施術ページに記載しています。効果には個人差があります。</p>' +
        '<div class="divline"></div>' +
        '<h3 style="font-size:1rem;margin-bottom:8px;">この医院の症例</h3>' +
      '</div>' +
      '<div class="grid" id="clinicCases"></div>' +
      '<div class="detail-body" style="padding-top:0">' +
        '<div class="divline"></div>' +
        '<h3 style="font-size:1rem;margin-bottom:6px;">口コミ <small style="color:var(--ink-soft);font-weight:400;">（サンプル）</small></h3>' +
        reviewsHTML(cl) +
        '<div class="spec" style="border:0;margin-top:8px;"><dt style="width:auto">アクセス</dt></div>' +
        '<p style="font-size:.84rem;margin:0;color:var(--ink-soft)">' + cl.access + '</p>' +
      '</div>' +
      '<div class="detail-cta">' +
        '<a class="btn btn--line" href="#" data-toast="LINE予約はモックです" style="flex:1">LINEで予約</a>' +
        '<button class="btn btn--pink" data-toast="Web予約はモックです" style="flex:1">来院を予約</button>' +
      '</div>';
    showOverlay(cl.name, content);
    var box = $("#clinicCases");
    clinicCases.forEach(function (c) { box.appendChild(caseCard(c)); });
  }

  function reviewsHTML(cl) {
    return cl.reviewList.map(function (r) {
      return '<div class="review"><div class="review__top"><span class="review__av">' + r[0].charAt(0) + '</span>' +
        '<span class="review__name">' + r[0] + '（' + r[1] + '）</span><span class="review__date">サンプル</span></div>' +
        '<p class="review__text">' + r[2] + '</p></div>';
    }).join("");
  }

  function detailCTA(id) {
    return '<div class="detail-cta">' +
      '<button class="save-lg' + (isSaved(id)?" is-saved":"") + '" id="detailSave" aria-label="保存">' + heartSVG() + '</button>' +
      '<button class="btn btn--pink" data-toast="予約画面はモックです" style="flex:1">このクリニックを予約</button>' +
    '</div>';
  }
  function bindDetailCTA(id) {
    var s = $("#detailSave");
    if (s) s.addEventListener("click", function () {
      toggleSaved(id);
      s.classList.toggle("is-saved", isSaved(id));
    });
  }

  function showOverlay(title, html) {
    $("#overlayTitle").textContent = title;
    $("#overlayContent").innerHTML = html;
    var ov = $("#overlay");
    ov.scrollTop = 0;
    ov.classList.add("is-open");
    ov.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay() {
    var ov = $("#overlay");
    ov.classList.remove("is-open");
    ov.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ============ Before/After スライダー（詳細） ============ */
  function initBASlider() {
    var stage = $("#baSlider"), clip = $("#baClip"), handle = $("#baHandle");
    if (!stage) return;
    var dragging = false;
    function set(pct) {
      pct = Math.max(0, Math.min(100, pct));
      clip.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
    }
    function fromX(x) { var r = stage.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; }
    stage.addEventListener("pointerdown", function (e) { dragging = true; stage.setPointerCapture && stage.setPointerCapture(e.pointerId); set(fromX(e.clientX)); });
    stage.addEventListener("pointermove", function (e) { if (dragging) set(fromX(e.clientX)); });
    window.addEventListener("pointerup", function () { dragging = false; });
    set(50);
  }

  /* ============ タブ・ナビ ============ */
  var current = "home";
  function goto(screen) {
    current = screen;
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.toggle("is-active", s.getAttribute("data-screen") === screen);
    });
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("is-on", t.getAttribute("data-goto") === screen);
    });
    if (screen === "saved") renderSaved();
    if (screen === "search") syncSearchUI();
    window.scrollTo(0, 0);
  }

  /* ============ 保存UIの同期 ============ */
  function syncSavedUI(id) {
    document.querySelectorAll('[data-save="' + id + '"]').forEach(function (b) {
      b.classList.toggle("is-saved", isSaved(id));
    });
  }

  /* ============ トースト ============ */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 1800);
  }

  /* ============ イベント委譲 ============ */
  document.addEventListener("click", function (e) {
    var t = e.target;

    // 保存ボタン（カード上）
    var save = t.closest("[data-save]");
    if (save) { e.stopPropagation(); toggleSaved(save.getAttribute("data-save")); return; }

    // 症例カード
    var caseEl = t.closest("[data-case]");
    if (caseEl) { openCase(caseEl.getAttribute("data-case")); return; }

    // クリニック
    var clinicEl = t.closest("[data-clinic]");
    if (clinicEl) { openClinic(clinicEl.getAttribute("data-clinic")); return; }

    // 画面遷移
    var goEl = t.closest("[data-goto]");
    if (goEl) { goto(goEl.getAttribute("data-goto")); return; }

    // トースト
    var toastEl = t.closest("[data-toast]");
    if (toastEl) { e.preventDefault(); toast(toastEl.getAttribute("data-toast")); return; }
  });

  $("#overlayBack").addEventListener("click", closeOverlay);
  $("#sheetMask").addEventListener("click", function (e) { if (e.target === this) closeSheet(); });

  // 検索トグル
  document.querySelectorAll(".toggle button").forEach(function (b) {
    b.addEventListener("click", function () { searchMode = b.getAttribute("data-mode"); syncSearchUI(); });
  });
  // 検索入力
  $("#searchInput").addEventListener("input", function () { keyword = this.value; renderSearchResults(); });

  /* ============ 初期化 ============ */
  renderHome();
  setupBooking();
})();
