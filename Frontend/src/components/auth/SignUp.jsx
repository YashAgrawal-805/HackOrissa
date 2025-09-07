import React from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import axios from "axios";

function SignUpForm() {
  const [state, setState] = React.useState({
    username: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { username, password, phone } = state;
    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        { username, password, phone },
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/explore");
    }
    catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>

        {/* ✅ Social icons using assets */}
        <div className="social-container">
          <a href="#" className="social">
            <img src={assets.facebook_icon} alt="facebook" className="w-5" />
          </a>
          <a href="#" className="social">
            <img src={assets.email_icon} alt="google" className="w-5" />
          </a>
          <a href="#" className="social">
            <img src={assets.linkedin_icon} alt="linkedin" className="w-5" />
          </a>
        </div>

        <span>or use your username for registration</span>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="text"
          name="phone"
          value={state.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
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
