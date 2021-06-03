import axios from "axios";
import { useState } from "react";
import Alert from "../components/Alert";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Navbar from "./../components/Navbar";
import Wall from "./../asserts/wall.jpg";
import Default from "./../asserts/default.jpg";

const Home = () => {
  const [openPopUp, setOpenPopUp] = useState(false);
  const [signUpPopUp, setSignUpPopUp] = useState(false);
  const [alertPopUp, setAlertPopUp] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const [profilePopUp, setProfilePopUp] = useState(false);
  const [wallPopUp, setWallPopUp] = useState(false);
  const [profilePic, setProfilePic] = useState(false);
  const [wallPic, setWallPic] = useState(false);

  // window.onload = async () => {
  //   console.log(user);
  //   if (user && user.status === "Pending") {
  //     try {
  //       // get data
  //       const activeUser = await axios.post(
  //         "http://127.0.0.1:4000/api/v1/users/getUser",
  //         { email: user.email },
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       if (
  //         activeUser.data.status === "success" &&
  //         activeUser.data.data.user.status === "Active"
  //       ) {
  //         localStorage.setItem(
  //           "user",
  //           JSON.stringify(activeUser.data.data.user)
  //         );
  //       }
  //     } catch (err) {
  //       console.log(err.response);
  //     }
  //   }
  // };
  // profile phor update
  const handleProfilePic = async () => {
    alert("not implemented");
    // let formData = new FormData();
    // formData.append("profilePic", profilePic);
    // formData.append("id", "user._id");
    // try {
    //   const user = await axios.patch(
    //     "http://127.0.0.1:4000/api/v1/users/updateMe",
    //     formData
    //   );
    //   if (user.data.status === "success")
    //     localStorage.setItem("user", JSON.stringify(user.data.data.user));
    // } catch (err) {
    //   console.log(err.response);
    //   console.log(err);
    // }
  };

  // profile wwall pic
  const handleWallPic = async () => {
    alert("not implemented");
    // let form = new FormData();
    // const photo = document.getElementsByClassName("wall-pic").files[0];
    // if (photo) {
    //   form.append("wallPic", photo);
    // }
    // if (user._id) {
    //   form.append("_id", user._id);
    // }
    // try {
    //   const user = await axios.patch(
    //     "http://127.0.0.1:4000/api/v1/users/updateMe",
    //     form
    //   );
    //   if (user.data.status === "success") {
    //     localStorage.setItem("user", JSON.stringify(user.data.data.user));
    //   }
    // } catch (err) {
    //   console.log(err.response);
    // }
  };

  return (
    <div>
      <Navbar setOpenPopUp={setOpenPopUp} />
      {openPopUp && (
        <SignIn setOpenPopUp={setOpenPopUp} setSignUpPopUp={setSignUpPopUp} />
      )}
      {signUpPopUp && (
        <SignUp
          setOpenPopUp={setOpenPopUp}
          setSignUpPopUp={setSignUpPopUp}
          setAlertPopUp={setAlertPopUp}
        />
      )}
      {alertPopUp && (
        <Alert setAlertPopUp={setAlertPopUp}>
          <div onClick={() => setAlertPopUp(false)} className='cross'>
            &#10005;
          </div>
          <div style={{ padding: "1rem" }}>
            {" "}
            User was registered successfully! Please check your email for
            confirmation.
          </div>
        </Alert>
      )}

      {profilePopUp && (
        <Alert>
          <div onClick={() => setProfilePopUp(false)} className='cross'>
            &#10005;
          </div>
          <div style={{ padding: "1rem" }}>
            <input
              onChange={(e) => setProfilePic(e.target.files[0])}
              id='profile-pic'
              type='file'
              className='form__input'
            />
            <button onClick={handleProfilePic} className='btn btn-signin mg1'>
              Save profile pic
            </button>
          </div>
        </Alert>
      )}
      {wallPopUp && (
        <Alert>
          <div onClick={() => setWallPopUp(false)} className='cross'>
            &#10005;
          </div>
          <div style={{ padding: "1rem" }}>
            <input
              onChange={(e) => setWallPic(e.target.files[0])}
              id='wall-pic'
              type='file'
              className='form__input'
            />
            <button onClick={handleWallPic} className='btn btn-signin mg1'>
              Save wall pic
            </button>
          </div>
        </Alert>
      )}
      {user && user.status === "Active" ? (
        <>
          <div className='container'>
            <div className='profile-bg'>
              <div className='background-pic'>
                <div className='wall-pic'>
                  <img className='wall-pic' src={Wall} alt='background pic' />
                </div>
                <div
                  onClick={() => setProfilePopUp(true)}
                  className='default-pic'>
                  <img
                    className='default-pic'
                    src={
                      user.profilePic === "default.jpg"
                        ? Default
                        : user.profilePic
                    }
                    alt='default pic'
                  />
                </div>
              </div>
              <div className='userinfo'>
                <h3 className='heading-teritary'>Personal Information</h3>
                <div>
                  Name: {user.firstname} {user.lastname}
                </div>
                <div>Username: {user.username}</div>
                <div>Email: {user.email}</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Home;
