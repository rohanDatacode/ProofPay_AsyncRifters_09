import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(50, window.innerWidth / 20);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 overflow-hidden">
      {/* Government Seal Watermark - Enhanced */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border-4 border-white/40 rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-[550px] h-[550px] border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl font-bold mb-8 text-white/50 tracking-wider">भारत</div>
                <div className="text-4xl font-semibold text-white/40 mb-4">GOVERNMENT OF INDIA</div>
                <div className="text-2xl text-white/35 mb-4">Digital India Initiative</div>
                <div className="mt-6 w-40 h-2 bg-gradient-to-r from-orange-400/30 to-green-400/30 mx-auto rounded-full"></div>
                <div className="text-xl text-white/35 mt-6 font-semibold">सत्यमेव जयते</div>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="w-8 h-8 bg-orange-400/30 rounded-full"></div>
                  <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                  <div className="w-8 h-8 bg-green-400/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ParticleBackground />

      {/* Announcement Marquee */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-600/90 to-orange-600/90 backdrop-blur-md border-b border-amber-500/30 py-2 z-20"
      >
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [1200, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap text-white font-medium"
          >
            🚨 New: Inter-Caste Marriage Support Scheme launched with ₹75,000 benefit • 
            📢 CCTNS integration now mandatory for all PCR applications • 
            ✅ DigiLocker integration available for instant document verification • 
            🔒 All transactions secured with blockchain technology • 
            📱 Mobile app launching soon for easier access
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-amber-400 bg-clip-text text-transparent">
                ProofPay
              </span>
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-4xl text-slate-200 mb-8 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Digital Benefit Transfer Portal
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Secure, transparent, and efficient direct benefit transfers powered by blockchain technology, 
              AI-driven verification systems, and seamless integration with government databases.
            </motion.p>
          </motion.div>

          {/* Enhanced Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            {[
              { icon: '🛡️', title: 'Police Complaint Report', desc: 'Up to ₹1,00,000' },
              { icon: '⚖️', title: 'Protection of Assets', desc: 'Up to ₹1,50,000' },
              { icon: '💕', title: 'Inter-Caste Marriage', desc: 'Up to ₹75,000' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-amber-400 font-bold text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Start New Application
            </motion.button>
            <motion.button
              className="px-10 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl font-semibold border border-slate-600 backdrop-blur-md transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              📊 Track Application Status
            </motion.button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: 'Benefits Distributed', value: '₹2.5K Cr', icon: '💰' },
              { label: 'Active Beneficiaries', value: '1.2M+', icon: '👥' },
              { label: 'Success Rate', value: '99.8%', icon: '✅' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-300 text-base font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4 text-sm text-slate-300">
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>🔒 All data encrypted & blockchain verified</span>
          </span>
          <span className="hidden md:block">•</span>
          <span className="hidden md:block">⛓️ Immutable audit log ensures no tampering</span>
          <span className="hidden md:block">•</span>
          <span className="hidden md:block">♿ WCAG 2.1 AA Compliant</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;