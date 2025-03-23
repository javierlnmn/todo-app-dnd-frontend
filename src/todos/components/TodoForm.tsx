import { FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import LoadingThrobberIcon from "@common/icons/LoadingThrobberIcon";

import { TodoStatus } from "@todos/enums/todos.d";
import { createTodo, updateTodo } from "@todos/services/todos";
import { getTodoStatusKey } from "@todos/utils/todos";

import { User } from "@auth/types/user";
import { getUsersList } from "@auth/services/user";


export interface TodoFormData {
	id: string;
	title: string;
	description: string;
	status: string;
	dueDate: string;
	assignedTo: User['id'];
}

interface TodoFormProps {
	todo: TodoFormData;
	onClose: () => void;
}

const TodoForm: FC<TodoFormProps> = ({ todo, onClose }) => {
	const queryClient = useQueryClient();

	// Form
	const [formData, setFormData] = useState<TodoFormData>({
		...todo,
	});

	const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	const isFormValid = (): boolean => {
		return (
			!formData.title ||
			!formData.status ||
			!formData.dueDate
		)
	}

	// Users list fetching
	const { data: usersList = [], isLoading: isLoadingUsersList, } = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: getUsersList,
		retry: false,
		refetchOnWindowFocus: false,
	});
	
	// Mutation for creating/updating todo
	const mutation = useMutation({
		mutationFn: async (data: TodoFormData) => {
			if (!todo.id) {
				return createTodo(data);
			} else {
				return updateTodo(data);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			onClose();
		},
		onError: (error) => {
			toast.error('Oops! An error occured while creating or updating a todo!', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
			throw error;
		},
	});

	const { isPending }= mutation;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	}

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-xl font-bold mb-1">{todo.id ? "Edit Todo" : "Create Todo"}</h3>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex gap-4 items-center max-sm:flex-col">
					<div className="w-full flex-2 max-lg:flex-3 max-sm:flex-1 flex flex-col items-start gap-1">
						<label htmlFor="title" className="font-bold">Title *</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							className="disabled:opacity-50 h-12 w-full p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all hover:bg-zinc-200/80 focus:bg-zinc-200/80 dark:hover:bg-zinc-600/80 dark:focus:bg-zinc-600/80"
							onChange={handleFieldChange}
							placeholder="Todo Title"
							required
						/>
					</div>
					<div className="w-full flex-1 max-lg:flex-2 max-sm:flex-1 flex flex-col items-start gap-1">
						<div className="flex items-center gap-3">
							<label htmlFor="title" className="font-bold">Assigned user</label>
							{isLoadingUsersList && <LoadingThrobberIcon className="w-4 h-4" />}
						</div>
						<select
							disabled={isLoadingUsersList}
							name="assignedTo"
							value={formData.assignedTo}
							onChange={handleFieldChange}
							className="disabled:opacity-50 h-12 w-full p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all hover:bg-zinc-200/80 focus:bg-zinc-200/80 dark:hover:bg-zinc-600/80 dark:focus:bg-zinc-600/80"
						>
							<option defaultChecked value={''}>-</option>
							{usersList.map((user, key) => (
								<option key={key} value={user.id}>
									{user.username}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex flex-col items-start gap-1">
					<label htmlFor="title" className="font-bold">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleFieldChange}
						placeholder="Todo Description"
						className="disabled:opacity-50 w-full h-32 p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all hover:bg-zinc-200/80 focus:bg-zinc-200/80 dark:hover:bg-zinc-600/80 dark:focus:bg-zinc-600/80"
					/>
				</div>


				<div className="flex gap-4 items-center max-sm:flex-col">
					<div className="w-full flex-1 flex flex-col items-start gap-1">
						<label htmlFor="title" className="font-bold">Status *</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleFieldChange}
							className="disabled:opacity-50 h-12 w-full p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all hover:bg-zinc-200/80 focus:bg-zinc-200/80 dark:hover:bg-zinc-600/80 dark:focus:bg-zinc-600/80"
						>
							{Object.values(TodoStatus).map((status) => (
								<option key={status} value={getTodoStatusKey(status as TodoStatus)}>
									{status}
								</option>
							))}
						</select>
					</div>
					<div className="w-full flex-1 flex flex-col items-start gap-1">
						<label htmlFor="title" className="font-bold">Due date *</label>
						<input
							type="date"
							name="dueDate"
							value={formData.dueDate}
							onChange={handleFieldChange}
							className="disabled:opacity-50 h-12 w-full p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all hover:bg-zinc-200/80 focus:bg-zinc-200/80 dark:hover:bg-zinc-600/80 dark:focus:bg-zinc-600/80"
						/>
					</div>
				</div>
				<p className="font-light opacity-70 text-sm">Fields marked with * are required</p>
				<div className="flex items-center justify-end gap-2">
					<button
						disabled={isFormValid()}
						onClick={handleSubmit}
						type="submit"
						className="text-zinc-100 bg-sky-600 transition-colors disabled:opacity-50 disabled:hover:bg-sky-600 hover:bg-sky-500 cursor-pointer w-full p-3 rounded-md font-bold flex justify-center"
					>
						{isPending ? (
							<LoadingThrobberIcon className="w-5 h-5 !fill-zinc-100 !text-zinc-200/60 dark:!text-zinc-300/50" />
						) : (
							todo.id ? "Update" : "Create"
						)}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-100 bg-amber-600 transition-colors disabled:opacity-50 disabled:hover:bg-amber-600 hover:bg-amber-500 cursor-pointer w-full p-3 rounded-md font-bold flex justify-center"						
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default TodoForm;
