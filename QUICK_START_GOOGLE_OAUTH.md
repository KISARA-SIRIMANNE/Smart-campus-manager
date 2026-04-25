# Quick Start: Google OAuth Testing

## Prerequisites
- Node.js and npm installed
- Java 17+ and Maven installed
- MongoDB running locally on `mongodb://localhost:27017`
- A Google account for testing

## Step 1: Get Google OAuth Credentials (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/) (simpler than Google Cloud Console)
2. Click "Create a project"
3. Name it "Smart Campus" and create
4. Go to **Project Settings** (gear icon)
5. Click **Service Accounts** tab
6. Click **Generate New Private Key** and save the JSON file

OR use [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new project
2. Enable Google+ API
3. Create OAuth 2.0 Web Application credentials
4. Add authorized origins and redirect URIs (see below)

## Step 2: Configure Frontend (2 minutes)

```bash
cd frontend/frontend

# Create .env file with your Google Client ID
cat > .env << EOF
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_API_BASE_URL=http://localhost:8081/api
EOF

# Install if not already done
npm install

# Start dev server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Step 3: Configure Backend (2 minutes)

```bash
cd backend/backend

# Update application.properties
nano src/main/resources/application.properties
```

Add or update these lines:
```properties
google.oauth.client-id=YOUR_GOOGLE_CLIENT_ID
google.oauth.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

```bash
# Start backend
mvn spring-boot:run
```

Backend will run on: `http://localhost:8081`

## Step 4: Configure Google OAuth (10 minutes)

### Via Firebase Console (Easiest):

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google**
3. Select your support email
4. Save

### Via Google Cloud Console:

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Name: "Smart Campus Local"
5. **Add Authorized Origins:**
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. **Add Authorized Redirect URIs:**
   ```
   http://localhost:5173
   http://localhost:8081/api/auth/google-login
   ```
7. Copy the Client ID and Secret

## Step 5: Test Login (2 minutes)

1. Open `http://localhost:5173` in your browser
2. Click the Google login button
3. Sign in with your Google account
4. You should be redirected to the user dashboard
5. Check that your profile picture appears in the navbar

## Step 6: Test Admin Login (5 minutes)

To make your account an admin:

### Option A: MongoDB Compass GUI
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Find `smart_campus.users` collection
4. Find your user by email
5. Edit the document and change `role` from `"USER"` to `"ADMIN"`
6. Save
7. Log out and log back in
8. You should now see the admin dashboard

### Option B: MongoDB CLI
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017

# Switch to database
use smart_campus

# Update your user role
db.users.updateOne(
  { email: "your.email@gmail.com" },
  { $set: { role: "ADMIN" } }
)

# Verify
db.users.findOne({ email: "your.email@gmail.com" })
```

## Troubleshooting

### "Google login button not showing"
- Check browser console for errors
- Verify VITE_GOOGLE_CLIENT_ID is set correctly
- Make sure `@react-oauth/google` is installed: `npm list @react-oauth/google`

### "Invalid Google token" Error
- Verify `google.oauth.client-id` in backend
- Check that Client ID matches between frontend and backend
- Make sure token hasn't expired (tokens expire in 1 hour)

### "Redirect URI mismatch"
- Check Google OAuth settings
- Add both these to **Authorized Redirect URIs**:
  - `http://localhost:5173`
  - `http://localhost:8081/api/auth/google-login`

### "User not found in database"
- This is normal on first login
- Backend automatically creates the user
- Check MongoDB: `db.users.find({ email: "your.email@gmail.com" })`

### "Profile picture not loading"
- Google profile pictures are loaded from external URL
- This is expected behavior
- Check network tab in browser DevTools

## File Checklist

- ✅ Frontend `.env` created with VITE_GOOGLE_CLIENT_ID
- ✅ Backend `application.properties` updated with Google credentials
- ✅ `frontend/frontend/package.json` has `@react-oauth/google`
- ✅ `backend/backend/pom.xml` has Google OAuth dependencies
- ✅ `GoogleLoginButton.jsx` component created
- ✅ `LoginPage.jsx` updated with Google button
- ✅ `main.jsx` wrapped with GoogleOAuthProvider
- ✅ `GoogleOAuthService.java` created
- ✅ `AuthController.java` has `/google-login` endpoint

## Testing Checklist

- [ ] Frontend runs on http://localhost:5173
- [ ] Backend runs on http://localhost:8081
- [ ] Google login button appears on login page
- [ ] Can click Google button without errors
- [ ] Google consent screen appears
- [ ] After approval, redirected to dashboard
- [ ] Profile picture visible in navbar
- [ ] Can log out and log back in
- [ ] Admin user redirects to admin dashboard
- [ ] Regular user redirects to user dashboard

## Next Steps

1. **Production Deployment**
   - Follow `GOOGLE_OAUTH_SETUP.md` Step 8 for production setup
   - Update authorized origins and redirect URIs

2. **Enhanced Features**
   - Add GitHub OAuth
   - Implement email verification
   - Create admin management panel

3. **Security Hardening**
   - Add HTTPS enforcement
   - Implement environment-specific configs
   - Add request rate limiting

## Command Reference

```bash
# Frontend
cd frontend/frontend
npm install
npm run dev                    # Development server
npm run build                  # Production build

# Backend
cd backend/backend
mvn clean install
mvn spring-boot:run           # Start server
mvn test                       # Run tests

# MongoDB
mongosh mongodb://localhost:27017
use smart_campus
db.users.find()               # See all users
```

## Support Resources

- **Full Setup Guide**: See `GOOGLE_OAUTH_SETUP.md`
- **Implementation Details**: See `GOOGLE_OAUTH_IMPLEMENTATION.md`
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Firebase Auth**: https://firebase.google.com/docs/auth

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank Google button | Check VITE_GOOGLE_CLIENT_ID in .env |
| "Invalid token" on backend | Verify google.oauth.client-id matches frontend |
| Redirect URI mismatch | Add URIs to Google OAuth settings |
| User not created | Check MongoDB connection and firewall |
| Profile picture not loading | Normal behavior - served by Google |
| Can't switch to admin | Update `role` field to "ADMIN" in database |

## Time Breakdown

- Google credentials setup: 10 min
- Frontend configuration: 2 min
- Backend configuration: 2 min
- Testing: 5 min
- **Total: ~20 minutes**

That's it! You now have Google OAuth authentication working locally! 🎉
