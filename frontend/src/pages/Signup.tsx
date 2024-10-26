import React, { useState } from 'react'
import axios from 'axios'
import { SignUpErrors, SignUpRequest } from '../types/types'
import { API_BASE_URL } from '../utils/api/urls'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [formData, setFormData] = useState<SignUpRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<SignUpErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false)


  const validateForm = () => {
    const newErrors: SignUpErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = 'This field is required'
    }
    if (!formData.email) {
      newErrors.email = 'This field is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.password) {
      newErrors.password = 'This field is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'This field is required'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await axios.post(`${API_BASE_URL}/signup/`, formData) 
      navigate('/email-verification', { state: { email: formData.email } });
    } catch (error) {
      console.error("Error creating user:", error);
      
      if (error.response?.data) {
        const serverErrors = error.response?.data;
        const newErrors = { ...errors }

        if (serverErrors.username) {
          newErrors.username = serverErrors.username
        }
        if (serverErrors.email) {
          newErrors.email = serverErrors.email
        }
        if (serverErrors.password) {
          newErrors.password = serverErrors.password
        }
        setErrors(newErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    setErrors({
      ...errors,
      [e.target.name]: ''
    })
  }

  return (
    <div className='w-full h-screen flex'>
        <div className="hidden lg:flex w-1/2 bg-snaper-red-500 p-12 flex-col justify-between">
            <div className="flex items-center gap-3">
                <img src="/assets/fav-rounded.png" className="w-20 h-20" alt="Logo" />
                <h2 className="text-4xl font-medium tracking-wider text-white">SNAPER</h2>
            </div>
            
            <div className="space-y-6 max-w-lg">
                <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                    Start Your Journey Today
                </h1>
                <p className="text-lg xl:text-xl text-white/80">
                    Join Snaper and discover a new way to manage your images. Create collections, 
                    organize effortlessly, and access your content anywhere.
                </p>

                <div className="flex items-center gap-4 pt-4">
                    <div className="h-1 w-12 bg-white/30"></div>
                    <p className="text-white/60 text-sm tracking-wider">TRUSTED BY USERS</p>
                </div>
            </div>

            <div className="text-white/60 text-sm">
                © 2024 Snaper. All rights reserved.
            </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-zinc-50">
            <div className="w-full max-w-md">
                <div className="lg:hidden flex items-center gap-3 mb-8">
                    <img src="/assets/fav-rounded.png" className="w-10 h-10" alt="Logo" />
                    <h2 className="text-xl font-medium tracking-wider text-zinc-900">SNAPER</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create account</h1>
                        <p className="text-zinc-600">Get started with your free account today</p>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="username" 
                               className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            className='w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white'
                            placeholder="Choose a username"
                        />
                        {errors.username && (
                            <div className="mt-1 text-sm text-snaper-red-300">
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" 
                               className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className='w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white'
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <div className="mt-1 text-sm text-snaper-red-300">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" 
                               className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className='w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white'
                            placeholder="Create a password"
                        />
                        {errors.password && (
                            <div className="mt-1 text-sm text-snaper-red-300">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" 
                               className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            Confirm Password
                        </label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            className='w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white'
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <div className="mt-1 text-sm text-snaper-red-300">
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>
                    <button 
                        disabled={isSubmitting} 
                        type="submit" 
                        className="w-full bg-snaper-red-500 hover:bg-snaper-red-700 text-white p-3 
                        font-medium uppercase disabled:cursor-not-allowed  disabled:bg-gray-200 disabled:text-gray-500
                        tracking-wide transition-colors duration-200 ease-in-out"
                    >
                        {isSubmitting ? (
                        <>
                          <span className="animate-spin inline-block">↻</span>
                          <span className="ml-2">Submitting...</span>
                        </>
                      ) : (
                        'Create account'
                      )}
                    </button>
                    

                    <div className="text-center text-sm text-zinc-600">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-snaper-red-500 hover:text-snaper-red-700 font-medium">
                            Sign in
                        </Link >
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default Signup
