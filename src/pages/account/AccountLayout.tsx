import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiUser, FiShoppingBag, FiLock, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const ACCENT = '#0071e3';
const SIDE_W = '220px';
const radius = '16px';

const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  padding: 1.5rem;
  gap: 2rem;
`;

const Sidebar = styled.aside<{ open: boolean }>`
  width: ${SIDE_W};
  background: #fff;
  border: 1px solid #eee;
  border-radius: ${radius};
  padding: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    inset: 0 0 0 0;
    width: ${SIDE_W};
    transform: translateX(${p => (p.open ? '0' : '-110%')});
    transition: transform 0.3s ease;
    z-index: 2000;
  }
`;

const Main = styled.main`
  flex: 1;
`;

const LinkItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: ${radius};
  color: #555;
  font-weight: 500;

  &.active {
    background: ${ACCENT}1a;
    color: ${ACCENT};
  }

  &:hover {
    background: #f5f5f5;
  }
`;

const Burger = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    background: #fff;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 2100;
  }
`;

const Veil = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 1900;
  }
`;

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <>
      <Burger onClick={() => setOpen(true)}>
        <FiMenu />
      </Burger>

      {open && <Veil onClick={() => setOpen(false)} />}

      <Wrapper>
        <Sidebar open={open}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            {user?.email || 'My Account'}
          </h2>
          <LinkItem to="/account" end onClick={() => setOpen(false)}>
            <FiUser /> Profile
          </LinkItem>
          <LinkItem to="/account/orders" onClick={() => setOpen(false)}>
            <FiShoppingBag /> Orders
          </LinkItem>
          <LinkItem to="/account/security" onClick={() => setOpen(false)}>
            <FiLock /> Security
          </LinkItem>
          <button
            onClick={() => { logout(); nav('/'); }}
            style={{
              marginTop: 'auto',
              border: 'none',
              background: 'none',
              color: '#777',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '.5rem',
              padding: '.6rem 0'
            }}
          >
            <FiLogOut /> Logout
          </button>
        </Sidebar>

        <Main>
          <Outlet />
        </Main>
      </Wrapper>
    </>
  );
}
