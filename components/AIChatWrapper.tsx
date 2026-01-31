"use client";

import dynamic from "next/dynamic";

const AIChatAssistant = dynamic(() => import('@/components/AIChatAssistant'), {
    ssr: false,
    loading: () => null,
});

export default function AIChatWrapper() {
    return <AIChatAssistant />;
}
