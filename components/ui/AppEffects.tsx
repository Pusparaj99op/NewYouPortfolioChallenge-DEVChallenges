"use client";

import dynamic from "next/dynamic";

const GlassCursor = dynamic(() => import("@/components/ui/GlassCursor"), {
    ssr: false,
});

const FluidBackground = dynamic(() => import("@/components/ui/FluidBackground"), {
    ssr: false,
});

export default function AppEffects() {
    return (
        <>
            <GlassCursor />
            {/* <FluidBackground /> */}
        </>
    );
}
