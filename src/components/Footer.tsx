import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowUp } from 'react-icons/fi';

/* ---------- styled ---------- */
const Foot = styled.footer`
  margin-top: 4rem;
  padding: 2.5rem 1.5rem;
  background: #151515;
  color: var(--text-sub, #aaa);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Wrap = styled.div`
  max-width: var(--max-w, 1280px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem;

  a {
    color: inherit;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    transition: color 0.25s;
  }
  a:hover {
    color: var(--accent, #0071e3);
  }
`;

const Copy = styled.span`
  opacity: 0.8;
`;

const TopBtn = styled.button`
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--accent, #0071e3);
  color: #000;
  font-size: 1.35rem;
  box-shadow: 0 6px 20px rgba(0 0 0 / .25);
  cursor: pointer;
  z-index: 4500;

  @media (max-width: 640px) {
    display: grid;
    place-items: center;
  }
`;

/* ---------- component ---------- */
export default function Footer() {
  return (
    <>
      <Foot>
        <Wrap>
          <NavLinks aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </NavLinks>

          <Copy>
            © {new Date().getFullYear()} <b>Casa Neuvo</b>.&nbsp;All&nbsp;rights&nbsp;reserved.
          </Copy>
        </Wrap>
      </Foot>

      {/* back‑to‑top (mobile‑only) */}
      <TopBtn
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <FiArrowUp />
      </TopBtn>
    </>
  );
}
