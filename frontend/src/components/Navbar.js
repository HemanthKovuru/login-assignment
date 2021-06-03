import React from "react";
import "./scss/Navbar.scss";
import { useHistory } from "react-router-dom";

const Navbar = ({ setOpenPopUp }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  if (user && user.status === "Pending") {
    user = null;
  }

  const handleSignout = () => {
    localStorage.removeItem("user");
    history.push("/");
  };

  return (
    <div className='navbar__container'>
      <div className='navbar'>
        {!user && user === null ? (
          <>
            <div className='logo'>
              <h2>Assignment</h2>
            </div>
            {/* <div className='search__box'></div> */}
            <div className='navbar__right2'>
              <span
                onClick={() => setOpenPopUp((prev) => !prev)}
                className='btn btn-signin'>
                Sign In
              </span>
            </div>
          </>
        ) : (
          <>
            <h2>Assignment</h2>
            <div onClick={handleSignout} className='navbar__right1'>
              <span className='btn btn-signin'>Signout</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
