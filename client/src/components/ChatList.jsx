import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatuser } from '../../redux/user/chatSlice';

const ChatList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchName, setSearchName] = useState('');
  const [searchData, setSearchData] = useState(null);
  const dispatch = useDispatch(); 
  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/v1/user/search-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: searchName }), 
      });

      const data = await res.json();

      if (data.success) {
        setSearchData(data.data); 
      } else {
        console.error('Search failed:', data.message);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-blue-500">
      <h1>{currentUser?.username}</h1>
      <div className="w-1/2 h-auto">
        <input
          placeholder="Search user"
          type="text"
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
        <button onClick={handleSubmit}>Submit</button>
        {searchData && (
          <div className="w-full flex flex-col">
            {searchData.map((data, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => dispatch(addChatuser(data))}
              >
                {data.username}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
