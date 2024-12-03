import React from 'react';
import { PiNotePencil } from "react-icons/pi";
import { Link } from 'react-router-dom';

const WritePostButton = () => {
    return (
        <Link to={'write'}>
            <div style={{position: 'fixed', bottom: '40px', left: '90%',}}>
                <button style={{ background: 'none', border: 'none',cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <PiNotePencil size={40}/>
                    <span>글쓰기</span>
                </button>
            </div>
        </Link>
    );
};

export default WritePostButton;