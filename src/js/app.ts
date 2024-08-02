interface FileItem {
    type: string;
    name: string;
    added?: string;
    files?: FileItem[];
  }
  
  class DocumentViewer {
    private files: FileItem[];
    private filteredFiles: FileItem[];
    private currentPath: FileItem[];
    private sortOrder: 'asc' | 'desc';
  
    constructor(files: FileItem[]) {
      this.files = files;
      this.filteredFiles = files;
      this.currentPath = [];
      this.sortOrder = 'asc';
      this.init();
    }
  
    init() {
      this.renderFiles(this.filteredFiles);
      this.attachEventListeners();
    }
  
    renderFiles(files: FileItem[], container: HTMLElement | null = null) {
      container = container || document.getElementById('file-viewer')!;
      container.innerHTML = '';
  
      if (this.currentPath.length > 0) {
        const backButton = document.createElement('div');
        backButton.className = 'back-button';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', () => this.goBack());
        container.appendChild(backButton);
      }
  
      if (files.length === 0) {
        container.innerHTML += '<div class="empty-folder">No files or folders available</div>';
        return;
      }
  
      files.forEach(file => {
        const element = document.createElement('div');
        element.className = file.type;
        let iconClass = '';
  
        if (file.type === 'folder') {
          iconClass = 'fas fa-folder';
        } else if (file.type === 'pdf') {
          iconClass = 'fas fa-file-pdf';
        } else if (file.type === 'doc') {
          iconClass = 'fas fa-file-word';
        } else {
          iconClass = 'fas fa-file';
        }
  
        element.innerHTML = `
          <div class="${file.type}-name">
            <i class="${iconClass}"></i> ${file.name} - ${file.added || ''}
          </div>
        `;
  
        if (file.type === 'folder' && file.files) {
          element.addEventListener('click', () => this.openFolder(file));
        }
        container.appendChild(element);
      });
    }
  
    attachEventListeners() {
      document.getElementById('filter')!.addEventListener('input', (event) => {
        const query = (event.target as HTMLInputElement).value.toLowerCase();
        this.filteredFiles = this.getCurrentFiles().filter(file => file.name.toLowerCase().includes(query));
        this.renderFiles(this.filteredFiles);
      });
  
      document.getElementById('sort-name')!.addEventListener('click', () => {
        this.toggleSortOrder();
        this.sortFilesByName();
        this.renderFiles(this.filteredFiles);
      });
  
      document.getElementById('sort-date')!.addEventListener('click', () => {
        this.toggleSortOrder();
        this.sortFilesByDate();
        this.renderFiles(this.filteredFiles);
      });
    }
  
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    }
  
    sortFilesByName() {
      this.filteredFiles.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
  
    // sortFilesByDate() {
    //   this.filteredFiles.sort((a, b) => {
    //     const dateA = new Date(a.added || 0).getTime();
    //     const dateB = new Date(b.added || 0).getTime();
    //     return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    //   });
    // }
    sortFilesByDate() {
      this.filteredFiles.sort((a, b) => {
        const dateA = new Date(a.added || 0).getTime();
        const dateB = new Date(b.added || 0).getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
  
  
    openFolder(folder: FileItem) {
      this.currentPath.push(folder);
      this.filteredFiles = folder.files!;
      this.renderFiles(this.filteredFiles);
    }
  
    goBack() {
      this.currentPath.pop();
      const currentFolder = this.currentPath[this.currentPath.length - 1];
      if (currentFolder) {
        this.filteredFiles = currentFolder.files!;
        this.renderFiles(this.filteredFiles);
      } else {
        this.filteredFiles = this.files;
        this.renderFiles(this.filteredFiles);
      }
    }
  
    getCurrentFiles(): FileItem[] {
      return this.currentPath.length > 0 ? this.currentPath[this.currentPath.length - 1].files! : this.files;
    }
  }
  
  
  export { DocumentViewer, FileItem };
  