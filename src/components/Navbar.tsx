import { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';
import toast from 'react-hot-toast';

/* ---------- styled basics ---------- */
const Bar = styled.header`
  position: sticky; top: 0; z-index: 120; width: 100%;
  backdrop-filter: blur(14px);
  background: rgba(255,255,255,.72);
  border-bottom: 1px solid var(--gray-200);
  padding: 0.9rem 1.6rem;
  display: flex; align-items: center; justify-content: space-between;
`;

const Logo = styled(Link)`
  font-family: 'Poppins', sans-serif;
  font-size: 1.55rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: -.5px;

  span { color: var(--gray-900); font-weight: 500; } /* “& Co” */
`;

const underline = css`
  position: relative;
  &:after{
    content:'';
    position:absolute; left:0; bottom:-4px;
    width:0; height:2px; background:var(--accent);
    transition:width .35s cubic-bezier(.4,0,.2,1);
  }
  &:hover:after{ width: 100%; }
`;

const NavLinks = styled.nav<{open:boolean}>`
  display: flex; gap: 1.8rem;
  a { color: var(--gray-900); font-weight: 500; ${underline}; }

  @media (max-width: 640px) {
    position: fixed; top: 64px; left: 0; right: 0;
    background: var(--surface);
    flex-direction: column;
    padding: 1.7rem 1.4rem; gap: 1.4rem;
    transform: translateY(${p=>p.open ? '0' : '-110%'});
    transition: transform .35s cubic-bezier(.4,0,.2,1);
    a { font-size: 1.1rem; }
  }
`;

const IconBtn = styled.button`
  background: none; border: none; color: var(--accent);
  font-size: 1.45rem; display: flex; align-items: center;
  cursor: pointer; transition: opacity .25s;
  &:hover{ opacity: .75; }

  @media (min-width: 641px) { &[data-mobile]{ display: none; } }
  @media (max-width: 640px) { &[data-desktop]{ display: none; } }
`;

const AccountWrap = styled.div` position: relative; display: inline-block; `;

const Dropdown = styled.div<{show:boolean}>`
  position: absolute; right: 0; top: 120%;
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  min-width: 170px;
  box-shadow: var(--shadow-sm);
  padding: 0.45rem 0;

  opacity: 0; visibility: hidden; transform: translateY(-8px);
  transition: all .28s ease;
  ${p=>p.show && css`opacity:1; visibility:visible; transform: translateY(0);`}

  a,button{
    width: 100%; background: none; border: none; text-align: left;
    color: var(--gray-600); padding: .55rem 1rem; font-size: .9rem; cursor: pointer;
    transition: background .25s, color .25s;
    &:hover{ background: var(--gray-100); color: var(--accent); }
  }
`;

const CartBadge = styled.span`
  background: var(--accent); color: #fff;
  font-size: .7rem; font-weight: 700;
  border-radius: 999px; padding: 0 6px; margin-left: 4px;
`;

/* ---------- component ---------- */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  const cartQty = items.reduce((sum, i) => sum + i.quantity, 0);

  const [mobOpen , setMob ] = useState(false);
  const [menuOpen, setMenu] = useState(false);
  const [cartOpen, setCart] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* close dropdown on click‑outside */
  useEffect(()=>{
    const fn = (e:MouseEvent)=>{
      if(menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)){
        setMenu(false);
      }
    };
    window.addEventListener('mousedown', fn);
    return ()=> window.removeEventListener('mousedown', fn);
  },[menuOpen]);

  const signOut = () => {
    logout();
    toast.success('Logged out');
    nav('/');
  };

  return (
    <>
      <Bar>
        <Logo to="/">
          Casa<span> Neuvo</span>
        </Logo>

        {/* mobile burger */}
        <IconBtn data-mobile onClick={()=>setMob(p=>!p)}>
          {mobOpen ? <FiX/> : <FiMenu/>}
        </IconBtn>

        {/* links */}
        <NavLinks open={mobOpen}>
          <Link to="/products" onClick={()=>setMob(false)}>Shop</Link>
          <Link to="/about"         onClick={()=>setMob(false)}>About</Link>
          <Link to="/contact"         onClick={()=>setMob(false)}>Contact</Link>
        </NavLinks>

        {/* right‑side icons */}
        <div style={{display:'flex',alignItems:'center',gap:'1.4rem'}}>
          <IconBtn data-desktop onClick={()=>setCart(true)}>
            <FiShoppingCart size={20}/>
            {cartQty>0 && <CartBadge>{cartQty}</CartBadge>}
          </IconBtn>

          <AccountWrap ref={menuRef}
            onMouseEnter={()=>setMenu(true)}
            onMouseLeave={()=>setMenu(false)}
          >
            <IconBtn data-desktop onClick={()=>setMenu(p=>!p)}>
              <FiUser size={20}/>
            </IconBtn>

            <Dropdown show={menuOpen}>
              {user ? (
                <>
                  <Link to="/account" onClick={()=>setMenu(false)}>Account</Link>
                  {user.role==='admin' && (
                    <Link to="/admin" onClick={()=>setMenu(false)}>Admin</Link>
                  )}
                  <button onClick={signOut}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login"  onClick={()=>setMenu(false)}>Login</Link>
                  <Link to="/signup" onClick={()=>setMenu(false)}>Sign&nbsp;up</Link>
                </>
              )}
            </Dropdown>
          </AccountWrap>
        </div>
      </Bar>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={()=>setCart(false)}/>
    </>
  );
}
