import { useState } from 'react';
import axios from 'axios';
import '../styles/signin.scss';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const Server = import.meta.env.VITE_BASE_URL;

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${Server}/api/v1/login`, {
                email,
                password,
            });
            const token = response.data.token;
            Cookies.set('token', token, { expires: 7 });
            toast.success("Logged in Successfully")
            navigate("/");
        } catch (error) {
            toast.error("Unsuccessful");
        }
    };

    return (
        <div className="main">
            <div className="signIn-container">
                <h2>Login</h2>
                <form className="signIn-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="password-input">
                        <label htmlFor="password">Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Conditionally set the input type
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {/* Button to toggle password visibility */}
                        <div type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                            {showPassword ? "Hide Password" : "Show Password"}
                        </div>
                    </div>
                    <button type="submit">Login</button>
                    <span className="forget-pass">
                        <Link to="/forget-password">
                            Forget Password
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
