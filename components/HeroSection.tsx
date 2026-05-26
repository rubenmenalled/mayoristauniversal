'use client'

export default function HeroSection() {

  return (
    <>
      <style>{`
        #hero-section {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        @keyframes hero-kenburns {
          0%   { transform: scale(1)    translateX(0)    translateY(0); }
          33%  { transform: scale(1.06) translateX(-1%)  translateY(-0.5%); }
          66%  { transform: scale(1.04) translateX(1%)   translateY(0.5%); }
          100% { transform: scale(1)    translateX(0)    translateY(0); }
        }
        @keyframes panda-mover {
          0%    { transform: translateX(88vw)  scaleX(-1); }
          44%   { transform: translateX(0vw)   scaleX(-1); }
          50%   { transform: translateX(0vw)   scaleX(1);  }
          94%   { transform: translateX(88vw)  scaleX(1);  }
          100%  { transform: translateX(88vw)  scaleX(-1); }
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 92px; }
          #hero-banner { height: 58vw; position: relative; }
          #hero-banner .kenburns-wrap { width: 100%; height: 100%; overflow: hidden; }
          #hero-banner .kenburns-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block; animation: hero-kenburns 18s ease-in-out infinite; transform-origin: center center; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 98px; }
          #hero-banner { width: 100%; position: relative; }
          #hero-banner .kenburns-wrap { overflow: hidden; width: 100%; }
          #hero-banner .kenburns-wrap img { width: 100%; height: auto; display: block; max-width: none; animation: hero-kenburns 18s ease-in-out infinite; transform-origin: center center; }
        }
        .envios-bar:hover { opacity: 0.92; transform: scale(1.01); }
        .envios-bar { transition: all 0.2s ease; cursor: pointer; }
        .transporte-card:hover { transform: translateY(-2px); background: rgba(212,175,55,0.12) !important; }
        .transporte-card { transition: all 0.18s ease; }

        /* Animación marco panda */
        @keyframes panda-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(212,175,55,0.35), 0 8px 32px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 6px rgba(212,175,55,0.55), 0 8px 40px rgba(0,0,0,0.7); }
        }
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow:
              0 0 4px #fff,
              0 0 10px #fff,
              0 0 20px #ff2020,
              0 0 40px #ff2020,
              0 0 70px #ff0000,
              0 0 90px #cc0000;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner">
          <div className="kenburns-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portada_desktop.png" alt="Mayorista Universal - Multirubros Mayoristas" />
          </div>

          {/* Cartel neon */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(30px, 8vw, 60px)',
            right: 'clamp(12px, 3vw, 36px)',
            zIndex: 20,
            pointerEvents: 'none',
            textAlign: 'right',
          }}>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(12px, 2vw, 26px)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#fff',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              animation: 'neon-flicker 4s infinite',
              textShadow: `
                0 0 4px #fff,
                0 0 10px #fff,
                0 0 20px #ff2020,
                0 0 40px #ff2020,
                0 0 70px #ff0000,
                0 0 90px #cc0000
              `,
            }}>
              ✦ IMPORTADOR DIRECTO<br />ESPECIAL REVENDEDORES
            </div>
          </div>

          {/* Panda — caminando de lado a lado */}
          <div style={{
            position: 'absolute',
            bottom: '4%',
            left: 0,
            zIndex: 10,
            pointerEvents: 'none',
            animation: 'panda-mover 28s linear infinite',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/panda-v2.gif"
              alt="Panda caminando"
              style={{
                height: 'clamp(80px, 11vw, 150px)',
                width: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
              }}
            />
          </div>
        </div>

      </section>

    </>
  )
}
