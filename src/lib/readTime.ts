export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/[#*`\[\]()]/g, "").replace(/\s+/g, " ").trim();
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};
