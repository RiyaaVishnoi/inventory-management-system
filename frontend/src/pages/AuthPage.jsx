import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  // 탭 상태 관리 (login 또는 signup)
  const [activeTab, setActiveTab] = useState("login");

  // 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // 회원가입 폼 상태
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    unitecId: "",
    yearGroup: "",
    password: "",
    rePassword: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 폼 입력 변경 핸들러
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // 회원가입 폼 입력 변경 핸들러
  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  // 로그인 폼 제출 핸들러
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // JWT 토큰 요청
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/jwt/create/",
        loginForm
      );

      // 토큰을 localStorage에 저장
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // 사용자 정보 확인
      try {
        const userResponse = await axios.get("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });

        const user = userResponse.data;

        if (user.approval_status === "pending") {
          setMessage(
            "Sorry, your account is pending approval. Please try again after approval."
          );
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        } else {
          setMessage("Login successful!");

          // 모든 사용자는 홈페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      } catch (userError) {
        // 토큰 만료 시 갱신 시도
        if (userError.response?.status === 401) {
          const refreshToken = localStorage.getItem("refresh");
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(
                "http://127.0.0.1:8000/api/auth/jwt/refresh/",
                { refresh: refreshToken }
              );
              localStorage.setItem("access", refreshResponse.data.access);

              // 새로운 토큰으로 사용자 정보 재요청
              const retryUserResponse = await axios.get(
                "http://127.0.0.1:8000/api/me/",
                {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.access}`,
                  },
                }
              );

              const user = retryUserResponse.data;

              if (user.approval_status === "pending") {
                setMessage(
                  "Sorry, your account is pending approval. Please try again after approval."
                );
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
              } else {
                setMessage("Login successful!");
                setTimeout(() => {
                  window.location.href = "/";
                }, 1000);
              }
            } catch {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              setMessage("Login failed: Session expired. Please login again.");
            }
          } else {
            setMessage("Login failed: Invalid credentials");
          }
        } else {
          setMessage("Login successful!");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      }
    } catch {
      setMessage("Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 폼 제출 핸들러
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // 비밀번호 일치 확인
    if (signupForm.password !== signupForm.rePassword) {
      setMessage("Signup failed: Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 회원가입 데이터 준비
      const registrationData = {
        email: signupForm.email,
        password: signupForm.password,
        re_password: signupForm.rePassword,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        unitec_id: signupForm.unitecId,
        year_group: signupForm.yearGroup,
      };

      await axios.post(
        "http://127.0.0.1:8000/api/auth/users/",
        registrationData
      );

      // Unitec 이메일 확인
      const isUnitecEmail = signupForm.email.includes("@myunitec.ac.nz");

      if (isUnitecEmail) {
        setMessage("Signup successful! You can now log in.");
        setTimeout(() => {
          setActiveTab("login");
        }, 2000);
      } else {
        setMessage(
          "Signup successful! Your account is pending approval. You will be notified once approved."
        );
        setTimeout(() => {
          setActiveTab("login");
        }, 3000);
      }
    } catch (error) {
      // API 에러 처리
      if (error.response?.data?.email) {
        setMessage("Signup failed: " + error.response.data.email[0]);
      } else if (error.response?.data?.first_name) {
        setMessage("Signup failed: " + error.response.data.first_name[0]);
      } else if (error.response?.data?.last_name) {
        setMessage("Signup failed: " + error.response.data.last_name[0]);
      } else if (error.response?.data?.unitec_id) {
        setMessage("Signup failed: " + error.response.data.unitec_id[0]);
      } else if (error.response?.data?.password) {
        setMessage("Signup failed: " + error.response.data.password[0]);
      } else if (error.response?.data?.re_password) {
        setMessage("Signup failed: " + error.response.data.re_password[0]);
      } else {
        setMessage("Signup failed: Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Background pattern */}
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

        {/* Auth Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Navigation Tabs */}
          <div className="flex mb-6">
            {/* Sign In tab */}
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 p-3 text-center font-medium rounded-l-lg ${
                activeTab === "login"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-800"
              }`}
            >
              Sign In
            </button>

            {/* Sign Up tab */}
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 p-3 text-center font-medium rounded-r-lg ${
                activeTab === "signup"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Header Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "login"
                ? "Sign in to your FilmStock Pro account"
                : "Join FilmStock Pro to manage your inventory"}
            </p>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                    value={loginForm.email}
                    onChange={handleLoginChange}
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
                    value={loginForm.password}
                    onChange={handleLoginChange}
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
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name Input Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <div className="relative">
                    {/* Person icon for first name */}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={signupForm.firstName}
                      onChange={handleSignupChange}
                      placeholder="John"
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Last Name Input Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={signupForm.lastName}
                    onChange={handleSignupChange}
                    placeholder="Doe"
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Unitec Student ID Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unitec Student ID
                </label>
                <div className="relative">
                  {/* ID card icon for student ID */}
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
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="unitecId"
                    value={signupForm.unitecId}
                    onChange={handleSignupChange}
                    placeholder="1234567"
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Address Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  {/* Envelope icon for email */}
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
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    placeholder="example@myunitec.ac.nz"
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Year Group Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Group (e.g., 2025, 2024)
                </label>
                <div className="relative">
                  {/* Calendar icon for year group */}
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="yearGroup"
                    value={signupForm.yearGroup}
                    onChange={handleSignupChange}
                    placeholder="2025"
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  {/* Lock icon for password */}
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
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  {/* Lock icon for password */}
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
                    name="rePassword"
                    value={signupForm.rePassword}
                    onChange={handleSignupChange}
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
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {/* Forgot Password Link (Login 탭에서만 표시) */}
          {activeTab === "login" && (
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot your password?
              </a>
            </div>
          )}

          {/* Terms and Privacy Policy Section (Signup 탭에서만 표시) */}
          {activeTab === "signup" && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our{" "}
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          )}

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

export default AuthPage;
