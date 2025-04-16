/******************
 *  SIMPLE ECHO APP SIMULATION
 *  - Handles audio recording (MediaRecorder)
 *  - Simulates emotion detection
 *  - Displays feed items
 ******************/

/* ======== COLOR VARIABLES ======== */
:root {
  /* Light mode (default) colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F9F9;
  --text-primary: #0F1419;
  --text-secondary: #536471;
  --border-color: #EFF3F4;
  --card-bg: #FFFFFF;
  --nav-bg: #FFFFFF;
  --emotion-badge-bg: #F7F9F9;
  --bg-accent: rgba(29, 161, 242, 0.1);
  
  /* Accent Colors */
  --primary: #1DA1F2;
  --primary-light: #E8F5FE;
  --primary-dark: #D63484;
  
  /* Emotion Colors */
  --emotion-excited: #FF4D8D;
  --emotion-joy: #FF7043;
  --emotion-calm: #4DD0E1;
  --emotion-annoyed: #EF4444;
  --emotion-sad: #7C4DFF;
  
  /* Border Colors */
  --border-light: rgba(0, 0, 0, 0.1);
  --border-focus: rgba(255, 75, 145, 0.5);
}

/* Dark mode colors */
[data-theme="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #000000;
  --text-primary: #FFFFFF;
  --text-secondary: #8899A6;
  --border-color: #2F3336;
  --card-bg: #000000;
  --nav-bg: #000000;
  --emotion-badge-bg: #1A1A1A;
  
  /* Dark mode specific overrides */
  --primary-light: rgba(29, 161, 242, 0.1);
  --border-light: rgba(255, 255, 255, 0.1);
  --border-focus: rgba(255, 255, 255, 0.2);
}

/* ======== BASIC RESET & GLOBAL ======== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  background-image: 
    radial-gradient(circle at 100% 0%, var(--bg-accent) 0%, transparent 20%),
    radial-gradient(circle at 0% 100%, var(--bg-accent) 0%, transparent 20%);
  background-attachment: fixed;
  line-height: 1.4;
}

/* ======== NAVBAR ======== */
.navbar {
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  height: 60px;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid var(--border-light);
}

.logo {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0 12px;
  color: var(--primary);
}

.echo-logo {
  width: 100%;
  height: 100%;
}

.echo-logo svg {
  width: 100%;
  height: 100%;
}

/* Sound wave styles */
.sound-wave {
  fill: currentColor;
}

.sound-wave rect {
  transform-origin: bottom;
  animation: waveAnimation 1.2s ease-in-out infinite;
}

/* Logo text styles */
.logo-text {
  font-family: 'Arial', sans-serif;
  font-size: 42px;
  font-weight: 500;
  font-style: italic;
  fill: currentColor;
}

.logo-subtext {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  fill: currentColor;
  text-transform: uppercase;
}

/* Wave animation timing - slightly faster */
.sound-wave rect:nth-child(1) { animation-delay: 0.0s; }
.sound-wave rect:nth-child(2) { animation-delay: 0.15s; }
.sound-wave rect:nth-child(3) { animation-delay: 0.3s; }
.sound-wave rect:nth-child(4) { animation-delay: 0.45s; }
.sound-wave rect:nth-child(5) { animation-delay: 0.6s; }

@keyframes waveAnimation {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

/* Dark mode adjustments */
[data-theme="dark"] .logo {
  color: white;
}

[data-theme="dark"] .logo-text,
[data-theme="dark"] .logo-subtext {
  fill: white;
}

.nav-icons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px;
}

.nav-icons button {
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-weight: 500;
}

/* Sign Up button specific styles */
.nav-icons .signup-btn {
  background: var(--bg-secondary);
  color: var(--primary);
  border: none;
}

.nav-icons .signup-btn:hover {
  background: rgba(255,255,255,0.9);
  transform: translateY(-1px);
}

/* Login button specific styles */
.nav-icons .login-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--text-primary);
}

.nav-icons .login-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-1px);
}

/* ======== MAIN CONTAINER ======== */
.container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
  padding: 0 20px;
}

/* ======== FEED SECTION ======== */
.feed {
  flex: 1;
  max-width: 700px;
}

/* Tabs */
.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 53px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
}

.tab-btn:hover {
  background-color: var(--bg-secondary);
}

.tab-btn.active {
  font-weight: 700;
  color: var(--text-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 4px;
  background-color: var(--primary);
  border-radius: 9999px;
}

/* Share Voice Card */
.share-voice {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.share-voice:hover {
  border-color: var(--border-focus);
  box-shadow: 0 4px 12px rgba(255, 75, 145, 0.1);
}

.share-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-prompt {
  color: var(--text-secondary);
  font-size: 16px;
}

.record-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.record-controls button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: var(--bg-accent);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
}

.record-controls button:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

.record-controls button:hover:not(:disabled) {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.emotion-tag {
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.emotion-tag.excited {
  background-color: #FF4D8D;  /* Pink */
}

.emotion-tag.joy {
  background-color: #FF7043;  /* Coral red */
}

.emotion-tag.calm {
  background-color: #4DD0E1;  /* Light blue */
}

.emotion-tag.annoyed {
  background-color: #EF4444;  /* Red */
}

.emotion-tag.sad {
  background-color: #7C4DFF;  /* Purple */
}

/* Dark mode emotion tags - slightly lighter variants */
[data-theme="dark"] .emotion-tag.excited {
  background-color: #FF6AA3;
}

[data-theme="dark"] .emotion-tag.joy {
  background-color: #FF8585;
}

[data-theme="dark"] .emotion-tag.calm {
  background-color: #65D8E4;
}

[data-theme="dark"] .emotion-tag.annoyed {
  background-color: #FF8585;
}

[data-theme="dark"] .emotion-tag.sad {
  background-color: #9466FF;
}

/* Feed Container / Cards */
#feedContainer {
  margin-top: 20px;
}

.card {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  animation: fadeInUp 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Feed Item Layout */
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.feed-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e0e0e0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feed-user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.feed-time {
  color: var(--text-secondary);
  font-size: 14px;
}

.emotion-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.emotion-badge.excited {
  color: var(--emotion-excited);
  background: rgba(255, 77, 141, 0.1);
}

.emotion-badge.joy {
  color: var(--emotion-joy);
  background: rgba(255, 112, 67, 0.1);
}

.emotion-badge.calm {
  color: var(--emotion-calm);
  background: rgba(77, 208, 225, 0.1);
}

.emotion-badge.annoyed {
  color: var(--emotion-annoyed);
  background: rgba(239, 68, 68, 0.1);
}

.emotion-badge.sad {
  color: var(--emotion-sad);
  background: rgba(124, 77, 255, 0.1);
}

/* Dark mode emotion badges */
[data-theme="dark"] .emotion-badge.excited {
  color: #FF85B6;
  background: rgba(255, 77, 141, 0.15);
}

[data-theme="dark"] .emotion-badge.joy {
  color: #FFD166;
  background: rgba(255, 112, 67, 0.15);
}

[data-theme="dark"] .emotion-badge.calm {
  color: #48D1E8;
  background: rgba(77, 208, 225, 0.15);
}

[data-theme="dark"] .emotion-badge.annoyed {
  color: #FF8585;
  background: rgba(239, 68, 68, 0.15);
}

[data-theme="dark"] .emotion-badge.sad {
  color: #A685FF;
  background: rgba(124, 77, 255, 0.15);
}

/* Audio Player */
.audio-controls {
  width: 100%;
  margin: 10px 0;
  border-radius: 8px;
}

/* Custom audio player styling for dark mode */
[data-theme="dark"] .audio-container,
[data-theme="dark"] .audio-player {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

[data-theme="dark"] audio {
  -webkit-appearance: none;
  background-color: #1A1A1A;
}

[data-theme="dark"] audio::-webkit-media-controls-enclosure {
  background-color: #1A1A1A;
  border-radius: 12px;
}

[data-theme="dark"] audio::-webkit-media-controls-panel {
  background-color: #1A1A1A !important;
}

/* Make all control icons pure white */
[data-theme="dark"] audio::-webkit-media-controls-play-button,
[data-theme="dark"] audio::-webkit-media-controls-mute-button,
[data-theme="dark"] audio::-webkit-media-controls-overflow-button {
  -webkit-filter: grayscale(1) brightness(2) !important;
  filter: grayscale(1) brightness(2) !important;
  background-color: transparent !important;
  color: white !important;
  fill: white !important;
  opacity: 1 !important;
}

/* Specific styling for overflow button */
[data-theme="dark"] audio::-webkit-media-controls-overflow-button {
  -webkit-filter: invert(1);
  filter: invert(1);
  color: white;
}

[data-theme="dark"] audio::-webkit-media-controls-overflow-button:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Hide unnecessary buttons */
[data-theme="dark"] audio::-webkit-media-controls-toggle-closed-captions-button,
[data-theme="dark"] audio::-webkit-media-controls-fullscreen-button,
[data-theme="dark"] audio::-webkit-media-controls-return-to-realtime-button {
  display: none !important;
}

/* Timeline styling */
[data-theme="dark"] audio::-webkit-media-controls-timeline {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  height: 4px;
  margin: 0 8px;
}

/* Time display */
[data-theme="dark"] audio::-webkit-media-controls-current-time-display,
[data-theme="dark"] audio::-webkit-media-controls-time-remaining-display {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

/* Timeline and volume slider */
[data-theme="dark"] audio::-webkit-media-controls-timeline,
[data-theme="dark"] audio::-webkit-media-controls-volume-slider {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  height: 4px;
}

/* Timeline and volume slider thumb */
[data-theme="dark"] audio::-webkit-media-controls-timeline::-webkit-slider-thumb,
[data-theme="dark"] audio::-webkit-media-controls-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #FFFFFF;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}

/* Volume slider container */
[data-theme="dark"] audio::-webkit-media-controls-volume-control-container {
  background-color: transparent !important;
  padding: 0 8px !important;
}

/* Audio container wrapper */
[data-theme="dark"] .audio-wrapper {
  background-color: #111111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
}

/* Custom progress bar */
[data-theme="dark"] .audio-progress {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  height: 4px;
  margin: 10px 0;
  position: relative;
  width: 100%;
}

[data-theme="dark"] .audio-progress-bar {
  background-color: #FFFFFF;
  border-radius: 2px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.1s linear;
}

/* Hover states */
[data-theme="dark"] audio::-webkit-media-controls-play-button:hover,
[data-theme="dark"] audio::-webkit-media-controls-mute-button:hover {
  opacity: 1;
}

[data-theme="dark"] .audio-container {
  background-color: #1A1A1A;
  border-radius: 16px;
  padding: 12px 16px;
  margin: 16px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] audio {
  width: 100%;
  height: 40px;
}

[data-theme="dark"] audio::-webkit-media-controls-panel {
  background-color: #1A1A1A;
  border-radius: 12px;
}

[data-theme="dark"] audio::-webkit-media-controls-enclosure {
  background-color: #1A1A1A;
  border-radius: 12px;
}

/* Play button styling */
[data-theme="dark"] audio::-webkit-media-controls-play-button {
  background-color: transparent;
  width: 40px;
  height: 40px;
  filter: invert(1);
  opacity: 0.9;
}

/* Time display */
[data-theme="dark"] audio::-webkit-media-controls-current-time-display,
[data-theme="dark"] audio::-webkit-media-controls-time-remaining-display {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 400;
  padding: 0 8px;
}

/* Timeline */
[data-theme="dark"] audio::-webkit-media-controls-timeline-container {
  padding: 0;
}

[data-theme="dark"] audio::-webkit-media-controls-timeline {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  height: 4px;
  margin: 0 8px;
}

/* Volume controls */
[data-theme="dark"] audio::-webkit-media-controls-volume-slider-container,
[data-theme="dark"] audio::-webkit-media-controls-volume-control-container {
  background-color: transparent;
  padding: 0 8px;
}

[data-theme="dark"] audio::-webkit-media-controls-volume-slider {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  height: 4px;
}

[data-theme="dark"] audio::-webkit-media-controls-mute-button,
[data-theme="dark"] audio::-webkit-media-controls-overflow-button {
  -webkit-filter: grayscale(1) brightness(2) !important;
  filter: grayscale(1) brightness(2) !important;
  opacity: 1 !important;
  background-color: transparent !important;
}

/* Menu button (three dots) */
[data-theme="dark"] audio::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

[data-theme="dark"] audio::-webkit-media-controls-fullscreen-button {
  display: none;
}

/* Hover states */
[data-theme="dark"] audio::-webkit-media-controls-play-button:hover,
[data-theme="dark"] audio::-webkit-media-controls-mute-button:hover,
[data-theme="dark"] audio::-webkit-media-controls-toggle-closed-captions-button:hover,
[data-theme="dark"] audio::-webkit-media-controls-fullscreen-button:hover {
  opacity: 1;
}

/* Progress bar fill color */
[data-theme="dark"] audio::-webkit-slider-thumb,
[data-theme="dark"] audio::-webkit-media-controls-timeline::-webkit-slider-thumb {
  background-color: #FFFFFF;
  border-radius: 50%;
  width: 12px;
  height: 12px;
}

/* Custom progress container */
[data-theme="dark"] .audio-progress-container {
  background-color: rgba(255, 255, 255, 0.1);
  height: 4px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  margin: 0 16px;
}

[data-theme="dark"] .audio-progress-fill {
  background-color: #FFFFFF;
  height: 100%;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
}

/* Feed Actions */
.feed-actions {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.feed-actions button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
}

.feed-actions button:hover {
  color: var(--primary);
  background-color: var(--bg-primary);
}

/* Replies Section */
.replies-container {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.replies-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.reply-item {
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.reply-username {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.reply-time {
  color: #666;
  font-size: 12px;
}

.reply-text {
  color: #444;
  font-size: 14px;
  line-height: 1.4;
}

/* Update Feed Actions for like button */
.feed-actions button .material-symbols-outlined {
  transition: all 0.2s;
}

.feed-actions button:hover .material-symbols-outlined {
  transform: scale(1.1);
}

.feed-actions button[aria-label="Unlike this post"] {
  color: #e74c3c;
}

.feed-actions button[aria-label="Unlike this post"]:hover {
  background-color: #fee;
}

/* ======== SIDEBAR ======== */
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  animation: fadeInUp 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.sidebar-card h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

/* Trending Emotions */
.trending-emotions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.emotion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.emotion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.emotion-item .label {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 15px;
  width: 80px; /* Fixed width for consistent alignment */
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: 100px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 100px;
  transition: width 0.3s ease;
}

.percentage {
  width: 50px; /* Fixed width for consistent alignment */
  text-align: right;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Progress bar colors */
.progress-bar.excited span { 
  background: var(--emotion-excited);
}

.progress-bar.joy span { 
  background: var(--emotion-joy);
}

.progress-bar.calm span { 
  background: var(--emotion-calm);
}

.progress-bar.annoyed span { 
  background: var(--emotion-annoyed);
}

.progress-bar.sad span { 
  background: var(--emotion-sad);
}

/* Trending Voices and Who to Follow */
.trending-card,
.follow-card {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.trending-card h2,
.follow-card h2 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.voices-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.voice-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 0 rgba(0,0,0,0);
  cursor: pointer;
}

.voice-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.voice-item .post-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.voice-info {
  flex: 1;
}

.voice-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 15px;
  margin-bottom: 2px;
}

.voice-bio {
  color: var(--text-secondary);
  font-size: 14px;
}

/* ======== MEDIA QUERIES (Responsive) ======== */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .feed {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 10px;
  }
  .tabs {
    overflow-x: auto;
    padding-bottom: 5px;
  }
  .record-controls {
    flex-direction: column;
  }
}

/* ======== ACCESSIBILITY ======== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ======== LOADING STATES ======== */
.loading {
  position: relative;
  opacity: 0.7;
  pointer-events: none;
}

.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border: 2px solid #7a4dd6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ======== AUTHENTICATION ======== */
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-form {
  background-color: var(--bg-secondary);
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
}

.auth-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  position: absolute;
  right: -12px;
  top: -4px;
}

.close-btn:hover {
  color: var(--text-primary);
}

.close-btn .material-symbols-outlined {
  font-size: 24px;
}

.auth-form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.auth-form button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary);
  color: var(--bg-secondary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.auth-form button:hover {
  background-color: var(--primary-dark);
}

.auth-form .toggle-form {
  margin-top: 16px;
  text-align: center;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
}

/* ======== PAGINATION ======== */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
}

.pagination button {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #7a4dd6;
  color: #fff;
  border-color: #7a4dd6;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Audio Container */
.audio-container {
  margin: 15px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.audio-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.audio-controls {
  width: 100%;
  height: 36px;
  border-radius: 18px;
}

/* Custom audio player styling */
audio::-webkit-media-controls-panel {
  background-color: #fff;
}

audio::-webkit-media-controls-play-button {
  background-color: #7a4dd6;
  border-radius: 50%;
}

audio::-webkit-media-controls-play-button:hover {
  background-color: #6a3cc6;
}

/* Loading indicator */
.audio-loading {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.audio-loading.error {
  color: #e74c3c;
  animation: none;
  background-color: #fee;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* Scroll Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animate replies */
.reply-item:nth-child(1) { animation-delay: 0.1s; }
.reply-item:nth-child(2) { animation-delay: 0.2s; }
.reply-item:nth-child(3) { animation-delay: 0.3s; }

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Infinite scroll loader */
.infinite-scroll-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-size: 14px;
  color: #666;
  gap: 10px;
}

.infinite-scroll-loader .spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #7a4dd6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Progress bar for scroll position */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(122, 77, 214, 0.1);
  z-index: 1000;
}

.scroll-progress-bar {
  height: 100%;
  background: #7a4dd6;
  width: 0%;
  transition: width 0.2s ease;
}

/* Animate progress bars */
@keyframes progressFill {
  from {
    width: 0;
  }
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, 
    #f0f0f0 25%, 
    #e0e0e0 50%, 
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 14px;
  margin-bottom: 8px;
  width: 100%;
}

.skeleton-text:last-child {
  width: 80%;
}

/* Voice Posts */
.voice-post {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.voice-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--accent-color);
}

.voice-post:hover .play-button {
  transform: translateY(-50%) scale(1.05);
  background-color: var(--accent-color);
}

.voice-post:hover .waveform-bar {
  animation: pulse 1s ease-in-out infinite;
  animation-delay: calc(var(--bar-index) * 0.1s);
}

@keyframes pulse {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.2);
  }
  100% {
    transform: scaleY(1);
  }
}

.play-button {
  transition: all 0.3s ease;
}

.waveform-bar {
  transition: all 0.2s ease;
  --bar-index: 0;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  gap: 12px;
}

.post-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.post-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-author {
  font-weight: 600;
  color: #1a1a1a;
}

.post-handle, .post-time {
  color: var(--text-secondary);
  font-size: 15px;
}

.more-options {
  margin-left: auto;
  background: none;
  border: none;
  color: #536471;
  cursor: pointer;
  padding: 4px;
}

.emotion-tag {
  background-color: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
}

.post-content {
  margin-bottom: 16px;
}

.post-text {
  color: #0f172a;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

.audio-container {
  margin: 16px 0;
  background: #1E1E1E;
  border-radius: 8px;
  overflow: hidden;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-button .material-symbols-outlined {
  font-size: 24px;
}

.waveform {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 3px;
  height: 40px;
}

.waveform-bar {
  flex: 1;
  height: 24px;
  background: #e2e8f0;
  border-radius: 2px;
}

.audio-time {
  color: #64748b;
  font-size: 0.875rem;
  min-width: 80px;
  text-align: right;
}

.post-actions {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.action-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-count {
  color: var(--text-secondary);
  font-size: 15px;
}

.like-btn:hover {
  color: #ef4444;
}

.reply-btn:hover {
  color: #3b82f6;
}

.repost-btn:hover {
  color: #22c55e;
}

/* Dark mode styles */
[data-theme="dark"] .voice-post {
  background: var(--bg-secondary);
}

[data-theme="dark"] .post-author {
  color: #f8fafc;
}

[data-theme="dark"] .post-text {
  color: #e2e8f0;
}

[data-theme="dark"] .audio-container {
  background: var(--bg-secondary);
}

[data-theme="dark"] .waveform-bar {
  background: #334155;
}

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 275px 1fr 350px;
  min-height: 100vh;
  max-width: 1265px;
  margin: 0 auto;
}

/* Left Sidebar */
.sidebar-left {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
}

.logo-container {
  padding: 12px;
  width: 100%;
}

.logo {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0 12px;
  color: var(--primary);
}

.echo-logo {
  width: 100%;
  height: 100%;
}

.echo-logo svg {
  width: 100%;
  height: 100%;
}

/* Sound wave styles */
.sound-wave {
  fill: currentColor;
}

.sound-wave rect {
  transform-origin: bottom;
  animation: waveAnimation 1.2s ease-in-out infinite;
}

/* Logo text styles */
.logo-text {
  font-family: 'Arial', sans-serif;
  font-size: 42px;
  font-weight: 500;
  font-style: italic;
  fill: currentColor;
}

.logo-subtext {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  fill: currentColor;
  text-transform: uppercase;
}

/* Wave animation timing - slightly faster */
.sound-wave rect:nth-child(1) { animation-delay: 0.0s; }
.sound-wave rect:nth-child(2) { animation-delay: 0.15s; }
.sound-wave rect:nth-child(3) { animation-delay: 0.3s; }
.sound-wave rect:nth-child(4) { animation-delay: 0.45s; }
.sound-wave rect:nth-child(5) { animation-delay: 0.6s; }

@keyframes waveAnimation {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

/* Dark mode adjustments */
[data-theme="dark"] .logo {
  color: white;
}

[data-theme="dark"] .logo-text,
[data-theme="dark"] .logo-subtext {
  fill: white;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  margin-top: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px;
  border-radius: 9999px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 20px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: var(--bg-secondary);
}

.nav-link.active {
  font-weight: 700;
}

.record-btn {
  margin-top: 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 9999px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.record-btn:hover {
  background-color: #1a8cd8;
}

/* Main Content */
.main-content {
  border-right: 1px solid var(--border-color);
  min-height: 100vh;
}

.main-header {
  position: sticky;
  top: 0;
  background-color: var(--nav-bg);
  backdrop-filter: blur(12px);
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

/* Voice Composer */
.voice-composer {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.composer-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.composer-prompt {
  color: var(--text-secondary);
  font-size: 20px;
}

.record-controls {
  display: flex;
  gap: 8px;
  margin-left: 60px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  background: none;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover:not(:disabled) {
  background-color: var(--bg-secondary);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  margin-left: 60px;
}

.share-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.5;
}

.share-btn:not(:disabled) {
  opacity: 1;
}

.share-btn:hover:not(:disabled) {
  background-color: #1a8cd8;
}

/* Right Sidebar */
.sidebar-right {
  padding: 12px 16px;
}

/* Search Container */
.search-container {
  position: relative;
  margin-bottom: 16px;
  width: 100%;
}

.search-container .material-symbols-outlined {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 20px;
  pointer-events: none;
}

.search-container input[type="search"] {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.2s ease;
}

.search-container input[type="search"]::placeholder {
  color: var(--text-secondary);
}

.search-container input[type="search"]:focus {
  outline: none;
  background-color: var(--bg-primary);
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

[data-theme="dark"] .search-container input[type="search"] {
  background-color: #111111;
  border-color: #222222;
  color: #FFFFFF;
}

[data-theme="dark"] .search-container input[type="search"]:focus {
  background-color: #1A1A1A;
  border-color: #333333;
}

/* Cards in Right Sidebar */
.premium-card,
.trending-card,
.follow-card {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.premium-card h2,
.trending-card h2,
.follow-card h2 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
}

.premium-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
}

.premium-btn:hover {
  background-color: #1a8cd8;
}

/* Dark mode toggle button */
.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 20px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 8px 0;
}

.dark-mode-toggle:hover {
  background: var(--bg-primary);
  border-color: var(--primary);
}

.dark-mode-toggle .material-symbols-outlined {
  font-size: 24px;
}

.dark-mode-toggle .toggle-text {
  font-size: 20px;
  font-weight: 400;
}

/* Update main content areas */
[data-theme="dark"] .main-content,
[data-theme="dark"] .sidebar-left,
[data-theme="dark"] .sidebar-right {
  background-color: var(--bg-primary);
}

[data-theme="dark"] .main-header {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(16px);
}

/* Update cards and containers */
[data-theme="dark"] .card,
[data-theme="dark"] .voice-composer,
[data-theme="dark"] .trending-card,
[data-theme="dark"] .follow-card,
[data-theme="dark"] .premium-card,
[data-theme="dark"] .sidebar-card,
[data-theme="dark"] .auth-form {
  background-color: #111111;
  border: 1px solid #222222;
}

/* Update hover states */
[data-theme="dark"] .nav-link:hover,
[data-theme="dark"] .voice-item:hover,
[data-theme="dark"] .privacy-option:hover,
[data-theme="dark"] .emotion-btn:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Update dialog backgrounds */
[data-theme="dark"] .share-dialog {
  background-color: rgba(0, 0, 0, 0.85);
}

[data-theme="dark"] .share-dialog-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

/* Update search input */
[data-theme="dark"] .search-container input[type="search"] {
  background-color: #111111;
  border-color: #222222;
  color: #FFFFFF;
}

[data-theme="dark"] .search-container input[type="search"]:focus {
  background-color: #1A1A1A;
  border-color: #333333;
}

/* Update audio player */
[data-theme="dark"] .audio-container,
[data-theme="dark"] .audio-player {
  background-color: var(--bg-secondary);
}

[data-theme="dark"] audio::-webkit-media-controls-panel {
  background-color: var(--bg-secondary);
}

/* Update trending emotions section */
[data-theme="dark"] .trending-emotions {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

[data-theme="dark"] .emotion-item {
  transition: background-color 0.2s ease;
}

[data-theme="dark"] .emotion-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Progress bar background */
[data-theme="dark"] .progress-bar {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Emotion badges */
.emotion-badge.joy {
  color: var(--emotion-joy);
  background: rgba(255, 112, 67, 0.1);
}

/* Progress bars */
.progress-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  height: 8px;
  overflow: hidden;
  width: 100%;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 100px;
  transition: width 0.3s ease;
}

/* Dark mode overrides */
[data-theme="dark"] .progress-bar.joy span {
  background: var(--emotion-joy);
}

[data-theme="dark"] .emotion-item.joy .label {
  color: var(--emotion-joy);
}

/* Audio control buttons */
[data-theme="dark"] .audio-control-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

[data-theme="dark"] .audio-control-button:hover {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .audio-control-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Audio icons */
[data-theme="dark"] .audio-icon {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

[data-theme="dark"] .audio-icon:hover {
  opacity: 0.9;
}

/* Menu button (three dots) - Updated */
[data-theme="dark"] audio::-webkit-media-controls-overflow-button {
  -webkit-appearance: none !important;
  appearance: none !important;
  filter: brightness(0) invert(1) !important;
  -webkit-filter: brightness(0) invert(1) !important;
  background-color: transparent !important;
  width: 32px !important;
  height: 32px !important;
  padding: 4px !important;
  margin: 0 4px !important;
  opacity: 1 !important;
}

[data-theme="dark"] audio::-webkit-media-controls-panel {
  background-color: #1A1A1A !important;
}

/* Ensure the icon is visible in both light and dark modes */
[data-theme="dark"] audio::-webkit-media-controls-overflow-button::before {
  content: "⋮" !important;
  font-size: 24px !important;
  color: #FFFFFF !important;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5) !important;
}

/* Hide unnecessary controls */
[data-theme="dark"] audio::-webkit-media-controls-toggle-closed-captions-button,
[data-theme="dark"] audio::-webkit-media-controls-fullscreen-button {
  display: none !important;
}

/* Audio controls styling */
[data-theme="dark"] audio::-webkit-media-controls-panel {
  background-color: #1A1A1A !important;
}

/* Target each control button individually */
[data-theme="dark"] audio::-webkit-media-controls-play-button,
[data-theme="dark"] audio::-webkit-media-controls-mute-button,
[data-theme="dark"] audio::-webkit-media-controls-overflow-button {
  filter: invert(100%) !important;
  -webkit-filter: invert(100%) !important;
  fill: white !important;
  color: white !important;
  background-color: transparent !important;
}

/* Hide unnecessary buttons */
[data-theme="dark"] audio::-webkit-media-controls-toggle-closed-captions-button,
[data-theme="dark"] audio::-webkit-media-controls-fullscreen-button {
  display: none !important;
}

/* Dark mode hover effects */
[data-theme="dark"] .trending-emotions .emotion-item:hover,
[data-theme="dark"] .voice-item:hover {
  box-shadow: 0 4px 12px rgba(255,255,255,0.1);
}

/* Profile View Styles */
.profile-view {
  background-color: var(--bg-primary);
  min-height: 100vh;
}

.profile-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.profile-title h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.profile-title .subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.settings-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background-color: var(--bg-secondary);
}

.profile-banner {
  height: 200px;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  position: relative;
}

.banner-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
}

.profile-info-section {
  padding: 0 16px;
  margin-top: -80px;
  position: relative;
  margin-bottom: 16px;
}

.profile-avatar-container {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  overflow: hidden;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.profile-handle {
  font-size: 15px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 12px;
}

.profile-bio {
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.profile-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 14px;
}

.metadata-item .material-symbols-outlined {
  font-size: 18px;
}

.metadata-item a {
  color: var(--primary);
  text-decoration: none;
}

.metadata-item a:hover {
  text-decoration: underline;
}

.profile-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.stat-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
}

.stat-link:hover {
  text-decoration: underline;
}

.stat-number {
  color: var(--text-primary);
  font-weight: 700;
}

.edit-profile-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.edit-profile-btn:hover {
  background: var(--bg-secondary);
}

.more-options-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px;
}

.more-options-btn:hover {
  background: var(--bg-secondary);
}

/* Voice Stats Card */
.voice-stats-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  margin: 0 16px 16px;
}

.voice-stats-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.stat-icon .material-symbols-outlined {
  font-size: 20px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Emotion Spectrum Card */
.emotion-spectrum-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  margin: 0 16px 16px;
}

.emotion-spectrum-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.emotion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.emotion-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.emotion-label {
  width: 80px;
  font-size: 15px;
  color: var(--text-primary);
}

.emotion-bar-container {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.emotion-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.emotion-percentage {
  width: 48px;
  text-align: right;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Profile Tabs */
.profile-tabs {
  margin-top: 16px;
  border-top: 1px solid var(--border-color);
}

.tab-nav {
  display: flex;
  gap: 32px;
  padding: 0 16px;
}

.tab-link {
  padding: 16px 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  position: relative;
}

.tab-link.active {
  color: var(--primary);
}

.tab-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary);
  border-radius: 4px 4px 0 0;
}

.tab-content {
  padding: 16px;
}

/* Dark Mode Adjustments */
[data-theme="dark"] .profile-view {
  background: var(--bg-primary);
}

[data-theme="dark"] .avatar-container {
  border-color: var(--bg-primary);
}

[data-theme="dark"] .voice-stats-item,
[data-theme="dark"] .emotion-item .progress-bar {
  background: var(--bg-secondary);
}

/* Bitmoji Styles */
.bitmoji-container {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bitmoji-container:hover {
  transform: scale(1.05) rotate(-5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.bitmoji-container svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* SVG Animation */
.bitmoji-container svg path,
.bitmoji-container svg circle {
  transition: all 0.3s ease;
}

.bitmoji-container:hover svg path[fill="#FFD180"],
.bitmoji-container:hover svg path[fill="#4A148C"],
.bitmoji-container:hover svg path[fill="#3E2723"],
.bitmoji-container:hover svg path[fill="#212121"],
.bitmoji-container:hover svg path[fill="#FF9800"],
.bitmoji-container:hover svg path[fill="#795548"] {
  transform: translateY(-2px);
}

.bitmoji-container:hover svg path[fill="#FF5252"],
.bitmoji-container:hover svg path[fill="#6A1B9A"],
.bitmoji-container:hover svg path[fill="#FF5722"],
.bitmoji-container:hover svg path[fill="#424242"],
.bitmoji-container:hover svg path[fill="#F57C00"],
.bitmoji-container:hover svg path[fill="#8D6E63"] {
  transform: scale(1.1);
}

/* Dark mode adjustments */
[data-theme="dark"] .bitmoji-container {
  background: var(--bg-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .bitmoji-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Profile avatar size override */
.profile-avatar-container .bitmoji-container {
  width: 140px;
  height: 140px;
}

/* Live Room Banner */
.live-room-banner {
  background: linear-gradient(135deg, #9333EA, #E11D48);
  border-radius: 16px;
  padding: 24px;
  margin: 16px;
  color: white;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.live-room-banner:hover {
  transform: translateY(-2px);
}

.live-room-banner .close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.live-room-banner .close-btn:hover {
  color: white;
}

.live-room-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.live-room-description {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.live-room-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 15px;
  opacity: 0.9;
}

.live-room-stats .stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.join-room-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #9333EA;
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s ease;
}

.join-room-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.live-room-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.wave-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.listeners-avatars {
  display: flex;
  align-items: center;
}

.listener-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  margin-right: -8px;
  background: rgba(255, 255, 255, 0.2);
}
