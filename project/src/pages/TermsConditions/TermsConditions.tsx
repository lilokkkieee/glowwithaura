import LegalLayout from '@/components/LegalLayout/LegalLayout';

export default function TermsConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated="July 2026"
      intro="These terms govern your use of the Glow With Aura website and services. By using our site, you agree to these terms."
      sections={[
        {
          heading: 'Use of Our Site',
          body: (
            <>
              <p>You agree to use our site lawfully and not to misuse, disrupt, or attempt to gain unauthorized access to our systems. We may update or modify the site at any time without notice.</p>
            </>
          ),
        },
        {
          heading: 'Accounts & Orders',
          body: (
            <>
              <p>You are responsible for keeping your account credentials secure and for all activity under your account. All orders are subject to availability and confirmation of order receipt.</p>
            </>
          ),
        },
        {
          heading: 'Pricing & Payment',
          body: (
            <>
              <p>We strive to keep prices accurate, but errors may occur. We reserve the right to correct errors and cancel affected orders. Payment is processed securely at checkout.</p>
            </>
          ),
        },
        {
          heading: 'Shipping & Delivery',
          body: (
            <>
              <p>Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers. Risk of loss passes to you upon delivery.</p>
            </>
          ),
        },
        {
          heading: 'Intellectual Property',
          body: (
            <>
              <p>All content on this site — including text, images, logos, and designs — is owned by Glow With Aura and protected by copyright and trademark laws. You may not reproduce it without permission.</p>
            </>
          ),
        },
        {
          heading: 'Limitation of Liability',
          body: (
            <>
              <p>Our candles are provided as-is. We are not liable for indirect or consequential damages arising from the use of our products or site.</p>
            </>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <>
              <p>Questions about these terms? sukhadevetilottama1@gmail.com </p>
            </>
          ),
        },
      ]}
    />
  );
}
