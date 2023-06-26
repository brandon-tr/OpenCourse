'use client'

import React, {useState} from "react";

const UserCountWebHook: React.FC = () => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/WebSocket/CountUsers`);
    let [count, setCount] = useState('Loading...');
    socket.onmessage = function (event) {
        setCount(event.data)
    }
    socket.onopen = function (event) {
        socket.send('ping');
    }
    return <div>{count}</div>;
}

export default UserCountWebHook