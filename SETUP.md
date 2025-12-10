# Email Template Generator - Setup Guide

## Overview
This application allows team members to generate personalized email signatures using a standardized template. All submissions are stored in Supabase and can be viewed through the admin portal.

## Features
- **User Form**: Dynamic form for team members to input their details
- **Live Preview**: Real-time preview of the email signature
- **HTML Generation**: Generates copy-paste ready HTML code
- **Admin Portal**: Secure login to view all submissions
- **Data Storage**: All submissions stored in Supabase database

## Setup Instructions

### 1. Database Setup
The database has been automatically configured with the following tables:
- `email_signatures` - Stores all generated signatures
- `admin_users` - Stores admin credentials

### 2. Create Admin User in Supabase Dashboard

To create an admin user for logging into the admin portal:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** > **Users** in the left sidebar
4. Click **Add User** (or **Invite User**)
5. Enter:
   - Email: `admin@itfgroup.com`
   - Password: `admin123` (or your preferred secure password)
   - Auto Confirm User: **Yes** (check this box)
6. Click **Create User**

### 3. Access the Application

**Main Application (User Form)**
- URL: `http://localhost:3000` (or your deployed URL)
- Team members fill in their details
- Generate and copy the HTML signature
- No login required

**Admin Portal**
- URL: `http://localhost:3000/admin`
- Login with your admin credentials
- View all submissions
- Copy HTML code for any signature

### 4. Using the Generated Signatures

After generating a signature:
1. Click the "Copy" button in the HTML Code tab
2. Open your email client (Gmail, Outlook, etc.)
3. Go to Settings > Signature
4. Paste the HTML code
5. Save your signature

## Dynamic Fields

The following fields can be customized by each user:

1. **Full Name** - Displayed in red at the top
2. **Job Title** - Position/role
3. **LinkedIn URL** (optional) - Social media link
4. **Facebook URL** (optional) - Social media link
5. **Phone Number Display** - Formatted phone number (e.g., "(877) 477-9677 ext. 116")
6. **Phone Number (tel: format)** - Clickable format (e.g., "tel:+18774779677,,116")
7. **Address** - Physical address
8. **Website URL** - Full website URL with protocol
9. **Website Display** - User-friendly display (e.g., "www.itfgroup.com")
10. **Email Address** - User's email

All other elements (logos, banners, certifications) remain consistent across all signatures.

## Admin Portal Features

- **Dashboard Statistics**: View total submissions and latest activity
- **Submissions Table**: Sortable list of all generated signatures
- **Detail View**: Click "View" to see full details of any submission
- **HTML Export**: Copy HTML code for any signature
- **Secure Access**: Password-protected admin area

## Security Notes

- Email signature submissions are publicly writable (no auth required)
- Admin portal requires authentication
- RLS (Row Level Security) policies are enabled
- Change the default admin password after first login
- Consider adding additional admins through Supabase Dashboard

## Adding More Templates (Future)

The application is designed to support multiple templates. To add new templates:

1. Create new template function in `/lib/email-template.ts`
2. Add template selection UI to the main form
3. Update the database schema if needed
4. Deploy changes

## Troubleshooting

**Issue**: Can't login to admin portal
- Solution: Ensure you created the admin user in Supabase Auth Dashboard
- Check that the email/password are correct
- Verify your Supabase credentials in `.env` file

**Issue**: Signatures not saving
- Solution: Check browser console for errors
- Verify Supabase connection
- Ensure RLS policies are correctly set

**Issue**: Preview not showing
- Solution: Fill in all required fields
- Click "Preview" or "Generate Signature" button
- Check browser console for errors

## Support

For technical support or questions about adding new templates, contact your development team.
