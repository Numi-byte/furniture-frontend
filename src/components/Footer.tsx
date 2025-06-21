import styled from 'styled-components';

const Foot = styled.footer`
  margin-top: 4rem;
  padding: 2.5rem 1.5rem;
  background: #151515;
  border-top: 1px solid rgba(255,255,255,.05);
`;

const Container = styled.div`
  max-width: var(--max-w);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-sub);
  font-size: .9rem;
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;
  a { color: var(--text-sub); transition: color .3s; }
  a:hover { color: var(--gold); }
`;

export default function Footer() {
  return (
    <Foot>
      <Container>
        <Links>
          <a href="/">Home</a>
          <a href="/products">Shop</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </Links>
        <span>© {new Date().getFullYear()} Grande&Co. All rights reserved.</span>
      </Container>
    </Foot>
  );
}
