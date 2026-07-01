const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'app');

const mappings = {
  common: {
    components: ['Modal', 'InfoModal', 'SettingsModal', 'DropdownMenu', 'AsyncButton', 'ProgressBar', 'AppLayout'],
    context: ['LanguageContext', 'SettingsContext', 'ProjectContext'],
    hooks: ['useDoubleTap'],
    data: ['collaborators'],
    helpers: ['notifications'],
    types: ['index']
  },
  sidebar: {
    components: ['Sidebar', 'ProjectList', 'ProjectItem', 'ProjectForm'],
    controller: ['projectController']
  },
  board: {
    components: ['KanbanBoard', 'KanbanBoardDesktop', 'KanbanBoardMobile', 'KanbanCell', 'KanbanColumn', 'SprintSelector', 'SprintTab', 'AddSprintForm'],
    hooks: ['useKanbanBoard']
  },
  activity: {
    components: ['ActivityCard', 'MobileActivityCard', 'AddActivityForm'],
    controller: ['activityController']
  },
  'activity-details': {
    components: ['ActivityDetailsSidebar', 'ActivityHeader', 'ActivityForm', 'ActivityMenu', 'ActivityTaskItem', 'AddTaskForm']
  }
};

// Create a lookup map: 'Modal' -> '@/app/features/common/components/Modal'
const lookup = {};
for (const [feature, types] of Object.entries(mappings)) {
  for (const [type, files] of Object.entries(types)) {
    for (const file of files) {
      lookup[file] = `@/app/features/${feature}/${type}/${file}`;
    }
  }
}

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
}

const allFiles = walkSync(root);

let changedFiles = 0;
for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Find all imports like: import X from "./FileName" or import { Y } from "../context/FileName"
  // Regex looks for from "..." or from '...' starting with .
  const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    // importPath might be "./KanbanCell" or "../context/LanguageContext"
    const basename = path.basename(importPath); // e.g. "LanguageContext"
    
    // Some special cases for layout.tsx importing './globals.css'
    if (basename.endsWith('.css')) return match;

    if (lookup[basename]) {
      changed = true;
      return `from "${lookup[basename]}"`;
    }
    
    // Check if it resolves to index (types)
    if (basename === 'types' || importPath.endsWith('/types')) {
      if (lookup['index']) {
        changed = true;
        return `from "${lookup['index']}"`;
      }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Relative imports fixed in ${changedFiles} files.`);
