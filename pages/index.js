import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

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

  const handleLogout = () => {
    auth.signOut();
    router.push("/login");
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteDoc(doc(db, "books", bookId));
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setSelectedBook(null);
    } catch (error) {
      console.log("Error deleting book: ", error);
    }
  };

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId === selectedBook ? null : bookId);
  };

  return (
    <div className="w-full">
      <div className="mt-8">
        <h1 className="text-3xl text-black-800 font-bold">Dashboard</h1>
      </div>

      <div className="mt-8 mb-20 flex justify-center space-x-20">
        <Link href="/add-book">
          <span className="px-20 py-20 text-3xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:from-indigo-600 hover:to-purple-700">
            ADD BOOK
          </span>
        </Link>

        <Link href="/edit-book">
          <span className="px-20 py-20 text-3xl text-white bg-gradient-to-r from-yellow-500 to-orange-600 rounded-md hover:from-yellow-600 hover:to-orange-700 cursor-pointer">
            EDIT BOOK
          </span>
        </Link>
      </div>

      <div className="mt-[9rem] mb-10 flex justify-center">
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl text-black-800 font-bold flex justify-center">Books</h2>
          {books.map((book) => (
            <div
              key={book.id}
              className={`mt-4 bg-gray-300 rounded-lg shadow-md ${
                book.id === selectedBook ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => handleBookClick(book.id)}
            >
              <div className="p-4">
                <div className="text-lg font-semibold">{book.title}</div>
                <div className="text-gray-600">{book.author}</div>
              </div>
              {book.id === selectedBook && (
                <div className="flex flex-col items-center p-4">
                  <img src={book.imageUrl} alt={book.title} className="w-64 h-64 object-contain" />
                  <button
                    className="mt-4 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 right-10 m-12 flex items-center">
        <button
          onClick={handleLogout}
          className="px-5 py-2 text-white rounded-md bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
