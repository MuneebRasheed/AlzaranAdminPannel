import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UploadSuccesModal({ show, handleClose,uploadProgress }) {


  

  const onHide = () => {
    
    handleClose();
  };

  const onClose = () => {
  
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title><div >{"Update Confirmation..!"}</div></Modal.Title>
      </Modal.Header>
      <Modal.Body>
     <div>
      All file uploaded Succesfully!
     </div>
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadSuccesModal;
