import React from 'react';

const LoadingBar = () => {
    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden fixed top-0 z-50">
            <div className="h-full bg-blue-500 animate-pulse"></div>
        </div>
    );
};

export default LoadingBar;
