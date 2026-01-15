'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

let isPosthogInitialized = false;

export default function PostHogProviderWrapper({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    if (isPosthogInitialized) return;
    
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!posthogKey) {
      console.warn('NEXT_PUBLIC_POSTHOG_KEY is not defined');
      return;
    }
    
    posthog.init(posthogKey, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: 'history_change',
    });
    
    isPosthogInitialized = true;
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
