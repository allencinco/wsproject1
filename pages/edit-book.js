import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function EditBook() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [editedBook, setEditedBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const storage = getStorage();

  // Fetch all books from Firestore
  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const bookList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookList);
    };
    fetchBooks();
  }, []);

  const handleEditBook = (book) => {
    setEditedBook(book);
  };

  const handleSaveChanges = async () => {
    if (editedBook) {
      try {
        // Update the Firestore document with the edited book data
        const bookRef = doc(db, "books", editedBook.id);
        await updateDoc(bookRef, { title: editedBook.title, author: editedBook.author });

        if (selectedImage) {
          const storageRef = ref(storage, `menu/${selectedImage.name}`);
          const uploadTask = uploadBytesResumable(storageRef, selectedImage);

          const uploadSnapshot = await uploadTask;
          const imageUrl = await getDownloadURL(uploadSnapshot.ref);

          await updateDoc(bookRef, { imageUrl });
        }

        console.log("Changes saved successfully.");
        toast.success("Book edited successfully"); // Display success toast
        router.push("/"); // Redirect to the dashboard or desired page
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedBook(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl text-black-800 font-bold">Edit Book</h1>
      <div className="flex flex-wrap -mx-4">
        {books.map((book) => (
          <div key={book.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mt-6">
            <div
              className="p-4 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
              onClick={() => handleEditBook(book)}
            >
              <div className="text-lg font-semibold">{book.title}</div>
              <div className="text-gray-600">{book.author}</div>
            </div>
          </div>
        ))}
      </div>
      {editedBook && (
        <div className="mt-6 space-x-10">
          <label className="block mb-2 font-semibold">Title:</label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-800 rounded-md focus:outline-none"
            value={editedBook.title}
            onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
          />
          <label className="block mt-4 mb-2 font-semibold">Author:</label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-800 rounded-md focus:outline-none"
            value={editedBook.author}
            onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
          />
          <label className="block mt-4 mb-2 font-semibold">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          <div className="mt-4">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 text-white bg-blue-400 rounded-md hover:bg-blue-700 mr-4"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 text-white bg-red-400 rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
