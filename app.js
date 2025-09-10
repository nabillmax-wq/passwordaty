// تهيئة Firebase عبر compat SDK (أنسب للصفحات الثابتة).
const API_KEY = (window && window.PASSWORDATY_API_KEY) ? window.PASSWORDATY_API_KEY.trim() : "";

const firebaseConfig = {
  apiKey: API_KEY,
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

const AR_ERRORS = {
  'auth/invalid-api-key': 'مفتاح الـ API غير صالح — استخدم Web API Key الخاص بمشروع Firebase.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'مفتاح الـ API غير صالح — استخدم Web API Key الخاص بمشروع Firebase.',
  'auth/invalid-email': 'صيغة البريد الإلكتروني غير صالحة.',
  'auth/missing-password': 'أدخل كلمة المرور.',
  'auth/wrong-password': 'كلمة المرور غير صحيحة.',
  'auth/user-not-found': 'لا يوجد مستخدم بهذا البريد.',
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم مسبقًا.',
  'auth/weak-password': 'كلمة المرور ضعيفة؛ استخدم 6 أحرف على الأقل.',
  'auth/configuration-not-found': 'تحقق من تفعيل طريقة الدخول ومن إضافة الدومين في Authorized domains.'
};

function showMsg(text, ok=false){
  msgEl.textContent = text;
  msgEl.className = 'msg ' + (ok ? 'ok' : 'err');
}

function login(){
  const email = emailEl.value.trim();
  const pass  = passEl.value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => showMsg('تم تسجيل الدخول بنجاح ✅', true))
    .catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

function signup(){
  const email = emailEl.value.trim();
  const pass  = passEl.value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => showMsg('تم إنشاء الحساب بنجاح 🎉', true))
    .catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

function logout(){
  auth.signOut().catch(e => showMsg(AR_ERRORS[e.code] || e.message));
}

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
