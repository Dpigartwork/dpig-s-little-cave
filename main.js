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
  const gridLayout = document.getElementById('grid-layout');
  const colLabels = ['L2', 'L1', 'C', 'R1', 'R2'];
  const rowLabels = ['U1', 'GROUND', 'D1', 'D2', 'D3', 'D4', 'D5'];

  const navBar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navCollapseToggle = document.getElementById('nav-collapse-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const upArrow = document.getElementById('up-arrow');

  const customSections = {
    "C_GROUND": { tag: "watercolor", title: "靜物練習", year: "2024", medium: "水彩", media: "image", mediaSrc: "images/sample1.jpg" },
    "L1_D1": { tag: "oil", title: "肖像系列 #3", year: "2023", medium: "油畫", media: "image", mediaSrc: "images/sample2.jpg" },
    "R2_U1": { tag: "sketch", title: "速寫課堂", year: "2022", medium: "鉛筆素描", media: "image", mediaSrc: "images/sample3.jpg" }
  };

  // 🧱 建立區塊
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 0; c < colLabels.length; c++) {
      const area = `${colLabels[c]}_${rowLabels[r]}`;
      const section = document.createElement('section');
      section.id = area;
      section.style.gridArea = area;

      if (customSections[area]) {
        const setting = customSections[area];
        section.dataset.tag = setting.tag;

        const infoCard = document.createElement('div');
        infoCard.className = 'info-card';
        infoCard.innerText = `${setting.title}\n${setting.year}｜${setting.medium}`;
        section.appendChild(infoCard);

        if (setting.media === "image") {
          const img = document.createElement('img');
          img.src = setting.mediaSrc;
          img.alt = setting.title;
          img.addEventListener('click', () => {
            document.getElementById('lightbox-image').src = img.src;
            document.getElementById('lightbox').style.display = 'flex';
            document.getElementById('lightbox-debug').innerText = `燈箱狀態：開啟 (${setting.title})`;
          });
          section.appendChild(img);
        }
      }

      const label = document.createElement('div');
      label.innerText = area;
      section.appendChild(label);

      section.addEventListener('mouseenter', () => {
        const card = section.querySelector('.info-card');
        if (card) {
          card.style.display = 'block';
          document.getElementById('info-debug').innerText = `作品資訊：${card.innerText.replace(/\n/g, " ")}`;
        }
      });
      section.addEventListener('mouseleave', () => {
        const card = section.querySelector('.info-card');
        if (card) card.style.display = 'none';
      });

      gridLayout.appendChild(section);
    }
  }

  let currentColIndex = 2;
  let currentRowIndex = 1;
  let previousColIndex = currentColIndex;
  let previousRowIndex = currentRowIndex;

  function scrollToPosition(colIndex, rowIndex, behavior = 'smooth') {
    const sectionId = `${colLabels[colIndex]}_${rowLabels[rowIndex]}`;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior, block: 'start', inline: 'start' });
      document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
      document.getElementById('current-block').innerText = `當前區塊: ${colLabels[colIndex]}_${rowLabels[rowIndex]}`;
      previousColIndex = colIndex;
      previousRowIndex = rowIndex;
    }
  }

  scrollToPosition(currentColIndex, currentRowIndex);

  // ⬅➡⬆⬇ 點擊控制
  document.getElementById('left-arrow').addEventListener('click', () => {
    if (currentColIndex > 0) currentColIndex--;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('right-arrow').addEventListener('click', () => {
    if (currentColIndex < colLabels.length - 1) currentColIndex++;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('up-arrow').addEventListener('click', () => {
    if (currentRowIndex > 0) currentRowIndex--;
    scrollToPosition(currentColIndex, currentRowIndex);
  });
  document.getElementById('down-arrow').addEventListener('click', () => {
    if (currentRowIndex < rowLabels.length - 1) currentRowIndex++;
    scrollToPosition(currentColIndex, currentRowIndex);
  });

  // 📌 自動判定中心區塊
  let scrollDebounceTimeout = null;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollDebounceTimeout);
    scrollDebounceTimeout = setTimeout(() => {
      const sections = document.querySelectorAll('#grid-layout > section');
      let closest = null;
      let minDistance = Infinity;
      const cx = window.scrollX + window.innerWidth / 2;
      const cy = window.scrollY + window.innerHeight / 2;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scx = rect.left + window.scrollX + rect.width / 2;
        const scy = rect.top + window.scrollY + rect.height / 2;
        const dx = cx - scx;
        const dy = cy - scy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          closest = section;
        }
      });

      if (closest) {
        const [col, row] = closest.id.split('_');
        if (colLabels.includes(col)) currentColIndex = colLabels.indexOf(col);
        if (rowLabels.includes(row)) currentRowIndex = rowLabels.indexOf(row);
        document.getElementById('previous-block').innerText = `上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
        document.getElementById('current-block').innerText = `當前區塊: ${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`;
        setTimeout(() => {
          previousColIndex = currentColIndex;
          previousRowIndex = currentRowIndex;
        }, 0);
      }
    }, 150);
  });

  // 📱 漢堡選單控制
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${navMenu.classList.contains('open') ? '開啟' : '關閉'}`;
  });

  // ⬡ 收合導覽列
  navCollapseToggle.addEventListener('click', () => {
    navBar.classList.toggle('hidden');
    const isHidden = navBar.classList.contains('hidden');
    navCollapseToggle.innerText = isHidden ? '⬢' : '⬡';
  
    if (isHidden) {
      navMenu.classList.remove('open');
      upArrow.classList.add('nav-hidden');
    } else {
      upArrow.classList.remove('nav-hidden');
    }
  
    navToggle.style.display = isHidden ? 'none' : 'block';
  
    // ✅ 把這一段放在這裡
    const navHeight = navBar.offsetHeight;
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${isHidden ? '已隱藏' : '顯示中'}\n高度：${navHeight}px`;
  });
  
  
  // ⌨️ 鍵盤方向鍵控制
  window.addEventListener('keydown', (e) => {
    let moved = false;
    if (e.key === 'ArrowUp' || e.key === 'w') { if (currentRowIndex > 0) { currentRowIndex--; moved = true; } }
    if (e.key === 'ArrowDown' || e.key === 's') { if (currentRowIndex < rowLabels.length - 1) { currentRowIndex++; moved = true; } }
    if (e.key === 'ArrowLeft' || e.key === 'a') { if (currentColIndex > 0) { currentColIndex--; moved = true; } }
    if (e.key === 'ArrowRight' || e.key === 'd') { if (currentColIndex < colLabels.length - 1) { currentColIndex++; moved = true; } }

    if (moved) {
      scrollToPosition(currentColIndex, currentRowIndex);
      document.getElementById('input-debug').innerText = `輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // ❌ 關閉 Lightbox
  document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
    document.getElementById('lightbox-image').src = "";
    document.getElementById('lightbox-debug').innerText = "燈箱狀態：關閉";
  });

  // 🎨 篩選控制
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selected = btn.dataset.tag;
      document.getElementById('filter-debug').innerText = `目前篩選：${selected}`;
      document.querySelectorAll('#grid-layout > section').forEach(sec => {
        if (selected === "all" || sec.dataset.tag === selected) {
          sec.style.opacity = "1";
          sec.style.pointerEvents = "auto";
        } else {
          sec.style.opacity = "0.1";
          sec.style.pointerEvents = "none";
        }
      });
    });
  });

  // 📏 更新 nav-menu 位置
  function updateMobileMenuPosition() {
    const navHeight = navBar.offsetHeight;
    navMenu.style.top = navHeight + 'px';
  }

  window.addEventListener('resize', () => {
    updateMobileMenuPosition();
    const isMobile = window.innerWidth <= 768;
    const isHidden = navBar.classList.contains('hidden');
    navToggle.style.display = isMobile && !isHidden ? 'block' : 'none';
    requestAnimationFrame(() => {
      scrollToPosition(currentColIndex, currentRowIndex, 'auto');
    });
  });

  updateMobileMenuPosition();
  window.addEventListener('orientationchange', updateMobileMenuPosition);
});

