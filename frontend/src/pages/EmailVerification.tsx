import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/api/urls'

const EmailVerification: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [remainingTime, setRemainingTime] = useState(60) // 5 minutes
    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.email
    const [isResending, setIsResending] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)


    useEffect(() => {
        if (!email) {
            navigate('/')
            return
        }
        const timer = setInterval(() => {
            setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`)
                nextInput?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleResendOtp = async () => {
        setIsResending(true)
        try {
            await axios.post(`${API_BASE_URL}/resend-otp/`, { email })
            setRemainingTime(60)
            setError('')
        } catch (err) { 
            console.error(err)
            setError(err.response.data.error)
        } finally {
            setIsResending(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpString = otp.join('')
        
        if (otpString.length !== 6) {
            setError('Please enter all digits')
            return
        }

        setIsVerifying(true)
        try {
            await axios.post(`${API_BASE_URL}/verify-email/`, {
                email,
                otp: otpString
            })
            navigate('/signin', { state: { message: 'Email verified successfully' } })
        } catch (err) {
            console.error(err)
            if (err.response.data.error) {
                setError(err.response.data.error)
            } else {
                setError('Failed to verify email')
            }
        } finally {
            setIsVerifying(false)
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
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Verify Your Email</h1>
                        <p className="text-zinc-600">Enter the 6-digit code sent to</p><span className=" text-snaper-red-500">{email}</span>
                    </div>

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center border border-zinc-300 focus:outline-none focus:border-snaper-red-500 focus:ring-1 focus:ring-snaper-red-500 bg-white text-xl"
                                required
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="text-snaper-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-snaper-red-500 hover:bg-snaper-red-700 text-white p-3 font-medium uppercase
                         tracking-wide transition-colors duration-200 ease-in-out 
                         disabled:cursor-not-allowed  disabled:bg-gray-200 disabled:text-gray-500"
                    >
                        {isVerifying ? (
                        <>
                          <span className="animate-spin inline-block">↻</span>
                          <span className="ml-2">Verifying...</span>
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-zinc-600">
                            Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                        </p>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={remainingTime > 0 || isResending}
                            className={`text-sm ${
                                remainingTime > 0 || isResending
                                    ? 'text-zinc-400 cursor-not-allowed' 
                                    : 'text-snaper-red-500 hover:text-snaper-red-700'
                            }`}
                        >
                            {isResending ? (
                                    <>
                                    <span className="animate-spin inline-block">↻</span>
                                    <span className="ml-2">Resending...</span>
                                    </>
                                ) : (
                                    'Resend OTP'
                                )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmailVerification