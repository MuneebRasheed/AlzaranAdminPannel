import React, { useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function ExportModal({ onExport }) {
  const [modal, setModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const toggle = () => {
    setModal(!modal);
    setSelectedOptions([]);
  };

  const handleExport = () => {
    if (selectedOptions.length === 0) {
      toast.error('Select an option');
      return;
    }
    onExport(selectedOptions.map(({ value }) => value));
    toggle();
  };

  const manufacturersOptions = useSelector(
    (state) => state.manufacture.mtSearchOptions,
  );

  const options = [
    { value: 'all', label: 'Select All' },
    ...manufacturersOptions,
  ];

  const handleSelectChange = (selectedOption) => {
    if (selectedOption && selectedOption.length > 0 && selectedOption[selectedOption.length - 1].value === 'all') {
      setSelectedOptions(options.slice(1)); // Select all options except 'Select All'
    } else {
      setSelectedOptions(selectedOption);
    }
  };

  return (
    <div>
      <Button color="dark" onClick={toggle}>Export Color</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleSelectChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleExport}>Export</Button>
          {' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ExportModal;
