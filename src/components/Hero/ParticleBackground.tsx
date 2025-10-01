import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, TrendingUp, Award, Globe, Zap, CheckCircle, Star } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
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

    // Initialize particles with different colors
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(80, window.innerWidth / 15);
      const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
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

        // Draw particle with glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        ctx.shadowBlur = 0;
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
      style={{ zIndex: 1 }}
    />
  );
};

const FloatingElements = () => {
  const elements = [
    { icon: Shield, color: 'text-blue-400', delay: 0 },
    { icon: Users, color: 'text-green-400', delay: 0.5 },
    { icon: Award, color: 'text-yellow-400', delay: 1 },
    { icon: Globe, color: 'text-purple-400', delay: 1.5 },
    { icon: Zap, color: 'text-red-400', delay: 2 },
    { icon: CheckCircle, color: 'text-emerald-400', delay: 2.5 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {elements.map((Element, index) => (
        <motion.div
          key={index}
          className={`absolute ${Element.color}`}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 8,
            delay: Element.delay,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Element.icon className="w-8 h-8" />
        </motion.div>
      ))}
    </div>
  );
};

const InteractiveStats = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  
  const stats = [
    { 
      label: 'Benefits Distributed', 
      value: '₹2.5K Cr', 
      icon: '💰',
      description: 'Total amount disbursed to beneficiaries',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Active Beneficiaries', 
      value: '1.2M+', 
      icon: '👥',
      description: 'Citizens actively using the platform',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Success Rate', 
      value: '99.8%', 
      icon: '✅',
      description: 'Applications processed successfully',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredStat(index)}
          onMouseLeave={() => setHoveredStat(null)}
          whileHover={{ scale: 1.05, y: -10 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.2 }}
        >
          <div className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl shadow-2xl`}>
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-8 h-full">
              <div className="text-center">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-300 text-base font-medium mb-3">{stat.label}</div>
                
                <AnimatePresence>
                  {hoveredStat === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-slate-400 text-sm"
                    >
                      {stat.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Hero = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { title: 'AI-Powered Verification', desc: 'Advanced fraud detection', icon: '🤖' },
    { title: 'Blockchain Security', desc: 'Immutable transaction records', icon: '⛓️' },
    { title: 'Real-time Processing', desc: 'Instant application updates', icon: '⚡' },
    { title: 'CCTNS Integration', desc: 'Police database verification', icon: '🛡️' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Enhanced Government Seal Background */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 0 }}>
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[800px] h-[800px] border-8 border-white/20 rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-[750px] h-[750px] border-4 border-white/15 rounded-full flex items-center justify-center">
              <div className="w-[700px] h-[700px] border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="text-[120px] font-bold mb-8 text-white/30 tracking-wider"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    भारत
                  </motion.div>
                  <div className="text-5xl font-semibold text-white/25 mb-6">GOVERNMENT OF INDIA</div>
                  <div className="text-3xl text-white/20 mb-6">Digital India Initiative</div>
                  <motion.div 
                    className="mt-8 w-60 h-3 bg-gradient-to-r from-orange-400/40 to-green-400/40 mx-auto rounded-full"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="text-2xl text-white/25 mt-8 font-semibold">सत्यमेव जयते</div>
                  <div className="mt-6 flex justify-center space-x-6">
                    {['orange', 'white', 'green'].map((color, i) => (
                      <motion.div
                        key={color}
                        className={`w-12 h-12 bg-${color === 'white' ? 'white' : color + '-400'}/40 rounded-full`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ParticleBackground />
      <FloatingElements />

      {/* Announcement Marquee */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-600/95 to-orange-600/95 backdrop-blur-md border-b border-amber-500/30 py-3 z-20"
      >
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [1400, -1400] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap text-white font-medium text-lg"
          >
            🚨 New: Inter-Caste Marriage Support Scheme launched with ₹75,000 benefit • 
            📢 CCTNS integration now mandatory for all PCR applications • 
            ✅ DigiLocker integration available for instant document verification • 
            🔒 All transactions secured with blockchain technology • 
            📱 Mobile app launching soon for easier access • 
            🎯 99.8% success rate in benefit disbursement • 
            ⚡ Real-time AI verification now available
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
            className="mb-12"
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-bold text-white mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-amber-400 bg-clip-text text-transparent">
                ProofPay
              </span>
            </motion.h1>
            <motion.h2 
              className="text-4xl md:text-5xl text-slate-200 mb-8 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Digital Benefit Transfer Portal
            </motion.h2>
            <motion.p 
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Secure, transparent, and efficient direct benefit transfers powered by blockchain technology, 
              AI-driven verification systems, and seamless integration with government databases.
            </motion.p>

            {/* Rotating Feature Highlight */}
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto mb-8 border border-white/20"
            >
              <div className="text-4xl mb-2">{features[currentFeature].icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{features[currentFeature].title}</h3>
              <p className="text-slate-300">{features[currentFeature].desc}</p>
            </motion.div>
          </motion.div>

          {/* Enhanced Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
          >
            {[
              { 
                icon: '🛡️', 
                title: 'Police Complaint Report', 
                desc: 'Up to ₹1,00,000',
                color: 'from-red-500/20 to-orange-500/20',
                border: 'border-red-500/30'
              },
              { 
                icon: '⚖️', 
                title: 'Protection of Assets', 
                desc: 'Up to ₹1,50,000',
                color: 'from-blue-500/20 to-purple-500/20',
                border: 'border-blue-500/30'
              },
              { 
                icon: '💕', 
                title: 'Inter-Caste Marriage', 
                desc: 'Up to ₹75,000',
                color: 'from-pink-500/20 to-rose-500/20',
                border: 'border-pink-500/30'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-md rounded-2xl p-6 border ${item.border} hover:scale-105 transition-all duration-300 cursor-pointer group`}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-amber-400 font-bold text-xl">{item.desc}</p>
                <div className="mt-4 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              className="group px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>🚀</span>
                <span>Start New Application</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
            <motion.button
              className="group px-12 py-5 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-2xl font-semibold border-2 border-slate-600 hover:border-slate-500 backdrop-blur-md transition-all duration-300 text-xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-3">
                <span>📊</span>
                <span>Track Application Status</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Interactive Statistics */}
          <InteractiveStats />
        </div>
      </div>

      {/* Enhanced Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-4 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <motion.div 
              className="flex items-center justify-center space-x-3 text-slate-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">🔒 Bank-level encryption & blockchain verified</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center space-x-3 text-slate-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm">⛓️ Immutable audit log ensures transparency</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center space-x-3 text-slate-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm">♿ WCAG 2.1 AA Compliant & Accessible</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;