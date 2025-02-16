import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AgentModal.css';

const uri = "https://alert-system-fastapi-8749c7285c49.herokuapp.com";

const Agent_Modal = ({ isOpen, setIsOpen, setAgents }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      zIndex: 10000 ,  // Ensure it is above the table header
    },
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.contact,
        password: formData.password,
        types: 'agent',
        status: 'online',
        location: {
          latitude: 0,
          longitude: 0,
        },
      };

      const response = await axios.post(`${uri}/signup`, requestData);
      console.log('Agent added successfully:', response.data);

      // Fetch updated agent list
      const updatedAgents = await axios.get(`${uri}/agents`);
      setAgents(Object.values(updatedAgents.data.agents));

      // Reset form data and close modal
      setFormData({
        name: '',
        email: '',
        contact: '',
        password: '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding agent:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Add Agent Modal"
      style={customStyles}
    >
      <h2>Add New Agent</h2>
      <form className='container' onSubmit={handleAddAgent}>
        <div className='inputDiv'>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            placeholder='Agent Name'
            required
          />
        </div>
        <div className='inputDiv'>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder='Password'
            required
          />
        </div>
        <div className='inputDiv'>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder='Email'
            required
          />
        </div>
        <div className='inputDiv'>
          <input
            type="text"
            name="contact"
            onChange={handleChange}
            value={formData.contact}
            placeholder='Contact'
            required
          />
        </div>
        <button type="submit" className='addBtn'>Add Agent</button>
      </form>
    </Modal>
  );
};

export default Agent_Modal;