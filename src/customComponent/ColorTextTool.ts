import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface ColorTextData {
  text: string;
  color: string;
}

export default class ColorTextTool implements BlockTool {
  private data: ColorTextData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { text: '', color: '#000000' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Color Text',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'color-text-tool';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = this.data.color;
    colorInput.addEventListener('input', (e) => {
      this.data.color = (e.target as HTMLInputElement).value;
      textInput.style.color = this.data.color;
    });

    const textInput = document.createElement('textarea');
    textInput.placeholder = 'Enter colored text...';
    textInput.value = this.data.text;
    textInput.style.color = this.data.color;
    textInput.addEventListener('input', (e) => {
      this.data.text = (e.target as HTMLTextAreaElement).value;
    });

    this.wrapper.appendChild(colorInput);
    this.wrapper.appendChild(textInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}