/* ======== BASIC RESET & GLOBAL ======== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: sans-serif;
  background-color: #f7f1ff;
  color: #333;
}

/* ======== NAVBAR ======== */
.navbar {
  display: flex;
  align-items: center;
  background-color: #7a4dd6;
  color: #fff;
  height: 60px;
  padding: 0 20px;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  margin-right: auto;
}
.nav-icons span {
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
}

/* ======== MAIN CONTAINER ======== */
.container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
}

/* ======== FEED SECTION ======== */
.feed {
  flex: 1; /* Takes remaining space */
  max-width: 700px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tab-btn {
  background-color: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.2s;
}
.tab-btn:hover {
  background-color: #e3d6fb;
}
.tab-btn.active {
  background-color: #7a4dd6;
  color: #fff;
}

/* Share Voice Card */
.share-voice {
  text-align: center;
}
.record-controls {
  margin-top: 10px;
}
.record-controls button {
  background-color: #663399;
  color: #fff;
  margin: 5px;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.record-controls button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

/* Feed Container / Cards */
#feedContainer {
  margin-top: 20px;
}
.card {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

/* Feed Item Layout */
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.feed-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.feed-user .avatar {
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
}
.feed-user-name {
  font-weight: bold;
}
.feed-time {
  color: #999;
  font-size: 14px;
}
.emotion-badge {
  background-color: #7a4dd6;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
}
.waveform {
  margin-top: 10px;
  height: 40px;
  background: linear-gradient(90deg, rgba(0,0,0,0.05) 10%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 90%);
  border-radius: 5px;
  animation: wave 1s infinite;
  border: 2px solid #7a4dd6;
}

/* Waveform animation */
@keyframes wave {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Interaction buttons under the waveform */
.feed-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}
.feed-actions button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #7a4dd6;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ======== SIDEBAR ======== */
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

/* Trending Emotions */
.trending-emotions {
  list-style: none;
  margin-top: 10px;
}
.emotion-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.label {
  width: 60px;
  font-weight: 500;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 6px;
  margin: 0 10px;
  position: relative;
}
.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 6px;
}
.percentage {
  width: 40px;
  font-size: 14px;
  text-align: right;
}
.progress-bar.excited span {
  background-color: #e74c3c; /* Red */
}
.progress-bar.joy span {
  background-color: #f1c40f; /* Yellow-ish */
}
.progress-bar.calm span {
  background-color: #3498db; /* Blue */
}
.progress-bar.annoyed span {
  background-color: #e67e22; /* Orange */
}
.progress-bar.sad span {
  background-color: #9b59b6; /* Purple */
}

/* Voices to Follow */
.voices-list {
  list-style: none;
  margin-top: 10px;
}
.voice-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.voice-item .avatar {
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 10px;
}

/* ======== MEDIA QUERIES (Responsive) ======== */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    gap: 10px;
  }
}
