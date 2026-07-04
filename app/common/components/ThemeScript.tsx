import React from 'react';

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            var theme = window.localStorage.getItem('kanban-theme') || 'light';
            document.documentElement.classList.add('theme-' + theme);
            var isDark = theme === 'dark' || theme === 'espresso' || theme === 'midnight';
            if (isDark) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        `,
      }}
    ></script>
  );
}
