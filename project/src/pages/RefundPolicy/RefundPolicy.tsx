import LegalLayout from '@/components/LegalLayout/LegalLayout';

export default function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund Policy"
      lastUpdated="July 2026"
      intro="We want you to love every candle. If something is not right, we are here to help. This policy explains our return and refund process."
      sections={[
        {
          heading:  ' 42hr Satisfaction Guarantee',
          body: (
            <>
              <p>If you are not satisfied with your candle for any reason, you may return it within 5-7 days of delivery for a full refund  We stand behind every candle we pour.</p>
            </>
          ),
        },
        {
          heading: 'How to Start a Return',
          body: (
            <>
              <p>Email us at sukhadevetilottama1@gmail.com with your order number and the reason for your return. We will send you a prepaid return label and instructions within 24 hours.</p>
            </>
          ),
        },
        {
          heading: 'Refund Processing',
          body: (
            <>
              <p>Once we receive your return, we inspect it and issue a refund to your original payment method within 5 business days. Shipping fees are non-refundable unless the return is due to our error.</p>
            </>
          ),
        },
        {
          heading: 'Damaged or Defective Items',
          body: (
            <>
              <p>If your candle arrives damaged or defective, send us a photo within 7 days and we will send a replacement at no cost — no need to return the original.</p>
            </>
          ),
        },
        {
          heading: 'Exchanges',
          body: (
            <>
              <p>Want a different scent instead? Return your unburned candle within 5-7 days and we will exchange it for another of equal value. You cover return shipping; we cover the new shipment.</p>
            </>
          ),
        },
        {
          heading: 'Questions?',
          body: (
            <>
              <p>Email sukhadevetilottama1@gmail.com and our team will help you personally.</p>
            </>
          ),
        },
      ]}
    />
  );
}
