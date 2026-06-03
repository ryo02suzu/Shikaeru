/* =====================================================================
   シカエル（Shikaeru）｜患者側アプリ モック（トリビュー寄せ版）
   - サンプルデータ（医院・ドクターは将来 管理側で追加する前提）
   - お得なメニュー / 症例 / ドクター / 検索（部位・カテゴリ・コンテンツ）
   - 詳細オーバーレイ（メニュー・症例・クリニック）/ 保存 / 予約フォーム
   ===================================================================== */
(function () {
  "use strict";

  /* ============ アイコン ============ */
  var ICON = {
    tooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 3C5 3 4 5 4.2 8c.2 3 1 5.5 1.7 9.3.4 2 2.4 2 2.8 0l.8-4.2c.2-1 1.8-1 2 0l.8 4.2c.4 2 2.4 2 2.8 0 .7-3.8 1.5-6.3 1.7-9.3C19.9 5 18.9 3 17 3c-1.6 0-2.4 1-5 1S8.6 3 7 3z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>'
  };

  /* ============ サンプルデータ ============ */
  var RISKS = {
    "ホワイトニング": ["施術中・後に歯がしみる（知覚過敏）ことがあります", "歯ぐきが一時的に白くなる・しみる場合があります", "時間とともに色が戻る（後戻り）ため定期的なメンテナンスを推奨", "被せ物・詰め物・差し歯は白くなりません"],
    "矯正": ["装着初期に痛み・違和感が出ることがあります", "ごくまれに歯根吸収が起こる場合があります", "装置を外した後は後戻りするため保定（リテーナー）が必要です", "適応外となる歯並びの場合があります"],
    "セラミック": ["健康な歯を削る必要がある場合があります", "治療中・後に知覚過敏が出ることがあります", "強い衝撃で割れる・欠けることがあります", "歯ぐきの状態により見た目が変化する場合があります"],
    "ガムピール": ["施術後に一時的なヒリつき・白い膜が生じることがあります", "体質や生活習慣により色素が再沈着する場合があります", "効果や必要回数には個人差があります"],
    "クリーニング": ["施術後に一時的な知覚過敏・歯ぐきの出血が出ることがあります", "着色や歯石の程度により複数回必要な場合があります"]
  };

  var clinics = [
    { id:"c1", name:"シロカ デンタルクリニック銀座", area:"東京都", station:"銀座駅", rating:4.8, reviews:312, img:"ph--pearl",
      tags:["土日診療","カウンセリング無料","個室"],
      menu:[["オフィスホワイトニング","¥22,000〜"],["ホームホワイトニング","¥33,000〜"],["ガムピーリング","¥11,000〜"],["セラミック（1歯）","¥99,000〜"]],
      access:"各線「銀座駅」A2出口より徒歩2分",
      reviewList:[["S.K","20代","カウンセリングが丁寧で、リスクの説明もしっかりありました。"],["M.T","30代","個室で人目が気にならず通いやすいです。"]] },
    { id:"c2", name:"アオバ ホワイトニング表参道", area:"東京都", station:"表参道駅", rating:4.7, reviews:540, img:"ph--ivory",
      tags:["ホワイトニング専門","当日予約OK","21時まで"],
      menu:[["オフィスホワイトニング","¥19,800〜"],["デュアルホワイトニング","¥49,500〜"],["ホームホワイトニング","¥33,000〜"]],
      access:"東京メトロ「表参道駅」B2出口より徒歩4分",
      reviewList:[["R.I","20代","仕事帰りに寄れる時間まで開いていて助かります。"],["Y.N","40代","しみないか不安でしたが相談しながら進められました。"]] },
    { id:"c3", name:"みなとデンタル＆矯正 横浜", area:"神奈川県", station:"みなとみらい駅", rating:4.6, reviews:221, img:"ph--mint",
      tags:["矯正認定医","分割払い可","駐車場あり"],
      menu:[["マウスピース矯正","¥330,000〜"],["ワイヤー矯正","¥440,000〜"],["矯正相談","¥0"]],
      access:"みなとみらい線「みなとみらい駅」より徒歩5分",
      reviewList:[["A.S","30代","矯正の選択肢を丁寧に比較してくれました。"],["K.M","20代","分割ができて始めやすかったです。"]] },
    { id:"c4", name:"うめだ審美歯科", area:"大阪府", station:"梅田駅", rating:4.9, reviews:410, img:"ph--coral",
      tags:["セラミック","個室","女性医師在籍"],
      menu:[["セラミック（1歯）","¥99,000〜"],["前歯セラミック","¥132,000〜"],["ホワイトニング","¥22,000〜"]],
      access:"各線「梅田駅」より徒歩6分",
      reviewList:[["N.H","30代","仕上がりの色味の相談に親身でした。"],["T.W","40代","見た目が自然で満足しています。"]] },
    { id:"c5", name:"さくら歯科クリニック 名古屋栄", area:"愛知県", station:"栄駅", rating:4.5, reviews:168, img:"ph--aqua",
      tags:["夜間診療","女性医師","クリーニング"],
      menu:[["クリーニング/PMTC","¥8,800〜"],["ホワイトニング","¥24,200〜"],["クリーニング+ホワイトニング","¥30,800〜"]],
      access:"地下鉄「栄駅」より徒歩3分",
      reviewList:[["E.K","20代","定期的に通っています。清潔感があります。"],["J.O","50代","夜も開いていて通いやすいです。"]] }
  ];

  // お得なメニュー（トリビューの主役カード）
  var menus = [
    { id:"m1", title:"オフィスホワイトニング｜短時間で白く｜知覚過敏ケア付き", badge:"初回・再来OK", price:9800, reg:22000, clinic:"c2", cat:"ホワイトニング", avail:"本日・明日・今週末 空きあり", photo:"ph--room1", limited:false },
    { id:"m2", title:"クリーニング＋ホワイトニング体験セット", badge:"初回のみ", price:6600, reg:12000, clinic:"c5", cat:"クリーニング", avail:"本日・明日 空きあり", photo:"ph--room2", limited:false },
    { id:"m3", title:"前歯セラミック｜自然な色味で1歯ずつ", badge:"初回・再来OK", price:49500, reg:99000, clinic:"c4", cat:"セラミック", avail:"今週末 空きあり", photo:"ph--room1", limited:false },
    { id:"m4", title:"ホームホワイトニング スターターキット", badge:"初回のみ", price:19800, reg:33000, clinic:"c1", cat:"ホワイトニング", avail:"本日・明日・今週末 空きあり", photo:"ph--room2", limited:false },
    { id:"m5", title:"マウスピース矯正 はじめての相談＋口腔内スキャン", badge:"初回のみ", price:0, reg:5000, clinic:"c3", cat:"矯正", avail:"今週末 空きあり", photo:"ph--room1", limited:false },
    { id:"l1", title:"【平日限定】デュアルホワイトニング 全体", badge:"初回のみ", price:39800, reg:49500, clinic:"c2", cat:"ホワイトニング", avail:"本日・明日 空きあり", photo:"ph--room2", limited:true },
    { id:"l2", title:"【水・木限定】ガムピーリング 上下", badge:"初回・再来OK", price:8800, reg:16000, clinic:"c1", cat:"ガムピール", avail:"今週末 空きあり", photo:"ph--room1", limited:true },
    { id:"l3", title:"【シカエル限定】オフィスホワイトニング 2回コース", badge:"初回のみ", price:17800, reg:40000, clinic:"c5", cat:"ホワイトニング", avail:"本日 空きあり", photo:"ph--room2", limited:true }
  ];

  // 症例（ビフォーアフター）
  var cases = [
    { id:"k1", cat:"ホワイトニング", treat:"オフィスホワイトニング", shade:"A3.5 → A1", priceFrom:22000, clinic:"c2", before:"ph--ivory", after:"ph--white", duration:"約60分 / 1回" },
    { id:"k2", cat:"矯正", treat:"マウスピース矯正（すきっ歯）", shade:"前歯のすき間を改善", priceFrom:330000, clinic:"c3", before:"ph--slate", after:"ph--white", duration:"約6〜12か月" },
    { id:"k3", cat:"セラミック", treat:"セラミック（銀歯→白く・2歯）", shade:"メタル → セラミック", priceFrom:99000, clinic:"c4", before:"ph--slate", after:"ph--pearl", duration:"約2〜3回" },
    { id:"k4", cat:"ホワイトニング", treat:"ホームホワイトニング", shade:"A3 → A2", priceFrom:33000, clinic:"c1", before:"ph--ivory", after:"ph--white", duration:"約2〜4週間" },
    { id:"k5", cat:"ガムピール", treat:"ガムピーリング（歯ぐきの黒ずみ）", shade:"くすみ → ピンク", priceFrom:11000, clinic:"c1", before:"ph--coral", after:"ph--pearl", duration:"約1〜2回" },
    { id:"k6", cat:"セラミック", treat:"前歯セラミック（形と色）", shade:"形・色を改善", priceFrom:132000, clinic:"c4", before:"ph--pearl", after:"ph--white", duration:"約2〜4回" }
  ];

  var doctors = [
    { id:"d1", name:"山田 健",   clinic:"c1", spec:"審美・ホワイトニング", rating:4.9, cases:128 },
    { id:"d2", name:"佐藤 美咲", clinic:"c2", spec:"ホワイトニング",       rating:4.8, cases:96 },
    { id:"d3", name:"鈴木 怜",   clinic:"c3", spec:"矯正（マウスピース）", rating:4.7, cases:74 },
    { id:"d4", name:"田中 葵",   clinic:"c4", spec:"審美・セラミック",     rating:4.9, cases:152 },
    { id:"d5", name:"高橋 涼",   clinic:"c5", spec:"一般・クリーニング",   rating:4.6, cases:58 }
  ];

  // カテゴリ（丸アイコン・部位グリッド・ピックアップ共通）
  var CATS = [
    { key:"ホワイトニング", icon:ICON.tooth, heart:true },
    { key:"矯正",          icon:ICON.tooth, heart:true },
    { key:"セラミック",    icon:ICON.sparkle },
    { key:"ガムピール",    icon:ICON.smile },
    { key:"クリーニング",  icon:ICON.sparkle },
    { key:"インプラント",  icon:ICON.tooth },
    { key:"親知らず",      icon:ICON.tooth },
    { key:"その他",        icon:ICON.dots }
  ];

  /* ============ 状態 ============ */
  var saved = loadSaved();
  function loadSaved(){ try { return JSON.parse(localStorage.getItem("shikaeru_saved")||"[]"); } catch(e){ return []; } }
  function persist(){ try { localStorage.setItem("shikaeru_saved", JSON.stringify(saved)); } catch(e){} }
  function isSaved(id){ return saved.indexOf(id)!==-1; }
  function toggleSaved(id){
    var i = saved.indexOf(id);
    if (i===-1){ saved.push(id); toast("クリップしました"); } else { saved.splice(i,1); toast("クリップを解除しました"); }
    persist(); syncSavedUI(id);
    if (current==="saved") renderSaved();
  }

  /* ============ ユーティリティ ============ */
  var $ = function(s,r){ return (r||document).querySelector(s); };
  var clinicById = function(id){ for (var i=0;i<clinics.length;i++) if (clinics[i].id===id) return clinics[i]; };
  var menuById = function(id){ for (var i=0;i<menus.length;i++) if (menus[i].id===id) return menus[i]; };
  var caseById = function(id){ for (var i=0;i<cases.length;i++) if (cases[i].id===id) return cases[i]; };
  var yen = function(n){ return n===0 ? "無料" : "¥"+n.toLocaleString("ja-JP"); };
  function el(html){ var d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
  function fill(sel,nodes){ var b=$(sel); if(!b) return; b.innerHTML=""; nodes.forEach(function(n){ b.appendChild(n); }); }
  function heartSVG(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>'; }
  function starSVG(){ return '<svg viewBox="0 0 24 24"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6L12 16.6 6.5 19.2l1-6L3 8.9 9 8z"/></svg>'; }

  /* ============ カード ============ */
  function menuCard(m){
    var cl = clinicById(m.clinic);
    var ribbon = m.limited ? '<span class="menu-card__ribbon">シカエル限定</span>' : '';
    var reg = m.reg ? '<span class="reg">通常 ¥'+m.reg.toLocaleString("ja-JP")+'</span>' : '';
    return el(
      '<button class="menu-card" data-menu="'+m.id+'">'+
        '<div class="menu-card__img"><div class="ph '+m.photo+'"></div>'+ribbon+
          '<div class="case__save'+(isSaved(m.id)?' is-saved':'')+'" data-save="'+m.id+'" style="right:6px;bottom:6px;width:28px;height:28px;">'+heartSVG()+'</div>'+
        '</div>'+
        '<div class="menu-card__body">'+
          '<span class="menu-card__badge">'+m.badge+'</span>'+
          '<div class="menu-card__title">'+m.title+'</div>'+
          '<div class="menu-card__price"><span class="now">'+yen(m.price)+'</span><span class="tax">'+(m.price?'（税込）':'')+'</span>'+reg+'</div>'+
          '<div class="menu-card__clinic">「'+cl.station+'」'+cl.name+'</div>'+
          '<div class="menu-card__avail">'+m.avail+'</div>'+
        '</div>'+
      '</button>'
    );
  }

  function caseCard(c){
    var cl = clinicById(c.clinic);
    return el(
      '<button class="case" data-case="'+c.id+'">'+
        '<div class="case__ba">'+
          '<div class="half before"><div class="ph '+c.before+'"></div><span>Before</span></div>'+
          '<div class="half after"><div class="ph '+c.after+'"></div><span>After</span></div>'+
          '<div class="divider"></div>'+
          '<div class="case__save'+(isSaved(c.id)?' is-saved':'')+'" data-save="'+c.id+'">'+heartSVG()+'</div>'+
        '</div>'+
        '<div class="case__body">'+
          '<div class="case__treat">'+c.treat+'</div>'+
          '<div class="case__shade">'+c.shade+'</div>'+
          '<div class="case__price">'+yen(c.priceFrom)+'〜 <small>税込・自由診療</small></div>'+
          '<div class="case__meta">◎ '+cl.name+'</div>'+
        '</div>'+
      '</button>'
    );
  }

  function clinicHistoryCard(cl){
    return el(
      '<button class="clinic-card" data-clinic="'+cl.id+'">'+
        '<div class="clinic-card__img"><div class="ph '+cl.img+'"></div><div class="ph__lbl">医院イメージ（サンプル）</div></div>'+
        '<div class="clinic-card__name">'+cl.name+'</div>'+
      '</button>'
    );
  }

  function clinicRow(cl){
    var tags = cl.tags.map(function(t){ return '<span class="tag">'+t+'</span>'; }).join("");
    return el(
      '<button class="clinic" data-clinic="'+cl.id+'">'+
        '<div class="clinic__thumb"><div class="ph '+cl.img+'"></div></div>'+
        '<div class="clinic__info"><div class="clinic__name">'+cl.name+'</div>'+
          '<div class="clinic__area">'+cl.area+'・'+cl.station+' ・ <span class="rating">'+starSVG()+cl.rating+'</span></div>'+
          '<div class="clinic__tags">'+tags+'</div></div>'+
      '</button>'
    );
  }

  function doctorRow(d){
    var cl = clinicById(d.clinic);
    return el(
      '<button class="doctor" data-clinic="'+d.clinic+'">'+
        '<div class="doctor__face">'+d.name.charAt(0)+'</div>'+
        '<div class="doctor__info"><div class="doctor__name">'+d.name+' 先生</div>'+
          '<div class="doctor__spec">'+d.spec+'</div>'+
          '<div class="doctor__clinic">'+cl.name+'（'+cl.station+'）</div></div>'+
        '<span class="rating">'+starSVG()+d.rating+'</span>'+
      '</button>'
    );
  }

  /* ============ ホーム ============ */
  function renderHome(){
    fill("#homeCats", CATS.map(function(c){
      var b = el('<button class="catcircle"><span class="ring">'+c.icon+(c.heart?'<span class="heart">'+heartSVG()+'</span>':'')+'</span><small>'+c.key+'</small></button>');
      b.addEventListener("click", function(){ openResultsByCat(c.key); });
      return b;
    }));
    fill("#homeMenus", menus.filter(function(m){ return !m.limited; }).map(menuCard));
    fill("#homeLimited", menus.filter(function(m){ return m.limited; }).map(menuCard));
    fill("#homeCases", cases.map(caseCard));
    fill("#homeHistory", clinics.map(clinicHistoryCard));
    fill("#homeTags", ["#ホワイトニング","#マウスピース矯正","#セラミック","#ガムピール","#クリーニング","#親知らず"].map(function(t){
      var b = el('<button class="hashtag">'+t+'</button>');
      b.addEventListener("click", function(){ openResultsByCat(t.replace("#","").replace("マウスピース矯正","矯正")); });
      return b;
    }));
  }

  /* ============ ドクター ============ */
  function renderDoctors(kw){
    kw = (kw||"").trim();
    var list = doctors.filter(function(d){
      var cl = clinicById(d.clinic);
      return !kw || (d.name+d.spec+cl.name+cl.area).indexOf(kw)!==-1;
    });
    var box = $("#doctorList"); box.innerHTML="";
    list.forEach(function(d){ box.appendChild(doctorRow(d)); });
    if (!list.length) box.appendChild(el('<div class="empty"><div class="emo">🔍</div><p>該当するドクターがいません</p></div>'));
  }

  /* ============ 検索 ============ */
  function renderSearch(){
    fill("#pickup", ["ホワイトニング","矯正","セラミック","ガムピール","クリーニング"].map(function(k){
      var b = el('<button class="chip">'+k+'</button>');
      b.addEventListener("click", function(){ openResultsByCat(k); });
      return b;
    }));
    fill("#partsGrid", CATS.map(function(c){
      var b = el('<button class="part"><span class="ring">'+c.icon+'</span><small>'+c.key+'</small></button>');
      b.addEventListener("click", function(){ openResultsByCat(c.key); });
      return b;
    }));
    updateCondCount();
  }

  function condFilteredMenus(){
    var treat = $("#condTreat") ? $("#condTreat").value : "指定なし";
    var area = $("#condArea") ? $("#condArea").value : "すべて";
    return menus.filter(function(m){
      var cl = clinicById(m.clinic);
      var okT = treat==="指定なし" || m.cat===treat;
      var okA = area==="すべて" || cl.area===area;
      return okT && okA;
    });
  }
  function updateCondCount(){
    var n = condFilteredMenus().length;
    var elc = $("#condCount"); if (elc) elc.textContent = n;
  }

  /* ============ 結果オーバーレイ ============ */
  function openResultsByCat(cat){
    openResults(cat, menus.filter(function(m){ return m.cat===cat; }), cases.filter(function(c){ return c.cat===cat; }));
  }
  function openResults(title, ms, cs){
    var html = '<div class="detail-body">';
    html += '<p class="detail-note" style="margin-bottom:10px;">「'+title+'」の検索結果（サンプル）</p>';
    if (ms.length){ html += '<h3 style="font-size:1rem;margin:6px 0 10px;">お得なメニュー '+ms.length+'件</h3><div class="menu-grid" id="resMenus" style="padding:0;"></div>'; }
    if (cs.length){ html += '<h3 style="font-size:1rem;margin:18px 0 10px;">症例 '+cs.length+'件</h3><div class="grid" id="resCases" style="padding:0;"></div>'; }
    if (!ms.length && !cs.length){ html += '<div class="empty"><div class="emo">🔍</div><p>該当するメニュー・症例がありません</p></div>'; }
    html += '<p class="detail-note" style="margin-top:16px;">自由診療（保険適用外）の場合があります。効果には個人差があります。主なリスクは各ページに記載しています。</p></div>';
    showOverlay(title, html);
    var mb = $("#resMenus"); if (mb) ms.forEach(function(m){ mb.appendChild(menuCard(m)); });
    var cb = $("#resCases"); if (cb) cs.forEach(function(c){ cb.appendChild(caseCard(c)); });
  }

  /* ============ メニュー詳細 ============ */
  function openMenu(id){
    var m = menuById(id); if(!m) return;
    var cl = clinicById(m.clinic);
    var risks = (RISKS[m.cat]||[]).map(function(r){ return '<li>'+r+'</li>'; }).join("");
    var reg = m.reg ? '<span class="reg">通常 ¥'+m.reg.toLocaleString("ja-JP")+'</span>' : '';
    var html =
      '<div class="detail-hero"><div class="ph '+m.photo+'"></div>'+(m.limited?'<div class="menu-card__ribbon">シカエル限定</div>':'')+'<div class="ph__lbl">メニュー画像（サンプル）</div></div>'+
      '<div class="detail-body">'+
        '<span class="detail-badge">'+m.badge+'</span>'+
        '<div class="detail-treat">'+m.title+'</div>'+
        '<div class="detail-price"><span class="now">'+yen(m.price)+'</span><span class="tax">'+(m.price?'（税込）':'')+'</span>'+reg+'</div>'+
        '<div class="detail-avail">'+m.avail+'</div>'+
        '<div class="divline"></div>'+
        '<dl style="margin:0">'+
          '<div class="spec"><dt>施術内容</dt><dd>'+m.cat+'</dd></div>'+
          '<div class="spec"><dt>標準費用</dt><dd>'+(m.price?yen(m.price)+'（税込）':'無料')+(m.reg?' ／ 通常 ¥'+m.reg.toLocaleString("ja-JP"):'')+'</dd></div>'+
          '<div class="spec"><dt>クリニック</dt><dd><button class="more" style="color:var(--teal-deep);font-weight:700" data-clinic="'+cl.id+'">'+cl.name+'（'+cl.station+'）›</button></dd></div>'+
        '</dl>'+
        '<div class="risk"><h4>主なリスク・副作用</h4><ul>'+risks+'</ul></div>'+
        '<div class="divline"></div>'+
        '<h3 style="font-size:1rem;margin-bottom:6px;">クリニックの口コミ <small style="color:var(--ink-soft);font-weight:400;">（サンプル）</small></h3>'+
        reviewsHTML(cl)+
      '</div>'+
      ctaHTML(m.id, "このメニューを予約");
    showOverlay(m.title, html);
    bindSave(m.id);
  }

  /* ============ 症例詳細 ============ */
  function openCase(id){
    var c = caseById(id); if(!c) return;
    var cl = clinicById(c.clinic);
    var risks = (RISKS[c.cat]||[]).map(function(r){ return '<li>'+r+'</li>'; }).join("");
    var html =
      '<div class="ba-slider" id="baSlider">'+
        '<div class="layer after"><div class="ph '+c.after+'"></div><span class="lbl">After</span></div>'+
        '<div class="clip" id="baClip"><div class="layer before"><div class="ph '+c.before+'"></div><span class="lbl">Before</span></div></div>'+
        '<div class="handle" id="baHandle"><div class="grip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-4 6 4 6M15 6l4 6-4 6"/></svg></div></div>'+
      '</div>'+
      '<div class="detail-body">'+
        '<div class="detail-treat">'+c.treat+'</div>'+
        '<span class="detail-shade">'+c.shade+'</span>'+
        '<div class="detail-price"><span class="now">'+yen(c.priceFrom)+'〜</span><span class="tax">税込・自由診療（保険適用外）</span></div>'+
        '<p class="detail-note">標準的な費用の目安です。回数・口腔内の状態により変動します。効果には個人差があります。</p>'+
        '<div class="divline"></div>'+
        '<dl style="margin:0">'+
          '<div class="spec"><dt>施術内容</dt><dd>'+c.cat+'（'+c.treat+'）</dd></div>'+
          '<div class="spec"><dt>目安期間</dt><dd>'+c.duration+'</dd></div>'+
          '<div class="spec"><dt>標準費用</dt><dd>'+yen(c.priceFrom)+'〜（税込）</dd></div>'+
          '<div class="spec"><dt>クリニック</dt><dd><button class="more" style="color:var(--teal-deep);font-weight:700" data-clinic="'+cl.id+'">'+cl.name+' ›</button></dd></div>'+
        '</dl>'+
        '<div class="risk"><h4>主なリスク・副作用</h4><ul>'+risks+'</ul></div>'+
        '<div class="divline"></div>'+
        '<h3 style="font-size:1rem;margin-bottom:6px;">クリニックの口コミ <small style="color:var(--ink-soft);font-weight:400;">（サンプル）</small></h3>'+
        reviewsHTML(cl)+
      '</div>'+
      ctaHTML(c.id, "このクリニックを予約");
    showOverlay(c.treat, html);
    initBASlider();
    bindSave(c.id);
  }

  /* ============ クリニック詳細 ============ */
  function openClinic(id){
    var cl = clinicById(id); if(!cl) return;
    var tags = cl.tags.map(function(t){ return '<span class="tag">'+t+'</span>'; }).join(" ");
    var menuRows = cl.menu.map(function(x){ return '<div class="spec"><dt style="width:auto;flex:1">'+x[0]+'</dt><dd>'+x[1]+'</dd></div>'; }).join("");
    var clinicCases = cases.filter(function(c){ return c.clinic===id; });
    var clinicMenus = menus.filter(function(m){ return m.clinic===id; });
    var html =
      '<div class="detail-hero"><div class="ph '+cl.img+'"></div><div class="ph__lbl">医院イメージ（サンプル）</div></div>'+
      '<div class="detail-body">'+
        '<div class="detail-treat">'+cl.name+'</div>'+
        '<div class="case__meta" style="margin-top:6px;font-size:.82rem;"><span class="rating">'+starSVG()+cl.rating+' <small>('+cl.reviews+'件)</small></span> ・ '+cl.area+'・'+cl.station+'</div>'+
        '<div class="clinic__tags" style="margin-top:10px;">'+tags+'</div>'+
        '<div class="divline"></div>'+
        '<h3 style="font-size:1rem;margin-bottom:8px;">メニュー・料金 <small style="color:var(--ink-soft);font-weight:400;">（税込・サンプル）</small></h3>'+
        '<dl style="margin:0">'+menuRows+'</dl>'+
        '<p class="detail-note" style="margin-top:8px;">自由診療（保険適用外）の場合があります。主なリスク・副作用は各メニュー・症例ページに記載しています。効果には個人差があります。</p>'+
      '</div>'+
      (clinicMenus.length ? '<div class="section-head" style="padding-top:0;"><h2 style="font-size:1rem;">お得なメニュー</h2></div><div class="menu-grid" id="clMenus"></div>' : '')+
      (clinicCases.length ? '<div class="section-head"><h2 style="font-size:1rem;">この医院の症例</h2></div><div class="grid" id="clCases"></div>' : '')+
      '<div class="detail-body">'+
        '<div class="divline"></div>'+
        '<h3 style="font-size:1rem;margin-bottom:6px;">口コミ <small style="color:var(--ink-soft);font-weight:400;">（サンプル）</small></h3>'+
        reviewsHTML(cl)+
        '<p style="font-size:.84rem;margin:14px 0 0;color:var(--ink-soft)"><b style="color:var(--ink)">アクセス</b><br>'+cl.access+'</p>'+
      '</div>'+
      '<div class="detail-cta">'+
        '<a class="btn btn--line" href="#" data-toast="LINE予約はモックです" style="flex:1">LINEで予約</a>'+
        '<button class="btn btn--teal" data-toast="Web予約はモックです" style="flex:1">来院を予約</button>'+
      '</div>';
    showOverlay(cl.name, html);
    var mb = $("#clMenus"); if (mb) clinicMenus.forEach(function(m){ mb.appendChild(menuCard(m)); });
    var cb = $("#clCases"); if (cb) clinicCases.forEach(function(c){ cb.appendChild(caseCard(c)); });
  }

  function reviewsHTML(cl){
    return cl.reviewList.map(function(r){
      return '<div class="review"><div class="review__top"><span class="review__av">'+r[0].charAt(0)+'</span>'+
        '<span class="review__name">'+r[0]+'（'+r[1]+'）</span><span class="review__date">サンプル</span></div>'+
        '<p class="review__text">'+r[2]+'</p></div>';
    }).join("");
  }

  function ctaHTML(id, label){
    return '<div class="detail-cta">'+
      '<button class="save-lg'+(isSaved(id)?' is-saved':'')+'" id="detailSave" aria-label="クリップ">'+heartSVG()+'</button>'+
      '<button class="btn btn--teal" data-toast="予約画面はモックです" style="flex:1">'+label+'</button>'+
    '</div>';
  }
  function bindSave(id){
    var s = $("#detailSave");
    if (s) s.addEventListener("click", function(){ toggleSaved(id); s.classList.toggle("is-saved", isSaved(id)); });
  }

  /* ============ オーバーレイ制御 ============ */
  function showOverlay(title, html){
    $("#overlayTitle").textContent = title;
    $("#overlayContent").innerHTML = html;
    var ov = $("#overlay"); ov.scrollTop = 0; ov.classList.add("is-open"); ov.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(){
    var ov = $("#overlay"); ov.classList.remove("is-open"); ov.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  /* ============ Before/After スライダー ============ */
  function initBASlider(){
    var stage=$("#baSlider"), clip=$("#baClip"), handle=$("#baHandle");
    if(!stage) return;
    var dragging=false;
    function set(p){ p=Math.max(0,Math.min(100,p)); clip.style.clipPath="inset(0 "+(100-p)+"% 0 0)"; handle.style.left=p+"%"; }
    function fromX(x){ var r=stage.getBoundingClientRect(); return ((x-r.left)/r.width)*100; }
    stage.addEventListener("pointerdown", function(e){ dragging=true; stage.setPointerCapture&&stage.setPointerCapture(e.pointerId); set(fromX(e.clientX)); });
    stage.addEventListener("pointermove", function(e){ if(dragging) set(fromX(e.clientX)); });
    window.addEventListener("pointerup", function(){ dragging=false; });
    set(50);
  }

  /* ============ 保存タブ ============ */
  function renderSaved(){
    var box=$("#savedList"); box.innerHTML="";
    var sm = menus.filter(function(m){ return isSaved(m.id); });
    var sc = cases.filter(function(c){ return isSaved(c.id); });
    if (!sm.length && !sc.length){
      box.appendChild(el('<div class="empty"><div class="emo">🔖</div><p>クリップした項目はまだありません。<br>気になるメニュー・症例の♥を押すとここに集まります。</p></div>'));
      return;
    }
    if (sm.length){ box.appendChild(el('<div class="section-head"><h2 style="font-size:1rem;">お得なメニュー</h2></div>')); var mg=el('<div class="menu-grid"></div>'); sm.forEach(function(m){ mg.appendChild(menuCard(m)); }); box.appendChild(mg); }
    if (sc.length){ box.appendChild(el('<div class="section-head"><h2 style="font-size:1rem;">症例</h2></div>')); var cg=el('<div class="grid"></div>'); sc.forEach(function(c){ cg.appendChild(caseCard(c)); }); box.appendChild(cg); }
  }

  /* ============ 予約フォーム ============ */
  function setupBooking(){
    var sel=$("#bkClinic");
    sel.innerHTML='<option value="">選択してください</option>';
    clinics.forEach(function(c){ sel.appendChild(el('<option>'+c.name+'（'+c.station+'）</option>')); });
    $("#bookingForm").addEventListener("submit", function(e){ e.preventDefault(); toast("予約リクエストを受け付けました（モック）"); });
  }

  /* ============ フィルタシート（エリア） ============ */
  function openSheet(type){
    var body=$("#sheetBody");
    if (type==="area"){
      body.innerHTML='<h3>エリアを選ぶ</h3><div class="opts" id="optWrap"></div>';
      var areas=["東京都","神奈川県","大阪府","愛知県","全国"];
      var cur=$("#homeArea")?$("#homeArea").textContent:"東京都";
      areas.forEach(function(v){
        var b=el('<button class="opt'+(v===cur?' is-on':'')+'">'+v+'</button>');
        b.addEventListener("click", function(){ if($("#homeArea"))$("#homeArea").textContent=v; closeSheet(); toast(v+"で表示します（モック）"); });
        $("#optWrap").appendChild(b);
      });
    }
    $("#sheetMask").classList.add("is-open");
  }
  function closeSheet(){ $("#sheetMask").classList.remove("is-open"); }

  /* ============ ナビ ============ */
  var current="home";
  function goto(screen){
    current=screen;
    document.querySelectorAll(".screen").forEach(function(s){ s.classList.toggle("is-active", s.getAttribute("data-screen")===screen); });
    document.querySelectorAll(".tab").forEach(function(t){ t.classList.toggle("is-on", t.getAttribute("data-goto")===screen); });
    if (screen==="saved") renderSaved();
    if (screen==="doctor") renderDoctors($("#doctorSearch")?$("#doctorSearch").value:"");
    window.scrollTo(0,0);
  }
  function syncSavedUI(id){
    document.querySelectorAll('[data-save="'+id+'"]').forEach(function(b){ b.classList.toggle("is-saved", isSaved(id)); });
  }

  /* ============ トースト ============ */
  var toastTimer;
  function toast(msg){
    var t=$("#toast"); t.textContent=msg; t.classList.add("is-show");
    clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.classList.remove("is-show"); }, 1800);
  }

  /* ============ イベント委譲 ============ */
  document.addEventListener("click", function(e){
    var t=e.target;
    var save=t.closest("[data-save]"); if(save){ e.stopPropagation(); toggleSaved(save.getAttribute("data-save")); return; }
    var menuEl=t.closest("[data-menu]"); if(menuEl){ openMenu(menuEl.getAttribute("data-menu")); return; }
    var caseEl=t.closest("[data-case]"); if(caseEl){ openCase(caseEl.getAttribute("data-case")); return; }
    var clinicEl=t.closest("[data-clinic]"); if(clinicEl){ openClinic(clinicEl.getAttribute("data-clinic")); return; }
    var sheetEl=t.closest("[data-sheet]"); if(sheetEl){ openSheet(sheetEl.getAttribute("data-sheet")); return; }
    var resEl=t.closest("[data-results]"); if(resEl){ var k=resEl.getAttribute("data-results"); if(k==="menu") openResults("特別メニュー", menus, []); else if(k==="case") openResults("症例", [], cases); else toast("口コミ一覧はモックです"); return; }
    var goEl=t.closest("[data-goto]"); if(goEl){ goto(goEl.getAttribute("data-goto")); return; }
    var toastEl=t.closest("[data-toast]"); if(toastEl){ e.preventDefault(); toast(toastEl.getAttribute("data-toast")); return; }
  });

  $("#overlayBack").addEventListener("click", closeOverlay);
  $("#sheetMask").addEventListener("click", function(e){ if(e.target===this) closeSheet(); });

  // 検索：条件
  var condTreat=$("#condTreat"), condArea=$("#condArea");
  if (condTreat) condTreat.addEventListener("change", updateCondCount);
  if (condArea) condArea.addEventListener("change", updateCondCount);
  var condSearch=$("#condSearch");
  if (condSearch) condSearch.addEventListener("click", function(){
    var ms=condFilteredMenus();
    var treat=$("#condTreat").value;
    var cs = treat==="指定なし" ? cases : cases.filter(function(c){ return c.cat===treat; });
    openResults(treat==="指定なし"?"検索結果":treat, ms, cs);
  });
  var condClear=$("#condClear");
  if (condClear) condClear.addEventListener("click", function(){ if(condTreat)condTreat.value="指定なし"; if($("#condDate"))$("#condDate").value="指定なし"; updateCondCount(); });
  // 検索：キーワード
  var si=$("#searchInput");
  if (si) si.addEventListener("keydown", function(e){
    if (e.key==="Enter"){
      var kw=this.value.trim();
      var ms=menus.filter(function(m){ var cl=clinicById(m.clinic); return !kw||(m.title+m.cat+cl.name+cl.station).indexOf(kw)!==-1; });
      var cs=cases.filter(function(c){ var cl=clinicById(c.clinic); return !kw||(c.treat+c.cat+cl.name).indexOf(kw)!==-1; });
      openResults(kw||"すべて", ms, cs);
    }
  });
  // ドクター検索
  var ds=$("#doctorSearch");
  if (ds) ds.addEventListener("input", function(){ renderDoctors(this.value); });

  /* ============ 初期化 ============ */
  renderHome();
  renderDoctors("");
  renderSearch();
  setupBooking();
})();
