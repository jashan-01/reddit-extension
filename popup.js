let currentPosts = [];
let currentIndex = -1;
let currentSubreddit = '';

const subredditInput = document.getElementById('subreddit-input');
const postContainer = document.getElementById('post-container');
const postText = document.getElementById('post-text');
const loadingSpinner = document.getElementById('loading-spinner');
const nextBtn = document.getElementById('next-btn');
const linkBtn = document.getElementById('link-btn');
const controls = document.getElementById('controls');

// Load saved subreddit when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['lastSubreddit'], (result) => {
    if (result.lastSubreddit) {
      subredditInput.value = result.lastSubreddit;
      currentSubreddit = result.lastSubreddit;
      postContainer.classList.remove('hidden');
      controls.classList.remove('hidden');
      fetchPosts(result.lastSubreddit);
    }
  });
});

// Fetch posts from a subreddit
async function fetchPosts(subreddit) {
  showLoading(true);
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=100`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    currentPosts = data.data.children;
    currentIndex = -1;
    showNextPost();
  } catch (error) {
    postText.textContent = "Error: " + error.message;
    showLoading(false);
  }
}

// Show the next post
function showNextPost() {
  if (currentPosts.length === 0) {
    postText.textContent = "No posts available.";
    disableButtons(true);
    showLoading(false);
    return;
  }
  currentIndex = (currentIndex + 1) % currentPosts.length;
  const post = currentPosts[currentIndex].data;
  postText.textContent = post.title;
  linkBtn.onclick = () => window.open(`https://www.reddit.com${post.permalink}`, '_blank');
  showLoading(false);
  disableButtons(false);
}

// Show or hide loading spinner
function showLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove('hidden');
    postText.classList.add('hidden');
    disableButtons(true);
  } else {
    loadingSpinner.classList.add('hidden');
    postText.classList.remove('hidden');
  }
}

// Disable or enable buttons
function disableButtons(disabled) {
  nextBtn.disabled = disabled;
  linkBtn.disabled = disabled;
}

// Event listeners
nextBtn.addEventListener('click', showNextPost);
subredditInput.addEventListener('change', (e) => {
  const subreddit = e.target.value.trim();
  if (subreddit) {
    currentSubreddit = subreddit;
    // Save the subreddit name to Chrome storage
    chrome.storage.sync.set({ 'lastSubreddit': subreddit }, () => {
    });
    postContainer.classList.remove('hidden');
    controls.classList.remove('hidden');
    fetchPosts(subreddit);
  } else {
    currentPosts = [];
    postContainer.classList.add('hidden');
    controls.classList.add('hidden');
  }
});