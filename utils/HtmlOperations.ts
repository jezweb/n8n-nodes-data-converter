import { marked } from 'marked';
import { HtmlTableOptions } from '../types/DataConverterTypes';
import { csvToJson } from './FormatOperations';

export const jsonToHtmlTable = (json: any[], options: HtmlTableOptions = {}): string => {
  try {
    if (!Array.isArray(json) || json.length === 0) {
      return '<p>No data to display</p>';
    }

    const headers = Object.keys(json[0]);
    const tableClass = options.tableClass ? ` class="${options.tableClass}"` : '';
    const headerClass = options.headerClass ? ` class="${options.headerClass}"` : '';
    const rowClass = options.rowClass ? ` class="${options.rowClass}"` : '';
    const cellClass = options.cellClass ? ` class="${options.cellClass}"` : '';

    let html = `<table${tableClass}>\n`;
    
    // Header
    html += '  <thead>\n    <tr>\n';
    if (options.includeIndex) {
      html += `      <th${headerClass}>#</th>\n`;
    }
    headers.forEach(header => {
      html += `      <th${headerClass}>${escapeHtml(header)}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';
    
    // Body
    html += '  <tbody>\n';
    json.forEach((row, index) => {
      html += `    <tr${rowClass}>\n`;
      if (options.includeIndex) {
        html += `      <td${cellClass}>${index + 1}</td>\n`;
      }
      headers.forEach(header => {
        const value = row[header];
        const displayValue = value !== null && value !== undefined ? String(value) : '';
        html += `      <td${cellClass}>${escapeHtml(displayValue)}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>';

    return html;
  } catch (error) {
    throw new Error(`Failed to convert JSON to HTML table: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonToHtmlList = (json: any[], ordered: boolean = false): string => {
  try {
    if (!Array.isArray(json)) {
      json = [json];
    }

    if (json.length === 0) {
      return '<p>No items to display</p>';
    }

    const listTag = ordered ? 'ol' : 'ul';
    let html = `<${listTag}>\n`;

    json.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        html += '  <li>\n';
        if (Array.isArray(item)) {
          html += jsonToHtmlList(item, ordered);
        } else {
          html += '    <dl>\n';
          Object.entries(item).forEach(([key, value]) => {
            html += `      <dt>${escapeHtml(key)}</dt>\n`;
            html += `      <dd>${escapeHtml(String(value))}</dd>\n`;
          });
          html += '    </dl>\n';
        }
        html += '  </li>\n';
      } else {
        html += `  <li>${escapeHtml(String(item))}</li>\n`;
      }
    });

    html += `</${listTag}>`;
    return html;
  } catch (error) {
    throw new Error(`Failed to convert JSON to HTML list: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const csvToHtmlTable = (csv: string, options: HtmlTableOptions = {}): string => {
  try {
    const json = csvToJson(csv);
    return jsonToHtmlTable(json, options);
  } catch (error) {
    throw new Error(`Failed to convert CSV to HTML table: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const markdownToHtml = (markdown: string): string => {
  try {
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    const result = marked(markdown);
    return typeof result === 'string' ? result : String(result);
  } catch (error) {
    throw new Error(`Failed to convert Markdown to HTML: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
};