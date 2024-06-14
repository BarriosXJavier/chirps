"use client";

import LoadingLogo from "@/components/ui/shared/LoadingLogo";
import {
  ClerkProvider,
  useAuth,
  SignedOut,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not set"
  );
}

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider: React.FC<Props> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
