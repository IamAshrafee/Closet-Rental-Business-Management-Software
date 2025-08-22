import { useEffect } from 'react';

/**
 * A custom hook that automatically scrolls a form element into the center of the view when it's focused.
 * This is especially useful on mobile devices where the virtual keyboard can obscure input fields.
 * @param {React.RefObject<HTMLElement>} formRef - A React ref attached to the form element.
 */
const useAutoscrollOnFocus = (formRef) => {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleFocusIn = (event) => {
      const target = event.target;
      // Check if the focused element is an input, textarea, or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          const handleViewportChange = () => {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          };
          visualViewport.addEventListener('resize', handleViewportChange, { once: true });
        } else {
          // Fallback for older browsers
          setTimeout(() => {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 300);
        }
      }
    };

    // The 'focusin' event bubbles, so we can attach a single listener to the form.
    form.addEventListener('focusin', handleFocusIn);

    // Cleanup the event listener when the component unmounts.
    return () => {
      form.removeEventListener('focusin', handleFocusIn);
    };
  }, [formRef]);
};

export default useAutoscrollOnFocus;
