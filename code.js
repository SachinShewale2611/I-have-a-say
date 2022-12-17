const commentWrapper = document.querySelector(".comment-wrapper");
const commentInput = document.querySelector(".comment-input");
const addButton = document.querySelector(".add-button");

const localStorageKey = "state";

const initializeComments = () => {
  const state = localStorage.getItem(localStorageKey);

  if (!state) {
    return [];
  }

  return JSON.parse(state);
};

const comments = initializeComments();
// Save in Local Storage
const saveState = () => {
  const state = JSON.stringify(comments);
  localStorage.setItem(localStorageKey, state);
};
//create Comment Object
const createCommentObject = (commentText) => {
  return {
    id: Math.random(),
    text: commentText,
    likes: 0,
    replies: [],
  };
};

//find Comment Object
const findCommentObject = (comments, commentId) => {
  for (const element of comments) {
    const comment = element;
    if (comment.id === commentId) {
      return comment;
    }
    const foundComment = findCommentObject(comment.replies, commentId);
    if (foundComment) {
      return foundComment;
    }
  }
};

//Delete Comment
const deleteComment = (comments, commentId) => {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    if (comment.id === commentId) {
      comments.splice(i, 1);
      return;
    }

    deleteComment(comment.replies, commentId);
  }
};

//Create new comment Node
const createCommentNode = (comment) => {
  const commentNode = document.createElement("div");
  commentNode.classList.add("comment", "hide-reply");

  const commentText = document.createElement("div");
  commentText.classList.add("comment-text");
  commentText.innerText = comment.text;

  const buttonsAndLikesWrapper = document.createElement("div");
  buttonsAndLikesWrapper.classList.add("button-and-likes-wrapper");

  const replyButton = document.createElement("button");
  replyButton.classList.add("button", "success");
  replyButton.innerText = "Reply";
  replyButton.onclick = () => commentNode.classList.toggle("hide-reply");

  const likeButton = document.createElement("button");
  likeButton.classList.add("button", "success");
  likeButton.innerText = "Like";
  likeButton.onclick = () => {
    comment.likes = comment.likes===1?0:1;
    saveState();
    renderComments();
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button", "delete");
  deleteButton.innerText = "Delete";
  deleteButton.onclick = () => {
    deleteComment(comments, comment.id);
    saveState();
    renderComments();
  };

  const likeText = document.createElement("div");
  likeText.innerText = `${comment.likes} likes`;
  likeText.classList.add("likes-text");

  const replyNos = document.createElement("div");
  replyNos.innerHTML = `${comment.replies.length} Replies`;
  replyNos.classList.add("replies-text");

  const replyWrapper = document.createElement("div");
  replyWrapper.classList.add("reply-wrapper");

  const replyInput = document.createElement("input");

  const addReplyButton = document.createElement("button");
  addReplyButton.classList.add("button", "success");
  addReplyButton.innerText = "Add";
  addReplyButton.onclick = () => {
    const replyText = replyInput.value.trim(" ");
    const commentId = comment.id;

    if (replyText === "") {
      alert("Please enter a reply");
      return;
    }

    const newReplyObject = createCommentObject(replyText);

    const commentObj = findCommentObject(comments, commentId);

    commentObj.replies.push(newReplyObject);

    saveState();
    renderComments();
  };

  const cancelReplyButton = document.createElement("button");
  cancelReplyButton.classList.add("button", "delete");
  cancelReplyButton.innerText = "Cancel";
  cancelReplyButton.onclick = () => commentNode.classList.add("hide-reply");

  const replyCommentsDomArray = comment.replies.map((reply) => {
    return createCommentNode(reply);
  });

  commentNode.appendChild(commentText);
  commentNode.appendChild(buttonsAndLikesWrapper);
  commentNode.appendChild(replyWrapper);

  buttonsAndLikesWrapper.appendChild(replyButton);
  buttonsAndLikesWrapper.appendChild(likeButton);
  buttonsAndLikesWrapper.appendChild(deleteButton);
  buttonsAndLikesWrapper.appendChild(likeText);
  buttonsAndLikesWrapper.appendChild(replyNos);

  replyWrapper.appendChild(replyInput);
  replyWrapper.appendChild(addReplyButton);
  replyWrapper.appendChild(cancelReplyButton);

  replyCommentsDomArray.forEach((replyDom) => {
    commentNode.appendChild(replyDom);
  });

  return commentNode;
};

const renderComments = () => {
  commentWrapper.innerText = "";

  comments.forEach((comment) => {
    const commentNode = createCommentNode(comment);

    commentWrapper.appendChild(commentNode);
  });
};

const addComment = () => {
  const commentText = commentInput.value.trim(" ");
  if (commentText === "") {
    alert("Please enter a comment");
    return;
  }

  const newCommentObject = createCommentObject(commentText);

  comments.push(newCommentObject);
  saveState();

  commentInput.value = "";

  renderComments();
};

addButton.addEventListener("click", addComment);
renderComments();
