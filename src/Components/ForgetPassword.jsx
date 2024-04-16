import React, { useState } from 'react';
import '../styles/forgetPassword.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const Server = import.meta.env.VITE_BASE_URL;

    const handleGetOtp = async () => {
        try {
            await axios.post(`${Server}/api/v1/send-otp`, {
                email
            });
            setOtpSent(true);
            toast.success("OTP sent successfully!");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.warning("Passwords doesn't match");
            return;
        }

        try {
            await axios.post(`${Server}/api/v1/password/reset`, {
                email,
                otp,
                newPassword: password
            });
            setOtpSent(true);
            toast.success("Password Reset Successfully");
            navigate("/login");

        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="main">
            <div className="forget-password-container">
                <h2>Forget Password</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="otp-field-container">
                        <label>OTP:</label>
                        <div>
                            <input
                                style={{ flex: !otpSent ? "0.8" : "1" }}
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={!otpSent}
                                required
                            />
                            {!otpSent && <button type="button" className='get-otp-btn' onClick={handleGetOtp}>Get OTP</button>}
                        </div>
                    </div>
                    {otpSent && (
                        <div className="password-fields">
                            <div>
                                <label>Password:</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                                    {showPassword ? "Hide Password" : "Show Password"}
                                </div>
                            </div>
                        </div>
                    )}
                    <button type="submit" disabled={!otpSent} className='submit-btn'>Submit</button>
                    <span className="back-to-login">
                        <Link to="/login">
                            <FaArrowLeftLong /> Back to Login
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
