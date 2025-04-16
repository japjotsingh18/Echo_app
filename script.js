<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Echo - Voice Social Platform</title>
  <!-- Link to external CSS -->
  <link rel="stylesheet" href="style.css" />
  <!-- Google Material Icons -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
  <div class="layout">
    <!-- Left Sidebar -->
    <nav class="sidebar-left">
      <div class="logo-container">
        <div class="logo">
          <div class="echo-logo">
            <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
              <!-- Sound Wave Icon -->
              <g class="sound-wave" transform="translate(20, 55)">
                <rect x="0" y="12" width="4" height="20"/>
                <rect x="8" y="8" width="4" height="30"/>
                <rect x="16" y="0" width="4" height="45"/>
                <rect x="24" y="8" width="4" height="30"/>
                <rect x="32" y="12" width="4" height="20"/>
              </g>
              
              <!-- Echo Text -->
              <text x="60" y="95" class="logo-text">Echo</text>
              
              <!-- Emotions Unmuted Text -->
              <text x="60" y="125" class="logo-subtext">EMOTIONS UNMUTED</text>
            </svg>
          </div>
        </div>
      </div>
      <div class="nav-links">
        <a href="#" class="nav-link active">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">notifications</span>
          <span>Notifications</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">mail</span>
          <span>Messages</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">auto_stories</span>
          <span>Voice Stories</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">campaign</span>
          <span>Live Rooms</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">mood</span>
          <span>Emotion Filter</span>
        </a>
        <a href="#" class="nav-link">
          <span class="material-symbols-outlined">bookmark</span>
          <span>Saved</span>
        </a>
        <a href="#" class="nav-link" id="profileLink">
          <span class="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
        <button id="darkModeToggle" class="dark-mode-toggle">
          <span class="material-symbols-outlined">dark_mode</span>
          <span class="toggle-text">Dark Mode</span>
        </button>
        <button class="record-btn">
          <span class="material-symbols-outlined">mic</span>
          Record
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Live Room Banner -->
      <div class="live-room-banner">
        <div class="live-room-icon">
          <div class="wave-icon">
            <span class="material-symbols-outlined">graphic_eq</span>
          </div>
        </div>
        <h2 class="live-room-title">Live Room</h2>
        <p class="live-room-description">Join the conversation about music production techniques</p>
        <div class="live-room-stats">
          <div class="stat">
            <span class="material-symbols-outlined">group</span>
            42 listeners
          </div>
          <div class="stat">
            <span class="material-symbols-outlined">mic</span>
            5 speakers
          </div>
        </div>
        <button class="join-room-btn" onclick="window.location.href='liveroom.html'">
          <span class="material-symbols-outlined">mic</span>
          Join Room
        </button>
      </div>

      <header class="main-header">
        <div class="tabs">
          <button class="tab-btn active" data-tab="foryou">For You</button>
          <button class="tab-btn" data-tab="trending">Trending</button>
          <button class="tab-btn" data-tab="following">Following</button>
        </div>
      </header>

      <!-- Voice Composer -->
      <div class="voice-composer">
        <div class="composer-header">
          <div class="bitmoji-container user-avatar">
            <svg viewBox="0 0 100 100" class="bitmoji">
              <circle cx="50" cy="50" r="45" fill="#FFD180"/>
              <circle cx="50" cy="45" r="35" fill="#FFAB40"/>
              <circle cx="35" cy="40" r="5" fill="#212121"/>
              <circle cx="65" cy="40" r="5" fill="#212121"/>
              <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="composer-prompt">What's happening?</div>
        </div>
        <div class="record-controls">
          <button id="recordButton" class="control-btn" aria-label="Start Recording">
            <span class="material-symbols-outlined">mic</span>
            <span>Record Voice</span>
          </button>
          <button id="stopButton" class="control-btn" disabled aria-label="Stop Recording">
            <span class="material-symbols-outlined">stop</span>
            <span>Stop</span>
          </button>
          <button id="playButton" class="control-btn" disabled aria-label="Play Recording">
            <span class="material-symbols-outlined">play_arrow</span>
            <span>Preview</span>
          </button>
        </div>
        <div class="composer-footer">
          <div id="status" class="status-text">Record your voice...</div>
          <button id="shareButton" class="share-btn" disabled>Share</button>
        </div>

        <!-- Share Options Dialog -->
        <div id="shareDialog" class="share-dialog" style="display: none;">
          <div class="share-dialog-content">
            <div class="dialog-header">
              <h3>Share Your Voice</h3>
              <button class="close-dialog" aria-label="Close dialog">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div class="privacy-options">
              <h4>Who can see this?</h4>
              <div class="option-list">
                <label class="privacy-option">
                  <input type="radio" name="privacy" value="public" checked>
                  <span class="material-symbols-outlined">public</span>
                  <div class="option-text">
                    <strong>Everyone</strong>
                    <span>Anyone on Echo can see this</span>
                  </div>
                </label>
                
                <label class="privacy-option">
                  <input type="radio" name="privacy" value="followers">
                  <span class="material-symbols-outlined">group</span>
                  <div class="option-text">
                    <strong>Followers only</strong>
                    <span>Only your followers can see this</span>
                  </div>
                </label>
                
                <label class="privacy-option">
                  <input type="radio" name="privacy" value="private">
                  <span class="material-symbols-outlined">lock</span>
                  <div class="option-text">
                    <strong>Private</strong>
                    <span>Only you can see this</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="emotion-selection">
              <h4>How are you feeling?</h4>
              <div class="emotion-list">
                <button class="emotion-btn" data-emotion="excited">
                  <span class="material-symbols-outlined">sentiment_excited</span>
                  Excited
                </button>
                <button class="emotion-btn" data-emotion="joy">
                  <span class="material-symbols-outlined">sentiment_very_satisfied</span>
                  Joy
                </button>
                <button class="emotion-btn" data-emotion="calm">
                  <span class="material-symbols-outlined">sentiment_satisfied</span>
                  Calm
                </button>
                <button class="emotion-btn" data-emotion="annoyed">
                  <span class="material-symbols-outlined">sentiment_dissatisfied</span>
                  Annoyed
                </button>
                <button class="emotion-btn" data-emotion="sad">
                  <span class="material-symbols-outlined">sentiment_sad</span>
                  Sad
                </button>
              </div>
            </div>

            <div class="dialog-footer">
              <button class="cancel-share">Cancel</button>
              <button class="confirm-share">Share Voice</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div id="feedContainer" class="feed"></div>

      <!-- Profile View Template (Initially Hidden) -->
      <template id="profileViewTemplate">
        <div class="profile-view">
          <!-- Header with name and settings -->
          <div class="profile-header-top">
            <div class="profile-title">
              <h1>Alex Morgan</h1>
              <div class="subtitle">5.2K Voice Notes</div>
            </div>
            <button class="settings-btn">
              <span class="material-symbols-outlined">settings</span>
            </button>
          </div>

          <!-- Profile Banner -->
          <div class="profile-banner">
            <div class="banner-gradient"></div>
          </div>

          <!-- Profile Info Section -->
          <div class="profile-info-section">
            <div class="profile-avatar-container">
              <div class="bitmoji-container profile-avatar">
                <svg viewBox="0 0 100 100" class="bitmoji">
                  <circle cx="50" cy="50" r="45" fill="#FFD180"/>
                  <circle cx="50" cy="45" r="35" fill="#FFAB40"/>
                  <circle cx="35" cy="40" r="5" fill="#212121"/>
                  <circle cx="65" cy="40" r="5" fill="#212121"/>
                  <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            
            <div class="profile-details">
              <h2>Alex Morgan</h2>
              <span class="profile-handle">@alexmorgan</span>
              
              <p class="profile-bio">
                Voice creator sharing thoughts on technology, design, and everyday life. Join me on this audio journey!
              </p>
              
              <div class="profile-metadata">
                <span class="metadata-item">
                  <span class="material-symbols-outlined">calendar_today</span>
                  Joined February 2024
                </span>
                <span class="metadata-item">
                  <span class="material-symbols-outlined">location_on</span>
                  San Francisco, CA
                </span>
                <span class="metadata-item">
                  <span class="material-symbols-outlined">link</span>
                  <a href="https://alexmorgan.com" target="_blank">alexmorgan.com</a>
                </span>
              </div>

              <div class="profile-stats">
                <a href="#" class="stat-link"><span class="stat-number">342</span> Following</a>
                <a href="#" class="stat-link"><span class="stat-number">5.2K</span> Followers</a>
              </div>

              <button class="edit-profile-btn">Edit Profile</button>
              <button class="more-options-btn">
                <span class="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
          </div>

          <!-- Voice Stats Card -->
          <div class="voice-stats-card">
            <h3>Voice Stats</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">mic</span>
                </div>
                <div class="stat-value">2</div>
                <div class="stat-label">Voice Notes</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">chat</span>
                </div>
                <div class="stat-value">1.3K</div>
                <div class="stat-label">Listens</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">favorite</span>
                </div>
                <div class="stat-value">576</div>
                <div class="stat-label">Reactions</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">trending_up</span>
                </div>
                <div class="stat-value">Excited</div>
                <div class="stat-label">Top Emotion</div>
              </div>
            </div>
          </div>

          <!-- Emotion Spectrum -->
          <div class="emotion-spectrum-card">
            <h3>Your Emotion Spectrum</h3>
            <div class="emotion-list">
              <div class="emotion-item">
                <div class="emotion-label">Excited</div>
                <div class="emotion-bar-container">
                  <div class="emotion-bar" style="width: 50%"></div>
                </div>
                <div class="emotion-percentage">50%</div>
              </div>
              <div class="emotion-item">
                <div class="emotion-label">Calm</div>
                <div class="emotion-bar-container">
                  <div class="emotion-bar" style="width: 50%"></div>
                </div>
                <div class="emotion-percentage">50%</div>
              </div>
              <div class="emotion-item">
                <div class="emotion-label">Joy</div>
                <div class="emotion-bar-container">
                  <div class="emotion-bar" style="width: 0%"></div>
                </div>
                <div class="emotion-percentage">0%</div>
              </div>
              <div class="emotion-item">
                <div class="emotion-label">Annoyed</div>
                <div class="emotion-bar-container">
                  <div class="emotion-bar" style="width: 0%"></div>
                </div>
                <div class="emotion-percentage">0%</div>
              </div>
              <div class="emotion-item">
                <div class="emotion-label">Sad</div>
                <div class="emotion-bar-container">
                  <div class="emotion-bar" style="width: 0%"></div>
                </div>
                <div class="emotion-percentage">0%</div>
              </div>
            </div>
          </div>

          <!-- Profile Tabs -->
          <div class="profile-tabs">
            <nav class="tab-nav">
              <a href="#" class="tab-link active">Voice Notes</a>
              <a href="#" class="tab-link">Replies</a>
              <a href="#" class="tab-link">Favorites</a>
            </nav>
            
            <div class="tab-content">
              <!-- Voice posts will be loaded here -->
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Right Sidebar -->
    <aside class="sidebar-right">
      <!-- Search Bar -->
      <div class="search-container">
        <span class="material-symbols-outlined">search</span>
        <input type="search" placeholder="Search Echo">
      </div>

      <!-- Trending Emotions -->
      <div class="trending-card">
        <h2>Trending Emotions</h2>
        <div class="trending-emotions">
          <div class="emotion-item">
            <span class="label">Excited</span>
            <div class="progress-bar excited">
              <span style="width: 80%"></span>
            </div>
            <span class="percentage">+24%</span>
          </div>
          <div class="emotion-item">
            <span class="label">Joy</span>
            <div class="progress-bar joy">
              <span style="width: 65%"></span>
            </div>
            <span class="percentage">+18%</span>
          </div>
          <div class="emotion-item">
            <span class="label">Calm</span>
            <div class="progress-bar calm">
              <span style="width: 45%"></span>
            </div>
            <span class="percentage">+12%</span>
          </div>
          <div class="emotion-item">
            <span class="label">Annoyed</span>
            <div class="progress-bar annoyed">
              <span style="width: 25%"></span>
            </div>
            <span class="percentage">+3%</span>
          </div>
          <div class="emotion-item">
            <span class="label">Sad</span>
            <div class="progress-bar sad">
              <span style="width: 35%"></span>
            </div>
            <span class="percentage">+5%</span>
          </div>
        </div>
      </div>

      <!-- Trending Voices -->
      <div class="trending-card">
        <h2>Trending Voices</h2>
        <div class="voices-list">
          <div class="voice-item">
            <div class="bitmoji-container post-avatar" data-bitmoji="sarah">
              <svg viewBox="0 0 100 100" class="bitmoji">
                <circle cx="50" cy="50" r="45" fill="#FFE0B2"/>
                <path d="M20 40 h60 v25 q-30 20 -60 0 v-25" fill="#4A148C"/>
                <circle cx="35" cy="40" r="5" fill="#212121"/>
                <circle cx="65" cy="40" r="5" fill="#212121"/>
                <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
                <path d="M15 30 q35 -20 70 0" fill="#3E2723" stroke="none"/>
              </svg>
            </div>
            <div class="voice-info">
              <div class="voice-name">Sarah Chen</div>
              <div class="voice-bio">Tech enthusiast & podcaster</div>
            </div>
          </div>
          <div class="voice-item">
            <div class="bitmoji-container post-avatar" data-bitmoji="marcus">
              <svg viewBox="0 0 100 100" class="bitmoji">
                <circle cx="50" cy="50" r="45" fill="#8D6E63"/>
                <path d="M20 30 h60 v10 q-30 20 -60 0 v-10" fill="#212121"/>
                <circle cx="35" cy="40" r="5" fill="#212121"/>
                <circle cx="65" cy="40" r="5" fill="#212121"/>
                <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
                <path d="M25 25 h50" stroke="#212121" stroke-width="5"/>
              </svg>
            </div>
            <div class="voice-info">
              <div class="voice-name">Marcus Johnson</div>
              <div class="voice-bio">Music producer & vocalist</div>
            </div>
          </div>
          <div class="voice-item">
            <div class="bitmoji-container post-avatar" data-bitmoji="elena">
              <svg viewBox="0 0 100 100" class="bitmoji">
                <circle cx="50" cy="50" r="45" fill="#FFCCBC"/>
                <path d="M15 35 q35 -30 70 0" fill="#FF5722" stroke="none"/>
                <circle cx="35" cy="40" r="5" fill="#212121"/>
                <circle cx="65" cy="40" r="5" fill="#212121"/>
                <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="voice-info">
              <div class="voice-name">Elena Rodriguez</div>
              <div class="voice-bio">Storyteller & voice artist</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Who to Follow -->
      <div class="follow-card">
        <h2>Who to Follow</h2>
        <div class="voices-list">
          <div class="voice-item">
            <div class="bitmoji-container post-avatar" data-bitmoji="david">
              <svg viewBox="0 0 100 100" class="bitmoji">
                <circle cx="50" cy="50" r="45" fill="#FFE0B2"/>
                <path d="M20 30 h60 v15 q-30 20 -60 0 v-15" fill="#424242"/>
                <circle cx="35" cy="40" r="5" fill="#212121"/>
                <circle cx="65" cy="40" r="5" fill="#212121"/>
                <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
                <rect x="20" y="20" width="60" height="5" fill="#F57C00"/>
              </svg>
            </div>
            <div class="voice-info">
              <div class="voice-name">David Kim</div>
              <div class="voice-bio">Audio engineer & creator</div>
            </div>
          </div>
          <div class="voice-item">
            <div class="bitmoji-container post-avatar" data-bitmoji="maya">
              <svg viewBox="0 0 100 100" class="bitmoji">
                <circle cx="50" cy="50" r="45" fill="#FFCCBC"/>
                <path d="M15 35 q35 -20 70 0" fill="#795548" stroke="none"/>
                <circle cx="35" cy="40" r="5" fill="#212121"/>
                <circle cx="65" cy="40" r="5" fill="#212121"/>
                <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
                <circle cx="50" cy="25" r="8" fill="#FF9800"/>
              </svg>
            </div>
            <div class="voice-info">
              <div class="voice-name">Maya Patel</div>
              <div class="voice-bio">Voice coach & mentor</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>

  <!-- Auth Modal -->
  <div class="auth-modal" id="authModal" style="display: none;">
    <div class="auth-form">
      <div class="auth-header">
        <h2>Login</h2>
        <button class="close-btn" onclick="closeAuthModal()" aria-label="Close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Password" required>
      <button onclick="handleLogin()">Login</button>
      <p class="toggle-form">Need an account? Sign up</p>
    </div>
  </div>

  <!-- Link to external JavaScript -->
  <script src="bitmojis.js"></script>
  <script src="script.js"></script>
</body>
</html>
