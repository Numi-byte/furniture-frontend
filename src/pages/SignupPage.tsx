/*  src/pages/SignupPage.tsx  */

import { useState, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

/* ---- palette ---- */
const ACCENT = '#0071e3';
const ERR    = '#d93025';

/* ---------- split layout ---------- */
const Split = styled.div`
  display: flex; min-height: 100vh;
  @media(max-width: 768px){ flex-direction: column; }
`;

/* left panel */
const Left = styled.div`
  flex: 1; position: relative; overflow:hidden;
  background: url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80')
              center/cover no-repeat;
  @media(max-width:768px){ height: 40vh; }
  &:before{
    content:''; position:absolute; inset:0;
    background:rgba(0,0,0,.35);
  }
`;
const Caption = styled.div`
  position:absolute; bottom:3rem; left:3rem; z-index:1; color:#fff;
  max-width: 340px; line-height:1.5;
  h2{font-size:2rem;font-weight:700;margin-bottom:.6rem;}
  p{font-size:1rem;opacity:.9;}
  @media(max-width:768px){ bottom:2rem; left:1.6rem; }
`;

/* right panel (form) */
const Right = styled.div`
  flex: 1; display:flex; align-items:center; justify-content:center;
  background:#f5f5f7; padding:3rem 1rem;
`;

/* ---------- form card ---------- */
const Card = styled(motion.div)`
  width:420px;max-width:100%;background:#fff;border-radius:22px;
  padding:3rem 2.4rem 2.8rem;box-shadow:0 16px 40px rgba(0,0,0,.08);
`;
const H1 = styled.h1`font-size:1.9rem;font-weight:700;text-align:center;margin-bottom:1.8rem;color:#111;`;

const Field = styled.div`margin-bottom:1.4rem;`;
const Input = styled.input<{error?:boolean}>`
  width:100%;padding:1rem;font-size:.95rem;border-radius:14px;
  background:#fafafa;border:1px solid ${p=>p.error?ERR:'#d0d0d0'};
  &:focus{outline:none;border-color:${ACCENT};background:#fff;}
`;
const Btn = styled.button<{disabled?:boolean}>`
  width:100%;padding:1.05rem;border:none;border-radius:18px;margin-top:.8rem;
  font-size:1rem;font-weight:600;color:#fff;
  background:${p=>p.disabled?'#a6a6a6':ACCENT};
  cursor:${p=>p.disabled?'default':'pointer'};
  display:flex;justify-content:center;align-items:center;gap:.6rem;
`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const Spinner = styled.div`
  width:20px;height:20px;border:3px solid #fff;border-top-color:transparent;
  border-radius:50%;animation:${spin} .9s linear infinite;
`;
const ErrorMsg = styled.p`color:${ERR};font-size:.9rem;margin-bottom:1rem;`;

/* ---------- lazy overlay spinner ---------- */
const LazyOverlay = lazy(() => Promise.resolve({
  default(){
    const oSpin = keyframes`to{transform:rotate(360deg)}`;
    const Overlay=styled.div`
      position:fixed;inset:0;background:rgba(255,255,255,.65);
      backdrop-filter:blur(6px);display:grid;place-items:center;z-index:5000;
    `;
    const Loader=styled.div`
      width:72px;height:72px;border:6px solid ${ACCENT};
      border-top-color:transparent;border-radius:50%;
      animation:${oSpin} 1s linear infinite;
    `;
    return(<Overlay><Loader/></Overlay>);
  }
}));

/* ===================================== */
export default function SignupPage(){
  const { login } = useAuth();
  const nav       = useNavigate();

  const [form,set]    = useState({name:'',email:'',pass:''});
  const [busy,setBusy]= useState(false);
  const [err,setErr]  = useState<string|null>(null);

  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwdOK   = form.pass.length>=8;
  const ready   = form.name && emailOK && pwdOK && !busy;

  const h=(e:React.ChangeEvent<HTMLInputElement>)=>{
    set({...form,[e.target.name]:e.target.value});
    setErr(null);
  };

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); if(!ready) return; setBusy(true);
    try{
      const res = await fetch('http://localhost:3000/auth/signup',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:form.name,email:form.email,password:form.pass})
      });
      if(!res.ok){
        const msg=(await res.json())?.message??'Signup failed';
        throw new Error(msg);
      }
      const who = await login(form.email,form.pass);
      toast.success('Welcome!');
      nav(who.role==='admin'?'/admin':'/account');
    }catch(e:any){
      setErr(e.message);toast.error(e.message);setBusy(false);
    }
  };

  /* ------------ JSX ------------ */
  return(
    <>
      <Split>
        {/* left side */}
        <Left>
          <Caption>
            <h2>Grande&nbsp;&amp;&nbsp;Co.</h2>
            <p>Hand‑finished furniture crafted in Italy.<br/>
               Join us &amp; enjoy member‑only previews.</p>
          </Caption>
        </Left>

        {/* right side */}
        <Right>
          <Card
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:.5}}
          >
            <H1>Create&nbsp;Account</H1>

            {err && <ErrorMsg aria-live="polite">{err}</ErrorMsg>}

            <form onSubmit={submit} noValidate>
              <Field><Input name="name"  placeholder="Full name"
                            value={form.name}  onChange={h} disabled={busy}/></Field>
              <Field><Input name="email" type="email" placeholder="Email address"
                            value={form.email} onChange={h} disabled={busy}
                            error={!!form.email && !emailOK}/></Field>
              <Field><Input name="pass"  type="password" placeholder="Password (min 8 chars)"
                            value={form.pass} onChange={h} disabled={busy}
                            error={!!form.pass && !pwdOK}/></Field>

              <Btn type="submit" disabled={!ready}>
                {busy && <Spinner/>}
                {busy ? 'Creating…' : 'Sign Up'}
              </Btn>
            </form>

            <p style={{marginTop:'1.6rem',fontSize:'.9rem',textAlign:'center'}}>
              Already have an account?{' '}
              <Link to="/login" style={{color:ACCENT,fontWeight:500}}>
                Sign&nbsp;in
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
