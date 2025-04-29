window.addEventListener('load', function () {
  // 取得網格容器
  const gridLayout = document.getElementById('grid-layout');

  // 橫向欄位和縱向列位標籤
  const colLabels = ['L2', 'L1', 'C', 'R1', 'R2']; // 橫向欄位
  const rowLabels = ['U1', '', 'D1', 'D2', 'D3', 'D4', 'D5']; // 縱向列位

  // 可指定特殊樣式或圖片的區塊
  const customSections = {
    // 例: "R2_D4": { color: "#f38357", media: "image", mediaSrc: "images/Happy.jpg" }
  };

  // 自動建立網格區塊
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 0; c < colLabels.length; c++) {
      const col = colLabels[c];
      const row = rowLabels[r];
      const area = (col && row) ? `${col}_${row}` : col || row;

      // 創建每個區塊的 section 元素
      const section = document.createElement('section');
      section.id = area; // 設定每個區塊的 ID
      section.style.gridArea = area; // 設定每個區塊的 grid 排版

      // 如果該區塊有自定義設置
      if (customSections[area]) {
        const setting = customSections[area];
        section.style.backgroundColor = setting.color;

        // 如果是圖片，則插入圖片
        if (setting.media === "image") {
          const img = document.createElement('img');
          img.src = setting.mediaSrc;
          img.alt = "Image content";
          section.appendChild(img);
        } else {
          // 如果沒有特殊設定，則顯示區塊名稱
          section.innerHTML = `<div>${area}</div>`;
        }
      } else {
        // 預設顯示區塊名稱
        section.innerHTML = `<div>${area}</div>`;
      }

      // 將每個區塊添加到 grid 容器
      gridLayout.appendChild(section);
    }
  }

  // 🔁 左右捲動邏輯
  let currentColIndex = 2; // 預設從 C 開始

  // 滾動至指定的區塊
  function scrollToColumn(colIndex) {
    const sectionId = `${colLabels[colIndex]}`; // 滾動至指定的區塊（例如 C 區塊）
    const section = document.getElementById(sectionId);
    if (section) {
      // 使用 scrollIntoView 進行平滑滾動
      section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
  }

  // 左箭頭按鈕的事件處理
  document.getElementById('left-arrow').addEventListener('click', () => {
    if (currentColIndex > 0) {
      currentColIndex--; // 向左移動一個欄位
      scrollToColumn(currentColIndex); // 滾動到新欄位
    }
  });

  // 右箭頭按鈕的事件處理
  document.getElementById('right-arrow').addEventListener('click', () => {
    if (currentColIndex < colLabels.length - 1) {
      currentColIndex++; // 向右移動一個欄位
      scrollToColumn(currentColIndex); // 滾動到新欄位
    }
  });

  // ✅ 頁面加載完自動滾動至中間的 C 區塊
  setTimeout(() => {
    const centerSection = document.getElementById('C');
    if (centerSection) {
      // 延遲 500 毫秒後滾動至 C 區塊
      centerSection.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'start' });
    }
  }, 200); // 延遲 200 毫秒，確保內容完全加載
});
