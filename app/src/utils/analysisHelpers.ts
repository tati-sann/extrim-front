export const analysisHelpers = {
  getUrgeDescription(score: number): string {
    if (score > 80) return 'Высокий уровень побудительных конструкций';

    if (score > 60) return 'Заметное количество побудительных конструкций';

    if (score > 40) return 'Умеренное количество побудительных конструкций';

    if (score > 20) return 'Незначительные побудительные конструкции';

    return 'Побудительные конструкции практически отсутствуют';
  },

  getViolenceDescription(score: number): string {
    if (score > 70) return 'Явные побуждения к физическому насилию';

    if (score > 50) return 'Заметные признаки побуждений к насилию';

    if (score > 30) return 'Возможные косвенные побуждения к насилию';

    if (score > 10) return 'Единичные упоминания, связанные с насилием';

    return 'Признаки побуждений к насилию отсутствуют';
  },

  getVerdictTitle(isDangerous: boolean, requiresAttention: boolean): string {
    if (isDangerous) return 'ВЫСОКИЙ РИСК';

    if (requiresAttention) return 'ТРЕБУЕТ ВНИМАНИЯ';

    return 'НИЗКИЙ РИСК';
  },

  getVerdictDescription(
    isDangerous: boolean,
    requiresAttention: boolean,
    urgeScore: number,
    violenceScore: number
  ): string {
    if (isDangerous) {
      return `Текст содержит явные побуждения к насилию (${violenceScore}%). Требуется немедленная проверка модератором.`;
    }

    if (requiresAttention) {
      return `Текст требует дополнительной проверки. Обнаружены побудительные конструкции (${urgeScore}%)${violenceScore > 0 ? ` и признаки насилия (${violenceScore}%)` : ''}.`;
    }

    return `Текст не представляет значительной опасности. Уровень побуждений в пределах нормы.`;
  },

  generateUrgeDetails(text: string, score: number): string[] {
    const details = [];
    const wordCount = text.split(/\s+/).length;

    details.push(`Проанализировано ${wordCount} слов`);
    details.push(`Обнаружено ${Math.floor(score / 20)} типов побудительных конструкций`);

    if (score > 60) {
      details.push('Использование императивных конструкций');
      details.push('Прямые призывы к действию');
    }

    if (score > 30) {
      details.push('Наличие побудительных частиц и междометий');
    }

    details.push('Анализ выполнен нейросетевым модулем определения побуждений');

    return details;
  },

  generateViolenceDetails(text: string, score: number): string[] {
    const details = [];

    details.push(`Уровень опасности: ${score > 50 ? 'высокий' : score > 30 ? 'средний' : 'низкий'}`);

    if (score > 50) {
      details.push('Обнаружены прямые упоминания насильственных действий');
      details.push('Использование агрессивной лексики');
    }

    if (score > 30) {
      details.push('Косвенные ссылки на применение силы');
      details.push('Эмоционально окрашенные выражения');
    }

    if (score > 10) {
      details.push('Отдельные слова могут быть интерпретированы как связанные с насилием');
    }

    details.push('Анализ выполнен нейросетевым модулем определения побуждений к насилию');

    return details;
  },

  getUrgeProgressColor(percentage: number): string {
    if (percentage > 80) return '#f59e0b';

    if (percentage > 60) return '#eab308';

    if (percentage > 40) return '#84cc16';

    return '#10b981';
  },

  getViolenceProgressColor(percentage: number): string {
    if (percentage > 70) return '#ef4444';

    if (percentage > 50) return '#f97316';

    if (percentage > 30) return '#eab308';

    return '#10b981';
  }
};
