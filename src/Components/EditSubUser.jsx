import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const EditSubUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = Cookies.get('token');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    const Server = import.meta.env.VITE_BASE_URL;

    const fetchSubUserDetails = async () => {
        try {
            const response = await axios.get(
                `${Server}/api/v1/subuser/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { name, email, phoneNumber, role } = response.data.subUSer;
            setName(name);
            setEmail(email);
            setPhoneNumber(phoneNumber);
            setRole(role);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSubUserDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let requestData = {
                name,
                email,
                phoneNumber,
                role
            };

            if (password.trim() !== '') {
                requestData.password = password;
            }

            await axios.put(
                `${Server}/api/v1/sub-user/${id}`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Staff details saved successfully");
            navigate("/subusers-all");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };


    return (
        <div className="main-container">
            <div className="forget-password-container">
                <h2>Edit Staff</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                    <label htmlFor="role">Role</label>
                    <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" className="password-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Fill only if you want to change staff's password" />

                    <button type="submit" className="submit-btn">Save</button>
                </form>
            </div>
        </div>
    );
};

export default EditSubUser;
