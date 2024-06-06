import React, { useState } from 'react';
import './SignUp.css';
import Navbar from '../../Layout/Navbar/Navbar';
import { useForm } from 'react-hook-form';
import image from '../../Assets/pic.svg';
import { useDispatch } from 'react-redux';
import * as actionCreators from '../../../redux/actions/AuthAction';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/API';
import { setLoader, UnsetLoader } from '../../../redux/actions/LoaderActions';

const SignUp = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: 'onTouched'
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);
    const [toggle1, setToggle1] = useState(false);

    const onSubmit = async (data, e) => {
        dispatch(setLoader());
        e.preventDefault();
        dispatch(actionCreators.userEmail(data.email));
        dispatch(actionCreators.userPass(data.password));
        localStorage.setItem("email", data.email);

        const obj = { email: data.email };

        try {
            const res = await AuthService.Signup(obj);
            dispatch(UnsetLoader());
            navigate("/detail");
        } catch (error) {
            dispatch(UnsetLoader());
            console.error(error);
        }
    };

    const handleClicked = () => {
        navigate("/login");
    };

    return (
        <div className="signup-page">
            <Navbar />
            <div className="signup-container">
                <div className="main-heading">
                    <h1>Hate Never Ending Queues<span className="ques">?</span></h1>
                </div>
                <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
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
                            placeholder="Enter New Password"
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
                    <div className="form-field">
                        <input
                            type={toggle1 ? "text" : "password"}
                            placeholder="Re-enter New Password"
                            {...register("cpassword", {
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
                            onClick={() => setToggle1(!toggle1)}
                        >
                            {toggle1 ? 'Hide' : 'Show'}
                        </button>
                        {errors.cpassword && <p className="error">{errors.cpassword.message}</p>}
                    </div>
                    <button className="signup-btn" type="submit">Sign Up Now</button>
                    <p className="login-head">Existing users <u onClick={handleClicked}>Login</u></p>
                </form>
                <div className="signup-image">
                    <img src={image} alt="Queue" />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
