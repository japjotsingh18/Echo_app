/*
 * Echo App - Voice Messaging Application
 * Features:
 * - Audio recording and playback
 * - Emotion detection
 * - Feed management
 * - User authentication
 * - Pagination
 */

// ======== CONFIGURATION ========
const CONFIG = {
  apiUrl: 'https://api.echo-app.com', // Replace with your actual API endpoint
  itemsPerPage: 10,
  maxRecordingDuration: 60, // seconds
  supportedEmotions: [
    { label: "EXCITED", color: "#FF4D8D" },  // Pink from the image
    { label: "JOY", color: "#E65100" },      // Very dark orange
    { label: "CALM", color: "#4DD0E1" },     // Light blue from the image
    { label: "ANNOYED", color: "#FF6B6B" },  // Coral red from the image
    { label: "SAD", color: "#7C4DFF" }       // Purple from the image
  ]
};

// ======== STATE MANAGEMENT ========
const state = {
  currentUser: null,
  isAuthenticated: false,
  currentTab: 'foryou',
  currentPage: 1,
  feedData: [],
  isLoading: false,
  error: null,
  audioStreams: [],
  audioUrls: [],
  likes: new Set(), // Track liked posts
  totalItems: 0,
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  selectedEmotion: null
};

// ======== DOM ELEMENTS ========
const tabButtons = document.querySelectorAll(".tab-btn");
const recordButton = document.getElementById("recordButton");
const stopButton = document.getElementById("stopButton");
const statusText = document.getElementById("status");
const feedContainer = document.getElementById("feedContainer");

const paginationContainer = document.createElement("div");
paginationContainer.classList.add("pagination");
feedContainer.parentNode.insertBefore(paginationContainer, feedContainer.nextSibling);

// Add scroll progress tracking
const scrollProgress = document.createElement('div');
scrollProgress.classList.add('scroll-progress');
const scrollProgressBar = document.createElement('div');
scrollProgressBar.classList.add('scroll-progress-bar');
scrollProgress.appendChild(scrollProgressBar);
document.body.appendChild(scrollProgress);

// Use a separate variable for infinite scroll loading
let infiniteLoading = false;
let hasMoreItems = true;

// ======== SCROLL EVENT ========
window.addEventListener('scroll', () => {
  // Update progress bar using a template literal
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgressBar.style.width = `${Math.min(scrolled, 100)}%`;
  
  // Check for infinite scroll
  if (!infiniteLoading && hasMoreItems && 
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
    loadMoreItems();
  }
});

// ======== HELPER FUNCTION ========
function showError(message) {
  // Simple error helper (you could improve this to show a modal or a toast)
  alert(message);
}

// ======== AUTHENTICATION ========
function showAuthModal(isSignUp = false) {
  const modal = document.getElementById('authModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('authModal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAuthModal();
    }
  });
});

function login(email, password) {
  // Simulated login (replace with real API call in production)
  state.isAuthenticated = true;
  state.currentUser = { id: 1, name: "Demo User", email };
  document.querySelector(".auth-modal").remove();
  updateUI();
  fetchFeedData();
}

function signup(email, password) {
  // Simulated signup
  state.isAuthenticated = true;
  state.currentUser = { id: 1, name: "Demo User", email };
  document.querySelector(".auth-modal").remove();
  updateUI();
  fetchFeedData();
}

function logout() {
  state.isAuthenticated = false;
  state.currentUser = null;
  updateUI();
}

// ======== DATA FETCHING ========
async function fetchFeedData(isInitial = true) {
  if (isInitial) {
    state.isLoading = true;
    updateUI();
  } else {
    showLoadingIndicator();
  }
  
  try {
    const response = await simulateApiCall({
      data: generateMockData(state.currentPage),
      total: 100 // Simulate larger dataset
    });
    
    if (isInitial) {
      state.feedData = response.data;
    } else {
      state.feedData = [...state.feedData, ...response.data];
    }
    
    state.totalItems = response.total;
    state.error = null;
    hasMoreItems = state.feedData.length < state.totalItems;
  } catch (error) {
    state.error = "Failed to load feed data. Please try again later.";
    console.error("Error fetching feed data:", error);
  } finally {
    state.isLoading = false;
    if (!isInitial) {
      hideLoadingIndicator();
    }
    updateUI();
  }
}

function simulateApiCall(response) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 1000);
  });
}

// ======== UI UPDATES ========
function updateUI() {
  // Update auth UI
  const navIcons = document.querySelector(".nav-icons");
  if (state.isAuthenticated) {
    navIcons.innerHTML = `
      <span class="material-symbols-outlined" aria-label="Search">search</span>
      <span class="material-symbols-outlined" aria-label="Profile">person</span>
      <button onclick="logout()" aria-label="Logout">Logout</button>
    `;
  } else {
    navIcons.innerHTML = `
      <span class="material-symbols-outlined" aria-label="Search">search</span>
      <button onclick="showAuthModal(true)" aria-label="Login">Login</button>
    `;
  }
  
  // Update feed
  if (state.isLoading) {
    feedContainer.innerHTML = '<div class="loading">Loading feed...</div>';
    return;
  }
  
  if (state.error) {
    feedContainer.innerHTML = `<div class="error">${state.error}</div>`;
    return;
  }
  
  renderFeedItems(state.feedData);
  renderPagination();
}

function renderFeedItems(dataArray) {
  feedContainer.innerHTML = "";
  
  if (dataArray.length === 0) {
    feedContainer.innerHTML = '<div class="empty-state">No items to display</div>';
    return;
  }
  
  dataArray.forEach((item) => {
    // Create feed card
    const card = document.createElement("div");
    card.classList.add("card");
    
    // Header (user + time + emotion)
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("feed-header");
    
    const userDiv = document.createElement("div");
    userDiv.classList.add("feed-user");
    
    // Create Bitmoji avatar
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'bitmoji-container post-avatar';
    avatarContainer.innerHTML = getBitmoji(item.bitmoji || 'default');
    
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    
    const userName = document.createElement("div");
    userName.classList.add("feed-user-name");
    userName.textContent = item.userName;
    
    const timeAgo = document.createElement("div");
    timeAgo.classList.add("feed-time");
    timeAgo.textContent = item.time;
    
    userInfo.appendChild(userName);
    userInfo.appendChild(timeAgo);
    
    userDiv.appendChild(avatarContainer);
    userDiv.appendChild(userInfo);
    
    const emotionBadge = document.createElement("div");
    emotionBadge.classList.add("emotion-badge", item.emotion.toLowerCase());
    emotionBadge.textContent = item.emotion;
    
    headerDiv.appendChild(userDiv);
    headerDiv.appendChild(emotionBadge);
    
    // Audio area with title
    const audioContainer = document.createElement("div");
    audioContainer.classList.add("audio-container");
    
    const audioTitle = document.createElement("div");
    audioTitle.classList.add("audio-title");
    audioTitle.textContent = item.audioTitle;
    audioContainer.appendChild(audioTitle);
    
    const audioElem = document.createElement("audio");
    audioElem.controls = true;
    audioElem.src = item.audioUrl;
    audioElem.classList.add("audio-controls");
    audioElem.setAttribute("aria-label", `${item.userName}'s audio message: ${item.audioTitle}`);
    audioElem.preload = "metadata"; // Only load metadata initially
    audioContainer.appendChild(audioElem);
    
    // Add loading indicator for audio
    const loadingIndicator = document.createElement("div");
    loadingIndicator.classList.add("audio-loading");
    loadingIndicator.textContent = "Loading audio...";
    audioContainer.appendChild(loadingIndicator);
    
    // Handle audio events
    audioElem.addEventListener("loadeddata", () => {
      loadingIndicator.style.display = "none";
    });
    
    audioElem.addEventListener("error", () => {
      loadingIndicator.textContent = "Error loading audio";
      loadingIndicator.classList.add("error");
    });
    
    // Actions
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("feed-actions");
    
    const likeBtn = document.createElement("button");
    const isLiked = state.likes.has(item.id);
    likeBtn.setAttribute("aria-label", isLiked ? "Unlike this post" : "Like this post");
    likeBtn.innerHTML = `<span class="material-symbols-outlined" style="color: ${isLiked ? '#e74c3c' : '#666'}">${isLiked ? 'favorite' : 'favorite_border'}</span> ${isLiked ? 'Liked' : 'Like'}`;
    likeBtn.addEventListener("click", () => toggleLike(item.id));
    
    const replyBtn = document.createElement("button");
    replyBtn.setAttribute("aria-label", "Reply to this post");
    replyBtn.innerHTML = `<span class="material-symbols-outlined">chat</span> Reply`;
    
    actionsDiv.appendChild(likeBtn);
    actionsDiv.appendChild(replyBtn);
    
    // Replies section
    if (item.replies && item.replies.length > 0) {
      const repliesContainer = document.createElement("div");
      repliesContainer.classList.add("replies-container");
      
      const repliesTitle = document.createElement("div");
      repliesTitle.classList.add("replies-title");
      repliesTitle.textContent = "Replies";
      repliesContainer.appendChild(repliesTitle);
      
      item.replies.forEach(reply => {
        const replyDiv = document.createElement("div");
        replyDiv.classList.add("reply-item");
        
        const replyHeader = document.createElement("div");
        replyHeader.classList.add("reply-header");
        
        const replyUserName = document.createElement("span");
        replyUserName.classList.add("reply-username");
        replyUserName.textContent = reply.userName;
        
        const replyTime = document.createElement("span");
        replyTime.classList.add("reply-time");
        replyTime.textContent = reply.time;
        
        replyHeader.appendChild(replyUserName);
        replyHeader.appendChild(replyTime);
        
        const replyText = document.createElement("div");
        replyText.classList.add("reply-text");
        replyText.textContent = reply.text;
        
        replyDiv.appendChild(replyHeader);
        replyDiv.appendChild(replyText);
        repliesContainer.appendChild(replyDiv);
      });
      
      card.appendChild(actionsDiv);
      card.appendChild(repliesContainer);
    } else {
      card.appendChild(actionsDiv);
    }
    
    // Append header and audio container to card
    card.appendChild(headerDiv);
    card.appendChild(audioContainer);
    
    // Add card to feed
    feedContainer.appendChild(card);
  });
}

function renderPagination() {
  if (!state.totalItems) return;
  
  const totalPages = Math.ceil(state.totalItems / CONFIG.itemsPerPage);
  paginationContainer.innerHTML = "";
  
  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = state.currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      fetchFeedData();
    }
  });
  paginationContainer.appendChild(prevBtn);
  
  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.toggle("active", i === state.currentPage);
    pageBtn.addEventListener("click", () => {
      state.currentPage = i;
      fetchFeedData();
    });
    paginationContainer.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = state.currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (state.currentPage < totalPages) {
      state.currentPage++;
      fetchFeedData();
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// ======== TAB HANDLER ========
function handleTabClick(e) {
  // Remove active class from all tabs
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  
  // Add active class to clicked tab
  e.target.classList.add("active");
  
  // Update state and fetch data
  state.currentTab = e.target.dataset.tab;
  state.currentPage = 1; // Reset to first page when changing tabs
  fetchFeedData();
}

// ======== RECORDING FUNCTIONS ========
function updateRecordingUI() {
  const recordButton = document.getElementById('recordButton');
  const stopButton = document.getElementById('stopButton');
  const playButton = document.getElementById('playButton');
  const shareButton = document.getElementById('shareButton');
  const statusText = document.getElementById('status');
  
  if (recordButton && stopButton) {
    if (state.isRecording) {
      recordButton.style.display = 'none';
      stopButton.style.display = 'block';
      stopButton.disabled = false;
      playButton.disabled = true;
      shareButton.disabled = true;
      statusText.textContent = 'Recording...';
    } else {
      recordButton.style.display = 'block';
      stopButton.style.display = 'none';
      stopButton.disabled = true;
      playButton.disabled = false;
      shareButton.disabled = false;
      statusText.textContent = 'Recording stopped';
    }
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.mediaRecorder = new MediaRecorder(stream);
    state.audioChunks = [];
    
    state.mediaRecorder.addEventListener('dataavailable', (event) => {
      state.audioChunks.push(event.data);
    });
    
    state.mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      state.audioUrls.push(audioUrl); // Store URL for cleanup
      
      const audioPreview = document.createElement('audio');
      audioPreview.src = audioUrl;
      audioPreview.controls = true;
      
      const previewContainer = document.querySelector('.audio-preview') || document.createElement('div');
      previewContainer.className = 'audio-preview';
      previewContainer.innerHTML = '';
      previewContainer.appendChild(audioPreview);
      
      const composer = document.querySelector('.voice-composer');
      if (!document.querySelector('.audio-preview')) {
        composer.insertBefore(previewContainer, composer.querySelector('.composer-footer'));
      }
      
      document.getElementById('shareButton').disabled = false;
    });
    
    state.mediaRecorder.start();
    state.isRecording = true;
    updateRecordingUI();
  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('Unable to access microphone. Please check your permissions.');
  }
}

function stopRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
    state.mediaRecorder.stop();
    state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    state.isRecording = false;
    updateRecordingUI();
    showRecordingPreview();
  }
}

function showRecordingPreview() {
  const previewDialog = document.createElement('div');
  previewDialog.className = 'recording-preview-dialog';
  
  const audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(audioBlob);
  state.audioUrls.push(audioUrl);

  previewDialog.innerHTML = `
    <div class="preview-content">
      <div class="preview-header">
        <div class="user-info">
          <img src="https://i.pravatar.cc/150?img=12" alt="Your profile picture" class="user-avatar">
          <div class="user-details">
            <span class="user-name">You</span>
            <span class="preview-label">Preview your voice note</span>
          </div>
        </div>
        <button class="close-preview" aria-label="Close preview">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="audio-preview">
        <div class="audio-player">
          <button class="play-button">
            <span class="material-symbols-outlined">play_arrow</span>
          </button>
          <div class="waveform">
            <audio src="${audioUrl}" style="display: none;"></audio>
            <div class="time-display">0:00</div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="preview-actions">
        <div class="action-group">
          <button class="edit-btn action-btn">
            <span class="material-symbols-outlined">edit</span>
            Edit
          </button>
          <button class="post-btn action-btn">
            <span class="material-symbols-outlined">send</span>
            Post
          </button>
        </div>
        <button class="save-btn action-btn">
          <span class="material-symbols-outlined">bookmark</span>
          Save Draft
        </button>
        <button class="discard-btn action-btn">
          <span class="material-symbols-outlined">delete</span>
          Discard
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(previewDialog);

  const audio = previewDialog.querySelector('audio');
  const timeDisplay = previewDialog.querySelector('.time-display');
  const progressBar = previewDialog.querySelector('.progress-bar');
  const progressFill = previewDialog.querySelector('.progress-fill');
  const playButton = previewDialog.querySelector('.play-button');
  const closeBtn = previewDialog.querySelector('.close-preview');
  const discardBtn = previewDialog.querySelector('.discard-btn');
  const saveBtn = previewDialog.querySelector('.save-btn');
  const postBtn = previewDialog.querySelector('.post-btn');
  const editBtn = previewDialog.querySelector('.edit-btn');

  function updatePlayState(isPlaying) {
    const playIcon = isPlaying ? 'pause' : 'play_arrow';
    playButton.querySelector('.material-symbols-outlined').textContent = playIcon;
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function playAudio() {
    audio.play();
    updatePlayState(true);
  }

  function pauseAudio() {
    audio.pause();
    updatePlayState(false);
  }

  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    timeDisplay.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    updatePlayState(false);
    progressFill.style.width = '0%';
    timeDisplay.textContent = '0:00';
  });

  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  });

  playButton.addEventListener('click', () => {
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  closeBtn.addEventListener('click', () => {
    pauseAudio();
    previewDialog.remove();
  });

  discardBtn.addEventListener('click', () => {
    pauseAudio();
    previewDialog.remove();
    resetRecording();
  });

  saveBtn.addEventListener('click', () => {
    pauseAudio();
    showToast('Saved to drafts!');
    previewDialog.remove();
    resetRecording();
  });

  postBtn.addEventListener('click', () => {
    pauseAudio();
    previewDialog.remove();
    showShareDialog();
  });

  editBtn.addEventListener('click', () => {
    showToast('Edit feature coming soon!');
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ======== CLEANUP ========
function cleanup() {
  // Revoke all object URLs to prevent memory leaks
  state.audioUrls.forEach(url => {
    URL.revokeObjectURL(url);
  });
  state.audioUrls = [];
  
  // Stop all audio streams
  state.audioStreams.forEach(stream => {
    stream.getTracks().forEach(track => track.stop());
  });
  state.audioStreams = [];
}

// ======== INITIALIZATION ========
function init() {
  // Set up tab navigation
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", handleTabClick);
  });
  
  // Check for MediaRecorder support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusText.textContent = "MediaRecorder API not supported in this browser.";
    recordButton.disabled = true;
  } else {
    recordButton.addEventListener("click", () => {
      if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
        stopRecording();
      } else {
        startRecording();
      }
    });
    
    // Keep the explicit stop button
    stopButton.addEventListener("click", stopRecording);
  }
  
  // Add keyboard navigation to close auth modal on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector(".auth-modal")) {
      document.querySelector(".auth-modal").remove();
    }
  });
  
  // Initial UI update
  updateUI();
  
  // Clean up on page unload
  window.addEventListener("beforeunload", cleanup);
  
  // Initialize intersection observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.classList.contains('card')) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            observer.unobserve(element);
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  );
  
  // Observe feed items
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
  });
  
  // Dark mode functionality
  initDarkMode();

  // Share dialog functionality
  initShareDialog();

  // Initialize profile view functionality
  initProfileView();

  // Initialize live room navigation
  initializeLiveRoomNavigation();

  // Add live room navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.querySelector('span.material-symbols-outlined').textContent === 'campaign') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'liveroom.html';
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", init);

// ======== LIKE FUNCTIONALITY ========
function toggleLike(postId) {
  const button = document.querySelector(`.voice-post[data-id="${postId}"] .action-btn[aria-label*="Like"]`);
  const icon = button.querySelector('.material-symbols-outlined');
  const count = button.querySelector('.action-count');
  
  if (state.likes.has(postId)) {
    state.likes.delete(postId);
    icon.textContent = 'favorite_border';
    count.textContent = parseInt(count.textContent) - 1;
    button.setAttribute('aria-label', 'Like this post');
  } else {
    state.likes.add(postId);
    icon.textContent = 'favorite';
    count.textContent = parseInt(count.textContent) + 1;
    button.setAttribute('aria-label', 'Unlike this post');
  }
}

// ======== MOCK DATA & INFINITE SCROLL ========
function generateMockData(page) {
  const startId = (page - 1) * CONFIG.itemsPerPage;
  return Array.from({ length: CONFIG.itemsPerPage }, (_, index) => ({
    id: startId + index + 1,
    userName: `User ${startId + index + 1}`,
    time: `${Math.floor(Math.random() * 60)} minutes ago`,
    emotion: CONFIG.supportedEmotions[Math.floor(Math.random() * CONFIG.supportedEmotions.length)].label,
    audioUrl: "https://www.chosic.com/wp-content/uploads/2023/07/creative_minds.mp3",
    audioTitle: `Audio Post ${startId + index + 1}`,
    replies: [
      { id: (startId + index) * 3 + 1, userName: "User A", text: "Great post!", time: "Just now" },
      { id: (startId + index) * 3 + 2, userName: "User B", text: "Amazing!", time: "2m ago" },
      { id: (startId + index) * 3 + 3, userName: "User C", text: "Love it!", time: "5m ago" }
    ]
  }));
}

function showLoadingIndicator() {
  const loader = document.createElement('div');
  loader.classList.add('infinite-scroll-loader');
  loader.innerHTML = `
    <div class="spinner"></div>
    <span>Loading more posts...</span>
  `;
  feedContainer.appendChild(loader);
}

function hideLoadingIndicator() {
  const loader = document.querySelector('.infinite-scroll-loader');
  if (loader) {
    loader.remove();
  }
}

async function loadMoreItems() {
  if (infiniteLoading || !hasMoreItems) return;
  
  infiniteLoading = true;
  state.currentPage++;
  await fetchFeedData(false);
  infiniteLoading = false;
}

// Tab functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const feedContainer = document.getElementById('feedContainer');

  // Update the trending data
  const trendingData = {
    foryou: [
      {
        id: 1,
        author: 'Alex Johnson',
        handle: '@alexjohnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        timestamp: '2h',
        content: 'The new AI features we\'re adding to the platform are mind-blowing! Check out this demo...',
        emotion: 'EXCITED',
        audioDuration: '0:45',
        likes: 128,
        replies: 24,
        reposts: 12
      },
      {
        id: 2,
        author: 'Sarah Williams',
        handle: '@sarahwilliams',
        avatar: 'https://i.pravatar.cc/150?img=5',
        timestamp: '3h',
        content: 'Just released our latest design system update. The components are so much more flexible now!',
        emotion: 'JOY',
        audioDuration: '0:38',
        likes: 89,
        replies: 15,
        reposts: 8
      },
      {
        id: 3,
        author: 'David Chen',
        handle: '@davidchen',
        avatar: 'https://i.pravatar.cc/150?img=11',
        timestamp: '4h',
        content: 'Reflecting on our user research findings. Some fascinating insights about how people use voice interfaces.',
        emotion: 'CALM',
        audioDuration: '1:05',
        likes: 342,
        replies: 45,
        reposts: 28
      }
    ],
    following: [
      {
        id: 4,
        author: 'Mike Chen',
        handle: '@mikechen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        timestamp: '1h',
        content: 'Our new voice synthesis model is producing incredibly natural results. Here\'s a sample...',
        emotion: 'JOY',
        audioDuration: '0:52',
        likes: 256,
        replies: 42,
        reposts: 28
      },
      {
        id: 5,
        author: 'Lisa Wang',
        handle: '@lisawang',
        avatar: 'https://i.pravatar.cc/150?img=15',
        timestamp: '2h',
        content: 'Just deployed a major performance update. Load times are now 50% faster!',
        emotion: 'EXCITED',
        audioDuration: '0:33',
        likes: 189,
        replies: 23,
        reposts: 15
      }
    ],
    trending: [
      {
        id: 6,
        author: 'Emma Davis',
        handle: '@emmadavis',
        avatar: 'https://i.pravatar.cc/150?img=4',
        timestamp: '30m',
        content: 'Breaking: We just hit 1 million active users! Thank you to our amazing community...',
        emotion: 'EXCITED',
        audioDuration: '1:15',
        likes: 1289,
        replies: 189,
        reposts: 256
      },
      {
        id: 7,
        author: 'Ryan Kim',
        handle: '@ryankim',
        avatar: 'https://i.pravatar.cc/150?img=17',
        timestamp: '1h',
        content: 'The results from our accessibility improvements are in. Engagement is up by 200%!',
        emotion: 'JOY',
        audioDuration: '0:48',
        likes: 892,
        replies: 145,
        reposts: 178
      },
      {
        id: 8,
        author: 'Sophie Taylor',
        handle: '@sophietaylor',
        avatar: 'https://i.pravatar.cc/150?img=18',
        timestamp: '2h',
        content: 'Sharing my thoughts on the future of voice-first interfaces. Some interesting patterns emerging...',
        emotion: 'CALM',
        audioDuration: '1:30',
        likes: 756,
        replies: 123,
        reposts: 145
      }
    ]
  };

  // Update the trending emotions data
  const trendingEmotions = [
    { label: 'EXCITED', percentage: 24, count: 1234 },
    { label: 'JOY', percentage: 18, count: 982 },
    { label: 'CALM', percentage: 12, count: 645 },
    { label: 'ANNOYED', percentage: 8, count: 421 },
    { label: 'SAD', percentage: 5, count: 234 }
  ];

  function createVoicePost(post) {
    return `
      <div class="voice-post" data-id="${post.id}">
        <div class="post-header">
          <div class="user-info">
            <img src="${post.avatar}" alt="${post.author}'s avatar" class="post-avatar">
            <div class="post-meta">
              <div class="post-author">${post.author}</div>
              <div class="post-time">${post.timestamp}</div>
            </div>
          </div>
          <div class="emotion-badge ${post.emotion.toLowerCase()}">
            <span class="material-symbols-outlined">
              ${getEmotionIcon(post.emotion)}
            </span>
            ${post.emotion}
          </div>
        </div>
        
        <div class="post-content">
          <p class="post-text">${post.content}</p>
          <div class="audio-player">
            <audio controls src="https://www.chosic.com/wp-content/uploads/2023/07/creative_minds.mp3"></audio>
          </div>
        </div>

        <div class="post-actions">
          <button class="action-btn" aria-label="${state.likes.has(post.id) ? 'Unlike' : 'Like'} this post">
            <span class="material-symbols-outlined">${state.likes.has(post.id) ? 'favorite' : 'favorite_border'}</span>
            <span class="action-count">${post.likes}</span>
          </button>
          <button class="action-btn" aria-label="Reply to this post">
            <span class="material-symbols-outlined">chat_bubble_outline</span>
            <span class="action-count">${post.replies}</span>
          </button>
          <button class="action-btn" aria-label="Repost">
            <span class="material-symbols-outlined">repeat</span>
            <span class="action-count">${post.reposts}</span>
          </button>
          <button class="action-btn" aria-label="Share">
            <span class="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
    `;
  }

  function getEmotionIcon(emotion) {
    const icons = {
      'Happy': 'sentiment_very_satisfied',
      'Sad': 'sentiment_very_dissatisfied',
      'Excited': 'mood',
      'Angry': 'mood_bad',
      'Calm': 'peace',
      'Anxious': 'psychology',
      'Grateful': 'favorite',
      'Confused': 'psychology_alt'
    };
    return icons[emotion] || 'mood';
  }

  function updateFeed(tabId) {
    const posts = trendingData[tabId] || [];
    feedContainer.innerHTML = posts.map(post => createVoicePost(post)).join('');
    
    // Add animation classes to posts
    const voicePosts = feedContainer.querySelectorAll('.voice-post');
    voicePosts.forEach((post, index) => {
      post.style.animationDelay = `${index * 0.1}s`;
      post.classList.add('fadeInUp');
    });

    // Reinitialize action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.getAttribute('aria-label').toLowerCase();
        const postId = button.closest('.voice-post').dataset.id;
        
        if (action.includes('like')) {
          toggleLike(postId);
        } else if (action.includes('reply')) {
          showReplyDialog(postId);
        } else if (action.includes('repost')) {
          handleRepost(postId);
        }
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      // Update feed content
      updateFeed(tab.dataset.tab);
    });
  });

  // Initialize with "For You" tab
  updateFeed('foryou');
});

// Update trending emotions display
function updateTrendingEmotions() {
  const trendingContainer = document.querySelector('.trending-emotions');
  if (!trendingContainer) return;

  trendingContainer.innerHTML = trendingEmotions.map(emotion => `
    <div class="emotion-item">
      <span class="emotion-tag ${emotion.label.toLowerCase()}">${emotion.label}</span>
      <div class="progress-bar ${emotion.label.toLowerCase()}">
        <span style="width: ${emotion.percentage}%"></span>
      </div>
      <span class="percentage">+${emotion.percentage}%</span>
    </div>
  `).join('');
}

// ======== DARK MODE ========
function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const toggleIcon = darkModeToggle.querySelector('.material-symbols-outlined');
  const toggleText = darkModeToggle.querySelector('.toggle-text');
  
  // Check if user has a saved preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Apply saved preference if it exists
  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleIcon.textContent = 'light_mode';
    toggleText.textContent = 'Light Mode';
  }
  
  // Toggle dark mode
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? null : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleIcon.textContent = 'light_mode';
      toggleText.textContent = 'Light Mode';
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggleIcon.textContent = 'dark_mode';
      toggleText.textContent = 'Dark Mode';
      localStorage.setItem('darkMode', 'false');
    }
  });
}

// Initialize dark mode when the page loads
document.addEventListener('DOMContentLoaded', initDarkMode);

// Share dialog functionality
function initShareDialog() {
  const shareButton = document.getElementById('shareButton');
  const shareDialog = document.getElementById('shareDialog');
  const closeDialog = document.querySelector('.close-dialog');
  const cancelShare = document.querySelector('.cancel-share');
  const confirmShare = document.querySelector('.confirm-share');
  const emotionButtons = document.querySelectorAll('.emotion-btn');
  let selectedEmotion = null;

  // Show dialog when share button is clicked
  shareButton.addEventListener('click', () => {
    shareDialog.style.display = 'flex';
  });

  // Close dialog functions
  function closeShareDialog() {
    shareDialog.style.display = 'none';
    // Reset selections
    selectedEmotion = null;
    emotionButtons.forEach(btn => btn.classList.remove('selected'));
    document.querySelector('input[value="public"]').checked = true;
  }

  closeDialog.addEventListener('click', closeShareDialog);
  cancelShare.addEventListener('click', closeShareDialog);

  // Handle emotion selection
  emotionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove selected class from all buttons
      emotionButtons.forEach(btn => btn.classList.remove('selected'));
      // Add selected class to clicked button
      button.classList.add('selected');
      selectedEmotion = button.dataset.emotion;
    });
  });

  // Handle share confirmation
  confirmShare.addEventListener('click', () => {
    const privacy = document.querySelector('input[name="privacy"]:checked').value;
    const postData = {
      privacy: privacy,
      emotion: selectedEmotion,
      audioUrl: 'path/to/recorded/audio.mp3', // This would be your actual audio URL
      timestamp: new Date().toISOString()
    };

    console.log('Sharing post with settings:', postData);
    // Here you would typically send this data to your server
    
    // Close the dialog
    closeShareDialog();
    
    // Reset the recorder UI
    document.getElementById('status').textContent = 'Record your voice...';
    shareButton.disabled = true;
  });
}

// Update the existing record button click handler
document.getElementById('shareButton').addEventListener('click', (e) => {
  e.preventDefault();
  // Instead of sharing directly, show the share dialog
  document.getElementById('shareDialog').style.display = 'flex';
});

// Add styles for recording preview dialog
const recordingDialogStyles = document.createElement('style');
recordingDialogStyles.textContent = `
  .recording-options-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.98);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(20px);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .recording-options-dialog .dialog-content {
    background: linear-gradient(180deg, #1e293b, #0f172a);
    padding: 40px;
    border-radius: 32px;
    max-width: 520px;
    width: 92%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(148, 163, 184, 0.1);
  }

  .recording-options-dialog h3 {
    color: #fff;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 32px;
  }

  .recording-options-dialog .audio-preview {
    background: rgba(30, 41, 59, 0.3);
    border-radius: 100px;
    padding: 8px;
    margin-bottom: 48px;
  }

  .recording-options-dialog audio {
    width: 100%;
    height: 40px;
    border-radius: 100px;
  }

  .recording-options-dialog audio::-webkit-media-controls-panel {
    background: transparent;
  }

  .recording-options-dialog audio::-webkit-media-controls-play-button {
    background-color: #8b5cf6;
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }

  .recording-options-dialog audio::-webkit-media-controls-timeline {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    margin: 0 8px;
  }

  .recording-options-dialog audio::-webkit-media-controls-current-time-display,
  .recording-options-dialog audio::-webkit-media-controls-time-remaining-display {
    color: #fff;
  }

  .recording-options-dialog .detected-emotion {
    margin-bottom: 48px;
  }

  .recording-options-dialog .detected-emotion h4 {
    color: #fff;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .recording-options-dialog .emotion-indicator {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 100px;
    font-size: 16px;
    font-weight: 500;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.1);
  }

  .recording-options-dialog .emotion-indicator.EXCITED {
    color: #FF4D8D;
    background: rgba(255, 77, 141, 0.1);
    border-color: rgba(255, 77, 141, 0.2);
  }

  .recording-options-dialog .emotion-indicator.JOY {
    color: #E65100;
    background: rgba(230, 81, 0, 0.1);
    border-color: rgba(230, 81, 0, 0.2);
  }

  .recording-options-dialog .emotion-indicator.CALM {
    color: #4DD0E1;
    background: rgba(77, 208, 225, 0.1);
    border-color: rgba(77, 208, 225, 0.2);
  }

  .recording-options-dialog .emotion-indicator.ANNOYED {
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.1);
    border-color: rgba(255, 107, 107, 0.2);
  }

  .recording-options-dialog .emotion-indicator.SAD {
    color: #7C4DFF;
    background: rgba(124, 77, 255, 0.1);
    border-color: rgba(124, 77, 255, 0.2);
  }

  .recording-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .recording-actions .preview-btn,
  .recording-actions .discard-btn {
    grid-column: 1 / -1;
  }

  .recording-actions .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.1);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }

  .recording-actions .preview-btn {
    background: rgba(30, 41, 59, 0.3);
  }

  .recording-actions .edit-btn {
    background: rgba(56, 189, 248, 0.1);
  }

  .recording-actions .post-btn {
    background: rgba(34, 197, 94, 0.1);
  }

  .recording-actions .save-btn {
    background: rgba(139, 92, 246, 0.1);
  }

  .recording-actions .discard-btn {
    background: rgba(239, 68, 68, 0.1);
  }

  .recording-actions .action-btn:hover {
    transform: translateY(-1px);
    background: rgba(51, 65, 85, 0.4);
  }

  .recording-actions .action-btn:active {
    transform: translateY(0);
  }

  .recording-actions .action-btn .material-symbols-outlined {
    font-size: 20px;
    opacity: 0.9;
  }

  @keyframes dialogAppear {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

document.head.appendChild(recordingDialogStyles);

// Add styles for the new components
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .detected-emotion {
    margin-top: 16px;
    padding: 16px;
    background: var(--secondary-background);
    border-radius: 12px;
  }
  
  .detected-emotion h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: var(--text-color);
  }
  
  .emotion-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    width: fit-content;
  }
  
  .emotion-indicator.excited { background: #ffd7d7; color: #e74c3c; }
  .emotion-indicator.joy { background: rgba(230, 81, 0, 0.1); color: #E65100; }
  .emotion-indicator.calm { background: #d4e6f1; color: #3498db; }
  .emotion-indicator.annoyed { background: rgba(255, 107, 107, 0.1); color: #FF6B6B; }
  .emotion-indicator.sad { background: #e8daef; color: #9b59b6; }
  
  .audio-editor-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }
  
  .editor-content {
    background: var(--background-color);
    padding: 24px;
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
  }
  
  .waveform-editor {
    margin: 20px 0;
    padding: 16px;
    background: var(--secondary-background);
    border-radius: 12px;
  }
  
  .edit-tools {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 20px 0;
  }
  
  .tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: var(--secondary-color);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .tool-btn:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  .editor-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
  
  .editor-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .cancel-edit {
    background: var(--secondary-color);
    color: var(--text-color);
  }
  
  .save-edit {
    background: var(--primary-color);
    color: white;
  }
  
  .toast-message {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--background-color);
    color: var(--text-color);
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1002;
    animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s;
  }
  
  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

document.head.appendChild(additionalStyles);

// Add helper function to get emotion color
function getEmotionColor(emotion) {
  const emotionConfig = CONFIG.supportedEmotions.find(e => e.label === emotion);
  return emotionConfig ? emotionConfig.color : '#ffffff';
}

// Initialize UI elements and event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize profile button
  const profileLink = document.getElementById('profileLink');
  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update navigation
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      profileLink.classList.add('active');
      
      // Hide main content and show profile view
      const mainContent = document.querySelector('.main-content');
      const feedContainer = document.getElementById('feedContainer');
      const mainHeader = document.querySelector('.main-header');
      const voiceComposer = document.querySelector('.voice-composer');
      
      if (mainHeader) mainHeader.style.display = 'none';
      if (feedContainer) feedContainer.style.display = 'none';
      if (voiceComposer) voiceComposer.style.display = 'none';
      
      // Get the template content
      const profileTemplate = document.getElementById('profileViewTemplate');
      if (profileTemplate) {
        const profileView = document.importNode(profileTemplate.content, true);
        
        // Remove any existing profile view
        const existingProfileView = mainContent.querySelector('.profile-view');
        if (existingProfileView) {
          existingProfileView.remove();
        }
        
        // Append the new profile view
        mainContent.appendChild(profileView);
        
        // Initialize the profile view
        initProfileView();
      }
    });
  }

  // Handle navigation back to feed
  document.querySelectorAll('.nav-link:not(#profileLink)').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Show the main header and feed container
      const mainHeader = document.querySelector('.main-header');
      const feedContainer = document.getElementById('feedContainer');
      const mainContent = document.querySelector('.main-content');
      const voiceComposer = document.querySelector('.voice-composer');
      
      if (mainHeader) mainHeader.style.display = 'block';
      if (feedContainer) feedContainer.style.display = 'block';
      if (voiceComposer) voiceComposer.style.display = 'block';
      
      // Remove profile view if it exists
      const profileView = mainContent.querySelector('.profile-view');
      if (profileView) {
        profileView.remove();
      }
      
      // Update navigation
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Initialize live room navigation
  initializeLiveRoomNavigation();
});

function initializeActionButtons() {
  // Like buttons
  document.querySelectorAll('.action-btn[aria-label*="Like"]').forEach(button => {
    button.addEventListener('click', () => {
      const postId = button.closest('.voice-post').getAttribute('data-id');
      toggleLike(postId);
    });
  });
  
  // Reply buttons
  document.querySelectorAll('.action-btn[aria-label="Reply"]').forEach(button => {
    button.addEventListener('click', () => {
      const post = button.closest('.voice-post');
      showReplyDialog(post.getAttribute('data-id'));
    });
  });
  
  // Repost buttons
  document.querySelectorAll('.action-btn[aria-label="Repost"]').forEach(button => {
    button.addEventListener('click', () => {
      const post = button.closest('.voice-post');
      handleRepost(post.getAttribute('data-id'));
    });
  });
}

function showReplyDialog(postId) {
  const replyDialog = document.createElement('div');
  replyDialog.className = 'reply-dialog';
  replyDialog.innerHTML = `
    <div class="reply-content">
      <h3>Reply to Voice</h3>
      <div class="reply-composer">
        <button class="record-reply-btn">
          <span class="material-symbols-outlined">mic</span>
          Record Reply
        </button>
      </div>
      <div class="reply-actions">
        <button class="cancel-reply">Cancel</button>
        <button class="post-reply" disabled>Reply</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(replyDialog);
  
  // Add event listeners
  replyDialog.querySelector('.cancel-reply').addEventListener('click', () => {
    replyDialog.remove();
  });
}

function handleRepost(postId) {
  const post = document.querySelector(`.voice-post[data-id="${postId}"]`);
  const repostButton = post.querySelector('.action-btn[aria-label="Repost"]');
  const repostCount = repostButton.querySelector('.action-count');
  
  if (repostButton.classList.contains('active')) {
    repostButton.classList.remove('active');
    repostCount.textContent = parseInt(repostCount.textContent) - 1;
  } else {
    repostButton.classList.add('active');
    repostCount.textContent = parseInt(repostCount.textContent) + 1;
  }
}

// Profile View Functionality
function initProfileView() {
  // Hide live room banner and show profile content
  const liveRoomBanner = document.querySelector('.live-room-banner');
  if (liveRoomBanner) {
    liveRoomBanner.style.display = 'none';
  }

  // Profile data
  const profileData = {
    name: "Alex Morgan",
    handle: "@alexmorgan",
    voiceNotes: "5.2K",
    bio: "Voice creator sharing thoughts on technology, design, and everyday life. Join me on this audio journey!",
    avatar: "https://i.pravatar.cc/300?img=51",
    banner: "https://picsum.photos/800/200",
    joinDate: "February 2024",
    location: "San Francisco, CA",
    website: "alexmorgan.com",
    stats: {
      following: 342,
      followers: "5.2K"
    },
    voiceStats: {
      voiceNotes: 2,
      listens: "1.3K",
      reactions: 576,
      topEmotion: "Excited"
    },
    emotionSpectrum: [
      { emotion: "Excited", percentage: 50 },
      { emotion: "Calm", percentage: 50 },
      { emotion: "Joy", percentage: 0 },
      { emotion: "Annoyed", percentage: 0 },
      { emotion: "Sad", percentage: 0 }
    ],
    posts: [
      {
        id: 1,
        content: "Just finished the new design for our app's dashboard. Super excited about the clean layout and improved UX! Let me know what you think...",
        timestamp: "2h",
        emotion: "EXCITED",
        likes: 328,
        replies: 24,
        shares: 12,
        audioDuration: "0:42"
      }
    ]
  };

  // Update header
  const profileHeaderTop = document.querySelector('.profile-header-top');
  if (profileHeaderTop) {
    const title = profileHeaderTop.querySelector('.profile-title');
    if (title) {
      title.innerHTML = `
        <h1>${profileData.name}</h1>
        <div class="subtitle">${profileData.voiceNotes} Voice Notes</div>
      `;
    }
  }

  // Update profile info
  const profileInfo = document.querySelector('.profile-info-section');
  if (profileInfo) {
    const avatar = profileInfo.querySelector('.profile-avatar');
    if (avatar) {
      avatar.src = profileData.avatar;
      avatar.alt = profileData.name;
    }

    const details = profileInfo.querySelector('.profile-details');
    if (details) {
      details.innerHTML = `
        <h2>${profileData.name}</h2>
        <span class="profile-handle">${profileData.handle}</span>
        <p class="profile-bio">${profileData.bio}</p>
        <div class="profile-metadata">
          <span class="metadata-item">
            <span class="material-symbols-outlined">calendar_today</span>
            Joined ${profileData.joinDate}
          </span>
          <span class="metadata-item">
            <span class="material-symbols-outlined">location_on</span>
            ${profileData.location}
          </span>
          <span class="metadata-item">
            <span class="material-symbols-outlined">link</span>
            <a href="https://${profileData.website}" target="_blank">${profileData.website}</a>
          </span>
        </div>
        <div class="profile-stats">
          <a href="#" class="stat-link"><span class="stat-number">${profileData.stats.following}</span> Following</a>
          <a href="#" class="stat-link"><span class="stat-number">${profileData.stats.followers}</span> Followers</a>
        </div>
        <button class="edit-profile-btn">Edit Profile</button>
        <button class="more-options-btn">
          <span class="material-symbols-outlined">more_horiz</span>
        </button>
      `;
    }
  }

  // Update voice stats
  const voiceStats = document.querySelector('.voice-stats-card .stats-grid');
  if (voiceStats) {
    voiceStats.innerHTML = `
      <div class="stat-item">
        <div class="stat-icon">
          <span class="material-symbols-outlined">mic</span>
        </div>
        <div class="stat-value">${profileData.voiceStats.voiceNotes}</div>
        <div class="stat-label">Voice Notes</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <span class="material-symbols-outlined">chat</span>
        </div>
        <div class="stat-value">${profileData.voiceStats.listens}</div>
        <div class="stat-label">Listens</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <span class="material-symbols-outlined">favorite</span>
        </div>
        <div class="stat-value">${profileData.voiceStats.reactions}</div>
        <div class="stat-label">Reactions</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <span class="material-symbols-outlined">trending_up</span>
        </div>
        <div class="stat-value">${profileData.voiceStats.topEmotion}</div>
        <div class="stat-label">Top Emotion</div>
      </div>
    `;
  }

  // Update emotion spectrum
  const emotionList = document.querySelector('.emotion-spectrum-card .emotion-list');
  if (emotionList) {
    emotionList.innerHTML = profileData.emotionSpectrum.map(emotion => `
      <div class="emotion-item">
        <div class="emotion-label">${emotion.emotion}</div>
        <div class="emotion-bar-container">
          <div class="emotion-bar" style="width: ${emotion.percentage}%"></div>
        </div>
        <div class="emotion-percentage">${emotion.percentage}%</div>
      </div>
    `).join('');
  }

  // Load voice posts
  const tabContent = document.querySelector('.tab-content');
  if (tabContent) {
    tabContent.innerHTML = profileData.posts.map(post => createVoicePost(post)).join('');
  }

  // Initialize tab navigation
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      // Here you would load the appropriate content based on the selected tab
    });
  });
}

// Add styles for the preview dialog
const previewStyles = document.createElement('style');
previewStyles.textContent = `
  .recording-preview-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }

  .preview-content {
    background: #000000;
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 480px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    color: #fff;
  }

  .preview-label {
    color: #71767b;
    font-size: 14px;
  }

  .close-preview {
    background: none;
    border: none;
    color: #71767b;
    cursor: pointer;
    padding: 8px;
  }

  .audio-preview {
    margin: 20px 0;
    padding: 16px;
    background: #16181c;
    border-radius: 16px;
  }

  .audio-player {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .play-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #1d9bf0;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .play-button:hover {
    background: #1a8cd8;
  }

  .waveform {
    flex-grow: 1;
    height: 40px;
    background: #16181c;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 16px;
  }

  .time-display {
    color: #fff;
    font-size: 14px;
    margin-right: 12px;
    font-variant-numeric: tabular-nums;
  }

  .progress-bar {
    flex-grow: 1;
    height: 4px;
    background: rgba(29, 155, 240, 0.2);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
  }

  .progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #1d9bf0;
    border-radius: 2px;
    width: 0%;
    transition: width 0.1s linear;
  }

  .preview-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-group {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .edit-btn, .post-btn {
    flex: 1;
  }

  .edit-btn {
    background: rgba(239, 243, 244, 0.1);
    color: #fff;
  }

  .post-btn {
    background: #1d9bf0;
    color: white;
  }

  .save-btn {
    background: rgba(239, 243, 244, 0.1);
    color: #fff;
  }

  .discard-btn {
    background: rgba(244, 33, 46, 0.1);
    color: rgb(244, 33, 46);
  }

  .toast-message {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(29, 155, 240, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1001;
    animation: fadeInUp 0.3s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

document.head.appendChild(previewStyles);

// Add this at the beginning of the file after other imports
document.head.insertAdjacentHTML('beforeend', '<script src="bitmojis.js"></script>');

// Update the createFeedItem function to use Bitmojis
function createFeedItem(item) {
  const feedItem = document.createElement('div');
  feedItem.className = 'card';
  
  const header = document.createElement('div');
  header.className = 'feed-header';
  
  const userSection = document.createElement('div');
  userSection.className = 'feed-user';
  
  // Create Bitmoji avatar
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'bitmoji-container post-avatar';
  avatarContainer.innerHTML = getBitmoji(item.bitmoji || 'default');
  
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  
  const userName = document.createElement('div');
  userName.className = 'feed-user-name';
  userName.textContent = item.userName;
  
  const timeStamp = document.createElement('div');
  timeStamp.className = 'feed-time';
  timeStamp.textContent = item.time;
  
  userInfo.appendChild(userName);
  userInfo.appendChild(timeStamp);
  
  userSection.appendChild(avatarContainer);
  userSection.appendChild(userInfo);
  
  const emotionBadge = document.createElement('div');
  emotionBadge.className = `emotion-badge ${item.emotion.toLowerCase()}`;
  emotionBadge.textContent = item.emotion;
  
  header.appendChild(userSection);
  header.appendChild(emotionBadge);
  
  // Audio area with title
  const audioContainer = document.createElement("div");
  audioContainer.classList.add("audio-container");
  
  const audioTitle = document.createElement("div");
  audioTitle.classList.add("audio-title");
  audioTitle.textContent = item.audioTitle;
  audioContainer.appendChild(audioTitle);
  
  const audioElem = document.createElement("audio");
  audioElem.controls = true;
  audioElem.src = item.audioUrl;
  audioElem.classList.add("audio-controls");
  audioElem.setAttribute("aria-label", `${item.userName}'s audio message: ${item.audioTitle}`);
  audioElem.preload = "metadata"; // Only load metadata initially
  audioContainer.appendChild(audioElem);
  
  // Add loading indicator for audio
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("audio-loading");
  loadingIndicator.textContent = "Loading audio...";
  audioContainer.appendChild(loadingIndicator);
  
  // Handle audio events
  audioElem.addEventListener("loadeddata", () => {
    loadingIndicator.style.display = "none";
  });
  
  audioElem.addEventListener("error", () => {
    loadingIndicator.textContent = "Error loading audio";
    loadingIndicator.classList.add("error");
  });
  
  // Actions
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("feed-actions");
  
  const likeBtn = document.createElement("button");
  const isLiked = state.likes.has(item.id);
  likeBtn.setAttribute("aria-label", isLiked ? "Unlike this post" : "Like this post");
  likeBtn.innerHTML = `<span class="material-symbols-outlined" style="color: ${isLiked ? '#e74c3c' : '#666'}">${isLiked ? 'favorite' : 'favorite_border'}</span> ${isLiked ? 'Liked' : 'Like'}`;
  likeBtn.addEventListener("click", () => toggleLike(item.id));
  
  const replyBtn = document.createElement("button");
  replyBtn.setAttribute("aria-label", "Reply to this post");
  replyBtn.innerHTML = `<span class="material-symbols-outlined">chat</span> Reply`;
  
  actionsDiv.appendChild(likeBtn);
  actionsDiv.appendChild(replyBtn);
  
  // Replies section
  if (item.replies && item.replies.length > 0) {
    const repliesContainer = document.createElement("div");
    repliesContainer.classList.add("replies-container");
    
    const repliesTitle = document.createElement("div");
    repliesTitle.classList.add("replies-title");
    repliesTitle.textContent = "Replies";
    repliesContainer.appendChild(repliesTitle);
    
    item.replies.forEach(reply => {
      const replyDiv = document.createElement("div");
      replyDiv.classList.add("reply-item");
      
      const replyHeader = document.createElement("div");
      replyHeader.classList.add("reply-header");
      
      const replyUserName = document.createElement("span");
      replyUserName.classList.add("reply-username");
      replyUserName.textContent = reply.userName;
      
      const replyTime = document.createElement("span");
      replyTime.classList.add("reply-time");
      replyTime.textContent = reply.time;
      
      replyHeader.appendChild(replyUserName);
      replyHeader.appendChild(replyTime);
      
      const replyText = document.createElement("div");
      replyText.classList.add("reply-text");
      replyText.textContent = reply.text;
      
      replyDiv.appendChild(replyHeader);
      replyDiv.appendChild(replyText);
      repliesContainer.appendChild(replyDiv);
    });
    
    card.appendChild(actionsDiv);
    card.appendChild(repliesContainer);
  } else {
    card.appendChild(actionsDiv);
  }
  
  // Append header and audio container to card
  card.appendChild(header);
  card.appendChild(audioContainer);
  
  // Add card to feed
  feedContainer.appendChild(card);
}

// Update the sample feed data to include Bitmoji types
const sampleFeedData = [
  {
    id: 1,
    userName: "Sarah Chen",
    time: "2h",
    content: "The new AI features we're adding to the platform are mind-blowing! Check out this demo...",
    emotion: "EXCITED",
    bitmoji: "sarah",
    likes: 128,
    comments: 24,
    shares: 12
  },
  {
    id: 2,
    userName: "Marcus Johnson",
    time: "3h",
    content: "Just released our latest design system update. The components are so much more flexible now!",
    emotion: "JOY",
    bitmoji: "marcus",
    likes: 89,
    comments: 15,
    shares: 8
  },
  {
    id: 3,
    userName: "Elena Rodriguez",
    time: "4h",
    content: "Reflecting on our user research findings. Some fascinating insights about how people use voice interfaces.",
    emotion: "CALM",
    bitmoji: "elena",
    likes: 156,
    comments: 32,
    shares: 18
  }
];

// Live Room Navigation Handler
function initializeLiveRoomNavigation() {
  // Handle nav bar live room link
  const liveRoomLink = document.querySelector('.nav-link span.material-symbols-outlined[innerHTML="campaign"]').parentElement;
  if (liveRoomLink) {
    liveRoomLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'liveroom.html';
    });
  }

  // Handle join room button if it exists
  const joinRoomBtn = document.querySelector('.join-room-btn');
  if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'liveroom.html';
    });
  }
}

// Add this at the beginning of the file, right after the CONFIG object
document.addEventListener('click', function(e) {
  // Check if clicked element is the live room link or its children
  const liveRoomLink = e.target.closest('.nav-link');
  if (liveRoomLink && liveRoomLink.querySelector('span.material-symbols-outlined').textContent === 'campaign') {
    e.preventDefault();
    window.location.href = 'liveroom.html';
  }
});

function generateWaveform() {
  const waveform = document.createElement('div');
  waveform.className = 'waveform';
  
  // Generate bars for the waveform
  for (let i = 0; i < 40; i++) {
    const height = Math.floor(Math.random() * 40) + 10;
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    bar.style.height = `${height}px`;
    // Add bar index for staggered animation
    bar.style.setProperty('--bar-index', i);
    waveform.appendChild(bar);
  }
  
  return waveform;
}
