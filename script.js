const commentWrapper = document.querySelector(".comment-wrapper");
const commentInput = document.querySelector(".comment-input");
const addButton = document.querySelector(".add-button");
const inputBox = document.querySelectorAll('input');

commentInput.focus();

const localStorageKey = "state";
// Get data from local strorge 
const initializeComments = () => {
    const state = localStorage.getItem(localStorageKey);

    if (!state) {
        return [];
    }

    return JSON.parse(state);
};

const comments = initializeComments();

// Save data in Local Storage
const saveState = () => {
    const state = JSON.stringify(comments);
    localStorage.setItem(localStorageKey, state);
};

//create comment object
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

// Render Comments
const renderComments = () => {
    commentWrapper.innerText = "";

    comments.forEach((comment) => {
        const commentNode = createCommentNode(comment);

        commentWrapper.appendChild(commentNode);
    });
};

//Create new Comment
const createCommentNode = (comment) => {
    const commentNode = document.createElement("div");
    commentNode.classList.add("comment", "hide-reply");

    const commentAndButtons = document.createElement("div");
    commentAndButtons.classList.add("commentAndButtons");

    const commentText = document.createElement("div");
    commentText.classList.add("comment-text");
    commentText.innerText = comment.text;

    const buttonsAndLikesWrapper = document.createElement("div");
    buttonsAndLikesWrapper.classList.add("button-and-likes-wrapper");

    const replyButton = document.createElement("img");
    replyButton.classList.add("button", "replyButton");
    replyButton.src = "reply.png";
    replyButton.alt = "reply";
    replyButton.onclick = () => {
        commentNode.classList.toggle("hide-reply");
        replyInput.focus();
    }

    const likeButton = document.createElement("img");
    likeButton.classList.add("button");
    likeButton.src = "like.png";
    likeButton.alt = "Like";
    likeButton.onclick = () => {
        comment.likes++;
        saveState();
        renderComments();
    };

    const deleteButton = document.createElement("img");
    deleteButton.classList.add("button", "delete");
    deleteButton.src = "delete.png";
    deleteButton.alt = "Delete";
    deleteButton.onclick = () => {
        deleteComment(comments, comment.id);
        saveState();
        renderComments();
    };

    const likeText = document.createElement("div");
    likeText.innerHTML = `${comment.likes} Likes `;
    likeText.classList.add("likes-text");

    const replyNos = document.createElement("div");
    replyNos.innerHTML = `${comment.replies.length} Replies`;
    replyNos.classList.add("replies-text");

    const replyWrapper = document.createElement("div");
    replyWrapper.classList.add("reply-wrapper");

    const replyInput = document.createElement("input");

    const addReplyButton = document.createElement("img");
    addReplyButton.classList.add("button", "reply-wrapper-button");
    addReplyButton.src = "add.png"
    const addReply = () => {
        const replyText = replyInput.value.trim(" ");
        const commentId = comment.id;

        if (replyText === "") {
            alert("Please enter a reply");
            return;
        }

        const newCommentObject = createCommentObject(replyText);
        const commentObj = findCommentObject(comments, commentId);
        commentObj.replies.push(newCommentObject);

        saveState();
        renderComments();
    };
    addReplyButton.onclick = addReply;
    replyInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addReply();
        }
    })

    const cancelReplyButton = document.createElement("img");
    cancelReplyButton.classList.add("button","reply-wrapper-button");
    cancelReplyButton.src = "cancel.png"
    cancelReplyButton.onclick = () => commentNode.classList.add("hide-reply");

    const replyCommentsDomArray = comment.replies.map((reply) => {
        return createCommentNode(reply);
    });

    commentNode.appendChild(commentAndButtons);


    commentAndButtons.appendChild(commentText);
    commentAndButtons.appendChild(buttonsAndLikesWrapper);
    commentAndButtons.appendChild(replyWrapper);

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


// Add take input & new comment 
const addComment = () => {
    const commentText = commentInput.value.trim(" ");
    commentInput.value = "";
    if (commentText === "") {
        alert("Please enter a comment");
        return;
    }

    const newCommentObject = createCommentObject(commentText);

    comments.push(newCommentObject);
    saveState();
    renderComments();
};

inputBox.forEach((box) => {
    box.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addComment();
        }
    })
})

addButton.addEventListener("click", addComment);
renderComments();