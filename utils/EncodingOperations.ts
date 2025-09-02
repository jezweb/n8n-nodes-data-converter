export const urlEncode = (text: string): string => {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    throw new Error(`Failed to URL encode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const urlDecode = (text: string): string => {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    throw new Error(`Failed to URL decode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const htmlEncode = (text: string): string => {
  try {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    
    return text.replace(/[&<>"'`=\/]/g, s => map[s]);
  } catch (error) {
    throw new Error(`Failed to HTML encode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const htmlDecode = (text: string): string => {
  try {
    const map: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
      '&apos;': "'"
    };
    
    let result = text;
    Object.entries(map).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });
    
    // Handle numeric entities
    result = result.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });
    
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    return result;
  } catch (error) {
    throw new Error(`Failed to HTML decode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const hexEncode = (input: string | Buffer): string => {
  try {
    const buffer = typeof input === 'string' ? Buffer.from(input, 'utf-8') : input;
    return buffer.toString('hex');
  } catch (error) {
    throw new Error(`Failed to hex encode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const hexDecode = (hex: string): Buffer => {
  try {
    // Remove any spaces or non-hex characters
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Invalid hex string length');
    }
    
    return Buffer.from(cleanHex, 'hex');
  } catch (error) {
    throw new Error(`Failed to hex decode: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const hexDecodeToString = (hex: string, encoding: BufferEncoding = 'utf-8'): string => {
  try {
    const buffer = hexDecode(hex);
    return buffer.toString(encoding);
  } catch (error) {
    throw new Error(`Failed to hex decode to string: ${error instanceof Error ? error.message : String(error)}`);
  }
};