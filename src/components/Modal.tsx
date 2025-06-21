import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
  display:flex;align-items:center;justify-content:center;z-index:2000;
`;
const Box = styled.div`
  background:var(--card-bg);padding:2rem;border-radius:var(--radius);
  box-shadow:var(--shadow);max-height:90vh;overflow:auto;min-width:340px;
`;

export default function Modal({ open, onClose, children }:{
  open:boolean; onClose:()=>void; children:ReactNode
}){
  useEffect(()=>{
    const esc=(e:KeyboardEvent)=>e.key==='Escape'&&onClose();
    document.addEventListener('keydown',esc); return()=>document.removeEventListener('keydown',esc);
  },[onClose]);

  if(!open) return null;
  return (
    <Overlay onClick={onClose}>
      <Box onClick={e=>e.stopPropagation()}>{children}</Box>
    </Overlay>
  );
}
