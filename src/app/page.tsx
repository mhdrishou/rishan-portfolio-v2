'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './app.module.css'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ScaleIn({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function RotatingWords() {
  const words = ['AI Solutions', 'Vibe Coding', 'Creative Apps', 'Smart Tools']
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className={styles.rotatingPanel}>
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, rotateX: -90, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, rotateX: 90, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.4 }}
          className={styles.rotatingWord}
        >
          {words[current]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function MagneticButton({ children, className, href }: { children: React.ReactNode, className?: string, href: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }
  
  const reset = () => setPosition({ x: 0, y: 0 })
  
  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.a>
  )
}

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill all fields')
      return
    }
    
    setFormStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setFormStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.container}>
      {/* Animated Wave Background */}
      <div className={styles.waveBg}>
        <div className={styles.wave1} />
        <div className={styles.wave2} />
        <div className={styles.wave3} />
        <div className={styles.wave4} />
        <div className={styles.particles}>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className={styles.navbar}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.navContent}>
          <motion.a 
            href="#hero" 
            className={styles.logo}
            whileHover={{ scale: 1.1, textShadow: '0 0 30px rgba(77,166,255,0.8)' }}
          >RISHA N</motion.a>
          <div className={styles.navLinks}>
            {['About', 'Skills', 'Services', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.1, color: '#4da6ff' }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <FadeIn>
          <motion.span 
            className={styles.heroTag}
            animate={{ 
              boxShadow: ['0 0 20px rgba(77,166,255,0.3)', '0 0 40px rgba(77,166,255,0.6)', '0 0 20px rgba(77,166,255,0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Web Developer & Designer
          </motion.span>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h1 className={styles.heroTitle}>
            Crafting Digital<br />
            <span className={styles.connector}>with </span>
            <div className={styles.heroWrapper}>
              <motion.span 
                className={styles.keyword}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Experiences
              </motion.span>
              <RotatingWords />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              That Inspire
            </motion.span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            I blend cutting-edge web development with intuitive UI/UX design, 
            AI integration, and vibe coding to create stunning digital products.
          </motion.p>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <div className={styles.heroButtons}>
            <MagneticButton href="#contact" className={styles.btnPrimary}>
              Get In Touch
            </MagneticButton>
            <MagneticButton href="#services" className={styles.btnSecondary}>
              View Services
            </MagneticButton>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.4}>
          <motion.div 
            className={styles.heroCards}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: '&#x1F3A8;', title: 'UI/UX Design', desc: 'Beautiful interfaces' },
              { icon: '&#x1F916;', title: 'AI Integration', desc: 'Smart automation' },
              { icon: '&#x26A1;', title: 'Vibe Coding', desc: 'Modern development' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={styles.heroCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -10,
                  transition: { type: 'spring', stiffness: 400 }
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </FadeIn>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <FadeIn>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>
          <p className={styles.sectionSubtitle}>Creating exceptional digital experiences</p>
        </FadeIn>
        
        <div className={styles.aboutGrid}>
          <ScaleIn>
            <motion.div 
              className={styles.aboutImage}
              whileHover={{ rotate: [0, 2, -2, 0], transition: { duration: 0.5 } }}
            >
              <motion.div 
                className={styles.imagePlaceholder}
                animate={{ 
                  boxShadow: ['0 20px 60px rgba(26,111,255,0.3)', '0 30px 80px rgba(77,166,255,0.5)', '0 20px 60px rgba(26,111,255,0.3)'] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4da6ff"/>
                      <stop offset="100%" stopColor="#0040ff"/>
                    </linearGradient>
                  </defs>
                  <circle cx="70" cy="70" r="60" fill="url(#avatarGrad)"/>
                  <circle cx="70" cy="70" r="40" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="8 4"/>
                  <circle cx="70" cy="70" r="22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                  <circle cx="70" cy="55" r="5" fill="white" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <path d="M55 85 Q70 100 85 85" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
                </svg>
              </motion.div>
            </motion.div>
          </ScaleIn>
          
          <FadeIn delay={0.2}>
            <div className={styles.aboutContent}>
              <motion.h3
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Rishan
              </motion.h3>
              <p className={styles.aboutRole}>Full-Stack Developer & Designer</p>
              <p className={styles.aboutDesc}>
                Passionate developer specializing in creating stunning digital experiences.
                Expertise in web development, UI/UX design, AI integration, and vibe coding.
              </p>
              <motion.div 
                className={styles.stats}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {[
                  { num: '5+', label: 'Years Exp' },
                  { num: '50+', label: 'Projects' },
                  { num: '30+', label: 'Clients' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className={styles.statBox}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className={styles.statNum}>{stat.num}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={styles.section}>
        <FadeIn>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <p className={styles.sectionSubtitle}>Technologies I use</p>
        </FadeIn>
        
        <div className={styles.skillsGrid}>
          {[
            { icon: '&#x1F3AF;', title: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
            { icon: '&#x2699;', title: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST API'] },
            { icon: '&#x2728;', title: 'Design', skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Sys'] },
            { icon: '&#x1F9E0;', title: 'AI & ML', skills: ['OpenAI', 'LangChain', 'NLP', 'Automation'] },
          ].map((item, i) => (
            <ScaleIn key={i}>
              <motion.div 
                className={styles.skillCard}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: [0, 5, -5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <span className={styles.skillIcon} dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3>{item.title}</h3>
                <ul>{item.skills.map((s, j) => <li key={j}>{s}</li>)}</ul>
              </motion.div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <FadeIn>
          <h2 className={styles.sectionTitle}>Services</h2>
          <p className={styles.sectionSubtitle}>Solutions for your needs</p>
        </FadeIn>
        
        <div className={styles.servicesGrid}>
          {[
            { icon: '&#x1F4BB;', title: 'Web Development', desc: 'Custom websites and apps built with modern tech.', features: ['Web Apps', 'E-commerce', 'CMS', 'API'] },
            { icon: '&#x1F3A8;', title: 'UI/UX Design', desc: 'Beautiful interfaces that users love.', features: ['Research', 'Wireframes', 'Prototyping', 'Systems'] },
            { icon: '&#x1F916;', title: 'AI Integration', desc: 'Smart AI solutions for automation.', features: ['Chatbots', 'NLP', 'Automation', 'ML'] },
            { icon: '&#x1F3B5;', title: 'Vibe Coding', desc: 'Creative and expressive development.', features: ['Creative Dev', 'Animation', 'Interactive', 'Experimental'] },
          ].map((item, i) => (
            <ScaleIn key={i}>
              <motion.div 
                className={styles.serviceCard}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 20px 60px rgba(77,166,255,0.3)',
                  transition: { type: 'spring', stiffness: 300 }
                }}
              >
                <span className={styles.serviceIcon} dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>{item.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
                <a href="#contact" className={styles.learnMore}>Learn More →</a>
              </motion.div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section}>
        <FadeIn>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionSubtitle}>Let&apos;s create something amazing</p>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <motion.input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.02, borderColor: '#4da6ff' }}
                />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.02, borderColor: '#4da6ff' }}
                />
              </div>
              <motion.input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className={styles.formInput}
                whileFocus={{ scale: 1.02, borderColor: '#4da6ff' }}
              />
              <motion.textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={styles.formTextarea}
                whileFocus={{ scale: 1.02, borderColor: '#4da6ff' }}
              />
              <motion.button 
                type="submit" 
                className={styles.submitBtn}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(26,111,255,0.7)' }}
                whileTap={{ scale: 0.98 }}
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? 'Sending...' : 
                 formStatus === 'success' ? 'Message Sent!' : 
                 formStatus === 'error' ? 'Try Again' : 
                 'Send Message'}
              </motion.button>
              {formStatus === 'success' && (
                <p className={styles.successMsg}>Thanks! I&apos;ll get back to you soon.</p>
              )}
            </form>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Rishan. All rights reserved.</p>
      </footer>
    </div>
  )
}