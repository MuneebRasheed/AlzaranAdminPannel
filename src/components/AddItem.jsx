import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import toast from 'react-hot-toast';
import database from '../../firebase';

function AddItem() {
  const [itemName, setItemName] = useState('');

  const addItem = () => {
    try {
      const id = toast.loading('creating');
      const itemsRef = ref(database, 'items');
      const newItem = {
        name: itemName,
      };

      push(itemsRef, newItem);
      setItemName('');
      toast.success('success', { id });
    } catch (error) {
      console.error('Error adding item:', error.message);
      toast.success('errro');

      // You can add further error handling or display error messages here
    }
  };

  return (
    <div>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button type="button" onClick={addItem}>Add Item</button>
    </div>
  );
}

export default AddItem;
