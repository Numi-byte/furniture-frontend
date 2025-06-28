/*  src/pages/TermsOfServicePage.tsx
    Casa Neuvo · Terms of Service
    – compact accordion layout
------------------------------------------------------ */

import { useState } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown } from 'react-icons/fi';

/* ---------- layout ---------- */
const Wrapper = styled.main`
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1.4rem;
  color: var(--text-main, #111);
  line-height: 1.7;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw + .3rem, 2.6rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.8rem;
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
  font-size: 1.05rem;
  font-weight: 600;

  svg {
    transition: transform .35s cubic-bezier(.4,0,.2,1);
    ${({ open }) => open && css`transform: rotate(180deg);`}
  }
`;

const Panel = styled.div<{ open: boolean }>`
  overflow: hidden;
  max-height: ${({ open }) => (open ? '650px' : '0')};
  transition: max-height .45s cubic-bezier(.4,0,.2,1);
  padding-bottom: ${({ open }) => (open ? '1.4rem' : '0')};

  p, ul {
    font-size: .95rem;
    color: var(--text-sub, #555);
  }
  ul { padding-left: 1.2rem; margin-top: .4rem; }
  li { margin-bottom: .4rem; }
`;

/* ---------- helper ---------- */
const Block = ({ heading, children }: { heading: string; children: React.ReactNode }) => {
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
export default function TermsOfServicePage() {
  return (
    <Wrapper>
      <Title>Terms of Service</Title>

      <Block heading="1. Eligibility">
        <p>
          You must be at least 18 years old (or the age of majority in your
          jurisdiction) to use Casa Neuvo. By accessing our services you confirm
          you meet these requirements.
        </p>
      </Block>

      <Block heading="2. Orders &amp; payments">
        <p>
          All orders are subject to acceptance and stock availability. Prices
          and availability may change without notice. Payment is collected at
          checkout via secure third‑party processors.
        </p>
      </Block>

      <Block heading="3. Intellectual property">
        <p>
          All logos, images, designs and text belong to or are licensed by
          Casa Neuvo. You may not reproduce or distribute any content without
          written permission.
        </p>
      </Block>

      <Block heading="4. User conduct">
        <p>
          You agree not to violate any laws, interfere with site functionality
          or attempt unauthorised access to any part of the service.
        </p>
      </Block>

      <Block heading="5. Termination">
        <p>
          We may suspend or terminate access for behaviour that breaches these
          Terms. We also reserve the right to modify or discontinue services at
          any time.
        </p>
      </Block>

      <Block heading="6. Disclaimers">
        <p>
          Services are provided “as is” without warranties of any kind. Casa Neuvo
          is not liable for indirect or consequential losses arising from use of
          the site.
        </p>
      </Block>

      <Block heading="7. Changes">
        <p>
          We may update these Terms. Significant changes will be posted on this
          page. Continued use of the service after changes constitutes
          acceptance.
        </p>
      </Block>

      <p style={{ marginTop: '2rem', fontSize: '.9rem', textAlign: 'center' }}>
        Need help? Email&nbsp;
        <a href="mailto:support@casaneuvo.com" style={{ color: '#0071e3' }}>
          support@casaneuvo.com
        </a>
      </p>
    </Wrapper>
  );
}
