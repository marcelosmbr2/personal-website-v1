import experiencesData from "@/utils/experiences.json";

interface Experience {
	title: string;
	company: string;
	period: string;
	icon: string;
	icon_type: "upload" | "devicon";
	description: string;
	technologies: string[];
	order: number;
}

export function ExperiencesSection() {
	return (
		<div
			id="experiencia"
			className="relative mx-auto w-full max-w-3xl px-4 pt-4 pb-16 sm:px-6 lg:px-8"
		>
			<h2 className="mb-5 font-medium text-gray-800 dark:text-neutral-200">
				Experiência
			</h2>
			<div>
				{experiencesData.map((experience) => (
					<div
						key={`${experience.company}-${experience.period}`}
						className="group relative flex gap-x-5"
					>
						<div className="relative after:absolute after:inset-s-3 after:top-8 after:bottom-2 after:w-px after:translate-x-[-0.5px] after:bg-gray-200 group-last:after:hidden dark:after:bg-neutral-700">
							<div className="relative z-10 flex size-6 items-center justify-center">
								<img
									src={experience.icon}
									alt={experience.company}
									className="size-6 shrink-0"
								/>
							</div>
						</div>
						<div className="grow pb-8 group-last:pb-0">
							<h3 className="mb-1 text-xs text-gray-600 dark:text-neutral-400">
								{experience.period}
							</h3>
							<p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
								{experience.title} - {experience.company}
							</p>
							<p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
								{experience.description}
							</p>
							{experience.technologies &&
								experience.technologies.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2">
										{experience.technologies.map((tech, techIndex) => (
											<span
												key={techIndex}
												className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
											>
												{tech}
											</span>
										))}
									</div>
								)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
