window.addEventListener('load', function () {
    const gridLayout = document.getElementById('grid-layout');
  
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
  
        const section = document.createElement('section');
        section.id = area;
        section.style.gridArea = area;
  
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
          section.innerHTML = `<div>${area}</div>`;
        }
  
        gridLayout.appendChild(section);
      }
    }
  
    // 🔁 左右捲動邏輯
    let currentColIndex = 2; // 預設從 C 開始
  
    function scrollToColumn(colIndex) {
      const sectionId = `${colLabels[colIndex]}`; // 只滾動至 C 這一整個區塊
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
      }
    }
  
    document.getElementById('left-arrow').addEventListener('click', () => {
      if (currentColIndex > 0) {
        currentColIndex--;
        scrollToColumn(currentColIndex);
      }
    });
  
    document.getElementById('right-arrow').addEventListener('click', () => {
      if (currentColIndex < colLabels.length - 1) {
        currentColIndex++;
        scrollToColumn(currentColIndex);
      }
    });
  
    // 頁面加載後滾動至 C 區塊
    window.scrollTo(0, 0); // 先確保畫面回頂端
    scrollToColumn(currentColIndex); // 預設定位到 C 區塊
  });
