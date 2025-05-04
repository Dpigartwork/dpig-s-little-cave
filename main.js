// main.js

/*
  📘 JavaScript 關鍵字與常用詞解釋：
  function: 定義一個函式（功能單元），可重複執行一段程式邏輯。
  gridLayout: 代表 <main id="grid-layout"> 的 DOM 元素，是整個網格的容器。
  colLabels: 橫向欄位名稱陣列，用來定義左右的 5 個區塊。
  rowLabels: 縱向列名稱陣列，用來定義上下的 7 行（包含 "GROUND" 代表中央列）。
  customSections: 可客製化的區塊設定（背景色、圖片等），用來控制特定格子的內容。
  let: 宣告區域變數，支援重新賦值。
  const: 宣告常數，不可重新賦值。
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

window.addEventListener('load', function () {                                    /* 控制 當頁面載入完成時執行 */

  const gridLayout        = document.getElementById('grid-layout');             /* 控制 取得網格容器 */
  const colLabels         = ['L2', 'L1', 'C', 'R1', 'R2'];                      /* 控制 定義欄位標籤 */
  const rowLabels         = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5'];      /* 控制 定義列標籤 */

  const navBar            = document.getElementById('navbar');                  /* 控制 取得導覽列 */
  const navMenu           = document.getElementById('nav-menu');                /* 控制 取得導覽選單 */
  const navCollapseToggle = document.getElementById('nav-collapse-toggle');      /* 控制 取得收合按鈕 */
  const navToggle         = document.getElementById('nav-toggle');              /* 控制 取得手機選單按鈕 */
  const upArrow           = document.getElementById('up-arrow');                /* 控制 取得上箭頭 */

  const overviewButton    = document.getElementById('overview-button');         /* 控制 取得「全區塊一覽」按鈕 */
  const overviewOverlay   = document.getElementById('overview-overlay');        /* 控制 取得覆蓋層元素 */
  overviewOverlay.style.display = 'none';                                       /* 控制 初始保持覆蓋層關閉 */
  const gridContainer     = overviewOverlay.querySelector('.overview-grid');    /* 控制 取得一覽網格容器 */

  const customSections = {                                                      /* 控制 定義客製化區塊內容 */
    "C_GROUND": { tag: "watercolor", title: "靜物練習", year: "2024", medium: "水彩", media: "image", mediaSrc: "images/Happy.jpg" },
    "L1_D1":    { tag: "oil",       title: "肖像系列 #3", year: "2023", medium: "油畫", media: "image", mediaSrc: "images/sample2.jpg" },
    "R2_U1":    { tag: "sketch",    title: "速寫課堂",   year: "2022", medium: "鉛筆素描", media: "image", mediaSrc: "images/sample3.jpg" }
  };

  // 動態建立每個 section
  for (let r = 0; r < rowLabels.length; r++) {                                   /* 控制 迭代每列 */
    for (let c = 0; c < colLabels.length; c++) {                                 /* 控制 迭代每欄 */
      const area    = `${colLabels[c]}_${rowLabels[r]}`;                         /* 控制 區塊 id */
      const section = document.createElement('section');                         /* 控制 建立 section */
      section.id           = area;                                               /* 控制 設定 id */
      section.style.gridArea = area;                                             /* 控制 設定 grid-area */

      if (customSections[area]) {                                                /* 控制 若有自訂內容 */
        const setting = customSections[area];                                    /* 控制 取得設定 */
        section.dataset.tag = setting.tag;                                       /* 控制 設定 tag */

        const infoCard = document.createElement('div');                          /* 控制 建立 info-card */
        infoCard.className   = 'info-card';                                      /* 控制 設定 class */
        infoCard.innerText   = `${setting.title}\n${setting.year}｜${setting.medium}`; /* 控制 填入文字 */
        section.appendChild(infoCard);                                           /* 控制 加入 info-card */

        if (setting.media === "image") {                                         /* 控制 若為圖片 */
          const img = document.createElement('img');                             /* 控制 建立 img */
          img.src       = setting.mediaSrc;                                      /* 控制 設定來源 */
          img.alt       = setting.title;                                         /* 控制 設定 alt */
          img.addEventListener('click', () => {                                  /* 控制 圖片點擊 */
            document.getElementById('lightbox-image').src   = img.src;           /* 控制 更新燈箱圖 */
            document.getElementById('lightbox').style.display = 'flex';          /* 控制 顯示燈箱 */
            document.getElementById('lightbox-debug').innerText =               /* 控制 更新 debug */
              `燈箱狀態：開啟 (${setting.title})`;
          });
          section.appendChild(img);                                              /* 控制 加入 img */
        }
      }

      const label = document.createElement('div');                               /* 控制 建立標籤 */
      label.innerText = area;                                                    /* 控制 設定文字 */
      section.appendChild(label);                                                /* 控制 加入標籤 */

      section.addEventListener('mouseenter', () => {                              /* 控制 滑鼠進入 */
        const card = section.querySelector('.info-card');                        /* 控制 取得 card */
        if (card) {                                                              /* 控制 若存在 */
          card.style.display = 'block';                                          /* 控制 顯示 card */
          document.getElementById('info-debug').innerText =                      /* 控制 更新 debug */
            `作品資訊：${card.innerText.replace(/\n/g, " ")}`;
        }
      });
      section.addEventListener('mouseleave', () => {                              /* 控制 滑鼠離開 */
        const card = section.querySelector('.info-card');                        /* 控制 取得 card */
        if (card) card.style.display = 'none';                                   /* 控制 隱藏 card */
      });

      gridLayout.appendChild(section);                                           /* 控制 加入到 gridLayout */
    }
  }

  let currentColIndex  = 2,                                                      /* 控制 初始欄列索引 */
      currentRowIndex  = 1,
      previousColIndex = currentColIndex,
      previousRowIndex = currentRowIndex,
      isResizing       = false;                                                 /* 控制 resize 狀態 */

  /**
   * 滾動至指定位置
   * @param {number} colIndex 欄索引
   * @param {number} rowIndex 列索引
   * @param {string} [behavior='smooth'] 滾動方式
   */
  function scrollToPosition(colIndex, rowIndex, behavior = 'smooth') {           /* 控制 封裝滾動 */
    const sectionId = `${colLabels[colIndex]}_${rowLabels[rowIndex]}`;           /* 控制 組合 id */
    const section   = document.getElementById(sectionId);                        /* 控制 取得 section */
    if (section) {                                                               /* 控制 若存在 */
      section.scrollIntoView({ behavior, block: 'start', inline: 'start' });    /* 控制 執行滾動 */
      document.getElementById('previous-block').innerText =                      /* 控制 更新 debug */
        `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
      document.getElementById('current-block').innerText =                       /* 控制 更新 debug */
        `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`;
      previousColIndex = colIndex;                                               /* 控制 記錄先前 */
      previousRowIndex = rowIndex;
    }
  }

  // 初始對齊
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToPosition(currentColIndex, currentRowIndex))); /* 控制 初始滾動 */

  // 箭頭控制
  document.getElementById('left-arrow').addEventListener('click', () => {       /* 控制 左 */
    if (currentColIndex > 0) currentColIndex--;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('right-arrow').addEventListener('click', () => {      /* 控制 右 */
    if (currentColIndex < colLabels.length - 1) currentColIndex++;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('up-arrow').addEventListener('click', () => {         /* 控制 上 */
    if (currentRowIndex > 0) currentRowIndex--;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('down-arrow').addEventListener('click', () => {       /* 控制 下 */
    if (currentRowIndex < rowLabels.length - 1) currentRowIndex++;
    scrollToPosition(currentColIndex, currentRowIndex);
  });

   // 📏 menu 位置對齊
   function updateMobileMenuPosition() {                                 /* 控制 更新手機選單位置 */
    const navHeight = navBar.offsetHeight;                              /* 控制 取得高度 */
    navMenu.style.top = navHeight + 'px';                               /* 控制 設定 top */
  }
  window.addEventListener('resize', () => {                             /* 控制 視窗大小變化 */
    updateMobileMenuPosition();                                         /* 控制 重新計算選單位置 */
    const isMobile = window.innerWidth <= 768;                          /* 控制 判斷手機 */
    const isHidden = navBar.classList.contains('hidden');               /* 控制 導覽隱藏狀態 */
    navToggle.style.display = isMobile && !isHidden ? 'block' : 'none'; /* 控制 手機選單顯示 */
    requestAnimationFrame(() => {                                       /* 控制 重新滾動位置 */
      scrollToPosition(currentColIndex, currentRowIndex, 'auto');       /* 控制 直接對齊 */
    });
  });
  updateMobileMenuPosition();                                           /* 控制 首次設定選單位置 */
  window.addEventListener('orientationchange', updateMobileMenuPosition); /* 控制 方向變更時更新 */

  // 手機選單
  navToggle.addEventListener('click', () => {                                   /* 控制 手機選單 */
    navMenu.classList.toggle('open');
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${navMenu.classList.contains('open') ? '開啟' : '關閉'}`;
  });

  // 收合導覽列
  navCollapseToggle.addEventListener('click', () => {                           /* 控制 收合 */
    navBar.classList.toggle('hidden');
    const h = navBar.classList.contains('hidden');
    navCollapseToggle.innerText = h ? '⬢' : '⬡';
    if (h) {
      navMenu.classList.remove('open');
      upArrow.classList.add('nav-hidden');
    } else {
      upArrow.classList.remove('nav-hidden');
    }
    navToggle.style.display = h ? 'none' : 'block';
    const nh = navBar.offsetHeight;
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${h ? '已隱藏' : '顯示中'}\n高度：${nh}px`;
  });

  // 鍵盤控制
  window.addEventListener('keydown', e => {                                     /* 控制 鍵盤 */
    let moved = false;
    if ((e.key === 'ArrowUp' || e.key === 'w')    && currentRowIndex > 0)   { currentRowIndex--; moved = true; }
    if ((e.key === 'ArrowDown'|| e.key === 's')   && currentRowIndex < rowLabels.length - 1) { currentRowIndex++; moved = true; }
    if ((e.key === 'ArrowLeft'|| e.key === 'a')   && currentColIndex > 0)   { currentColIndex--; moved = true; }
    if ((e.key === 'ArrowRight'|| e.key === 'd')  && currentColIndex < colLabels.length - 1) { currentColIndex++; moved = true; }
    if (moved) {
      scrollToPosition(currentColIndex, currentRowIndex);
      document.getElementById('input-debug').innerText =
        `輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // 關閉 Lightbox
  document.getElementById('lightbox-close').addEventListener('click', () => {  /* 控制 關閉燈箱 */
    document.getElementById('lightbox').style.display = 'none';
    document.getElementById('lightbox-image').src = '';
    document.getElementById('lightbox-debug').innerText = '燈箱狀態：關閉';
  });

  // 篩選功能
  document.querySelectorAll('.filter-button').forEach(btn => {                 /* 控制 篩選按鈕 */
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sel = btn.dataset.tag;
      document.getElementById('filter-debug').innerText = `目前篩選：${sel}`;
      document.querySelectorAll('#grid-layout > section').forEach(sec => {
        if (sel === 'all' || sec.dataset.tag === sel) {
          sec.style.opacity = '1'; sec.style.pointerEvents = 'auto';
        } else {
          sec.style.opacity = '0.1'; sec.style.pointerEvents = 'none';
        }
      });
    });
  });

  // 手機菜單定位 + resize 鎖定並重定位
  let resizeTimeout;                                                            /* 控制 resize 防抖 */
  function updateMobileMenuPosition() {                                         /* 控制 手機選單定位 */
    const nh = navBar.offsetHeight;
    navMenu.style.top = nh + 'px';
  }
  window.addEventListener('resize', () => {                                      /* 控制 視窗大小變動 */
    isResizing = true;                                                           /* 控制 標記正在 resize */
    gridLayout.style.scrollSnapType = 'none';                                    /* 控制 暫停 snap */
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {                                           /* 控制 resize 完成 */
      gridLayout.style.scrollSnapType = 'both mandatory';                        /* 控制 恢復 snap */
      scrollToPosition(currentColIndex, currentRowIndex, 'auto');                /* 控制 重定位當前區塊 */
      isResizing = false;                                                        /* 控制 解除 resize 標記 */
    }, 200);
    updateMobileMenuPosition();                                                  /* 控制 更新選單位置 */
    const isMobile = window.innerWidth <= 768, h = navBar.classList.contains('hidden');
    navToggle.style.display = isMobile && !h ? 'block' : 'none';                 /* 控制 手機選單顯示 */
  });
  updateMobileMenuPosition();                                                    /* 控制 首次定位 */
  window.addEventListener('orientationchange', updateMobileMenuPosition);        /* 控制 方向改變 */

  // 全區塊一覽功能
  rowLabels.forEach(row => {                                                    /* 控制 一覽網格項目 */
    colLabels.forEach(col => {
      const areaId = `${col}_${row}`;
      const item   = document.createElement('div');
      item.className = 'overview-item';
      item.innerText = areaId;
      item.addEventListener('click', () => {
        overviewOverlay.style.display = 'none';
        scrollToPosition(colLabels.indexOf(col), rowLabels.indexOf(row));
      });
      gridContainer.appendChild(item);
    });
  });
  overviewButton.addEventListener('click', () => {                               /* 控制 切換一覽 */
    overviewOverlay.style.display = overviewOverlay.style.display === 'flex' ? 'none' : 'flex';
  });
  overviewOverlay.addEventListener('click', e => {                               /* 控制 點擊空白關閉 */
    if (e.target === overviewOverlay) {
      overviewOverlay.style.display = 'none';
    }
  });

});                                                                                /* 控制 load 事件結束 */
