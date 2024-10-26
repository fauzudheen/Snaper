import { Outlet, Link } from 'react-router-dom'
import { Home, LogOut, User } from 'lucide-react'
import { setUserSignOut } from '../utils/redux/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../utils/redux/store'
import { useSelector } from 'react-redux'

const NavbarLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/assets/fav-rounded.png" className="h-10 w-10 rounded-full" alt="Logo" />
                <span className="ml-2 text-xl font-bold text-snaper-red-500">SNAPER</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700"
              >
                <User className="h-5 w-5 mr-1" />
                {user?.username || 'Guest'}
              </div>
              <button 
                className="ml-4 flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-150 ease-in-out"
                onClick={() => dispatch(setUserSignOut())}
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow overflow-auto bg-snaper-red-500 h-full">
        <Outlet />
      </main>
    </div>
  )
}

export default NavbarLayout