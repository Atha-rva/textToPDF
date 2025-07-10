import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface SectionBreakData {
  title: string;
}

export default class SectionBreakTool implements BlockTool {
  private data: SectionBreakData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { title: '' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Section Break',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 11h8V9H3v2zm0 4h8v-2H3v2zm0 4h8v-2H3v2zm16-8v6h-6v-6h6zm-8-6h8V3H11v2z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'section-break-tool';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Section title...';
    titleInput.value = this.data.title;
    titleInput.addEventListener('input', (e) => {
      this.data.title = (e.target as HTMLInputElement).value;
    });

    const divider = document.createElement('hr');
    divider.style.margin = '10px 0';

    this.wrapper.appendChild(titleInput);
    this.wrapper.appendChild(divider);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}