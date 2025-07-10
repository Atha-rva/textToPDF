import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { debounce } from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FileText, 
  Download, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  Upload, 
  Palette,
  Type,
  Layout,
  Zap,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Trash2,
  Plus,
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4b5563',
  },
  heading4: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6b7280',
  },
  heading5: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#6b7280',
  },
  heading6: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#6b7280',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 20,
  },
  orderedListItem: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 20,
  },
  blockquote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: '#3b82f6',
    paddingLeft: 15,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 4,
  },
  code: {
    fontSize: 10,
    fontFamily: 'Courier',
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#374151',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
  image: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 10,
    objectFit: 'contain',
    borderRadius: 4,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },
});

interface DocumentSettings {
  fontSize: number;
  fontFamily: string;
  pageMargin: number;
  lineHeight: number;
  theme: 'light' | 'dark';
}

const TextPDFEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [debouncedContent, setDebouncedContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [documentSettings, setDocumentSettings] = useState<DocumentSettings>({
    fontSize: 12,
    fontFamily: 'Helvetica',
    pageMargin: 30,
    lineHeight: 1.6,
    theme: 'light'
  });
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateDebouncedContent = useCallback(
    debounce((newContent: string) => {
      setDebouncedContent(newContent);
      if (autoSave) {
        setLastSaved(new Date());
      }
    }, 300),
    [autoSave]
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    updateDebouncedContent(value);
    
    // Calculate word and character count
    const textContent = value.replace(/<[^>]*>/g, ''); // Strip HTML tags
    setWordCount(textContent.split(/\s+/).filter(word => word.length > 0).length);
    setCharacterCount(textContent.length);
  };

  const parseHtmlToPDF = (html: string): React.ReactNode[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements: React.ReactNode[] = [];
    let key = 0;

    const processNode = (node: Node): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          nodes.push(
            <Text key={key++} style={styles.text}>
              {text}
            </Text>
          );
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent?.trim() || '';

        switch (tagName) {
          case 'h1':
            nodes.push(
              <Text key={key++} style={styles.heading1}>
                {textContent}
              </Text>
            );
            break;
          case 'h2':
            nodes.push(
              <Text key={key++} style={styles.heading2}>
                {textContent}
              </Text>
            );
            break;
          case 'h3':
            nodes.push(
              <Text key={key++} style={styles.heading3}>
                {textContent}
              </Text>
            );
            break;
          case 'h4':
            nodes.push(
              <Text key={key++} style={styles.heading4}>
                {textContent}
              </Text>
            );
            break;
          case 'h5':
            nodes.push(
              <Text key={key++} style={styles.heading5}>
                {textContent}
              </Text>
            );
            break;
          case 'h6':
            nodes.push(
              <Text key={key++} style={styles.heading6}>
                {textContent}
              </Text>
            );
            break;
          case 'p':
            const alignment = element.style.textAlign;
            const alignStyle = alignment === 'center' ? styles.alignCenter :
                            alignment === 'right' ? styles.alignRight :
                            alignment === 'justify' ? styles.alignJustify :
                            styles.alignLeft;
            
            nodes.push(
              <Text key={key++} style={[styles.paragraph, alignStyle]}>
                {textContent}
              </Text>
            );
            break;
          case 'strong':
          case 'b':
            nodes.push(
              <Text key={key++} style={[styles.text, styles.bold]}>
                {textContent}
              </Text>
            );
            break;
          case 'em':
          case 'i':
            nodes.push(
              <Text key={key++} style={[styles.text, styles.italic]}>
                {textContent}
              </Text>
            );
            break;
          case 'u':
            nodes.push(
              <Text key={key++} style={[styles.text, styles.underline]}>
                {textContent}
              </Text>
            );
            break;
          case 'blockquote':
            nodes.push(
              <Text key={key++} style={styles.blockquote}>
                {textContent}
              </Text>
            );
            break;
          case 'code':
            nodes.push(
              <Text key={key++} style={styles.code}>
                {textContent}
              </Text>
            );
            break;
          case 'ul':
            Array.from(element.children).forEach((li) => {
              nodes.push(
                <Text key={key++} style={styles.listItem}>
                  • {li.textContent}
                </Text>
              );
            });
            break;
          case 'ol':
            Array.from(element.children).forEach((li, index) => {
              nodes.push(
                <Text key={key++} style={styles.orderedListItem}>
                  {index + 1}. {li.textContent}
                </Text>
              );
            });
            break;
          case 'a':
            nodes.push(
              <Text key={key++} style={[styles.text, styles.link]}>
                {textContent}
              </Text>
            );
            break;
          case 'img':
            const src = element.getAttribute('src');
            if (src) {
              nodes.push(
                <Image key={key++} src={src} style={styles.image} />
              );
            }
            break;
          case 'br':
            nodes.push(
              <Text key={key++} style={styles.text}>
                {'\n'}
              </Text>
            );
            break;
          default:
            // For other elements, process children
            Array.from(node.childNodes).forEach(child => {
              nodes.push(...processNode(child));
            });
            break;
        }
      }

      return nodes;
    };

    Array.from(doc.body.childNodes).forEach(node => {
      elements.push(...processNode(node));
    });

    return elements;
  };

  const saveDocument = () => {
    try {
      const dataStr = JSON.stringify({
        title: documentTitle,
        content: content,
        settings: documentSettings,
        timestamp: new Date().toISOString()
      });
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const loadDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setDocumentTitle(data.title || 'Untitled Document');
          if (data.settings) {
            setDocumentSettings(data.settings);
          }
          if (data.content) {
            setContent(data.content);
            setDebouncedContent(data.content);
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const clearDocument = () => {
    if (window.confirm('Are you sure you want to clear the document?')) {
      setContent('');
      setDebouncedContent('');
      setDocumentTitle('Untitled Document');
      setWordCount(0);
      setCharacterCount(0);
    }
  };

  const duplicateDocument = () => {
    setDocumentTitle(`${documentTitle} (Copy)`);
  };

  const insertTemplate = (template: string) => {
    const templates = {
      'business-letter': `
        <h1>Business Letter Template</h1>
        <p><strong>Your Name</strong><br>
        Your Address<br>
        City, State ZIP Code<br>
        Email Address<br>
        Phone Number</p>
        
        <p>Date</p>
        
        <p><strong>Recipient Name</strong><br>
        Title<br>
        Company Name<br>
        Address</p>
        
        <p>Dear [Recipient Name],</p>
        
        <p>Opening paragraph - state the purpose of your letter.</p>
        
        <p>Body paragraph - provide details and supporting information.</p>
        
        <p>Closing paragraph - summarize and indicate next steps.</p>
        
        <p>Sincerely,<br>
        Your Name</p>
      `,
      'meeting-notes': `
        <h1>Meeting Notes</h1>
        <p><strong>Date:</strong> [Date]<br>
        <strong>Time:</strong> [Time]<br>
        <strong>Location:</strong> [Location/Platform]<br>
        <strong>Attendees:</strong> [List of attendees]</p>
        
        <h2>Agenda</h2>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        
        <h2>Discussion Points</h2>
        <p>Key discussion points and decisions made...</p>
        
        <h2>Action Items</h2>
        <ul>
          <li>Action item 1 - Assigned to: [Name] - Due: [Date]</li>
          <li>Action item 2 - Assigned to: [Name] - Due: [Date]</li>
        </ul>
        
        <h2>Next Meeting</h2>
        <p>Date: [Date]<br>
        Time: [Time]<br>
        Location: [Location]</p>
      `,
      'project-proposal': `
        <h1>Project Proposal</h1>
        
        <h2>Executive Summary</h2>
        <p>Brief overview of the project and its objectives...</p>
        
        <h2>Project Description</h2>
        <p>Detailed description of what the project entails...</p>
        
        <h2>Objectives</h2>
        <ul>
          <li>Primary objective 1</li>
          <li>Primary objective 2</li>
          <li>Primary objective 3</li>
        </ul>
        
        <h2>Timeline</h2>
        <p><strong>Phase 1:</strong> [Duration] - [Description]<br>
        <strong>Phase 2:</strong> [Duration] - [Description]<br>
        <strong>Phase 3:</strong> [Duration] - [Description]</p>
        
        <h2>Budget</h2>
        <p>Estimated project cost: $[Amount]</p>
        
        <h2>Team</h2>
        <p>Project team members and their roles...</p>
        
        <h2>Conclusion</h2>
        <p>Summary and call to action...</p>
      `
    };
    
    setContent(templates[template as keyof typeof templates] || '');
  };

  const MyDocument = useMemo(() => {
    const dynamicStyles = StyleSheet.create({
      page: {
        ...styles.page,
        padding: documentSettings.pageMargin,
        fontSize: documentSettings.fontSize,
        lineHeight: documentSettings.lineHeight,
        backgroundColor: documentSettings.theme === 'dark' ? '#1f2937' : '#ffffff',
        color: documentSettings.theme === 'dark' ? '#f9fafb' : '#000000',
      },
    });

    return (
      <Document>
        <Page size="A4" style={dynamicStyles.page}>
          <View>
            {debouncedContent ? parseHtmlToPDF(debouncedContent) : (
              <Text style={styles.text}>Start writing to see your PDF preview...</Text>
            )}
          </View>
        </Page>
      </Document>
    );
  }, [debouncedContent, documentSettings]);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setDocumentSettings(prev => ({
      ...prev,
      theme: !darkMode ? 'dark' : 'light'
    }));
  };

  const adjustZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(50, Math.min(200, prev + delta)));
  };

  // Rich text editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'align', 'list', 'bullet',
    'blockquote', 'code-block', 'link', 'image'
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-200 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className={`text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                />
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>{characterCount} characters</span>
                  {lastSaved && (
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Template Dropdown */}
              <div className="relative">
                <select
                  onChange={(e) => e.target.value && insertTemplate(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  defaultValue=""
                >
                  <option value="">Insert Template</option>
                  <option value="business-letter">Business Letter</option>
                  <option value="meeting-notes">Meeting Notes</option>
                  <option value="project-proposal">Project Proposal</option>
                </select>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => adjustZoom(-10)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium min-w-[3rem] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => adjustZoom(10)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={togglePreview}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  darkMode
                    ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>

              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={loadDocument}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Load Document"
                >
                  <Upload className="h-4 w-4" />
                </button>
                
                <button
                  onClick={saveDocument}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Save Document"
                >
                  <Save className="h-4 w-4" />
                </button>

                <button
                  onClick={duplicateDocument}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Duplicate Document"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  onClick={clearDocument}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-red-400 hover:bg-gray-700' 
                      : 'text-red-600 hover:bg-gray-100'
                  }`}
                  title="Clear Document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <PDFDownloadLink
                document={MyDocument}
                fileName={`${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {({ loading }) => (
                  <>
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Generating...' : 'Export PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`border-b transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Font Size</label>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={documentSettings.fontSize}
                  onChange={(e) => setDocumentSettings(prev => ({
                    ...prev,
                    fontSize: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{documentSettings.fontSize}px</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Page Margin</label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={documentSettings.pageMargin}
                  onChange={(e) => setDocumentSettings(prev => ({
                    ...prev,
                    pageMargin: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{documentSettings.pageMargin}px</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Line Height</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={documentSettings.lineHeight}
                  onChange={(e) => setDocumentSettings(prev => ({
                    ...prev,
                    lineHeight: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{documentSettings.lineHeight}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Auto Save</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Enable auto-save</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
        isFullscreen ? 'fixed inset-0 z-50 max-w-none px-4 py-4' : ''
      }`}>
        <div className={`grid gap-8 transition-all duration-300 ${
          showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        } ${isFullscreen ? 'h-full' : ''}`}>
          
          {/* Editor Panel */}
          <div className={`rounded-lg shadow-sm border overflow-hidden transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b transition-colors ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Rich Text Editor</h2>
                  <p className="text-sm text-gray-600 mt-1">Use the toolbar to format your content</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Type className="h-5 w-5 text-gray-400" />
                  <Layout className="h-5 w-5 text-gray-400" />
                  <Palette className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
              <div className={`rich-text-editor ${darkMode ? 'dark-theme' : ''}`}>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your document here..."
                  style={{ 
                    fontSize: `${documentSettings.fontSize}px`, 
                    lineHeight: documentSettings.lineHeight,
                    minHeight: '400px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* PDF Preview Panel */}
          {showPreview && (
            <div className={`rounded-lg shadow-sm border overflow-hidden transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`px-6 py-4 border-b transition-colors ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium">PDF Preview</h2>
                    <p className="text-sm text-gray-600 mt-1">Live preview of your document</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Live</span>
                  </div>
                </div>
              </div>
              <div className={`${isFullscreen ? 'h-full' : 'h-96 lg:h-[600px]'}`}>
                <PDFViewer width="100%" height="100%" className="rounded-b-lg">
                  {MyDocument}
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextPDFEditor;