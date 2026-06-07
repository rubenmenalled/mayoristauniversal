'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, Eye, EyeOff } from 'lucide-react'

const TRANSPORTES = [
  'Retiro en depósito',
  'Andreani',
  'OCA',
  'Correo Argentino',
  'Labulle',
  'Bus de carga',
  'Flete propio',
  'Otro',
]

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [documento, setDocumento] = useState('')
  const [transporte, setTransporte] = useState('')
  const [reemplazo, setReemplazo] = useState<'si' | 'no' | ''>('')
  const [whatsapp, setWhatsapp] = useState('')
  const [direccion, setDireccion] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'forgot') {
      const res = await fetch('/api/auth/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'No se pudo enviar el correo. Verificá el email ingresado.')
      } else {
        setSuccess('✅ Te enviamos un link para restablecer tu contraseña. Revisá tu bandeja de entrada.')
      }
      setLoading(false)
      return
    }

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, documento, transporte, reemplazo, whatsapp, direccion }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Error al crear la cuenta.')
      } else {
        // Notificar al dueño
        fetch('/api/notificar-registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, documento, whatsapp, transporte, reemplazo }),
        }).catch(() => {})
        // Iniciar sesión automáticamente
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setSuccess('¡Cuenta creada! Ya podés ingresar con tu email y contraseña.')
          setMode('login')
        } else {
          router.push('/mi-cuenta')
        }
      }
      setLoading(false)
      return
    }

    // Login
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
    } else {
      router.push('/mi-cuenta')
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
    background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(92,10,10,0.2)',
    color: '#C01515', fontSize: 15, boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    color: '#C01515', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={28} color="#FFFFFF" />
            </div>
            <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, letterSpacing: '0.08em' }}>MAYORISTA UNIVERSAL</div>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(92,10,10,0.15)',
          borderRadius: 20, padding: '32px 28px',
        }}>

          {/* Tabs — solo cuando no es forgot */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', marginBottom: 28, background: 'rgba(92,10,10,0.08)', borderRadius: 12, padding: 4 }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                    fontWeight: 800, fontSize: 14, transition: 'all 0.2s',
                    background: mode === m ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'transparent',
                    color: mode === m ? '#FFFFFF' : '#C01515',
                  }}>
                  {m === 'login' ? 'Ingresar' : 'Registrarse'}
                </button>
              ))}
            </div>
          )}

          {/* Título modo forgot */}
          {mode === 'forgot' && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: '#C01515', fontWeight: 900, fontSize: 18, margin: 0 }}>Recuperar contraseña</h2>
              <p style={{ color: '#4b5563', fontSize: 13, marginTop: 6 }}>
                Ingresá tu email y te enviamos un link para crear una nueva contraseña.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {mode === 'register' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>NOMBRE COMPLETO *</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                    placeholder="Tu nombre completo" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>NÚMERO DE DOCUMENTO (DNI/CUIT) *</label>
                  <input type="text" value={documento} onChange={e => setDocumento(e.target.value)}
                    placeholder="Ej: 30123456 o 20-30123456-8" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>WHATSAPP *</label>
                  <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                    placeholder="Ej: 1164660482" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>DIRECCIÓN *</label>
                  <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)}
                    placeholder="Calle, número, ciudad, provincia" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>TRANSPORTE PREFERIDO *</label>
                  <select value={transporte} onChange={e => setTransporte(e.target.value)} required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#F0F0F0' }}>Seleccioná una opción</option>
                    {TRANSPORTES.map(t => (
                      <option key={t} value={t} style={{ background: '#F0F0F0' }}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>¿ACEPTÁS REEMPLAZO DE PRODUCTOS? *</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ val: 'si', label: '✅ Sí, acepto' }, { val: 'no', label: '❌ No acepto' }].map(op => (
                      <button key={op.val} type="button"
                        onClick={() => setReemplazo(op.val as 'si' | 'no')}
                        style={{
                          flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer',
                          fontWeight: 800, fontSize: 13, transition: 'all 0.2s', border: '2px solid',
                          borderColor: reemplazo === op.val ? '#D4AF37' : 'rgba(212,175,55,0.2)',
                          background: reemplazo === op.val ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                          color: reemplazo === op.val ? '#D4AF37' : '#C01515',
                        }}>
                        {op.label}
                      </button>
                    ))}
                  </div>
                  <input type="text" required value={reemplazo}
                    style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }}
                    tabIndex={-1} onChange={() => {}} />
                </div>
              </>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>EMAIL *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required style={inputStyle} />
            </div>

            {/* Contraseña — oculta en modo forgot */}
            {mode !== 'forgot' && (
              <div style={{ marginBottom: mode === 'login' ? 8 : 24, position: 'relative' }}>
                <label style={labelStyle}>CONTRASEÑA *</label>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" required minLength={6}
                  style={{ ...inputStyle, padding: '12px 48px 12px 16px' }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {/* Link olvidé contraseña — solo en modo login */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <button type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontSize: 12, fontWeight: 700, textDecoration: 'underline' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#16a34a', fontSize: 13 }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#C01515',
                fontWeight: 900, fontSize: 15, letterSpacing: '0.05em',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Cargando...' : mode === 'login' ? 'INGRESAR' : mode === 'register' ? 'CREAR CUENTA' : 'ENVIAR LINK'}
            </button>

            {/* Volver desde forgot */}
            {mode === 'forgot' && (
              <button type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                style={{ width: '100%', marginTop: 12, padding: '12px', borderRadius: 12, border: '1px solid rgba(92,10,10,0.2)', background: 'transparent', color: '#C01515', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                ← Volver al login
              </button>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#4b5563', fontSize: 13 }}>
          <a href="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver al inicio</a>
        </p>
      </div>
    </div>
  )
}
