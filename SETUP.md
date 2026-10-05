# Arshhi website: admin panel on Vercel

Everything runs on Vercel. No Firebase or other account is needed.

Files to deploy (keep this folder structure):
```
index.html
admin.html
vercel.json
api/_lib.js
api/content.js
api/login.js
api/save.js
api/password.js
```

## 1. Put the files on Vercel
Upload the whole folder to the Git repo your Vercel project uses (the `api` folder must be included),
or run `vercel --prod` from the folder. In Vercel > your project > Settings > Domains, add arshhi.com.

## 2. Add a free database (stores your edits and password)
1. Vercel dashboard > your project > Storage (or Marketplace) > Upstash > Redis (free plan) > Create.
2. Connect it to your project. Vercel adds KV_REST_API_URL and KV_REST_API_TOKEN automatically.

## 3. Add 3 settings
Project > Settings > Environment Variables (add to Production, Preview and Development):

| Name | Value |
|---|---|
| ADMIN_USER | admin |
| ADMIN_PASSWORD | your first password (at least 8 characters) |
| SESSION_SECRET | any long random text, for example 40+ random letters and numbers |

Then Deployments > Redeploy (settings only apply to new deployments).

## 4. Open the admin panel
Go to https://arshhi.com/admin (this is the only way in; the public site has no link to it).
- Username: admin
- Password: the ADMIN_PASSWORD you set

## 5. Edit the website
Change text, services, phone, logo or feedback, then press "Save and publish".
Visitors see the change after reloading arshhi.com (within about 10 seconds).

## 6. Change the password
Log in > "Change password" > enter the current password and the new one twice.
The new password is stored (scrambled) in the database and replaces ADMIN_PASSWORD from then on.

## Forgot the password
1. Vercel > Storage > your Redis database > Data Browser (or CLI tab).
2. Delete the key `arshhi:pw`.
3. Log in with the ADMIN_PASSWORD from step 3. To change that value too, edit it in Environment Variables and redeploy.

## Security notes
- Only someone with the password can publish. The server checks every save.
- After 8 wrong attempts, login is blocked for 15 minutes from that connection.
- Sessions last 12 hours. Changing SESSION_SECRET logs everyone out.
- Do not share or commit your environment variable values.
