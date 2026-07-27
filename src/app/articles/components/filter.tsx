"use client";

import { IconFilter } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type CategoryValue = "tecnologia" | "filosofia";
type ItemsValue = "15" | "25" | "50";
type SortByValue = "_createdAt" | "name";

const FILTER_FORM_ID = "articles-filter-form";

interface FilterFormProps extends React.ComponentProps<"form"> {
	category: CategoryValue;
	setCategory: (value: CategoryValue) => void;
	items: ItemsValue;
	setItems: (value: ItemsValue) => void;
	sortBy: SortByValue;
	setSortBy: (value: SortByValue) => void;
	handleClear: () => void;
	handleSubmit: (e: React.FormEvent) => void;
	/** No sheet as ações vivem no rodapé, então o form não as renderiza. */
	showActions?: boolean;
}

export function PostsFilter() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	const isMobile = useIsMobile();

	const [open, setOpen] = React.useState<boolean>(false);
	const [search, setSearch] = React.useState<string>(
		searchParams.get("search") || "",
	);
	const [category, setCategory] = React.useState<CategoryValue>(
		(searchParams.get("category") as CategoryValue) || "tecnologia",
	);
	const [items, setItems] = React.useState<ItemsValue>(
		(searchParams.get("items") as ItemsValue) || "15",
	);
	const [sortBy, setSortBy] = React.useState<SortByValue>(
		(searchParams.get("sortBy") as SortByValue) || "_createdAt",
	);
	const [page, setPage] = React.useState<string>(
		searchParams.get("page") || "1",
	);

	const updateURL = React.useCallback(
		(params: Record<string, string>) => {
			const newParams = new URLSearchParams(searchParams);

			Object.entries(params).forEach(([key, value]) => {
				if (value && value !== "1" && key !== "page") {
					newParams.set(key, value);
				} else if (key === "page" && value !== "1") {
					newParams.set(key, value);
				} else if (key !== "category") {
					newParams.delete(key);
				}
			});

			replace(`${pathname}?${newParams.toString()}`);
		},
		[searchParams, pathname, replace],
	);

	const handleSearchDebounced = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");

		if (term) {
			params.set("search", term);
		} else {
			params.delete("search");
		}

		replace(`${pathname}?${params.toString()}`);
	}, 300);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		handleSearchDebounced(value);
	};

	const handleClear = () => {
		setCategory("tecnologia");
		setItems("15");
		setSortBy("_createdAt");
		setPage("1");
		setSearch("");
		replace(pathname);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateURL({
			search,
			category,
			items,
			sortBy,
			page: "1",
		});
		setPage("1");
		setOpen(false);
	};

	const getCategoryLabel = (): string => {
		const labels: Record<string, string> = {
			technology: "Tecnologia",
			philosophy: "Filosofia",
		};
		return labels[category] || category;
	};

	const getSortByLabel = (): string => {
		const labels: Record<SortByValue, string> = {
			_createdAt: "Data",
			name: "Nome",
		};
		return labels[sortBy];
	};

	return (
		<div className="mb-8 w-full">
			<Input
				type="text"
				placeholder="Procurar"
				className="w-full mb-4"
				value={search}
				onChange={handleSearchChange}
			/>
			<div className="flex items-center gap-2">
				{isMobile ? (
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost">
								<IconFilter />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Filtros Avançados</SheetTitle>
								<SheetDescription>
									Selecione os filtros para carregar os posts
								</SheetDescription>
							</SheetHeader>
							<FilterForm
								id={FILTER_FORM_ID}
								className="px-4"
								showActions={false}
								category={category}
								setCategory={setCategory}
								items={items}
								setItems={setItems}
								sortBy={sortBy}
								setSortBy={setSortBy}
								handleClear={handleClear}
								handleSubmit={handleSubmit}
							/>
							<SheetFooter>
								<Button type="submit" form={FILTER_FORM_ID}>
									Aplicar Filtros
								</Button>
								<Button type="button" variant="outline" onClick={handleClear}>
									Limpar
								</Button>
								<SheetClose asChild>
									<Button variant="ghost">Cancelar</Button>
								</SheetClose>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				) : (
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant="ghost">
								<IconFilter />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="space-y-4">
								<div className="space-y-2">
									<h4 className="font-medium leading-none">
										Filtros Avançados
									</h4>
									<p className="text-sm text-muted-foreground">
										Selecione os filtros para carregar os posts
									</p>
								</div>
								<FilterForm
									category={category}
									setCategory={setCategory}
									items={items}
									setItems={setItems}
									sortBy={sortBy}
									setSortBy={setSortBy}
									handleClear={handleClear}
									handleSubmit={handleSubmit}
								/>
							</div>
						</PopoverContent>
					</Popover>
				)}

				<div className="flex flex-wrap gap-2">
					<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
						Categoria: {getCategoryLabel()}
					</span>
					<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
						Página: {page}
					</span>
					<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
						Itens: {items}
					</span>
					<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
						Ordem: {getSortByLabel()}
					</span>
				</div>
			</div>
		</div>
	);
}

function FilterForm({
	className,
	id,
	showActions = true,
	category,
	setCategory,
	items,
	setItems,
	sortBy,
	setSortBy,
	handleClear,
	handleSubmit,
}: FilterFormProps) {
	return (
		<form
			id={id}
			className={cn("grid items-start gap-4", className)}
			onSubmit={handleSubmit}
		>
			<div className="grid gap-2">
				<Label>Categoria</Label>
				<ToggleGroup
					type="single"
					variant="outline"
					value={category}
					onValueChange={setCategory}
				>
					<ToggleGroupItem value="tecnologia">Tecnologia</ToggleGroupItem>
					<ToggleGroupItem value="filosofia">Filosofia</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="grid gap-2">
				<Label>Itens</Label>
				<ToggleGroup
					type="single"
					variant="outline"
					value={items}
					onValueChange={setItems}
				>
					<ToggleGroupItem value="15">15</ToggleGroupItem>
					<ToggleGroupItem value="25">25</ToggleGroupItem>
					<ToggleGroupItem value="50">50</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="grid gap-2">
				<Label>Ordenar por</Label>
				<ToggleGroup
					type="single"
					variant="outline"
					value={sortBy}
					onValueChange={setSortBy}
				>
					<ToggleGroupItem value="_createdAt">Data</ToggleGroupItem>
					<ToggleGroupItem value="name">Nome</ToggleGroupItem>
				</ToggleGroup>
			</div>

			{showActions && (
				<div className="flex gap-2">
					<Button type="submit" className="flex-1">
						Aplicar Filtros
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleClear}
						className="flex-1"
					>
						Limpar
					</Button>
				</div>
			)}
		</form>
	);
}
