import { createContext, useState, useContext } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { v4 as uuid } from 'uuid'; // Provide an id unique

const TodoContext = createContext();

/* Bridge to provider info */
function TodoProvider({ children }) {
	/* States */
	const [searchValue, setSearch] = useState('');
	const [taskValue, setTaskValue] = useState('');
	const [taskEdit, setTaskEdit] = useState('');
	const [modalValue, setModal] = useState(false);
	const [editTask, setEditTask] = useState(false);

	/* State con Names */
	const {
		item: todos,
		saveItem: setTodos,
		loading,
		error,
	} = useLocalStorage('TODO_V1', []);

	/* Complete todos checkbox */
	const completedTodos = todos.filter(todo => todo.completed).length;
	const totalTodos = todos.length;

	/*  SearchedTodos */
	let searchedTodos = [];

	/* Passs todos to searchValues */
	if (!searchValue.length >= 1) {
		searchedTodos = todos;
	} else {
		searchedTodos = todos.filter(todo => {
			const todoText = todo.task.toLowerCase();
			const searchText = searchValue.toLocaleLowerCase();
			return todoText.includes(searchText);
		});
	}

	/* Add ToDo */
	const onClickTaskAdd = task => {
		const isOnly = todos.some(
			item => item.task.toLowerCase() === task.toLowerCase()
		);
		if (isOnly) {
			return alert('This task exist');
		}
		const newTodos = [...todos];
		newTodos.push({
			id: uuid(),
			task,
			completed: false,
		});
		setTodos(newTodos);
		setModal(false);
		setTaskValue('');
	};

	/* Edit Todo */

	const onClickEdit = id => {
		setModal(true);
		setEditTask(true);
		const newTodo = todos.filter(todo => todo.id === id);
		setTaskValue(newTodo[0].task);
		setTaskEdit(newTodo[0]);
	};

	const onClickTaskUpdate = () => {
		// New Task
		const newTodos = [...todos];
		const todo = newTodos.find(todo => todo.id === taskEdit.id);
		todo.task = taskValue;
		setTodos(newTodos);
		setModal(false);
		setEditTask(false);
	};

	/* Toogle checkbox */
	const onClickCompleteTodo = id => {
		const newTodos = [...todos];
		const todo = newTodos.find(todo => todo.id === id);
		todo.completed = !todo.completed;
		setTodos(newTodos);
	};

	/* Clear all tasks */
	const onClickDeleteAllTasks = () => {
		const newTodos = todos.filter(todo => !todo.completed);
		setTodos(newTodos);
	};

	/*  Delete only a task */
	const onClickDelete = id => {
		const newTodos = todos.filter(todo => todo.id !== id);
		setTodos(newTodos);
	};

	/* value provide a props information Doble key becose return an object */
	return (
		<TodoContext.Provider
			value={{
				completedTodos,
				loading,
				error,
				todos,
				totalTodos,
				searchValue,
				searchedTodos,
				modalValue,
				taskValue,
				setSearch,
				onClickDeleteAllTasks,
				onClickDelete,
				onClickCompleteTodo,
				setModal,
				onClickTaskAdd,
				setEditTask,
				editTask,
				setTaskValue,
				onClickEdit,
				onClickTaskUpdate,
			}}
		>
			{children}
		</TodoContext.Provider>
	);
}

/* valide context isnt undefined */

const useApi = () => {
	const context = useContext(TodoContext);
	if (context === undefined) {
		const error = 'Not exist context';
		throw error;
	}
	return context;
};

export { useApi, TodoProvider, TodoContext };
