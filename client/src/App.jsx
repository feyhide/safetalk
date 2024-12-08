import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Chat from './page/Chat';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat/:username' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;