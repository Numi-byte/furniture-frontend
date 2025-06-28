import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartDrawer from './CartDrawer';

/* ─────────── styled shells ─────────── */
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 120;
  width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #e5e5e5;
  padding: 0.9rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-family: Poppins, sans-serif;
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--accent);
  span {
    color: var(--gray-900);
    font-weight: 500;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 1.6rem;
  a {
    font-weight: 500;
    color: var(--gray-900);
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

const BurgerBtn = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  @media (min-width: 640px) {
    display: none;
  }
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 44px;
  min-height: 44px;
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--accent);
  color: #fff;
  font-size: 0.68rem;
  border-radius: 50%;
  padding: 1px 5px;
`;

const Veil = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(1.5px);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 130;
`;

const Drawer = styled.aside<{ open: boolean }>`
  position: fixed;
  inset: 0 0 0 auto;
  width: 78%;
  max-width: 300px;
  background: #fff;
  box-shadow: -6px 0 18px rgba(0, 0, 0, 0.08);
  transform: translateX(${p => (p.open ? '0' : '100%')});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 140;
  padding: 2rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const DrawerLink = styled(Link)`
  font-size: 1.05rem;
  color: var(--gray-900);
`;

const Drop = styled.div<{ show: boolean }>`
  position: absolute;
  right: 0;
  top: 110%;
  min-width: 160px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  transition: opacity 0.25s ease;
  a,
  button {
    display: block;
    width: 100%;
    padding: 0.55rem 1rem;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.9rem;
    color: var(--gray-700);
  }
`;

/* ─────────── component ─────────── */
export default function Navbar() {
  const nav = useNavigate();
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);
  const qty = items.reduce((s, i) => s + i.quantity, 0);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDrop(false);
      }
    };
    window.addEventListener('mousedown', fn);
    return () => window.removeEventListener('mousedown', fn);
  }, []);

  /* lock body scroll on drawer */
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
  }, [drawer]);

  const signOut = () => {
    logout();
    toast.success('Logged out');
    nav('/');
  };

  /* ---------- render ---------- */
  return (
    <>
      <Bar>
        {/* burger (mobile) */}
        <BurgerBtn onClick={() => setDrawer(true)} aria-label="menu">
          <FiMenu />
        </BurgerBtn>

        {/* logo */}
        <Logo to="/">
          Casa<span> Neuvo</span>
        </Logo>

        {/* links (desktop) */}
        <DesktopNav>
          <Link to="/products">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </DesktopNav>

        {/* right icons */}
        <div style={{ display: 'flex', gap: '1.1rem' }}>
          {/* cart */}
          <IconBtn onClick={() => setCartOpen(true)} aria-label="cart">
            <FiShoppingCart />
            {qty > 0 && <Badge>{qty}</Badge>}
          </IconBtn>

          {/* account */}
          <div
            style={{ position: 'relative' }}
            ref={dropRef}
            onMouseEnter={() => setDrop(true)}
            onMouseLeave={() => setDrop(false)}
          >
            <IconBtn onClick={() => setDrop(p => !p)} aria-label="account">
              <FiUser />
            </IconBtn>

            <Drop show={drop}>
              {user ? (
                <>
                  <Link to="/account">Account</Link>
                  {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                  <button onClick={signOut}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign up</Link>
                </>
              )}
            </Drop>
          </div>
        </div>
      </Bar>

      {/* mobile drawer */}
      <Veil open={drawer} onClick={() => setDrawer(false)} />
      <Drawer open={drawer}>
        <IconBtn
          style={{ alignSelf: 'flex-end' }}
          onClick={() => setDrawer(false)}
          aria-label="close"
        >
          <FiX />
        </IconBtn>

        <DrawerLink to="/products" onClick={() => setDrawer(false)}>
          Shop
        </DrawerLink>
        <DrawerLink to="/about" onClick={() => setDrawer(false)}>
          About
        </DrawerLink>
        <DrawerLink to="/contact" onClick={() => setDrawer(false)}>
          Contact
        </DrawerLink>

        <hr style={{ borderColor: '#eee', margin: '1rem 0' }} />

        {user ? (
          <>
            <DrawerLink to="/account" onClick={() => setDrawer(false)}>
              Account
            </DrawerLink>
            {user.role === 'admin' && (
              <DrawerLink to="/admin" onClick={() => setDrawer(false)}>
                Admin
              </DrawerLink>
            )}
            <button
              onClick={() => {
                setDrawer(false);
                signOut();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-900)',
                fontSize: '1.05rem',
                textAlign: 'left',
                padding: '0.8rem 0',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <DrawerLink to="/login" onClick={() => setDrawer(false)}>
              Login
            </DrawerLink>
            <DrawerLink to="/signup" onClick={() => setDrawer(false)}>
              Sign up
            </DrawerLink>
          </>
        )}
      </Drawer>

      {/* cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
