'use client';
import { useEffect } from "react";

const FallingStars = () => {
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement("div");
      const size = Math.random() * 12;
      const duration = Math.random() * 3;
      const fallSpeed = 1 + Math.random() * 2;

      star.classList.add("star");
      document.body.appendChild(star);

      // Set initial position and styles
      const randomLeft = Math.random() * window.innerWidth;
      star.style.left = `${randomLeft}px`;
      star.style.top = "-20px"; // Start slightly above the viewport
      star.style.fontSize = 12 + size + "px";
      star.style.pointerEvents = "none";

      // No transition on position to avoid flickering
      star.style.transition = "none";

      // Smooth falling using requestAnimationFrame
      const fall = () => {
        const currentTop = parseFloat(star.style.top);
        star.style.top = currentTop + fallSpeed + "px";
        star.style.transform = `translateY(${currentTop + fallSpeed}px)`;

        // Reset star when it goes off-screen smoothly
        if (currentTop > window.innerHeight) {
          const randomLeft = Math.random() * window.innerWidth;
          star.style.left = `${randomLeft}px`;
          star.style.top = "-20px";  // Reset to top smoothly
        }

        // Continue falling
        requestAnimationFrame(fall);
      };

      requestAnimationFrame(fall);

      // Remove star after a while to avoid overflow
      setTimeout(() => {
        document.body.removeChild(star);
      }, 10000);
    };

    // Generate stars at intervals
    const starInterval = setInterval(createStar, 100);

    // Push stars away on mouse move
    const handleMouseMove = (e) => {
      const stars = document.querySelectorAll(".star");
      stars.forEach((star) => {
        const starRect = star.getBoundingClientRect();
        const starX = starRect.left + starRect.width / 2;
        const starY = starRect.top + starRect.height / 2;
        const dx = starX - e.clientX;
        const dy = starY - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If the mouse is close to the star, push it away
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const pushDistance = (100 - distance) / 2;

          // Prevent stars from going off-screen
          let newX = Math.cos(angle) * pushDistance;
          let newY = Math.sin(angle) * pushDistance;

          // Boundary logic to prevent off-screen
          const maxX = window.innerWidth - starRect.width;
          const maxY = window.innerHeight - starRect.height;

          newX = Math.min(Math.max(newX, 0), maxX);
          newY = Math.min(Math.max(newY, 0), maxY);

          star.style.transform = `translate(${newX}px, ${newY}px)`;
        } else {
          star.style.transform = "translate(0, 0)";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Clean up intervals and event listeners
    return () => {
      clearInterval(starInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
};

export default FallingStars;
