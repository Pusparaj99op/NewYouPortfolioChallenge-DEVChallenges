"use client";

import dynamic from "next/dynamic";
import { LottieComponentProps } from "lottie-react";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieIconsProps extends LottieComponentProps {
    animationData: any;
    className?: string;
}

export default function LottieIcons({ animationData, className, ...props }: LottieIconsProps) {
    return (
        <div className={className}>
            <Lottie animationData={animationData} {...props} />
        </div>
    );
}
