export interface SpellingWord {
  id: number;
  full: string;
  char1: string; // Red
  char2: string; // Blue
  char3: string; // Green
  char4?: string;
  category: 'fatha' | 'kasra' | 'damma' | 'mad';
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
  { id: 2, full: 'كَتَبَ', char1: 'كَ', char2: 'تَ', char3: 'بَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✍️', meaning: 'خَطَّ بِالقَلَمِ', sentence: 'كَتَبَ سَالِمٌ دَرْسَهُ' },
  { id: 3, full: 'قَرَأَ', char1: 'قَ', char2: 'رَ', char3: 'أَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '📖', meaning: 'تَلا الكَلِمَاتِ', sentence: 'قَرَأَ الطِّفْلُ قِصَّةً' },
  { id: 4, full: 'زَرَعَ', char1: 'زَ', char2: 'رَ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🌱', meaning: 'وَضَعَ البَذْرَةَ', sentence: 'زَرَعَ الفَلاَّحُ الشَّجَرَةَ' },
  { id: 5, full: 'حَصَدَ', char1: 'حَ', char2: 'صَ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🌾', meaning: 'جَمَعَ المَحْصُولَ', sentence: 'حَصَدَ الزَّارِعُ القَمْحَ' },
  { id: 6, full: 'رَسَمَ', char1: 'رَ', char2: 'سَ', char3: 'مَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🎨', meaning: 'خَطَّ لَوْحَةً', sentence: 'رَسَمَ فَهْدٌ وَرْدَةً' },
  { id: 7, full: 'فَتَحَ', char1: 'فَ', char2: 'تَ', char3: 'حَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'فَتَحَ البَابَ', sentence: 'فَتَحَ عَلِيٌّ البَابَ' },
  { id: 8, full: 'جَلَسَ', char1: 'جَ', char2: 'لَ', char3: 'سَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🪑', meaning: 'قَعَدَ بِأَدَبٍ', sentence: 'جَلَسَ عُمَرُ عَلَى الكُرْسِيِّ' },
  { id: 9, full: 'نَظَرَ', char1: 'نَ', char2: 'ظَ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '👀', meaning: 'رَأَى بِعَيْنَيْهِ', sentence: 'نَظَرَ البَطَلُ إِلَى السَّمَاءِ' },
  { id: 10, full: 'شَكَرَ', char1: 'شَ', char2: 'كَ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🤲', meaning: 'أَثْنَى وَشَكَرَ', sentence: 'شَكَرَ الوَلَدُ أُمَّهُ' },
  { id: 11, full: 'طَبَخَ', char1: 'طَ', char2: 'بَ', char3: 'خَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🍲', meaning: 'أَعَدَّ الطَّعَامَ', sentence: 'طَبَخَتْ أُمِّي طَعَاماً لَذِيذاً' },
  { id: 12, full: 'رَفَعَ', char1: 'رَ', char2: 'فَ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚩', meaning: 'أَعْلَى الرَّايَةَ', sentence: 'رَفَعَ الطَّالِبُ العَلَمَ' },
  { id: 13, full: 'صَنَعَ', char1: 'صَ', char2: 'نَ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🛠️', meaning: 'رَكَّبَ وَأَبْدَعَ', sentence: 'صَنَعَ النَّجَّارُ كُرْسِيّاً' },
  { id: 14, full: 'وَجَدَ', char1: 'وَ', char2: 'جَ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🔍', meaning: 'عَثَرَ عَلَى الشَّيْءِ', sentence: 'وَجَدَ أَحْمَدُ قَلَمَهُ' },
  { id: 15, full: 'وَقَفَ', char1: 'وَ', char2: 'قَ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧍', meaning: 'انْتَصَبَ قَائِماً', sentence: 'وَقَفَ الجَمِيعُ لِلْعَلَمِ' },
  { id: 16, full: 'عَرَفَ', char1: 'عَ', char2: 'رَ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '💡', meaning: 'فَهِمَ وَأَدْرَكَ', sentence: 'عَرَفَ التِّلْمِيذُ الجَوَابَ' },
  { id: 17, full: 'غَسَلَ', char1: 'غَ', char2: 'سَ', char3: 'لَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧼', meaning: 'نَظَّفَ بِالمَاءِ', sentence: 'غَسَلَ الطِّفْلُ يَدَيْهِ' },
  { id: 18, full: 'جَمَعَ', char1: 'جَ', char2: 'مَ', char3: 'عَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🧺', meaning: 'ضَمَّ الأَشْيَاءَ', sentence: 'جَمَعَ سَعْدٌ أَلْعَابَهُ' },
  { id: 19, full: 'طَرَقَ', char1: 'طَ', char2: 'رَ', char3: 'قَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'دَقَّ البَابَ', sentence: 'طَرَقَ الضَّيْفُ البَابَ' },
  { id: 20, full: 'سَجَدَ', char1: 'سَ', char2: 'جَ', char3: 'دَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🕌', meaning: 'خَشَعَ فِي الصَّلاَةِ', sentence: 'سَجَدَ المُصَلِّي للهِ' },
  { id: 21, full: 'ذَهَبَ', char1: 'ذَ', char2: 'هَ', char3: 'بَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚶', meaning: 'مَشَى إِلَى المَكَانِ', sentence: 'ذَهَبَ خَالِدٌ إِلَى المَدْرَسَةِ' },
  { id: 22, full: 'بَلَغَ', char1: 'بَ', char2: 'لَ', char3: 'غَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏁', meaning: 'وَصَلَ لِلْهَدَفِ', sentence: 'بَلَغَ العَدَّاءُ الخَطَّ' },
  { id: 23, full: 'تَرَكَ', char1: 'تَ', char2: 'رَ', char3: 'كَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '📦', meaning: 'أَبْقَى الشَّيْءَ', sentence: 'تَرَكَ الأَثَرَ الجَمِيلَ' },
  { id: 24, full: 'صَدَقَ', char1: 'صَ', char2: 'دَ', char3: 'قَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✨', meaning: 'قَالَ الحَقَّ', sentence: 'صَدَقَ الصَّادِقُ الأَمِينُ' },
  { id: 25, full: 'بَعَثَ', char1: 'بَ', char2: 'عَ', char3: 'ثَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '✉️', meaning: 'أَرْسَلَ رِسَالَةً', sentence: 'بَعَثَ رِسَالَةَ شُكْرٍ' },
  { id: 26, full: 'خَرَجَ', char1: 'خَ', char2: 'رَ', char3: 'جَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🚪', meaning: 'بَرَزَ إِلَى الخَارِجِ', sentence: 'خَرَجَ الطُّلاَّبُ إِلَى السَّاحَةِ' },
  { id: 27, full: 'دَخَلَ', char1: 'دَ', char2: 'خَ', char3: 'لَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏫', meaning: 'وَلَجَ إِلَى الدَّاخِلِ', sentence: 'دَخَلَ المُعَلِّمُ الفَصْلَ' },
  { id: 28, full: 'قَطَفَ', char1: 'قَ', char2: 'طَ', char3: 'فَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🍎', meaning: 'جَنَى الثَّمَرَةَ', sentence: 'قَطَفَ زَيْدٌ تُفَّاحَةً' },
  { id: 29, full: 'مَلَكَ', char1: 'مَ', char2: 'لَ', char3: 'كَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '👑', meaning: 'حَازَ وَأَصْبَحَ لَهُ', sentence: 'مَلَكَ القَلْبَ الطَّيِّبَ' },
  { id: 30, full: 'نَصَرَ', char1: 'نَ', char2: 'صَ', char3: 'رَ', category: 'fatha', categoryName: 'ثلاثي بالفتح', emoji: '🏆', meaning: 'أَيَّدَ وَفَازَ', sentence: 'نَصَرَ البَطَلُ أَخَاهُ' },

  // ==========================================
  // المجموعة 2: كلمات بحركة الكسر (25 كلمة)
  // ==========================================
  { id: 31, full: 'لَعِبَ', char1: 'لَ', char2: 'عِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '⚽', meaning: 'مَرِحَ وَفَرِحَ', sentence: 'لَعِبَ الطِّفْلُ بِالكُرَةِ' },
  { id: 32, full: 'شَرِبَ', char1: 'شَ', char2: 'رِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🥛', meaning: 'تَنَاوَلَ المَاءَ', sentence: 'شَرِبَ هَانِي الحَلِيبَ' },
  { id: 33, full: 'حَمِدَ', char1: 'حَ', char2: 'مِ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🤲', meaning: 'شَكَرَ اللهَ', sentence: 'حَمِدَ المُسْلِمُ رَبَّهُ' },
  { id: 34, full: 'سَمِعَ', char1: 'سَ', char2: 'مِ', char3: 'عَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👂', meaning: 'أَصْغَى بِأُذُنَيْهِ', sentence: 'سَمِعَ فَارِسٌ النَّصِيحَةَ' },
  { id: 35, full: 'فَهِمَ', char1: 'فَ', char2: 'هـِ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🧠', meaning: 'اسْتَوْعَبَ الدَّرْسَ', sentence: 'فَهِمَ النَّجِيبُ المَسْأَلَةَ' },
  { id: 36, full: 'رَكِبَ', char1: 'رَ', char2: 'كِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🚲', meaning: 'صَعِدَ عَلَى المَرْكَبَةِ', sentence: 'رَكِبَ يَاسِرٌ الدَّرَّاجَةَ' },
  { id: 37, full: 'ضَحِكَ', char1: 'ضَ', char2: 'حِ', char3: 'كَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😄', meaning: 'ابْتَسَمَ وَفَرِحَ', sentence: 'ضَحِكَ الصَّغِيرُ مَسْرُوراً' },
  { id: 38, full: 'خَسِرَ', char1: 'خَ', char2: 'سِ', char3: 'رَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '📉', meaning: 'لَمْ يَفُزْ', sentence: 'خَسِرَ المُتَكَاسِلُ' },
  { id: 39, full: 'رَبِحَ', char1: 'رَ', char2: 'بِ', char3: 'حَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🥇', meaning: 'فَازَ وَكَسَبَ', sentence: 'رَبِحَ المُجْتَهِدُ الجَائِزَةَ' },
  { id: 40, full: 'غَضِبَ', char1: 'غَ', char2: 'ضِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😠', meaning: 'انْفَعَلَ', sentence: 'كَظَمَ المُسْلِمُ غَيْظَهُ وَلَمْ يَغْضَبْ' },
  { id: 41, full: 'سَعِدَ', char1: 'سَ', char2: 'عِ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🌟', meaning: 'شَعَرَ بِالسَّعَادَةِ', sentence: 'سَعِدَ الفَائِزُ بِالتَّكْرِيمِ' },
  { id: 42, full: 'حَفِظَ', char1: 'حَ', char2: 'فِ', char3: 'ظَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '📖', meaning: 'اسْتَذْكَرَ وَصَانَ', sentence: 'حَفِظَ عُمَرُ السُّورَةَ' },
  { id: 43, full: 'شَهِدَ', char1: 'شَ', char2: 'هـِ', char3: 'دَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👁️', meaning: 'رَأَى وَأَثْبَتَ', sentence: 'شَهِدَ بِالحَقِّ' },
  { id: 44, full: 'نَسِيَ', char1: 'نَ', char2: 'سِ', char3: 'يَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '💭', meaning: 'غَفَلَ عَنِ الشَّيْءِ', sentence: 'نَسِيَ حَقِيبَتَهُ ثُمَّ تَذَكَّرَ' },
  { id: 45, full: 'عَلِمَ', char1: 'عَ', char2: 'لِ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🎓', meaning: 'عَرَفَ وَتَعَلَّمَ', sentence: 'عَلِمَ أَنَّ العِلْمَ نُورٌ' },
  { id: 46, full: 'كَرِهَ', char1: 'كَ', char2: 'رِ', char3: 'هـَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🚫', meaning: 'لَمْ يُحِبَّ الكَذِبَ', sentence: 'كَرِهَ الطِّفْلُ الخِصَامَ' },
  { id: 47, full: 'وَثِقَ', char1: 'وَ', char2: 'ثِ', char3: 'قَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🤝', meaning: 'اطْمَأَنَّ وَآمَنَ', sentence: 'وَثِقَ بِقُدُرَاتِهِ' },
  { id: 48, full: 'رَحِمَ', char1: 'رَ', char2: 'حِ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '💖', meaning: 'عَطَفَ وَرَفَقَ', sentence: 'رَحِمَ الكَبِيرُ الصَّغِيرَ' },
  { id: 49, full: 'نَدِمَ', char1: 'نَ', char2: 'دِ', char3: 'مَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😔', meaning: 'أَسِفَ عَلَى الخَطَأِ', sentence: 'نَدِمَ عَلَى التَّأْخِيرِ' },
  { id: 50, full: 'تَبِعَ', char1: 'تَ', char2: 'بِ', char3: 'عَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '👣', meaning: 'مَشَى خَلْفَهُ', sentence: 'تَبِعَ الخُطُوَاتِ الصَّحِيحَةَ' },
  { id: 51, full: 'حَسِبَ', char1: 'حَ', char2: 'سِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🔢', meaning: 'ظَنَّ وَعَدَّ', sentence: 'حَسِبَ النُّقُودَ' },
  { id: 52, full: 'صَحِبَ', char1: 'صَ', char2: 'حِ', char3: 'بَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🧑‍🤝‍🧑', meaning: 'رَافَقَ صَدِيقَهُ', sentence: 'صَحِبَ الأَخْيَارَ' },
  { id: 53, full: 'بَقِيَ', char1: 'بَ', char2: 'قِ', char3: 'يَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '⏳', meaning: 'مَكَثَ وَظَلَّ', sentence: 'بَقِيَ فِي الفَصْلِ مُنْتَبِهاً' },
  { id: 54, full: 'رَضِيَ', char1: 'رَ', char2: 'ضِ', char3: 'يَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '😊', meaning: 'قَبِلَ بِسُرُورٍ', sentence: 'رَضِيَ بِقِسْمَتِهِ' },
  { id: 55, full: 'مَرِضَ', char1: 'مَ', char2: 'رِ', char3: 'ضَ', category: 'kasra', categoryName: 'حركة الكسر', emoji: '🩺', meaning: 'أَصَابَهُ التَّعَبُ', sentence: 'عَادَ صَدِيقَهُ لَمَّا مَرِضَ' },

  // ==========================================
  // المجموعة 3: كلمات بحركة الضم (20 كلمة)
  // ==========================================
  { id: 56, full: 'كَرُمَ', char1: 'كَ', char2: 'رُ', char3: 'مَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🎁', meaning: 'جَادَ وَأَعْطَى', sentence: 'كَرُمَ الرَّجُلُ مَعَ الضَّيْفِ' },
  { id: 57, full: 'عَظُمَ', char1: 'عَ', char2: 'ظُ', char3: 'مَ', category: 'damma', categoryName: 'حركة الضم', emoji: '👑', meaning: 'كَبُرَ شَأْنُهُ', sentence: 'عَظُمَ أَجْرُ المُحْسِنِ' },
  { id: 58, full: 'صَغُرَ', char1: 'صَ', char2: 'غُ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🐣', meaning: 'قَلَّ حَجْمُهُ', sentence: 'صَغُرَ العُصْفُورُ فِي العُشِّ' },
  { id: 59, full: 'كَبُرَ', char1: 'كَ', char2: 'بُ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌳', meaning: 'نَمَا وَارْتَفَعَ', sentence: 'كَبُرَتِ الشَّجَرَةُ' },
  { id: 60, full: 'كَثُرَ', char1: 'كَ', char2: 'ثُ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🍎', meaning: 'زَادَ عَدَدُهُ', sentence: 'كَثُرَ الثَّمَرُ فِي البُسْتَانِ' },
  { id: 61, full: 'حَسُنَ', char1: 'حَ', char2: 'سُ', char3: 'نَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌸', meaning: 'صَارَ جَمِيلاً', sentence: 'حَسُنَ خُلُقُ التِّلْمِيذِ' },
  { id: 62, full: 'ثَقُلَ', char1: 'ثَ', char2: 'قُ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '⚖️', meaning: 'زَادَ وَزْنُهُ', sentence: 'ثَقُلَ مِيزَانُ الحَسَنَاتِ' },
  { id: 63, full: 'عَمُقَ', char1: 'عَ', char2: 'مُ', char3: 'قَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌊', meaning: 'ازْدَادَ عُمْقُهُ', sentence: 'عَمُقَ البَحْرُ الكَبِيرُ' },
  { id: 64, full: 'قَرُبَ', char1: 'قَ', char2: 'رُ', char3: 'بَ', category: 'damma', categoryName: 'حركة الضم', emoji: '📍', meaning: 'دَنَا مِنَ المَكَانِ', sentence: 'قَرُبَ مَوْعِدُ الفَرَحِ' },
  { id: 65, full: 'بَعُدَ', char1: 'بَ', char2: 'عُ', char3: 'دَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🔭', meaning: 'صَارَ بَعِيداً', sentence: 'بَعُدَ الطَّائِرُ فِي الأُفُقِ' },
  { id: 66, full: 'شَرُفَ', char1: 'شَ', char2: 'رُ', char3: 'فَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🏅', meaning: 'نَالَ الشَّرَفَ', sentence: 'شَرُفَ بِلِقَاءِ الأَبْطَالِ' },
  { id: 67, full: 'نَبُلَ', char1: 'نَ', char2: 'بُ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🎖️', meaning: 'صَارَ نَبِيلاً كَرِيماً', sentence: 'نَبُلَ فِي سُلُوكِهِ' },
  { id: 68, full: 'سَهُلَ', char1: 'سَ', char2: 'هُ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🟢', meaning: 'تَيَسَّرَ وَأَصْبَحَ بَسِيطاً', sentence: 'سَهُلَ الدَّرْسُ بِالفَهْمِ' },
  { id: 69, full: 'صَعُبَ', char1: 'صَ', char2: 'عُ', char3: 'بَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🧗', meaning: 'احْتَاجَ اجْتِهَاداً', sentence: 'اجْتَهَدَ فَسَهُلَ مَا صَعُبَ' },
  { id: 70, full: 'طَهُرَ', char1: 'طَ', char2: 'هُ', char3: 'رَ', category: 'damma', categoryName: 'حركة الضم', emoji: '💧', meaning: 'صَارَ نَقِيّاً', sentence: 'طَهُرَ المَاءُ العَذْبُ' },
  { id: 71, full: 'نَظُفَ', char1: 'نَ', char2: 'ظُ', char3: 'فَ', category: 'damma', categoryName: 'حركة الضم', emoji: '✨', meaning: 'خَلا مِنَ الأَوْسَاخِ', sentence: 'نَظُفَ الفَصْلُ المَدْرَسِيُّ' },
  { id: 72, full: 'فَصُحَ', char1: 'فَ', char2: 'صُ', char3: 'حَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🗣️', meaning: 'أَفْصَحَ وَأَبَانَ الكَلاَمَ', sentence: 'فَصُحَ لِسَانُ الخَطِيبِ' },
  { id: 73, full: 'جَمُلَ', char1: 'جَ', char2: 'مُ', char3: 'لَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🌺', meaning: 'حَسُنَ مَنْظَرُهُ', sentence: 'جَمُلَ مَنْظَرُ الحَدِيقَةِ' },
  { id: 74, full: 'حَلُمَ', char1: 'حَ', char2: 'لُ', char3: 'مَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🕊️', meaning: 'صَبَرَ وَتَأَنَّى', sentence: 'حَلُمَ الحَكِيمُ فِي غَضَبِهِ' },
  { id: 75, full: 'ضَعُفَ', char1: 'ضَ', char2: 'عُ', char3: 'فَ', category: 'damma', categoryName: 'حركة الضم', emoji: '🍃', meaning: 'قَلَّتْ قُوَّتُهُ', sentence: 'ضَعُفَ هُبُوبُ الرِّيَاحِ' },

  // ==========================================
  // المجموعة 4: كلمات المدود والكلمات البسيطة (25 كلمة)
  // ==========================================
  { id: 76, full: 'بَابٌ', char1: 'بَا', char2: 'بٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🚪', meaning: 'مَدْخَلُ البَيْتِ (مد بالألف)', sentence: 'بَابُ الفَصْلِ مَفْتُوحٌ' },
  { id: 77, full: 'تَاجٌ', char1: 'تَا', char2: 'جٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '👑', meaning: 'إِكْلِيلُ المَلِكِ (مد بالألف)', sentence: 'تَاجٌ ذَهَبِيٌّ لَمَّاعٌ' },
  { id: 78, full: 'نَارٌ', char1: 'نَا', char2: 'رٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🔥', meaning: 'لَهَبٌ مُشْتَعِلٌ', sentence: 'نَارٌ تُعْطِي الدِّفْءَ' },
  { id: 79, full: 'دَارٌ', char1: 'دَا', char2: 'رٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🏡', meaning: 'بَيْتٌ جَمِيلٌ', sentence: 'دَارُنَا وَاسِعَةٌ' },
  { id: 80, full: 'مَالٌ', char1: 'مَا', char2: 'لٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '💰', meaning: 'نُقُودٌ وَخَيْرٌ', sentence: 'أَنْفَقَ المَالَ فِي الخَيْرِ' },
  { id: 81, full: 'صَامَ', char1: 'صَا', char2: 'مَ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🌙', meaning: 'أَمْسَكَ عَنِ الطَّعَامِ للهِ', sentence: 'صَامَ شَهْرَ رَمَضَانَ' },
  { id: 82, full: 'نَامَ', char1: 'نَا', char2: 'مَ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🛏️', meaning: 'أَخَذَ قِسْطاً مِنَ الرَّاحَةِ', sentence: 'نَامَ الطِّفْلُ مُبَكِّراً' },
  { id: 83, full: 'قَامَ', char1: 'قَا', char2: 'مَ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🧍', meaning: 'وَقَفَ بِنَشَاطٍ', sentence: 'قَامَ لِيُؤَدِّيَ الصَّلاَةَ' },
  { id: 84, full: 'فَازَ', char1: 'فَا', char2: 'زَ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🏆', meaning: 'انْتَصَرَ وَحَقَّقَ الفَوْزَ', sentence: 'فَازَ المُجِدُّ بِالمَرْكَزِ الأَوَّلِ' },
  { id: 85, full: 'عَادَ', char1: 'عَا', char2: 'دَ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🏠', meaning: 'رَجَعَ إِلَى بَيْتِهِ', sentence: 'عَادَ أَبِي مِنَ العَمَلِ' },
  { id: 86, full: 'نُورٌ', char1: 'نُو', char2: 'رٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '💡', meaning: 'ضَوْءٌ سَاطِعٌ (مد بالواو)', sentence: 'العِلْمُ نُورٌ يُضِيءُ الدَّرْبَ' },
  { id: 87, full: 'سُورٌ', char1: 'سُو', char2: 'رٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🧱', meaning: 'جِدَارٌ يُحِيطُ بِالمَكَانِ', sentence: 'سُورُ الحَدِيقَةِ عَالٍ' },
  { id: 88, full: 'صُوفٌ', char1: 'صُو', char2: 'فٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🧶', meaning: 'غِطَاءُ الخَرُوفِ النَّاعِمُ', sentence: 'صُوفٌ نَاعِمٌ دَافِئٌ' },
  { id: 89, full: 'فُولٌ', char1: 'فُو', char2: 'لٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🫘', meaning: 'طَعَامٌ لَذِيذٌ مُفِيدٌ', sentence: 'أَكَلَ فُولاً فِي الإِفْطَارِ' },
  { id: 90, full: 'عُودٌ', char1: 'عُو', char2: 'دٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🪵', meaning: 'غُصْنٌ صَغِيرٌ أَوْ بَخُورٌ', sentence: 'عُودُ البَخُورِ عِبْقُهُ طَيِّبٌ' },
  { id: 91, full: 'تِينٌ', char1: 'تِي', char2: 'نٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🫐', meaning: 'فَاكِهَةٌ طَيِّبَةٌ (مد بالياء)', sentence: 'التِّينُ فَاكِهَةٌ حُلْوَةٌ' },
  { id: 92, full: 'فِيلٌ', char1: 'فِي', char2: 'لٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🐘', meaning: 'حَيَوَانٌ ضَخْمٌ لَطِيفٌ', sentence: 'الفِيلُ خُرْطُومُهُ طَوِيلٌ' },
  { id: 93, full: 'رِيمٌ', char1: 'رِي', char2: 'مٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🦌', meaning: 'غَزَالٌ أَبْيَضُ جَمِيلٌ', sentence: 'رِيمٌ ظَبْيٌ رَشِيقٌ' },
  { id: 94, full: 'عِيدٌ', char1: 'عِي', char2: 'دٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🎉', meaning: 'يَوْمُ فَرَحٍ وَسُرُورٍ', sentence: 'عِيدُ الفِطْرِ مُبَارَكٌ' },
  { id: 95, full: 'دِيكٌ', char1: 'دِي', char2: 'كٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🐓', meaning: 'طَائِرٌ يُؤَذِّنُ فِي الصَّبَاحِ', sentence: 'صَاحَ الدِّيكُ مَعَ الفَجْرِ' },
  { id: 96, full: 'طِينٌ', char1: 'طِي', char2: 'نٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🏺', meaning: 'تُرَابٌ مَعَ مَاءٍ', sentence: 'صَنَعَ جَرَّةً مِنَ الطِّينِ' },
  { id: 97, full: 'زَيْتٌ', char1: 'زَيْ', char2: 'تٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🫒', meaning: 'زَيْتُ الزَّيْتُونِ الصِّحِّيُّ', sentence: 'زَيْتُ الزَّيْتُونِ مُبَارَكٌ' },
  { id: 98, full: 'بَيْتٌ', char1: 'بَيْ', char2: 'تٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🏠', meaning: 'مَسْكَنُ الأُسْرَةِ الدَّافِئُ', sentence: 'بَيْتُنَا جَمِيلٌ وَنَظِيفٌ' },
  { id: 99, full: 'سَيْفٌ', char1: 'سَيْ', char2: 'فٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🗡️', meaning: 'رَمْزُ الشَّجَاعَةِ وَالعِزَّةِ', sentence: 'السَّيْفُ فِي عَلَمِ بِلادِي' },
  { id: 100, full: 'خَيْرٌ', char1: 'خَيْ', char2: 'رٌ', char3: '', category: 'mad', categoryName: 'المدود والكلمات البسيطة', emoji: '🎁', meaning: 'كُلُّ عَمَلٍ صَالِحٍ وَنَفْعٍ', sentence: 'صَبَاحُ الخَيْرِ وَالسُّرُورِ' }
];
