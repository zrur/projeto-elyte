'use client';
import React from 'react'
import { useState } from 'react';
import './globals.css';
import Head from 'next/head';
import Header from '@/components/Header/page';
import { ArrowRight, Calculator } from 'lucide-react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col justify-center items-center text-white">
      {/* Header */}
      <Header />

      {/* Head */}
      <Head>
        <title>Cálculo do Boletim</title>
        <meta name="description" content="Bem-vindo ao cálculo do boletim escolar!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 max-w-xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Boletim Escolar
          </h1>
          <p className="text-xl opacity-90">
            Simplifique sua vida escolar com nossa calculadora inteligente
          </p>
        </header>

        <main className="bg-white text-blue-900 p-10 rounded-xl shadow-2xl transform transition-all hover:scale-105">
          <div className="text-center">
            <Calculator className="mx-auto mb-6 text-blue-600" size={64} />
            <h2 className="text-2xl font-bold mb-6">
              Calcule Suas Notas Facilmente
            </h2>
            <p className="text-gray-600 mb-8">
              Acompanhe seu desempenho acadêmico com precisão e rapidez.
            </p>

            <button
              className="bg-blue-500 text-white px-8 py-3 rounded-lg 
              flex items-center justify-center mx-auto space-x-2 
              hover:bg-blue-600 transition-colors group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>Começar Agora</span>
              <ArrowRight
                className={`ml-2 transition-transform ${
                  isHovered ? 'translate-x-1' : ''
                }`}
                size={20}
              />
            </button>
          </div>
        </main>

        <footer className="mt-12 text-center opacity-70">
          <p>
            © {new Date().getFullYear()} Cálculo do Boletim.
            Todos os direitos reservados.
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <a href="#" className="hover:underline">Termos de Uso</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
