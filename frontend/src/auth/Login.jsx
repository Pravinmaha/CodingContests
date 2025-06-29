import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login(email, password);
            const { user, token } = data;

            localStorage.setItem('userId', user._id);
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            if (user.role === 'admin') {
                navigate('/admin');
            }
            else {
                navigate('/contests');
            }

        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#121212',
            fontFamily: 'Segoe UI, sans-serif',
            color: '#ffffff',
        },
        form: {
            background: '#1e1e1e',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
            width: '360px',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '26px',
            fontWeight: '600',
            color: '#00ffff',
        },
        label: {
            display: 'block',
            marginBottom: '6px',
            fontWeight: '500',
            color: '#ddd',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid #333',
            borderRadius: '6px',
            backgroundColor: '#2a2a2a',
            color: '#fff',
            outline: 'none',
        },
        inputFocus: {
            borderColor: '#00ffff',
        },
        button: {
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #00ffff, #0066ff)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
        },
        buttonHover: {
            background: 'linear-gradient(135deg, #00e6e6, #0052cc)',
        },
        error: {
            color: '#ff4d4d',
            textAlign: 'center',
            marginBottom: '16px',
        },
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2 style={styles.heading}>Login</h2>

                {error && <p style={styles.error}>{error}</p>}

                <label style={styles.label}>Email</label>
                <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <label style={styles.label}>Password</label>
                <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                        'linear-gradient(135deg, #00e6e6, #0052cc)')
                    }
                    onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                        'linear-gradient(135deg, #00ffff, #0066ff)')
                    }
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
