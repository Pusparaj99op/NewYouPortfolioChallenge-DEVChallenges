import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/app/lib/projectsData';
import ProjectHero from '@/components/sections/ProjectHero';
import ProjectDetails from '@/components/sections/ProjectDetails';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllProjectSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    return {
        title: `${project.title} | Portfolio`,
        description: project.shortDescription,
        openGraph: {
            title: project.title,
            description: project.shortDescription,
            type: 'website',
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <ProjectHero
                projectId={project.id}
                title={project.title}
                category={project.category}
                shortDescription={project.shortDescription}
                colorScheme={project.colorScheme}
                gradient={project.gradient}
            />

            {/* Details Section */}
            <ProjectDetails
                fullDescription={project.fullDescription}
                features={project.features}
                tech={project.tech}
                architecture={project.architecture}
                challenges={project.challenges}
                outcomes={project.outcomes}
                timeline={project.timeline}
                status={project.status}
                colorScheme={project.colorScheme}
            />

            {/* CTA Section */}
            <section className="relative py-24 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background Gradient */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: `linear-gradient(135deg, ${project.colorScheme.primary}, ${project.colorScheme.secondary}, ${project.colorScheme.accent})`
                            }}
                        />

                        <div className="relative p-12 md:p-16 text-center border border-white/10 backdrop-blur-sm">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                Interested in this project?
                            </h2>
                            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                                View the source code on GitHub or explore more projects in my portfolio.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-white/10"
                                >
                                    View on GitHub
                                    <ExternalLink className="w-5 h-5" />
                                </a>

                                <Link
                                    href="/#projects"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                                >
                                    More Projects
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
