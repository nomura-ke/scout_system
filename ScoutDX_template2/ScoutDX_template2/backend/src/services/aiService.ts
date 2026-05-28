import { CreateScoutRequest } from '../types';

export const aiService = {
  /**
   * 疑似AI：スカウト文生成
   */
  generateScoutText: (data: CreateScoutRequest): string => {
    const { applicant_name, company_name, job_title, job_appeal, ng_words } = data;

    // NGワードチェック
    const ngWordList = ng_words ? ng_words.split(',').map((w) => w.trim()) : [];

    let text = `${applicant_name}様\n\n`;
    text += `この度は、${company_name}の${job_title}のポジションについてご案内させていただきます。\n\n`;

    if (job_appeal) {
      text += `【このポジションの魅力】\n${job_appeal}\n\n`;
    }

    text += `あなたのこれまでのご経験を活かし、さらなるキャリアアップを目指しませんか？\n`;
    text += `ぜひ一度、カジュアルにお話しさせていただければ幸いです。\n\n`;
    text += `ご興味がございましたら、お気軽にご返信ください。\n`;
    text += `何卒よろしくお願いいたします。`;

    // NGワードフィルタリング（簡易版）
    ngWordList.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      text = text.replace(regex, '***');
    });

    return text;
  },
};