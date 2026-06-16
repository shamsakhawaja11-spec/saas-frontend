import { useState } from 'react';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../../hooks/useComments';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type{ Comment } from '../../types/comment.types';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Send, X, Check, MessageSquare } from 'lucide-react';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500),
});

type CommentForm = z.infer<typeof commentSchema>;

interface CommentsSectionProps {
  taskId: string;
  currentUserId: string;
}

export const CommentsSection = ({ taskId, currentUserId }: CommentsSectionProps) => {
  const { data: comments, isLoading } = useComments(taskId);
  const createComment = useCreateComment();
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (values: CommentForm) => {
    createComment.mutate(
      { content: values.content, taskId },
      { onSuccess: () => reset() }
    );
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = (commentId: string) => {
    updateComment.mutate(
      { id: commentId, payload: { content: editContent } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-violet-400" />
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
          Comments {comments && comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          U
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <textarea
            {...register('content')}
            rows={2}
            placeholder="Write a comment..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
          {errors.content && (
            <p className="text-red-400 text-xs">{errors.content.message}</p>
          )}
          <button
            type="submit"
            disabled={createComment.isPending}
            className="self-end flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
          >
            <Send size={12} />
            {createComment.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-zinc-700 rounded w-24" />
                <div className="h-3 bg-zinc-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments?.length === 0 ? (
        <div className="text-zinc-600 text-sm text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          No comments yet. Be the first to comment.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments?.map((comment: Comment) => (
            <div key={comment.id} className="flex gap-3 group">

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {comment.author?.name?.[0]?.toUpperCase() ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                {/* Author + Time */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {comment.author?.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-xs text-zinc-600">(edited)</span>
                  )}
                </div>

                {/* Edit mode */}
                {editingId === comment.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-800 border border-violet-500 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(comment.id)}
                        disabled={updateComment.isPending}
                        className="flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-2 py-1 rounded transition"
                      >
                        <Check size={12} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded transition"
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 break-words">{comment.content}</p>
                )}
              </div>

              {/* Edit/Delete — only for comment owner */}
              {currentUserId === comment.authorId && editingId !== comment.id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={() => startEdit(comment)}
                    className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => deleteComment.mutate(comment.id)}
                    disabled={deleteComment.isPending}
                    className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};