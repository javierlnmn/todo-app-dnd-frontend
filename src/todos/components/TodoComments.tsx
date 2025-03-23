import { FC, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

import { useUserStore } from '@auth/stores/userStore';
import { isOwnerOrAdmin } from '@auth/utils/user';

import { formatDateTime } from '@common/utils/dates';
import InputField from '@common/components/Forms/InputField';

import { Comment, Todo } from '@todos/types/todos.d';
import { deleteComment, postComment } from '@todos/services/comments';

import CrownIcon from '@icons/CrownIcon';
import TrashIcon from '@icons/TrashIcon';
import LoadingThrobberIcon from '@icons/LoadingThrobberIcon';


export interface CommentFormData {
    content: string;
    todo: string;
}

interface TodoCommentsProps {
    comments: Comment[];
    todoId: Todo['id'];
}

const TodoComments: FC<TodoCommentsProps> = ({ comments, todoId }) => {
    const { username, isSuperuser } = useUserStore();
    
    const [commentList, setCommentList] = useState(comments);
    const queryClient = useQueryClient();

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: (commentId: Comment['id']) => {
            setCommentList((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            toast.success('Comment deleted successfully!', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
        },
        onError: () => {
            toast.error('Oops! An error occured while deleting a comment!', {
				className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
			});
        }
    });

    const handleDeleteComment = (id: string) => {
        deleteCommentMutation.mutate(id);
    };

    // Comment form
    const emptyCommentFormData: CommentFormData = { content: '', todo: todoId, };
    const [commentFormData, setCommentFormData] = useState<CommentFormData>(emptyCommentFormData);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setCommentFormData({ ...commentFormData, [e.target.name]: e.target.value });
	}

    const isCommentFormValid = (): boolean => {
		return (
			!commentFormData.content
		)
	}

    // Mutation for posting comments
    const postCommentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: (comment) => {
            setCommentList((prevComments) => [...prevComments, comment]);
            setCommentFormData(emptyCommentFormData);
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
        onError: (error) => {
            toast.error('Oops! An error occured while posting a comment!', {
                className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
            });
            throw error;
        },
    });

    const { isPending }= postCommentMutation;

    const handleSubmitPostComment = (e: React.FormEvent) => {
        e.preventDefault();
        postCommentMutation.mutate(commentFormData);
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">Comments</h3>
            {commentList.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {commentList.map((comment) => (
                            <motion.div
                                layout
                                key={comment.id}
                                className={`bg-zinc-200/30 dark:bg-zinc-700/40 shadow-md rounded-2xl p-3 flex flex-col gap-2 max-md:w-11/12 w-8/12
                                    ${username === comment.user.username ? 'ml-auto rounded-br-none' : 'mr-auto rounded-bl-none' }
                                `}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex justify-between items-center gap-3">
                                    <div className="relative">
                                        <p className="font-bold">{comment.user.username}</p>
                                        {comment.user.isSuperuser && (
                                            <div className="absolute top-0 -right-2 rotate-[35deg]">
                                                <CrownIcon className="w-3 h-3 dark:fill-yellow-400 dark:stroke-yellow-400 fill-yellow-600 stroke-yellow-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        {isOwnerOrAdmin(isSuperuser, username, comment.user.username) && (
                                            <button onClick={() => handleDeleteComment(comment.id)}>
                                                <TrashIcon className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" />
                                            </button>
                                        )}
                                        <p className="font-light opacity-50 text-sm">{formatDateTime(comment.created)}</p>
                                    </div>
                                </div>
                                <p>{comment.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <p className="font-light opacity-70">There are no comments yet.</p>
            )}
            <form className='flex items-center gap-3 mt-3'>
                <InputField
                    type='text'
                    name="content"
                    placeholder="Comment something..."
                    value={commentFormData.content}
                    onChange={handleFieldChange}
                    error={false}
                />
                <button
                    disabled={isCommentFormValid()}
                    onClick={handleSubmitPostComment}
                    type="submit"
                    className="h-full text-zinc-100 bg-sky-600 transition-colors disabled:opacity-50 disabled:hover:bg-sky-600 hover:bg-sky-500 cursor-pointer w-1/4 p-3 rounded-md font-bold flex justify-center"
                >
                    {isPending ? (
                        <LoadingThrobberIcon className="w-5 h-5 !fill-zinc-100 !text-zinc-200/60 dark:!text-zinc-300/50" />
                    ) : (
                        "Comment"
                    )}
                </button>
            </form>
        </div>
    );
};

export default TodoComments;
