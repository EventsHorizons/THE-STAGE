document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Mode Toggles: Showcase vs Focus
  const btnShowcase = document.getElementById("btn-showcase");
  const btnFocus = document.getElementById("btn-focus");
  const showcaseContainer = document.getElementById("showcase-container");
  const screens = document.querySelectorAll(".mobile-screen-wrapper");

  btnShowcase.addEventListener("click", () => {
    btnShowcase.classList.add("active");
    btnFocus.classList.remove("active");
    showcaseContainer.classList.remove("focus-mode");
    screens.forEach(s => s.classList.remove("focus-active"));
  });

  btnFocus.addEventListener("click", () => {
    btnFocus.classList.add("active");
    btnShowcase.classList.remove("active");
    showcaseContainer.classList.add("focus-mode");
    // Default focus the middle screen (Artist Profile)
    screens.forEach((s, idx) => {
      if (idx === 1) s.classList.add("focus-active");
      else s.classList.remove("focus-active");
    });
  });

  // Clicking a screen in Focus Mode centers/highlights it
  screens.forEach(screen => {
    screen.addEventListener("click", () => {
      if (showcaseContainer.classList.contains("focus-mode")) {
        screens.forEach(s => s.classList.remove("focus-active"));
        screen.classList.add("focus-active");
      }
    });
  });

  /* ---------------------------------------------------- */
  /* SCREEN 1: SPOTLIGHT FEED ACTIONS                     */
  /* ---------------------------------------------------- */
  const bookmarkBtn = document.getElementById("action-bookmark");
  const bookmarkCount = bookmarkBtn.querySelector(".action-count");
  const bookmarkIcon = bookmarkBtn.querySelector("i");
  let bookmarked = false;

  bookmarkBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    bookmarked = !bookmarked;
    if (bookmarked) {
      bookmarkBtn.classList.add("bookmarked");
      bookmarkIcon.setAttribute("data-lucide", "bookmark-check");
      bookmarkCount.textContent = "12.5k";
      createToast("Spotlight bookmarked!");
    } else {
      bookmarkBtn.classList.remove("bookmarked");
      bookmarkIcon.setAttribute("data-lucide", "bookmark");
      bookmarkCount.textContent = "12.4k";
    }
    lucide.createIcons();
  });

  const shareBtn = document.getElementById("action-share");
  shareBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    createToast("Link copied to clipboard!");
  });

  const matchBtn = document.getElementById("action-match");
  matchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    createToast("Instant Match Request sent to Elena Rostova! ⚡");
  });

  // "View Portfolio" navigates and focuses on the Profile screen
  const viewPortfolioBtn = document.getElementById("btn-view-portfolio");
  viewPortfolioBtn.addEventListener("click", () => {
    createToast("Transitioning to Elena Rostova's Profile...");
    // Highlight profile screen
    screens.forEach(s => s.classList.remove("focus-active"));
    const profileScreen = document.querySelector('[data-screen="profile"]');
    profileScreen.classList.add("focus-active");
    
    // Auto-scroll screen into view on smaller screens
    profileScreen.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------------------------------------------------- */
  /* SCREEN 2: ARTIST PROFILE BENTO PLAYER                */
  /* ---------------------------------------------------- */
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playIcon = document.getElementById("play-icon");
  const waveformProgress = document.querySelector(".waveform-progress");
  const waveformBars = document.querySelectorAll(".audio-waveform-container .bar");
  let isPlaying = false;
  let playInterval = null;
  let progressPercent = 0;

  // Enhance waveform visualization dynamically
  const totalBars = 35;
  const barsContainer = document.querySelector(".waveform-bars");
  barsContainer.innerHTML = ""; // Clear fallback
  
  const waveformData = [
    25, 45, 60, 40, 80, 95, 50, 75, 30, 85, 70, 45, 90, 35, 65, 80, 50, 75, 40, 90,
    30, 55, 70, 40, 85, 95, 60, 75, 35, 80, 65, 45, 90, 25, 60
  ];

  waveformData.forEach((heightVal) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${heightVal}%`;
    barsContainer.appendChild(bar);
  });

  const activeBars = barsContainer.querySelectorAll(".bar");

  playPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.setAttribute("data-lucide", "pause");
      createToast("Playing Elena Rostova — Capricho Árabe 🎵");
      
      // Simulate audio play progress
      playInterval = setInterval(() => {
        progressPercent += 0.5;
        if (progressPercent > 100) {
          progressPercent = 0;
        }
        waveformProgress.style.width = `${progressPercent}%`;
        
        // Active coloring on bars passed by player
        const activeBarLimit = Math.floor((progressPercent / 100) * totalBars);
        activeBars.forEach((bar, idx) => {
          if (idx <= activeBarLimit) {
            bar.style.backgroundColor = "var(--accent-burgundy-light)";
          } else {
            bar.style.backgroundColor = "var(--text-muted)";
          }
        });
      }, 50);
    } else {
      playIcon.setAttribute("data-lucide", "play");
      clearInterval(playInterval);
      createToast("Playback paused.");
    }
    lucide.createIcons();
  });

  // Handle clicking direct on waveform to seek
  document.getElementById("waveform-trigger").addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    progressPercent = (clickX / width) * 100;
    waveformProgress.style.width = `${progressPercent}%`;
    
    const activeBarLimit = Math.floor((progressPercent / 100) * totalBars);
    activeBars.forEach((bar, idx) => {
      if (idx <= activeBarLimit) {
        bar.style.backgroundColor = "var(--accent-burgundy-light)";
      } else {
        bar.style.backgroundColor = "var(--text-muted)";
      }
    });
  });

  // Casting CTA Action
  const inviteCastingBtn = document.querySelector(".invite-casting-btn");
  inviteCastingBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    createToast("Casting invite sent to Elena Rostova! ✉️");
  });

  /* ---------------------------------------------------- */
  /* SCREEN 3: SCOUT DASHBOARD FILTERS & SEARCH           */
  /* ---------------------------------------------------- */
  const chips = document.querySelectorAll(".filter-chips .chip");
  const talentCards = document.querySelectorAll(".talent-grid .talent-card");
  const talentSearch = document.getElementById("talent-search");

  // Filter chips click handler
  chips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const filterValue = chip.getAttribute("data-filter");
      filterTalent(filterValue, talentSearch.value.trim().toLowerCase());
    });
  });

  // Talent Search input handler
  talentSearch.addEventListener("input", () => {
    const activeChip = document.querySelector(".filter-chips .chip.active");
    const filterValue = activeChip ? activeChip.getAttribute("data-filter") : "all";
    filterTalent(filterValue, talentSearch.value.trim().toLowerCase());
  });

  function filterTalent(filterTag, searchKeyword) {
    talentCards.forEach(card => {
      const cardTags = card.getAttribute("data-tags").split(" ");
      const cardName = card.querySelector(".talent-card-name").textContent.toLowerCase();
      const cardRole = card.querySelector(".talent-card-role").textContent.toLowerCase();

      // Check Tag match
      const matchesTag = (filterTag === "all") || cardTags.includes(filterTag);
      // Check Keyword match
      const matchesSearch = !searchKeyword || cardName.includes(searchKeyword) || cardRole.includes(searchKeyword);

      if (matchesTag && matchesSearch) {
        card.classList.remove("filtered-out");
      } else {
        card.classList.add("filtered-out");
      }
    });
  }

  // Double click talent card or click action triggers profile highlight
  talentCards.forEach(card => {
    const btn = card.querySelector(".card-action-btn");
    const name = card.querySelector(".talent-card-name").textContent;

    const selectTalent = (e) => {
      e.stopPropagation();
      createToast(`Viewing ${name}'s complete portfolio profile...`);
      // Update screen 2 headers for demo variety if Elena is clicked, or keep simple toggle
      screens.forEach(s => s.classList.remove("focus-active"));
      const profileScreen = document.querySelector('[data-screen="profile"]');
      profileScreen.classList.add("focus-active");
      profileScreen.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    card.addEventListener("dblclick", selectTalent);
    btn.addEventListener("click", selectTalent);
  });

  /* ---------------------------------------------------- */
  /* SYSTEM: PREMIUM FLOATING TOAST SYSTEM               */
  /* ---------------------------------------------------- */
  function createToast(message) {
    // Remove existing toast if present
    const oldToast = document.querySelector(".premium-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "premium-toast";
    toast.innerHTML = `
      <div class="toast-accent"></div>
      <div class="toast-message">${message}</div>
    `;

    document.body.appendChild(toast);

    // Dynamic style insertion if not existing
    if (!document.getElementById("toast-styles")) {
      const style = document.createElement("style");
      style.id = "toast-styles";
      style.innerHTML = `
        .premium-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: rgba(22, 22, 26, 0.9);
          border: 1px solid rgba(122, 6, 34, 0.4);
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 15px rgba(122, 6, 34, 0.2);
          opacity: 0;
          animation: slideUpToast 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          font-size: 13px;
          font-weight: 600;
          pointer-events: none;
        }
        .toast-accent {
          width: 8px;
          height: 8px;
          background: #7A0622;
          border-radius: 50%;
          box-shadow: 0 0 8px #7A0622;
        }
        @keyframes slideUpToast {
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto dismiss
    setTimeout(() => {
      toast.style.animation = "slideDownToast 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards";
      if (!document.getElementById("toast-dismiss-styles")) {
        const style = document.createElement("style");
        style.id = "toast-dismiss-styles";
        style.innerHTML = `
          @keyframes slideDownToast {
            to {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
          }
        `;
        document.head.appendChild(style);
      }
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
