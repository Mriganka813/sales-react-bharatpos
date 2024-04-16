import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AddSubUser = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [navigate, token]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');

    const Server = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            name,
            email,
            phoneNumber,
            role
        })
        try {
            await axios.post(
                `${Server}/api/v1/sub-user/new`,
                {
                    name,
                    email,
                    phoneNumber,
                    role,
                    password: "11111111",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Staff added successfully");
            navigate("/subusers-all");
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    };

    const isFormFilled = () => {
        return name && email && phoneNumber && role;
    };

    return (
        <div className="main-container">
            <div className="forget-password-container">
                <h2>Add Staff</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                    <label htmlFor="role">Role</label>
                    <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} />

                    <button type="submit" className="submit-btn" disabled={!isFormFilled()}>Create</button>
                </form>
            </div>
        </div>
    );
};

export default AddSubUser;
