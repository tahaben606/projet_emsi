'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContainerScroll } from '@/components/ContainerScroll'
import {
  Zap,
  GraduationCap,
  Users,
  Globe,
  Award,
  Briefcase,
  ArrowRight,
  Menu,
  X as CloseIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const heroRef = useRef(null)
  const programsRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const campusRef = useRef(null)

  const scrollToSection = (ref, sectionId) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  const programs = [
    {
      title: 'Ingénierie Informatique & Réseaux',
      description: 'Développement digital, cybersécurité, intelligence artificielle',
      icon: '💻',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Génie Électrique & Systèmes Intelligents',
      description: 'Électrotechnique, systèmes automatisés, énergies renouvelables',
      icon: '⚡',
      color: 'from-yellow-600 to-yellow-400',
    },
    {
      title: 'Ingénierie Automatisme & Informatique Industrielle',
      description: 'Contrôle-commande, réseaux industriels, usine 4.0',
      icon: '🤖',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Génie Civil & Travaux Publics',
      description: 'Conception structurelle, gestion de chantiers, infrastructure durable',
      icon: '🏗️',
      color: 'from-orange-600 to-orange-400',
    },
    {
      title: 'Génie Industriel',
      description: 'Gestion de production, logistique, optimisation de processus',
      icon: '⚙️',
      color: 'from-green-600 to-green-400',
    },
    {
      title: 'Génie Financier',
      description: "Gestion des risques, finance de marché, stratégie d'investissement",
      icon: '💰',
      color: 'from-red-600 to-red-400',
    },
  ]

  const stats = [
    { number: '21,000+', label: 'Diplômés', icon: Users },
    { number: '19', label: 'Campus', icon: Globe },
    { number: '400+', label: 'Partenaires', icon: Briefcase },
    { number: "39+", label: "Années d'excellence", icon: Award },
  ]

  const features = [
    {
      title: "Formation d'Excellence",
      description: 'Une formation pratique enrichie préparant aux défis du monde réel',
      icon: GraduationCap,
    },
    {
      title: 'Réseaux & Partenariats',
      description: 'Accès à un réseau de +400 entreprises partenaires',
      icon: Users,
    },
    {
      title: 'Innovation & Recherche',
      description: "Laboratoires de recherche et centres d'innovation modernes",
      icon: Zap,
    },
    {
      title: 'Employabilité Garantie',
      description: '6 centres de carrière pour accompagner votre développement professionnel',
      icon: Briefcase,
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span
                className="font-bold text-xl text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                EMSI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8">
              <button
                onClick={() => scrollToSection(heroRef, 'hero')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === 'hero'
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection(programsRef, 'programs')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === 'programs'
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Formations
              </button>
              <button
                onClick={() => scrollToSection(featuresRef, 'features')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === 'features'
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection(statsRef, 'stats')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === 'stats'
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Chiffres clés
              </button>
              <button
                onClick={() => scrollToSection(campusRef, 'campus')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === 'campus'
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Campus
              </button>
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                Candidater
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 border-t border-gray-100"
            >
              <nav className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => scrollToSection(heroRef, 'hero')}
                  className="text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Accueil
                </button>
                <button
                  onClick={() => scrollToSection(programsRef, 'programs')}
                  className="text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Formations
                </button>
                <button
                  onClick={() => scrollToSection(featuresRef, 'features')}
                  className="text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  À propos
                </button>
                <button
                  onClick={() => scrollToSection(statsRef, 'stats')}
                  className="text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Chiffres clés
                </button>
                <button
                  onClick={() => scrollToSection(campusRef, 'campus')}
                  className="text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Campus
                </button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                  Candidater
                </Button>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-emerald-50/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Première École d'Ingénieurs Privée au Maroc
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                Accédez à une formation d'excellence en ingénierie, enrichie d'expériences concrètes
                et d'innovations technologiques pour façonner les leaders de demain.
              </p>
              <div className="flex gap-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Découvrir nos formations
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  En savoir plus
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663409392763/BMJPiPYEoAXks44yRxcvHR/hero-engineering-RqKqozAjZd38h734nxADLp.webp"
                alt="Engineering students"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROGRAMS WITH CONTAINERSCROLL */}
      <section ref={programsRef} className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-5xl md:text-6xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos Formations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Six programmes d'ingénierie conçus pour former les innovateurs de demain
            </p>
          </motion.div>

          <ContainerScroll
            titleComponent={
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h3
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Explorez nos <span className="text-emerald-600">programmes</span>
                </h3>
                <p className="text-lg text-gray-600">
                  Défilez pour découvrir la diversité de nos formations
                </p>
              </motion.div>
            }
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663409392763/BMJPiPYEoAXks44yRxcvHR/programs-showcase-FpZC5DYNhvzJvbY8Ky4vs5.webp"
              alt="Programs showcase"
              className="w-full h-full object-cover rounded-xl"
            />
          </ContainerScroll>

          {/* Programs Grid */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3
                className="text-4xl md:text-5xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Nos Six Programmes
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
                    <CardHeader>
                      <div className="text-4xl mb-4">{program.icon}</div>
                      <CardTitle
                        className="text-xl text-gray-900"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-base">
                        {program.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663409392763/BMJPiPYEoAXks44yRxcvHR/innovation-labs-fuEDzsuQebTSGFRzRG3Gtg.webp"
                alt="Innovation labs"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-5xl md:text-6xl font-bold mb-8 text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pourquoi Choisir EMSI ?
              </h2>
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100">
                          <Icon className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS */}
      <section
        ref={statsRef}
        className="py-20 bg-gradient-to-br from-emerald-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl md:text-6xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos Chiffres Clés
            </h2>
            <p className="text-xl text-gray-600">
              Une institution reconnue pour son excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                  <div
                    className="text-4xl font-bold text-emerald-600 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: CAMPUS */}
      <section ref={campusRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                19 Campus à Travers le Maroc
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Présente dans les principales villes du Maroc, EMSI offre une accessibilité
                maximale à ses formations d'excellence.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Trouver un campus
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663409392763/BMJPiPYEoAXks44yRxcvHR/campus-excellence-5LTzexScpWpT3edvSuk6Ed.webp"
                alt="Campus"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Prêt à Rejoindre EMSI ?
            </h2>
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Commencez votre parcours vers l'excellence en ingénierie dès aujourd'hui
            </p>
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              Candidater Maintenant
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span
                  className="font-bold text-white text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  EMSI
                </span>
              </div>
              <p className="text-sm">Première école d'ingénieurs privée au Maroc</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Formations</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Informatique
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Électrique
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Civil
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">À Propos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Notre Histoire
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Équipe
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:info@emsi.ma"
                    className="hover:text-emerald-400 transition"
                  >
                    info@emsi.ma
                  </a>
                </li>
                <li>
                  <a href="tel:+212" className="hover:text-emerald-400 transition">
                    +212 (0) XXX XXX XXX
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 EMSI School. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

