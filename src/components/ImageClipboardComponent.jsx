/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { storage } from '../../firebase';
// eslint-disable-next-line import/no-unresolved
import { put } from '@/store/colors-actions';

function ImageClipboardComponent({ color }) {
  const [imageUrl, setImageUrl] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const uploadImage = (file) => {
    const storageRef = ref(storage);
    const imageRef = ref(storageRef, `images/${color.id}${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);
    let toastId;

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        toastId = toast.loading(`Uploaded ${progress} percent`, { id: toastId });
        setUploadProgress(progress);
      },
      (error) => {
        toast.error('Failed', { id: toastId });
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          dispatch(put({ id: color.id, data: { ...color, imgUrl: downloadURL } })).then(() => {
            toast.success('Uploaded', { id: toastId });
            // Dispatch action after image is uploaded and URL is updated
          });
        });
      },
    );
  };

  const handlePaste = (event) => {
    const pasteEvent = (event.clipboardData || window.clipboardData).items;
    for (let i = 0; i < pasteEvent.length; i++) {
      if (pasteEvent[i].type.indexOf('image') === 0) {
        const blob = pasteEvent[i].getAsFile();
        uploadImage(blob);
        // No need to set imageUrl here
        setModalIsOpen(false); // Close the modal after pasting
      }
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setImageUrl('');
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <div
        style={{
          width: '100px',
          height: '50px',
          cursor: 'pointer',
        }}
        onContextMenu={(event) => {
          event.preventDefault(); // Prevent default context menu
          openModal(); // Open the modal on right-click
        }}
        onClick={() => {
          if (color.isCombineColor) {
            router.push(`/CombineColors?id=${color.id}`);
          } else {
            router.push(`/CreateColor?id=${color.id}`);
          }
        }}
      >
        <img
          src={color.imgUrl || '/NoImage.png'}
          alt="Example"
          width={100}
          height={50}
          style={{
            borderRadius: '5px',
          }}
        />
      </div>
      <Modal isOpen={modalIsOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal} style={{ backgroundColor: '#333', color: '#fff' }}>
          Paste an image from clipboard
        </ModalHeader>
        <ModalBody style={{ backgroundColor: '#333', color: '#fff' }}>
          <div style={{ border: '1px solid black', padding: '10px' }} onPaste={handlePaste}>
            Click and paste here
            {/* Display the pasted image */}
            {uploadProgress > 0 && (
            <div>
              Upload Progress:
              {uploadProgress}
              %
            </div>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Pasted from clipboard"
                style={{ maxWidth: '100%', height: '300px' }}
              />
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ImageClipboardComponent;
