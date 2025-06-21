import ChangePasswordPanel from '../../components/ChangePasswordPanel';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const H2 = styled.h2`font-size:1.6rem;font-weight:600;color:var(--gray-900);margin-bottom:1.2rem;`;
const Danger = styled.button`
  display:inline-flex;align-items:center;gap:.4rem;
  background:#fbe8e8;color:#b72727;border:none;
  padding:.9rem 1.6rem;border-radius:var(--radius-sm);font-weight:600;
  cursor:pointer;transition:background .25s;
  &:hover{background:#fad1d1;}
`;

export default function SecurityTab(){
  const deleteMe = () => toast('Delete‑account endpoint not implemented yet');

  return(
    <>
      <H2>Security</H2>

      <section style={{background: 'var(--surface)', border:'1px solid var(--gray-200)',
                       borderRadius:'var(--radius-md)', padding:'2rem 1.6rem'}}>
        <h3 style={{marginBottom:'1rem',fontWeight:600}}>Change password</h3>
        <ChangePasswordPanel/>
      </section>

      <section style={{marginTop:'2.4rem'}}>
        <h3 style={{marginBottom:'.8rem',fontWeight:600}}>Danger zone</h3>
        <p style={{fontSize:'.9rem',color:'var(--gray-600)',marginBottom:'1rem'}}>
          Deleting your account is permanent and cannot be undone.
        </p>
        <Danger onClick={deleteMe}>Delete my account</Danger>
      </section>
    </>
  );
}
