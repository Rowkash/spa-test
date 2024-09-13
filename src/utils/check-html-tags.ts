import { BadRequestException } from '@nestjs/common';

export async function checkHtmlTags(text: string) {
  // =============== Check valid html tags =============== //

  const invalidTagsReg = /<(?!\/?(i|strong|code|a)\b[^>]*>)[^>]+>/g;
  if (invalidTagsReg.test(text)) {
    throw new BadRequestException(
      'Found invalid HTML tag. Use only <a>, <i>, <strong>, or <code> tags',
    );
  }

  // =============== Check tags attributes =============== //

  const checkTagAttributes = /<(i|strong|code)\s+[^>]+>/g;
  if (checkTagAttributes.test(text)) {
    throw new BadRequestException(
      'Tags <i>, <strong>, and <code> must not have attributes',
    );
  }

  // =============== Check tag a =============== //

  const checkAnyATag = /<a\b[^>]*>/g;
  const checkCorrectATag = /<a\s+href="[^"]+"\s+title="[^"]+">/g;

  if (checkAnyATag.test(text)) {
    if (!checkCorrectATag.test(text)) {
      throw new BadRequestException(
        'Tag <a> must have href and title attributes',
      );
    }
  }

  // =============== Check nested tags =============== //

  const allowedTags =
    /<(i|strong|code)>(.*?)<\/\1>|<a\s+href="[^"]+"\s+title="[^"]+">(.*?)<\/a>/g;

  let match = [];

  while ((match = allowedTags.exec(text)) !== null) {
    const content = match[2] || match[3];
    if (content && /<[^>]+>/.test(content)) {
      throw new BadRequestException('Nested HTML tags are not allowed');
    }
  }

  // =============== Check missing open or close tags =============== //

  const allTagsPattern = /<\/?(i|strong|code|a)\b[^>]*>/g;
  const tags = [];
  let tagMatch = [];

  while ((tagMatch = allTagsPattern.exec(text)) !== null) {
    const isClosingTag = tagMatch[0].startsWith('</');
    const tagName = tagMatch[1];

    if (isClosingTag) {
      if (tags.length === 0 || tags[tags.length - 1] !== tagName) {
        throw new BadRequestException(
          `Tag </${tagName}> was close, but not open`,
        );
      }
      tags.pop();
    } else {
      tags.push(tagName);
    }
  }

  if (tags.length > 0) {
    throw new BadRequestException(
      `Some HTML tag was not close: ${tags.join(', ')}`,
    );
  }

  return;
}
