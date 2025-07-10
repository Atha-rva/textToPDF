import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface ImageData {
  file: string;
  caption: string;
}

export default class ImageTool implements BlockTool {
  private data: ImageData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { file: '', caption: '' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-67 49v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'image-tool';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.data.file = e.target?.result as string;
          this.render();
        };
        reader.readAsDataURL(file);
      }
    });

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Enter caption...';
    captionInput.value = this.data.caption;
    captionInput.addEventListener('input', (e) => {
      this.data.caption = (e.target as HTMLInputElement).value;
    });

    if (this.data.file) {
      const img = document.createElement('img');
      img.src = this.data.file;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      this.wrapper.appendChild(img);
    } else {
      this.wrapper.appendChild(input);
    }

    this.wrapper.appendChild(captionInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}