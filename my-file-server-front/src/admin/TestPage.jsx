
import React, { useState } from 'react';
import CustomModal from '../common/CustomModal';
import Modal from 'react-modal';


Modal.setAppElement('#root');

function TestPage(props) {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [formData, setFormData] = useState(''); // 입력 데이터 상태
  
    // 모달 열기
    const openModal = () => setIsModalOpen(true);
  
    // 모달 닫기
    const closeModal = () => setIsModalOpen(false);
  
    // 폼 데이터 저장
    const handleFormSubmit = (data) => {
      setFormData(data); // 입력된 데이터를 저장
      closeModal(); // 모달 닫기
    };
  
    return (
      <div>
        <h1>React Modal Example</h1>
        <button onClick={openModal}>Open Modal</button>
        <p>Form Data: {formData}</p>
  
        {/* 모달 컴포넌트 */}
        <CustomModal 
            message="입력하세요"
            isOpen={isModalOpen} 
            onClose={closeModal} 
            onSubmit={handleFormSubmit} 
            isInput={true}
        />
      </div>
    );
}

export default TestPage;