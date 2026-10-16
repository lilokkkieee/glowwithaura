/*
# Create notifications table for email delivery tracking

1. New Tables
- `email_notifications` — stores a record of every notification email attempt
  (contact inquiries, signups, orders) so the owner has a reliable backup log
  even when the email provider fails to deliver.
- `id` (uuid, primary key)
- `type` (text: 'contact' | 'signup' | 'order')
- `recipient` (text: the owner email the notification was sent to)
- `subject` (text: email subject line)
- `payload` (jsonb: the full data submitted with the request)
- `email_status` (text: 'sent' | 'failed')
- `email_error` (text, nullable: error message if email send failed)
- `created_at` (timestamp)

2. Security
- Enable RLS on `email_notifications`.
- Allow anon + authenticated INSERT only (the edge function uses the service role
  key which bypasses RLS, but this policy covers any anon-key calls).
- No SELECT/UPDATE/DELETE for anon or authenticated — this is an internal log
  table only the owner should read via the Supabase dashboard.
*/

CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  recipient text NOT NULL,
  subject text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_status text NOT NULL DEFAULT 'pending',
  email_error text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_notifications" ON email_notifications;
CREATE POLICY "anon_insert_notifications" ON email_notifications FOR INSERT
TO anon, authenticated WITH CHECK (true);
