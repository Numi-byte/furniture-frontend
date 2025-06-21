/*  src/pages/OrderConfirmationPage.tsx  */

import {
  useState, useEffect, Suspense, lazy,
} from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

/* lazy‑load confetti only when page mounts */
const Confetti = lazy(() => import('react-confetti'));

/* ------------ styled layout ------------ */
const Wrapper = styled.section`
  min-height: 88vh;
  display: grid; place-items: center;
  background: #f5f5f7;
  padding: 2rem 1rem;
`;
const Card = styled(motion.div)`
  background: #fff;
  border-radius: 22px;
  max-width: 520px;
  width: 100%;
  padding: 3rem 2.4rem 2.7rem;
  box-shadow: 0 16px 40px rgba(0,0,0,.08);
  text-align: center;
`;
const BigTick = styled.div`
  width: 72px; height: 72px;
  margin: 0 auto 1.8rem;
  border-radius: 50%;
  background: #0071e3;
  display: grid; place-items: center;
  svg{stroke:#fff;stroke-width:4; width:34px;height:34px;}
`;
/* download btn */
const Btn = styled.button<{disabled?:boolean}>`
  margin-top: 1.6rem;
  padding: .9rem 2rem;
  border: none; border-radius: 18px;
  font-weight: 600; font-size: 1rem;
  background:${p=>p.disabled ? '#bbb' : '#0071e3'};
  color:#fff; cursor:${p=>p.disabled?'default':'pointer'};
  display: inline-flex; gap:.6rem; align-items:center;
`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const Spinner = styled.div`
  width:18px;height:18px;border:2px solid #fff;border-top-color:transparent;
  border-radius:50%;animation:${spin} .9s linear infinite;
`;

/* ------------ component ------------ */
export default function OrderConfirmationPage() {
  const { id }   = useParams();
  const { state } = useLocation() as { state?: { invoiceUrl?: string } };

  /* confetti dims */
  const [dims,setDims] = useState({w:0,h:0});
  useEffect(()=>{
    setDims({ w: window.innerWidth, h: window.innerHeight });
  },[]);

  /* download one‑shot */
  const [downloading,setDown] = useState(false);
  const handleDownload = ()=>{
    if(!state?.invoiceUrl || downloading) return;
    setDown(true);
    /* open PDF in new tab */
    window.open(state.invoiceUrl,'_blank','noreferrer');
    /* re‑enable after 3 s in case user needs re‑try */
    setTimeout(()=>setDown(false),3000);
  };

  return (
    <Wrapper>
      {/* confetti */}
      <Suspense fallback={<></>}>
        <Confetti width={dims.w} height={dims.h} numberOfPieces={250} recycle={false}/>
      </Suspense>

      {/* card */}
      <Card
        initial={{ opacity: 0, scale:.9 }}
        animate={{ opacity: 1, scale:1 }}
        transition={{ duration: .5, ease: [.2,.8,.4,1] }}
      >
        <BigTick>
          <svg viewBox="0 0 24 24" fill="none">
            <polyline points="4 13 9 18 20 6"/>
          </svg>
        </BigTick>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '.4rem' }}>Thank you!</h1>
        <p style={{ color:'#555', fontSize:'1.05rem' }}>
          Your order&nbsp;<strong>#{id}</strong>&nbsp;has been received.
        </p>

        {state?.invoiceUrl && (
          <Btn onClick={handleDownload} disabled={downloading}>
            {downloading && <Spinner/>}
            {downloading ? 'Preparing…' : 'Download invoice'}
          </Btn>
        )}

        <p style={{ marginTop:'2.2rem' }}>
          <Link to="/products" style={{ color:'#0071e3', fontWeight:500 }}>
            Continue shopping&nbsp;›
          </Link>
        </p>
      </Card>
    </Wrapper>
  );
}
