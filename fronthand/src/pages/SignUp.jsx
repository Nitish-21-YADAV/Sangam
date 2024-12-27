import React, { useState } from 'react';
import { json, Link, useNavigate } from 'react-router-dom'; 
import { handleError, handleSuccess } from '../Util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function SignUp() {

    const navigate=useNavigate();
    const [signInfo,setSignInfo]=useState({
        name:'',
        email:'',
        password:''
    })

    const handleChange=(e)=>{
        const {name,value}=e.target;
        const copySignInfo ={...signInfo};
        
        copySignInfo[name]=value;
        setSignInfo(copySignInfo);
    }
    const handleSignUpSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password}=signInfo;
        
        
        if(!name||!email||!password)
        {
            return handleError('Name Email And Pasword are Required');
        }
        try{
            
            const url=`${import.meta.env.VITE_BACKEND_URL}/SignUp`;
            const response =await fetch(url,
                {
                    
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signInfo),
                });

                const result = await response.json();
                                
                const {success,message,error}=result;
                if(success){
                    console.log("message:",message);
                    
                    handleSuccess(message);
                    setTimeout(()=>{
                        navigate('/LoginUp')
                    },3000)
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
            <h1>Sing Up</h1>
            <form id='signform' onSubmit={handleSignUpSubmit}>
                <label htmlFor='name'>Name</label>
                <input
                   onChange={handleChange}
                    type='text'
                    name='name'
                    autoFocus
                    placeholder='Enter your name'
                    value={signInfo.name}
                />
                <label htmlFor='name'>Email</label>
                <input
                    onChange={handleChange}
                    type='email'
                    name='email'
                    autoFocus
                    placeholder='Enter your Email'
                    value={signInfo.email}
                />
                <label htmlFor='name'>Password</label>
                <input
                    onChange={handleChange}
                    type='password'
                    name='password'
                    autoFocus
                    placeholder='Enter your name Password'
                    value={signInfo.password}
                />
            <button>SignUp</button>
                <span id='signLink'>Already Have an account ? 
                    <Link to="/LoginUp">login</Link>
                </span>
            </form>
            <ToastContainer/>
       </div>

    );
}

export default SignUp;