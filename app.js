// تهيئة Firebase عبر compat SDK (أنسب للصفحات الثابتة)
const firebaseConfig = {
  apiKey: "AIzaSyB7HnwfiV8EPdi7QWDc8cd2muFjLJhQVZc",
  authDomain: "passwordaty.firebaseapp.com",
  projectId: "passwordaty",
  storageBucket: "passwordaty.appspot.com",
  messagingSenderId: "50790211539",
  appId: "1:50790211539:web:d93f1a2cd59b849a345926",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// عناصر الواجهة
const emailEl = document.getElementById('email');
const passEl  = document.getElementById('password');
const msgEl   = document.getElementById('msg');
const authCard = document.getElementById('authCard');
const userCard = document.getElementById('userCard');
const userEmail = document.getElementById('userEmail');

document.getElementById('btnLogin').addEventListener('click', login);
document.getElementById('btnSignup').addEventListener('click', signup);
document.getElementById('btnLogout').addEventListener('click', logout);

// رسائل عربية شائعة
const AR_ERRORS = {
  'auth/invalid-email': 'صيغة البريد الإلكتروني غير صالحة.',
  'auth/missing-password': 'أدخل كلمة المرور.',
  'auth/wrong-password': 'كلمة المرور غير صحيحة.',
  'auth/user-not-found': 'لا يوجد مستخدم بهذا البريد.',
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم مسبقًا.',
  'auth/weak-password': 'كلمة المرور ضعيفة؛ استخدم 6 أحرف على الأقل.',
  'auth/configuration-not-found': 'لم يتم تفعيل طريقة الدخول أو الدومين غير مصرح به.'
};

function showMsg(text, ok=false){
  msgEl.textContent = text;
  msgEl.className = 'msg ' + (ok ? 'ok' : 'err');
}

// تسجيل الدخول
function login(){
  const email = emailEl.value.trim();
  const pass  = passEl.value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => showMsg('تم تسجيل الدخول بنجاح ✅', true))
    .catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

// إنشاء حساب
function signup(){
  const email = emailEl.value.trim();
  const pass  = passEl.value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => showMsg('تم إنشاء الحساب بنجاح 🎉', true))
    .catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

// تسجيل خروج
function logout(){
  auth.signOut().catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

// مراقبة حالة المستخدم لإظهار/إخفاء البطاقات
auth.onAuthStateChanged(user => {
  if (user){
    userEmail.textContent = user.email || '';
    authCard.classList.add('hidden');
    userCard.classList.remove('hidden');
    showMsg('');
  }else{
    userCard.classList.add('hidden');
    authCard.classList.remove('hidden');
  }
});
