import React, { useState } from 'react';
import { json, Link, useNavigate } from 'react-router-dom'; 
import {toast,ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../Util';
import 'react-toastify/dist/ReactToastify.css';


function LoginUp() {

    const navigate=useNavigate();
    const [loginEmail,setLoginEmail]=useState()
    const [loginPassword,setLoginPassword]=useState()
    const [loginInfo,setLoginInfo]=useState({
        email:'',
        password:''
    })

    const handleChangeEmail = (eve)=>{
        eve.preventDefault();
        const email=eve.target.value;
        setLoginEmail(email)
        
    }
    
    const handleChangePassword = (eve)=>{
        eve.preventDefault();
        const password=eve.target.value;
        setLoginPassword(password)
    
        
    }
    
    const handleLoginUpSubmit = async (e)=>{
        e.preventDefault();
        const email= loginEmail
        const password=loginPassword
        const loginData={
            email:loginEmail,
            password:loginPassword
        };

        if(!email||!password)
        {
            return handleError('Emial And Pasword are Required');
        }
        try{
            
            const url=`${import.meta.env.VITE_BACKEND_URL}/LoginUp`;
            const response =await fetch(url,
                {
                    method:"POST",
                    headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(loginData)    
                })
                const result = await response.json();
                
                
                const {success,message,error,jwtToken,email}=result;
                
                if(success){
                    handleSuccess(message);
                    localStorage.setItem('token:',jwtToken);
                    localStorage.setItem('email',email);
                    setTimeout(()=>{
                        navigate('/home')
                    },3001)
                }
                else if(error){
                    let detail =error?.details[0].message;
                    handleError(detail);
                }
                else if(!success)
                {
                    handleError(message);
                }

        }catch(err){
            handleError(err);
        }
        
        
    }

    
    
    return (  
       <div className='container' id='singnConatiner'>
            <h1>Login</h1>
            <form id='signform' onSubmit={handleLoginUpSubmit}>
                
                <label htmlFor='name'>Email</label>
                <input
                    onChange={handleChangeEmail}
                    type='email'
                    name='email'
                    autoFocus
                    placeholder='Enter your Email'
                 
                />
                <label htmlFor='name'>Password</label>
                <input
                    onChange={handleChangePassword}
                    type='password'
                    name='password'
                    autoFocus
                    placeholder='Enter your name Password'
                 
                />
            <button>LoginUp</button>
                <span id='signLink'>Don't Have an Account? 
                    <Link to="/SignUp" >Sign up</Link>
                </span>
            </form>
            <ToastContainer/>
       </div>

    );
}

export default LoginUp;