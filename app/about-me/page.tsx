import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutMePage from "@/components/sections/AboutMePage";

export const metadata = {
    title: "About Me | Pranay Gajbhiye",
    description: "Learn more about Pranay Gajbhiye - Founder, Quant Developer, and Trading Systems Architect.",
};

export default function AboutMe() {
    return (
        <>
            <Header />
            <main id="main-content">
                <AboutMePage />
            </main>
            <Footer />
        </>
    );
}
