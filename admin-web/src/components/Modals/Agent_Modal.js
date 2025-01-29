import React, { useState } from 'react'
import Modal from 'react-modal';
import './AgentModal.css'
const Agent_Modal = ({ isOpen, setIsOpen }) => {
    
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%'
        },
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        password: '',
        location: ''
      });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        })
        )
    }

    const handleAddAgent = (e) => {
        e.preventDefault()

        setFormData({
            name: '',
            email: '',
            contact: '',
            password: '',
            location: ''

        });

        setIsOpen(false)
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
            // width='200px'
            style={customStyles}
        >
            <h2>Add New Agent</h2>


            <form className='container' action="">
                <div className='inputDiv'>
                    <input type="text" name="name" onChange={handleChange} value={formData.name} placeholder='Agent Name' />
                </div>
                <div className='inputDiv'>
                    <input type="text" name="location" onChange={handleChange} value={formData.location} placeholder='Location' />
                </div>
                <div className='inputDiv'>
                    <input type="password" name="password" onChange={handleChange} value={formData.password} placeholder='Password' />
                </div>
                <div className='inputDiv'>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} placeholder='Email' />
                </div>
                <div className='inputDiv'>
                    <input type="text" name="contact" onChange={handleChange} value={formData.contact} placeholder='Contact' />
                </div>

                {/* You can add more fields here */}

                <button onClick={handleAddAgent} className='addBtn'>Add Agent</button>
            </form>
        </Modal>
    )
}

export default Agent_Modal
