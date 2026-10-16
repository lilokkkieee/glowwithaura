import LegalLayout from '@/components/LegalLayout/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="July 2026"
      intro="Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have."
      sections={[
        {
          heading: 'Information We Collect',
          body: (
            <>
              <p>We collect information you provide directly, such as your name, email, shipping address, and payment details when you create an account or place an order. We also collect usage data like pages visited and products viewed.</p>
            </>
          ),
        },
        {
          heading: 'How We Use Your Information',
          body: (
            <>
              <p>We use your information to process orders, communicate with you about your account, improve our products and services, and send marketing emails (which you can opt out of at any time).</p>
            </>
          ),
        },
        {
          heading: 'Cookies & Tracking',
          body: (
            <>
              <p>We use cookies and similar technologies to remember your preferences, keep items in your cart, and understand how you use our site. You can control cookies through your browser settings.</p>
            </>
          ),
        },
        {
          heading: 'Data Sharing',
          body: (
            <>
              <p>We never sell your personal information. We share data only with trusted partners who help us run our business — like payment processors and shipping carriers — and only the minimum needed.</p>
            </>
          ),
        },
        {
          heading: 'Your Rights',
          body: (
            <>
              <p>You can access, update, or delete your personal information at any time by contacting us. You may also opt out of marketing communications using the unsubscribe link in any email.</p>
            </>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <>
              <p>Questions about this policy? Email us at sukhadevetilottama1@gmail.com and we will respond within 48 hours.</p>
            </>
          ),
        },
      ]}
    />
  );
}
