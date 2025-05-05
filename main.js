window.addEventListener('load', function() {
  const gridLayout    = document.getElementById('grid-layout');
  const colLabels     = ['L2','L1','C','R1','R2'];
  const rowLabels     = ['U1','GROUND','D1','D2','D3','D4','D5'];
  const r1DZones      = ['R1_D1','R1_D2','R1_D3','R1_D4','R1_D5'];

  const navBar            = document.getElementById('navbar');
  const navMenu           = document.getElementById('nav-menu');
  const navCollapseToggle = document.getElementById('nav-collapse-toggle');
  const navToggle         = document.getElementById('nav-toggle');
  const upArrow           = document.getElementById('up-arrow');
  const overviewButton    = document.getElementById('overview-button');
  const overviewOverlay   = document.getElementById('overview-overlay');
  const overviewGrid      = overviewOverlay.querySelector('.overview-grid');
  overviewOverlay.style.display = 'none';

  // 黑幕轉場
  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'transition-overlay';
  Object.assign(transitionOverlay.style, {
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    backgroundColor:'#000', opacity:'0', transition:'opacity .5s linear',
    pointerEvents:'none', zIndex:'30000'
  });
  document.body.appendChild(transitionOverlay);

  // 通知覆蓋
  const notifyOverlay = document.createElement('div');
  notifyOverlay.id = 'notify-overlay';
  Object.assign(notifyOverlay.style, {
    position:'fixed', top:'0', left:'0',
    width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.6)', display:'none',
    justifyContent:'center', alignItems:'center', zIndex:'40000'
  });
  const notifyBox = document.createElement('div');
  Object.assign(notifyBox.style, {
    background:'#fff', padding:'20px', borderRadius:'8px', color:'#000'
  });
  const notifyMsg = document.createElement('div');
  const notifyBtn = document.createElement('button');
  notifyBox.append(notifyMsg, notifyBtn);
  notifyOverlay.appendChild(notifyBox);
  document.body.appendChild(notifyOverlay);

  function showNotification(msg, btnText) {
    notifyMsg.innerText = msg;
    notifyBtn.innerText = btnText;
    notifyOverlay.style.display = 'flex';
  }
  notifyBtn.addEventListener('click', ()=> notifyOverlay.style.display = 'none');

  // 狀態旗標、防抖
  let isTransitioning=false, isLoginModalOpen=false, isLoggedIn=false, isResizing=false;
  let scrollDebounce, resizeTimeout;

  // 客製化區塊
  const customSections = {
    "C_GROUND": { tag:"watercolor", title:"靜物練習", year:"2024", medium:"水彩", media:"image", mediaSrc:"images/Happy.jpg" },
    "L1_D1":    { tag:"oil",       title:"肖像系列 #3", year:"2023", medium:"油畫", media:"image", mediaSrc:"images/sample2.jpg" },
    "R2_U1":    { tag:"sketch",    title:"速寫課堂",   year:"2022", medium:"鉛筆素描", media:"image", mediaSrc:"images/sample3.jpg" }
  };

  // 建 section
  for(let r=0;r<rowLabels.length;r++){
    for(let c=0;c<colLabels.length;c++){
      const area = `${colLabels[c]}_${rowLabels[r]}`;
      const sec  = document.createElement('section');
      sec.id = area; sec.style.gridArea = area;

      // 客製卡片
      if(customSections[area]){
        const s = customSections[area];
        sec.dataset.tag = s.tag;
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerText = `${s.title}\n${s.year}｜${s.medium}`;
        sec.appendChild(card);
        if(s.media==='image'){
          const img=document.createElement('img');
          img.src=s.mediaSrc; img.alt=s.title;
          img.addEventListener('click',()=>{
            document.getElementById('lightbox-image').src=img.src;
            document.getElementById('lightbox').style.display='flex';
            document.getElementById('lightbox-debug').innerText=`燈箱狀態：開啟 (${s.title})`;
          });
          sec.appendChild(img);
        }
      }

      // 標籤
      const label=document.createElement('div');
      label.innerText=area;
      sec.appendChild(label);

      // hover 顯示卡片
      sec.addEventListener('mouseenter',()=>{
        const card=sec.querySelector('.info-card');
        if(card){
          card.style.display='block';
          document.getElementById('info-debug').innerText=`作品資訊：${card.innerText.replace(/\n/g,' ')}`;
        }
      });
      sec.addEventListener('mouseleave', ()=>{
        const card=sec.querySelector('.info-card');
        if(card) card.style.display='none';
      });

      gridLayout.appendChild(sec);
    }
  }

  let currentColIndex=2, currentRowIndex=1, previousColIndex=2, previousRowIndex=1;

  function scrollIntoBlock(col, row, behavior){
    const id=`${colLabels[col]}_${rowLabels[row]}`;
    const sec=document.getElementById(id);
    if(!sec) return;
    sec.scrollIntoView({behavior, block:'start', inline:'start'});
    document.getElementById('previous-block').innerText=`上次區塊: ${colLabels[previousColIndex]}_${rowLabels[previousRowIndex]}`;
    document.getElementById('current-block').innerText=`當前區塊: ${colLabels[col]}_${rowLabels[row]}`;
    previousColIndex=currentColIndex; previousRowIndex=currentRowIndex;
    currentColIndex=col; currentRowIndex=row;
  }

  function updateUpArrowPosition(){
    upArrow.style.top = navBar.classList.contains('hidden') ? '20px' : '57px';
  }

  // 初場轉場
  setTimeout(()=>{
    isTransitioning=true;
    transitionOverlay.style.opacity='1';
    setTimeout(()=>{
      scrollIntoBlock(colLabels.indexOf('C'), rowLabels.indexOf('GROUND'), 'auto');
      setTimeout(()=>{
        transitionOverlay.style.opacity='0';
        setTimeout(()=>{
          isTransitioning=false;
          updateUpArrowPosition();
        },1000);
      },500);
    },500);
  },10);

  // 導航
  function navigate(dir){
    if(isTransitioning||isLoginModalOpen||isResizing) return;
    let newCol=currentColIndex, newRow=currentRowIndex;
    if(dir==='left'  && newCol>0) newCol--;
    if(dir==='right' && newCol<colLabels.length-1) newCol++;
    if(dir==='up'    && newRow>0) newRow--;
    if(dir==='down'  && newRow<rowLabels.length-1) newRow++;
    const sourceId=`${colLabels[currentColIndex]}_${rowLabels[currentRowIndex]}`;
    const targetId=`${colLabels[newCol]}_${rowLabels[newRow]}`;

    // 離開 R1_D* → 左右 GROUND（黑幕）
    if(r1DZones.includes(sourceId) && (dir==='left'||dir==='right')){
      isTransitioning=true;
      transitionOverlay.style.opacity='1';
      setTimeout(()=>{
        scrollIntoBlock(newCol, rowLabels.indexOf('GROUND'), 'auto');
        setTimeout(()=>{
          transitionOverlay.style.opacity='0';
          setTimeout(()=>{
            isTransitioning=false;
            updateUpArrowPosition();
          },500);
        },500);
      },500);
      return;
    }
    // 進入 R1_D* → 跳 R1_D1
    if(!r1DZones.includes(sourceId) && r1DZones.includes(targetId)){
      isTransitioning=true;
      transitionOverlay.style.opacity='1';
      setTimeout(()=>{
        scrollIntoBlock(colLabels.indexOf('R1'), rowLabels.indexOf('D1'), 'auto');
        setTimeout(()=>{
          transitionOverlay.style.opacity='0';
          setTimeout(()=>{
            isTransitioning=false;
            updateUpArrowPosition();
          },500);
        },500);
      },500);
      return;
    }
    // R1_D* → 其他非同列(非 R1_U1) 黑幕
    if(r1DZones.includes(sourceId) &&
       targetId!=='R1_U1' && !r1DZones.includes(targetId)){
      isTransitioning=true;
      transitionOverlay.style.opacity='1';
      setTimeout(()=>{
        scrollIntoBlock(newCol,newRow,'auto');
        setTimeout(()=>{
          transitionOverlay.style.opacity='0';
          setTimeout(()=>{
            isTransitioning=false;
            updateUpArrowPosition();
          },500);
        },500);
      },500);
      return;
    }
    // R1_D1 → R1_GROUND 無黑幕
    if(sourceId==='R1_D1' && dir==='up' && targetId==='R1_GROUND'){
      scrollIntoBlock(newCol,newRow,'smooth');
      updateUpArrowPosition();
      return;
    }
    // 一般
    scrollIntoBlock(newCol,newRow,'smooth');
    updateUpArrowPosition();
  }

  // 綁箭頭按鈕 & 鍵盤
  ['left','right','up','down'].forEach(dir=>{
    document.getElementById(`${dir}-arrow`)
      .addEventListener('click',()=>navigate(dir));
  });
  window.addEventListener('keydown', e=>{
    const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
    if(map[e.key]){
      e.preventDefault();
      navigate(map[e.key]);
      document.getElementById('input-debug').innerText=`輸入狀態：${e.key.toUpperCase()} 觸發`;
    }
  });

  // 滾輪（600ms 防抖）
  window.addEventListener('scroll', ()=>{
    if(isTransitioning||isResizing) return;
    clearTimeout(scrollDebounce);
    scrollDebounce=setTimeout(()=>{
      const secs=document.querySelectorAll('#grid-layout>section');
      let closest=null, minD=Infinity;
      const cx=window.scrollX+window.innerWidth/2,
            cy=window.scrollY+window.innerHeight/2;
      secs.forEach(sec=>{
        const r=sec.getBoundingClientRect();
        const scx=r.left+window.scrollX+r.width/2,
              scy=r.top+window.scrollY+r.height/2;
        const d=Math.hypot(cx-scx,cy-scy);
        if(d<minD){minD=d;closest=sec;}
      });
      if(closest){
        const [c,r]=closest.id.split('_');
        const newCol=colLabels.indexOf(c),
              newRow=rowLabels.indexOf(r);
        // 禁 R1_D3↔R1_D4
        if(currentColIndex===colLabels.indexOf('R1')&&
           ((currentRowIndex===rowLabels.indexOf('D3')&&newRow===rowLabels.indexOf('D4'))||
            (currentRowIndex===rowLabels.indexOf('D4')&&newRow===rowLabels.indexOf('D3')))){
          return;
        }
        scrollIntoBlock(newCol,newRow,'smooth');
      }
    },600);
  });

  // 手機選單
  function updateMobileMenuPosition(){
    navMenu.style.top = navBar.offsetHeight+'px';
  }
  navToggle.addEventListener('click', ()=>{
    navMenu.classList.toggle('open');
    document.getElementById('nav-debug').innerText=`導覽狀態：${navMenu.classList.contains('open')?'開啟':'關閉'}`;
  });
  navCollapseToggle.addEventListener('click', ()=>{
    navBar.classList.toggle('hidden');
    updateUpArrowPosition();
    const hidden=navBar.classList.contains('hidden');
    navToggle.style.display=hidden?'none':'block';
    document.getElementById('nav-debug').innerText=`導覽狀態：${hidden?'已隱藏':'顯示中'}\n高度：${navBar.offsetHeight}px`;
  });

  // resize 防抖
  window.addEventListener('resize', ()=>{
    isResizing=true;
    gridLayout.style.scrollSnapType='none';
    clearTimeout(resizeTimeout);
    resizeTimeout=setTimeout(()=>{
      isResizing=false;
      gridLayout.style.scrollSnapType='both mandatory';
      updateUpArrowPosition();
    },200);
    updateMobileMenuPosition();
  });
  window.addEventListener('orientationchange', updateMobileMenuPosition);

  // 全區一覽
  overviewButton.addEventListener('click', ()=>{
    overviewOverlay.style.display = overviewOverlay.style.display==='flex'?'none':'flex';
  });
  overviewOverlay.addEventListener('click', e=>{
    if(e.target===overviewOverlay) overviewOverlay.style.display='none';
  });
  rowLabels.forEach(row=>colLabels.forEach(col=>{
    const id=`${col}_${row}`;
    const item=document.createElement('div');
    item.className='overview-item'; item.innerText=id;
    item.addEventListener('click', ()=>{
      overviewOverlay.style.display='none';
      scrollIntoBlock(colLabels.indexOf(col),rowLabels.indexOf(row),'smooth');
    });
    overviewGrid.appendChild(item);
  }));

  // gallery-zone 內 controls & gallery
  const galleryZone=document.getElementById('gallery-zone');
  const headerEl=document.createElement('div');
  headerEl.className='gallery-header'; headerEl.innerText='藝術作品總覽';
  const sortLabelEl=document.createElement('label');
  sortLabelEl.innerText='作品排序：';
  const sortSelectEl=document.createElement('select');
  sortSelectEl.id='sort-select';
  ['date','name','type'].forEach(val=>{
    const opt=document.createElement('option'); opt.value=val;
    if(val==='date') opt.text='以上傳日期排序';
    if(val==='name') opt.text='以作品名稱排序';
    if(val==='type'){opt.text='以作品種類排序';opt.disabled=true;}
    sortSelectEl.append(opt);
  });
  sortSelectEl.value='date';
  const loginBtn=document.createElement('button');
  loginBtn.id='login-button'; loginBtn.innerText='登入';
  const loginStatus=document.createElement('span');
  loginStatus.id='login-status'; loginStatus.innerText='未登入';
  const uploadInput=document.createElement('input');
  uploadInput.type='file'; uploadInput.id='upload-input';
  uploadInput.accept='image/*,video/*'; uploadInput.multiple=true; uploadInput.disabled=true;

  galleryZone.append(
    headerEl, sortLabelEl, sortSelectEl, document.createTextNode(' '),
    loginBtn, loginStatus, document.createElement('br'), uploadInput
  );

  const gallery=document.getElementById('gallery-container');
  let itemsData=[];

  // 還原本地儲存
  const saved=JSON.parse(localStorage.getItem('galleryData')||'[]');
  saved.forEach(item=>{
    if(!item.timestamp) item.timestamp=0;
    const el=item.type==='video'?document.createElement('video'):document.createElement('img');
    if(item.type==='video') el.controls=true;
    el.src=item.data; el.alt=item.name; el.className='gallery-item';
    bindDelete(el,item.data);
    itemsData.push({name:item.name,type:item.type,data:item.data,timestamp:item.timestamp,el});
  });

  // 預設檔案
  ['9-1-2.png','blender piggy-test.gif','clip 練習 光影 角.jpg','deer +cloud-2-2.jpg']
    .forEach(fn=>{
      const ext=fn.split('.').pop().toLowerCase();
      const type=['mp4','webm','ogg'].includes(ext)?'video':'image';
      const el=type==='video'?document.createElement('video'):document.createElement('img');
      if(type==='video') el.controls=true;
      const data=`images/${fn}`;
      el.src=data; el.alt=fn; el.className='gallery-item';
      bindDelete(el,data);
      itemsData.push({name:fn,type,data,timestamp:0,el});
    });

  function renderGallery(){
    gallery.innerHTML='';
    const mode=sortSelectEl.value;
    let sorted=[...itemsData];
    if(mode==='date') sorted.sort((a,b)=>b.timestamp-a.timestamp);
    if(mode==='name') sorted.sort((a,b)=>a.name.localeCompare(b.name));
    sorted.forEach(it=> gallery.appendChild(it.el));
  }
  sortSelectEl.addEventListener('change',renderGallery);

  function bindDelete(el,data){
    el.addEventListener('contextmenu',e=>{
      e.preventDefault();
      if(!confirm('是否要刪除？')) return;
      if(!isLoggedIn){
        showNotification('請登入!!!只有名單內的藝術家能使用','好哒，我知道囉!');
        return;
      }
      if(!confirm('你/妳確定嗎？')) return;
      el.remove();
      const idx=itemsData.findIndex(it=>it.data===data);
      if(idx>-1) itemsData.splice(idx,1);
      localStorage.setItem('galleryData',JSON.stringify(itemsData.filter(it=>it.timestamp>0)));
    });
  }

  uploadInput.addEventListener('change',e=>{
    if(!isLoggedIn){ alert('請先登入'); return; }
    Array.from(e.target.files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=()=>{
        const dataURL=reader.result;
        const type=file.type.startsWith('video/')?'video':'image';
        const timestamp=Date.now();
        const el=type==='video'?document.createElement('video'):document.createElement('img');
        if(type==='video') el.controls=true;
        el.src=dataURL; el.alt=file.name; el.className='gallery-item';
        bindDelete(el,dataURL);
        itemsData.push({name:file.name,type,dataURL,timestamp,el});
        localStorage.setItem('galleryData',JSON.stringify(itemsData.filter(it=>it.timestamp>0)));
        renderGallery();
      };
      reader.readAsDataURL(file);
    });
    uploadInput.value='';
  });

  // 登入 Modal
  const loginOverlay=document.createElement('div');
  loginOverlay.id='login-overlay';
  Object.assign(loginOverlay.style,{
    position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.8)', display:'none',
    justifyContent:'center', alignItems:'center', zIndex:'40000'
  });
  const formDiv2=document.createElement('div');
  Object.assign(formDiv2.style,{
    background:'#fff', padding:'20px', borderRadius:'8px',
    display:'flex', flexDirection:'column', minWidth:'240px'
  });
  const userLabel2=document.createElement('label'); userLabel2.innerText='帳號：';
  const userInput2=document.createElement('input'); userInput2.type='text';
  const passLabel2=document.createElement('label'); passLabel2.innerText='密碼：';
  const passInput2=document.createElement('input'); passInput2.type='password';
  const confirmBtn2=document.createElement('button'); confirmBtn2.innerText='確認';
  formDiv2.append(userLabel2,userInput2,passLabel2,passInput2,confirmBtn2);
  loginOverlay.appendChild(formDiv2);
  document.body.appendChild(loginOverlay);

  loginBtn.addEventListener('click',()=>{
    if(isLoggedIn){
      isLoggedIn=false;
      loginBtn.innerText='登入';
      loginStatus.innerText='未登入';
      uploadInput.disabled=true;
    } else {
      isLoginModalOpen=true;
      loginOverlay.style.display='flex';
    }
  });
  confirmBtn2.addEventListener('click',()=>{
    const acct=userInput2.value.trim().toLowerCase();
    const pwd=passInput2.value;
    if(acct==='dpig'&&pwd==='3088'){
      isLoggedIn=true;
      loginBtn.innerText='登出';
      loginStatus.innerText='已登入';
      uploadInput.disabled=false;
      loginOverlay.style.display='none';
      isLoginModalOpen=false;
    } else alert('帳號或密碼錯誤');
  });
  loginOverlay.addEventListener('click',e=>{
    if(e.target===loginOverlay){
      loginOverlay.style.display='none';
      isLoginModalOpen=false;
    }
  });

  renderGallery();
  updateUpArrowPosition();
  updateMobileMenuPosition();

});
