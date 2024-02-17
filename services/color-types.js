import {
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where,
} from 'firebase/firestore';
import { db } from '../firebase';

// eslint-disable-next-line import/prefer-default-export
export const create = async (name, id) => {
  const currentDate = new Date();
  const data = {
    name,
    createdAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
    updatedAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
    idToDisplay: id,
  };

  const docRef = await addDoc(collection(db, '/colorTypes'), data);
  return { id: docRef.id, ...data };
};

export const getAllColorTypes = async () => {
  const colorTypesCollection = collection(db, 'colorTypes');

  const querySnapshot = await getDocs(colorTypesCollection);

  const colorTypes = [];
  querySnapshot.forEach((tempDoc) => {
    colorTypes.push({
      id: tempDoc.id,
      ...tempDoc.data(),
    });
  });

  return colorTypes;
};

export const updateColorType = async (id, type) => {
  const currentDate = new Date();
  const data = {
    ...type,
    updatedAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
  };

  const colorTypeRef = doc(db, '/colorTypes', id);

  await updateDoc(colorTypeRef, data);

  return { id, ...data };
};

export const deleteColorType = async (id) => {

  const colorTypeRef = doc(db, '/colorTypes', id);

  const manufacturerQuery = query(collection(db, '/colors'), where('colorType', '==', id));
  const manufacturerSnapshot = await getDocs(manufacturerQuery);

  try {

    
    // Delete each document found in the query result
    const deletePromises = manufacturerSnapshot.docs.map(async (doc) => {

      await deleteDoc(doc.ref);
      // await doc.ref.delete();
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
    await deleteDoc(colorTypeRef);
    // Return the provided ID after successful deletion
    window.location.reload();
    return id;
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting documents:', error);
    throw error;
  }

  return id;
};
