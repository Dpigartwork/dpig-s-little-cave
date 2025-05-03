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
  `<div>\${area}</div>`: 模板字串，用於動態建立 HTML 字串，插入區塊名稱 area。
  @param: JSDoc 格式，說明函式參數的用途與類型。
  document.getElementById(): 取得 HTML 中指定 id 的元素。
  .addEventListener(): 綁定使用者事件。
  .scrollIntoView(): 滾動至特定區塊。
  setTimeout(): 延遲執行。
  .appendChild(): 新增子元素。
  .innerText/.innerHTML: 操作元素內容。
  behavior, block, inline: scrollIntoView 選項。
 */

window.addEventListener('load', function () {                       /* 控制 當頁面載入完成時執行 */
  const gridLayout = document.getElementById('grid-layout');        /* 控制 取得網格容器 */
  const colLabels = ['L2', 'L1', 'C', 'R1', 'R2'];                  /* 控制 定義欄位標籤 */
  const rowLabels = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5'];  /* 控制 定義列標籤 */

  const navBar = document.getElementById('navbar');                 /* 控制 取得導覽列 */
  const navMenu = document.getElementById('nav-menu');              /* 控制 取得選單 */
  const navCollapseToggle = document.getElementById('nav-collapse-toggle'); /* 控制 取得收合按鈕 */
  const navToggle = document.getElementById('nav-toggle');          /* 控制 取得手機選單按鈕 */
  const upArrow = document.getElementById('up-arrow');              /* 控制 取得上箭頭 */

  const customSections = {                                          /* 控制 定義客製化區塊內容 */
    "C_GROUND": { tag: "watercolor", title: "靜物練習", year: "2024", medium: "水彩", media: "image", mediaSrc: "images/Happy.jpg" }, /* 控制 C_GROUND 區塊內容 */
    "L1_D1":    { tag: "oil",       title: "肖像系列 #3", year: "2023", medium: "油畫", media: "image", mediaSrc: "images/sample2.jpg" }, /* 控制 L1_D1 區塊內容 */
    "R2_U1":    { tag: "sketch",    title: "速寫課堂",   year: "2022", medium: "鉛筆素描", media: "image", mediaSrc: "images/sample3.jpg" }  /* 控制 R2_U1 區塊內容 */
  };

  // 建立 grid-layout 內的 section
  for (let r = 0; r < rowLabels.length; r++) {                       /* 控制 迭代每列 */
    for (let c = 0; c < colLabels.length; c++) {                     /* 控制 迭代每欄 */
      const area = `${colLabels[c]}_${rowLabels[r]}`;                /* 控制 組合區塊 id */
      const section = document.createElement('section');             /* 控制 建立 section */
      section.id = area;                                             /* 控制 設定 section id */
      section.style.gridArea = area;                                 /* 控制 指定 grid-area */

      if (customSections[area]) {                                    /* 控制 若有自訂設定 */
        const setting = customSections[area];                        /* 控制 取得該設定 */
        section.dataset.tag = setting.tag;                           /* 控制 設定資料屬性 */

        const infoCard = document.createElement('div');              /* 控制 建立 info-card */
        infoCard.className = 'info-card';                            /* 控制 設定 class */
        infoCard.innerText = `${setting.title}\n${setting.year}｜${setting.medium}`; /* 控制 設定文字 */
        section.appendChild(infoCard);                               /* 控制 加入 info-card */

        if (setting.media === "image") {                             /* 控制 若為圖片媒體 */
          const img = document.createElement('img');                 /* 控制 建立 img */
          img.src = setting.mediaSrc;                                /* 控制 設定圖片來源 */
          img.alt = setting.title;                                   /* 控制 設定替代文字 */
          img.addEventListener('click', () => {                      /* 控制 點擊顯示燈箱 */
            document.getElementById('lightbox-image').src = img.src; /* 控制 更新燈箱圖片 */
            document.getElementById('lightbox').style.display = 'flex'; /* 控制 顯示燈箱 */
            document.getElementById('lightbox-debug').innerText = `燈箱狀態：開啟 (${setting.title})`; /* 控制 更新 debug */
          });
          section.appendChild(img);                                   /* 控制 加入圖片 */
        }
      }

      const label = document.createElement('div');                    /* 控制 建立區塊標籤 */
      label.innerText = area;                                        /* 控制 設定標籤文字 */
      section.appendChild(label);                                    /* 控制 加入標籤 */

      section.addEventListener('mouseenter', () => {                  /* 控制 滑鼠進入事件 */
        const card = section.querySelector('.info-card');             /* 控制 取得 info-card */
        if (card) {                                                   /* 控制 若有 info-card */
          card.style.display = 'block';                               /* 控制 顯示 info-card */
          document.getElementById('info-debug').innerText = `作品資訊：${card.innerText.replace(/\n/g, " ")}`; /* 控制 更新 debug */
        }
      });

      section.addEventListener('mouseleave', () => {                  /* 控制 滑鼠離開事件 */
        const card = section.querySelector('.info-card');             /* 控制 取得 info-card */
        if (card) card.style.display = 'none';                        /* 控制 隱藏 info-card */
      });

      gridLayout.appendChild(section);                                /* 控制 加入 section 到網格 */
    }
  }

  let currentColIndex = 2;                                           /* 控制 初始欄索引 */
  let currentRowIndex = 1;                                           /* 控制 初始列索引 */
  let previousColIndex = currentColIndex;                            /* 控制 記錄先前欄索引 */
  let previousRowIndex = currentRowIndex;                            /* 控制 記錄先前列索引 */

  /**
   * 將指定 colIndex, rowIndex 區塊滾動進入視窗
   * @param {number} colIndex 欄索引
   * @param {number} rowIndex 列索引
   * @param {string} [behavior='smooth'] 滾動行為
   */
  function scrollToPosition(colIndex, rowIndex, behavior = 'smooth') { /* 控制 定義滾動函式 */
    const sectionId = `${colLabels[colIndex]}_${rowLabels[rowIndex]}`; /* 控制 區塊 id */
    const section = document.getElementById(sectionId);               /* 控制 取得對應 section */
    if (section) {                                                    /* 控制 若找到 section */
      section.scrollIntoView({ behavior, block: 'start', inline: 'start' }); /* 控制 平滑滾動 */
      document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`; /* 控制 更新 debug */
      document.getElementById('current-block').innerText = `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`; /* 控制 更新 debug */
      previousColIndex = colIndex;                                    /* 控制 更新先前欄索引 */
      previousRowIndex = rowIndex;                                    /* 控制 更新先前列索引 */
    }
  }

  // ✅ 初始對齊中心區塊
  requestAnimationFrame(() => {                                      /* 控制 使用 requestAnimationFrame */
    requestAnimationFrame(() => {                                    /* 控制 再次呼叫 */
      scrollToPosition(currentColIndex, currentRowIndex);            /* 控制 滾動到初始位置 */
    });
  });

  // ⬅➡⬆⬇ 點擊控制
  document.getElementById('left-arrow').addEventListener('click', () => { /* 控制 左箭頭點擊 */
    if (currentColIndex > 0) currentColIndex--;                      /* 控制 欄索引減一 */
    scrollToPosition(currentColIndex, currentRowIndex);              /* 控制 滾動 */
  });
  document.getElementById('right-arrow').addEventListener('click', () => { /* 控制 右箭頭點擊 */
    if (currentColIndex < colLabels.length - 1) currentColIndex++;   /* 控制 欄索引加一 */
    scrollToPosition(currentColIndex, currentRowIndex);              /* 控制 滾動 */
  });
  document.getElementById('up-arrow').addEventListener('click', () => { /* 控制 上箭頭點擊 */
    if (currentRowIndex > 0) currentRowIndex--;                      /* 控制 列索引減一 */
    scrollToPosition(currentColIndex, currentRowIndex);              /* 控制 滾動 */
  });
  document.getElementById('down-arrow').addEventListener('click', () => { /* 控制 下箭頭點擊 */
    if (currentRowIndex < rowLabels.length - 1) currentRowIndex++;   /* 控制 列索引加一 */
    scrollToPosition(currentColIndex, currentRowIndex);              /* 控制 滾動 */
  });

  // 📌 自動判定中心區塊
  let scrollDebounceTimeout = null;                                  /* 控制 防抖計時器 */
  window.addEventListener('scroll', () => {                          /* 控制 滾動事件 */
    clearTimeout(scrollDebounceTimeout);                             /* 控制 清除計時 */
    scrollDebounceTimeout = setTimeout(() => {                       /* 控制 設定防抖 */
      const sections = document.querySelectorAll('#grid-layout > section'); /* 控制 取得所有 sections */
      let closest = null;                                            /* 控制 記錄最近 section */
      let minDistance = Infinity;                                    /* 控制 最小距離 */
      const cx = window.scrollX + window.innerWidth / 2;             /* 控制 計算視窗中心X */
      const cy = window.scrollY + window.innerHeight / 2;            /* 控制 計算視窗中心Y */

      sections.forEach(section => {                                  /* 控制 迭代每個 section */
        const rect = section.getBoundingClientRect();                /* 控制 取得區塊位置 */
        const scx = rect.left + window.scrollX + rect.width / 2;     /* 控制 區塊中心X */
        const scy = rect.top + window.scrollY + rect.height / 2;     /* 控制 區塊中心Y */
        const dx = cx - scx;                                         /* 控制 X距離 */
        const dy = cy - scy;                                         /* 控制 Y距離 */
        const dist = Math.sqrt(dx * dx + dy * dy);                   /* 控制 距離計算 */
        if (dist < minDistance) {                                    /* 控制 若更近 */
          minDistance = dist;                                        /* 控制 更新最小距離 */
          closest = section;                                         /* 控制 更新最近區塊 */
        }
      });

      if (closest) {                                                 /* 控制 若有最近區塊 */
        const [col, row] = closest.id.split('_');                   /* 控制 拆解 id */
        if (colLabels.includes(col)) currentColIndex = colLabels.indexOf(col); /* 控制 更新欄索引 */
        if (rowLabels.includes(row)) currentRowIndex = rowLabels.indexOf(row); /* 控制 更新列索引 */
        document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`; /* 控制 更新 debug */
        document.getElementById('current-block').innerText = `當前區塊: ${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`; /* 控制 更新 debug */
        setTimeout(() => {                                           /* 控制 延遲更新 */
          previousColIndex = currentColIndex;                        /* 控制 記錄先前欄索引 */
          previousRowIndex = currentRowIndex;                        /* 控制 記錄先前列索引 */
        }, 0);
      }
    }, 150);
  });

  // ☰ 手機選單
  navToggle.addEventListener('click', () => {                       /* 控制 手機選單點擊 */
    navMenu.classList.toggle('open');                               /* 控制 切換選單狀態 */
    document.getElementById('nav-debug').innerText =               /* 控制 更新 debug */
      `導覽狀態：${navMenu.classList.contains('open') ? '開啟' : '關閉'}`;
  });

  // ⬡ 收合導覽列
  navCollapseToggle.addEventListener('click', () => {               /* 控制 收合按鈕點擊 */
    navBar.classList.toggle('hidden');                              /* 控制 切換隱藏 */
    const isHidden = navBar.classList.contains('hidden');           /* 控制 取得隱藏狀態 */
    navCollapseToggle.innerText = isHidden ? '⬢' : '⬡';            /* 控制 更新按鈕文字 */

    if (isHidden) {                                                 /* 控制 隱藏後 */
      navMenu.classList.remove('open');                             /* 控制 收起選單 */
      upArrow.classList.add('nav-hidden');                          /* 控制 隱藏上箭頭 */
    } else {                                                        /* 控制 顯示後 */
      upArrow.classList.remove('nav-hidden');                       /* 控制 顯示上箭頭 */
    }

    navToggle.style.display = isHidden ? 'none' : 'block';         /* 控制 手機選單顯示 */
    const navHeight = navBar.offsetHeight;                          /* 控制 取得導覽高度 */
    document.getElementById('nav-debug').innerText =               /* 控制 更新 debug */
      `導覽狀態：${isHidden ? '已隱藏' : '顯示中'}\n高度：${navHeight}px`;
  });

  // ⌨️ 鍵盤控制
  window.addEventListener('keydown', (e) => {                       /* 控制 按鍵監聽 */
    let moved = false;                                              /* 控制 是否已移動 */
    if (e.key === 'ArrowUp' || e.key === 'w') {                     /* 控制 向上鍵 */
      if (currentRowIndex > 0) { currentRowIndex--; moved = true; }
    }
    if (e.key === 'ArrowDown' || e.key === 's') {                   /* 控制 向下鍵 */
      if (currentRowIndex < rowLabels.length - 1) { currentRowIndex++; moved = true; }
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {                   /* 控制 向左鍵 */
      if (currentColIndex > 0) { currentColIndex--; moved = true; }
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {                  /* 控制 向右鍵 */
      if (currentColIndex < colLabels.length - 1) { currentColIndex++; moved = true; }
    }

    if (moved) {                                                    /* 控制 若有移動 */
      scrollToPosition(currentColIndex, currentRowIndex);           /* 控制 滾動 */
      document.getElementById('input-debug').innerText =           /* 控制 更新 debug */
        `輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // ❌ 關閉 Lightbox
  document.getElementById('lightbox-close').addEventListener('click', () => { /* 控制 燈箱關閉 */
    document.getElementById('lightbox').style.display = 'none';              /* 控制 隱藏燈箱 */
    document.getElementById('lightbox-image').src = "";                      /* 控制 清空影像 */
    document.getElementById('lightbox-debug').innerText = "燈箱狀態：關閉";    /* 控制 更新 debug */
  });

  // 🎨 篩選功能
  document.querySelectorAll('.filter-button').forEach(btn => {              /* 控制 迭代篩選按鈕 */
    btn.addEventListener('click', () => {                                   /* 控制 點擊事件 */
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active')); /* 控制 移除所有 active */
      btn.classList.add('active');                                          /* 控制 新增 active */
      const selected = btn.dataset.tag;                                     /* 控制 取得選取標籤 */
      document.getElementById('filter-debug').innerText =                   /* 控制 更新 debug */
        `目前篩選：${selected}`;
      document.querySelectorAll('#grid-layout > section').forEach(sec => {  /* 控制 迭代所有區塊 */
        if (selected === "all" || sec.dataset.tag === selected) {            /* 控制 篩選條件 */
          sec.style.opacity = "1";                                           /* 控制 顯示區塊 */
          sec.style.pointerEvents = "auto";                                  /* 控制 啟用互動 */
        } else {
          sec.style.opacity = "0.1";                                         /* 控制 隱藏區塊 */
          sec.style.pointerEvents = "none";                                  /* 控制 禁用互動 */
        }
      });
    });
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

  // 🆕 Overview Grid 一覽功能
  const overviewButton = document.getElementById('overview-button');    /* 控制 取得 Overview 按鈕 */
  const overviewOverlay = document.getElementById('overview-overlay');  /* 控制 取得覆蓋層 */
  const gridContainer = overviewOverlay.querySelector('.overview-grid'); /* 控制 取得網格容器 */
  rowLabels.forEach(row => {                                           /* 控制 迭代列 */
    colLabels.forEach(col => {                                         /* 控制 迭代欄 */
      const areaId = `${col}_${row}`;                                  /* 控制 組合 id */
      const item = document.createElement('div');                      /* 控制 建立項目 */
      item.className = 'overview-item';                                /* 控制 設定 class */
      item.innerText = areaId;                                         /* 控制 設定顯示文字 */
      item.addEventListener('click', () => {                           /* 控制 點擊事件 */
        overviewOverlay.style.display = 'none';                        /* 控制 隱藏覆蓋 */
        const colIndex = colLabels.indexOf(col);                       /* 控制 取得欄索引 */
        const rowIndex = rowLabels.indexOf(row);                       /* 控制 取得列索引 */
        scrollToPosition(colIndex, rowIndex);                          /* 控制 滾動到該區 */
      });
      gridContainer.appendChild(item);                                 /* 控制 加入到網格 */
    });
  });
  overviewButton.addEventListener('click', () => {                    /* 控制 Overview 按鈕點擊 */
    overviewOverlay.style.display = 'block';                          /* 控制 顯示覆蓋 */ 
  });
  overviewOverlay.addEventListener('click', e => {                    /* 控制 點擊覆蓋層 */
    if (e.target === overviewOverlay) {                               /* 控制 點擊空白判斷 */
      overviewOverlay.style.display = 'none';                         /* 控制 隱藏覆蓋 */
    }
  });

});``
