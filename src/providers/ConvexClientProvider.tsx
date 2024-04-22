"use client"

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KE;

const convex = new ConvexReactClient(CONVEX_URL as string);

const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider publishableKey={pub_key}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
