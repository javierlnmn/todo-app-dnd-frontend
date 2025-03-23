import axios from "axios";

import config from "@/config";

import { getStoredUserToken } from "@auth/utils/jwt";

import { TodoStatus } from "@todos/enums/todos";
import { TodoFormData } from "@todos/components/TodoForm";
import { Todo } from "@todos/types/todos";


const { API_BASE_URL } = config;

export const getTodos = async () => {

	const userJwt = getStoredUserToken();

	try {

		const response = await axios.get(`${API_BASE_URL}/todos/todos/`, {
			headers: {
				Authorization: userJwt,
			},
		});

		return response.data;

	} catch (error) {
		throw error;
	}

}


interface UpdateTodoStatusParams {
	todoId: Todo['id'];
	newStatus: keyof typeof TodoStatus;
}

export const updateTodoStatus = async ({ todoId, newStatus }: UpdateTodoStatusParams) => {
	const userJwt = getStoredUserToken();

	try {

		const response = await axios.patch(
			`${API_BASE_URL}/todos/todos/${todoId}/`,
			{
				status: newStatus,
			},
			{
				headers: {
					Authorization: userJwt,
				},
			}
		);

		return response.data;

	} catch (error) {
		console.error("Error updating todo status:", error);
		throw error;
	}
};

export const createTodo = async ({ ...todo }: TodoFormData) => {
	const userJwt = getStoredUserToken();

	try {

		const response = await axios.post(
			`${API_BASE_URL}/todos/todos/`,
			todo,
			{
				headers: {
					Authorization: userJwt,
				},
			}
		);

		return response.data;

	} catch (error) {
		console.error("Error updating todo status:", error);
		throw error;
	}
}

export const updateTodo = async ({ ...todo }: TodoFormData) => {
	const userJwt = getStoredUserToken();

	try {

		const response = await axios.put(
			`${API_BASE_URL}/todos/todos/${todo.id}/`,
			todo,
			{
				headers: {
					Authorization: userJwt,
				},
			}
		);

		return response.data;

	} catch (error) {
		console.error("Error updating todo status:", error);
		throw error;
	}
};

export const deleteTodo = async (todoId: Todo['id']) => {
	const userJwt = getStoredUserToken();

	try {

		await axios.delete(
			`${API_BASE_URL}/todos/todos/${todoId}/`,
			{
				headers: {
					Authorization: userJwt,
				},
			}
		);

		return todoId;

	} catch (error) {
		console.error("Error updating todo status:", error);
		throw error;
	}
};
