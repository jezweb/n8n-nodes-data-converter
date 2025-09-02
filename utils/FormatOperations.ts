import * as yaml from 'js-yaml';
import * as xml2js from 'xml2js';
import { parse as csvParse } from 'csv-parse/sync';
import { stringify as csvStringify } from 'csv-stringify/sync';
import { CsvOptions } from '../types/DataConverterTypes';

export const jsonToXml = async (json: any, rootName: string = 'root'): Promise<string> => {
  try {
    const builder = new xml2js.Builder({
      rootName,
      renderOpts: { pretty: true, indent: '  ', newline: '\n' }
    });
    return builder.buildObject(json);
  } catch (error) {
    throw new Error(`Failed to convert JSON to XML: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const xmlToJson = async (xml: string): Promise<any> => {
  try {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      normalize: true,
      normalizeTags: true
    });
    return await parser.parseStringPromise(xml);
  } catch (error) {
    throw new Error(`Failed to convert XML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonToYaml = (json: any): string => {
  try {
    return yaml.dump(json, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
  } catch (error) {
    throw new Error(`Failed to convert JSON to YAML: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const yamlToJson = (yamlString: string): any => {
  try {
    return yaml.load(yamlString);
  } catch (error) {
    throw new Error(`Failed to convert YAML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonToCsv = (json: any[], options: CsvOptions = {}): string => {
  try {
    if (!Array.isArray(json)) {
      json = [json];
    }
    
    if (json.length === 0) {
      return '';
    }

    const csvOptions = {
      header: options.headers !== false,
      delimiter: options.delimiter || ',',
      quoted: true,
      quote: options.quote || '"',
      escape: options.escape || '"'
    };

    return csvStringify(json, csvOptions);
  } catch (error) {
    throw new Error(`Failed to convert JSON to CSV: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const csvToJson = (csv: string, options: CsvOptions = {}): any[] => {
  try {
    const parseOptions = {
      columns: options.headers !== false,
      delimiter: options.delimiter || ',',
      quote: options.quote || '"',
      escape: options.escape || '"',
      skip_empty_lines: options.skipEmptyLines !== false,
      trim: true,
      cast: true,
      cast_date: true
    };

    return csvParse(csv, parseOptions);
  } catch (error) {
    throw new Error(`Failed to convert CSV to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonToMarkdown = (json: any, title?: string): string => {
  try {
    let markdown = '';
    
    if (title) {
      markdown += `# ${title}\n\n`;
    }

    if (Array.isArray(json)) {
      // Convert array to table
      if (json.length > 0 && typeof json[0] === 'object') {
        const headers = Object.keys(json[0]);
        markdown += '| ' + headers.join(' | ') + ' |\n';
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        
        json.forEach(row => {
          const values = headers.map(h => {
            const value = row[h];
            return value !== null && value !== undefined ? String(value) : '';
          });
          markdown += '| ' + values.join(' | ') + ' |\n';
        });
      } else {
        // Simple list
        json.forEach(item => {
          markdown += `- ${item}\n`;
        });
      }
    } else if (typeof json === 'object' && json !== null) {
      // Convert object to definition list
      Object.entries(json).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          markdown += `## ${key}\n\n`;
          markdown += jsonToMarkdown(value);
        } else {
          markdown += `**${key}:** ${value}\n\n`;
        }
      });
    } else {
      markdown += String(json);
    }

    return markdown;
  } catch (error) {
    throw new Error(`Failed to convert JSON to Markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const csvToMarkdown = (csv: string, options: CsvOptions = {}): string => {
  try {
    const json = csvToJson(csv, options);
    
    if (json.length === 0) {
      return '';
    }

    const headers = Object.keys(json[0]);
    let markdown = '| ' + headers.join(' | ') + ' |\n';
    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    json.forEach(row => {
      const values = headers.map(h => {
        const value = row[h];
        return value !== null && value !== undefined ? String(value) : '';
      });
      markdown += '| ' + values.join(' | ') + ' |\n';
    });

    return markdown;
  } catch (error) {
    throw new Error(`Failed to convert CSV to Markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
};