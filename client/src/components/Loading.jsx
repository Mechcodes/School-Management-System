import React from 'react';

function Loading() {
  return (
    <div className="flex justify-center items-center ">
      <div className="relative p-10">
        <div className="flex justify-center items-center flex-col">
        
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487a2.25 2.25 0 00-3.176 0L6.487 11.687a2.25 2.25 0 00-.657 1.591v4.515c0 .621.252 1.215.697 1.659.444.444 1.038.696 1.659.696h4.515c.601 0 1.182-.236 1.591-.657l7.199-7.199a2.25 2.25 0 000-3.176l-4.137-4.137zm-.707 5.657l-4.137-4.137M7.5 12.75h-.75a1.5 1.5 0 01-1.5-1.5v-.75"
              />
            </svg>
          </div>
          
        </div>
       
        <div className="absolute inset-0 flex justify-center items-center z-0">
          <div className="w-40 h-40 rounded-full border-4 border-green-400 border-dotted animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;