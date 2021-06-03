import React, { useState } from "react";
import axios from "axios";

import EyeOpen from "./../asserts/eye-solid.svg";
import EyeClose from "./../asserts/eye-slash.svg";

const SignUp = ({ setSignUpPopUp, setOpenPopUp, setAlertPopUp }) => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const handleSignup = async (evt) => {
    evt.preventDefault();
    try {
      // get data
      const user = await axios.post(
        "http://127.0.0.1:4000/api/v1/users/signup",
        data,
        {
          withCredentials: true,
        }
      );

      if (user.data.status === "success") {
        localStorage.setItem("user", JSON.stringify(user.data.data.user));
        setSignUpPopUp(false);
        setAlertPopUp(true);
        console.log(user);
      }
    } catch (err) {
      let errors = Object.values(err.response.data.errors).map(
        (err) => err.message
      );
      setErrors(errors);
    }
  };

  const handleVisible = (evt) => {
    setVisible(!visible);
  };

  return (
    <div className='form-bg'>
      <div className='signin-box'>
        <div onClick={() => setSignUpPopUp(false)} className='cross'>
          &#10005;
        </div>
        {/* <div className="signin-box-logo">TakeTestPro</div> */}
        <h1 className='signin-box-logo'>Signup</h1>
        <form onSubmit={handleSignup} className='form-signin'>
          <div className='half-inputs'>
            <input
              onChange={(evt) =>
                setData({ ...data, firstname: evt.target.value })
              }
              className='form__input custom__input'
              type='text'
              placeholder='Firstname'
              required
            />
            <input
              onChange={(evt) =>
                setData({ ...data, lastname: evt.target.value })
              }
              className='form__input custom__input'
              type='text'
              placeholder='Lastname'
              required
            />
          </div>
          <input
            onChange={(evt) => setData({ ...data, username: evt.target.value })}
            className='form__input'
            type='text'
            placeholder='Username'
            required
          />
          <input
            onChange={(evt) => setData({ ...data, email: evt.target.value })}
            className='form__input'
            type='text'
            placeholder='Email'
            required
          />
          {/* <div className="err-msg">WEoor logging in</div> */}
          <div className='eye-box'>
            <input
              onChange={(evt) =>
                setData({ ...data, password: evt.target.value })
              }
              className='form__input'
              type={visible2 ? "text" : "password"}
              placeholder='Password'
              required
            />
            {visible2 ? (
              <img
                onClick={() => setVisible2(!visible2)}
                className='eye'
                src={EyeClose}
                alt='eye open'
              />
            ) : (
              <img
                onClick={() => setVisible2(!visible2)}
                className='eye'
                src={EyeOpen}
                alt='eye open'
              />
            )}
          </div>
          <div className='eye-box'>
            <input
              id='eye-confirm'
              onChange={(evt) =>
                setData({ ...data, confirmPassword: evt.target.value })
              }
              className='form__input'
              type={visible ? "text" : "password"}
              placeholder='Confirm Password'
              required
            />
            {visible ? (
              <img
                onClick={handleVisible}
                className='eye'
                src={EyeClose}
                alt='eye open'
              />
            ) : (
              <img
                onClick={handleVisible}
                className='eye'
                src={EyeOpen}
                alt='eye open'
              />
            )}
          </div>
          <ul className='mg1' style={{ textAlign: "left", color: "red" }}>
            {errors && errors.map((msg) => <li>{msg}</li>)}
          </ul>
          <button onClick={handleSignup} className='btn btn-submit'>
            Sign Up
          </button>
          <div className='reset-link'>Already have an account? Signin here</div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
