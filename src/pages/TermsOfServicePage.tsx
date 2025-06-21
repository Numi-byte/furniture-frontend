import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1.5rem;
  color: var(--text-main);
  line-height: 1.7;
`;

export default function TermsOfServicePage() {
  return (
    <Wrapper>
      <h1 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Terms of Service</h1>

      <p>
        Welcome to Grande&Co. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using Grande&Co,
        you agree to these Terms. If you do not agree, please do not use our site.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old or the age of majority in your jurisdiction to use our services. By using Grande&Co, you represent
        that you meet these requirements.
      </p>

      <h2>2. Orders & Payments</h2>
      <p>
        All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Prices and availability are subject to change without notice.
      </p>
      <p>
        Payment must be made at the time of order via approved payment methods. We use secure third-party processors to handle payment information.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All content, including logos, images, designs, and text on Grande&Co, is owned by or licensed to Grande&Co. You may not reproduce,
        distribute, or use our content without prior written permission.
      </p>

      <h2>4. User Conduct</h2>
      <p>
        You agree not to use Grande&Co for any unlawful purpose or to violate any laws. You may not interfere with the operation of the site or attempt unauthorized access.
      </p>

      <h2>5. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access if you violate these Terms. We may also modify or discontinue our services at any time.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        Our services are provided "as is" without warranties of any kind. We are not liable for any indirect or consequential losses.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these Terms from time to time. We will notify users of significant changes. Continued use of our services indicates acceptance of any changes.
      </p>

      <p style={{ marginTop: '2rem' }}>
        Questions? Contact us at <a href="mailto:support@grandeandco.com">support@grandeandco.com</a>.
      </p>
    </Wrapper>
  );
}
