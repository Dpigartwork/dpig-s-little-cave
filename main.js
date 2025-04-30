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
  // 取得網格主容器（<main id="grid-layout">）
  const gridLayout = document.getElementById('grid-layout');

  // ➡️ 橫向欄位名稱：從左到右（共 5 欄）
  const colLabels = ['L2', 'L1', 'C', 'R1', 'R2'];

  // ⬇️ 縱向列名稱：從上到下（共 7 行，"GROUND" 代表中央列）
  const rowLabels = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5'];

  // 🎯 可客製化的格子設定，透過區塊 ID 定義背景色或媒體內容
  const customSections = {
    // 範例："R2_D4": { color: "#f38357", media: "image", mediaSrc: "images/Happy.jpg" }
  };

  // 🔁 逐一建立 5×7 個 section（格子）
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 0; c < colLabels.length; c++) {
      const col = colLabels[c];
      const row = rowLabels[r];

      // ⛳ 格子 ID，例如：C_D1 或 L1_U1
      const area = (col && row) ? `${col}_${row}` : col || row;

      // 建立 section 元素（格子）
      const section = document.createElement('section');
      section.id = area;
      section.style.gridArea = area;

      // ✅ 若為客製化格子，則套用設定
      if (customSections[area]) {
        const setting = customSections[area];
        section.style.backgroundColor = setting.color;

        if (setting.media === "image") {
          const img = document.createElement('img');
          img.src = setting.mediaSrc;
          img.alt = "Image content";
          section.appendChild(img);
        } else {
          section.innerHTML = `<div>${area}</div>`;
        }
      } else {
        // 📝 預設顯示區塊名稱
        section.innerHTML = `<div>${area}</div>`;
      }

      // 加入網格主容器
      gridLayout.appendChild(section);
    }
  }

  // 👉 初始位置設為中央的 C 區塊
  let currentColIndex = 2; // 對應 colLabels[2] = "C"
  let currentRowIndex = 1; // 對應 rowLabels[1] = "GROUND"

  let previousColIndex = currentColIndex; // 記錄上次位置
  let previousRowIndex = currentRowIndex; // 記錄上次位置

  /**
   * 🧭 scrollToPosition()：滾動到指定格子位置
   * @param {number} colIndex - 欄位索引（0～4）
   * @param {number} rowIndex - 列索引（0～6）
   */
  function scrollToPosition(colIndex, rowIndex) {
    const col = colLabels[colIndex];
    const row = rowLabels[rowIndex];
    const sectionId = (col && row) ? `${col}_${row}` : col || row;
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth', // 平滑滾動
        block: 'start',     // 垂直頂部對齊
        inline: 'start'     // 水平左側對齊
      });

      // 更新 DEBUG 顯示
      document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
      document.getElementById('current-block').innerText = `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`;

      // 更新當前區塊為上次區塊
      previousColIndex = colIndex;
      previousRowIndex = rowIndex;
    }
  }

  // ◀️ 左箭頭事件：向左移動顯示區塊
  document.getElementById('left-arrow').addEventListener('click', () => {
    if (currentColIndex > 0) {
      currentColIndex--;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  // ▶️ 右箭頭事件：向右移動顯示區塊
  document.getElementById('right-arrow').addEventListener('click', () => {
    if (currentColIndex < colLabels.length - 1) {
      currentColIndex++;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  // 🔼 上箭頭事件：向上移動顯示區塊
  document.getElementById('up-arrow').addEventListener('click', () => {
    if (currentRowIndex > 0) {
      currentRowIndex--;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  // 🔽 下箭頭事件：向下移動顯示區塊
  document.getElementById('down-arrow').addEventListener('click', () => {
    if (currentRowIndex < rowLabels.length - 1) {
      currentRowIndex++;
      scrollToPosition(currentColIndex, currentRowIndex);
    }
  });

  // 🕒 頁面載入完成後，自動滾動至中央的 C 區塊
  setTimeout(() => {
    currentColIndex = 2; // C
    currentRowIndex = 1; // GROUND
    scrollToPosition(currentColIndex, currentRowIndex);
  }, 0);

  // 📌 立即更新目前位置（即時監控畫面中心區塊）
  window.addEventListener('scroll', () => {
    // 🔍 找出最接近畫面中心的格子
    const sections = document.querySelectorAll('#grid-layout > section');
    let closestSection = null;
    let closestDistance = Infinity;
    let viewportCenterX = window.scrollX + window.innerWidth / 2;
    let viewportCenterY = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionCenterX = rect.left + window.scrollX + rect.width / 2;
      const sectionCenterY = rect.top + window.scrollY + rect.height / 2;

      const dx = viewportCenterX - sectionCenterX;
      const dy = viewportCenterY - sectionCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    // ✏️ 更新目前位置索引（不自動捲動）
    if (closestSection) {
      const id = closestSection.id; // 例如 C_D2 或 C_GROUND
      const [col, row] = id.includes('_') ? id.split('_') : [id, 'GROUND'];
      currentColIndex = colLabels.indexOf(col);
      currentRowIndex = rowLabels.indexOf(row);
    }
  });

});
