import React from 'react'
import { useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom'

interface RootState {
    auth: {
        user: any;
    }
}

function ProtectedRoute({ Child }: { Child: React.FC }) {


    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    if(user){
        return <Child />
    }
    else{
        navigate('/login');
        return null;
    }
}

export default ProtectedRoute