import { useState } from "react";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../utils/firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const storage = getStorage();

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!title || !author || !imageFile) {
      // Display an error toast if any field is empty
      toast.error('Please fill in all fields and select an image.');
      return;
    }

    const storageRef = ref(storage, `menu/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    try {
      const uploadSnapshot = await uploadTask;
      const imageUrl = await getDownloadURL(uploadSnapshot.ref);
      const book = { title, author, imageUrl };

      const docRef = await addDoc(collection(db, "books"), book);
      console.log("Book added with ID:", docRef.id);
      setTitle("");
      setAuthor("");
      setImageFile(null);
      toast.success('Book added successfully.');
      router.push("/");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error('Error adding book. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">Add Book</h1>
        <form onSubmit={handleAddBook} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none w-full"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none w-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="py-2"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}
