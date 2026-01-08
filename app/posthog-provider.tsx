'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export default function PostHogProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    console.log('POSTHOG KEY:', process.env.NEXT_PUBLIC_POSTHOG_KEY)
    console.log('POSTHOG HOST:', process.env.NEXT_PUBLIC_POSTHOG_HOST)

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
