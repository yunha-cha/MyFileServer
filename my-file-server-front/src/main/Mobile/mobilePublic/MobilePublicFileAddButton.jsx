import React from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { createPublicFile } from '../../apiFunction';

const MobilePublicFileAddButton = ({getPublicFile}) => {
    return (
        <div style={{position: 'fixed', right: '20px', bottom: '20px'}}>
            <input id='fileInput' type='file' style={{ display: 'none' }} onChange={(e)=> {createPublicFile(e.target.files[0], e.target.files[0].name, ()=>window.location.reload());}}/>
            <label htmlFor="fileInput">
                <FaPlusCircle size={50} color='#28dbff'/>
            </label>
        </div>
    );
};

export default MobilePublicFileAddButton;