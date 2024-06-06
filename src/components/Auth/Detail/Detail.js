import React, { useState, useRef } from 'react';
import './Detail.css';
import Navbar from '../../Layout/Navbar/Navbar';
import { useForm } from 'react-hook-form';
import photo1 from '../../Assets/customer.svg';
import photo2 from '../../Assets/store.svg';
import photo3 from '../../Assets/user.svg';
import { useSelector, useDispatch } from 'react-redux';
import * as actionCreators from '../../../redux/actions/AuthAction';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/API';
import { setLoader, UnsetLoader } from '../../../redux/actions/LoaderActions';

const Details = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onTouched"
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pass } = useSelector((state) => state.AuthReducer);
    const [role, setRole] = useState(null);
    const [preview, setPreview] = useState(photo3);
    const fileRef = useRef(null);

    const onSubmit = (data, e) => {
        dispatch(setLoader());
        e.preventDefault();
        if (role === null) {
            alert("Please choose your role");
            dispatch(UnsetLoader());
            return;
        }

        const userDetails = {
            email: localStorage.getItem("email"),
            password: pass,
            fullname: data.fullname,
            mobileno: data.mobile,
            gender: data.aopt,
            role: role === "store" ? false : true
        };

        AuthService.Details(userDetails)
            .then((res) => {
                dispatch(UnsetLoader());
                localStorage.setItem("userid", res.data._id);
                navigate(userDetails.role ? "/" : "/create-store");
            })
            .catch((e) => {
                dispatch(UnsetLoader());
                console.error(e);
            });
    };

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='details-page'>
            <Navbar />
            <div className='details-container'>
                <div className='details-heading'>
                    <h1>Tell us something about yourself!</h1>
                </div>
                <div className='role-selection'>
                    <h2>Select your Role</h2>
                    <div className='role-options'>
                        <div className={`role-option ${role === "customer" ? "selected" : ""}`} onClick={() => setRole("customer")}>
                            <img src={photo1} alt="Customer" />
                            <p>Customer</p>
                        </div>
                        <div className={`role-option ${role === "store" ? "selected" : ""}`} onClick={() => setRole("store")}>
                            <img src={photo2} alt="Store" />
                            <p>Store</p>
                        </div>
                    </div>
                </div>
                <form className='details-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='profile-picture'>
                        <img src={preview} alt="Profile" />
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileRef}
                            onChange={imageHandler}
                        />
                        <button type="button" onClick={() => fileRef.current.click()}>Upload a profile picture</button>
                    </div>
                    <div className='form-group'>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            {...register("fullname", { required: "Name is required" })}
                        />
                        {errors.fullname && <p className="error">{errors.fullname.message}</p>}
                    </div>
                    <div className='form-group'>
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^[8][0-9]{8}$/i,
                                    message: "This is not a valid mobile number"
                                }
                            })}
                        />
                        {errors.mobile && <p className="error">{errors.mobile.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label>
                            <input
                                type="radio"
                                value="male"
                                {...register("aopt", { required: "This field is required" })}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="female"
                                {...register("aopt", { required: "This field is required" })}
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="other"
                                {...register("aopt", { required: "This field is required" })}
                            />
                            Other
                        </label>
                        {errors.aopt && <p className="error">{errors.aopt.message}</p>}
                    </div>
                    <button type="submit" className='submit-btn'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Details;
