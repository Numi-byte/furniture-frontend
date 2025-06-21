/*  src/pages/ForgotPage.tsx  */

import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

/* ---------- palette ---------- */
const ACCENT = '#0071e3';
const ERR    = '#d93025';

/* ---------- split layout ---------- */
const Split = styled.div`
  display: flex; min-height: 100vh;
  @media(max-width:768px){ flex-direction:column; }
`;
/* hero */
const Left = styled.div`
  flex:1; background:url('https://images.unsplash.com/photo-1531913764164-7f0da3c2a7e1?auto=format&fit=crop&w=1600&q=80')
            center/cover; position:relative; overflow:hidden;
  @media(max-width:768px){ height:40vh; }
  &:before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.35);}
`;
const Caption = styled.div`
  position:absolute; bottom:3rem; left:3rem; z-index:1; color:#fff;
  max-width:320px;line-height:1.5;
  h2{font-size:2rem;font-weight:700;margin-bottom:.6rem}
  p{opacity:.9}
  @media(max-width:768px){ bottom:2rem; left:1.6rem; }
`;
/* form side */
const Right = styled.div`
  flex:1; display:flex;align-items:center;justify-content:center;
  background:#f5f5f7;padding:3rem 1rem;
`;

/* ---------- card ---------- */
const Card = styled(motion.div)`
  width:380px;max-width:100%;background:#fff;border-radius:22px;
  padding:3rem 2.4rem 2.8rem;box-shadow:0 16px 40px rgba(0,0,0,.08);
`;
const H1 = styled.h1`
  font-size:1.8rem;font-weight:700;text-align:center;margin-bottom:1.6rem;color:#111;
`;

/* ---------- form ---------- */
const Field = styled.div`margin-bottom:1.4rem;`;
const Input = styled.input<{error?:boolean}>`
  width:100%;padding:1rem;font-size:.95rem;border-radius:14px;
  background:#fafafa;border:1px solid ${p=>p.error?ERR:'#d0d0d0'};
  &:focus{outline:none;border-color:${ACCENT};background:#fff;}
`;
const Btn = styled.button<{disabled?:boolean}>`
  width:100%;padding:1.05rem;border:none;border-radius:18px;margin-top:.3rem;
  font-weight:600;font-size:1rem;color:#fff;
  background:${p=>p.disabled?'#a6a6a6':ACCENT};
  cursor:${p=>p.disabled?'default':'pointer'};
  display:flex;justify-content:center;align-items:center;gap:.6rem;
`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const Spinner = styled.div`
  width:20px;height:20px;border:3px solid #fff;border-top-color:transparent;
  border-radius:50%;animation:${spin} .9s linear infinite;
`;
const Notice = styled.div`
  padding:.9rem 1rem;border-radius:12px;
  background:#e5f2ff;color:#084d8c;font-size:.9rem;
  text-align:center;margin-bottom:1.2rem;
`;
const ErrorMsg = styled.p`color:${ERR};font-size:.9rem;margin-bottom:1rem;text-align:center;`;

/* ---------- lazy overlay spinner ---------- */
const LazyOverlay = lazy(() => {
  const oSpin = keyframes`to{transform:rotate(360deg)}`;
  const Overlay = styled.div`
    position:fixed;inset:0;background:rgba(255,255,255,.65);
    backdrop-filter:blur(6px);display:grid;place-items:center;z-index:5000;
  `;
  const Loader = styled.div`
    width:72px;height:72px;border:6px solid ${ACCENT};
    border-top-color:transparent;border-radius:50%;
    animation:${oSpin} 1s linear infinite;
  `;
  const OverlayComponent = () => <Overlay><Loader/></Overlay>;
  return Promise.resolve({ default: OverlayComponent });
});

/* ========================================== */
export default function ForgotPage() {
  const [email, setEmail]   = useState('');
  const [busy,  setBusy]    = useState(false);
  const [msg,   setMsg]     = useState<string|null>(null);
  const [err,   setErr]     = useState<string|null>(null);

  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready   = emailOK && !busy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true); setErr(null); setMsg(null);
    try {
      const res = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error((await res.json())?.message ?? 'Request failed');
      setMsg('Check your e‑mail for the reset link!');
      toast.success('Reset link sent');
      setEmail('');
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
      toast.error(e.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Split>
        {/* hero */}
        <Left>
          <Caption>
            <h2>Trouble signing in?</h2>
            <p>Enter the e‑mail associated with your account &ndash;
               we&rsquo;ll send a secure reset link.</p>
          </Caption>
        </Left>

        {/* form */}
        <Right>
          <Card
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:.5}}
          >
            <H1>Password Reset</H1>

            {msg && <Notice aria-live="polite">{msg}</Notice>}
            {err && <ErrorMsg aria-live="polite">{err}</ErrorMsg>}

            <form onSubmit={handleSubmit} noValidate>
              <Field>
                <Input
                  type="email" placeholder="Email address"
                  value={email} onChange={e=>setEmail(e.target.value)}
                  error={!!email && !emailOK} disabled={busy}
                />
              </Field>
              <Btn type="submit" disabled={!ready}>
                {busy && <Spinner/>}
                {busy ? 'Sending…' : 'Send reset link'}
              </Btn>
            </form>

            <p style={{marginTop:'1.6rem',fontSize:'.9rem',textAlign:'center'}}>
              <Link to="/login" style={{color:ACCENT,fontWeight:500}}>
                Back to login
              </Link>
            </p>
          </Card>
        </Right>
      </Split>

      {/* overlay spinner */}
      <Suspense fallback={<></>}>{busy && <LazyOverlay/>}</Suspense>
    </>
  );
}
