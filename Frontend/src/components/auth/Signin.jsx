import React from "react";
import { useNavigate } from 'react-router-dom';
import assets from "../../assets/assets";   // âœ… fixed import
import axios from "axios";

function SignInForm() {
  const [state, setState] = React.useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { username, password } = state;
    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        { username, password },
        { withCredentials: true }
      );
      if(response.data.error){
        alert(response.data.error);
        return;
      }
      localStorage.setItem("token", response.data.token);
      navigate("/explore");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        {/* âœ… Social icons using assets */}
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

        <span>or use your account</span>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={state.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;