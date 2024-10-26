import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/api/urls'
import { useToast } from '../context/ToastContext'


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isSending, setIsSending] = useState(false)
    const navigate = useNavigate()

    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)
        try {
            await axios.post(`${API_BASE_URL}/forgot-password/`, { email })
            showToast('Password reset OTP sent', 'success')
            setError('')
            navigate('/forgot-password-verification', { state: { email } })
        } catch (err) {
            console.error(err)
            if (err.response) {
                setError(err.response.data.error)
            } else {
                setError('Error resetting password. Please try again.')
            }
            showToast('Error resetting password. Please try again.', 'error')
            
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center p-6 bg-zinc-50">
            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/assets/fav-rounded.png" className="w-10 h-10" alt="Logo" />
                    <h2 className="text-xl font-medium tracking-wider text-zinc-900">SNAPER</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Forgot Password</h1>
                        <p className="text-zinc-600">Enter your email to receive a password reset OTP</p>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" 
                                className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-snaper-red-400 text-center">
                            Error: {error}
                        </div>
                    )}

                    <button 
                        disabled={isSending}
                        type="submit"
                        className="w-full bg-snaper-red-500 hover:bg-snaper-red-700 text-white p-3 font-medium 
                        uppercase tracking-wide transition-colors duration-200 ease-in-out
                        disabled:cursor-not-allowed  disabled:bg-gray-200 disabled:text-gray-500"
                    >
                        {isSending ? (
                                <>
                                <span className="animate-spin inline-block">↻</span>
                                <span className="ml-2">Sending...</span>
                                </>
                            ) : (
                                'Send OTP'
                            )}
                    </button>
                    <div className="text-center text-sm text-zinc-600">
                        Remember your password?{' '}
                        <Link to="/signin" className="text-snaper-red-500 hover:text-snaper-red-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword