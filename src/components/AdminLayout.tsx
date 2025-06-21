import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { FiPieChart, FiBox, FiList, FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Shell = styled.div`display:flex;min-height:100vh;`;
const Side  = styled.aside`
  width:260px;background:var(--surface);border-right:1px solid var(--gray-200);
  padding:2.4rem 1.4rem;display:flex;flex-direction:column;gap:2.2rem;
`;
const Brand = styled.div`
  font-family:'Poppins',sans-serif;font-size:1.6rem;font-weight:600;
  color:var(--accent);letter-spacing:-.5px;
`;
const Nav = styled.nav`display:flex;flex-direction:column;gap:1.1rem;flex:1;`;
const LinkS = styled(NavLink)`
  display:flex;align-items:center;gap:.8rem;padding:.7rem 1rem;border-radius:8px;
  color:var(--gray-600);font-weight:500;transition:background .25s,color .25s;
  &.active,&:hover{background:var(--gray-100);color:var(--accent);}
`;
const Main = styled.main`flex:1;padding:3rem 2.5rem;`;
const Logout = styled.button`
  background:none;border:none;color:var(--gray-600);cursor:pointer;
  display:flex;align-items:center;gap:.8rem;padding:.6rem 1rem;border-radius:8px;
  &:hover{background:var(--gray-100);color:var(--accent);}
`;

export default function AdminLayout(){
  const { logout } = useAuth();
  return(
    <Shell>
      <Side>
        <Brand>Grande&nbsp;Admin</Brand>
        <Nav>
          <LinkS to="/"><FiHome/> Store</LinkS>
          <LinkS to="/admin" end><FiPieChart/> Dashboard</LinkS>
          <LinkS to="/admin/products"><FiBox/> Products</LinkS>
          <LinkS to="/admin/orders"><FiList/> Orders</LinkS>
        </Nav>
        <Logout onClick={logout}><FiLogOut/> Logout</Logout>
      </Side>
      <Main><Outlet/></Main>
    </Shell>
  );
}
