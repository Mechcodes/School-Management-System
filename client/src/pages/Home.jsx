import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div
      className="h-screen w-full p-10 bg-blue-100 bg-blend-multiply bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images2.alphacoders.com/720/720843.jpg")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-3xl bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 text-black">
        <h1 className="font-bold text-5xl text-center text-teal-700 mb-4">
          Welcome to <span className="text-pink-600">SchoolVerse!</span>
        </h1>

        <h3 className="font-semibold text-xl text-center text-gray-700 mb-4">
          The future of school management is here.
        </h3>

        <p className="font-medium text-base text-center text-gray-600 mb-4">
          Streamline your school administration with cutting-edge tools for managing classes, students, and data effortlessly.
        </p>

        <p className="font-medium text-sm text-center text-gray-600 mb-6">
          Say Bye-Bye to paperwork and Hi-Hi to efficiency.
        </p>

        {currentUser ? (
          <p className="font-semibold text-lg text-center text-teal-700">
            Hello,{' '}
            <Link to="/profile" className="text-pink-600 underline">
              {currentUser.username}
            </Link>
            ! Let's Work Together 🙂
          </p>
        ) : (
          <>
            <h6 className="text-lg text-center text-gray-800 mt-8 mb-4">
              Join SchoolVerse today and take the first step towards better school management!
            </h6>
            <Link
              to="/sign-in"
              className="bg-pink-600 text-white rounded-full py-3 px-8 uppercase mt-4 block text-center hover:bg-pink-700"
            >
              Sign In
            </Link>
            <div className="flex justify-center items-center mt-4">
              <p className="text-gray-700">New here?</p>
              <Link to="/sign-up" className="ml-2 text-pink-600 underline hover:text-pink-800">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
