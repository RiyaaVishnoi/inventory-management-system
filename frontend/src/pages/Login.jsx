import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  // Form state for email and password inputs
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes for form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission for user authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Send authentication request to Djoser JWT endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/jwt/create/",
        form
      );

      // Store JWT tokens in localStorage for future API requests
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Check user approval status
      try {
        const userResponse = await axios.get("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });

        if (userResponse.data.approval_status === "pending") {
          setMessage(
            "Sorry, your account is pending approval. Please try again after approval."
          );
          // Clear tokens since user can't access the system yet
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          // Don't redirect, let user see the message
        } else {
          setMessage("Login successful!");
          // Redirect to home page after successful login
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      } catch (userError) {
        // If can't get user info, proceed with normal login
        setMessage("Login successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch {
      // Handle authentication failure
      setMessage("Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Background pattern with subtle dots */}
      <div className="absolute inset-0 bg-[#F8F8F8]"></div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding Section */}
        <div className="text-center mb-8">
          {/* Film reel logo icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full mb-4">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <g>
                {/* Left film frame */}
                <rect
                  x="4"
                  y="8"
                  width="6"
                  height="8"
                  rx="1"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <circle cx="7" cy="12" r="1" fill="black" />

                {/* Right film frame */}
                <rect
                  x="14"
                  y="8"
                  width="6"
                  height="8"
                  rx="1"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <circle cx="17" cy="12" r="1" fill="black" />

                {/* Connecting horizontal line between frames */}
                <line
                  x1="10"
                  y1="12"
                  x2="14"
                  y2="12"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </div>

          {/* Application title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            FilmStock Pro
          </h1>

          {/* Application tagline */}
          <p className="text-gray-600">
            Professional inventory management for film production
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Navigation Tabs */}
          <div className="flex mb-6">
            {/* Sign In tab (active state) */}
            <a
              href="/login"
              className="flex-1 bg-gray-100 rounded-l-lg p-3 text-center text-gray-800 font-medium"
            >
              Sign In
            </a>

            {/* Sign Up tab (inactive state) */}
            <a
              href="/signup"
              className="flex-1 bg-white rounded-r-lg p-3 text-center text-gray-800 font-medium"
            >
              Sign Up
            </a>
          </div>

          {/* Form Header Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to your FilmStock Pro account
            </p>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                {/* Envelope icon for email input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@myunitec.ac.nz"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                {/* Lock icon for password input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot your password?
            </a>
          </div>

          {/* Success/Error Message Display */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                message.includes("successful")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Footer Section with Trust Indicators */}
        <div className="text-center mt-8 space-y-4">
          {/* Trust statement */}
          <p className="text-gray-600">
            Trusted by film professionals worldwide
          </p>

          {/* Feature badges with icons */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            {/* Equipment Tracking feature */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Equipment Tracking</span>
            </div>

            {/* Asset Management feature */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Asset Management</span>
            </div>

            {/* Production Ready feature */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Production Ready</span>
            </div>
          </div>

          {/* Navigation back to home */}
          <div className="pt-4">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2"
            >
              <span>←</span>
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
