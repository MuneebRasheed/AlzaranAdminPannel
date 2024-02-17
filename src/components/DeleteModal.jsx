import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'; // Assuming you're using Redux

function DeleteModal({ show, handleClose, handleDelete }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.user); // Assuming the user is stored in Redux state

  const handleConfirmDelete = () => {
    if (password === user.password) {
      setPassword('');
      setError('');
      handleDelete();
    } else {
      toast.error('Password does not match');
      setError('Password does not match');
    }
  };

  const onHide = () => {
    setPassword('');
    setError('');
    handleClose();
  };

  const onClose = () => {
    setPassword('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {error && <div className="text-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
