import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, } from "react-toastify";

import LoadingThrobber from "@common/components/LoadingThrobber";
import PlusIcon from "@common/icons/PlusIcon";
import ModalWindow from "@common/components/ModalWindow";

import { Todo, Comment } from "@todos/types/todos.d";
import { TodoStatus, } from "@todos/enums/todos.d";
import TodoStatusBadge from "@todos/components/TodoStatusBadge";
import TodoKanbanItem from "@todos/components/TodoKanbanItem";
import TodoForm, { TodoFormData } from "@todos/components/TodoForm";
import TodoComments from "@todos/components/TodoComments";
import { deleteTodo, getTodos, updateTodoStatus } from "@todos/services/todos";
import { emptyTodoData, emptyTodoFormData, getTodoStatusKey } from "@todos/utils/todos";
import TodoDetail from "@todos/components/TodoDetail";


const TodoKanban = () => {
    const queryClient = useQueryClient();

	// Todos fetchign
	const { data: fetchedTodos = [], isPending, isError } = useQuery<Todo[]>({
		queryKey: ["todos"],
		queryFn: getTodos,
		retry: false,
		refetchOnWindowFocus: false,
	});

	// Todos state managing
	const [todos, setTodos] = useState<Todo[]>(fetchedTodos);
	useEffect(() => {
		if (!isPending && fetchedTodos) {
			setTodos(fetchedTodos);
		} else if (isError) {
			toast.error('Oops! An error occured while fetching todos', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
		}
	}, [fetchedTodos, isPending]);


	// Todos status updating with mutation
	const todoStatusMutation = useMutation({
		mutationFn: updateTodoStatus,
		onSuccess: (updatedTodo) => {
			setTodos((prevTodos) =>
				prevTodos.map((todo) =>
					todo.id === updatedTodo.id ? updatedTodo : todo
				)
			);
		},
		onError: (error) => {
			toast.error('Oops! An error occured while updating the status of the todo', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
			throw error;
		},
	});

	const handleUpdateTodoAsync = (todoId: Todo['id'], status: TodoStatus) => {
		const draggedTodoStatusKey = getTodoStatusKey(status as TodoStatus);
		if (draggedTodoStatusKey) {
			todoStatusMutation.mutateAsync({ todoId, newStatus: draggedTodoStatusKey as "PENDING" | "IN_PROGRESS" | "COMPLETED" });
		}
	}

	// Todo form and comments displaying
	const [displayForm, setDisplayForm] = useState(false);
	const [formTodo, setFormTodo] = useState<TodoFormData>(emptyTodoFormData);
	const [todoComments, setTodoComments] = useState<Comment[]>([]);

	const handleCreateTodoForm = (todoStatus: TodoStatus) => {
		setFormTodo({
			...emptyTodoFormData,
			status: getTodoStatusKey(todoStatus) || 'PENDING',
		});
		setDisplayForm(true);
	}

	const handleEditTodoForm = (todo: Todo) => {
		setFormTodo({
			...todo,
			assignedTo: todo.assignedTo?.id ?? '',
			status: getTodoStatusKey(todo.status) || todo.status.toUpperCase().replace(' ', '_') 
		});
		setTodoComments(todo.comments);
		setDisplayForm(true);
	}

	const handleCloseTodoForm = () => {
		setDisplayForm(false);
		setFormTodo(emptyTodoFormData);
		setTodoComments([]);
	}

	// Todo deleting
	const todoDeleteMutation = useMutation({
		mutationFn: deleteTodo,
		onSuccess: (todoId: Todo['id']) => {
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            toast.success('Todo deleted successfully!', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
        },
        onError: () => {
            toast.error('Oops! An error occured while deleting a todo!', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
        }
    });

	const handleDeleteTodo = (todoId: Todo['id']) => {
		todoDeleteMutation.mutate(todoId);
	}

	// Todo viewing
	const [displayViewTodo, setDisplayViewTodo] = useState(false);
	const [viewingTodo, setViewingTodo] = useState<Todo>(emptyTodoData);

	const handleViewTodo = (todo: Todo) => {
		setViewingTodo(todo);
		setDisplayViewTodo(true);
	}

	const handleCloseViewTodo = () => {
		setViewingTodo(emptyTodoData);
		setDisplayViewTodo(false);
	}

	// On drag end handling
	const onDragEnd = async (result: any) => {
		const { destination, draggableId } = result;
		const todo = todos.find(todo => todo.id === draggableId);

		if (todo?.status !== destination.droppableId) {
			handleUpdateTodoAsync(draggableId, destination.droppableId);
		}

		if (!destination || !todo) return;

		const updatedTodos = [...todos];
		const draggedTodoIndex = updatedTodos.findIndex(todo => todo.id === draggableId);
		
		if (draggedTodoIndex === -1) return;

		const draggedTodo = updatedTodos.splice(draggedTodoIndex, 1)[0];
		draggedTodo.status = destination.droppableId as TodoStatus;

		const destinationTodos = updatedTodos.filter(
			(todo) => todo.status === draggedTodo.status
		);
		destinationTodos.splice(destination.index, 0, draggedTodo);

		const statusOrder = [TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.COMPLETED];
		const sortedTodos: Todo[] = [];

		statusOrder.forEach((status) => {
			if (status === draggedTodo.status) {
				sortedTodos.push(...destinationTodos);
			} else {
				sortedTodos.push(...updatedTodos.filter((todo) => todo.status === status));
			}
		});

		setTodos(sortedTodos);
	};

	if (isPending) return <LoadingThrobber className="h-full w-full" />;

	return (
		<div className="w-full bg-zinc-100 dark:bg-zinc-900 p-6">
			<h1 className="font-bold text-4xl mb-6">Todos</h1>
			<div className="grid gap-6 grid-cols-3 max-xl:grid-cols-2 max-lg:grid-cols-1 ">
				<DragDropContext onDragEnd={onDragEnd}>
					{Object.values(TodoStatus).map((status) => (
						<div
							key={status}
							className={`p-4 rounded-lg min-h-[200px] flex flex-col gap-3
								${status === TodoStatus.COMPLETED ? "bg-emerald-500/10 dark:bg-emerald-700/10" : ""}
								${status === TodoStatus.IN_PROGRESS ? "bg-sky-500/10 dark:bg-sky-700/10" : ""}
								${status === TodoStatus.PENDING ? "bg-purple-500/10 dark:bg-purple-700/10 lg:col-span-2 xl:col-span-1" : ""}
							`}
						>
							<div className="flex items-center justify-between">
								<TodoStatusBadge todoStatus={status} />
								<button onClick={() => handleCreateTodoForm(status)}>
									<PlusIcon className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
								</button>
							</div>

							<Droppable droppableId={status}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="flex flex-col min-h-[150px]"
									>
										{todos.filter((todo) => todo.status.toLowerCase() === status.toLocaleLowerCase()).map((todo, index) => (
											<TodoKanbanItem
												key={todo.id}
												index={index}
												todo={todo}
												handleEditTodo={handleEditTodoForm}
												handleDeleteTodo={handleDeleteTodo}
												handleViewTodo={handleViewTodo}
											/>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</DragDropContext>
			</div>
			<ModalWindow onClose={handleCloseTodoForm} contentStyle={`max-w-[900px] max-md:max-h-[90vh] max-h-[75vh] overflow-auto relative`} displayed={displayForm} closeable={true}>
				<div className="flex flex-col gap-4">
					<TodoForm onClose={handleCloseTodoForm} todo={formTodo} />
					{formTodo.id && (
						<>
							<span className='w-full h-[1px] bg-zinc-500 opacity-50'></span>
							<TodoComments todoId={formTodo.id} comments={todoComments} />
						</>
					)}
				</div>
			</ModalWindow>
			<ModalWindow onClose={handleCloseViewTodo} contentStyle={`max-w-[900px] max-md:max-h-[90vh] max-h-[75vh] overflow-auto relative`} displayed={displayViewTodo} closeable={true}>
				<div className="flex flex-col gap-4">
					<TodoDetail todo={viewingTodo} />
					<span className='w-full h-[1px] bg-zinc-500 opacity-50'></span>
					<TodoComments todoId={viewingTodo.id} comments={viewingTodo.comments} />
				</div>
			</ModalWindow>
		</div>
	);
};

export default TodoKanban;
