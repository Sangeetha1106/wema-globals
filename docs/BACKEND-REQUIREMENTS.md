# Backend requirements (not in this front-end zip) — from the client document, pages 6, 16, 17, 19
- Every form: required-field validation, privacy/consent notice, secure upload, success screen, **unique reference number**.
- Emails: acknowledgement to the applicant + notification to the right WEMA administrator; never expose other applicants’ emails. Templates are in `email-templates/`.
- Files (project proposals, identity/supporting documents) stored privately; only authorized reviewers can open them.
- Directory: application is **not** public on submit. Admin workflow: Submitted → Under Review → More Information Required → Approved for Publication / Declined → Published; also Correction Requested, Removal Requested. Publish only fields the applicant consented to show.
- Payments: supported payment provider, confirmed by provider webhook; bank transfers verified manually. Membership USD $199 per year; auto-renewal off unless separately approved. Store orders are separate from membership.
- Statuses kept separate: application (Draft, Submitted, Under Review, More Information Required, Approved, Declined, Withdrawn), payment (Not Required, Pending, Successful, Failed, Cancelled, Refunded), membership (Not a Member, Pending Payment, Active, Expired, Suspended).
- Role-based access (member, applicant, reviewer, administrator) with an audit log. No internal admin notes shown to applicants.
