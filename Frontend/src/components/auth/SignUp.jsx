import React from "react";
import { useNavigate } from 'react-router-dom';
import assets from "../../assets/assets";   // âœ… fixed import

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
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

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const { name, email, password } = state;
    alert(`You are sign up with name: ${name}, email: ${email}, password: ${password}`);

    // navigate('/'); // or navigate to login page

    setState({ name: "", email: "", password: "" });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>

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

        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
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