/*  src/pages/PrivacyPolicyPage.tsx
    Casa Neuvo · Privacy Policy  ⚖️
    – modern accordion layout, fully responsive
----------------------------------------------------------- */

import { useState } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown } from 'react-icons/fi';

// Define accent color for links
const ACCENT = '#0070f3';

/* ---------- layout shell ---------- */
const Wrapper = styled.main`
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1.4rem;
  color: var(--text-main, #111);

  @media (max-width: 600px) {
    margin-top: 3rem;
  }
`;

/* ---------- page heading ---------- */
const Title = styled.h1`
  font-size: clamp(2rem, 4vw + .5rem, 2.75rem);
  font-weight: 700;
  margin-bottom: 1.8rem;
  text-align: center;
`;

/* ---------- accordion ---------- */
const Section = styled.section`
  border-bottom: 1px solid var(--gray-200, #e4e4e4);
`;

const Toggle = styled.button<{ open: boolean }>`
  all: unset;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 0;
  cursor: pointer;
  color: var(--text-main, #111);
  font-size: 1.05rem;
  font-weight: 600;

  svg {
    transition: transform .35s cubic-bezier(.4,0,.2,1);
    ${({ open }) => open && css`transform: rotate(180deg);`}
  }
`;

const Panel = styled.div<{ open: boolean }>`
  overflow: hidden;
  max-height: ${({ open }) => (open ? '600px' : '0px')};
  transition: max-height .45s cubic-bezier(.4,0,.2,1);

  p, ul {
    font-size: .95rem;
    line-height: 1.7;
    color: var(--text-sub, #555);
  }
  ul { padding-left: 1.2rem; margin-top: .4rem; }
  li { margin-bottom: .4rem; }
  p + p, ul + p { margin-top: .8rem; }
  padding-bottom: ${({ open }) => (open ? '1.4rem' : '0')};
`;

/* ---------- helper ---------- */
const Block = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => {
  const [open, set] = useState(false);
  return (
    <Section>
      <Toggle open={open} onClick={() => set(o => !o)}>
        {heading}
        <FiChevronDown size={22} />
      </Toggle>
      <Panel open={open}>{children}</Panel>
    </Section>
  );
};

/* ---------- page ---------- */
export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <Title>Privacy Policy</Title>

      <Block heading="1. Information we collect">
        <ul>
          <li><strong>Account:</strong> name, email, password, addresses.</li>
          <li><strong>Orders:</strong> items, payment status, history.</li>
          <li><strong>Device & Usage:</strong> IP, browser, pages, cookies.</li>
          <li><strong>Marketing:</strong> newsletter preferences.</li>
        </ul>
      </Block>

      <Block heading="2. How we use information">
        <ul>
          <li>Process orders &amp; provide support.</li>
          <li>Personalise Casa Neuvo to you.</li>
          <li>Send updates, newsletters (opt‑out anytime).</li>
          <li>Improve security &amp; performance.</li>
        </ul>
      </Block>

      <Block heading="3. Sharing information">
        <p>
          We <strong>never sell</strong> your data. We share it only with:
        </p>
        <ul>
          <li>Payment, shipping & email partners.</li>
          <li>Authorities when required by law.</li>
        </ul>
      </Block>

      <Block heading="4. Cookies &amp; tracking">
        <p>
          Cookies help us sign you in securely, remember your cart and analyse
          traffic. Manage them anytime in your browser settings.
        </p>
      </Block>

      <Block heading="5. Your rights">
        <ul>
          <li>Download a copy of your data.</li>
          <li>Correct incorrect information.</li>
          <li>Request deletion where legally possible.</li>
          <li>Unsubscribe from marketing.</li>
        </ul>
      </Block>

      <Block heading="6. Data security">
        <p>
          SSL, encryption at rest, & strict access controls protect your
          information. No system is 100 % bullet‑proof – choose strong passwords
          and monitor your account.
        </p>
      </Block>

      <Block heading="7. International processing">
        <p>
          Casa Neuvo is operated from&nbsp;[Country]. By using our services you
          consent to cross‑border data transfer.
        </p>
      </Block>

      <Block heading="8. Updates">
        <p>
          We’ll post any privacy changes here and, if significant, notify you by
          email. Continued use constitutes acceptance.
        </p>
      </Block>

      <p style={{ marginTop: '2rem', fontSize: '.9rem', textAlign: 'center' }}>
        Questions? Email&nbsp;
        <a href="mailto:privacy@casaneuvo.com" style={{ color: ACCENT }}>
          privacy@casaneuvo.com
        </a>
      </p>
    </Wrapper>
  );
}
