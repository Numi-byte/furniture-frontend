/*  src/components/AdminLayout.tsx  */
import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import {
  FiPieChart, FiBox, FiList, FiLogOut, FiHome, FiMenu, FiX,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

/* ───────── styled shells ───────── */
const Shell = styled.div`display:flex;min-height:100vh;overflow:hidden;`;
const Main  = styled.main`
  flex:1;padding:3rem 2.5rem;max-width:100%; /* prevents scroll‑lock on drawer */
`;

/* ───────── sidebar / drawer ───────── */
const slide = keyframes`
  from { transform: translateX(-110%); } to { transform: translateX(0); }
`;
const Side = styled.aside<{open:boolean}>`
  width:260px;background:var(--surface);border-right:1px solid var(--gray-200);
  padding:2.4rem 1.4rem;display:flex;flex-direction:column;gap:2.2rem;
  position:sticky;top:0; /* normal desktop behaviour */

  /* — drawer on mobile — */
  @media (max-width:768px){
    position:fixed;inset:0 40% 0 0;max-width:260px;
    transform:${p=>p.open?'translateX(0)':'translateX(-110%)'};
    animation:${p=>p.open?slide:''} .35s cubic-bezier(.4,0,.2,1);
    z-index:2600;box-shadow:0 0 40px rgba(0,0,0,.25);
  }
`;
const Veil = styled.div`
  @media (max-width:768px){
    position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);
    z-index:2500;
  }
`;

/* ───────── nav content ───────── */
const Brand = styled.div`
  font-family:'Poppins',sans-serif;font-size:1.6rem;font-weight:600;
  color:var(--accent);letter-spacing:-.5px;
`;
const Nav = styled.nav`display:flex;flex-direction:column;gap:1.1rem;flex:1;`;
const linkStyle = css`
  display:flex;align-items:center;gap:.8rem;padding:.7rem 1rem;border-radius:8px;
  color:var(--gray-600);font-weight:500;transition:background .25s,color .25s;
  &.active,&:hover{background:var(--gray-100);color:var(--accent);}
`;
const LinkS   = styled(NavLink)` ${linkStyle} `;
const Logout  = styled.button`${linkStyle};background:none;border:none;cursor:pointer;`;

/* ───────── burger button ───────── */
const Burger = styled.button`
  display:none;
  @media (max-width:768px){
    display:grid;place-items:center;position:fixed;top:18px;left:18px;
    width:46px;height:46px;background:#fff;border:none;border-radius:50%;
    box-shadow:0 4px 14px rgba(0,0,0,.15);z-index:2700;cursor:pointer;
    font-size:1.35rem;color:var(--accent);
  }
`;

/* ───────── component ───────── */
export default function AdminLayout(){
  const { logout } = useAuth();
  const nav = useNavigate();
  const [open,setOpen]=useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* close drawer on route‑change or Esc */
  useEffect(()=>{
    const close = () => setOpen(false);
    window.addEventListener('keyup', e=>e.key==='Escape'&&close());
    return ()=>window.removeEventListener('keyup',close as any);
  },[]);

  /* close when clicking outside */
  useEffect(()=>{
    const fn=(e:MouseEvent)=>{
      if(open && wrapRef.current && !wrapRef.current.contains(e.target as Node)){
        setOpen(false);
      }
    };
    window.addEventListener('mousedown',fn);
    return()=>window.removeEventListener('mousedown',fn);
  },[open]);

  const signOut=()=>{ logout(); nav('/'); };

  return(
    <Shell>
      {/* burger */}
      <Burger aria-label="Open admin menu" onClick={()=>setOpen(true)}>
        <FiMenu/>
      </Burger>

      {/* veil */}
      {open && <Veil onClick={()=>setOpen(false)}/>}

      {/* sidebar / drawer */}
      <Side open={open} ref={wrapRef}>
        <Brand>
          Grande&nbsp;<span style={{color:'var(--gray-700)',fontWeight:500}}>Admin</span>
          <span style={{display:'inline-block',marginLeft:'auto',cursor:'pointer'}}
                onClick={()=>setOpen(false)}>
            <FiX style={{verticalAlign:'middle'}}/>
          </span>
        </Brand>

        <Nav>
          <LinkS to="/"      onClick={()=>setOpen(false)}><FiHome/> Store</LinkS>
          <LinkS to="/admin" end onClick={()=>setOpen(false)}><FiPieChart/> Dashboard</LinkS>
          <LinkS to="/admin/products" onClick={()=>setOpen(false)}><FiBox/> Products</LinkS>
          <LinkS to="/admin/orders"   onClick={()=>setOpen(false)}><FiList/> Orders</LinkS>
        </Nav>

        <Logout onClick={signOut}><FiLogOut/> Logout</Logout>
      </Side>

      {/* page body */}
      <Main>
        <Outlet/>
      </Main>
    </Shell>
  );
}
