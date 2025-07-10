import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface ButtonData {
  text: string;
  url: string;
  style: 'primary' | 'secondary';
}

export default class ButtonTool implements BlockTool {
  private data: ButtonData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { text: 'Button', url: '', style: 'primary' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Button',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'button-tool';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Button text...';
    textInput.value = this.data.text;
    textInput.addEventListener('input', (e) => {
      this.data.text = (e.target as HTMLInputElement).value;
      this.updatePreview();
    });

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'Button URL (optional)...';
    urlInput.value = this.data.url;
    urlInput.addEventListener('input', (e) => {
      this.data.url = (e.target as HTMLInputElement).value;
    });

    const styleSelect = document.createElement('select');
    styleSelect.innerHTML = `
      <option value="primary" ${this.data.style === 'primary' ? 'selected' : ''}>Primary</option>
      <option value="secondary" ${this.data.style === 'secondary' ? 'selected' : ''}>Secondary</option>
    `;
    styleSelect.addEventListener('change', (e) => {
      this.data.style = (e.target as HTMLSelectElement).value as 'primary' | 'secondary';
      this.updatePreview();
    });

    const preview = document.createElement('div');
    preview.className = 'button-preview';
    
    this.wrapper.appendChild(textInput);
    this.wrapper.appendChild(urlInput);
    this.wrapper.appendChild(styleSelect);
    this.wrapper.appendChild(preview);

    this.updatePreview();

    return this.wrapper;
  }

  private updatePreview() {
    const preview = this.wrapper?.querySelector('.button-preview') as HTMLElement;
    if (preview) {
      preview.innerHTML = `
        <button class="button-preview-element ${this.data.style}">
          ${this.data.text || 'Button'}
        </button>
      `;
    }
  }

  save() {
    return this.data;
  }
}