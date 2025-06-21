// ─────────────────────────────────────────────────────────────
//  Grande&Co · Admin → Orders
//  Features: list, filter, search, status update (+ email), timeline
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

/* ─── Types ──────────────────────────────────────────────── */
interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  productId: number;
  product?: { id: number; title: string };
}
interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}
interface StatusHist {
  id: number;
  status: string;
  changedAt: string;
}

/* ─── Styled Components ─────────────────────────────────── */
const Flex = styled.div`display:flex;align-items:center;gap:.8rem;`;
const ControlBar = styled(Flex)`margin-bottom:1rem;justify-content:space-between;`;
const Select = styled.select`
  padding:.45rem .8rem;border:1px solid var(--gray-300);border-radius:6px;
`;
const SearchWrap = styled(Flex)`
  background:var(--gray-100);padding:.4rem .8rem;border-radius:6px;
  svg{color:var(--gray-600)}
  input{border:none;background:none;width:160px;&:focus{outline:none}}
`;
const Table = styled.table`
  width:100%;border-collapse:collapse;
  th,td{padding:.7rem;border-bottom:1px solid var(--gray-200);}
  th{background:var(--gray-100);text-align:left;}
  tr:hover{background:var(--gray-50);cursor:pointer;}
`;
const Drawer = styled(motion.aside)`
  position:fixed;right:0;top:0;height:100%;width:420px;z-index:4100;
  background:var(--surface);border-left:1px solid var(--gray-200);
  display:flex;flex-direction:column;box-shadow:var(--shadow-md);
`;
const DrawerHeader = styled(Flex)`
  justify-content:space-between;padding:1rem 2rem;border-bottom:1px solid var(--gray-200);
`;
const DrawerBody = styled.div`flex:1;overflow:auto;padding:1.6rem 2rem;`;
const Skeleton = styled.div`
  height:12px;background:var(--gray-200);border-radius:3px;width: ${p=>p.style?.width||'100%'};
  margin-bottom:.8rem;animation:pulse 1.2s infinite;
  @keyframes pulse{0%{opacity:.7}50%{opacity:.4}100%{opacity:.7}}
`;
const lineGrow = keyframes`from{height:0}to{height:100%}`;
const TL = styled.div``;
const TLItem = styled.div`
  position:relative;padding-left:1.6rem;margin-bottom:1rem;
  &:before{
    content:'';position:absolute;left:.3rem;top:.25rem;width:10px;height:10px;
    border-radius:50%;background:var(--accent);
  }
  &:after{
    content:'';position:absolute;left:.75rem;top:1.35rem;width:2px;
    height:calc(100% - 1.35rem);background:var(--gray-300);
    animation:${lineGrow}.6s ease forwards;
  }
  &:last-child:after{display:none;}
`;
/* Confirm modal */
const Overlay = styled(motion.div)`
  position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);z-index:4200;
`;
const Modal = styled(motion.div)`
  background:var(--surface);border-radius:10px;width:90%;max-width:380px;
  padding:1.8rem;box-shadow:var(--shadow-md);
`;
const ModalBtn = styled.button<{primary?:boolean}>`
  padding:.7rem 1.2rem;border:none;border-radius:6px;margin-left:.8rem;font-weight:600;cursor:pointer;
  background:${p=>p.primary?'var(--accent)':'var(--gray-200)'};color:${p=>p.primary?'#fff':'var(--gray-900)'};
  &:hover{filter:brightness(.93);}
`;
/* ────────────────────────────────────────────────────────── */

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders,      setOrders]   = useState<Order[]>([]);
  const [loading,     setLoading]  = useState(true);
  const [filter,      setFilter]   = useState<'all'|string>('all');
  const [query,       setQuery]    = useState('');
  const [sel,         setSel]      = useState<Order|null>(null);
  const [hist,        setHist]     = useState<StatusHist[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [confirm,     setConfirm]  = useState<{id:number; newStatus:string}|null>(null);

  const hdr = { Authorization: `Bearer ${token}` };

  /* fetch orders list */
  useEffect(()=>{
    fetch('http://localhost:3000/orders',{headers:hdr})
      .then(r=>r.json())
      .then(setOrders)
      .catch(()=>toast.error('Failed loading orders'))
      .finally(()=>setLoading(false));
  },[token]);

  /* fetch status history when drawer opens */
  useEffect(()=>{
    if(sel){
      setHist([]);
      setHistLoading(true);
      fetch(`http://localhost:3000/orders/${sel.id}/status-history`,{headers:hdr})
        .then(r=>r.json())
        .then(setHist)
        .catch(()=>toast.error('History error'))
        .finally(()=>setHistLoading(false));
    }
  },[sel]);

  /* status update */
  const performUpdate = async(id:number,newStatus:string)=>{
    try{
      const res = await fetch(`http://localhost:3000/orders/${id}/status`,{
        method:'PUT',headers:{'Content-Type':'application/json',...hdr},
        body:JSON.stringify({status:newStatus})
      });
      if(!res.ok) throw new Error();
      const updated:Order = await res.json();
      toast.success(`Order #${id} → ${newStatus}`);
      setOrders(prev=>prev.map(o=>o.id===id?updated:o));
      setSel(updated);
      // refresh history
      fetch(`http://localhost:3000/orders/${id}/status-history`,{headers:hdr})
        .then(r=>r.json()).then(setHist);
    }catch{ toast.error('Update failed'); }
  };

  /* filter + search */
  const visible = orders.filter(o=>{
    const passStatus = filter==='all' || o.status===filter;
    const passSearch = query==='' || o.id.toString().includes(query);
    return passStatus && passSearch;
  });

  return (
    <>
      <h1 style={{fontSize:'2rem',margin:'0 0 1rem'}}>Orders</h1>

      {/* Controls */}
      <ControlBar>
        <Select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {['pending','paid','shipped','delivered','cancelled'].map(s=>
            <option key={s} value={s}>{s}</option>)}
        </Select>

        <SearchWrap>
          <FiSearch size={18}/>
          <input placeholder="Search ID" value={query} onChange={(e:ChangeEvent<HTMLInputElement>)=>setQuery(e.target.value)}/>
        </SearchWrap>
      </ControlBar>

      {/* Table */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <Table>
          <thead><tr><th>ID</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {visible.map(o=>(
              <tr key={o.id} onClick={()=>setSel(o)}>
                <td>{o.id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.status}</td>
                <td>${o.total.toFixed(2)}</td>
              </tr>
            ))}
            {visible.length===0 && (
              <tr><td colSpan={4} style={{textAlign:'center'}}>No orders.</td></tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {sel && (
          <Drawer
            initial={{x:420}} animate={{x:0}} exit={{x:420}}
            transition={{type:'tween',duration:.35}}
          >
            <DrawerHeader>
              <h3>Order #{sel.id}</h3>
              <button style={{background:'none',border:'none',cursor:'pointer'}} onClick={()=>setSel(null)}>
                <FiX size={22}/>
              </button>
            </DrawerHeader>

            <DrawerBody>
              <p><strong>Date:</strong> {new Date(sel.createdAt).toLocaleString()}</p>
              <p style={{margin:'1rem 0 .4rem'}}><strong>Current status:</strong> {sel.status}</p>

              <Select value={sel.status} onChange={e=>setConfirm({id:sel.id,newStatus:e.target.value})}>
                {['pending','paid','shipped','delivered','cancelled'].map(s=>
                  <option key={s} value={s}>{s}</option>)}
              </Select>

              <h4 style={{margin:'1.8rem 0 .6rem'}}>Items</h4>
              {sel.items.map(it=>{
                const title = it.product?.title ?? `Product #${it.productId}`;
                return (
                  <div key={it.id} style={{padding:'.45rem 0',borderBottom:'1px solid var(--gray-200)'}}>
                    {title} × {it.quantity} — ${it.unitPrice.toFixed(2)}
                  </div>
                );
              })}

              <p style={{margin:'1.2rem 0',fontWeight:600}}>Total  ${sel.total.toFixed(2)}</p>

              {/* History */}
              <h4 style={{marginTop:'1.8rem'}}>Status history</h4>
              {histLoading ? (
                <>
                  <Skeleton style={{width:'80%'}}/><Skeleton style={{width:'60%'}}/>
                  <Skeleton style={{width:'50%'}}/>
                </>
              ) : (
                <TL>
                  {hist.map(h=>(
                    <TLItem key={h.id}>
                      {h.status} — {new Date(h.changedAt).toLocaleString()}
                    </TLItem>
                  ))}
                  {hist.length===0 && <p>No history yet.</p>}
                </TL>
              )}
            </DrawerBody>
          </Drawer>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <Overlay
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setConfirm(null)}
          >
            <Modal
              initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.9,opacity:0}}
              transition={{type:'spring',stiffness:260,damping:26}}
              onClick={e=>e.stopPropagation()}
            >
              <p style={{marginBottom:'1rem'}}>
                Change status of order #{confirm.id} to <strong>{confirm.newStatus}</strong>?
              </p>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <ModalBtn onClick={()=>setConfirm(null)}>Cancel</ModalBtn>
                <ModalBtn
                  primary
                  onClick={()=>{
                    performUpdate(confirm.id,confirm.newStatus);
                    setConfirm(null);
                  }}
                >Confirm</ModalBtn>
              </div>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}
