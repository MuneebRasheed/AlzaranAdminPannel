import React, { useState } from 'react';
import EditModal from '../PasswordModal';

export default function MainHeader() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="container-fluid d-flex justify-content-between py-3 align-items-center border-bottom">
        <div className="hamburger-button py-2 px-3 bg-black rounded-2">
          <a href="/">
            <i className="fa-solid fa-bars fa-lg" style={{ color: '#ffffff' }} />
          </a>
        </div>
        <div className="sign-button">
          <div className="d-inline">
            <i className="fa-sharp fa-solid fa-key" />
            <a
              style={{
                cursor: 'pointer',
              }}
              className="text-decoration-none text-black"
              onClick={() => setOpenModal(true)}
            >
              Change password
            </a>
          </div>
          <div className="d-inline ms-4">
            <i className="fa-solid fa-right-from-bracket" />
            <a href="/signin" className="text-decoration-none text-black">
              Log out
            </a>
          </div>
        </div>
      </div>

      <EditModal isOpen={openModal} toggle={() => setOpenModal(false)} />
    </>
  );
}
