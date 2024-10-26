import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../utils/api/urls'
import { useToast } from '../context/ToastContext'
import axiosInstance from '../utils/api/axiosInstance'
import { clearAccessToken } from '../utils/redux/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../utils/redux/store'
import { useSelector } from 'react-redux'

const ResetPassword: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken)

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    
    useEffect(() => {
        if (!token) {
            navigate('/signin')
            return
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
          }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)   
        try {
            await axiosInstance.patch(`${API_BASE_URL}/reset-password/`, {
                new_password: passwords.newPassword
            })
            dispatch(clearAccessToken())
            navigate('/signin', { state: { message: 'Password reset successful' } })
        } catch (err) {
            showToast(err.response.data.error, 'error')
            setError('Error resetting password. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        })
        setError('')
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
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Set New Password</h1>
                        <p className="text-zinc-600">Enter your new password below</p>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="newPassword" 
                               className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                            New Password
                        </label>
                        <input 
                            type="password" 
                            id="newPassword"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white"
                            placeholder="Enter new password"
                            required
                        />
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
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-zinc-300 p-3 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-snaper-red-400">
                            {error}
                        </div>
                    )}

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
                        'Reset Password'
                      )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword