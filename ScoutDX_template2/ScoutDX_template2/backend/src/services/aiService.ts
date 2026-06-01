const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const DEFAULT_NG_WORDS = [
  '必ず',
  '絶対に',
  '誰でも',
  '簡単に',
  '確実に',
  '今だけ',
  '早い者勝ち',
  '限定',
  '日本人限定',
  '外国人NG',
  '女性限定',
  '男性歓迎',
  '既婚者歓迎',
  '若手限定',
  '高収入保証'
];

const normalizeNGWords = (ngWords?: string | string[]): string[] => {
  const rawWords = Array.isArray(ngWords)
    ? ngWords
    : (ngWords || '').split(/[,、]/);

  return Array.from(
    new Set(
      [...DEFAULT_NG_WORDS, ...rawWords]
        .map((word) => word.trim())
        .filter(Boolean)
    )
  );
};

export const aiService = {
  generateScoutText: async (draftData: any, aiRequest: any): Promise<string> => {
    const companyName = draftData?.company_name || '貴社';
    const position = draftData?.position || aiRequest?.position || 'ポジション';
    const appeal = draftData?.job_appeal || '';
    const salary = draftData?.salary || aiRequest?.salary || '';

    let text = '候補者様\n\n';
    text += `この度は、${companyName}の${position}ポジションについてご案内いたします。\n\n`;

    if (appeal) {
      text += `【このポジションの魅力】\n${appeal}\n\n`;
    }

    if (salary) {
      text += `想定年収: ${salary}\n\n`;
    }

    text += 'これまでのご経験を活かせる環境です。';
    text += 'ぜひ一度カジュアルにお話しできれば幸いです。\n';

    return text;
  },

  checkNGWords: (text: string, ngWords?: string | string[]) => {
    const normalizedWords = normalizeNGWords(ngWords);

    const detectedWords = normalizedWords.filter((word) =>
      new RegExp(escapeRegExp(word), 'i').test(text)
    );

    return {
      passed: detectedWords.length === 0,
      detectedWords
    };
  }
};
