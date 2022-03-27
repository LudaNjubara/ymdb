import { useRef } from "react/";
import Router from "next/router";
import styles from "../../styles/Login/loginRegisterForm.module.css";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "../firebase";

function LoginRegisterForm() {
  const usernameRefRegister = useRef(null);
  const emailRefRegister = useRef(null);
  const passwordRefRegister = useRef(null);
  const emailRefLogin = useRef(null);
  const passwordRefLogin = useRef(null);

  const redirectToHome = () => {
    const { pathname } = Router;
    if (pathname == "/login") {
      Router.push("/");
    }
  };

  const login = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, emailRefLogin.current.value, passwordRefLogin.current.value)
      .then((userCredential) => {
        // Logged in
        console.log("User", userCredential.user?.displayName, "logged in");
        redirectToHome();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        // ..
      });
  };

  const register = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, emailRefRegister.current.value, passwordRefRegister.current.value)
      .then((userCredential) => {
        // Account created
        const user = userCredential.user;
        console.log("Created user", userCredential.user?.displayName, "logged in");

        updateProfile(user, {
          displayName: usernameRefRegister.current.value,
        })
          .then(() => {
            redirectToHome();
          })
          .catch((err) => {
            console.error(err.message, err.code);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
      });
  };

  return (
    <section className={styles.formsContainer}>
      <article id="loginFormId" className={styles.loginContainer}>
        <form className={styles.form}>
          <h1 className={styles.formTitle}>Login</h1>
          <label htmlFor="emailInputLogin">
            <input
              ref={emailRefLogin}
              type="email"
              id="emailInputLogin"
              placeholder="Your e-mail address"
              autoFocus
              className={styles.formInput}
            />
          </label>
          <label htmlFor="passwordInputLogin">
            <input
              ref={passwordRefLogin}
              type="password"
              id="passwordInputLogin"
              placeholder="Your password"
              autoComplete="current-password"
              className={styles.formInput}
            />
          </label>
          <button type="button" className={`${styles.formButton} ${styles.formButtonLogin}`} onClick={login}>
            Login
          </button>
          <p className={styles.formRegisterText}>
            Don't have an account? Create it over
            <span
              className={styles.formChangeToRegisterButton}
              onClick={() => {
                document.getElementById("loginFormId").classList.toggle(styles.formInactive);
                document.getElementById("registerFormId").classList.toggle(styles.formActive);
              }}
            >
              here
            </span>
          </p>
        </form>
      </article>

      <article id="registerFormId" className={styles.registerContainer}>
        <form className={styles.form}>
          <h1 className={styles.formTitle}>Create Account</h1>
          <label htmlFor="usernameInputRegister">
            <input
              ref={usernameRefRegister}
              type="text"
              id="usernameInputRegister"
              placeholder="New username"
              className={styles.formInput}
            />
          </label>
          <label htmlFor="emailInputRegister">
            <input
              ref={emailRefRegister}
              type="email"
              id="emailInputRegister"
              placeholder="New e-mail address"
              className={styles.formInput}
            />
          </label>
          <label htmlFor="passwordInputRegister">
            <input
              ref={passwordRefRegister}
              type="password"
              id="passwordInputRegister"
              autoComplete="new-password"
              placeholder="New password"
              className={styles.formInput}
            />
          </label>
          <button
            type="button"
            className={`${styles.formButton} ${styles.formButtonRegister}`}
            onClick={register}
          >
            Create Account
          </button>

          <p className={styles.formRegisterText}>
            Already have an account? Go back to login
            <span
              className={styles.formChangeToRegisterButton}
              onClick={() => {
                document.getElementById("loginFormId").classList.toggle(styles.formInactive);
                document.getElementById("registerFormId").classList.toggle(styles.formActive);
              }}
            >
              here
            </span>
          </p>
        </form>
      </article>
    </section>
  );
}

export default LoginRegisterForm;
