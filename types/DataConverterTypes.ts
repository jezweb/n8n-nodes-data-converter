import { INodeExecutionData } from 'n8n-workflow';

export type DataConverterResource = 'base64' | 'binary' | 'format' | 'html' | 'encoding';

export type Base64Operation = 
  | 'textToBase64'
  | 'base64ToText'
  | 'binaryToBase64'
  | 'base64ToBinary'
  | 'jsonToBase64'
  | 'base64ToJson'
  | 'createDataUrl'
  | 'parseDataUrl';

export type BinaryOperation =
  | 'jsonToBinary'
  | 'binaryToJson'
  | 'textToBinary'
  | 'binaryToText';

export type FormatOperation =
  | 'jsonToXml'
  | 'xmlToJson'
  | 'jsonToYaml'
  | 'yamlToJson'
  | 'jsonToCsv'
  | 'csvToJson'
  | 'jsonToMarkdown'
  | 'csvToMarkdown';

export type HtmlOperation =
  | 'jsonToHtmlTable'
  | 'jsonToHtmlList'
  | 'csvToHtmlTable'
  | 'markdownToHtml';

export type EncodingOperation =
  | 'urlEncode'
  | 'urlDecode'
  | 'htmlEncode'
  | 'htmlDecode'
  | 'hexEncode'
  | 'hexDecode';

export interface DataUrlInfo {
  mimeType: string;
  data: string;
  isBase64: boolean;
}

export interface CsvOptions {
  delimiter?: string;
  quote?: string;
  escape?: string;
  headers?: boolean;
  skipEmptyLines?: boolean;
}

export interface HtmlTableOptions {
  tableClass?: string;
  headerClass?: string;
  rowClass?: string;
  cellClass?: string;
  includeIndex?: boolean;
}

export interface MarkdownOptions {
  flavor?: 'github' | 'standard';
  breaks?: boolean;
  tables?: boolean;
}