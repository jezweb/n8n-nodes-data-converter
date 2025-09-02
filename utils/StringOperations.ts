export const cleanFilename = (filename: string, options: {
  maxLength?: number;
  replacement?: string;
  preserveExtension?: boolean;
} = {}): string => {
  try {
    const {
      maxLength = 255,
      replacement = '_',
      preserveExtension = true
    } = options;

    let name = filename;
    let extension = '';

    if (preserveExtension) {
      const lastDot = filename.lastIndexOf('.');
      if (lastDot > 0) {
        name = filename.slice(0, lastDot);
        extension = filename.slice(lastDot);
      }
    }

    // Replace problematic characters
    name = name
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, replacement) // Windows reserved chars + control chars
      .replace(/[\x80-\xff]/g, replacement) // Extended ASCII
      .replace(/\s+/g, replacement) // Multiple spaces to single replacement
      .replace(/\.+/g, replacement) // Multiple dots
      .replace(new RegExp(`\\${replacement}+`, 'g'), replacement) // Multiple replacements to single
      .replace(new RegExp(`^\\${replacement}|\\${replacement}$`, 'g'), ''); // Trim replacements

    // Handle reserved Windows names
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames.includes(name.toUpperCase())) {
      name = name + replacement + 'file';
    }

    // Ensure minimum length
    if (name.length === 0) {
      name = 'unnamed';
    }

    // Handle length limits
    const maxNameLength = maxLength - extension.length;
    if (name.length > maxNameLength) {
      name = name.slice(0, maxNameLength);
    }

    return name + extension;
  } catch (error) {
    throw new Error(`Failed to clean filename: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const slugify = (text: string, options: {
  separator?: string;
  lowercase?: boolean;
  strict?: boolean;
} = {}): string => {
  try {
    const {
      separator = '-',
      lowercase = true,
      strict = false
    } = options;

    let result = text
      .trim()
      .replace(/\s+/g, separator) // Replace spaces with separator
      .replace(/[^\w\-_.~]/g, strict ? '' : separator) // Remove or replace special chars
      .replace(new RegExp(`\\${separator}+`, 'g'), separator) // Collapse multiple separators
      .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), ''); // Trim separators

    return lowercase ? result.toLowerCase() : result;
  } catch (error) {
    throw new Error(`Failed to slugify text: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const toTitleCase = (text: string, options: {
  preserveAllCaps?: boolean;
} = {}): string => {
  try {
    const { preserveAllCaps = false } = options;
    
    // Articles, conjunctions, and prepositions to keep lowercase (unless at start/end)
    const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with'];
    
    return text
      .toLowerCase()
      .split(/\s+/)
      .map((word, index, array) => {
        if (preserveAllCaps && word === word.toUpperCase() && word.length > 1) {
          return word.toUpperCase();
        }
        
        const isFirstOrLast = index === 0 || index === array.length - 1;
        const isMinorWord = minorWords.includes(word.toLowerCase());
        
        if (isFirstOrLast || !isMinorWord) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        
        return word;
      })
      .join(' ');
  } catch (error) {
    throw new Error(`Failed to convert to title case: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const toCamelCase = (text: string): string => {
  try {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');
  } catch (error) {
    throw new Error(`Failed to convert to camel case: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const toKebabCase = (text: string): string => {
  try {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-]/g, '')
      .toLowerCase();
  } catch (error) {
    throw new Error(`Failed to convert to kebab case: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const toSnakeCase = (text: string): string => {
  try {
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s\-]+/g, '_')
      .replace(/[^\w_]/g, '')
      .toLowerCase();
  } catch (error) {
    throw new Error(`Failed to convert to snake case: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const normalizeWhitespace = (text: string, options: {
  collapseSpaces?: boolean;
  trimLines?: boolean;
  removeEmptyLines?: boolean;
} = {}): string => {
  try {
    const {
      collapseSpaces = true,
      trimLines = true,
      removeEmptyLines = false
    } = options;

    let result = text;

    if (trimLines) {
      result = result.split('\n').map(line => line.trim()).join('\n');
    }

    if (removeEmptyLines) {
      result = result.split('\n').filter(line => line.trim().length > 0).join('\n');
    }

    if (collapseSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }

    return result.trim();
  } catch (error) {
    throw new Error(`Failed to normalize whitespace: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const removeSpecialChars = (text: string, options: {
  keepSpaces?: boolean;
  keepNumbers?: boolean;
  keepBasicPunctuation?: boolean;
  customAllowed?: string;
} = {}): string => {
  try {
    const {
      keepSpaces = true,
      keepNumbers = true,
      keepBasicPunctuation = false,
      customAllowed = ''
    } = options;

    let pattern = '[^a-zA-Z';
    
    if (keepNumbers) pattern += '0-9';
    if (keepSpaces) pattern += ' ';
    if (keepBasicPunctuation) pattern += '.,!?;:';
    if (customAllowed) pattern += customAllowed.replace(/[[\]\\^-]/g, '\\$&');
    
    pattern += ']';

    return text.replace(new RegExp(pattern, 'g'), '');
  } catch (error) {
    throw new Error(`Failed to remove special characters: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const capitalizeFirst = (text: string, options: {
  lowerRest?: boolean;
} = {}): string => {
  try {
    const { lowerRest = false } = options;
    
    if (text.length === 0) return text;
    
    const firstChar = text.charAt(0).toUpperCase();
    const rest = lowerRest ? text.slice(1).toLowerCase() : text.slice(1);
    
    return firstChar + rest;
  } catch (error) {
    throw new Error(`Failed to capitalize first character: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const reverse = (text: string): string => {
  try {
    return text.split('').reverse().join('');
  } catch (error) {
    throw new Error(`Failed to reverse text: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const truncate = (text: string, options: {
  length: number;
  suffix?: string;
  preserveWords?: boolean;
} = { length: 100 }): string => {
  try {
    const {
      length,
      suffix = '...',
      preserveWords = true
    } = options;

    if (text.length <= length) return text;

    let truncated = text.slice(0, length - suffix.length);

    if (preserveWords) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > length * 0.5) { // Only if we don't lose more than half the text
        truncated = truncated.slice(0, lastSpace);
      }
    }

    return truncated + suffix;
  } catch (error) {
    throw new Error(`Failed to truncate text: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const padText = (text: string, options: {
  length: number;
  padChar?: string;
  side?: 'left' | 'right' | 'both';
} = { length: 10 }): string => {
  try {
    const {
      length,
      padChar = ' ',
      side = 'right'
    } = options;

    if (text.length >= length) return text;

    const padLength = length - text.length;

    switch (side) {
      case 'left':
        return padChar.repeat(padLength) + text;
      case 'both':
        const leftPad = Math.floor(padLength / 2);
        const rightPad = padLength - leftPad;
        return padChar.repeat(leftPad) + text + padChar.repeat(rightPad);
      case 'right':
      default:
        return text + padChar.repeat(padLength);
    }
  } catch (error) {
    throw new Error(`Failed to pad text: ${error instanceof Error ? error.message : String(error)}`);
  }
};