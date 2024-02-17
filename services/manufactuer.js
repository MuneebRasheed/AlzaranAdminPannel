import {
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where,
} from 'firebase/firestore';
import { db } from '../firebase';

export const getAllManuFacturers = async () => {
  const typesCollection = collection(db, 'manuFacturers');

  const querySnapshot = await getDocs(typesCollection);

  const manuFacturers = [];
  querySnapshot.forEach((tempDoc) => {
    manuFacturers.push({
      id: tempDoc.id,
      ...tempDoc.data(),
    });
  });

  return manuFacturers;
};

export const create = async (name) => {
  // Check if a document with the provided name already exists
  const manufacturerQuery = query(collection(db, '/manuFacturers'), where('name', '==', name));
  const manufacturerSnapshot = await getDocs(manufacturerQuery);

  if (!manufacturerSnapshot.empty) {
    // If a document with the provided name already exists, return it
    const manufacturerDoc = manufacturerSnapshot.docs[0];
    return { id: manufacturerDoc.id, ...manufacturerDoc.data(), isAlreadyExist: true };
  }

  // If a document with the provided name does not exist, create a new one
  const currentDate = new Date();
  let newId;
  const array = await getAllManuFacturers();
  if (!array || array.length === 0) {
    newId = 0;
  } else {
    const maxIdToDisplay = Math.max(...array.map((obj) => obj.idToDisplay));
    newId = maxIdToDisplay + 1;
  }

  const data = {
    idToDisplay: newId,
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
  };

  const docRef = await addDoc(collection(db, '/manuFacturers'), data);

  return { id: docRef.id, ...data };
};

export const updateManuFacturer = async (id, type) => {
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

  const typeRef = doc(db, '/manuFacturers', id);

  await updateDoc(typeRef, data);

  return { id, ...data };
};

export const deleteManuFacturer = async (id) => {
  const typeRef = doc(db, '/manuFacturers', id);

  const manufacturerQuery = query(collection(db, '/colors'), where('manufacturer', '==', id));
  const manufacturerSnapshot = await getDocs(manufacturerQuery);

  try {

    
    // Delete each document found in the query result
    const deletePromises = manufacturerSnapshot.docs.map(async (doc) => {

      await deleteDoc(doc.ref);
      // await doc.ref.delete();
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
    await deleteDoc(typeRef);
    // Return the provided ID after successful deletion
    window.location.reload();
    return id;
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting documents:', error);
    throw error;
  }

  
};
