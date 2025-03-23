import { FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import LoadingThrobberIcon from "@common/icons/LoadingThrobberIcon";

import { TodoStatus } from "@todos/enums/todos.d";
import { createTodo, updateTodo } from "@todos/services/todos";
import { getTodoStatusKey } from "@todos/utils/todos";

import { User } from "@auth/types/user";
import { getUsersList } from "@auth/services/user";
import InputField from "@/common/components/Forms/InputField";
import SelectField from "@/common/components/Forms/SelectField";


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
						<InputField
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleFieldChange}
							placeholder="Todo Title"
							required={true}
							error={false}
						/>
					</div>
					<div className="w-full flex-1 max-lg:flex-2 max-sm:flex-1 flex flex-col items-start gap-1">
						<div className="flex items-center gap-3">
							<label htmlFor="assignedTo" className="font-bold">Assigned user</label>
							{isLoadingUsersList && <LoadingThrobberIcon className="w-4 h-4" />}
						</div>
						<SelectField
							disabled={isLoadingUsersList}
							name="assignedTo"
							id="assignedTo"
							value={formData.assignedTo}
							onChange={handleFieldChange}
							placeholder="Not assigned"
							allowEmpty={true}
							options={usersList.map((user) => ({ label: user.username, value: user.id }))}
						/>
					</div>
				</div>

				<div className="flex flex-col items-start gap-1">
					<label htmlFor="description" className="font-bold">Description</label>
					<InputField
						isTextArea={true}
						name="description"
						id="description"
						value={formData.description}
						onChange={handleFieldChange}
						placeholder="Todo Description"
						type="text"
					/>
				</div>

				<div className="flex gap-4 items-center max-sm:flex-col">
					<div className="w-full flex-1 flex flex-col items-start gap-1">
						<label htmlFor="status" className="font-bold">Status *</label>
						<SelectField
							disabled={isLoadingUsersList}
							name="status"
							id="status"
							value={formData.status}
							onChange={handleFieldChange}
							options={Object.values(TodoStatus).map((status) => (
								{ label: status.toString(), value: getTodoStatusKey(status as TodoStatus) || '' }
							))}
						/>
					</div>
					<div className="w-full flex-1 flex flex-col items-start gap-1">
						<label htmlFor="dueDate" className="font-bold">Due date *</label>
						<InputField
							type="date"
							id="dueDate"
							name="dueDate"
							value={formData.dueDate}
							onChange={handleFieldChange}
							placeholder="Due Date"
							required={true}
							error={false}
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
