import React, { useState } from 'react';
import '../styles/deleteAccount.scss'; // Importing the CSS file for styling
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteAccount = () => {
    const [confirmation, setConfirmation] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const Server = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [navigate, token]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate("/login")
    }

    const handleChange = (event) => {
        setConfirmation(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (confirmation === 'DELETE') {
            try {
                await axios.delete(
                    `${Server}/api/v1/user/delete-self`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                toast.success("Account Deleted Successfully");
                navigate("/login")
            } catch (error) {
                console.log(error)
                toast.error('Error deleting account');
            }
        } else {
            toast.error('Confirmation text does not match. Account not deleted.');
        }
    };

    return (
        <div className="home-container">
            <div className="logout">
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="delete-main">
                <div className="delete-account-container">
                    <h2>Delete Account</h2>
                    <form onSubmit={handleSubmit}>
                        <p>Are you sure you want to delete this account? This will remove all the information permanently</p>
                        <p>Please type <b>DELETE</b> to confirm deletion:</p>
                        <input
                            className="confirmation-input"
                            type="text"
                            value={confirmation}
                            onChange={handleChange}
                        />
                        <button className="delete-button" type="submit">Delete Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;
