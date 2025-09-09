// نسخة مبسطة — تخزين محلي فقط
let currentUser=null,vault={folders:[],entries:[]};
function el(id){return document.getElementById(id)}
function show(id){el(id).classList.remove('hidden')}
function hide(id){el(id).classList.add('hidden')}
el('btnSignup').onclick=function(){alert('تم إنشاء الحساب (محلي فقط).')}
el('btnLogin').onclick=function(){currentUser={email:el('email').value};hide('loginView');show('mainView');}
el('btnLogout').onclick=function(){currentUser=null;hide('mainView');show('loginView');}
el('btnAddFolder').onclick=function(){alert('ميزة إضافة مجلدات في النسخة المبسطة.')}
el('btnBackup').onclick=function(){alert('ميزة النسخ الاحتياطي قيد التطوير.')}
el('btnRestore').onclick=function(){alert('ميزة الاستعادة قيد التطوير.')}