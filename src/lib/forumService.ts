// Forum API service functions

export interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  isPinned?: boolean;
  isAnswered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  isAcceptedAnswer?: boolean;
  createdAt: string;
}

export interface CreateThreadData {
  title: string;
  content: string;
  category: string;
  tags?: string;
}

export interface ThreadsResponse {
  threads: Thread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ThreadDetailResponse {
  thread: Thread;
  replies: Reply[];
}

// Get all threads with filters
export const getThreads = async (
  category?: string,
  search?: string,
  sortBy?: string,
  page?: number,
  limit?: number
): Promise<ThreadsResponse> => {
  const params = new URLSearchParams();
  
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`/api/threads?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch threads');
  }

  return response.json();
};

// Get a specific thread with replies
export const getThread = async (threadId: string): Promise<ThreadDetailResponse> => {
  const response = await fetch(`/api/threads/${threadId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch thread');
  }

  return response.json();
};

// Create a new thread
export const createThread = async (threadData: CreateThreadData): Promise<Thread> => {
  const response = await fetch('/api/threads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(threadData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create thread');
  }

  const data = await response.json();
  return data.thread;
};

// Update a thread
export const updateThread = async (
  threadId: string,
  updateData: Partial<CreateThreadData> & { isAnswered?: boolean }
): Promise<void> => {
  const response = await fetch(`/api/threads/${threadId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update thread');
  }
};

// Delete a thread
export const deleteThread = async (threadId: string): Promise<void> => {
  const response = await fetch(`/api/threads/${threadId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete thread');
  }
};

// Like/Unlike a thread
export const likeThread = async (threadId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
  const response = await fetch(`/api/threads/${threadId}/like`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to like thread');
  }

  return response.json();
};

// Bookmark/Unbookmark a thread
export const bookmarkThread = async (threadId: string): Promise<{ isBookmarked: boolean }> => {
  const response = await fetch(`/api/threads/${threadId}/bookmark`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to bookmark thread');
  }

  return response.json();
};

// Get replies for a thread
export const getReplies = async (threadId: string): Promise<Reply[]> => {
  const response = await fetch(`/api/threads/${threadId}/replies`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch replies');
  }

  const data = await response.json();
  return data.replies;
};

// Create a new reply
export const createReply = async (threadId: string, content: string): Promise<Reply> => {
  const response = await fetch(`/api/threads/${threadId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reply');
  }

  const data = await response.json();
  return data.reply;
};

// Update a reply
export const updateReply = async (replyId: string, content: string): Promise<void> => {
  const response = await fetch(`/api/replies/${replyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reply');
  }
};

// Delete a reply
export const deleteReply = async (replyId: string): Promise<void> => {
  const response = await fetch(`/api/replies/${replyId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete reply');
  }
};

// Like/Unlike a reply
export const likeReply = async (replyId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
  const response = await fetch(`/api/replies/${replyId}/like`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to like reply');
  }

  return response.json();
};
