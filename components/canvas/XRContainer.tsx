"use client";

import { XR, createXRStore } from "@react-three/xr";
import React from "react";

// Create store outside component to be shared
const store = createXRStore();

export function XRButton() {
    return (
        <button
            onClick={() => {
                try {
                    store.enterAR().catch(e => {
                        console.error("WebXR Error:", e);
                        alert("WebXR is not supported on this device or browser.");
                    });
                } catch (e) {
                    console.error("WebXR Error:", e);
                    alert("WebXR is not supported on this device or browser.");
                }
            }}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm font-medium"
        >
            View in AR
        </button>
    );
}

export function XRWrapper({ children }: { children: React.ReactNode }) {
    return (
        <XR store={store}>
            {children}
        </XR>
    );
}

// Backward compatibility (optional, but cleaner to just use named exports now)
export default function XRContainer({ children }: { children: React.ReactNode }) {
    return (
        <XR store={store}>
            {children}
        </XR>
    );
}
