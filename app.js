const db = FB.db, auth = FB.auth;
const els = id => document.getElementById(id);
const state = { uid:null, activeFolder:null, unsubFolders:null, unsubEntries:null };
function show(id){ els(id).classList.remove('hidden'); } function hide(id){ els(id).classList.add('hidden'); }
function btn(text, fn){ const b=document.createElement('button'); b.className='btn secondary'; b.textContent=text; b.onclick=fn; return b; }
function toast(m){ alert(m); }

// Auth
els('btnLogin').onclick = async ()=>{
  const email=els('email').value.trim(), pass=els('password').value;
  if(!email || pass.length<6) return els('loginError').textContent='أدخل بريدًا وكلمة سر صحيحة.';
  els('loginError').textContent='';
  try{ await auth.signInWithEmailAndPassword(email, pass); }catch(e){ els('loginError').textContent=e.message; }
};
els('btnSignup').onclick = async ()=>{
  const email=els('email').value.trim(), pass=els('password').value;
  if(!email || pass.length<6) return els('loginError').textContent='أدخل بريدًا وكلمة سر صحيحة.';
  els('loginError').textContent='';
  try{ await auth.createUserWithEmailAndPassword(email, pass); }catch(e){ els('loginError').textContent=e.message; }
};
els('btnLogout').onclick = ()=>auth.signOut();
auth.onAuthStateChanged(u=>{
  if(u){ state.uid=u.uid; els('userTag').textContent=u.email; els('userTag').classList.remove('hidden'); hide('loginView'); show('mainView'); subscribeFolders(); }
  else{ state.uid=null; els('userTag').classList.add('hidden'); show('loginView'); hide('mainView'); if(state.unsubFolders) state.unsubFolders(); if(state.unsubEntries) state.unsubEntries(); els('foldersGrid').innerHTML=''; els('entriesGrid').innerHTML=''; hide('entriesPanel'); }
});

// Firestore refs
function foldersCol(){ return db.collection('users').doc(state.uid).collection('folders'); }
function entriesCol(){ return db.collection('users').doc(state.uid).collection('entries'); }

// Folders UI
function subscribeFolders(){
  if(state.unsubFolders) state.unsubFolders();
  state.unsubFolders = foldersCol().orderBy('createdAt').onSnapshot(snap=>{
    const grid=els('foldersGrid'); grid.innerHTML='';
    if(snap.empty){ const d=document.createElement('div'); d.className='muted'; d.textContent='لا توجد مجلدات بعد.'; grid.appendChild(d); return; }
    snap.forEach(doc=>{
      const f=doc.data(); f.id=doc.id;
      const card=document.createElement('div'); card.className='folder';
      const name=document.createElement('div'); name.className='name'; name.textContent=f.name;
      const actions=document.createElement('div'); actions.className='actions';
      const open=btn('فتح', ()=>openFolder(f.id, f.name));
      const rename=btn('إعادة تسمية', async()=>{ const n=prompt('اسم المجلد:', f.name); if(!n) return; await foldersCol().doc(f.id).update({name:n}); });
      const del=btn('حذف', async()=>{
        if(!confirm('حذف المجلد وجميع الحسابات؟')) return;
        const q=await entriesCol().where('folderId','==',f.id).get();
        const batch=db.batch(); q.forEach(d=>batch.delete(d.ref)); batch.delete(foldersCol().doc(f.id)); await batch.commit();
      }); del.classList.add('red');
      actions.append(open,rename,del); card.append(name,actions); grid.appendChild(card);
    });
  });
}
els('btnAddFolder').onclick = async ()=>{ const name=prompt('اسم المجلد:'); if(!name) return; await foldersCol().add({name, createdAt:firebase.firestore.FieldValue.serverTimestamp()}); };

// Entries UI
async function openFolder(id,name){
  state.activeFolder=id; els('entriesTitle').textContent='الحسابات — '+name; show('entriesPanel');
  if(state.unsubEntries) state.unsubEntries();
  state.unsubEntries = entriesCol().where('folderId','==',id).orderBy('createdAt').onSnapshot(snap=>renderEntries(snap));
}
function renderEntries(snap){
  const grid=els('entriesGrid'); grid.innerHTML='';
  if(snap.empty){ const d=document.createElement('div'); d.className='muted'; d.textContent='لا توجد حسابات.'; grid.appendChild(d); return; }
  snap.forEach(doc=>{
    const e=doc.data(); e.id=doc.id;
    const card=document.createElement('div'); card.className='entryCard';
    const account=document.createElement('div'); account.className='account'; account.textContent=e.accountName;
    const user=document.createElement('div'); user.textContent='👤 '+e.username;
    const pw=document.createElement('div'); pw.textContent='••••••'; pw.dataset.real=e.password; pw.dataset.hidden='1';
    const notes=document.createElement('div'); notes.className='muted'; notes.textContent=e.notes||'';
    const actions=document.createElement('div'); actions.className='actions';
    const showBtn=btn('إظهار',()=>{ if(pw.dataset.hidden==='1'){pw.textContent=pw.dataset.real;pw.dataset.hidden='0';} else {pw.textContent='••••••';pw.dataset.hidden='1';}});
    const copyU=btn('نسخ المستخدم',()=>navigator.clipboard.writeText(e.username));
    const copyP=btn('نسخ كلمة السر',()=>navigator.clipboard.writeText(e.password));
    const edit=btn('تعديل',async()=>{
      const acc=prompt('اسم الحساب', e.accountName); if(acc==null) return;
      const un=prompt('اسم المستخدم', e.username); if(un==null) return;
      const pwv=prompt('كلمة السر', e.password); if(pwv==null) return;
      const nt=prompt('ملاحظات (اختياري)', e.notes||''); if(nt==null) return;
      await entriesCol().doc(e.id).update({accountName:acc, username:un, password:pwv, notes:nt});
    });
    const del=btn('حذف',async()=>{ if(confirm('حذف هذا الحساب؟')) await entriesCol().doc(e.id).delete(); }); del.classList.add('red');
    actions.append(showBtn,copyU,copyP,edit,del); card.append(account,user,pw,notes,actions); grid.appendChild(card);
  });
}
els('btnAddEntry').onclick = async ()=>{
  if(!state.activeFolder) return toast('افتح مجلدًا أولًا.');
  const acc=prompt('اسم الحساب:'); if(!acc) return;
  const un=prompt('اسم المستخدم:'); if(un==null) return;
  const pw=prompt('كلمة السر:'); if(pw==null) return;
  const nt=prompt('ملاحظات (اختياري):')||'';
  await entriesCol().add({folderId:state.activeFolder, accountName:acc, username:un, password:pw, notes:nt, createdAt:firebase.firestore.FieldValue.serverTimestamp()});
};
els('btnCloseFolder').onclick=()=>{ hide('entriesPanel'); state.activeFolder=null; if(state.unsubEntries) state.unsubEntries(); };
