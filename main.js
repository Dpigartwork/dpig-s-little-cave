// main.js

/*
  📘 JavaScript 關鍵字與常用詞解釋：
  function: 定義一個函式（功能單元），可重複執行一段程式邏輯。
  gridLayout: 代表 <main id="grid-layout"> 的 DOM 元素，是整個網格的容器。
  colLabels: 橫向欄位名稱陣列，用來定義左右的 5 個區塊。
  rowLabels: 縱向列名稱陣列，用來定義上下的 7 行（包含 "GROUND" 代表中央列）。
  customSections: 可客製化的區塊設定（背景色、圖片等），用來控制特定格子的內容。
  let/const: 宣告變數／常數，let 支援重新賦值，const 不可重新賦值。
  `<div>${area}</div>`: 模板字串，用於動態建立 HTML 字串，插入區塊名稱 area。
  @param: JSDoc 格式，說明函式參數的用途與類型。
  document.getElementById(): 取得 HTML 中指定 id 的元素。
  .addEventListener(): 綁定使用者事件。
  .scrollIntoView(): 滾動至特定區塊。
  setTimeout(): 延遲執行。
  .appendChild(): 新增子元素。
  .innerText/.innerHTML: 操作元素內容。
  behavior, block, inline: scrollIntoView 選項。
*/


window.addEventListener('load', function () {                                  /* 控制 當頁面載入完成時執行 */

  const gridLayout        = document.getElementById('grid-layout');           /* 控制 取得網格容器 */
  const colLabels         = ['L2', 'L1', 'C', 'R1', 'R2'];                    /* 控制 定義欄位標籤 */
  const rowLabels         = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5'];    /* 控制 定義列標籤 */

  const navBar            = document.getElementById('navbar');                /* 控制 取得導覽列 */
  const navMenu           = document.getElementById('nav-menu');              /* 控制 取得導覽選單 */
  const navCollapseToggle = document.getElementById('nav-collapse-toggle');    /* 控制 取得收合按鈕 */
  const navToggle         = document.getElementById('nav-toggle');            /* 控制 取得手機選單按鈕 */
  const upArrow           = document.getElementById('up-arrow');              /* 控制 取得上箭頭 */

  const overviewButton    = document.getElementById('overview-button');       /* 控制 取得「全區一覽」按鈕 */
  const overviewOverlay   = document.getElementById('overview-overlay');      /* 控制 取得覆蓋層元素 */
  overviewOverlay.style.display = 'none';                                     /* 控制 初始保持覆蓋層關閉 */
  const overviewGrid      = overviewOverlay.querySelector('.overview-grid');  /* 控制 取得一覽網格容器 */

  // Black transition overlay for R1_D2/R1_D3 navigation
  const transitionOverlay = document.createElement('div');                    /* 控制 建立過渡遮罩 */
  transitionOverlay.id = 'transition-overlay';                                /* 控制 設定 id */
  Object.assign(transitionOverlay.style, {                                     /* 控制 設定樣式 */
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: '#000', opacity: '0', transition: 'opacity 0.5s',
    zIndex: '30000', pointerEvents: 'none'
  });
  document.body.appendChild(transitionOverlay);                               /* 控制 加入至 body */

  const customSections = {                                                    /* 控制 定義客製化區塊內容 */
    "C_GROUND": { tag: "watercolor", title: "靜物練習", year: "2024", medium: "水彩", media: "image", mediaSrc: "images/Happy.jpg" },
    "L1_D1":    { tag: "oil",       title: "肖像系列 #3", year: "2023", medium: "油畫", media: "image", mediaSrc: "images/sample2.jpg" },
    "R2_U1":    { tag: "sketch",    title: "速寫課堂",   year: "2022", medium: "鉛筆素描", media: "image", mediaSrc: "images/sample3.jpg" }
  };

  // 建立所有 section
  for (let r = 0; r < rowLabels.length; r++) {                                 /* 控制 迭代每列 */
    for (let c = 0; c < colLabels.length; c++) {                               /* 控制 迭代每欄 */
      const area = `${colLabels[c]}_${rowLabels[r]}`;                          /* 控制 組合區塊 id */
      const section = document.createElement('section');                       /* 控制 建立 section */
      section.id = area;                                                       /* 控制 設定 id */
      section.style.gridArea = area;                                           /* 控制 指定 grid-area */

      if (customSections[area]) {                                              /* 控制 若有自訂設定 */
        const setting = customSections[area];                                  /* 控制 取得設定 */
        section.dataset.tag = setting.tag;                                     /* 控制 設定 data-tag */

        const infoCard = document.createElement('div');                        /* 控制 建立 info-card */
        infoCard.className = 'info-card';                                      /* 控制 設定 class */
        infoCard.innerText = `${setting.title}\n${setting.year}｜${setting.medium}`; /* 控制 設定文字 */
        section.appendChild(infoCard);                                         /* 控制 加入 info-card */

        if (setting.media === "image") {                                       /* 控制 若為圖片 */
          const img = document.createElement('img');                           /* 控制 建立 img */
          img.src = setting.mediaSrc;                                          /* 控制 設定來源 */
          img.alt = setting.title;                                             /* 控制 設定 alt */
          img.addEventListener('click', () => {                                /* 控制 點擊燈箱 */
            document.getElementById('lightbox-image').src = img.src;           /* 控制 更新燈箱圖 */
            document.getElementById('lightbox').style.display = 'flex';        /* 控制 顯示燈箱 */
            document.getElementById('lightbox-debug').innerText =              /* 控制 更新 debug */
              `燈箱狀態：開啟 (${setting.title})`;
          });
          section.appendChild(img);                                            /* 控制 加入 img */
        }
      }

      // Label
      const label = document.createElement('div');                             /* 控制 建立標籤 */
      label.innerText = area;                                                  /* 控制 設定文字 */
      section.appendChild(label);                                              /* 控制 加入至 section */

      // Info-card hover
      section.addEventListener('mouseenter', () => {                            /* 控制 滑鼠進入 */
        const card = section.querySelector('.info-card');                       /* 控制 找 info-card */
        if (card) {
          card.style.display = 'block';                                         /* 控制 顯示 */
          document.getElementById('info-debug').innerText =                     /* 控制 更新 debug */
            `作品資訊：${card.innerText.replace(/\n/g, " ")}`;
        }
      });
      section.addEventListener('mouseleave', () => {                            /* 控制 滑鼠離開 */
        const card = section.querySelector('.info-card');
        if (card) card.style.display = 'none';                                  /* 控制 隱藏 */
      });

      gridLayout.appendChild(section);                                          /* 控制 加入 gridLayout */
    }
  }

  let currentColIndex = 2,                                                     /* 控制 初始欄 */
      currentRowIndex = 1,                                                     /* 控制 初始列 */
      previousColIndex = currentColIndex,                                      /* 控制 上次欄 */
      previousRowIndex = currentRowIndex,                                      /* 控制 上次列 */
      isResizing = false,                                                      /* 控制 resize 狀態 */
      isLoggedIn = false;                                                      /* 控制 登入狀態 */

  /**
   * 滾動至指定格
   * @param {number} colIndex
   * @param {number} rowIndex
   * @param {string} behavior
   */
  function scrollToPosition(colIndex, rowIndex, behavior = 'smooth') {         /* 控制 定義函式 */
    const id = `${colLabels[colIndex]}_${rowLabels[rowIndex]}`;                /* 控制 區塊 id */
    const sec = document.getElementById(id);
    if (sec) {
      sec.scrollIntoView({ behavior, block: 'start', inline: 'start' });
      document.getElementById('previous-block').innerText =
        `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
      document.getElementById('current-block').innerText =
        `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`;
      previousColIndex = colIndex;
      previousRowIndex = rowIndex;
    }
  }

  // 初始對齊
  requestAnimationFrame(() => requestAnimationFrame(() =>
    scrollToPosition(currentColIndex, currentRowIndex)
  ));

  // 箭頭導航函式
  function navigate(dir) {
    let newCol = currentColIndex,
        newRow = currentRowIndex;
    if (dir === 'left' && newCol > 0) newCol--;
    if (dir === 'right' && newCol < colLabels.length - 1) newCol++;
    if (dir === 'up' && newRow > 0) newRow--;
    if (dir === 'down' && newRow < rowLabels.length - 1) newRow++;
    const targetId = `${colLabels[newCol]}_${rowLabels[newRow]}`;
    if (targetId === 'R1_D2' || targetId === 'R1_D3') {
      // Fade to black, go to R1_GROUND, fade out
      transitionOverlay.style.opacity = '1';
      setTimeout(() => {
        scrollToPosition(colLabels.indexOf('R1'), rowLabels.indexOf('GROUND'));
        transitionOverlay.style.opacity = '0';
      }, 500);
    } else {
      currentColIndex = newCol;
      currentRowIndex = newRow;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  }

  // 綁定箭頭按鈕
  ['left','right','up','down'].forEach(dir => {
    document.getElementById(`${dir}-arrow`).addEventListener('click', () => navigate(dir));
  });

  // 自動偵測中心（resize 時暫停）
  let scrollDebounce = null;
  window.addEventListener('scroll', () => {
    if (isResizing) return;
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const secs = document.querySelectorAll('#grid-layout>section');
      let closest = null, minD = Infinity;
      const cx = window.scrollX + window.innerWidth/2,
            cy = window.scrollY + window.innerHeight/2;
      secs.forEach(sec => {
        const r = sec.getBoundingClientRect(),
              scx = r.left + window.scrollX + r.width/2,
              scy = r.top  + window.scrollY + r.height/2,
              d   = Math.hypot(cx-scx, cy-scy);
        if (d < minD) { minD = d; closest = sec; }
      });
      if (closest) {
        const [col,row] = closest.id.split('_');
        if (colLabels.includes(col)) currentColIndex = colLabels.indexOf(col);
        if (rowLabels.includes(row)) currentRowIndex = rowLabels.indexOf(row);
        document.getElementById('previous-block').innerText =
          `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
        document.getElementById('current-block').innerText =
          `當前區塊: ${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`;
        setTimeout(() => {
          previousColIndex = currentColIndex;
          previousRowIndex = currentRowIndex;
        }, 0);
      }
    }, 150);
  });

  // 手機選單
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${navMenu.classList.contains('open')?'開啟':'關閉'}`;
  });

  // 收合導覽列
  navCollapseToggle.addEventListener('click', () => {
    navBar.classList.toggle('hidden');
    const h = navBar.classList.contains('hidden');
    navCollapseToggle.innerText = h?'⬢':'⬡';
    if (h) {
      navMenu.classList.remove('open');
      upArrow.classList.add('nav-hidden');
    } else {
      upArrow.classList.remove('nav-hidden');
    }
    navToggle.style.display = h?'none':'block';
    const nh = navBar.offsetHeight;
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${h?'已隱藏':'顯示中'}\n高度：${nh}px`;
  });

  // 鍵盤控制
  window.addEventListener('keydown', e => {
    if (['ArrowUp','w','ArrowDown','s','ArrowLeft','a','ArrowRight','d'].includes(e.key)) {
      e.preventDefault();
      if      (e.key==='ArrowUp'||e.key==='w')    navigate('up');
      else if (e.key==='ArrowDown'||e.key==='s')  navigate('down');
      else if (e.key==='ArrowLeft'||e.key==='a')  navigate('left');
      else if (e.key==='ArrowRight'||e.key==='d') navigate('right');
      document.getElementById('input-debug').innerText =
        `輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // Lightbox
  document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display='none';
    document.getElementById('lightbox-image').src='';
    document.getElementById('lightbox-debug').innerText='燈箱狀態：關閉';
  });

  // 篩選功能
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const sel = btn.dataset.tag;
      document.getElementById('filter-debug').innerText = `目前篩選：${sel}`;
      document.querySelectorAll('#grid-layout>section').forEach(sec=>{
        if (sel==='all'||sec.dataset.tag===sel) {
          sec.style.opacity='1'; sec.style.pointerEvents='auto';
        } else {
          sec.style.opacity='0.1'; sec.style.pointerEvents='none';
        }
      });
    });
  });

  // menu 位置 + resize
  let resizeTimeout;
  function updateMobileMenuPosition(){
    const nh = navBar.offsetHeight;
    navMenu.style.top = nh+'px';
  }
  window.addEventListener('resize',()=>{
    isResizing=true;
    gridLayout.style.scrollSnapType='none';
    clearTimeout(resizeTimeout);
    resizeTimeout=setTimeout(()=>{
      gridLayout.style.scrollSnapType='both mandatory';
      scrollToPosition(currentColIndex,currentRowIndex,'auto');
      isResizing=false;
    },200);
    updateMobileMenuPosition();
    const isMob=window.innerWidth<=768, h=navBar.classList.contains('hidden');
    navToggle.style.display=isMob&&!h?'block':'none';
  });
  updateMobileMenuPosition();
  window.addEventListener('orientationchange',updateMobileMenuPosition);

  // Overview
  rowLabels.forEach(row=>{
    colLabels.forEach(col=>{
      const id=`${col}_${row}`;
      const item=document.createElement('div');
      item.className='overview-item';
      item.innerText=id;
      item.addEventListener('click',()=>{
        overviewOverlay.style.display='none';
        scrollToPosition(colLabels.indexOf(col),rowLabels.indexOf(row));
      });
      overviewGrid.appendChild(item);
    });
  });
  overviewButton.addEventListener('click',()=>{
    overviewOverlay.style.display=overviewOverlay.style.display==='flex'?'none':'flex';
  });
  overviewOverlay.addEventListener('click',e=>{
    if(e.target===overviewOverlay) overviewOverlay.style.display='none';
  });

  // 合併 R1_D1/D2/D3 佔三列
  const r1d1 = document.getElementById('R1_D1');
  r1d1.style.gridRowStart = 3;
  r1d1.style.gridRowEnd   = 6;
  ['R1_D2','R1_D3'].forEach(id=>{
    const s = document.getElementById(id);
    if(s) s.style.display='none';
  });

  // ——— R1_D1 藝術作品總覽 Gallery ———
  r1d1.innerHTML = '';
  const header = document.createElement('div');
  header.className='gallery-header';
  header.innerText='藝術作品總覽';
  r1d1.appendChild(header);

  // 登入按鈕 + 狀態
  const loginBtn = document.createElement('button');
  loginBtn.id = 'login-button'; loginBtn.innerText = '登入';
  const loginStatus = document.createElement('span');
  loginStatus.id = 'login-status'; loginStatus.innerText = '未登入';
  r1d1.appendChild(loginBtn);
  r1d1.appendChild(loginStatus);

  // 上傳輸入
  const uploadInput = document.createElement('input');
  uploadInput.type='file'; uploadInput.id='upload-input';
  uploadInput.accept='image/*,video/*'; uploadInput.multiple=true;
  uploadInput.disabled = true;           // 預設禁用
  r1d1.appendChild(uploadInput);

  // Gallery 容器
  const gallery = document.createElement('div');
  gallery.id='gallery-container';
  r1d1.appendChild(gallery);

  // 持久化載入
  let saved = JSON.parse(localStorage.getItem('galleryData')||'[]');
  saved.forEach(item=>{
    let el = item.type==='video'?document.createElement('video'):document.createElement('img');
    if(item.type==='video') el.controls=true;
    el.src=item.data; el.alt=item.name; el.className='gallery-item';
    gallery.appendChild(el);
    bindDelete(el);
  });

  // 載入預設檔案
  const initial = ['9-1-2.png','blender piggy-test.gif','clip 練習 光影 角.jpg','deer +cloud-2-2.jpg'];
  initial.forEach(fn=>{
    const ext=fn.split('.').pop().toLowerCase();
    let el = ['mp4','webm','ogg'].includes(ext)?document.createElement('video'):document.createElement('img');
    if(el.tagName==='VIDEO') el.controls=true;
    el.src=`images/${fn}`; el.alt=fn; el.className='gallery-item';
    gallery.appendChild(el);
    bindDelete(el);
  });

  // 刪除綁定
  function bindDelete(el) {
    el.addEventListener('contextmenu', e=>{
      e.preventDefault();
      if (!confirm('是否要刪除？')) return;
      if (!confirm('你/妳確定嗎？')) return;
      const src = el.src;
      el.remove();
      saved = saved.filter(item=> item.data!==src );
      localStorage.setItem('galleryData', JSON.stringify(saved));
    });
  }

  // 上傳並永久存儲
  uploadInput.addEventListener('change', e=>{
    if (!isLoggedIn) { alert('請先登入'); return; }
    Array.from(e.target.files).forEach(file=>{
      const reader = new FileReader();
      reader.onload = ()=>{
        const dataURL = reader.result;
        const type = file.type.startsWith('video/')?'video':'image';
        let el = type==='video'?document.createElement('video'):document.createElement('img');
        if(type==='video') el.controls=true;
        el.src = dataURL; el.alt = file.name; el.className = 'gallery-item';
        gallery.appendChild(el);
        bindDelete(el);
        saved.push({ name:file.name, type, data:dataURL });
        localStorage.setItem('galleryData', JSON.stringify(saved));
      };
      reader.readAsDataURL(file);
    });
  });

  // 登入 Modal
  const loginOverlay = document.createElement('div');
  loginOverlay.id='login-overlay';
  Object.assign(loginOverlay.style, {
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    backgroundColor:'rgba(0,0,0,0.8)', display:'none',
    justifyContent:'center', alignItems:'center', zIndex:'40000'
  });
  const form = document.createElement('div');
  Object.assign(form.style, {
    background:'#fff', padding:'20px', borderRadius:'8px', display:'flex', flexDirection:'column', minWidth:'240px'
  });
  const userLabel = document.createElement('label'); userLabel.innerText='帳號：';
  const userInput = document.createElement('input'); userInput.type='text';
  const passLabel = document.createElement('label'); passLabel.innerText='密碼：';
  const passInput = document.createElement('input'); passInput.type='password';
  const confirmBtn = document.createElement('button'); confirmBtn.innerText='確認';
  form.append(userLabel,userInput,passLabel,passInput,confirmBtn);
  loginOverlay.appendChild(form);
  document.body.appendChild(loginOverlay);

  // 登入流程
  loginBtn.addEventListener('click', ()=>{
    loginOverlay.style.display = 'flex';
  });
  confirmBtn.addEventListener('click', ()=>{
    const acct = userInput.value.trim().toLowerCase();
    const pwd  = passInput.value;
    if (acct==='dpig' && pwd==='3088') {
      isLoggedIn = true;
      loginStatus.innerText = '已登入';
      uploadInput.disabled = false;
      loginOverlay.style.display = 'none';
    } else {
      alert('帳號或密碼錯誤');
    }
  });
  loginOverlay.addEventListener('click', e=>{
    if (e.target===loginOverlay) loginOverlay.style.display='none';
  });

});                                                                              /* 控制 load 結束 */
