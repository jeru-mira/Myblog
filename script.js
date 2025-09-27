document.addEventListener('DOMContentLoaded', () => {

    // Get all the necessary elements from the page
    const videoPosts = document.querySelectorAll('.video-post');
    const overlay = document.getElementById('video-player-overlay');
    const videoPlayer = document.getElementById('main-video-player');
    const youtubePlayer = document.getElementById('youtube-player'); // NEW: Get YouTube player
    const closeBtn = document.querySelector('.close-btn');
    const shareLinkInput = document.getElementById('share-link-input');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    // MODIFIED: Function to open the video player
    function openPlayer(videoId, videoSrc, videoType) {
        // Hide both players initially
        videoPlayer.style.display = 'none';
        youtubePlayer.style.display = 'none';

        if (videoType === 'youtube') {
            // If it's a YouTube video, use the iframe
            youtubePlayer.src = videoSrc + "?autoplay=1"; // Add autoplay
            youtubePlayer.style.display = 'block';
        } else {
            // Otherwise, use the standard video player
            videoPlayer.src = videoSrc;
            videoPlayer.play();
            videoPlayer.style.display = 'block';
        }

        // Generate the shareable link with a URL hash
        const shareableLink = `${window.location.origin}${window.location.pathname}#${videoId}`;
        shareLinkInput.value = shareableLink;

        // Show the overlay
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // MODIFIED: Function to close the video player
    function closePlayer() {
        // Pause the video and clear the source for both players
        videoPlayer.pause();
        videoPlayer.src = '';
        youtubePlayer.src = '';

        // Hide the overlay
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Reset the URL hash without reloading the page
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    // MODIFIED: Add click event listeners to each video post
    videoPosts.forEach(post => {
        post.addEventListener('click', () => {
            const videoSrc = post.querySelector('img').dataset.videoSrc;
            const videoId = post.dataset.videoId;
            const videoType = post.dataset.videoType; // NEW: Get the video type
            openPlayer(videoId, videoSrc, videoType);
        });
    });

    // Event listener for the close button
    closeBtn.addEventListener('click', closePlayer);

    // Event listener to close player by clicking the background
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closePlayer();
        }
    });
    
    // Event listener for the 'Escape' key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !overlay.classList.contains('hidden')) {
            closePlayer();
        }
    });

    // Event listener for the copy link button
    copyLinkBtn.addEventListener('click', () => {
        shareLinkInput.select();
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            // Provide user feedback
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyLinkBtn.textContent = 'Copy Link';
            }, 2000);
        });
    });
    
    // MODIFIED: Check if a video link was shared in the URL on page load
    function checkUrlForVideo() {
        if (window.location.hash) {
            const videoIdFromUrl = window.location.hash.substring(1);
            const postToOpen = document.querySelector(`.video-post[data-video-id="${videoIdFromUrl}"]`);
            if (postToOpen) {
                const videoSrc = postToOpen.querySelector('img').dataset.videoSrc;
                const videoType = postToOpen.dataset.videoType; // NEW: Get the video type
                openPlayer(videoIdFromUrl, videoSrc, videoType);
            }
        }
    }
    
    // Run the check when the page is fully loaded
    checkUrlForVideo();

});