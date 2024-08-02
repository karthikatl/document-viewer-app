import { DocumentViewer, FileItem } from '../js/app';
import { DataFiles } from '../js/main';

describe('DocumentViewer', () => {
  let files: FileItem[];
  let documentViewer: DocumentViewer;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="filter" />
      <div class="sort-options">
        <button id="sort-name">Sort by Name</button>
        <button id="sort-date">Sort by Date</button>
      </div>
      <div id="file-viewer"></div>
    `;

    files = DataFiles;

    // Manually trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    documentViewer = new DocumentViewer(files);
  });

  test('should render files', () => {
    expect(document.getElementById('file-viewer')!.children.length).toBe(5);
  });

  test('should filter files', () => {
    (document.getElementById('filter') as HTMLInputElement).value = 'Employee';
    documentViewer.attachEventListeners();
    (document.getElementById('filter') as HTMLInputElement).dispatchEvent(new Event('input'));
    expect(document.getElementById('file-viewer')!.children.length).toBe(1);
  });

  test('should sort files by name', () => {
    documentViewer.attachEventListeners();
    document.getElementById('sort-name')!.dispatchEvent(new Event('click'));
    expect(document.getElementById('file-viewer')!.children[0].textContent).toContain('Cost centres');
  });

  test('should sort files by date', () => {
    documentViewer.attachEventListeners();
    document.getElementById('sort-date')!.dispatchEvent(new Event('click'));
    expect(document.getElementById('file-viewer')!.children[0].textContent).toContain('');
  });
  
});
