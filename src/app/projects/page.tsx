import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";

import allProjects from "@/utils/projects.json";
import { ProjectsFilter } from "./components/filter";

interface Project {
	name: string;
	image: string;
	description: string;
	technologies: string[];
	link: string;
	status: string;
	is_favorite: boolean;
	order: number;
}

interface SearchParams {
	search?: string;
	status?: "completed" | "in-progress";
	page?: string;
}

export default async function ArticlesPage(props: {
	searchParams?: Promise<SearchParams>;
}) {
	const searchParams = await props.searchParams;
	const search = searchParams?.search || "";
	const status = searchParams?.status || "completed";
	const term = search.trim().toLowerCase();

	const displayedProjects = allProjects.filter((project: Project) => {
		if (project.status.toLowerCase() !== status.toLowerCase()) return false;
		if (!term) return true;

		return (
			project.name.toLowerCase().includes(term) ||
			project.technologies.some((tech) => tech.toLowerCase().includes(term))
		);
	});

	return (
		<>
			<Head>
				<title>Welcome</title>
				<link rel="preconnect" href="https://rsms.me/" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
			</Head>
			<div className="w-full max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 mb-8">
				<div className="flex justify-between items-center">
					<h2 className="my-4 text-2xl font-semibold text-pretty">Projetos</h2>
					<Button variant="ghost">
						<Link href="/">Voltar</Link>
					</Button>
				</div>
				<ProjectsFilter />
				<div className="space-y-6">
					{displayedProjects.map((project: Project) => (
						<article key={project.name} className="group">
							<a href={project.link} target="_blank" className="block">
								<div className="flex gap-4">
									<div className="shrink-0">
										<Image
											className="w-40 h-40 object-cover rounded-lg bg-gray-100 dark:bg-neutral-800"
											src={project.image}
											alt={project.name}
											width={160}
											height={160}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-sm text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
											{project.name}
										</h3>
										<p className="mt-1 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
											{project.description}
										</p>
									</div>
								</div>
							</a>
						</article>
					))}
				</div>
			</div>
		</>
	);
}
