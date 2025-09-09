document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const mainView = document.getElementById("mainView");
  const btnLogin = document.getElementById("btnLogin");
  const btnSignup = document.getElementById("btnSignup");
  const btnLogout = document.getElementById("btnLogout");

  btnLogin.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      await FB.auth.signInWithEmailAndPassword(email, pass);
      showMain();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  btnSignup.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      await FB.auth.createUserWithEmailAndPassword(email, pass);
      showMain();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  btnLogout.onclick = async () => {
    await FB.auth.signOut();
    loginView.classList.remove("hidden");
    mainView.classList.add("hidden");
  };

  function showMain() {
    loginView.classList.add("hidden");
    mainView.classList.remove("hidden");
  }

  FB.auth.onAuthStateChanged(user => {
    if (user) {
      showMain();
    } else {
      loginView.classList.remove("hidden");
      mainView.classList.add("hidden");
    }
  });
});