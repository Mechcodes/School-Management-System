import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      const accessToken = data.access_token; 
      console.log('Access Token:', accessToken);
      localStorage.setItem('access_token', accessToken); 
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="p-8 max-w-lg w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-6">
          Welcome Back!
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your account to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
         
        </form>
        <div className="flex justify-center items-center gap-2 mt-6">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600 hover:text-blue-800 underline font-medium transition-all duration-300">
              Sign up
            </span>
          </Link>
        </div>
        {error && (
          <p className="text-red-500 mt-5 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
