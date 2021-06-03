import "./scss/Form.scss";
import Google from "./../asserts/google.svg";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

const SignIn = ({ setOpenPopUp, setSignUpPopUp }) => {
  const handleClick = () => {
    setOpenPopUp(false);
    setSignUpPopUp(true);
  };
  const history = useHistory();

  const [data, setData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleSignin = async (evt) => {
    evt.preventDefault();
    try {
      // get data
      const user = await axios.post(
        "http://127.0.0.1:4000/api/v1/users/signin",
        data,
        {
          withCredentials: true,
        }
      );
      if (user.data.status === "success") {
        localStorage.setItem("user", JSON.stringify(user.data.data.user));
        setOpenPopUp(false);
        history.push("/");
      }
    } catch (err) {
      setMsg(err.response.data.message);
    }
  };

  const onGoogleSuccess = async (res) => {
    try {
      const user = await axios.post(
        "http://127.0.0.1:4000/api/v1/users/googleLogin",
        {
          tokenId: res.tokenId,
        }
      );
      console.log(user);
      if (user.data.status === "success") {
        localStorage.setItem("user", JSON.stringify(user.data.data.user));
      }
      setOpenPopUp(false);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const onGoogleFailure = () => {};

  return (
    <div className='form-bg'>
      <div className='signin-box'>
        <div onClick={() => setOpenPopUp(false)} className='cross'>
          &#10005;
        </div>
        <h1>SignIn</h1>

        <GoogleLogin
          clientId='192424346805-een4it2331mvnfm3f2cpegmlnt1f1p1i.apps.googleusercontent.com'
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className='btn btn-submit btn-google'>
              <img className='google-logo' src={Google} alt='' />
              Sign in with Google
            </button>
          )}
          buttonText='Login'
          onSuccess={onGoogleSuccess}
          onFailure={onGoogleFailure}
          cookiePolicy={"single_host_origin"}
        />
        <div className='overline-box'>
          <div className='overline'></div>
          <div className='or'>or</div>
          <div className='overline'></div>
        </div>
        <form onSubmit={handleSignin} className='form-signin'>
          <input
            onChange={(evt) => setData({ ...data, email: evt.target.value })}
            className='form__input'
            type='text'
            placeholder='Email'
            required
          />
          {/* <div className="err-msg">WEoor logging in</div> */}
          <input
            onChange={(evt) => setData({ ...data, password: evt.target.value })}
            className='form__input'
            type='password'
            placeholder='Password'
            required
          />
          {msg && <div style={{ color: "red", marginTop: "1rem" }}>{msg}</div>}
          <button className='btn btn-submit'>Sign In</button>

          <div onClick={handleClick} className='signup-link'>
            New to our app? Signup here
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
