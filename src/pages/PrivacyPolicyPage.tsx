import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1.5rem;
  color: var(--text-main);
  line-height: 1.7;
`;

export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <h1 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Privacy Policy</h1>

      <p>
        Grande&Co values your privacy. This policy describes how we collect, use, and protect your personal information.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account Information:</strong> Name, email, password, shipping address, billing address.</li>
        <li><strong>Order Data:</strong> Product details, payment status, transaction history.</li>
        <li><strong>Device & Usage Info:</strong> IP address, browser type, pages visited, and cookies.</li>
        <li><strong>Newsletter Subscriptions:</strong> Your email and preferences.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To process orders and provide customer service.</li>
        <li>To personalize your experience on Grande&Co.</li>
        <li>To send order updates, newsletters (with opt-out), and important notices.</li>
        <li>To improve our site’s functionality and security.</li>
      </ul>

      <h2>3. Sharing Information</h2>
      <p>
        We do <strong>not</strong> sell or rent your personal data. We share it only with:
      </p>
      <ul>
        <li>Trusted partners like payment processors, shipping carriers, and email service providers.</li>
        <li>Legal authorities if required to comply with the law.</li>
      </ul>

      <h2>4. Cookies & Tracking</h2>
      <p>
        We use cookies and similar technologies to enhance user experience, analyze traffic, and for secure authentication.
        You can control cookie preferences via your browser.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Request a copy of the data we hold about you.</li>
        <li>Request corrections to your personal data.</li>
        <li>Request deletion of your data (where applicable).</li>
        <li>Withdraw consent to marketing communications at any time.</li>
      </ul>

      <h2>6. Data Security</h2>
      <p>
        We use SSL encryption, access controls, and secure servers to protect your data. However, no system is 100% secure,
        so we encourage strong passwords and vigilance.
      </p>

      <h2>7. International Data</h2>
      <p>
        If you access Grande&Co outside of [Country], your data may be processed in [Country]. By using our services,
        you consent to this transfer.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy. Significant changes will be highlighted on our website. Continued use of Grande&Co means
        acceptance of updates.
      </p>

      <p style={{ marginTop: '2rem' }}>
        For privacy concerns, contact <a href="mailto:privacy@grandeandco.com">privacy@grandeandco.com</a>.
      </p>
    </Wrapper>
  );
}
