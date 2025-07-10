import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface NoteData {
  text: string;
  type: 'info' | 'warning' | 'success';
}

export default class NoteTool implements BlockTool {
  private data: NoteData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { text: '', type: 'info' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Note',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = `note-tool note-${this.data.type}`;

    const typeSelect = document.createElement('select');
    typeSelect.innerHTML = `
      <option value="info" ${this.data.type === 'info' ? 'selected' : ''}>Info</option>
      <option value="warning" ${this.data.type === 'warning' ? 'selected' : ''}>Warning</option>
      <option value="success" ${this.data.type === 'success' ? 'selected' : ''}>Success</option>
    `;
    typeSelect.addEventListener('change', (e) => {
      this.data.type = (e.target as HTMLSelectElement).value as 'info' | 'warning' | 'success';
      this.wrapper!.className = `note-tool note-${this.data.type}`;
    });

    const textInput = document.createElement('textarea');
    textInput.placeholder = 'Enter note text...';
    textInput.value = this.data.text;
    textInput.addEventListener('input', (e) => {
      this.data.text = (e.target as HTMLTextAreaElement).value;
    });

    this.wrapper.appendChild(typeSelect);
    this.wrapper.appendChild(textInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}