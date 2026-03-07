'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Shield,
  Calendar,
  Activity,
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Erreur lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900">
      {/* Header with EMSI branding */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img
                src="/navlogo.png"
                alt="EMSI Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-700/80 font-semibold">
                EMSI Academic Flow
              </p>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                Portail de Détection des Risques Académiques
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              <Activity className="h-3 w-3" />
              <span>IA active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-5xl mx-auto w-full px-4 py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
            {/* Left side: hero text */}
            <div className="space-y-6 text-slate-900">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 mb-2">
                <Shield className="h-3 w-3" />
                <span>Surveillance intelligente de la réussite étudiante</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  Connectez-vous au portail{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                    EMSI Academic Flow
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                  Accédez à votre tableau de bord pour suivre les risques académiques,
                  les absences, les notes et les recommandations intelligentes.
                  Les comptes sont fournis par l&apos;administration EMSI.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-blue-50 p-2 text-blue-700">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Horaires & présences</p>
                    <p className="text-slate-600">
                      Visualisez vos séances, absences et retards en temps réel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-emerald-50 p-2 text-emerald-700">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Niveau de risque</p>
                    <p className="text-slate-600">
                      Comprenez vos indicateurs de réussite académique.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-indigo-50 p-2 text-indigo-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Assistant IA</p>
                    <p className="text-slate-600">
                      Posez vos questions et recevez des réponses guidées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side: login card */}
            <Card className="backdrop-blur bg-white/90 border-slate-200 shadow-xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-slate-900">
                  Connexion au portail
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Entrez vos identifiants EMSI pour accéder au tableau de bord.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-900">
                      Email EMSI
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="prenom.nom@emsi.ma"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-9 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-900">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-9 pr-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <span>Se souvenir de moi sur cet appareil</span>
                    </label>
                    <span className="text-slate-500">
                      Mot de passe oublié ? Contactez l&apos;administration.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </span>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="leading-snug">
                    Aucun auto-inscription n&apos;est disponible. Les comptes sont
                    créés et gérés par l&apos;administration EMSI.
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 text-xs font-medium"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Retour à la page d&apos;accueil
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>EMSI © 2025 - Portail Intelligent de Gestion Académique</p>
          <div className="flex items-center gap-3">
            <span className="underline underline-offset-2 decoration-slate-300 cursor-default">
              Conditions d&apos;utilisation
            </span>
            <span className="underline underline-offset-2 decoration-slate-300 cursor-default">
              Politique de confidentialité
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
