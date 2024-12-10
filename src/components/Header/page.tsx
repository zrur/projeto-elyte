'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Calculator, UserCircle } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: '/', label: 'Início', icon: <Calculator size={20} /> },
    { href: '/calcular', label: 'Calcular Notas', icon: <Calculator size={20} /> },
    { href: '/Login', label: 'Perfil', icon: <UserCircle size={20} /> }
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
       
        

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden z-50"
          aria-label="Menu de navegação"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-blue-600 z-40 md:hidden"
            onClick={toggleMenu}
          >
            <nav className="flex flex-col items-center justify-center h-full space-y-6">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="flex items-center space-x-3 text-2xl hover:text-blue-200 transition-colors"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}