import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const handleSuccess = (msg)=>{
    toast.success(msg,{
        position:"top-right",
        style: {
            color: "#000000", // Text color
            backgroundColor: "#00ff2f" // Background color
        },
    })
}

export const handleError = (msg)=>{
    toast.error(msg,{
        position:"top-right",
        style: {
            color: "#000000", // Text color
            backgroundColor: "#ff0000" // Background color
        },
    })
}