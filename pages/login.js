import { FcGoogle, fcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { toast } from 'react-toastify';

function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  //Sign in with google
  const googlProvider = new GoogleAuthProvider();

  const SignInBtnHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googlProvider);
      route.push("/");
      toast.success("Successfully logged in!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
        hideProgressBar: true,
      })
    } catch (err) {
      toast.error("Authentication failed!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
        hideProgressBar: true,
      })
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    }
  }, [user]);


  return (
    <div className="h-full w-full px-2 flex justify-center">
      <div className="mt-24 shadow-xl w-full lg:w-2/5 p-8 lg:p-10 text-gray-700 rounded-lg">
        <h2 className="text-2xl font-medium">Login With Google</h2>
        <div className="py-4">
          <h3 className="py-4">Sign in with one of the providers</h3>
          <button
            onClick={SignInBtnHandler}
            className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2 "
          >
            <FcGoogle className="text-2xl" />
            Sign in with google
          </button>
        </div>
      </div>
    </div>
  );
}
export default Login;