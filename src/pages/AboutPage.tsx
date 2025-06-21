import styled from 'styled-components';

const Page = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const HeroImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  background: url('https://images.unsplash.com/photo-1581091870622-3a6b0c88b656') center/cover no-repeat;

  @media(max-width: 768px) {
    height: 200px;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--accent);
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--gray-700);
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 1.5rem;
`;

const ValueBox = styled.div`
  background: var(--surface);
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
`;

const CTA = styled.div`
  background: var(--accent);
  color: #fff;
  text-align: center;
  padding: 2rem;
  border-radius: var(--radius);
  font-size: 1.3rem;
  font-weight: 600;
  margin-top: 3rem;
`;

export default function AboutPage() {
  return (
    <Page>
      <HeroImage />

      <Section>
        <Title>Our Story</Title>
        <Text>
          Grande&amp;Co is more than a furniture brand — we’re a design philosophy. Our mission is to bring elegance,
          functionality, and sustainability to your living spaces. Every piece is crafted with passion, precision, and
          purpose, ensuring it complements modern lifestyles while standing the test of time.
        </Text>
      </Section>

      <Section>
        <Title>What we believe in</Title>
        <ValuesGrid>
          <ValueBox>
            <h3>🌱 Sustainability</h3>
            <p>We source materials responsibly and focus on eco-friendly production methods to protect our planet.</p>
          </ValueBox>
          <ValueBox>
            <h3>🎨 Design Excellence</h3>
            <p>Our pieces combine timeless aesthetics with modern innovation for furniture that inspires.</p>
          </ValueBox>
          <ValueBox>
            <h3>🤝 Customer First</h3>
            <p>From design to delivery, we prioritize your satisfaction with unmatched care and service.</p>
          </ValueBox>
        </ValuesGrid>
      </Section>

      <Section>
        <Title>Behind the scenes</Title>
        <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden',borderRadius:'12px'}}>
          <iframe
            src="https://www.youtube.com/embed/0fKg7e37bQE"
            title="Grande & Co Behind the Scenes"
            style={{
              position: 'absolute',
              top:0,left:0,
              width:'100%',
              height:'100%',
              border:0
            }}
            allowFullScreen
          />
        </div>
      </Section>

      <CTA>
        Ready to elevate your space? <br />
        <a href="/products" style={{ color:'#fff', textDecoration:'underline' }}>Shop now</a>
      </CTA>
    </Page>
  );
}
