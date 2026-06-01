export const aiService = {
  generateScoutText: async (draftData: any, aiRequest: any): Promise<string> => {
    const companyName = draftData?.company_name || '貴社';
    const position = draftData?.position || aiRequest?.position || 'ポジション';
    const appeal = draftData?.job_appeal || '';
    const salary = draftData?.salary || aiRequest?.salary || '';
    const seekerNameRaw = aiRequest?.seeker_name || aiRequest?.seekerName || '';
    const seekerName = typeof seekerNameRaw === 'string' ? seekerNameRaw.trim() : '';
    const greeting = seekerName ? `${seekerName}様` : '候補者様';

    let text = `${greeting}\n\n`;
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
    const normalizedWords = Array.isArray(ngWords)
      ? ngWords
      : (ngWords || '')
          .split(',')
          .map((word) => word.trim())
          .filter(Boolean);

    const detectedWords = normalizedWords.filter((word) =>
      new RegExp(word, 'i').test(text)
    );

    return {
      passed: detectedWords.length === 0,
      detectedWords
    };
  }
};