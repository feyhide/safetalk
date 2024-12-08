import React from 'react'
import { useSelector } from 'react-redux'

const ChatBox = () => {
    const {selectedChat} = useSelector(state => state.chat);

    return (
    <div className='w-screen h-screen bg-blue-500'>
      <p>chat name:  {selectedChat.username}</p>
    </div>
  )
}

export default ChatBox
