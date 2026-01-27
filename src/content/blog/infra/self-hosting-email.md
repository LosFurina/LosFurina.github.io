---
title: Manage your own email server via Gmail and Cloudflare
description: "Auto-generated description for Manage your own email server via Gmail and Cloudflare"
pubDate: 2026-01-23
---

# Introduction

This article will guide you through the process of setting up your own email server using Gmail and Cloudflare. By following these steps, you can manage your email without relying on third-party services, ensuring greater control and privacy.

# Prerequisites
1. **Domain Name**: You need a registered domain name to set up your email server.
2. **Gmail Account**: A Gmail account to use as your email client.
3. **Cloudflare Account**: To manage your DNS settings and enhance security.

# Step 1: Set Up Your Domain in Cloudflare
1. Log in to your Cloudflare account.
2. Add your domain to Cloudflare if you haven't already.
3. Go to the **email** tab in the Cloudflare dashboard.

![Cloudflare Email Tab](https://img.liweijun.online/find/2025/6/18/27bc77d4-e124-41dd-b051-f289ad66a2e1)

4. Enable the **Email Routing** feature.
5. Add your email address (e.g., `work@yourdomain.com`) and the destination email address (e.g., your Gmail address).

![Cloudflare Email Routing](https://img.liweijun.online/find/2025/6/18/b1003b85-1271-435e-a3eb-026a8ec133fd)

6. Cloudflare will provide you with MX records.

# Step 2: Test Your Email Routing
1. Send an email to your custom domain email address (e.g., `work@yourdomain.com`).
2. Check if the email is successfully forwarded to your Gmail inbox.

# Step 3: Configure Gmail to Send Emails from Your Custom Domain
1. Open Gmail and go to **Settings**.
2. Click on the **Accounts and Import** tab.
3. Under the **Send mail as** section, click on **Add another email address**.

![Gmail Add Another Email Address](https://img.liweijun.online/find/2025/6/18/61742864-6982-41fc-9687-cd113f1df187)

4. Enter your name and the custom email address (e.g., `work@yourdomain.com`).
5. Click on **Next Step**.
6. Get an App Password from your Google Account settings if you have 2-Step Verification enabled.
7. Choose **Send through your SMTP server** and enter the following information:
   - SMTP Server: `smtp.gmail.com`
   - Port: `587`
   - Username: `work@yourdomain.com`
   - Password: Your App Password
8. Click on **Add Account**.
9. Gmail will send a verification email to your custom email address. Click the verification link in that email.

# Step 4: Test Sending Emails
1. Compose a new email in Gmail.
2. Select your custom email address in the "From" field.
3. Send the email to another address (e.g., your personal email).
4. Check if the email is received successfully.
