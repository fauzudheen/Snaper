import React, { useState } from 'react'
import axios from 'axios'
import { SignInRequest } from '../types/types'
import { API_BASE_URL } from '../utils/api/urls'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../utils/redux/store'
import { setUserSignIn } from '../utils/redux/authSlice'
import { Link, useLocation } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

const Signin: React.FC = () => {
    const [formData, setFormData] = useState<SignInRequest>({
        email: '',
        password: '',
    })
    const [error, setError] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/signin/`, formData)
            console.log(response.data)
            dispatch(setUserSignIn(response.data))
            showToast('Successfully signed in!', 'success')
        } catch (err) {
            console.error(err)
            setError('Invalid credentials');
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        setError('')
    }
    const { showToast } = useToast()
    const location = useLocation()

    React.useEffect(() => {
        const message = location.state?.message
        if (message) {
            showToast(message, 'success')
            window.history.replaceState({}, document.title)
        }
    }, [location, showToast])

    return (
        <div className='w-full h-screen flex'>
            <div className="hidden lg:flex w-1/2 bg-snaper-red-500 p-12 flex-col justify-between">
                <div className="flex items-center gap-3">
                    <img src="/assets/fav-rounded.png" className="w-20 h-20" alt="Logo" />
                    <h2 className="text-4xl font-medium tracking-wider text-white">SNAPER</h2>
                </div>
                
                <div className="space-y-6 max-w-lg">
                    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                        Simplify Your Image Management
                    </h1>
                    <p className="text-lg xl:text-xl text-white/80">
                        Snaper lets you easily register, manage, edit, and rearrange your image collections with bulk uploads and drag-and-drop features.
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
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img src="/assets/fav-rounded.png" className="w-10 h-10" alt="Logo" />
                        <h2 className="text-xl font-medium tracking-wider text-zinc-900">SNAPER</h2>
                    </div>
    
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-xl">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
                            <p className="text-zinc-600">Please sign in to your account to continue</p>
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
                                required
                            />
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
    
                        {error && (
                            <div className="mt-1 text-snaper-red-400">
                                {error}
                            </div>
                        )}
                        <div className="text-center">
                            <Link to="/forgot-password" className="text-sm text-zinc-600 hover:text-snaper-red-500">
                                Forgot your password?
                            </Link>
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
                            <span className="ml-2">Signing in...</span>
                            </>
                        ) : (
                            'Sign in'
                        )}
                        </button>
    
                        <div className="text-center text-sm text-zinc-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-snaper-red-500 hover:text-snaper-red-700 font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signin
