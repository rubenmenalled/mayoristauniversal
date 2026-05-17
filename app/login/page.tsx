'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre } },
      })
      if (error) {
        setError(error.message === 'User already registered' ? 'Este email ya está registrado.' : error.message)
      } else {
        setSuccess('¡Cuenta creada! Revisá tu email para confirmar el registro.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email o contraseña incorrectos.')
      } else {
        router.push('/mi-cuenta')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={28} color="#030D1E" />
            </div>
            <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, letterSpacing: '0.08em' }}>MAYORISTA UNIVERSAL</div>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: 20, padding: '32px 28px',
        }}>

          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 28, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4 }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 800, fontSize: 14, transition: 'all 0.2s',
                  background: mode === m ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'transparent',
                  color: mode === m ? '#030D1E' : '#9ca3af',
                }}>
                {m === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre" required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)',
                    color: '#fff', fontSize: 15, boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                EMAIL
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)',
                  color: '#fff', fontSize: 15, boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24, position: 'relative' }}>
              <label style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                CONTRASEÑA
              </label>
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" required minLength={6}
                style={{
                  width: '100%', padding: '12px 48px 12px 16px', borderRadius: 10, outline: 'none',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)',
                  color: '#fff', fontSize: 15, boxSizing: 'border-box',
                }}
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#86efac', fontSize: 13 }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#030D1E',
                fontWeight: 900, fontSize: 15, letterSpacing: '0.05em',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Cargando...' : mode === 'login' ? 'INGRESAR' : 'CREAR CUENTA'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#4b5563', fontSize: 13 }}>
          <a href="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver al inicio</a>
        </p>
      </div>
    </div>
  )
}
