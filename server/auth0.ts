import { ManagementClient, AuthenticationClient } from "auth0";
import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

let managementClient: ManagementClient | null = null;
let authenticationClient: AuthenticationClient | null = null;

function getManagementClient(): ManagementClient {
  if (!managementClient) {
    if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
      throw new Error("Auth0 credentials not configured");
    }
    
    managementClient = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    });
  }
  return managementClient;
}

function getAuthenticationClient(): AuthenticationClient {
  if (!authenticationClient) {
    if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
      throw new Error("Auth0 credentials not configured");
    }
    
    authenticationClient = new AuthenticationClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    });
  }
  return authenticationClient;
}

export function setupAuth0Routes(app: Express) {
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
    console.log("Auth0 credentials not configured - Auth0 routes disabled");
    return;
  }

  app.post("/api/auth/auth0/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const management = getManagementClient();

      const auth0User = await management.users.create({
        connection: "Username-Password-Authentication",
        email,
        password,
        given_name: firstName || undefined,
        family_name: lastName || undefined,
        email_verified: false,
      });

      const userId = `auth0-${auth0User.data.user_id}`;
      
      await storage.upsertUser({
        id: userId,
        email: email,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: auth0User.data.picture || null,
        authProvider: "auth0",
        providerId: auth0User.data.user_id || null,
      });

      res.json({ 
        success: true, 
        message: "Account created successfully. Please log in.",
        userId: userId
      });
    } catch (error: any) {
      console.error("Auth0 registration error:", error);
      
      if (error.statusCode === 409) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      res.status(500).json({ 
        message: error.message || "Failed to create account" 
      });
    }
  });

  app.post("/api/auth/auth0/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const auth = getAuthenticationClient();

      const tokenResponse = await auth.oauth.passwordGrant({
        username: email,
        password: password,
        realm: "Username-Password-Authentication",
        audience: process.env.AUTH0_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email",
      });

      const idToken = tokenResponse.data.id_token;
      let userClaims: any = { email };
      
      if (idToken) {
        const payload = idToken.split('.')[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf-8');
        userClaims = JSON.parse(decoded);
      }

      const userId = `auth0-${userClaims.sub || email.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const user = await storage.upsertUser({
        id: userId,
        email: userClaims.email || email,
        firstName: userClaims.given_name || userClaims.nickname || null,
        lastName: userClaims.family_name || null,
        profileImageUrl: userClaims.picture || null,
        authProvider: "auth0",
        providerId: userClaims.sub || null,
      });

      (req as any).login(user, (err: Error) => {
        if (err) {
          console.error("Session login error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        const { passwordHash, ...userWithoutPassword } = user as any;
        res.json({ 
          success: true,
          user: userWithoutPassword,
          accessToken: tokenResponse.data.access_token,
          expiresIn: tokenResponse.data.expires_in,
        });
      });
    } catch (error: any) {
      console.error("Auth0 login error:", error);
      
      if (error.statusCode === 403 || error.statusCode === 401) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      res.status(500).json({ 
        message: error.message || "Failed to log in" 
      });
    }
  });

  app.get("/api/auth/auth0/status", (req: Request, res: Response) => {
    res.json({
      configured: true,
      domain: process.env.AUTH0_DOMAIN,
    });
  });
}

export function isAuth0Configured(): boolean {
  return !!(
    process.env.AUTH0_DOMAIN && 
    process.env.AUTH0_CLIENT_ID && 
    process.env.AUTH0_CLIENT_SECRET
  );
}
