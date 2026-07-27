import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import projectsData from "@/utils/projects.json";

interface Project {
	name: string;
	image: string;
	description: string;
	technologies: string[];
	link: string;
	status: "completed" | "in progress";
	is_favorite: boolean;
	order: number;
}

export function ProjectsSection() {
	const featuredProjects = (projectsData as Project[])
		.filter((project) => project.is_favorite)
		.sort((a, b) => a.order - b.order)
		.slice(0, 4);

	return (
		<div
			id="projects"
			className="relative mx-auto w-full max-w-3xl px-4 pt-4 pb-16 sm:px-6 lg:px-8"
		>
			<div className="mb-5 flex items-center justify-between">
				<h2 className="font-medium text-gray-800 dark:text-neutral-200">
					Projetos
				</h2>
				<Link
					href="/projects"
					className="inline-flex items-center gap-x-1 text-sm text-gray-600 transition-colors hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
				>
					Ver todos
					<IconArrowRight />
				</Link>
			</div>
			{featuredProjects.length === 0 ? (
				<p className="text-sm text-gray-500 dark:text-neutral-500">
					Nenhum projeto encontrado.
				</p>
			) : (
				<div className="space-y-6">
					{featuredProjects.map((project) => (
						<article key={project.name} className="group">
							<a
								href={project.link ?? "#"}
								className="block"
								target={project.link ? "_blank" : undefined}
								rel={project.link ? "noopener noreferrer" : undefined}
							>
								<div className="flex gap-4">
									<div className="shrink-0">
										<img
											className="h-40 w-40 rounded-lg bg-gray-100 object-cover dark:bg-neutral-800"
											width={160}
											height={160}
											src={project.image ?? "/images/projects/laravel.webp"}
											alt={project.name}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-2 flex items-center gap-2">
											<span className="text-xs text-gray-500 dark:text-neutral-500">
												{project.status === "completed"
													? "Concluído"
													: "Em andamento"}
											</span>
										</div>
										<h3 className="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-400">
											{project.name}
										</h3>
										<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-neutral-400">
											{project.description}
										</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{project.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
												>
													{tech}
												</span>
											))}
										</div>
									</div>
								</div>
							</a>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
