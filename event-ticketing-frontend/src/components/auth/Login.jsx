import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@asgardeo/auth-react';
import AuthLayout from '../layout/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const { state, signIn, getBasicUserInfo } = useAuthContext();

  useEffect(() => {
    if (state.isAuthenticated) {
      getBasicUserInfo()
        .then((userInfo) => {
          toast.success(`Welcome, ${userInfo.username || 'User'}!`);
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          toast.error('Failed to fetch user information.');
        });
    }
  }, [state.isAuthenticated, getBasicUserInfo, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign-in failed:', error);
      toast.error('Sign-in failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="slide-in">
        <h2 className="text-center text-3xl font-extrabold text-white font-poppins mb-8">
          Welcome Back
        </h2>
        <div className="space-y-6">
          <button
            onClick={handleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Sign in with Asgardeo
          </button>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-white bg-transparent">
                New to the platform?
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
