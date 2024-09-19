import { FaUserGraduate, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        handleResize(); 
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <header className='bg-gradient-to-r from-teal-400 to-blue-500 border-b-4 border-teal-700 rounded-b-lg shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                
                <Link to='/' className='flex items-center space-x-4'>
                    <img 
                        className='w-16 h-16 rounded-full shadow-md border-4 border-white' 
                        src="https://i.pinimg.com/originals/37/86/00/3786001447986993c2cd5bbfe77c9645.png" 
                        alt="Logo" 
                    />
                    <h1 className='text-4xl font-bold text-white'>
                        SchoolVerse
                    </h1>
                </Link>

                
                {!isMobile ? (
                    <ul className='flex gap-8 items-center text-lg text-white'>
                        <Link to='/'>
                            <li className='hover:bg-teal-700 p-2 rounded-md cursor-pointer'>Home</li>
                        </Link>
                        <li className='relative group cursor-pointer'>
                            Dashboard
                            
                            <ul className='absolute top-full right-0 w-48 rounded-md shadow-lg bg-teal-300 text-teal-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50'>
                                <Link to='/student'>
                                    <li className='px-4 py-2 hover:bg-teal-400 cursor-pointer'>Students</li>
                                </Link>
                                <Link to='/teacher'>
                                    <li className='px-4 py-2 hover:bg-teal-400 cursor-pointer'>Teachers</li>
                                </Link>
                                <Link to='/class'>
                                    <li className='px-4 py-2 hover:bg-teal-400 cursor-pointer'>Classes</li>
                                </Link>
                                <Link to='/profit-analysis'>
                                    <li className='px-4 py-2 hover:bg-teal-400 cursor-pointer'>Profit Analysis</li>
                                </Link>
                            </ul>
                        </li>
                        <Link to='/profile'>
                            {currentUser ? (
                                <img
                                    className='rounded-full h-12 w-12 object-cover border-2 border-white shadow-md'
                                    src={currentUser.avatar}
                                    alt='profile'
                                />
                            ) : (
                                <li className='hover:underline'>Sign in</li>
                            )}
                        </Link>
                    </ul>
                ) : (
                    
                    <div className="relative flex items-center">
                        <button>
                            <FaBars className="text-2xl text-white" />
                        </button>
                        
                    </div>
                )}
            </div>
        </header>
    );
}
