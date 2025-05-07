import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import AuthLayout from '../layout/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // This will be either username or email
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier) {
      newErrors.identifier = 'Username or Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Try admin login first
      try {
        const adminResponse = await axios.post('http://localhost:3000/api/auth/login', {
          username: formData.identifier,
          password: formData.password
        });

        if (adminResponse.data.token) {
          localStorage.setItem('token', adminResponse.data.token);
          localStorage.setItem('userType', 'admin');
          toast.success('Admin login successful!');
          navigate('/adminDashboard');
          return;
        }
      } catch (adminError) {
        // Only proceed to user login if admin login returns 401 (Unauthorized)
        if (adminError.response?.status !== 401) {
          throw adminError; // If it's a different error, throw it
        }
        
        // Try user login
        const userResponse = await axios.post('http://localhost:3000/api/users/login', {
          identifier: formData.identifier,
          password: formData.password
        });

        if (userResponse.data.token) {
          localStorage.setItem('token', userResponse.data.token);
          localStorage.setItem('userType', 'user');
          localStorage.setItem('userData', JSON.stringify(userResponse.data.user));
          toast.success('Login successful!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  return (
    <AuthLayout>
      <div className="slide-in">
        <h2 className="text-center text-3xl font-extrabold text-white font-poppins mb-8">
          Welcome Back
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-white">
              Username or Email
            </label>
            <div className="mt-1">
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/10 text-white backdrop-blur-sm"
                placeholder="Enter your username or email"
              />
              {errors.identifier && (
                <p className="mt-2 text-sm text-red-400">{errors.identifier}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/10 text-white backdrop-blur-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

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