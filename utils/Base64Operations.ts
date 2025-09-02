import { NodeOperationError } from 'n8n-workflow';
import { DataUrlInfo } from '../types/DataConverterTypes';

export const textToBase64 = (text: string): string => {
  try {
    return Buffer.from(text, 'utf-8').toString('base64');
  } catch (error) {
    throw new Error(`Failed to encode text to Base64: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const base64ToText = (base64: string): string => {
  try {
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to decode Base64 to text: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const binaryToBase64 = (buffer: Buffer): string => {
  try {
    return buffer.toString('base64');
  } catch (error) {
    throw new Error(`Failed to encode binary to Base64: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const base64ToBinary = (base64: string): Buffer => {
  try {
    // Clean the base64 string
    const cleanBase64 = base64.replace(/\s/g, '');
    return Buffer.from(cleanBase64, 'base64');
  } catch (error) {
    throw new Error(`Failed to decode Base64 to binary: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonToBase64 = (json: any): string => {
  try {
    const jsonString = JSON.stringify(json);
    return Buffer.from(jsonString, 'utf-8').toString('base64');
  } catch (error) {
    throw new Error(`Failed to encode JSON to Base64: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const base64ToJson = (base64: string): any => {
  try {
    const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to decode Base64 to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const createDataUrl = (data: Buffer | string, mimeType: string): string => {
  try {
    const base64Data = typeof data === 'string' 
      ? Buffer.from(data).toString('base64')
      : data.toString('base64');
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    throw new Error(`Failed to create data URL: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const parseDataUrl = (dataUrl: string): DataUrlInfo => {
  try {
    const matches = dataUrl.match(/^data:([^;]+)(;base64)?,(.+)$/);
    
    if (!matches) {
      throw new Error('Invalid data URL format');
    }
    
    return {
      mimeType: matches[1] || 'application/octet-stream',
      isBase64: !!matches[2],
      data: matches[3]
    };
  } catch (error) {
    throw new Error(`Failed to parse data URL: ${error instanceof Error ? error.message : String(error)}`);
  }
};