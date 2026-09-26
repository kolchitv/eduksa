export interface SpellingWord {
  id: number;
  full: string;
  char1: string; // Red (الحرف الأول)
  char2: string; // Blue (الحرف الثاني)
  char3: string; // Green (الحرف الثالث)
  char4?: string; // Purple/Amber (الحرف الرابع للكلمات الرباعية)
  category: 'fatha' | 'kasra' | 'damma' | 'rubai' | 'mad';
  categoryName: string;
  emoji: string;
  meaning: string;
  sentence: string;
}

export const SPELLING_100_WORDS: SpellingWord[] = [
  // ==========================================
  // المجموعة 1: كلمات ثلاثية بحركة الفتح (30 كلمة)
  // ==========================================
  { id: 1, full: 'دَرَسَ', char1: 'دَ', char2: 'رَ', char3: 'سَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '📚', meaning: 'تعلّم واجتهد', sentence: 'دَرَسَ فَاهِمٌ كِتَابَهُ' },
  { id: 2, full: 'كَتَبَ', char1: 'كَـ', char2: 'تَـ', char3: 'بَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✍️', meaning: 'خَطَّ بِالقَلَمِ', sentence: 'كَتَبَ سَالِمٌ دَرْسَهُ' },
  { id: 3, full: 'قَرَأَ', char1: 'قَـ', char2: 'رَ', char3: 'أَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '📖', meaning: 'تَلا الكَلِمَاتِ', sentence: 'قَرَأَ الطِّفْلُ قِصَّةً' },
  { id: 4, full: 'زَرَعَ', char1: 'زَ', char2: 'رَ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🌱', meaning: 'وَضَعَ البَذْرَةَ', sentence: 'زَرَعَ الفَلاَّحُ الشَّجَرَةَ' },
  { id: 5, full: 'حَصَدَ', char1: 'حَـ', char2: 'صَـ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🌾', meaning: 'جَمَعَ المَحْصُولَ', sentence: 'حَصَدَ الزَّارِعُ القَمْحَ' },
  { id: 6, full: 'رَسَمَ', char1: 'رَ', char2: 'سَـ', char3: 'مَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🎨', meaning: 'خَطَّ لَوْحَةً', sentence: 'رَسَمَ فَهْدٌ وَرْدَةً' },
  { id: 7, full: 'فَتَحَ', char1: 'فَـ', char2: 'تَـ', char3: 'حَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'فَتَحَ البَابَ', sentence: 'فَتَحَ عَلِيٌّ البَابَ' },
  { id: 8, full: 'جَلَسَ', char1: 'جَـ', char2: 'لَـ', char3: 'سَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🪑', meaning: 'قَعَدَ بِأَدَبٍ', sentence: 'جَلَسَ عُمَرُ عَلَى الكُرْسِيِّ' },
  { id: 9, full: 'نَظَرَ', char1: 'نَـ', char2: 'ظَـ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '👀', meaning: 'رَأَى بِعَيْنَيْهِ', sentence: 'نَظَرَ البَطَلُ إِلَى السَّمَاءِ' },
  { id: 10, full: 'شَكَرَ', char1: 'شَـ', char2: 'كَـ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🤲', meaning: 'أَثْنَى وَشَكَرَ', sentence: 'شَكَرَ الوَلَدُ أُمَّهُ' },
  { id: 11, full: 'طَبَخَ', char1: 'طَـ', char2: 'بَـ', char3: 'خَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🍲', meaning: 'أَعَدَّ الطَّعَامَ', sentence: 'طَبَخَتْ أُمِّي طَعَاماً لَذِيذاً' },
  { id: 12, full: 'رَفَعَ', char1: 'رَ', char2: 'فَـ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚩', meaning: 'أَعْلَى الرَّايَةَ', sentence: 'رَفَعَ الطَّالِبُ العَلَمَ' },
  { id: 13, full: 'صَنَعَ', char1: 'صَـ', char2: 'نَـ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🛠️', meaning: 'رَكَّبَ وَأَبْدَعَ', sentence: 'صَنَعَ النَّجَّارُ كُرْسِيّاً' },
  { id: 14, full: 'وَجَدَ', char1: 'وَ', char2: 'جَـ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🔍', meaning: 'عَثَرَ عَلَى الشَّيْءِ', sentence: 'وَجَدَ أَحْمَدُ قَلَمَهُ' },
  { id: 15, full: 'وَقَفَ', char1: 'وَ', char2: 'قَـ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧍', meaning: 'انْتَصَبَ قَائِماً', sentence: 'وَقَفَ الجَمِيعُ لِلْعَلَمِ' },
  { id: 16, full: 'عَرَفَ', char1: 'عَـ', char2: 'رَ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '💡', meaning: 'فَهِمَ وَأَدْرَكَ', sentence: 'عَرَفَ التِّلْمِيذُ الجَوَابَ' },
  { id: 17, full: 'غَسَلَ', char1: 'غَـ', char2: 'سَـ', char3: 'لَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧼', meaning: 'نَظَّفَ بِالمَاءِ', sentence: 'غَسَلَ الطِّفْلُ يَدَيْهِ' },
  { id: 18, full: 'جَمَعَ', char1: 'جَـ', char2: 'مَـ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧺', meaning: 'ضَمَّ الأَشْيَاءَ', sentence: 'جَمَعَ سَعْدٌ أَلْعَابَهُ' },
  { id: 19, full: 'طَرَقَ', char1: 'طَـ', char2: 'رَ', char3: 'قَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'دَقَّ البَابَ', sentence: 'طَرَقَ الضَّيْفُ البَابَ' },
  { id: 20, full: 'سَجَدَ', char1: 'سَـ', char2: 'جَـ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🕌', meaning: 'خَشَعَ فِي الصَّلاَةِ', sentence: 'سَجَدَ المُصَلِّي للهِ' },
  { id: 21, full: 'ذَهَبَ', char1: 'ذَ', char2: 'هَـ', char3: 'بَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚶', meaning: 'مَشَى إِلَى المَكَانِ', sentence: 'ذَهَبَ خَالِدٌ إِلَى المَدْرَسَةِ' },
  { id: 22, full: 'بَلَغَ', char1: 'بَـ', char2: 'لَـ', char3: 'غَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏁', meaning: 'وَصَلَ لِلْهَدَفِ', sentence: 'بَلَغَ العَدَّاءُ الخَطَّ' },
  { id: 23, full: 'تَرَكَ', char1: 'تَـ', char2: 'رَ', char3: 'كَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '📦', meaning: 'أَبْقَى الشَّيْءَ', sentence: 'تَرَكَ الأَثَرَ الجَمِيلَ' },
  { id: 24, full: 'صَدَقَ', char1: 'صَـ', char2: 'دَ', char3: 'قَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✨', meaning: 'قَالَ الحَقَّ', sentence: 'صَدَقَ الصَّادِقُ الأَمِينُ' },
  { id: 25, full: 'بَعَثَ', char1: 'بَـ', char2: 'عَـ', char3: 'ثَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✉️', meaning: 'أَرْسَلَ رِسَالَةً', sentence: 'بَعَثَ رِسَالَةَ شُكْرٍ' },
  { id: 26, full: 'خَرَجَ', char1: 'خَـ', char2: 'رَ', char3: 'جَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'بَرَزَ إِلَى الخَارِجِ', sentence: 'خَرَجَ الطُّلاَّبُ إِلَى السَّاحَةِ' },
  { id: 27, full: 'دَخَلَ', char1: 'دَ', char2: 'خَـ', char3: 'لَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏫', meaning: 'وَلَجَ إِلَى الدَّاخِلِ', sentence: 'دَخَلَ المُعَلِّمُ الفَصْلَ' },
  { id: 28, full: 'قَطَفَ', char1: 'قَـ', char2: 'طَـ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🍎', meaning: 'جَنَى الثَّمَرَةَ', sentence: 'قَطَفَ زَيْدٌ تُفَّاحَةً' },
  { id: 29, full: 'مَلَكَ', char1: 'مَـ', char2: 'لَـ', char3: 'كَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '👑', meaning: 'حَازَ وَأَصْبَحَ لَهُ', sentence: 'مَلَكَ القَلْبَ الطَّيِّبَ' },
  { id: 30, full: 'نَصَرَ', char1: 'نَـ', char2: 'صَـ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏆', meaning: 'أَيَّدَ وَفَازَ', sentence: 'نَصَرَ البَطَلُ أَخَاهُ' },

  // ==========================================
  // المجموعة 2: كلمات بحركة الكسر والضم (30 كلمة)
  // ==========================================
  { id: 31, full: 'لَعِبَ', char1: 'لَـ', char2: 'عِـ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '⚽', meaning: 'مَرِحَ وَفَرِحَ', sentence: 'لَعِبَ الطِّفْلُ بِالكُرَةِ' },
  { id: 32, full: 'شَرِبَ', char1: 'شَـ', char2: 'رِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🥛', meaning: 'تَنَاوَلَ المَاءَ', sentence: 'شَرِبَ هَانِي الحَلِيبَ' },
  { id: 33, full: 'حَمِدَ', char1: 'حَـ', char2: 'مِـ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🤲', meaning: 'شَكَرَ اللهَ', sentence: 'حَمِدَ المُسْلِمُ رَبَّهُ' },
  { id: 34, full: 'سَمِعَ', char1: 'سَـ', char2: 'مِـ', char3: 'عَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👂', meaning: 'أَصْغَى بِأُذُنَيْهِ', sentence: 'سَمِعَ فَارِسٌ النَّصِيحَةَ' },
  { id: 35, full: 'فَهِمَ', char1: 'فَـ', char2: 'هِـ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🧠', meaning: 'اسْتَوْعَبَ الدَّرْسَ', sentence: 'فَهِمَ النَّجِيبُ المَسْأَلَةَ' },
  { id: 36, full: 'رَكِبَ', char1: 'رَ', char2: 'كِـ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🚲', meaning: 'صَعِدَ عَلَى المَرْكَبَةِ', sentence: 'رَكِبَ يَاسِرٌ الدَّرَّاجَةَ' },
  { id: 37, full: 'ضَحِكَ', char1: 'ضَـ', char2: 'حِـ', char3: 'كَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😄', meaning: 'ابْتَسَمَ وَفَرِحَ', sentence: 'ضَحِكَ الصَّغِيرُ مَسْرُوراً' },
  { id: 38, full: 'رَبِحَ', char1: 'رَ', char2: 'بِـ', char3: 'حَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🥇', meaning: 'فَازَ وَكَسَبَ', sentence: 'رَبِحَ المُجْتَهِدُ الجَائِزَةَ' },
  { id: 39, full: 'سَعِدَ', char1: 'سَـ', char2: 'عِـ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🌟', meaning: 'شَعَرَ بِالسَّعَادَةِ', sentence: 'سَعِدَ الفَائِزُ بِالتَّكْرِيمِ' },
  { id: 40, full: 'حَفِظَ', char1: 'حَـ', char2: 'فِـ', char3: 'ظَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '📖', meaning: 'اسْتَذْكَرَ وَصَانَ', sentence: 'حَفِظَ عُمَرُ السُّورَةَ' },
  { id: 41, full: 'شَهِدَ', char1: 'شَـ', char2: 'هِـ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👁️', meaning: 'رَأَى وَأَثْبَتَ', sentence: 'شَهِدَ بِالحَقِّ' },
  { id: 42, full: 'عَلِمَ', char1: 'عَـ', char2: 'لِـ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🎓', meaning: 'عَرَفَ وَتَعَلَّمَ', sentence: 'عَلِمَ أَنَّ العِلْمَ نُورٌ' },
  { id: 43, full: 'رَحِمَ', char1: 'رَ', char2: 'حِـ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '💖', meaning: 'عَطَفَ وَرَفَقَ', sentence: 'رَحِمَ الكَبِيرُ الصَّغِيرَ' },
  { id: 44, full: 'نَدِمَ', char1: 'نَـ', char2: 'دِ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😔', meaning: 'أَسِفَ عَلَى الخَطَأِ', sentence: 'نَدِمَ عَلَى التَّأْخِيرِ' },
  { id: 45, full: 'تَبِعَ', char1: 'تَـ', char2: 'بِـ', char3: 'عَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👣', meaning: 'مَشَى خَلْفَهُ', sentence: 'تَبِعَ الخُطُوَاتِ الصَّحِيحَةَ' },
  { id: 46, full: 'كَرُمَ', char1: 'كَـ', char2: 'رُ', char3: 'مَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🎁', meaning: 'جَادَ وَأَعْطَى', sentence: 'كَرُمَ الرَّجُلُ مَعَ الضَّيْفِ' },
  { id: 47, full: 'عَظُمَ', char1: 'عَـ', char2: 'ظُـ', char3: 'مَ', category: 'damma', categoryName: 'حركة الضم', emoji: '👑', meaning: 'كَبُرَ شَأْنُهُ', sentence: 'عَظُمَ أَجْرُ المُحْسِنِ' },
  { id: 48, full: 'صَغُرَ', char1: 'صَـ', char2: 'غُـ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🐣', meaning: 'قَلَّ حَجْمُهُ', sentence: 'صَغُرَ العُصْفُورُ فِي العُشِّ' },
  { id: 49, full: 'كَبُرَ', char1: 'كَـ', char2: 'بُـ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌳', meaning: 'نَمَا وَارْتَفَعَ', sentence: 'كَبُرَتِ الشَّجَرَةُ' },
  { id: 50, full: 'كَثُرَ', char1: 'كَـ', char2: 'ثُـ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🍎', meaning: 'زَادَ عَدَدُهُ', sentence: 'كَثُرَ الثَّمَرُ فِي البُسْتَانِ' },
  { id: 51, full: 'حَسُنَ', char1: 'حَـ', char2: 'سُـ', char3: 'نَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌸', meaning: 'صَارَ جَمِيلاً', sentence: 'حَسُنَ خُلُقُ التِّلْمِيذِ' },
  { id: 52, full: 'ثَقُلَ', char1: 'ثَـ', char2: 'قُـ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '⚖️', meaning: 'زَادَ وَزْنُهُ', sentence: 'ثَقُلَ مِيزَانُ الحَسَنَاتِ' },
  { id: 53, full: 'عَمُقَ', char1: 'عَـ', char2: 'مُـ', char3: 'قَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌊', meaning: 'ازْدَادَ عُمْقُهُ', sentence: 'عَمُقَ البَحْرُ الكَبِيرُ' },
  { id: 54, full: 'قَرُبَ', char1: 'قَـ', char2: 'رُ', char3: 'بَ', category: 'damma', categoryName: 'حركة الضم', emoji: '📍', meaning: 'دَنَا مِنَ المَكَانِ', sentence: 'قَرُبَ مَوْعِدُ الفَرَحِ' },
  { id: 55, full: 'بَعُدَ', char1: 'بَـ', char2: 'عُـ', char3: 'دَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🔭', meaning: 'صَارَ بَعِيداً', sentence: 'بَعُدَ الطَّائِرُ فِي الأُفُقِ' },
  { id: 56, full: 'شَرُفَ', char1: 'شَـ', char2: 'رُ', char3: 'فَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🏅', meaning: 'نَالَ الشَّرَفَ', sentence: 'شَرُفَ بِلِقَاءِ الأَبْطَالِ' },
  { id: 57, full: 'نَبُلَ', char1: 'نَـ', char2: 'بُـ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🎖️', meaning: 'صَارَ نَبِيلاً كَرِيماً', sentence: 'نَبُلَ فِي سُلُوكِهِ' },
  { id: 58, full: 'سَهُلَ', char1: 'سَـ', char2: 'هُـ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🟢', meaning: 'تَيَسَّرَ وَأَصْبَحَ بَسِيطاً', sentence: 'سَهُلَ الدَّرْسُ بِالفَهْمِ' },
  { id: 59, full: 'طَهُرَ', char1: 'طَـ', char2: 'هُـ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '💧', meaning: 'صَارَ نَقِيّاً', sentence: 'طَهُرَ المَاءُ العَذْبُ' },
  { id: 60, full: 'نَظُفَ', char1: 'نَـ', char2: 'ظُـ', char3: 'فَ', category: 'damma', categoryName: 'حركة الضم', emoji: '✨', meaning: 'خَلا مِنَ الأَوْسَاخِ', sentence: 'نَظُفَ الفَصْلُ المَدْرَسِيُّ' },

  // ==========================================
  // المجموعة 3: كلمات رباعية بحركات ومقاطع ساكنة ومدود (40 كلمة رباعية تصل لـ 100)
  // ==========================================
  { id: 61, full: 'جَعْفَرٌ', char1: 'جَـ', char2: 'عْـ', char3: 'فَـ', char4: 'رٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🧑', meaning: 'اسم علم مذكر جميل', sentence: 'جَعْفَرٌ وَلَدٌ نَشِيطٌ' },
  { id: 62, full: 'مَسْجِدٌ', char1: 'مَـ', char2: 'سْـ', char3: 'جِـ', char4: 'دٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🕌', meaning: 'بَيْتُ الصَّلَاةِ وَالعِبَادَةِ', sentence: 'نُصَلِّي فِي المَسْجِدِ الجَمَاعَةَ' },
  { id: 63, full: 'دَفْتَرٌ', char1: 'دَ', char2: 'فْـ', char3: 'تَـ', char4: 'رٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '📓', meaning: 'كُرَّاسَةُ الكِتَابَةِ المَدْرَسِيَّةِ', sentence: 'أَكْتُبُ فِي دَفْتَرِي بِخَطٍّ جَمِيلٍ' },
  { id: 64, full: 'مَطْبَخٌ', char1: 'مَـ', char2: 'طْـ', char3: 'بَـ', char4: 'خٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🍳', meaning: 'مَكَانُ إِعْدَادِ الطَّعَامِ الشَّهِيِّ', sentence: 'المَطْبَخُ نَظِيفٌ وَمُرَتَّبٌ' },
  { id: 65, full: 'أَرْنَبٌ', char1: 'أَ', char2: 'رْ', char3: 'نَـ', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🐇', meaning: 'حَيَوَانٌ لَطِيفٌ يَقْفِزُ بِرَشَاقَةٍ', sentence: 'الأَرْنَبُ يَأْكُلُ الجَزَرَ الطَّازَجَ' },
  { id: 66, full: 'مَلْعَبٌ', char1: 'مَـ', char2: 'لْـ', char3: 'عَـ', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '⚽', meaning: 'مَيْدَانُ الرِّيَاضَةِ وَاللَّعِبِ', sentence: 'لَعِبْنَا فِي المَلْعَبِ بِسُرُورٍ' },
  { id: 67, full: 'مَكْتَبٌ', char1: 'مَـ', char2: 'كْـ', char3: 'تَـ', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🪑', meaning: 'طَاوِلَةُ الدِّرَاسَةِ وَالقِرَاءَةِ', sentence: 'جَلَسَ فَوَّازٌ عَلَى المَكْتَبِ' },
  { id: 68, full: 'مَصْنَعٌ', char1: 'مَـ', char2: 'صْـ', char3: 'نَـ', char4: 'عٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🏭', meaning: 'مَكَانُ الإِنْتَاجِ وَالصِّنَاعَةِ', sentence: 'المَصْنَعُ يُنْتِجُ خَيْرَاتِ الوَطَنِ' },
  { id: 69, full: 'مَغْرِبٌ', char1: 'مَـ', char2: 'غْـ', char3: 'رِ', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🌅', meaning: 'وَقْتُ غُرُوبِ الشَّمْسِ الجَمِيلِ', sentence: 'صَلَّيْنَا صَلَاةَ المَغْرِبِ' },
  { id: 70, full: 'مَشْرِقٌ', char1: 'مَـ', char2: 'شْـ', char3: 'رِ', char4: 'قٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🌄', meaning: 'جِهَةُ شُرُوقِ الشَّمْسِ الذَّهَبِيَّةِ', sentence: 'المَشْرِقُ سَاطِعٌ بِالنُّورِ' },
  { id: 71, full: 'مَنْزِلٌ', char1: 'مَـ', char2: 'نْـ', char3: 'زِ', char4: 'لٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🏡', meaning: 'دَارُنَا الجَمِيلَةُ وَمَسْكَنُنَا', sentence: 'مَنْزِلُنَا وَاسِعٌ وَمُرَتَّبٌ' },
  { id: 72, full: 'مَسْبَحٌ', char1: 'مَـ', char2: 'سْـ', char3: 'بَـ', char4: 'حٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🏊', meaning: 'حَوْضُ السِّبَاحَةِ وَالمَرَحِ', sentence: 'سَبَحَ يَاسِرٌ فِي المَسْبَحِ' },
  { id: 73, full: 'كَوْكَبٌ', char1: 'كَـ', char2: 'وْ', char3: 'كَـ', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🪐', meaning: 'جِرْمٌ سَمَاوِيٌّ يَسْبَحُ فِي الفَضَاءِ', sentence: 'الأَرْضُ كَوْكَبُنَا الحَبِيبُ' },
  { id: 74, full: 'فُنْدُقٌ', char1: 'فُـ', char2: 'نْـ', char3: 'دُ', char4: 'قٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🏨', meaning: 'مَكَانُ الإِقَامَةِ وَالضِّيَافَةِ', sentence: 'نَزَلْنَا فِي الفُنْدُقِ الكَبِيرِ' },
  { id: 75, full: 'زَنْبَقٌ', char1: 'زَ', char2: 'نْـ', char3: 'بَـ', char4: 'قٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🌸', meaning: 'زَهْرَةٌ بَيْضَاءُ عَطِرَةٌ فَوَّاحَةٌ', sentence: 'الزَّنْبَقُ يَمْلَأُ الحَدِيقَةَ عِطْراً' },
  { id: 76, full: 'خَنْدَقٌ', char1: 'خَـ', char2: 'نْـ', char3: 'دَ', char4: 'قٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🛡️', meaning: 'حُفْرَةٌ دِفَاعِيَّةٌ عَمِيقَةٌ', sentence: 'حَفَرَ الصَّحَابَةُ الخَنْدَقَ' },
  { id: 77, full: 'فُلْفُلٌ', char1: 'فُـ', char2: 'لْـ', char3: 'فُـ', char4: 'لٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🫑', meaning: 'نَبَاتٌ غِذَائِيٌّ صِحِّيٌّ لَذِيذٌ', sentence: 'الفُلْفُلُ الأَخْضَرُ غَنِيٌّ بِالفِيتَامِينِ' },
  { id: 78, full: 'قُنْفُذٌ', char1: 'قُـ', char2: 'نْـ', char3: 'فُـ', char4: 'ذٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🦔', meaning: 'حَيَوَانٌ صَغِيرٌ ذُو أَشْوَاكٍ', sentence: 'القُنْفُذُ يَتَجَوَّلُ فِي اللَّيْلِ' },
  { id: 79, full: 'بُلْبُلٌ', char1: 'بُـ', char2: 'لْـ', char3: 'بُـ', char4: 'لٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🐦', meaning: 'طَائِرٌ غِرِّيدٌ حُلْوُ الصَّوْتِ', sentence: 'غَرَّدَ البُلْبُلُ فَوْقَ الغُصْنِ' },
  { id: 80, full: 'ضِفْدَعٌ', char1: 'ضِـ', char2: 'فْـ', char3: 'دَ', char4: 'عٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🐸', meaning: 'بَرْمَائِيٌّ يَقْفِزُ فِي المَاءِ خَفِيفاً', sentence: 'الضِّفْدَعُ قَفَزَ فِي البِرْكَةِ' },
  { id: 81, full: 'زَلْزَلَ', char1: 'زَ', char2: 'لْ', char3: 'زَ', char4: 'لَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '⚡', meaning: 'هَزَّ وَحَرَّكَ بِقُوَّةٍ وَشِدَّةٍ', sentence: 'زَلْزَلَ الأَرْضَ زِلْزَالاً' },
  { id: 82, full: 'هَرْوَلَ', char1: 'هَـ', char2: 'رْ', char3: 'وَ', char4: 'لَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🏃', meaning: 'مَشَى مَشْياً سَرِيعاً بِنَشَاطٍ', sentence: 'هَرْوَلَ البَطَلُ نَحْوَ الفَوْزِ' },
  { id: 83, full: 'دَحْرَجَ', char1: 'دَ', char2: 'حْ', char3: 'رَ', char4: 'جَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '⚽', meaning: 'دَوَّرَ الكُرَةَ عَلَى الأَرْضِ', sentence: 'دَحْرَجَ سَعْدٌ الكُرَةَ لِأَخِيهِ' },
  { id: 84, full: 'وَسْوَسَ', char1: 'وَ', char2: 'سْ', char3: 'وَ', char4: 'سَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '💭', meaning: 'تَحَدَّثَ بِصَوْتٍ خَفِيٍّ', sentence: 'نَسْتَعِيذُ بِاللهِ مِنَ الوَسْوَاسِ' },
  { id: 85, full: 'طَمْأَنَ', char1: 'طَـ', char2: 'مْ', char3: 'أَ', char4: 'نَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '💖', meaning: 'أَدْخَلَ السَّكِينَةَ وَالرَّاحَةَ', sentence: 'طَمْأَنَ المُعَلِّمُ طُلَّابَهُ' },
  { id: 86, full: 'بَعْثَرَ', char1: 'بَـ', char2: 'عْ', char3: 'ثَـ', char4: 'رَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '📦', meaning: 'فَرَّقَ الأَشْيَاءَ', sentence: 'رَتَّبَ الطِّفْلُ مَا بَعْثَرَ' },
  { id: 87, full: 'زَخْرَفَ', char1: 'زَ', char2: 'خْ', char3: 'رَ', char4: 'فَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🎨', meaning: 'زَيَّنَ وَجَمَّلَ اللَّوْحَةَ بِنُقُوشٍ', sentence: 'زَخْرَفَ الرَّسَّامُ الجِدَارَ' },
  { id: 88, full: 'غَرْغَرَ', char1: 'غَـ', char2: 'رْ', char3: 'غَـ', char4: 'رَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '💧', meaning: 'رَدَّدَ المَاءَ فِي حَلْقِهِ لِلتَّنْظِيفِ', sentence: 'غَرْغَرَ بِالمَاءِ المِلْحِيِّ' },
  { id: 89, full: 'تَمْتَمَ', char1: 'تَـ', char2: 'مْ', char3: 'تَـ', char4: 'مَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🗣️', meaning: 'تَكَلَّمَ بِكَلَامٍ هَادِئٍ خَفِيٍّ', sentence: 'تَمْتَمَ المُصَلِّي بِالأَدْعِيَةِ' },
  { id: 90, full: 'قَهْقَهَ', char1: 'قَـ', char2: 'هْ', char3: 'قَـ', char4: 'هَ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '😄', meaning: 'ضَحِكَ ضَحِكاً عَالِياً مَرِحاً', sentence: 'قَهْقَهَ الأَطْفَالُ فِي الحَدِيقَةِ' },
  { id: 91, full: 'عُصْفُورٌ', char1: 'عُـ', char2: 'صْـ', char3: 'فُو', char4: 'رٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🐦', meaning: 'طَائِرٌ صَغِيرٌ جَمِيلُ الصَّوْتِ', sentence: 'العُصْفُورُ يُغَرِّدُ فَوْقَ الشَّجَرَةِ' },
  { id: 92, full: 'تِلْمِيذٌ', char1: 'تِـ', char2: 'لْـ', char3: 'مِيـ', char4: 'ذٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🎒', meaning: 'طَالِبُ العِلْمِ المُجِدُّ وَالمُؤَدَّبُ', sentence: 'التِّلْمِيذُ حَاضِرٌ فِي الفَصْلِ' },
  { id: 93, full: 'صَابُونٌ', char1: 'صَا', char2: 'بُـ', char3: 'و', char4: 'نٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🧼', meaning: 'مُنَظِّفٌ مُعَطَّرٌ لِلْيَدَيْنِ', sentence: 'غَسَلَ يَدَيْهِ بِالمَاءِ وَالصَّابُونِ' },
  { id: 94, full: 'مِحْفَظَةٌ', char1: 'مِـ', char2: 'حْـ', char3: 'فَـ', char4: 'ظَةٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '👝', meaning: 'حَقِيبَةٌ صَغِيرَةٌ لِلْأَدَوَاتِ', sentence: 'وَضَعَ القَلَمَ فِي المِحْفَظَةِ' },
  { id: 95, full: 'حَاسُوبٌ', char1: 'حَا', char2: 'سُـ', char3: 'و', char4: 'بٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '💻', meaning: 'جِهَازٌ ذَكِيٌّ لِلتَّعَلُّمِ وَالمَعْرِفَةِ', sentence: 'يَتَعَلَّمُ الطِّفْلُ عَلَى الحَاسُوبِ' },
  { id: 96, full: 'مِسْطَرَةٌ', char1: 'مِـ', char2: 'سْـ', char3: 'طَـ', char4: 'رَةٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '📏', meaning: 'أَدَاةُ تَسْطِيرِ الدَّفَاتِرِ بِدِقَّةٍ', sentence: 'سَطَّرَ الصَّفْحَةَ بِالمِسْطَرَةِ' },
  { id: 97, full: 'طَبَاشِيرُ', char1: 'طَـ', char2: 'بَـ', char3: 'اشِيـ', char4: 'رُ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🖍️', meaning: 'أَدَاةُ كِتَابَةٍ مَدْرَسِيَّةٍ مُلَوَّنَةٍ', sentence: 'كَتَبَ المُعَلِّمُ بِالطَّبَاشِيرِ' },
  { id: 98, full: 'مِمْحَاةٌ', char1: 'مِـ', char2: 'مْـ', char3: 'حَـ', char4: 'اةٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '✏️', meaning: 'أَدَاةُ مَسْحِ الأَخْطَاءِ فِي الدَّفْتَرِ', sentence: 'اسْتَخْدَمَ المِمْحَاةَ بِنِظَامٍ' },
  { id: 99, full: 'مِفْتَاحٌ', char1: 'مِـ', char2: 'فْـ', char3: 'تَا', char4: 'حٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '🔑', meaning: 'أَدَاةُ فَتْحِ الأَبْوَابِ وَالأَقْفَالِ', sentence: 'فَتَحَ البَابَ بِالمِفْتَاحِ' },
  { id: 100, full: 'فِنْجَانٌ', char1: 'فِـ', char2: 'نْـ', char3: 'جَا', char4: 'نٌ', category: 'rubai', categoryName: 'كلمات رباعية', emoji: '☕', meaning: 'إِنَاءٌ صَغِيرٌ لِشُرْبِ الشَّايِ أَوِ القَهْوَةِ', sentence: 'قَدَّمَ لِلضَّيْفِ فِنْجَانَ قَهْوَةٍ' }
];
