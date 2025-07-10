import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface AlignTextData {
  text: string;
  alignment: 'left' | 'center' | 'right';
}

export default class AlignTextTool implements BlockTool {
  private data: AlignTextData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { text: '', alignment: 'left' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Align Text',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'align-text-tool';

    const alignmentSelect = document.createElement('select');
    alignmentSelect.innerHTML = `
      <option value="left" ${this.data.alignment === 'left' ? 'selected' : ''}>Left</option>
      <option value="center" ${this.data.alignment === 'center' ? 'selected' : ''}>Center</option>
      <option value="right" ${this.data.alignment === 'right' ? 'selected' : ''}>Right</option>
    `;
    alignmentSelect.addEventListener('change', (e) => {
      this.data.alignment = (e.target as HTMLSelectElement).value as 'left' | 'center' | 'right';
      textInput.style.textAlign = this.data.alignment;
    });

    const textInput = document.createElement('textarea');
    textInput.placeholder = 'Enter text to align...';
    textInput.value = this.data.text;
    textInput.style.textAlign = this.data.alignment;
    textInput.addEventListener('input', (e) => {
      this.data.text = (e.target as HTMLTextAreaElement).value;
    });

    this.wrapper.appendChild(alignmentSelect);
    this.wrapper.appendChild(textInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}