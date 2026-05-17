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
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [documento, setDocumento] = useState('')
  const [transporte, setTransporte] = useState('')
  const [reemplazo, setReemplazo] = useState<'si' | 'no' | ''>('')
  const [whatsapp, setWhatsapp] = useState('')
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
        options: {
          data: {
            nombre,
            documento,
            transporte,
            reemplazo,
            whatsapp,
          },
        },
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)',
    color: '#fff', fontSize: 15, boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    color: '#9ca3af', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)',
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
              <>
                {/* Nombre */}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>NOMBRE COMPLETO *</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                    placeholder="Tu nombre completo" required style={inputStyle} />
                </div>

                {/* Documento */}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>NÚMERO DE DOCUMENTO (DNI/CUIT) *</label>
                  <input type="text" value={documento} onChange={e => setDocumento(e.target.value)}
                    placeholder="Ej: 30123456 o 20-30123456-8" required
                    style={inputStyle} />
                </div>

                {/* WhatsApp */}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>WHATSAPP *</label>
                  <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                    placeholder="Ej: 1164660482" required
                    style={inputStyle} />
                </div>

                {/* Transporte */}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>TRANSPORTE PREFERIDO *</label>
                  <select value={transporte} onChange={e => setTransporte(e.target.value)} required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#071633' }}>Seleccioná una opción</option>
                    {TRANSPORTES.map(t => (
                      <option key={t} value={t} style={{ background: '#071633' }}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Reemplazo */}
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
                          color: reemplazo === op.val ? '#D4AF37' : '#9ca3af',
                        }}>
                        {op.label}
                      </button>
                    ))}
                  </div>
                  {/* Hidden input for validation */}
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

            {/* Contraseña */}
            <div style={{ marginBottom: 24, position: 'relative' }}>
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
