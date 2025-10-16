import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [lightboxImage, setLightboxImage] = useState(null);

  // AI Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm Lee Public Support, your AI assistant. I can help you with information about IAMLEE's services including account verification, social media boosting, logo design, and online business visibility. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyBek6oPwYsAjivwEBKN6R_LXrAz1ivduUc');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const sections = ['home', 'about', 'verification', 'boosting', 'logos', 'visibility', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are Lee Public Support, an AI assistant for IAMLEE's business services. IAMLEE is a music promotion content creator and social media expert offering these services:

      1. ACCOUNT VERIFICATION SERVICES:
      - Instagram & WhatsApp Blue Tick verification
      - Professional verification service with guaranteed results
      - Negotiable pricing based on customer discussion

      2. SOCIAL MEDIA BOOSTING:
      - Boosting followers, likes, views, and subscribers
      - Available for Instagram, YouTube, Facebook, and Threads
      - Real engagement and growth services

      3. LOGO DESIGN SERVICES:
      - Professional logo design and branding
      - Multiple design concepts provided
      - High-resolution files and brand guidelines included
      - Negotiable pricing based on customer requirements

      4. ONLINE BUSINESS VISIBILITY:
      - Google Maps and Apple Maps integration
      - Business listing optimization
      - Local SEO enhancement
      - Making businesses easily discoverable online

      Always be helpful, professional, and informative. Direct users to contact IAMLEE via WhatsApp (+255 623 996 016) for quotes and detailed discussions. Provide accurate information about all services and encourage direct communication for pricing and custom requirements.`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: "Understood! I'm Lee Public Support and I'm ready to help customers with information about IAMLEE's services. I have comprehensive knowledge about account verification, social media boosting, logo design, and online business visibility services. I'll be professional, helpful, and always direct customers to contact IAMLEE directly for quotes and detailed discussions." }]
          }
        ]
      });

      const result = await chat.sendMessage(inputMessage);
      const response = await result.response;
      const botMessage = {
        type: 'bot',
        content: response.text(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        type: 'bot',
        content: "I apologize, but I'm experiencing some technical difficulties. Please contact IAMLEE directly via WhatsApp at +255 623 996 016 for immediate assistance with your inquiry.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const profileImageUrl = 'https://i.ibb.co/whQWzxv2/Screenshot-2025-10-16-at-22-20-36-Instagram.png';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white font-sans relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                IAMLEE
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'verification', label: 'Verification' },
                  { id: 'boosting', label: 'Social Boost' },
                  { id: 'logos', label: 'Logo Design' },
                  { id: 'visibility', label: 'Online Presence' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-cyan-400 ${
                      activeSection === item.id
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <a href="https://www.instagram.com/iamlee316" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@iamlee316" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@iamlee316" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/labda_sio_lee" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                Get In Touch
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'verification', label: 'Verification Services' },
                { id: 'boosting', label: 'Social Media Boost' },
                { id: 'logos', label: 'Logo Design' },
                { id: 'visibility', label: 'Online Presence' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-300 w-full text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Profile Picture */}
              <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative">
                    <img
                      src={profileImageUrl}
                      alt="IAMLEE - Professional Content Creator"
                      className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-slate-700 shadow-2xl hover:border-cyan-400/50 transition-all duration-500 hover:shadow-cyan-400/20"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="text-center lg:text-left">
              {/* Status Badge */}
              <div className={`mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  Available for Music Promotion & Social Media Services
                </span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="block text-white mb-2">Hi, I'm</span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  LEE
                </span>
              </h1>

              {/* Professional Title */}
              <div className={`mb-8 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mb-4">
                  Music Promotion Content Creator & Social Media Expert
                </h2>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                  Specializing in music promotion, social media account management, and boosting online presence.
                  Trusted by <span className="text-cyan-400 font-semibold">artists and businesses</span> for authentic growth and verified results across all platforms.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-400/25">
                  <span className="flex items-center">
                    Let's Collaborate
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <button className="px-8 py-4 border-2 border-slate-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-cyan-400/10">
                  View Portfolio
                </button>
              </div>

              {/* Social Proof */}
              <div className={`mt-12 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-sm text-gray-500 mb-4">Trusted by leading brands and featured on</p>
                <div className="flex justify-center lg:justify-start items-center space-x-6">
                  {['Instagram', 'YouTube', 'Twitter/X', 'Threads'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-sm font-medium">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">About</span>
              <span className="text-white block mt-2">IAMLEE</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Music promotion content creator and social media expert specializing in account verification services, social media boosting, and digital presence enhancement.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Digital Marketing Expertise</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  With extensive experience in <span className="text-cyan-400 font-semibold">music promotion</span> and
                  social media management, I help artists and businesses establish strong online presence through
                  strategic content creation and platform optimization.
                </p>
                <p>
                  My specialization includes <span className="text-purple-400 font-semibold">Instagram/WhatsApp verification services</span>,
                  social media boosting, logo design, and enhancing business visibility across digital platforms.
                </p>
                <p>
                  Every service is delivered with <span className="text-emerald-400 font-semibold">proven results</span> and
                  guaranteed satisfaction, backed by years of successful partnerships with artists and businesses.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mb-2">Account Verification</div>
                <div className="text-gray-400 text-sm">Blue tick services</div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-purple-400/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mb-2">Social Media Boost</div>
                <div className="text-gray-400 text-sm">Growth & engagement</div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-emerald-400/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mb-2">Logo Design</div>
                <div className="text-gray-400 text-sm">Professional branding</div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-orange-400/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 0a9 9 0 01-9-9m9 9a9 9 0 00-9 9m9-9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h.01" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mb-2">Online Visibility</div>
                <div className="text-gray-400 text-sm">Maps & presence</div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">100+</div>
                <div className="text-gray-400 font-medium">Verified Accounts</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-gray-400 font-medium">Social Boosts</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent mb-2">200+</div>
                <div className="text-gray-400 font-medium">Logo Designs</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">150+</div>
                <div className="text-gray-400 font-medium">Business Maps</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Services Section */}
      <section id="verification" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Account</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Verification Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get your Instagram and WhatsApp accounts verified with the official blue tick at affordable rates.
              Professional service with guaranteed results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Why Get Verified?</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <span className="text-cyan-400 font-semibold">Official blue tick verification</span> adds credibility
                  and authenticity to your social media presence, making your account stand out from the crowd.
                </p>
                <p>
                  Our service provides <span className="text-purple-400 font-semibold">fast, reliable verification</span>
                  for both Instagram and WhatsApp at competitive prices with money-back guarantee.
                </p>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Service Includes:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Instagram Blue Tick Verification
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      WhatsApp Business Verification
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Official Badge Authentication
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      24/7 Support & Guidance
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Get Quote for Verification
              </button>
            </div>
          </div>

          {/* Verification Proof Gallery */}
          <div>
            <h3 className="text-2xl font-bold text-white text-center mb-8">Success Stories</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                'account1_ver.jpeg',
                'account2_ver.jpeg',
                'account3_ver.jpeg',
                'account4_ver.jpeg',
                'account5_ver.jpeg'
              ].map((image, index) => (
                <div key={index} className="group bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer" onClick={() => setLightboxImage(`/pics/${image}`)}>
                  <div className="relative">
                    <img
                      src={`/pics/${image}`}
                      alt={`Verification success story ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-xs text-gray-400">Verified Account</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Boosting Section */}
      <section id="boosting" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Social Media</span>
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Boosting Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Boost your social media presence with real engagement, followers, and subscribers across Instagram,
              Threads, Facebook, and YouTube.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                platform: "Instagram",
                icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                color: "pink"
              },
              {
                platform: "YouTube",
                icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                color: "red"
              },
              {
                platform: "Facebook",
                icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                color: "blue"
              },
              {
                platform: "Threads",
                icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                color: "purple"
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 group hover:bg-slate-800/70">
                <div className={`w-16 h-16 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">{item.platform}</h3>
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center text-gray-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                    <span className="text-sm">Followers</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-sm">Likes</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-300">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                    <span className="text-sm">Views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boosting Proof Gallery */}
          <div>
            <h3 className="text-2xl font-bold text-white text-center mb-8">Results Gallery</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                'socialboosting1.jpeg',
                'socialboost2.jpeg',
                'socialboosting3.jpeg'
              ].map((image, index) => (
                <div key={index} className="group bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-purple-400/50 transition-all duration-300 cursor-pointer" onClick={() => setLightboxImage(`/pics/${image}`)}>
                  <div className="relative">
                    <img
                      src={`/pics/${image}`}
                      alt={`Social media boost result ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center space-x-1 mb-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">Boost Results</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Design Section */}
      <section id="logos" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Professional</span>
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">Logo Design</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create a lasting impression with professionally designed logos that capture your brand's essence
              and stand out in the digital landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Brand Identity Design</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Every business needs a <span className="text-emerald-400 font-semibold">memorable logo</span> that
                  represents their values and creates instant recognition. Our professional logo design service
                  delivers exactly that.
                </p>
                <p>
                  We work closely with you to understand your vision and create designs that are
                  <span className="text-teal-400 font-semibold">unique, scalable, and versatile</span> across all platforms.
                </p>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Design Package Includes:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Multiple Design Concepts
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      High-Resolution Files
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Vector & Raster Formats
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Brand Guidelines
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Get Quote for Logo Design
              </button>
            </div>
          </div>

          {/* Logo Portfolio Gallery */}
          <div>
            <h3 className="text-2xl font-bold text-white text-center mb-8">Portfolio Gallery</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                'logodesign1.jpeg',
                'logodesign2.jpeg',
                'logodesign3.jpeg',
                'logodesign4.jpeg',
                'logodesig5.jpeg'
              ].map((image, index) => (
                <div key={index} className="group bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer" onClick={() => setLightboxImage(`/pics/${image}`)}>
                  <div className="relative">
                    <img
                      src={`/pics/${image}`}
                      alt={`Logo design ${index + 1}`}
                      className="w-full h-32 object-contain rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-xs text-gray-400">Logo Design</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online Visibility Section */}
      <section id="visibility" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Online</span>
              <span className="block bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Business Visibility</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Make your business easily discoverable online with enhanced map presence and location services
              that drive customers to your doorstep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Google Maps & Location Services</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Ensure your business appears prominently in <span className="text-orange-400 font-semibold">Google Maps,
                  Apple Maps, and other navigation services</span> so customers can easily find you.
                </p>
                <p>
                  Our service optimizes your business listing with accurate information, photos, and
                  enhanced visibility to improve local search rankings.
                </p>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Visibility Package:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Google Maps Integration
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Apple Maps Listing
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Business Information Optimization
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Local SEO Enhancement
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Get Quote for Online Visibility
              </button>
            </div>
          </div>

          {/* Visibility Poster */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Service Overview</h3>
            <div className="max-w-2xl mx-auto cursor-pointer" onClick={() => setLightboxImage("/pics/wekabisharayakoonline.jpeg")}>
              <div className="relative group">
                <img
                  src="/pics/wekabisharayakoonline.jpeg"
                  alt="Online Business Visibility Service"
                  className="w-full rounded-lg shadow-2xl border border-slate-700 group-hover:shadow-cyan-400/20 transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Let's</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-xl text-gray-300">
              Ready to collaborate? Let's discuss how we can bring your vision to life.
            </p>
          </div>

          <div className="bg-slate-800/30 p-8 md:p-12 rounded-2xl border border-slate-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Email</div>
                      <div className="text-gray-400">leonardvicent316@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Response Time</div>
                      <div className="text-gray-400">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300" />
                    <input type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300" />
                  <textarea rows={4} placeholder="Tell me about your project..." className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300 resize-none"></textarea>
                  <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
                IAMLEE
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 max-w-md">
                Music promotion content creator and social media expert specializing in account verification,
                social media boosting, logo design, and online business visibility services.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/iamlee316" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@iamlee316" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@iamlee316" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/labda_sio_lee" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {['Account Verification', 'Social Media Boost', 'Logo Design', 'Online Visibility'].map((service) => (
                  <li key={service}>
                    <span className="text-gray-400 text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Platforms</h4>
              <ul className="space-y-2">
                {['Instagram', 'WhatsApp', 'YouTube', 'TikTok', 'Facebook'].map((platform) => (
                  <li key={platform}>
                    <span className="text-gray-400 text-sm">{platform}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 IAMLEE. All rights reserved. | Music Promotion Content Creator & Social Media Services Expert
            </p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="AI Support Chat"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {isChatOpen ? 'Close AI Chat' : 'Lee Public Support'}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-4 border-b-4 border-transparent border-r-gray-800"></div>
        </div>
      </button>

      {/* AI Chat Interface */}
      {isChatOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 md:w-96 h-96 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Lee Public Support</h3>
                <p className="text-white/80 text-sm">AI Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-300 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/255623996016?text=Hello%20IAMLEE%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-mobile group"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
        </svg>
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-l-gray-800"></div>
        </div>
      </a>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-mobile" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl max-h-full flex items-center justify-center">
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg touch-target"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-gray-300 text-2xl md:text-3xl font-bold touch-target p-2"
              aria-label="Close enlarged view"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
