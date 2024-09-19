import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signout`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className='p-5 max-w-lg mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg'>
      <h1 className='text-4xl font-bold text-center my-7 text-indigo-600'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2 border-4 border-indigo-300 shadow-md'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-500'>
              Error uploading image (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-gray-600'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-600'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          onChange={handleChange}
          id='username'
          className='border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500'
        />
        <input
          type='text'
          placeholder='Email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          id='email'
          className='border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500'
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500'
        />
        <button
          type='submit'
          className='bg-indigo-600 text-white rounded-lg p-3 uppercase hover:bg-indigo-700 disabled:opacity-80 transition'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          className='text-red-600 cursor-pointer hover:underline'
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className='text-red-600 cursor-pointer hover:underline'
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
      <p className='text-red-600 mt-5'>{error ? error : ''}</p>
      <p className='text-green-600 mt-5'>
        {updateSuccess ? 'User updated successfully!' : ''}
      </p>
    </div>
  );
}
