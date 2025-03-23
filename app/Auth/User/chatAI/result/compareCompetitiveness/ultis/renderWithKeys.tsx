// utils/renderWithKeys.tsx
import React from 'react';

interface RenderWithKeysProps {
    text: string | React.ReactNode[];
    onKeywordClick?: (keyword: string) => void;
    className?: string;
}

export const renderWithKeys = ({ text, onKeywordClick, className = 'keyword' }: RenderWithKeysProps) => {
    if (typeof text !== 'string') {
        return text;
    }

    const regex = /<key>(.*?)<\/key>/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const startIndex = match.index;
        const endIndex = regex.lastIndex;
        const keyword = match[1];

        if (startIndex > lastIndex) {
            parts.push(text.slice(lastIndex, startIndex));
        }

        parts.push(
            <span
                key={endIndex}
                className={className}
                style={{cursor: onKeywordClick ? 'pointer' : 'default' }}
                onClick={() => onKeywordClick && onKeywordClick(keyword)}
            >
                {keyword}
            </span>
        );

        lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};