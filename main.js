/**
 * 📘 JavaScript 關鍵字與常用詞解釋：
 *
 * function：定義一個函式（功能單元），可重複執行一段程式邏輯。
 * gridLayout：變數名稱，代表 <main id="grid-layout"> 的 DOM 元素，是整個網格的容器。
 * colLabels：橫向欄位名稱陣列，用來定義左右的 5 個區塊。
 * rowLabels：縱向列名稱陣列，用來定義上下的 7 行（包含 "GROUND" 代表中央列）。
 * customSections：可客製化的區塊設定（背景色、圖片等），用來控制特定格子的內容。
 * let：宣告區域變數，支援重新賦值，但不像 var 那樣有提升（hoisting）問題。
 * const：宣告常數，不可重新賦值，用於不會變動的參數。
 * `<div>${area}</div>`：模板字串，用於動態建立 HTML 字串，插入區塊名稱 area。
 * param：是 JSDoc 標準註解格式，說明函式參數的用途與類型，對維護大型程式非常重要。
 * document.getElementById()：取得 HTML 中指定 id 的元素。
 * .addEventListener()：綁定使用者事件，例如按鈕點擊。
 * .scrollIntoView()：讓某個區塊自動捲動至可視畫面中。
 * setTimeout()：延遲指定時間後執行一段程式碼。
 * .appendChild()：將建立好的元素加入 HTML 結構中。
 * .innerHTML：操作元素內部的 HTML。
 * behavior, block, inline：scrollIntoView 的選項，用來控制滾動行為。
 */

window.addEventListener('load', function () {
  // 🎛️ 取得主網格容器
  const gridLayout = document.getElementById('grid-layout'); // 取得 <main> 元素

  // ➡️ 橫向欄位名稱（共 5 欄）
  const colLabels = ['L2', 'L1', 'C', 'R1', 'R2']; // 從左到右

  // ⬇️ 縱向列名稱（共 7 行）
  const rowLabels = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5']; // 從上到下

  // 🖼️ 自定義作品內容區塊
  const customSections = {
    "C_GROUND": { tag: "watercolor", title: "靜物練習", year: "2024", medium: "水彩", media: "image", mediaSrc: "images/sample1.jpg" },
    "L1_D1": { tag: "oil", title: "肖像系列 #3", year: "2023", medium: "油畫", media: "image", mediaSrc: "images/sample2.jpg" },
    "R2_U1": { tag: "sketch", title: "速寫課堂", year: "2022", medium: "鉛筆素描", media: "image", mediaSrc: "images/sample3.jpg" }
  };

  // 🧱 建立網格區塊（7列 × 5欄）
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 0; c < colLabels.length; c++) {
      const col = colLabels[c]; // 欄位名稱
      const row = rowLabels[r]; // 列名稱
      const area = `${col}_${row}`; // 區塊 ID

      const section = document.createElement('section'); // 建立 section 元素
      section.id = area; // 設定 ID
      section.style.gridArea = area; // 對應 CSS grid-area 名稱

      // 如果該格有定義作品內容
      if (customSections[area]) {
        const setting = customSections[area]; // 取得設定
        section.dataset.tag = setting.tag; // 設定 data-tag 屬性

        const infoCard = document.createElement('div'); // 建立作品資訊卡片
        infoCard.className = 'info-card'; // 設定樣式
        infoCard.innerText = `${setting.title}\n${setting.year}｜${setting.medium}`; // 填入文字內容
        section.appendChild(infoCard); // 加入到格子中

        if (setting.media === "image") {
          const img = document.createElement('img'); // 建立圖片
          img.src = setting.mediaSrc; // 設定圖片來源
          img.alt = setting.title; // 設定替代文字

          img.addEventListener('click', () => {
            document.getElementById('lightbox-image').src = img.src; // 顯示放大圖
            document.getElementById('lightbox').style.display = 'flex'; // 顯示燈箱
            document.getElementById('lightbox-debug').innerText = `燈箱狀態：開啟 (${setting.title})`; // Debug 狀態
          });

          section.appendChild(img); // 加入圖片
        }
      }

      const label = document.createElement('div'); // 顯示區塊代號
      label.innerText = area; // 格子名稱
      section.appendChild(label); // 加入格子中

      section.addEventListener('mouseenter', () => {
        const card = section.querySelector('.info-card'); // 取得卡片
        if (card) {
          card.style.display = 'block'; // 顯示資訊卡
          document.getElementById('info-debug').innerText = `作品資訊：${card.innerText.replace(/\n/g, " ")}`; // 更新 Debug
        }
      });

      section.addEventListener('mouseleave', () => {
        const card = section.querySelector('.info-card'); // 取得卡片
        if (card) card.style.display = 'none'; // 隱藏資訊卡
      });

      gridLayout.appendChild(section); // 將 section 加入主容器
    }
  }
  // 🎯 初始捲動位置設定為中心格 C_GROUND
  let currentColIndex = 2; // 預設在 C
  let currentRowIndex = 1; // 預設在 GROUND
  let previousColIndex = currentColIndex; // 上一次欄位位置
  let previousRowIndex = currentRowIndex; // 上一次列位置

  // 📍 捲動畫面至指定位置
  function scrollToPosition(colIndex, rowIndex, behavior = 'smooth') {
    const sectionId = `${colLabels[colIndex]}_${rowLabels[rowIndex]}`; // 格子 ID
    const section = document.getElementById(sectionId); // 取得對應元素

    if (section) {
      section.scrollIntoView({ behavior, block: 'start', inline: 'start' }); // 捲動到該區塊
      document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`; // Debug 顯示
      document.getElementById('current-block').innerText = `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`; // Debug 顯示
      previousColIndex = colIndex; // 更新欄位置
      previousRowIndex = rowIndex; // 更新列位置
    }
  }

  // ⏱️ 載入完自動捲至中央
  setTimeout(() => {
    scrollToPosition(currentColIndex, currentRowIndex); // 捲到 C_GROUND
  }, 0); // 延遲 0ms 等待載入完成

  // 🔼🔽◁▷ 方向按鈕控制
  document.getElementById('left-arrow').addEventListener('click', () => {
    if (currentColIndex > 0) {
      currentColIndex--;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  document.getElementById('right-arrow').addEventListener('click', () => {
    if (currentColIndex < colLabels.length - 1) {
      currentColIndex++;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  document.getElementById('up-arrow').addEventListener('click', () => {
    if (currentRowIndex > 0) {
      currentRowIndex--;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  document.getElementById('down-arrow').addEventListener('click', () => {
    if (currentRowIndex < rowLabels.length - 1) {
      currentRowIndex++;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  // 🌀 防抖機制：滾動結束後自動判斷中心格
  let scrollDebounceTimeout = null; // 儲存 debounce timeout 的變數

  window.addEventListener('scroll', () => {
    clearTimeout(scrollDebounceTimeout); // 每次滾動都先清除舊的 timeout

    scrollDebounceTimeout = setTimeout(() => {
      const sections = document.querySelectorAll('#grid-layout > section'); // 取得所有格子
      let closest = null; // 最接近畫面中心的格子
      let minDistance = Infinity; // 初始化最短距離

      const cx = window.scrollX + window.innerWidth / 2; // 畫面中心點 X
      const cy = window.scrollY + window.innerHeight / 2; // 畫面中心點 Y

      sections.forEach(section => {
        const rect = section.getBoundingClientRect(); // 取得格子的視窗座標
        const scx = rect.left + window.scrollX + rect.width / 2; // 格子中心 X
        const scy = rect.top + window.scrollY + rect.height / 2; // 格子中心 Y
        const dx = cx - scx; // X 軸距離
        const dy = cy - scy; // Y 軸距離
        const dist = Math.sqrt(dx * dx + dy * dy); // 計算距離

        if (dist < minDistance) {
          minDistance = dist; // 更新最近距離
          closest = section; // 更新最近格子
        }
      });

      if (closest) {
        const [col, row] = closest.id.split('_'); // 拆解格子 ID
        if (colLabels.includes(col)) currentColIndex = colLabels.indexOf(col); // 更新欄索引
        if (rowLabels.includes(row)) currentRowIndex = rowLabels.indexOf(row); // 更新列索引
        document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`; // Debug
        document.getElementById('current-block').innerText = `當前區塊: ${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`; // Debug
        setTimeout(() => {
          previousColIndex = currentColIndex; // 更新歷史位置
          previousRowIndex = currentRowIndex;
        }, 0);
      }
    }, 150); // 防抖延遲時間（150ms）
  });

  // 📏 畫面尺寸改變時，自動對齊當前格子
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToPosition(currentColIndex, currentRowIndex, 'auto'); // 無動畫跳轉
      });
    });
  });
  // ❌ 關閉燈箱功能
  document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none'; // 關閉 lightbox
    document.getElementById('lightbox-image').src = ""; // 清除圖片
    document.getElementById('lightbox-debug').innerText = "燈箱狀態：關閉"; // 更新 Debug
  });

  // 🧩 篩選作品（依標籤 tag）
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active')); // 移除其他按鈕的選取狀態
      btn.classList.add('active'); // 加上當前按鈕的 active 樣式
      const selected = btn.dataset.tag; // 取得所選分類
      document.getElementById('filter-debug').innerText = `目前篩選：${selected}`; // 更新 Debug 面板

      document.querySelectorAll('#grid-layout > section').forEach(sec => {
        if (selected === "all" || sec.dataset.tag === selected) {
          sec.style.opacity = "1"; // 顯示符合的格子
          sec.style.pointerEvents = "auto"; // 可互動
        } else {
          sec.style.opacity = "0.1"; // 淡出不符合的格子
          sec.style.pointerEvents = "none"; // 停用互動
        }
      });
    });
  });

  // ☰ 漢堡選單（手機模式）
  const navToggle = document.getElementById('nav-toggle'); // 取得漢堡按鈕
  const navMenu = document.getElementById('nav-menu'); // 取得選單區塊

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open'); // 展開或收起
    const state = navMenu.classList.contains('open') ? '開啟' : '關閉'; // 判斷狀態
    document.getElementById('nav-debug').innerText = `導覽狀態：${state}`; // 更新 Debug
  });

  // ⬡⬢ 導覽列收合控制邏輯（含同步向上箭頭調整）
  const navBar = document.getElementById('navbar'); // 導覽列元素
  const navCollapseToggle = document.getElementById('nav-collapse-toggle'); // 收合按鈕
  const upArrow = document.getElementById('up-arrow'); // 向上箭頭

  navCollapseToggle.addEventListener('click', () => {
    navBar.classList.toggle('hidden'); // 導覽列顯示/隱藏切換
    const isHidden = navBar.classList.contains('hidden'); // 是否為隱藏狀態
    navCollapseToggle.innerText = isHidden ? '⬢' : '⬡'; // 切換按鈕內容（開啟或隱藏）

    if (isHidden) {
      upArrow.classList.add('nav-hidden'); // 向上箭頭也跟著上移
    } else {
      upArrow.classList.remove('nav-hidden'); // 還原預設位置
    }

    document.getElementById('nav-debug').innerText = `導覽狀態：${isHidden ? '已隱藏' : '顯示中'}`; // 更新 Debug 面板
  });

  // ⌨️ 鍵盤方向控制（方向鍵 + WASD）
  window.addEventListener('keydown', (e) => {
    let moved = false; // 紀錄是否移動

    if (e.key === 'ArrowUp' || e.key === 'w') {
      if (currentRowIndex > 0) { currentRowIndex--; moved = true; }
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
      if (currentRowIndex < rowLabels.length - 1) { currentRowIndex++; moved = true; }
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      if (currentColIndex > 0) { currentColIndex--; moved = true; }
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
      if (currentColIndex < colLabels.length - 1) { currentColIndex++; moved = true; }
    }

    if (moved) {
      scrollToPosition(currentColIndex, currentRowIndex); // 捲動到新區塊
      document.getElementById('input-debug').innerText = `輸入狀態：${e.key.toUpperCase()} 觸發`; // 更新輸入狀態 Debug
    }
  });
});
