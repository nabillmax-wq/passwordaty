// تهيئة Firebase باستخدام COMPAT SDK عبر CDN (لا نحتاج أدوات بناء)
// ✅ ملاحظة مهمة: تم تصحيح storageBucket إلى appspot.com
const firebaseConfig = {
  apiKey: "AIzaSyBgJqS-Vil3l9lAzMO_6NNYePZW2HNGbH0",
  authDomain: "passwordaty.firebaseapp.com",
  projectId: "passwordaty",
  storageBucket: "passwordaty.appspot.com", // ✅ التصحيح هنا
  messagingSenderId: "50790211539",
  appId: "1:50790211539:web:d93f1a2cd59b849a345926",
  measurementId: "G-VBQQ4JVZS1"
};

// Initialize
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// حفظ الجلسة محليًا
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// عناصر الواجهة
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const btnLogout = document.getElementById('btnLogout');
const msg = document.getElementById('msg');

const authCard = document.getElementById('authCard');
const welcomeCard = document.getElementById('welcomeCard');
const welcomeTitle = document.getElementById('welcomeTitle');

// عرض رسالة
function showMsg(text, isError = true){
  msg.textContent = text || '';
  msg.style.color = isError ? '#E74C3C' : '#27AE60';
}

// تبديل الواجهات بحسب حالة المستخدم
auth.onAuthStateChanged((user)=>{
  if(user){
    authCard.classList.add('hidden');
    welcomeCard.classList.remove('hidden');
    const name = user.email || 'مستخدم';
    welcomeTitle.textContent = `مرحبًا ${name}`;
    showMsg('');
  }else{
    welcomeCard.classList.add('hidden');
    authCard.classList.remove('hidden');
  }
});

// دخول
btnLogin.addEventListener('click', async ()=>{
  try{
    if(!email.value || !password.value) return showMsg('الرجاء إدخال البريد وكلمة السر');
    await auth.signInWithEmailAndPassword(email.value.trim(), password.value);
    showMsg('تم تسجيل الدخول بنجاح', false);
  }catch(e){
    showMsg(parseAuthError(e));
  }
});

// إنشاء حساب
btnSignup.addEventListener('click', async ()=>{
  try{
    if(!email.value || !password.value) return showMsg('الرجاء إدخال البريد وكلمة السر');
    await auth.createUserWithEmailAndPassword(email.value.trim(), password.value);
    showMsg('تم إنشاء الحساب وتسجيل الدخول', false);
  }catch(e){
    showMsg(parseAuthError(e));
  }
});

// خروج
btnLogout.addEventListener('click', async ()=>{
  try{
    await auth.signOut();
  }catch(e){
    showMsg(parseAuthError(e));
  }
});

// تحويل أخطاء Firebase لرسائل ودّية
function parseAuthError(e){
  const code = (e && e.code) || '';
  switch(code){
    case 'auth/invalid-email': return 'عنوان البريد غير صحيح.';
    case 'auth/user-disabled': return 'تم تعطيل هذا الحساب.';
    case 'auth/user-not-found': return 'لا يوجد مستخدم بهذا البريد.';
    case 'auth/wrong-password': return 'كلمة السر غير صحيحة.';
    case 'auth/email-already-in-use': return 'هذا البريد مستخدم مسبقًا.';
    case 'auth/weak-password': return 'كلمة السر ضعيفة (6 أحرف على الأقل).';
    case 'auth/network-request-failed': return 'مشكلة في الشبكة. حاول مجددًا.';
    default: 
      if(String(e && e.message).includes('api-key') || String(e && e.message).includes('API key'))
        return 'تحقق من Web API Key وإعدادات المشروع.';
      return 'حدث خطأ: ' + (e && e.message ? e.message : 'غير معروف');
  }
}
