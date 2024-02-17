import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ErrorModal({ show, handleClose,errors }) {


  

  const onHide = () => {
    
    handleClose();
  };

  const onClose = () => {
  
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title><div className="text-danger">{"Failed to proceed...!"}</div></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errors.map((val,index)=>{
          return <div key={index}>{val}</div>
        })}
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
