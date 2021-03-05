

import React, { useEffect, useState, useContext } from 'react';
import { BaseURL } from '../Components/Url/BaseURL'
import axios from 'axios'

const GlobalStateContext = React.createContext()
const GlobalStateUpdateContext = React.createContext()
const UseGlobalState = () => useContext(GlobalStateContext)
const UseGlobalStateUpdate = () => useContext(GlobalStateUpdateContext)

function GlobalStateProvider({ children }) {

    const [data, setData] = useState({
        user: null,
        darkTheme: false,
        loginStatus: false,
        role: null,
        token: null,
        orderUser : null
    })

    
    useEffect(() => {
        
        axios({
            method: "get",
            url: BaseURL + '/profile',
            withCredentials: true
        })
        .then(function (response) {
            // handle success
            // console.log("response: ", response.status);
            if (response.status === 200) {
                console.log(response.data)
                console.log("lkdflasdfkj " , response.data.profile)
                setData(prev => ({ ...prev, loginStatus: true, user: response.data.profile, role: response.data.profile.role }))
            }
        })
        .catch(function (error) {
            // handle error
            // console.log("error: ==== ", error);
            if (error && error.response && error.response.status) {
                // console.log("error ==============> ", error.response.status);
                setData(prev => ({ ...prev, loginStatus: false }))
            }
        })
        
        return () => {
            console.log("cleanup")
        }
    },[])
    
    console.log()
    
    console.log(data);
    
    

    return (

        <GlobalStateContext.Provider value={data}>
            <GlobalStateUpdateContext.Provider value={setData}>
                {children}
            </GlobalStateUpdateContext.Provider>
        </GlobalStateContext.Provider>

    )
}


export { UseGlobalState, UseGlobalStateUpdate, GlobalStateProvider }