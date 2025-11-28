import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { LoginUser } from "../../utils/api/Serviceapi";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoding] = useState(false)
  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    setEmailError("");
    setPasswordError("");


    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {


      setEmailError("Please enter a valid email address");
      valid = false;

    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (valid) {
      setLoding(true)
      try {
        const response = await LoginUser(email, password)
        console.log(response)
        sessionStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userid", response.data.data.data.userId);
        navigate("/dashboard");
        toast.success("Login successful!");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoding(false)
      }
    }
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const [show, setShow] = useState(false)


  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>

        <div className={styles.leftSide}></div>


        <div className={styles.rightSide}>
          <div className={styles.iconCircle}>
            <FaUser size={30} />
          </div>

          <form className={styles.form} onSubmit={handleLogin} noValidate>
            <div>

              <div className={styles.inputBox}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              {emailError && <p className={styles.errorMsg}>{emailError}</p>}
            </div>

            <div>
              <div className={styles.inputBox}>
                <FaLock className={styles.inputIcon} />
                <input                
                  type={show ? "text" :  "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {show
                  ?
                  <FaEye className={styles.eyeIcon} onClick={()=>setShow(false)}/>
                  :
                  <FaEyeSlash className={styles.eyeIcon} onClick={()=>setShow(true)}/>
                }



              </div>
              {passwordError && (
                <p className={styles.errorMsg}>{passwordError}</p>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: loading ? 'gray' : '#064635' }}
              className={styles.loginBtn}>
              {loading ? 'Loading...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
