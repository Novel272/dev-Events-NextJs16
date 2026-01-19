'use client'

import PostHogProviderWrapper from "./posthog-provider"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
}