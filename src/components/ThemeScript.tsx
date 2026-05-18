export default function ThemeScript() {
  const themeScript = `
    (function() {
      function getSystemTheme() {
        // Portfolio mode: CRT is the default for first-time visitors regardless
        // of OS color-scheme preference (the CRT theme is dark by definition).
        // Users who want a light theme select it via the theme switcher and
        // their choice persists in localStorage.
        // See features/enhancements/047-portfolio-visual-overhaul/spec.md §Resolved 3.
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'turtlewolfe-crt';
        }
        return 'turtlewolfe-light';
      }

      function applyTheme(theme) {
        if (!theme) {
          try {
            // First check if user has manually selected a theme
            theme = localStorage.getItem('theme');

            // If no saved theme, use system preference (CRT for dark,
            // turtlewolfe-light for light per feature 047).
            if (!theme) {
              theme = getSystemTheme();
            }
          } catch (e) {
            // Fallback if localStorage is not available — default to CRT.
            theme = 'turtlewolfe-crt';
          }
        }

        document.documentElement.setAttribute('data-theme', theme);
        // Also set on body as backup
        if (document.body) {
          document.body.setAttribute('data-theme', theme);
        }

        return theme;
      }

      // Apply theme immediately on initial load
      var currentTheme = applyTheme();

      // Reapply when DOM is ready (only on initial load)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          applyTheme(currentTheme);
        });
      }

      // Listen for storage changes (theme changes from other tabs/windows)
      window.addEventListener('storage', function(e) {
        if (e.key === 'theme' && e.newValue) {
          currentTheme = e.newValue;
          applyTheme(currentTheme);
        }
      });

      // Listen for custom theme change events (from same tab)
      window.addEventListener('themechange', function(e) {
        if (e.detail && e.detail.theme) {
          currentTheme = e.detail.theme;
          applyTheme(currentTheme);
        }
      });

      // Fallback: watch for body element if it doesn't exist yet
      if (!document.body) {
        var observer = new MutationObserver(function(mutations) {
          if (document.body) {
            applyTheme(currentTheme);
            observer.disconnect();
          }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }

      // Listen for system theme changes
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
          // Only apply system theme if user hasn't manually selected a theme
          if (!localStorage.getItem('theme')) {
            currentTheme = getSystemTheme();
            applyTheme(currentTheme);
          }
        });
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
