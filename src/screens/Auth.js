import axios from 'axios';
import React, {createContext} from 'react';
import { BASE_URL } from 'c:/Users/yassm/my-app/src/config';

export const Auth = createContext();

export const AuthProvider = ({children}) =>{
const register = (name, email, password)=>{
    axios
    .post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;
    
        
     
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
    
      });
};

    return(
    <Auth.Provider value={{register}}>{children}</Auth.Provider>);
};