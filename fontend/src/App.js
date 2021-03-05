import './App.css';
// import Navigation from './Components/naviagation/Navigation'
// import AppRouting from './Components/routes/AppRouting'
import React from 'react';
import Navigation from "./Components/naviagation/Navigation";
import {GlobalStateProvider} from './context/context'


function App() {
  return (
    <>
      <GlobalStateProvider>
        <Navigation />
      </GlobalStateProvider>

    </>
  );
}

export default App;
