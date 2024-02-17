/* eslint-disable import/extensions */
import React, { useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { updatePasswordAction } from '@/store/user-actions';

function EditModal({ isOpen, toggle }) {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const onToggle = () => {
    setOldPassword('');
    setNewPassword('');
    setError('');
    toggle();
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      setError('Please enter both old and new passwords.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    try {
      await dispatch(updatePasswordAction({ newPassword, oldPassword }));
      onToggle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <ModalHeader toggle={toggle}>Edit Password</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="oldPassword">Old Password:</Label>
            <Input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="newPassword">New Password:</Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormGroup>
        </Form>
        {error && <Alert color="danger">{error}</Alert>}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdatePassword}>Update Password</Button>
        <Button color="secondary" onClick={onToggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default EditModal;
