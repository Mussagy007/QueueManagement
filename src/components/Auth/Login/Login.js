import React, { useState } from 'react';
import Navbar from '../../Layout/Navbar/Navbar';
import { useForm } from 'react-hook-form';
import image from '../../Assets/pic.svg';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import AuthService from '../../../services/API';
import { useDispatch } from 'react-redux';
import { setLoader, UnsetLoader } from '../../../redux/actions/LoaderActions';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: 'onTouched'
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);
    const [authError, setAuthError] = useState('');

    const onSubmit = async (data, e) => {
        dispatch(setLoader());
        e.preventDefault();
        
        const loginData = {
            email: data.email,
            password: data.password,
            isStore: data.aopt === 'store'
        };

        try {
            const res = await AuthService.Login(loginData);
            dispatch(UnsetLoader());
            if (res) {
                localStorage.setItem('access', res.data.access_token);
                localStorage.setItem('refresh', res.data.refresh_token);
                localStorage.setItem('userid', res.data._id);
                navigate(loginData.isStore ? '/' : '/create-store');
            }
        } catch (error) {
            dispatch(UnsetLoader());
            setAuthError('Authentication failed due to incorrect login information.');
        }
    };

    const handleClick = () => {
        navigate("/forgot");
    };

    const handleSignupClick = () => {
        navigate("/signup");
    };

    return (
        <div className="login-page">
            <Navbar />
            <div className="login-container">
                <div className="login-heading">
                    <h1>Welcome Back<span className="ques">!</span></h1>
                </div>
                {authError && <p className="auth-error">{authError}</p>}
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="radio-buttons">
                        <label>
                            <input
                                type="radio"
                                value="customer"
                                {...register("aopt", { required: "This field is required" })}
                            />
                            Customer
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="store"
                                {...register("aopt", { required: "This field is required" })}
                            />
                            Store
                        </label>
                        {errors.aopt && <p className="error">{errors.aopt.message}</p>}
                    </div>
                    <div className="form-field">
                        <input
                            type="email"
                            placeholder="Enter Email Address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                    message: "This is not a valid email"
                                }
                            })}
                        />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                    </div>
                    <div className="form-field">
                        <input
                            type={toggle ? "text" : "password"}
                            placeholder="Enter Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be more than 8 characters"
                                },
                                maxLength: {
                                    value: 14,
                                    message: "Password cannot exceed more than 14 characters"
                                }
                            })}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setToggle(!toggle)}
                        >
                            {toggle ? 'Hide' : 'Show'}
                        </button>
                        {errors.password && <p className="error">{errors.password.message}</p>}
                    </div>
                    <div className="form-footer">
                        <button type="button" onClick={handleClick}>Forgot password?</button>
                        <button type="submit" className="login-btn">Login</button>
                        <p>Don't have an account? <u onClick={handleSignupClick}>Sign up</u></p>
                    </div>
                </form>
                <div className="login-image">
                    <img src={image} alt="Welcome" />
                </div>
            </div>
        </div>
    );
};

export default Login;
