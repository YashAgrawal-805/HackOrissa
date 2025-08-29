import React from "react";
import { useNavigate } from 'react-router-dom';
import assets from "../../assets/assets";   // âœ… fixed import
import { useSelector, useDispatch } from "react-redux";
import {setIsLoggedIn } from "../../store/store";
import axios from "axios";

function SignUpForm() {
  const {isLoggedIn} = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    username: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // block non-numeric
    }
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { username, phone, password } = state;
  
    try {
      const res = await axios.post("http://localhost:3000/users/register", {
        username,
        phone,
        password,
      });
  
      console.log("✅ Registered successfully:", res.data);
  
      dispatch(setIsLoggedIn(true));
      navigate("/");
  
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      alert("Registration failed, please try again.");
    }
  
    setState({ username: "", phone: "", password: "" });
  };

  React.useEffect(() => {
    console.log("isLoggedIn changed:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>

        {/*Social icons using assets */}
        <div className="social-container">
          <a href="#" className="social">
            <img src={assets.facebook_icon} alt="facebook" className="w-5" />
          </a>
          <a href="#" className="social">
            <img src={assets.email_icon} alt="email" className="w-5" />
          </a>
          <a href="#" className="social">
            <img src={assets.linkedin_icon} alt="linkedin" className="w-5" />
          </a>
        </div>

        <span>or use your phone for registration</span>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="username"
          required
        />
        <input
          type="text"
          name="phone"
          value={state.phone}
          onChange={handleChange}
          placeholder="number"
          pattern="[0-9]*" 
          inputMode="numeric"
          required
          maxLength={10}
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;