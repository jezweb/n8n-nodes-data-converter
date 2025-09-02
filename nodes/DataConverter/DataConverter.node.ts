import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
  IDataObject,
} from 'n8n-workflow';

import * as Base64Ops from '../../utils/Base64Operations';
import * as BinaryOps from '../../utils/BinaryOperations';
import * as FormatOps from '../../utils/FormatOperations';
import * as HtmlOps from '../../utils/HtmlOperations';
import * as EncodingOps from '../../utils/EncodingOperations';
import * as StringOps from '../../utils/StringOperations';

export class DataConverter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Data Converter',
    name: 'dataConverter',
    icon: 'file:dataconverter.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Convert between various data formats - Base64, Binary, JSON, XML, YAML, CSV, HTML, and more',
    defaults: {
      name: 'Data Converter',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [],
    usableAsTool: true,
    properties: [
      // Resource Selection
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Base64',
            value: 'base64',
            description: 'Encode and decode Base64 data',
          },
          {
            name: 'Binary',
            value: 'binary',
            description: 'Convert between binary and other formats',
          },
          {
            name: 'Encoding',
            value: 'encoding',
            description: 'URL, HTML entity, and hex encoding/decoding',
          },
          {
            name: 'Format',
            value: 'format',
            description: 'Convert between JSON, XML, YAML, CSV, and Markdown',
          },
          {
            name: 'HTML',
            value: 'html',
            description: 'Generate HTML from data',
          },
          {
            name: 'String',
            value: 'string',
            description: 'Text transformations including filename cleaning, case conversion, and formatting',
          },
        ],
        default: 'base64',
      },

      // Base64 Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['base64'],
          },
        },
        options: [
          {
            name: 'Base64 to Binary',
            value: 'base64ToBinary',
            description: 'Decode Base64 to binary data',
            action: 'Decode base64 to binary',
          },
          {
            name: 'Base64 to JSON',
            value: 'base64ToJson',
            description: 'Decode Base64 to JSON object',
            action: 'Decode base64 to json',
          },
          {
            name: 'Base64 to Text',
            value: 'base64ToText',
            description: 'Decode Base64 to text',
            action: 'Decode base64 to text',
          },
          {
            name: 'Binary to Base64',
            value: 'binaryToBase64',
            description: 'Encode binary data as Base64',
            action: 'Encode binary as base64',
          },
          {
            name: 'Create Data URL',
            value: 'createDataUrl',
            description: 'Create a data URL from content',
            action: 'Create data URL',
          },
          {
            name: 'JSON to Base64',
            value: 'jsonToBase64',
            description: 'Encode JSON object as Base64',
            action: 'Encode json as base64',
          },
          {
            name: 'Parse Data URL',
            value: 'parseDataUrl',
            description: 'Extract data from a data URL',
            action: 'Parse data URL',
          },
          {
            name: 'Text to Base64',
            value: 'textToBase64',
            description: 'Encode text as Base64',
            action: 'Encode text as base64',
          },
        ],
        default: 'textToBase64',
      },

      // Binary Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['binary'],
          },
        },
        options: [
          {
            name: 'JSON to Binary',
            value: 'jsonToBinary',
            description: 'Convert JSON to binary data',
            action: 'Convert JSON to binary',
          },
          {
            name: 'Binary to JSON',
            value: 'binaryToJson',
            description: 'Parse binary data as JSON',
            action: 'Convert binary to JSON',
          },
          {
            name: 'Text to Binary',
            value: 'textToBinary',
            description: 'Convert text to binary data',
            action: 'Convert text to binary',
          },
          {
            name: 'Binary to Text',
            value: 'binaryToText',
            description: 'Convert binary data to text',
            action: 'Convert binary to text',
          },
        ],
        default: 'jsonToBinary',
      },

      // Format Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['format'],
          },
        },
        options: [
          {
            name: 'CSV to JSON',
            value: 'csvToJson',
            description: 'Parse CSV to JSON array',
            action: 'Convert CSV to JSON',
          },
          {
            name: 'CSV to Markdown',
            value: 'csvToMarkdown',
            description: 'Convert CSV to Markdown table',
            action: 'Convert csv to markdown',
          },
          {
            name: 'JSON to CSV',
            value: 'jsonToCsv',
            description: 'Convert JSON array to CSV',
            action: 'Convert JSON to CSV',
          },
          {
            name: 'JSON to Markdown',
            value: 'jsonToMarkdown',
            description: 'Format JSON as Markdown',
            action: 'Convert json to markdown',
          },
          {
            name: 'JSON to XML',
            value: 'jsonToXml',
            description: 'Convert JSON to XML',
            action: 'Convert JSON to XML',
          },
          {
            name: 'JSON to YAML',
            value: 'jsonToYaml',
            description: 'Convert JSON to YAML',
            action: 'Convert JSON to YAML',
          },
          {
            name: 'XML to JSON',
            value: 'xmlToJson',
            description: 'Parse XML to JSON',
            action: 'Convert XML to JSON',
          },
          {
            name: 'YAML to JSON',
            value: 'yamlToJson',
            description: 'Parse YAML to JSON',
            action: 'Convert YAML to JSON',
          },
        ],
        default: 'jsonToXml',
      },

      // HTML Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['html'],
          },
        },
        options: [
          {
            name: 'JSON to HTML Table',
            value: 'jsonToHtmlTable',
            description: 'Create HTML table from JSON',
            action: 'Create HTML table',
          },
          {
            name: 'JSON to HTML List',
            value: 'jsonToHtmlList',
            description: 'Create HTML list from JSON',
            action: 'Create HTML list',
          },
          {
            name: 'CSV to HTML Table',
            value: 'csvToHtmlTable',
            description: 'Convert CSV to HTML table',
            action: 'Convert CSV to HTML table',
          },
          {
            name: 'Markdown to HTML',
            value: 'markdownToHtml',
            description: 'Convert Markdown to HTML',
            action: 'Convert markdown to html',
          },
        ],
        default: 'jsonToHtmlTable',
      },

      // Encoding Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['encoding'],
          },
        },
        options: [
          {
            name: 'Hex Decode',
            value: 'hexDecode',
            description: 'Convert from hexadecimal',
            action: 'Hex decode',
          },
          {
            name: 'Hex Encode',
            value: 'hexEncode',
            description: 'Convert to hexadecimal',
            action: 'Hex encode',
          },
          {
            name: 'HTML Decode',
            value: 'htmlDecode',
            description: 'Decode HTML entities',
            action: 'Html decode text',
          },
          {
            name: 'HTML Encode',
            value: 'htmlEncode',
            description: 'Encode HTML entities',
            action: 'Html encode text',
          },
          {
            name: 'URL Decode',
            value: 'urlDecode',
            description: 'Decode URL-encoded text',
            action: 'Url decode text',
          },
          {
            name: 'URL Encode',
            value: 'urlEncode',
            description: 'Encode text for URLs',
            action: 'Url encode text',
          },
        ],
        default: 'urlEncode',
      },

      // String Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['string'],
          },
        },
        options: [
          {
            name: 'Camel Case',
            value: 'toCamelCase',
            description: 'Convert to camelCase (firstName)',
            action: 'Convert to camel case',
          },
          {
            name: 'Capitalize First',
            value: 'capitalizeFirst',
            description: 'Capitalize only the first character',
            action: 'Capitalize first character',
          },
          {
            name: 'Clean Filename',
            value: 'cleanFilename',
            description: 'Clean filename by removing or replacing unsafe characters',
            action: 'Clean filename for file systems',
          },
          {
            name: 'Kebab Case',
            value: 'toKebabCase',
            description: 'Convert to kebab-case (first-name)',
            action: 'Convert to kebab case',
          },
          {
            name: 'Lower Case',
            value: 'toLowerCase',
            description: 'Convert all characters to lowercase',
            action: 'Convert to lowercase',
          },
          {
            name: 'Normalize Whitespace',
            value: 'normalizeWhitespace',
            description: 'Clean up extra spaces, tabs, and line breaks',
            action: 'Normalize whitespace',
          },
          {
            name: 'Pad Text',
            value: 'padText',
            description: 'Add padding characters to reach specified length',
            action: 'Pad text',
          },
          {
            name: 'Remove Special Characters',
            value: 'removeSpecialChars',
            description: 'Remove special characters, keeping only letters and numbers',
            action: 'Remove special characters',
          },
          {
            name: 'Reverse Text',
            value: 'reverse',
            description: 'Reverse the order of characters',
            action: 'Reverse text',
          },
          {
            name: 'Slugify',
            value: 'slugify',
            description: 'Create URL-friendly slug from text',
            action: 'Create url friendly slug',
          },
          {
            name: 'Snake Case',
            value: 'toSnakeCase',
            description: 'Convert to snake_case (first_name)',
            action: 'Convert to snake case',
          },
          {
            name: 'Title Case',
            value: 'toTitleCase',
            description: 'Convert to Title Case (capitalizing major words)',
            action: 'Convert to title case',
          },
          {
            name: 'Truncate',
            value: 'truncate',
            description: 'Truncate text to specified length with optional suffix',
            action: 'Truncate text',
          },
          {
            name: 'Upper Case',
            value: 'toUpperCase',
            description: 'Convert all characters to uppercase',
            action: 'Convert to uppercase',
          },
        ],
        default: 'cleanFilename',
      },

      // Input Parameters
      {
        displayName: 'Input Data',
        name: 'inputData',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['base64', 'encoding', 'string'],
            operation: [
              'textToBase64',
              'base64ToText',
              'base64ToJson',
              'parseDataUrl',
              'urlEncode',
              'urlDecode',
              'htmlEncode',
              'htmlDecode',
              'hexEncode',
              'hexDecode',
              'cleanFilename',
              'slugify',
              'toTitleCase',
              'toCamelCase',
              'toKebabCase',
              'toSnakeCase',
              'toUpperCase',
              'toLowerCase',
              'normalizeWhitespace',
              'removeSpecialChars',
              'capitalizeFirst',
              'reverse',
              'truncate',
              'padText',
            ],
          },
        },
        placeholder: 'Enter text or use an expression',
        description: 'The data to convert',
      },

      {
        displayName: 'Input JSON',
        name: 'inputJson',
        type: 'json',
        default: '{}',
        required: true,
        displayOptions: {
          show: {
            resource: ['base64', 'binary', 'format', 'html'],
            operation: [
              'jsonToBase64',
              'jsonToBinary',
              'jsonToXml',
              'jsonToYaml',
              'jsonToCsv',
              'jsonToMarkdown',
              'jsonToHtmlTable',
              'jsonToHtmlList',
            ],
          },
        },
        placeholder: '{"key": "value"}',
        description: 'The JSON data to convert',
      },

      {
        displayName: 'Input Data',
        name: 'inputData',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['format', 'html'],
            operation: [
              'xmlToJson',
              'yamlToJson',
              'csvToJson',
              'csvToMarkdown',
              'csvToHtmlTable',
              'markdownToHtml',
            ],
          },
        },
        placeholder: 'Enter data to convert',
        description: 'The data to convert',
      },

      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
          show: {
            resource: ['base64', 'binary'],
            operation: ['binaryToBase64', 'binaryToJson', 'binaryToText'],
          },
        },
        description: 'Name of the binary property to convert',
      },

      // Additional Options
      {
        displayName: 'MIME Type',
        name: 'mimeType',
        type: 'string',
        default: 'application/octet-stream',
        displayOptions: {
          show: {
            resource: ['base64'],
            operation: ['createDataUrl'],
          },
        },
        placeholder: 'image/png',
        description: 'MIME type for the data URL',
      },

      {
        displayName: 'Root Element Name',
        name: 'rootName',
        type: 'string',
        default: 'root',
        displayOptions: {
          show: {
            resource: ['format'],
            operation: ['jsonToXml'],
          },
        },
        description: 'Name of the XML root element',
      },

      {
        displayName: 'CSV Delimiter',
        name: 'csvDelimiter',
        type: 'string',
        default: ',',
        displayOptions: {
          show: {
            resource: ['format'],
            operation: ['jsonToCsv', 'csvToJson', 'csvToMarkdown'],
          },
        },
        description: 'Character to separate CSV fields',
      },

      {
        displayName: 'Include Headers',
        name: 'csvHeaders',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: {
            resource: ['format'],
            operation: ['jsonToCsv', 'csvToJson'],
          },
        },
        description: 'Whether to include headers in CSV',
      },

      {
        displayName: 'Ordered List',
        name: 'orderedList',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['html'],
            operation: ['jsonToHtmlList'],
          },
        },
        description: 'Whether to create an ordered (numbered) list',
      },

      {
        displayName: 'Table Options',
        name: 'tableOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['html'],
            operation: ['jsonToHtmlTable', 'csvToHtmlTable'],
          },
        },
        options: [
          {
            displayName: 'Table Class',
            name: 'tableClass',
            type: 'string',
            default: '',
            description: 'CSS class for the table element',
          },
          {
            displayName: 'Include Index',
            name: 'includeIndex',
            type: 'boolean',
            default: false,
            description: 'Whether to include row numbers',
          },
        ],
      },

      {
        displayName: 'Output Binary',
        name: 'outputBinary',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['base64', 'binary'],
            operation: ['base64ToBinary', 'jsonToBinary', 'textToBinary'],
          },
        },
        description: 'Whether to output as binary data',
      },

      {
        displayName: 'Binary Property Name',
        name: 'outputBinaryPropertyName',
        type: 'string',
        default: 'data',
        displayOptions: {
          show: {
            outputBinary: [true],
          },
        },
        description: 'Name for the output binary property',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const resource = this.getNodeParameter('resource', itemIndex) as string;
        const operation = this.getNodeParameter('operation', itemIndex) as string;
        let result: any;

        // Base64 Operations
        if (resource === 'base64') {
          if (operation === 'textToBase64') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = Base64Ops.textToBase64(input);
          } else if (operation === 'base64ToText') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = Base64Ops.base64ToText(input);
          } else if (operation === 'binaryToBase64') {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
            const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
            const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
            result = Base64Ops.binaryToBase64(buffer);
          } else if (operation === 'base64ToBinary') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const buffer = Base64Ops.base64ToBinary(input);
            const outputBinary = this.getNodeParameter('outputBinary', itemIndex) as boolean;
            
            if (outputBinary) {
              const outputPropertyName = this.getNodeParameter('outputBinaryPropertyName', itemIndex) as string;
              const binaryData = await this.helpers.prepareBinaryData(buffer, 'file', 'application/octet-stream');
              returnData.push({
                json: {},
                binary: {
                  [outputPropertyName]: binaryData,
                },
              });
              continue;
            } else {
              result = buffer.toString('base64');
            }
          } else if (operation === 'jsonToBase64') {
            const input = this.getNodeParameter('inputJson', itemIndex);
            result = Base64Ops.jsonToBase64(input);
          } else if (operation === 'base64ToJson') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = Base64Ops.base64ToJson(input);
          } else if (operation === 'createDataUrl') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const mimeType = this.getNodeParameter('mimeType', itemIndex) as string;
            result = Base64Ops.createDataUrl(input, mimeType);
          } else if (operation === 'parseDataUrl') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = Base64Ops.parseDataUrl(input);
          }
        }

        // Binary Operations
        else if (resource === 'binary') {
          if (operation === 'jsonToBinary') {
            const input = this.getNodeParameter('inputJson', itemIndex);
            const buffer = BinaryOps.jsonToBinary(input);
            const outputBinary = this.getNodeParameter('outputBinary', itemIndex) as boolean;
            
            if (outputBinary) {
              const outputPropertyName = this.getNodeParameter('outputBinaryPropertyName', itemIndex) as string;
              const binaryData = await this.helpers.prepareBinaryData(buffer, 'file.json', 'application/json');
              returnData.push({
                json: {},
                binary: {
                  [outputPropertyName]: binaryData,
                },
              });
              continue;
            } else {
              result = buffer.toString('base64');
            }
          } else if (operation === 'binaryToJson') {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
            const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
            result = BinaryOps.binaryToJson(buffer);
          } else if (operation === 'textToBinary') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const buffer = BinaryOps.textToBinary(input);
            const outputBinary = this.getNodeParameter('outputBinary', itemIndex) as boolean;
            
            if (outputBinary) {
              const outputPropertyName = this.getNodeParameter('outputBinaryPropertyName', itemIndex) as string;
              const binaryData = await this.helpers.prepareBinaryData(buffer, 'file.txt', 'text/plain');
              returnData.push({
                json: {},
                binary: {
                  [outputPropertyName]: binaryData,
                },
              });
              continue;
            } else {
              result = buffer.toString('base64');
            }
          } else if (operation === 'binaryToText') {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
            const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
            result = BinaryOps.binaryToText(buffer);
          }
        }

        // Format Operations
        else if (resource === 'format') {
          if (operation === 'jsonToXml') {
            const input = this.getNodeParameter('inputJson', itemIndex);
            const rootName = this.getNodeParameter('rootName', itemIndex) as string;
            result = await FormatOps.jsonToXml(input, rootName);
          } else if (operation === 'xmlToJson') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = await FormatOps.xmlToJson(input);
          } else if (operation === 'jsonToYaml') {
            const input = this.getNodeParameter('inputJson', itemIndex);
            result = FormatOps.jsonToYaml(input);
          } else if (operation === 'yamlToJson') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = FormatOps.yamlToJson(input);
          } else if (operation === 'jsonToCsv') {
            const input = this.getNodeParameter('inputJson', itemIndex) as any[];
            const delimiter = this.getNodeParameter('csvDelimiter', itemIndex) as string;
            const headers = this.getNodeParameter('csvHeaders', itemIndex) as boolean;
            result = FormatOps.jsonToCsv(input, { delimiter, headers });
          } else if (operation === 'csvToJson') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const delimiter = this.getNodeParameter('csvDelimiter', itemIndex) as string;
            const headers = this.getNodeParameter('csvHeaders', itemIndex) as boolean;
            result = FormatOps.csvToJson(input, { delimiter, headers });
          } else if (operation === 'jsonToMarkdown') {
            const input = this.getNodeParameter('inputJson', itemIndex);
            result = FormatOps.jsonToMarkdown(input);
          } else if (operation === 'csvToMarkdown') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const delimiter = this.getNodeParameter('csvDelimiter', itemIndex) as string;
            result = FormatOps.csvToMarkdown(input, { delimiter });
          }
        }

        // HTML Operations
        else if (resource === 'html') {
          if (operation === 'jsonToHtmlTable') {
            const input = this.getNodeParameter('inputJson', itemIndex) as any[];
            const tableOptions = this.getNodeParameter('tableOptions', itemIndex) as IDataObject;
            result = HtmlOps.jsonToHtmlTable(input, tableOptions);
          } else if (operation === 'jsonToHtmlList') {
            const input = this.getNodeParameter('inputJson', itemIndex) as any[];
            const ordered = this.getNodeParameter('orderedList', itemIndex) as boolean;
            result = HtmlOps.jsonToHtmlList(input, ordered);
          } else if (operation === 'csvToHtmlTable') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            const tableOptions = this.getNodeParameter('tableOptions', itemIndex) as IDataObject;
            result = HtmlOps.csvToHtmlTable(input, tableOptions);
          } else if (operation === 'markdownToHtml') {
            const input = this.getNodeParameter('inputData', itemIndex) as string;
            result = HtmlOps.markdownToHtml(input);
          }
        }

        // Encoding Operations
        else if (resource === 'encoding') {
          const input = this.getNodeParameter('inputData', itemIndex) as string;
          
          if (operation === 'urlEncode') {
            result = EncodingOps.urlEncode(input);
          } else if (operation === 'urlDecode') {
            result = EncodingOps.urlDecode(input);
          } else if (operation === 'htmlEncode') {
            result = EncodingOps.htmlEncode(input);
          } else if (operation === 'htmlDecode') {
            result = EncodingOps.htmlDecode(input);
          } else if (operation === 'hexEncode') {
            result = EncodingOps.hexEncode(input);
          } else if (operation === 'hexDecode') {
            result = EncodingOps.hexDecodeToString(input);
          }
        }
        
        else if (resource === 'string') {
          const input = this.getNodeParameter('inputData', itemIndex) as string;
          
          if (operation === 'cleanFilename') {
            result = StringOps.cleanFilename(input);
          } else if (operation === 'slugify') {
            result = StringOps.slugify(input);
          } else if (operation === 'toTitleCase') {
            result = StringOps.toTitleCase(input);
          } else if (operation === 'toCamelCase') {
            result = StringOps.toCamelCase(input);
          } else if (operation === 'toKebabCase') {
            result = StringOps.toKebabCase(input);
          } else if (operation === 'toSnakeCase') {
            result = StringOps.toSnakeCase(input);
          } else if (operation === 'toUpperCase') {
            result = input.toUpperCase();
          } else if (operation === 'toLowerCase') {
            result = input.toLowerCase();
          } else if (operation === 'normalizeWhitespace') {
            result = StringOps.normalizeWhitespace(input);
          } else if (operation === 'removeSpecialChars') {
            result = StringOps.removeSpecialChars(input);
          } else if (operation === 'capitalizeFirst') {
            result = StringOps.capitalizeFirst(input);
          } else if (operation === 'reverse') {
            result = StringOps.reverse(input);
          } else if (operation === 'truncate') {
            result = StringOps.truncate(input);
          } else if (operation === 'padText') {
            result = StringOps.padText(input);
          }
        }

        // Add result to return data
        if (result !== undefined) {
          returnData.push({
            json: {
              result: typeof result === 'string' ? result : result,
              ...(typeof result === 'object' && result !== null ? result : {}),
            },
          });
        }

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : String(error),
            },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error instanceof Error ? error.message : String(error), { itemIndex });
      }
    }

    return [returnData];
  }
}