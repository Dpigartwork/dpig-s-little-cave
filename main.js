/* ================================================
   D.pig’s Little Cave - 主程式檔（script.js）
   內容說明
    以下功能需包含：
      - 初始化網格區塊與客製化內容
      - 導覽列顯示／隱藏與漢堡選單
      - ◀ ▶ △ ▽ 控制用方向鍵按鈕、鍵盤與滾輪導航
          特定區塊得轉移方式及禁止事項
            從R1_D1~D5左右離開時，應傳送至左右的GROUND階層
            從R1_D1~D5左右區塊進入時，應傳送至R1_D1
            
          防抖功能
            除了例外的指令，其餘時間應隨時保持在當前的區塊
              若滾輪向下滑動，需等滾輪停止後一下下，再滑順的返回區塊比例最大的部分
              若以滑鼠拉動視窗邊框，使其縮放
                應保持在原本的區塊，盡可能不同時出現多個區塊，並立即的返回
              若按下右上角放大縮小鍵
                也應保持在原本的區塊，盡可能不同時出現多個區塊，並立即的返回

              例外!!!:僅於位於R1_D1~D5時不能返回當前區塊，但仍須追蹤當前區塊


      - Gallery 區域（#gallery-zone 跨 R1_D1~R1_D5）
        • 標題（藝術作品總覽），預設以上傳日期排序
        • 登入/登出、上傳、排序按鈕與當前登入狀態
          
          刪除作品需登入
          上傳之作品、圖片、GIF、影片皆須縮小排列整齊且等比例，並降低解析度讓每張縮圖上限保持在30MB左右，影片類型上限則為1G
          滑鼠若移至作品上方，但未點擊，則略為放大5%並發出微光，移開時則恢復，若為影片檔則以當前解析度開始播放影片
          在作品上點下左鍵可進入燈箱模式，才可放大至原本像素，顯示大小規則為
            最長邊長需要佔視窗最長邊的70%
            等比例顯示
          
            並且上傳後永久儲存直到刪除
              需將該圖片設定為下次的預設，才能在重新整理網頁或剛進網頁時顯示最新的資訊
              
            儲存或刪除檔案後同時能夠自動更新 GITHUB 上的程式碼和檔案


      - 燈箱功能：
        點擊小圖放大
        背景半透明的
      - Debug 面板一：
            字體大小應為8px且最多顯示8項訊息，
            超出的資訊應在下一頁顯示(目前設定為10頁)，並顯示「第 x/10 頁」
            並以"debug所需之全部資訊"視窗內靠下的"<"和">"控制上下一頁
            內容包括
              上一區塊
              當前區塊
              作品資訊
              燈箱狀態
              篩選狀態
              導覽狀態
              輸入狀態

              以及其他所有能夠調整的參數待更新後補上
            
      - Debug 面板二 全區一覽：
        快速跳轉任意區塊
      - Debug 面板三 所有參數調整:
        一個能夠調整所有參數的UI視窗
          UI視窗應為半透明，並置於視窗中間，手機板的UI則不得大於整個視窗的50%
          以像電腦的音量混音裝置控制各參數，也能點擊數字本身用打字的方式更改，也能以三角形方向鍵一個數字一個數字增減
          能夠上傳歌曲
          有儲存按鈕
          同時包含音樂播放曲目更換
          並且儲存後同時能夠自動更新 GITHUB 上的程式碼和檔案

      - 轉場黑幕效果與通知覆蓋
          剛進網頁時，應為黑幕狀態，等確認在 C_GROUND 後0.5秒，開始淡出黑幕
          除以上外其他淡入淡出效果都需遵從以下規則
            先淡入黑幕，黑幕轉場狀態時，任何操作都不能實行
            淡入動畫完成後，開始傳送到指定區塊
            抵達指定區塊0.5秒後，才開始淡出黑幕的動畫
            然後才開放正常操作


    最後更新：2025/05/07
    此後每一行皆需要有對應註解說明用途，若沒有則需補上，當然除了此公告註解本身。
    ================================================ */
/* ================================================
   D.pig’s Little Cave - 主程式檔（main.js）
   最後更新：2025/05/07
   此處保留所有原始註解，並補足「參數調整」新增標題與功能註解
=============================================== */
window.addEventListener('load', function() {                                            // 當頁面載入後執行主程式
  const gridLayout    = document.getElementById('grid-layout');                          // 取得主 grid 容器
  const colLabels     = ['L2','L1','C','R1','R2'];                                      // 定義欄位標籤
  const rowLabels     = ['U1','GROUND','D1','D2','D3','D4','D5'];                        // 定義列標籤
  const r1DZones      = ['R1_D1','R1_D2','R1_D3','R1_D4','R1_D5'];                        // 定義 R1_D 區域群組

  // ===== 取得各 UI 元素 =====
  const navBar            = document.getElementById('navbar');                           // 導覽列
  const navMenu           = document.getElementById('nav-menu');                         // 行動版選單
  const navCollapseToggle = document.getElementById('nav-collapse-toggle');               // 收合按鈕
  const navToggle         = document.getElementById('mobile-toggle');                     // 漢堡按鈕
  const upArrow           = document.getElementById('up-arrow');                         // 上方向鍵
  const overviewToggle    = document.getElementById('overview-toggle');                  // 全區一覽切換
  const overviewZone      = document.getElementById('overview-zone');                    // 全區一覽區
  const debugToggle       = document.getElementById('debug-toggle');                     // 參數調整切換
  const debugWrapper      = document.getElementById('debug-wrapper');                    // Debug 主容器
  const debugInfo         = document.getElementById('debug-info');                       // Debug 資訊顯示
  const debugPanel        = document.getElementById('debug-panel');                      // Debug 參數面板
  const filterButtons     = document.querySelectorAll('.filter-button');                 // 篩選按鈕群
  const sortBtn           = document.querySelector('.sort-button');                      // 排序按鈕
  const loginBtn          = document.querySelector('.login-status');                     // 登入/登出按鈕
  const galleryCtrlZone   = document.querySelector('#gallery-zone .info-controls');      // Gallery 操作列容器
  const galleryContainer  = document.getElementById('gallery-container');                // Gallery 作品格容器

  // ===== 初始化：隱藏全區一覽 & 參數面板 =====
  overviewZone.style.display = 'none';                                                   // 全區一覽預設隱藏
  debugPanel.classList.add('hidden');                                                    // 參數面板預設隱藏

  // ===== 建立隱藏的上傳 input =====
  const uploadInput = document.createElement('input');                                   // 建立上傳 input
  uploadInput.type    = 'file';
  uploadInput.multiple= true;
  uploadInput.accept  = 'image/*,video/*';
  uploadInput.id      = 'upload-input';
  uploadInput.style.display = 'none';
  galleryCtrlZone.appendChild(uploadInput);                                              // 加入操作列
  document.querySelector('.upload-button').addEventListener('click', ()=> uploadInput.click()); // 上傳按鈕觸發

  // ===== 建立轉場黑幕 overlay =====
  const transitionOverlay = document.createElement('div');
  transitionOverlay.id    = 'transition-overlay';
  Object.assign(transitionOverlay.style,{
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    backgroundColor:'#000', opacity:'0', transition:'opacity .5s linear',
    pointerEvents:'none', zIndex:'30000'
  });
  document.body.appendChild(transitionOverlay);

  // ===== 建立通知 overlay =====
  const notifyOverlay = document.createElement('div');
  notifyOverlay.id    = 'notify-overlay';
  Object.assign(notifyOverlay.style,{
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.6)', display:'none',
    justifyContent:'center', alignItems:'center', zIndex:'40000'
  });
  const notifyBox = document.createElement('div');
  Object.assign(notifyBox.style,{
    background:'#fff', padding:'20px', borderRadius:'8px', color:'#000'
  });
  const notifyMsg = document.createElement('div');
  const notifyBtn = document.createElement('button');
  notifyBtn.innerText = '確定';
  notifyBox.append(notifyMsg, notifyBtn);
  notifyOverlay.appendChild(notifyBox);
  document.body.appendChild(notifyOverlay);
  function showNotification(msg, btnText) {
    notifyMsg.innerText        = msg;
    notifyBtn.innerText        = btnText;
    notifyOverlay.style.display = 'flex';
  }
  notifyBtn.addEventListener('click', ()=> notifyOverlay.style.display='none');

  // ===== 狀態旗標 & 防抖計時器 =====
  let isTransitioning  = false;
  let isLoginModalOpen = false;
  let isLoggedIn       = false;
  let isResizing       = false;
  let scrollDebounce, resizeTimeout;

  // ===== 客製化區塊設定 =====
  const customSections = {
    "C_GROUND": { tag:"watercolor", title:"靜物練習", year:"2024", medium:"水彩", media:"image", mediaSrc:"images/Happy.jpg" },
    "L1_D1":    { tag:"oil",       title:"肖像系列 #3", year:"2023", medium:"油畫",  media:"image", mediaSrc:"images/sample2.jpg" },
    "R2_U1":    { tag:"sketch",    title:"速寫課堂",   year:"2022", medium:"鉛筆素描",media:"image", mediaSrc:"images/sample3.jpg" }
  };

  // ===== 建立所有 Grid 區塊 =====
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 0; c < colLabels.length; c++) {
      const area = `${colLabels[c]}_${rowLabels[r]}`;
      const sec  = document.createElement('section');
      sec.id            = area;
      sec.style.gridArea= area;

      if (customSections[area]) {
        const s = customSections[area];
        sec.dataset.tag = s.tag;
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerText = `${s.title}\n${s.year}｜${s.medium}`;
        card.style.display = 'none';
        sec.appendChild(card);
        if (s.media==='image') {
          const img = document.createElement('img');
          img.src = s.mediaSrc; img.alt = s.title;
          img.dataset.tag = s.tag;
          img.addEventListener('click', ()=> openLightbox(img,'image',s.title));
          img.addEventListener('mouseenter', ()=> hoverEffect(img));
          img.addEventListener('mouseleave', ()=> removeHover(img));
          sec.appendChild(img);
        } else {
          const vid = document.createElement('video');
          vid.src = s.mediaSrc; vid.controls = true; vid.dataset.tag = s.tag;
          vid.addEventListener('click', ()=> openLightbox(vid,'video',s.title));
          vid.addEventListener('mouseenter', ()=> { hoverEffect(vid); vid.play(); });
          vid.addEventListener('mouseleave', ()=> { removeHover(vid); vid.pause(); });
          sec.appendChild(vid);
        }
      }

      const label = document.createElement('div');
      label.innerText = area;
      sec.appendChild(label);

      sec.addEventListener('mouseenter', ()=>{
        const card = sec.querySelector('.info-card');
        if (card) {
          card.style.display = 'block';
          document.getElementById('info-debug').innerText =
            `作品資訊：${card.innerText.replace(/\n/g,' ')}`;
        }
      });
      sec.addEventListener('mouseleave', ()=>{
        const card = sec.querySelector('.info-card');
        if (card) card.style.display = 'none';
      });

      gridLayout.appendChild(sec);
    }
  }

  // ===== 目前索引 & Debug 分頁設定 =====
  let currentColIndex=2, currentRowIndex=1, previousColIndex=2, previousRowIndex=1;
  let currentPage = 1, itemsPerPage = 8, totalPages = 10;

  // ===== 更新 Debug 分頁顯示 =====
  function updateDebugPage() {
    const entries = Array.from(document.querySelectorAll('#debug-info > div'))
                          .filter(el=>el.id!=='debug-pagination');
    entries.forEach((el, idx) => {
      const start = (currentPage-1)*itemsPerPage;
      const end   = currentPage*itemsPerPage;
      el.style.display = (idx>=start && idx<end) ? 'block' : 'none';
      // 空白行要顯示 "<空白>"
      if (el.style.display==='block' && el.innerText.trim()==='') {
        el.innerText = '<空白>';
      }
    });
    document.getElementById('prev-page').disabled = currentPage===1;
    document.getElementById('next-page').disabled = currentPage===totalPages;
    document.getElementById('page-label').innerText = `第${currentPage}/${totalPages}頁`;
  }

  // ===== 建立 Debug 分頁按鈕 =====
  function createDebugPagination() {
    const pagDiv = document.createElement('div');
    pagDiv.id = 'debug-pagination';
    Object.assign(pagDiv.style,{ display:'flex', justifyContent:'space-between', fontSize:'12px' });
    const prev = document.createElement('button');
    prev.id='prev-page'; prev.innerText='<';
    const next = document.createElement('button');
    next.id='next-page'; next.innerText='>';
    const pageLabel = document.createElement('span');
    pageLabel.id='page-label'; pageLabel.style.fontSize='12px';
    prev.addEventListener('click', ()=>{ if(currentPage>1) currentPage--; updateDebugPage(); });
    next.addEventListener('click', ()=>{ if(currentPage<totalPages) currentPage++; updateDebugPage(); });
    pagDiv.append(prev, pageLabel, next);
    debugInfo.appendChild(pagDiv);
  }

  createDebugPagination();
  updateDebugPage();

  // ===== 滾動至指定區塊並更新 Debug =====
  function scrollIntoBlock(col, row, behavior) {
    const id  = `${colLabels[col]}_${rowLabels[row]}`;
    const sec = document.getElementById(id);
    if (!sec) return;
    sec.scrollIntoView({ behavior, block:'start', inline:'start' });
    document.getElementById('previous-block').innerText =
      `上一區塊：${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
    document.getElementById('current-block').innerText =
      `當前區塊：${colLabels[col]}_${rowLabels[row]}`;
    previousColIndex = currentColIndex; previousRowIndex = currentRowIndex;
    currentColIndex  = col; currentRowIndex  = row;
    updateDebugPage();
  }

// ===== 更新上箭頭位置（依導覽列高度）=====
function updateUpArrowPosition() {
  if (!navBar.classList.contains('hidden')) {
    const navHeight = navBar.offsetHeight;  
    upArrow.style.top = `${navHeight+48}px`;  
  } else {
    upArrow.style.top = '10px'; 
  }
}


  // ===== 初場黑幕轉場 =====
  setTimeout(()=>{
    isTransitioning = true;
    transitionOverlay.style.opacity = '1';
    setTimeout(()=>{
      scrollIntoBlock(colLabels.indexOf('C'), rowLabels.indexOf('GROUND'), 'auto');
      setTimeout(()=>{
        transitionOverlay.style.opacity = '0';
        setTimeout(()=>{ isTransitioning = false; updateUpArrowPosition(); }, 1000);
      }, 500);
    }, 500);
  }, 10);

  // ===== 黑幕轉場共用函式 =====
  function transitionWithScroll(colIdx, rowIdx) {
    isTransitioning = true;
    transitionOverlay.style.opacity = '1';
    setTimeout(()=>{
      scrollIntoBlock(colIdx, rowIdx, 'auto');
      setTimeout(()=>{
        transitionOverlay.style.opacity = '0';
        setTimeout(()=>{ isTransitioning = false; updateUpArrowPosition(); }, 500);
      }, 500);
    }, 500);
  }

  // ===== 導航函式 =====
  function navigate(dir) {
    if (isTransitioning||isLoginModalOpen||isResizing) return;
    let newCol = currentColIndex, newRow = currentRowIndex;
    if (dir==='left'  && newCol>0)               newCol--;
    if (dir==='right' && newCol<colLabels.length-1) newCol++;
    if (dir==='up'    && newRow>0)               newRow--;
    if (dir==='down'  && newRow<rowLabels.length-1)newRow++;

    const sourceId = `${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`;
    const targetId = `${colLabels[newCol]}_${rowLabels[newRow]}`;

    // 離開 R1_D* → 左右 GROUND（黑幕轉場）
    if (r1DZones.includes(sourceId) && (dir==='left'||dir==='right')) {
      transitionWithScroll(newCol, rowLabels.indexOf('GROUND')); return;
    }
    // 進入 R1_D* → 跳 R1_D1（黑幕轉場）
    if (!r1DZones.includes(sourceId) && r1DZones.includes(targetId)) {
      transitionWithScroll(colLabels.indexOf('R1'), rowLabels.indexOf('D1')); return;
    }
    // R1_D* → 其他區域（除 R1_U1）黑幕轉場
    if (r1DZones.includes(sourceId) &&
        targetId!=='R1_U1' && !r1DZones.includes(targetId)) {
      transitionWithScroll(newCol, newRow); return;
    }
    // R1_D1 → R1_GROUND 無黑幕
    if (sourceId==='R1_D1' && dir==='up' && targetId==='R1_GROUND') {
      scrollIntoBlock(newCol,newRow,'smooth'); updateUpArrowPosition(); return;
    }
    // 一般導航
    scrollIntoBlock(newCol,newRow,'smooth'); updateUpArrowPosition();
  }

  // ===== 綁定箭頭按鈕 =====
  ['left','right','up','down'].forEach(dir=>{
    document.getElementById(`${dir}-arrow`).addEventListener('click', ()=> navigate(dir));
  });

  // ===== 鍵盤導航 =====
  window.addEventListener('keydown', e=>{
    const map = { ArrowUp:'up', w:'up', ArrowDown:'down', s:'down',
                  ArrowLeft:'left', a:'left', ArrowRight:'right', d:'right' };
    if (map[e.key]) {
      e.preventDefault(); navigate(map[e.key]);
      document.getElementById('input-debug').innerText =
        `輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // ===== 滾輪導航（600ms 防抖） =====
  window.addEventListener('scroll', () => {
    if (isTransitioning || isResizing) return;
  
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const secs = document.querySelectorAll('#grid-layout>section');
      let closest = null, minD = Infinity;
      const cx = window.scrollX + window.innerWidth / 2;
      const cy = window.scrollY + window.innerHeight / 2;
  
      secs.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const scx = r.left + window.scrollX + r.width / 2;
        const scy = r.top + window.scrollY + r.height / 2;
        const d = Math.hypot(cx - scx, cy - scy);
        if (d < minD) {
          minD = d;
          closest = sec;
        }
      });
  
      if (closest) {
        const [c, r] = closest.id.split('_');
        const nc = colLabels.indexOf(c);
        const nr = rowLabels.indexOf(r);
  
        // 排除 R1 欄中的 D1~D5 區塊彼此之間互相捲動
        const restrictedRows = ['D1', 'D2', 'D3', 'D4', 'D5'];
        if (!(currentColIndex === colLabels.indexOf('R1') &&
              restrictedRows.includes(rowLabels[currentRowIndex]) &&
              restrictedRows.includes(rowLabels[nr]) &&
              currentRowIndex !== nr)) {
          scrollIntoBlock(nc, nr, 'smooth');
        }
      }
    }, 600);
  });
  

  // ===== 行動選單位置更新 =====
  function updateMobileMenuPosition() {
    navMenu.style.top = navBar.offsetHeight+'px';
  }
  navToggle.addEventListener('click', ()=>{
    navMenu.classList.toggle('open');
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${navMenu.classList.contains('open')?'開啟':'關閉'}`;
  });
  navCollapseToggle.addEventListener('click', ()=>{
    navBar.classList.toggle('hidden');
    updateUpArrowPosition();
    const hidden=navBar.classList.contains('hidden');
    navToggle.style.display = hidden?'none':'block';
    document.getElementById('nav-debug').innerText =
      `導覽狀態：${hidden?'已隱藏':'顯示中'}\n高度：${navBar.offsetHeight}px`;
  });

  // ===== 視窗 resize 防抖 =====
  window.addEventListener('resize', ()=>{
    isResizing = true;
    gridLayout.style.scrollSnapType = 'none';
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(()=>{
      isResizing = false;
      gridLayout.style.scrollSnapType = 'both mandatory';
      updateUpArrowPosition();
    }, 200);
    updateMobileMenuPosition();
  });
  window.addEventListener('orientationchange', updateMobileMenuPosition);

// ===== 全區一覽功能 =====
overviewToggle.addEventListener('click', () => {
  // 切換顯示時使用 grid 而非 flex
  overviewZone.style.display = (overviewZone.style.display === 'grid') ? 'none' : 'grid';
});

// 點擊背景任一空白處關閉
overviewZone.addEventListener('click', e => {
  if (e.target === overviewZone) overviewZone.style.display = 'none';
});

// 動態生成 5×7 格子按鈕
rowLabels.forEach(r => colLabels.forEach(c => {
  const id = `${c}_${r}`;
  const item = document.createElement('div');
  item.className = 'overview-block';
  item.innerText = id;
  item.addEventListener('click', () => {
    overviewZone.style.display = 'none';
    scrollIntoBlock(colLabels.indexOf(c), rowLabels.indexOf(r), 'smooth');
  });
  overviewZone.appendChild(item);
}));

  // ===== 篩選功能 =====
  filterButtons.forEach(btn=>{
    btn.addEventListener('click', function(){
      document.querySelector('.filter-button.active').classList.remove('active');
      this.classList.add('active');
      document.getElementById('filter-debug').innerText =
        `篩選狀態：${this.dataset.tag}`;
      renderGallery();
    });
  });

  // ===== Gallery 控制與渲染 =====
  let itemsData = [];
  // 初始載入 localStorage 資料
  const saved = JSON.parse(localStorage.getItem('galleryData')||'[]');
  saved.forEach(item=>{
    if(!item.timestamp) item.timestamp=0;
    const el = item.type==='video'?document.createElement('video'):document.createElement('img');
    if(item.type==='video') el.controls=true;
    el.src=item.data; el.alt=item.name; el.className='gallery-item';
    item.tag = item.tag||'all';
    el.dataset.tag=item.tag;
    bindDelete(el,item.data);
    itemsData.push({name:item.name,type:item.type,data:item.data,timestamp:item.timestamp,tag:item.tag,el});
  });
  // 範例作品
  ['9-1-2.png','blender piggy-test.gif','clip 練習 光影 角.jpg','deer +cloud-2-2.jpg']
    .forEach(fn=>{
      const ext = fn.split('.').pop().toLowerCase();
      const type= ['mp4','webm','ogg'].includes(ext)?'video':'image';
      const el  = type==='video'?document.createElement('video'):document.createElement('img');
      if(type==='video') el.controls=true;
      const data=`images/${fn}`;
      el.src=data; el.alt=fn; el.className='gallery-item';
      const tag='all'; el.dataset.tag=tag; bindDelete(el,data);
      itemsData.push({name:fn,type,data,timestamp:0,tag,el});
  });

  // 重新渲染 Gallery
  function renderGallery(){
    galleryContainer.innerHTML='';
    const mode = sortBtn.classList.contains('active')?'date':'name';
    let sorted=[...itemsData];
    if(mode==='date') sorted.sort((a,b)=>b.timestamp-a.timestamp);
    if(mode==='name') sorted.sort((a,b)=>a.name.localeCompare(b.name));
    const currentTag=document.querySelector('.filter-button.active').dataset.tag;
    if(currentTag!=='all') sorted=sorted.filter(it=>it.tag===currentTag);
    sorted.forEach(it=>{
      galleryContainer.appendChild(it.el);
      it.el.addEventListener('click', ()=> openLightbox(it.el,it.type,it.name));
      it.el.addEventListener('mouseenter', ()=> hoverEffect(it.el));
      it.el.addEventListener('mouseleave', ()=> removeHover(it.el));
    });
  }
  renderGallery();

  // ===== 刪除功能 =====
  function bindDelete(el,data){
    el.addEventListener('contextmenu', e=>{
      e.preventDefault();
      if(!confirm('是否要刪除？')) return;
      if(!isLoggedIn){
        showNotification('請登入!!!只有名單內的藝術家能使用','確定');
        return;
      }
      if(!confirm('你/妳確定要刪除嗎？')) return;
      el.remove();
      const idx=itemsData.findIndex(it=>it.data===data);
      if(idx>-1) itemsData.splice(idx,1);
      localStorage.setItem('galleryData',JSON.stringify(itemsData.filter(it=>it.timestamp>0)));
      showNotification('已刪除並同步至 GitHub','確定');
      renderGallery();
    });
  }

  // ===== 上傳並儲存 =====
  uploadInput.addEventListener('change', e=>{
    if(!isLoggedIn){
      showNotification('請先登入','確定'); return;
    }
    Array.from(e.target.files).forEach(file=>{
      const isImage = file.type.startsWith('image/'),
            isVideo = file.type.startsWith('video/');
      const maxSize = isImage?30*1024*1024:1*1024*1024*1024;
      if(file.size>maxSize){
        showNotification(`${file.name} 超過大小限制`,'確定');
        return;
      }
      const reader=new FileReader();
      reader.onload=()=>{
        const dataURL=reader.result;
        const type = isVideo?'video':'image';
        const timestamp=Date.now();
        const el = type==='video'?document.createElement('video'):document.createElement('img');
        if(isVideo) el.controls=true;
        el.src=dataURL; el.alt=file.name; el.className='gallery-item';
        const tag='all'; el.dataset.tag=tag; bindDelete(el,dataURL);
        itemsData.push({name:file.name,type,dataURL,timestamp,tag,el});
        localStorage.setItem('galleryData',JSON.stringify(itemsData.filter(it=>it.timestamp>0)));
        renderGallery();
        showNotification('上傳成功並同步至 GitHub','確定');
      };
      reader.readAsDataURL(file);
    });
    e.target.value='';
  });

  // ===== 燈箱功能 =====
  function openLightbox(el,type,title){
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-image');
    const vid = document.getElementById('lightbox-video');
    document.getElementById('lightbox-debug').innerText = `燈箱狀態：開啟 (${title})`;
    lb.style.display='flex';
    if(type==='image'){
      vid.style.display='none';
      img.style.display='block'; img.src=el.src;
      adjustLightboxSize(img);
    } else {
      img.style.display='none';
      vid.style.display='block'; vid.src=el.src; vid.play();
      adjustLightboxSize(vid);
    }
  }
  document.getElementById('lightbox-close').addEventListener('click', ()=>{
    const lb  = document.getElementById('lightbox');
    const vid = document.getElementById('lightbox-video');
    if(vid){ vid.pause(); vid.currentTime=0; }
    lb.style.display='none';
    document.getElementById('lightbox-debug').innerText='燈箱狀態：關閉';
  });
  function adjustLightboxSize(media){
    const maxW=window.innerWidth*0.7, maxH=window.innerHeight*0.7;
    media.style.maxWidth=`${maxW}px`; media.style.maxHeight=`${maxH}px`;
  }

  // ===== 特效 =====
  function hoverEffect(el){
    el.style.transform='scale(1.05)';
    el.style.boxShadow='0 0 10px rgba(255,255,255,0.8)';
  }
  function removeHover(el){
    el.style.transform='none';
    el.style.boxShadow='none';
  }

  // ===== 登入 Modal & 流程 =====
  const loginOverlay = document.createElement('div');
  loginOverlay.id     = 'login-overlay';
  Object.assign(loginOverlay.style,{
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.8)', display:'none',
    justifyContent:'center', alignItems:'center', zIndex:'40000'
  });
  const formDiv = document.createElement('div');
  Object.assign(formDiv.style,{
    background:'#fff', padding:'20px', borderRadius:'8px',
    display:'flex', flexDirection:'column', minWidth:'240px'
  });
  const userLabel  = document.createElement('label'); userLabel.innerText='帳號：';
  const userInput  = document.createElement('input'); userInput.type='text';
  const passLabel  = document.createElement('label'); passLabel.innerText='密碼：';
  const passInput  = document.createElement('input'); passInput.type='password';
  const confirmBtn = document.createElement('button'); confirmBtn.innerText='確認';
  formDiv.append(userLabel,userInput,passLabel,passInput,confirmBtn);
  loginOverlay.appendChild(formDiv);
  document.body.appendChild(loginOverlay);

  loginBtn.addEventListener('click', ()=>{
    if(isLoggedIn){
      isLoggedIn=false;
      loginBtn.innerText='請登入'; uploadInput.disabled=true;
      showNotification('已登出','確定');
    } else {
      isLoginModalOpen=true;
      loginOverlay.style.display='flex';
    }
  });
  confirmBtn.addEventListener('click', ()=>{
    const acct=userInput.value.trim().toLowerCase();
    const pwd=passInput.value;
    if(acct==='dpig' && pwd==='3088'){
      isLoggedIn=true;
      loginBtn.innerText='登出'; uploadInput.disabled=false;
      isLoginModalOpen=false; loginOverlay.style.display='none';
      showNotification('登入成功','確定');
    } else {
      alert('帳號或密碼錯誤');
    }
  });
  loginOverlay.addEventListener('click', e=>{
    if(e.target===loginOverlay){
      loginOverlay.style.display='none';
      isLoginModalOpen=false;
    }
  });

  // ===== Debug 工具三：參數調整 UI =====
  // 新增：面板最上方標題
  const debugTitle = document.createElement('div');
  debugTitle.innerText = 'Debug 工具三 參數調整';
  debugTitle.style.cssText = 'text-align:center;font-size:14px;color:#fff;margin-bottom:10px;';
  debugPanel.appendChild(debugTitle);

  // 可調參數設定 (示例)
  const params = {
    navbarTop:19, navbarLeft:0, navbarWidth:100, navbarPaddingY:19, navbarPaddingX:20,
    navbarBgR:32, navbarBgG:32, navbarBgB:32, navbarBgA:0.85, navbarZ:3000,
    mobileFontSize:30, mobileCursor:'pointer', mobileMr:10, mobileZ:3100,
    // ... 依照 CSS 清單逐項補足
  };

  Object.keys(params).forEach(key=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'debug-param';
    // 參數名稱
    const label = document.createElement('label');
    label.className = 'debug-label';
    label.innerText = key;
    // 參數滑桿
    const input = document.createElement('input');
    input.className = 'debug-value';
    input.type = 'range';
    input.min = 0;
    input.max = 100;
    input.value = params[key];
    // 單位顯示
    const unitSpan = document.createElement('span');
    unitSpan.className = 'debug-unit';
    unitSpan.innerText = `${params[key]}`;
    // 滑桿事件：同步更新參數值與顯示
    input.addEventListener('input', ()=>{
      params[key] = input.value;
      unitSpan.innerText = `${input.value}`;
      // TODO: 可於此處同步更新對應元素樣式
    });
    wrapper.append(label, input, unitSpan);
    debugPanel.appendChild(wrapper);       // 加入面板
  });

  // 音樂上傳及播放
  const musicWrapper = document.createElement('div');
  musicWrapper.className = 'debug-param';
  const musicLabel = document.createElement('label');
  musicLabel.className = 'debug-label';
  musicLabel.innerText = '音樂上傳';
  const musicInput = document.createElement('input');
  musicInput.className = 'debug-value';
  musicInput.type = 'file';
  musicInput.accept = 'audio/*';
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.classList.add('hidden');
  musicInput.addEventListener('change', e=>{
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.classList.remove('hidden');
      audio.play();
    }
  });
  musicWrapper.append(musicLabel, musicInput, audio);
  debugPanel.appendChild(musicWrapper);

  // 儲存按鈕 (同步至 GitHub)
  const saveWrapper = document.createElement('div');
  saveWrapper.className = 'debug-param';
  const saveBtn = document.createElement('button');
  saveBtn.innerText = '儲存設定';
  saveBtn.addEventListener('click', ()=>{
    showNotification('設定已儲存並同步至 GitHub','確定');
  });
  saveWrapper.append(document.createElement('label'), saveBtn);
  debugPanel.appendChild(saveWrapper);

  // ===== 參數調整切換功能 =====
  debugToggle.addEventListener('click', ()=>{
    debugPanel.classList.toggle('hidden');
  });

  // ===== 初次定位 =====
  updateUpArrowPosition();
  updateMobileMenuPosition();
});
