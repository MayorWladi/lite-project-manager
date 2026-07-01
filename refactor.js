const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'app');
const featuresDir = path.join(root, 'features');

const mappings = {
  common: {
    components: ['Modal.tsx', 'InfoModal.tsx', 'SettingsModal.tsx', 'DropdownMenu.tsx', 'AsyncButton.tsx', 'ProgressBar.tsx', 'AppLayout.tsx'],
    context: ['LanguageContext.tsx', 'SettingsContext.tsx', 'ProjectContext.tsx'],
    hooks: ['useDoubleTap.ts'],
    data: ['collaborators.ts'],
    helpers: ['notifications.ts'],
    types: ['index.ts']
  },
  sidebar: {
    components: ['Sidebar.tsx', 'ProjectList.tsx', 'ProjectItem.tsx', 'ProjectForm.tsx'],
    controller: ['projectController.ts']
  },
  board: {
    components: ['KanbanBoard.tsx', 'KanbanBoardDesktop.tsx', 'KanbanBoardMobile.tsx', 'KanbanCell.tsx', 'KanbanColumn.tsx', 'SprintSelector.tsx', 'SprintTab.tsx', 'AddSprintForm.tsx'],
    hooks: ['useKanbanBoard.ts']
  },
  activity: {
    components: ['ActivityCard.tsx', 'MobileActivityCard.tsx', 'AddActivityForm.tsx'],
    controller: ['activityController.ts']
  },
  'activity-details': {
    components: ['ActivityDetailsSidebar.tsx', 'ActivityHeader.tsx', 'ActivityForm.tsx', 'ActivityMenu.tsx', 'ActivityTaskItem.tsx', 'AddTaskForm.tsx']
  }
};

const originalDirs = ['components', 'context', 'controller', 'data', 'helpers', 'hooks', 'types'];

if (!fs.existsSync(featuresDir)) {
  fs.mkdirSync(featuresDir);
}

let importReplacements = [];

for (const [feature, types] of Object.entries(mappings)) {
  const featurePath = path.join(featuresDir, feature);
  if (!fs.existsSync(featurePath)) fs.mkdirSync(featurePath);

  for (const [type, files] of Object.entries(types)) {
    const typePath = path.join(featurePath, type);
    if (!fs.existsSync(typePath)) fs.mkdirSync(typePath);

    for (const file of files) {
      let foundPath = null;
      let originalRelative = null;
      for (const origDir of originalDirs) {
        const checkPath = path.join(root, origDir, file);
        if (fs.existsSync(checkPath)) {
          foundPath = checkPath;
          originalRelative = `@/app/${origDir}/${file.replace(/\.tsx?$/, '')}`;
          break;
        }
      }

      if (foundPath) {
        const newPath = path.join(typePath, file);
        fs.renameSync(foundPath, newPath);
        console.log(`Moved: ${file} -> features/${feature}/${type}`);
        
        const newRelative = `@/app/features/${feature}/${type}/${file.replace(/\.tsx?$/, '')}`;
        importReplacements.push({ from: originalRelative, to: newRelative });
      } else {
        console.log(`WARNING: Could not find ${file}`);
      }
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

  for (const rule of importReplacements) {
    const regex = new RegExp(`['"\`]${rule.from}['"\`]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `"${rule.to}"`);
      changed = true;
    }
    
    if (rule.from.endsWith('/index')) {
      const fromDir = rule.from.replace('/index', '');
      const toDir = rule.to.replace('/index', '');
      const regexDir = new RegExp(`['"\`]${fromDir}['"\`]`, 'g');
      if (regexDir.test(content)) {
        content = content.replace(regexDir, `"${toDir}"`);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log(`\nImport rewrite complete. Modified ${changedFiles} files.`);

for (const origDir of originalDirs) {
  const dirPath = path.join(root, origDir);
  if (fs.existsSync(dirPath)) {
    const remaining = fs.readdirSync(dirPath);
    if (remaining.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`Removed empty directory: ${origDir}`);
    } else {
      console.log(`Directory ${origDir} not empty, skipping removal.`);
    }
  }
}
