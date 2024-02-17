import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UploadModal({ show, handleClose,uploadProgress }) {


  

  const onHide = () => {
    
    handleClose();
  };

  const onClose = () => {
  
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title><div >{"Uploading in progress...!"}</div></Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="progress">
  <div
    className="progress-bar"
    role="progressbar"
    style={{ width: `${uploadProgress}%` }}
    aria-valuenow={uploadProgress}
    aria-valuemin="0"
    aria-valuemax="100"
  />
</div>
<div>Progress {uploadProgress.toFixed(0)}%</div>
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadModal;
