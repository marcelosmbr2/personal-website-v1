import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { performRequest } from "@/lib/datocms";
import "dayjs/locale/pt-br";

interface Post {
	id: string;
	name: string;
	description: string;
	category: string;
	tags: string;
	externalLink?: string;
	image: { url: string };
	_createdAt: string;
	_updatedAt: string;
}

const QUERY = `
  query {
    allPosts(first: 4, orderBy: _createdAt_DESC, filter: {
      isPublished: { eq: true }
      favorite: { eq: true }
    }) {
      category
      description
      id
      name
      tags
      externalLink
      image {
        url
      }
      _createdAt
      _updatedAt
    }
  }
`;

export async function ArticlesSection() {
	const {
		data: { allPosts },
	} = await performRequest({ query: QUERY });

	function formatDate(dateString: string): string {
		return dayjs(dateString).locale("pt-br").format("DD MMMM YYYY");
	}

	function formatLink(postId: string, externalLink?: string) {
		if (externalLink) return externalLink;
		return "/articles/" + postId;
	}

	return (
		<div
			id="blog"
			className="relative mx-auto w-full max-w-3xl px-4 pt-4 pb-16 sm:px-6 lg:px-8"
		>
			<div className="mb-5 flex items-center justify-between">
				<h2 className="font-medium text-gray-800 dark:text-neutral-200">
					Artigos
				</h2>
				<Link
					href="/articles"
					className="inline-flex items-center gap-x-1 text-sm text-gray-600 transition-colors hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
				>
					Ver todos
					<IconArrowRight />
				</Link>
			</div>
			<div className="space-y-6">
				{allPosts.map((post: Post) => (
					<article key={post.id} className="group">
						<Link
							href={formatLink(post.id, post.externalLink)}
							target={post.externalLink ? "_blank" : "_self"}
							className="block"
						>
							<div className="flex gap-4">
								<div className="shrink-0">
									<Image
										className="h-40 w-40 rounded-lg bg-gray-100 object-cover dark:bg-neutral-800"
										src={post.image.url}
										alt="OKRs Guide"
										width={160}
										height={160}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<div className="mb-2 flex items-center gap-2">
										<time className="text-xs text-gray-500 dark:text-neutral-500">
											{formatDate(post._createdAt)}
										</time>
									</div>
									<h3 className="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-400">
										{post.name}
									</h3>
									<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-neutral-400">
										{post.description}
									</p>
								</div>
							</div>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}
