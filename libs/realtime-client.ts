"use client"

import { createRealtime } from "@upstash/realtime/client"
import type { RealtimeEvents } from "@/zod/schema"

export const { useRealtime } = createRealtime<RealtimeEvents>()