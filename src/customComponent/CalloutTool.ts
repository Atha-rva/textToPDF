import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface CalloutData {
  title: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export default class CalloutTool implements BlockTool {
  private data: CalloutData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { title: '', text: '', type: 'info' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Callout',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = `callout-tool callout-${this.data.type}`;

    const typeSelect = document.createElement('select');
    typeSelect.innerHTML = `
      <option value="info" ${this.data.type === 'info' ? 'selected' : ''}>💡 Info</option>
      <option value="warning" ${this.data.type === 'warning' ? 'selected' : ''}>⚠️ Warning</option>
      <option value="success" ${this.data.type === 'success' ? 'selected' : ''}>✅ Success</option>
      <option value="error" ${this.data.type === 'error' ? 'selected' : ''}>❌ Error</option>
    `;
    typeSelect.addEventListener('change', (e) => {
      this.data.type = (e.target as HTMLSelectElement).value as 'info' | 'warning' | 'success' | 'error';
      this.wrapper!.className = `callout-tool callout-${this.data.type}`;
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Callout title (optional)...';
    titleInput.value = this.data.title;
    titleInput.addEventListener('input', (e) => {
      this.data.title = (e.target as HTMLInputElement).value;
    });

    const textInput = document.createElement('textarea');
    textInput.placeholder = 'Enter callout content...';
    textInput.value = this.data.text;
    textInput.addEventListener('input', (e) => {
      this.data.text = (e.target as HTMLTextAreaElement).value;
    });

    this.wrapper.appendChild(typeSelect);
    this.wrapper.appendChild(titleInput);
    this.wrapper.appendChild(textInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}