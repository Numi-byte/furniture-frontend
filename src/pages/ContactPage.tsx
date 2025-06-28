/*  src/pages/ContactPage.tsx
    Grande&Co · Contact + FAQ (enhanced)  */

import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiChevronDown } from 'react-icons/fi';
import { API_BASE } from '../api';

/* ──────────────────────────────────────────────────────────
   Primitives
   ────────────────────────────────────────────────────────── */
const fadeSlide = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: .6, ease: "easeInOut" as const } }
};

const Page = styled.main`
  --g1: #f5f6ff;
  --g2: #ffffff;
  background: linear-gradient(180deg, var(--g1) 0%, var(--g2) 30%);
`;

const Wrap = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
`;

/* Card shell (info, form, faq) */
const Card = styled(motion.section)`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,.04);
  padding: 2.4rem 2.2rem;
`;

/* Split for info / form */
const Split = styled.div`
  display: flex;
  gap: 2.4rem;
  flex-wrap: wrap;

  & > * { flex: 1 1 380px; }
`;

/* Headings */
const H1 = styled.h1`font-size: 2.4rem; font-weight: 700; color: var(--gray-900);`;
const H2 = styled.h2`font-size: 1.35rem; font-weight: 600; color: var(--gray-900); margin: 0;`;
const P  = styled.p`font-size: 1rem; color: var(--gray-600); line-height: 1.55;`;

/* Inputs */
const fieldError = keyframes`10%, 90%{transform:translateX(-2px)}20%, 80%{transform:translateX(4px)}30%, 50%, 70%{transform:translateX(-8px)}40%, 60%{transform:translateX(8px)}`;
const InputBase = css`
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: #fff;
  transition: border-color .2s;
  &:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 3px rgba(0,123,255,.12); }
`;
const Input    = styled.input<InputProps>` ${InputBase}; ${({error})=>error&&css`border-color:#d9534f; animation:${fieldError} .3s;`} `;
const TextArea = styled.textarea<InputProps>` ${InputBase}; min-height: 130px; resize: vertical; ${({error})=>error&&css`border-color:#d9534f; animation:${fieldError} .3s;`} `;

interface InputProps { error?: boolean }

const Btn = styled.button`
  padding: 0.95rem;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform .2s, filter .25s;
  &:hover   { filter: brightness(1.08); }
  &:active  { transform: scale(.98);  }
  &:disabled{ opacity:.55; cursor:not-allowed; }
`;

/* Accordion */
const Item = styled.div<{open:boolean}>`
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 0;

  button {
    all: unset;
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    color: var(--gray-900);
  }
  svg { transition: transform .25s; ${({open})=>open&&'transform:rotate(180deg)'} }
  p   { margin: .8rem 0 .5rem; font-size: .96rem; color: var(--gray-700); line-height:1.55; }
`;

/* Lazy‑loaded map placeholder */
const MapPlaceholder = styled.div`
  width: 100%; height: 240px;
  border-radius: 8px;
  background: linear-gradient(135deg,#f1f1f1 25%,#f9f9f9 25%,#f9f9f9 50%,#f1f1f1 50%,#f1f1f1 75%,#f9f9f9 75%,#f9f9f9 100%);
  background-size: 28px 28px;
`;

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */
export default function ContactPage() {
  /* form state */
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [errors, setErr] = useState<{[k:string]:boolean}>({});
  const [sending, setSend] = useState(false);

  const onChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    setForm({...form,[e.target.name]:e.target.value});
    setErr(prev=>({...prev,[e.target.name]:false}));
  };

  const validate = ()=>{
    const err: {[k:string]:boolean} = {};
    if(!form.name.trim())     err.name    = true;
    if(!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(form.email)) err.email = true;
    if(form.message.trim().length<5)     err.message = true;
    setErr(err);
    return Object.keys(err).length===0;
  };

  const submit = async(e:FormEvent)=>{
    e.preventDefault();
    if(sending) return;
    if(!validate()){ toast.error('Please correct highlighted fields'); return; }

    setSend(true);
    try{
      const r = await fetch(`${API_BASE}/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
      if(!r.ok) throw new Error();
      toast.success('Message sent. We’ll reply soon!');
      setForm({name:'',email:'',message:''});
    }catch{ toast.error('Could not send'); }
    finally{ setSend(false); }
  };

  /* FAQ accordion */
  const faqs = [
    {q:'When will my order arrive?', a:'In‑stock items leave our warehouse within two business days. EU delivery: 3‑5 days · International: 5‑10 days.'},
    {q:'Can I track my shipment?',   a:'Absolutely. Once dispatched we’ll email you a tracking link with real‑time updates.'},
    {q:'What if I need to return?',  a:'No problem. You have 14 days after delivery to initiate a return. We arrange pick‑up at your door.'},
    {q:'Is my payment secure?',      a:'All payments run through PCI‑DSS‑compliant Stripe. Card data never touches our servers.'},
  ];
  const [openIdx,setOpen]=useState<number|null>(null);

  /* lazy map */
  const mapRef = useRef<HTMLIFrameElement|null>(null);
  useEffect(()=>{
    if(!mapRef.current) return;
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        mapRef.current!.src = mapRef.current!.dataset.src!;
        io.disconnect();
      }
    },{rootMargin:'200px'});
    io.observe(mapRef.current);
    return ()=>io.disconnect();
  },[]);

  return (
    <Page>
      <Wrap>
        {/* HERO */}
        <motion.div initial="hidden" whileInView="show" variants={fadeSlide} viewport={{once:true}}>
          <H1 style={{textAlign:'center',marginBottom:'.4rem'}}>We’d love to hear from you</H1>
          <P style={{textAlign:'center',maxWidth:580,margin:'0 auto'}}>
            Whether a question about an order, return, or simply a suggestion — drop us a line and we’ll respond within one business day.
          </P>
        </motion.div>

        {/* CONTACT SPLIT */}
        <Split as={motion.section} initial="hidden" whileInView="show" variants={fadeSlide} viewport={{once:true}}>
          {/* INFO COLUMN */}
          <Card>
            <H2>Contact details</H2>
            <P style={{margin:'1rem 0'}}>
              Casa Neuvo<br/>
              123 Elegance Ave<br/>
              Milano · Italy<br/><br/>
              Phone  +39 02 1234 5678<br/>
              Email  support@casaneuvo.com
            </P>
            {/* Lazy Map */}
            <MapPlaceholder as="div" ref={mapRef as any}>
              <iframe
                data-src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.995684154678!2d9.189982315558815!3d45.46421197910062"
                ref={mapRef}
                loading="lazy"
                style={{width:'100%',height:'100%',border:0,borderRadius:8}}
                title="Casa Neuvo HQ"
              />
            </MapPlaceholder>
          </Card>

          {/* FORM COLUMN */}
          <Card>
            <H2>Send a message</H2>
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem',marginTop:'1.2rem'}}>
              <Input  name="name"    placeholder="Your name"  value={form.name}    onChange={onChange} error={errors.name}/>
              <Input  name="email"   placeholder="Your email" value={form.email}   onChange={onChange} error={errors.email}/>
              <TextArea name="message" placeholder="Your message" value={form.message} onChange={onChange} error={errors.message}/>
              <Btn type="submit" disabled={sending}>{sending? 'Sending…':'Send message'}</Btn>
            </form>
          </Card>
        </Split>

        {/* FAQ */}
        <Card as={motion.section} initial="hidden" whileInView="show" variants={fadeSlide} viewport={{once:true}}>
          <H2 style={{marginBottom:'1.2rem'}}>FAQ</H2>
          {faqs.map((f,i)=>(
            <Item key={i} open={openIdx===i}>
              <button
                onClick={()=>{
                  setOpen(openIdx===i?null:i);
                  setTimeout(()=>{  // auto‑scroll into view when opening
                    if(openIdx!==i){
                      const el = document.getElementById(`faq-${i}`);
                      el&&el.scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'});
                    }
                  },50);
                }}
                aria-expanded={openIdx===i}
                id={`faq-${i}`}
              >
                {f.q}
                <FiChevronDown size={20}/>
              </button>
              {openIdx===i && <p>{f.a}</p>}
            </Item>
          ))}
        </Card>
      </Wrap>
    </Page>
  );
}
