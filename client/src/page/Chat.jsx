import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

const Chat = () => {
    const {selectedChat} = useSelector(state => state.chat);

    return (
        selectedChat ? <ChatBox/> : <ChatList/> 
    )
}

export default Chat
