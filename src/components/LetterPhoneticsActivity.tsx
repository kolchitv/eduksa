import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';

export interface LetterPhoneticData {
  letter: string;
  name: string;
  shortVowels: {
    fatha: { text: string; name: string; example: string; exampleMeaning: string; mouthGuide: string };
    damma: { text: string; name: string; example: string; exampleMeaning: string; mouthGuide: string };
    kasra: { text: string; name: string; example: string; exampleMeaning: string; mouthGuide: string };
    sukoon: { text: string; name: string; example: string; exampleMeaning: string; mouthGuide: string };
  };
  longVowels: {
    madAlif: { text: string; name: string; pairedShort: string; example: string; desc: string };
    madWaw: { text: string; name: string; pairedShort: string; example: string; desc: string };
    madYaa: { text: string; name: string; pairedShort: string; example: string; desc: string };
  };
  extractionWords: Array<{
    word: string;
    extractedLetter: string;
    vowelType: string;
    position: string;
    meaning: string;
  }>;
  letterForms: {
    initial: { shape: string; name: string; example: string };
    medial: { shape: string; name: string; example: string };
    finalConnected: { shape: string; name: string; example: string };
    finalIsolated: { shape: string; name: string; example: string };
  };
}

export const UNIT1_LETTERS_DATA: Record<string, LetterPhoneticData> = {
  'م': {
    letter: 'م',
    name: 'المِيم',
    shortVowels: {
      fatha: { text: 'مَـ', name: 'مِيم مَفْتُوحَة', example: 'مَـسْجِدٌ', exampleMeaning: 'بيت الله المبارك', mouthGuide: 'فَتْحُ الفَمِ بِحَرَكَةٍ قَصِيرَةٍ' },
      damma: { text: 'مُـ', name: 'مِيم مَضْمُومَة', example: 'مُـعَلِّمٌ', exampleMeaning: 'مربي الأجيال الفاضل', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ كَحَبَّةِ العِنَبِ' },
      kasra: { text: 'مِـ', name: 'مِيم مَكْسُورَة', example: 'مِـقَصٌّ', exampleMeaning: 'أداة مدرسية للقص', mouthGuide: 'خَفْضُ الفَكِّ السُّفْلِيِّ بِلُطْفٍ' },
      sukoon: { text: 'مْ', name: 'مِيم سَاكِنَة', example: 'شَـمْـسٌ', exampleMeaning: 'نور النهار ودفئه', mouthGuide: 'وُقُوفٌ صَوْتِيٌّ خَفِيفٌ مَعَ الحَرْفِ السَّابِقِ' },
    },
    longVowels: {
      madAlif: { text: 'مَا', name: 'مَدٌّ بِالأَلِفِ', pairedShort: 'مَـ', example: 'سَمَاءٌ • مَائِدَةٌ', desc: 'إِطَالَةُ صَوْتِ الفَتْحَةِ بِمِقْدَارِ حَرَكَتَيْنِ (مَـ + ا = مَا)' },
      madWaw: { text: 'مُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'مُـ', example: 'لَيْمُونٌ • دُمُوعٌ', desc: 'إِطَالَةُ صَوْتِ الضَّمَّةِ بِمِقْدَارِ حَرَكَتَيْنِ (مُـ + و = مُو)' },
      madYaa: { text: 'مِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'مِـ', example: 'أُمِّي • سَمِيعٌ', desc: 'إِطَالَةُ صَوْتِ الكَسْرَةِ بِمِقْدَارِ حَرَكَتَيْنِ (مِـ + ي = مِي)' },
    },
    extractionWords: [
      { word: 'مِشْعَلٌ', extractedLetter: 'مِـ', vowelType: 'كَسْرَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'اسم جد فواز' },
      { word: 'فَاطِمَةُ', extractedLetter: 'ـمَـ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'اسم جدة فواز' },
      { word: 'مُهَنَّدٌ', extractedLetter: 'مُـ', vowelType: 'ضَمَّةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'اسم صديق فواز' },
      { word: 'أُمِّي', extractedLetter: 'ـمِّـ', vowelType: 'مِيمٌ مُشَدَّدَةٌ مَكْسُورَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'الأم الكريمة مريم' },
      { word: 'مَرْيَمُ', extractedLetter: 'مَـ / ـمُ', vowelType: 'فَتْحَةٌ وَضَمَّةٌ', position: 'أَوَّلُ وَآخِرُ الكَلِمَةِ', meaning: 'والدة فواز ونورة' },
    ],
    letterForms: {
      initial: { shape: 'مـ', name: 'أَوَّلُ الكَلِمَةِ (مُتَّصِلٌ بِمَا بَعْدَهُ)', example: 'مَسْجِدٌ' },
      medial: { shape: 'ـمـ', name: 'وَسَطُ الكَلِمَةِ (مُتَّصِلٌ مِنْ الطَّرَفَيْنِ)', example: 'نَمْلَةٌ' },
      finalConnected: { shape: 'ـم', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'قَلَمٌ' },
      finalIsolated: { shape: 'م', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'هَرَمٌ' },
    }
  },
  'ب': {
    letter: 'ب',
    name: 'البَاء',
    shortVowels: {
      fatha: { text: 'بَـ', name: 'بَاء مَفْتُوحَة', example: 'بَـيْتٌ', exampleMeaning: 'دار الأسرة السعيدة', mouthGuide: 'فَتْحُ الفَمِ مَعَ صَوْتِ البَاءِ' },
      damma: { text: 'بُـ', name: 'بَاء مَضْمُومَة', example: 'بُـرْجٌ', exampleMeaning: 'بناء شاهق في الرياض', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ مَعَ نُطْقِ البَاءِ' },
      kasra: { text: 'بِـ', name: 'بَاء مَكْسُورَة', example: 'بِـلَادِي', exampleMeaning: 'وطني المملكة العربية السعودية', mouthGuide: 'خَفْضُ الفَكِّ مَعَ صَوْتِ البَاءِ' },
      sukoon: { text: 'بْ', name: 'بَاء سَاكِنَة', example: 'حَـبْـلٌ', exampleMeaning: 'حبل متين', mouthGuide: 'قَلْقَلَةٌ أَوْ سُكُونٌ لَطِيفٌ' },
    },
    longVowels: {
      madAlif: { text: 'بَا', name: 'مَدٌّ بِالأَلِفِ', pairedShort: 'بَـ', example: 'بَابٌ • بَاسِمٌ', desc: 'إِطَالَةُ صَوْتِ الفَتْحَةِ بِمِقْدَارِ حَرَكَتَيْنِ (بَـ + ا = بَا)' },
      madWaw: { text: 'بُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'بُـ', example: 'حَاسُوبٌ • بُوقٌ', desc: 'إِطَالَةُ صَوْتِ الضَّمَّةِ بِمِقْدَارِ حَرَكَتَيْنِ (بُـ + و = بُو)' },
      madYaa: { text: 'بِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'بِـ', example: 'أَبِي • طَبِيبٌ', desc: 'إِطَالَةُ صَوْتِ الكَسْرَةِ بِمِقْدَارِ حَرَكَتَيْنِ (بِـ + ي = بِي)' },
    },
    extractionWords: [
      { word: 'بَيْتٌ', extractedLetter: 'بَـ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'منزل الأسرة' },
      { word: 'مَكْتَبَةٌ', extractedLetter: 'ـبَـ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'مكتبة البيت' },
      { word: 'كُتُبٌ', extractedLetter: 'ـبٌ', vowelType: 'تَنْوِينُ ضَمٍّ', position: 'آخِرُ الكَلِمَةِ', meaning: 'جمع كتاب' },
      { word: 'حَاسُوبٌ', extractedLetter: 'بٌ', vowelType: 'تَنْوِينُ ضَمٍّ', position: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', meaning: 'جهاز التعلم' },
    ],
    letterForms: {
      initial: { shape: 'بـ', name: 'أَوَّلُ الكَلِمَةِ', example: 'بَيْتٌ' },
      medial: { shape: 'ـبـ', name: 'وَسَطُ الكَلِمَةِ', example: 'خُبْزٌ' },
      finalConnected: { shape: 'ـب', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'كُتُبٌ' },
      finalIsolated: { shape: 'ب', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'حَاسُوبٌ' },
    }
  },
  'ل': {
    letter: 'ل',
    name: 'اللاَّم',
    shortVowels: {
      fatha: { text: 'لَـ', name: 'لاَم مَفْتُوحَة', example: 'لَـمْسَةٌ', exampleMeaning: 'لمس رقيق', mouthGuide: 'فَتْحُ الفَمِ مَعَ طَرَفِ اللِّسَانِ' },
      damma: { text: 'لُـ', name: 'لاَم مَضْمُومَة', example: 'لُـعْبَةٌ', exampleMeaning: 'ألعاب الأطفال الترفيهية', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ' },
      kasra: { text: 'لِـ', name: 'لاَم مَكْسُورَة', example: 'لِـمَاذَا', exampleMeaning: 'أداة استفهام للسؤال عن السبب', mouthGuide: 'خَفْضُ الفَكِّ' },
      sukoon: { text: 'لْ', name: 'لاَم سَاكِنَة', example: 'الأَكْـلُ', exampleMeaning: 'تناول الطعام المفيد', mouthGuide: 'سُكُونُ طَرَفِ اللِّسَانِ' },
    },
    longVowels: {
      madAlif: { text: 'لاَ', name: 'مَدٌّ بِالأَلِفِ (لا)', pairedShort: 'لَـ', example: 'بِلَادِي • فَلَاحٌ', desc: 'إِطَالَةُ صَوْتِ اللاَّمِ مَعَ الأَلِفِ (لَـ + ا = لاَ)' },
      madWaw: { text: 'لُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'لُـ', example: 'لُولُو • قُلُوبٌ', desc: 'إِطَالَةُ صَوْتِ اللاَّمِ مَعَ الوَاوِ (لُـ + و = لُو)' },
      madYaa: { text: 'لِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'لِـ', example: 'حَلِيبٌ • عَلِيٌّ', desc: 'إِطَالَةُ صَوْتِ اللاَّمِ مَعَ اليَاءِ (لِـ + ي = لِي)' },
    },
    extractionWords: [
      { word: 'لِمَاذَا', extractedLetter: 'لِـ', vowelType: 'كَسْرَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'سؤال الأب' },
      { word: 'جَلَسَتْ', extractedLetter: 'ـلَـ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'جلست الأسرة' },
      { word: 'يَغْسِلُ', extractedLetter: 'ـلُ', vowelType: 'ضَمَّةٌ قَصِيرَةٌ', position: 'آخِرُ الكَلِمَةِ', meaning: 'يغسل يديه' },
    ],
    letterForms: {
      initial: { shape: 'لـ', name: 'أَوَّلُ الكَلِمَةِ', example: 'لَيْمُونٌ' },
      medial: { shape: 'ـلـ', name: 'وَسَطُ الكَلِمَةِ', example: 'جَلَسَ' },
      finalConnected: { shape: 'ـل', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'يَغْسِلُ' },
      finalIsolated: { shape: 'ل', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'عَسَلٌ' },
    }
  },
  'د': {
    letter: 'د',
    name: 'الدَّال',
    shortVowels: {
      fatha: { text: 'دَ', name: 'دَال مَفْتُوحَة', example: 'دَ رَّاجَةٌ', exampleMeaning: 'دراجة فواز الجميلة', mouthGuide: 'فَتْحُ الفَمِ' },
      damma: { text: 'دُ', name: 'دَال مَضْمُومَة', example: 'دُ مْيَةٌ', exampleMeaning: 'دمية نورة اللطيفة', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ' },
      kasra: { text: 'دِ', name: 'دَال مَكْسُورَة', example: 'دِ رْهَمٌ', exampleMeaning: 'عملة عربية أصيلة', mouthGuide: 'خَفْضُ الفَكِّ' },
      sukoon: { text: 'دْ', name: 'دَال سَاكِنَة', example: 'بَـدْرٌ', exampleMeaning: 'قمر مكتمل ليلة التمام', mouthGuide: 'سُكُونٌ مَعَ قَلْقَلَةٍ خَفِيفَةٍ' },
    },
    longVowels: {
      madAlif: { text: 'دَا', name: 'مَدٌّ بِالأَلِفِ', pairedShort: 'دَ', example: 'دَارٌ • جِدَارٌ', desc: 'إِطَالَةُ صَوْتِ الفَتْحَةِ (دَ + ا = دَا)' },
      madWaw: { text: 'دُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'دُ', example: 'دُودَةٌ • هُدُوءٌ', desc: 'إِطَالَةُ صَوْتِ الضَّمَّةِ (دُ + و = دُو)' },
      madYaa: { text: 'دِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'دِ', example: 'حَدِيقَةٌ • صَدِيقٌ', desc: 'إِطَالَةُ صَوْتِ الكَسْرَةِ (دِ + ي = دِي)' },
    },
    extractionWords: [
      { word: 'دَرَّاجَةٌ', extractedLetter: 'دَ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'دراجة فواز' },
      { word: 'دُمْيَةٌ', extractedLetter: 'دُ', vowelType: 'ضَمَّةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'لعبة نورة' },
      { word: 'حَدِيقَةٌ', extractedLetter: 'ـدِيـ', vowelType: 'مَدٌّ بِاليَاءِ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'حديقة المنزل' },
    ],
    letterForms: {
      initial: { shape: 'د', name: 'أَوَّلُ الكَلِمَةِ (مُنْفَصِلٌ)', example: 'دَرَّاجَةٌ' },
      medial: { shape: 'ـد', name: 'وَسَطُ الكَلِمَةِ (مُتَّصِلٌ بِمَا قَبْلَهُ)', example: 'مَدْرَسَةٌ' },
      finalConnected: { shape: 'ـد', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'سَعْدٌ' },
      finalIsolated: { shape: 'د', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'وَلَدٌ' },
    }
  },
  'ن': {
    letter: 'ن',
    name: 'النُّون',
    shortVowels: {
      fatha: { text: 'نَـ', name: 'نُون مَفْتُوحَة', example: 'نَـظَافَةٌ', exampleMeaning: 'النظافة من الإيمان', mouthGuide: 'فَتْحُ الفَمِ' },
      damma: { text: 'نُـ', name: 'نُون مَضْمُومَة', example: 'نُـورَةُ', exampleMeaning: 'اسم أخت فواز', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ' },
      kasra: { text: 'نِـ', name: 'نُون مَكْسُورَة', example: 'نِـظَامٌ', exampleMeaning: 'ترتيب وانتظام', mouthGuide: 'خَفْضُ الفَكِّ' },
      sukoon: { text: 'نْ', name: 'نُون سَاكِنَة', example: 'بِـنْـتٌ', exampleMeaning: 'فتاة مؤدبة', mouthGuide: 'غُنَّةٌ خَفِيفَةٌ مَعَ السُّكُونِ' },
    },
    longVowels: {
      madAlif: { text: 'نَا', name: 'مَدٌّ بِالأَلِفِ', pairedShort: 'نَـ', example: 'نَارٌ • أَبْنَاءٌ', desc: 'إِطَالَةُ صَوْتِ الفَتْحَةِ (نَـ + ا = نَا)' },
      madWaw: { text: 'نُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'نُـ', example: 'نُورٌ • عُيُونٌ', desc: 'إِطَالَةُ صَوْتِ الضَّمَّةِ (نُـ + و = نُو)' },
      madYaa: { text: 'نِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'نِـ', example: 'تِينٌ • مَدِينَتِي', desc: 'إِطَالَةُ صَوْتِ الكَسْرَةِ (نِـ + ي = نِي)' },
    },
    extractionWords: [
      { word: 'نُورَةُ', extractedLetter: 'نُـ', vowelType: 'ضَمَّةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'أخت فواز' },
      { word: 'نَظَافَةٌ', extractedLetter: 'نَـ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'نظافة المنزل' },
      { word: 'تَكْنُسُ', extractedLetter: 'ـنُـ', vowelType: 'ضَمَّةٌ قَصِيرَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'تنظف الغرفة' },
    ],
    letterForms: {
      initial: { shape: 'نـ', name: 'أَوَّلُ الكَلِمَةِ', example: 'نَمْلَةٌ' },
      medial: { shape: 'ـنـ', name: 'وَسَطُ الكَلِمَةِ', example: 'مَنْزِلٌ' },
      finalConnected: { shape: 'ـن', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'عَيْنٌ' },
      finalIsolated: { shape: 'ن', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'مِيزَانٌ' },
    }
  },
  'ر': {
    letter: 'ر',
    name: 'الرَّاء',
    shortVowels: {
      fatha: { text: 'رَ', name: 'رَاء مَفْتُوحَة', example: 'رَ حَّبَ', exampleMeaning: 'رحب بالضيف بحفاوة', mouthGuide: 'فَتْحُ الفَمِ' },
      damma: { text: 'رُ', name: 'رَاء مَضْمُومَة', example: 'رُ مَّانٌ', exampleMeaning: 'فاكهة مباركة لذيذة', mouthGuide: 'ضَمُّ الشَّفَتَيْنِ' },
      kasra: { text: 'رِ', name: 'رَاء مَكْسُورَة', example: 'رِ حْلَةٌ', exampleMeaning: 'رحلة أسرية ممتعة', mouthGuide: 'خَفْضُ الفَكِّ' },
      sukoon: { text: 'رْ', name: 'رَاء سَاكِنَة', example: 'بَـرْدٌ', exampleMeaning: 'جو الشتاء البارد', mouthGuide: 'تَكْرَارٌ خَفِيفٌ جِدًّا' },
    },
    longVowels: {
      madAlif: { text: 'رَا', name: 'مَدٌّ بِالأَلِفِ', pairedShort: 'رَ', example: 'رَاسِمٌ • زَارَنَا', desc: 'إِطَالَةُ صَوْتِ الفَتْحَةِ (رَ + ا = رَا)' },
      madWaw: { text: 'رُو', name: 'مَدٌّ بِالوَاوِ', pairedShort: 'رُ', example: 'خَرُوفٌ • رُوحٌ', desc: 'إِطَالَةُ صَوْتِ الضَّمَّةِ (رُ + و = رُو)' },
      madYaa: { text: 'رِي', name: 'مَدٌّ بِاليَاءِ', pairedShort: 'رِ', example: 'رِيشٌ • كَرِيمٌ', desc: 'إِطَالَةُ صَوْتِ الكَسْرَةِ (رِ + ي = رِي)' },
    },
    extractionWords: [
      { word: 'رَحَّبَ', extractedLetter: 'رَ', vowelType: 'فَتْحَةٌ قَصِيرَةٌ', position: 'أَوَّلُ الكَلِمَةِ', meaning: 'رحب بالجد' },
      { word: 'فَرِحَةٌ', extractedLetter: 'ـرِ', vowelType: 'كَسْرَةٌ قَصِيرَةٌ', position: 'وَسَطُ الكَلِمَةِ', meaning: 'نورة مسرورة' },
      { word: 'يَاسِرٌ', extractedLetter: 'ـرٌ', vowelType: 'تَنْوِينُ ضَمٍّ', position: 'آخِرُ الكَلِمَةِ', meaning: 'أخو فواز' },
    ],
    letterForms: {
      initial: { shape: 'ر', name: 'أَوَّلُ الكَلِمَةِ (مُنْفَصِلٌ)', example: 'رَمْلٌ' },
      medial: { shape: 'ـر', name: 'وَسَطُ الكَلِمَةِ (مُتَّصِلٌ بِمَا قَبْلَهُ)', example: 'قَرْيَةٌ' },
      finalConnected: { shape: 'ـر', name: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ', example: 'بَحْرٌ' },
      finalIsolated: { shape: 'ر', name: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ', example: 'قَمَرٌ' },
    }
  }
};

interface LetterPhoneticsActivityProps {
  initialLetter?: string;
}

export const LetterPhoneticsActivity: React.FC<LetterPhoneticsActivityProps> = ({
  initialLetter = 'م'
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter);
  const [extractedWordIdx, setExtractedWordIdx] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'vowels' | 'extraction' | 'forms' | 'compare'>('vowels');

  const currentData = UNIT1_LETTERS_DATA[selectedLetter] || UNIT1_LETTERS_DATA['م'];

  const handlePlaySound = (soundText: string, label: string) => {
    audioManager.speakArabic(soundText);
  };

  const handleCompareVowels = (shortText: string, longText: string) => {
    audioManager.speakArabic(`${shortText}... ثُمَّ بِالمَدِّ: ${longText}`);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black font-amiri text-2xl shadow-md shadow-emerald-700/20">
            {currentData.letter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                المُكَوِّنُ ٤ وَ ٥ وَ ٦ • الوَحْدَةُ الأُولَى
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                المَنْهَجُ السَّعُودِيُّ المَفْحُوصُ
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria tracking-tight mt-0.5">
              مُخْتَبَرُ قِرَاءَةِ الحُرُوفِ: حَرْفُ {currentData.name} ({currentData.letter})
            </h3>
          </div>
        </div>

        {/* Letter Switcher Selector (All 6 letters of Unit 1) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 px-2 hidden md:inline">حُرُوفُ الوَحْدَةِ:</span>
          {Object.keys(UNIT1_LETTERS_DATA).map((letChar) => (
            <button
              key={letChar}
              onClick={() => {
                setSelectedLetter(letChar);
                setExtractedWordIdx(0);
                audioManager.play('click');
              }}
              className={`w-9 h-9 rounded-xl font-black font-amiri text-lg transition-all ${
                selectedLetter === letChar
                  ? 'bg-emerald-700 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {letChar}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('vowels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'vowels'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>🎵</span>
          <span>الصَّوْتُ القَصِيرُ وَالطَّوِيلُ (الْمَدّ)</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'compare'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>⚖️</span>
          <span>مُقَارَنَةُ مِقْدَارِ الصَّوْتَيْنِ</span>
        </button>

        <button
          onClick={() => setActiveTab('extraction')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'extraction'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>🔍</span>
          <span>تَجْرِيدُ الحَرْفِ مِنَ الكَلِمَاتِ</span>
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'forms'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>✍️</span>
          <span>أَشْكَالُ الحَرْفِ عَلَى السَّطْرِ</span>
        </button>
      </div>

      {/* TAB 1: SHORT & LONG VOWELS */}
      {activeTab === 'vowels' && (
        <div className="space-y-6">
          {/* SECTION A: SHORT VOWELS (أصوات الحركات القصيرة) */}
          <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ١
                </span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-emerald-950 font-alexandria">
                    أَصْوَاتُ الحَرَكَاتِ القَصِيرَةِ (فَتْحَةٌ ، ضَمَّةٌ ، كَسْرَةٌ ، سُكُونٌ)
                  </h4>
                  <p className="text-xs text-emerald-800">
                    انقر على أي حركة للاستماع لنطقها السليم مع حركة الفم والمثال
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                زمن النطق: حركة واحدة سريعة ⚡
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(currentData.shortVowels).map(([key, vItem]) => (
                <div
                  key={key}
                  onClick={() => handlePlaySound(vItem.text, vItem.name)}
                  className="bg-white p-4 rounded-2xl border-2 border-emerald-300 hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 text-center group relative overflow-hidden"
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1">{vItem.name}</div>
                  <div className="font-amiri text-4xl sm:text-5xl font-black text-emerald-800 my-1 group-hover:scale-110 transition-transform">
                    {vItem.text}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-slate-800">{vItem.example}</span>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{vItem.exampleMeaning}</p>
                  </div>
                  <div className="mt-2 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {vItem.mouthGuide}
                  </div>
                  <button 
                    className="absolute top-2 left-2 text-emerald-600 group-hover:text-emerald-800 p-1"
                    title="استماع"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: LONG VOWELS (أصوات المد الطويلة) */}
          <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ٢
                </span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-amber-950 font-alexandria">
                    أَصْوَاتُ الْمَدِّ الطَّوِيلَةِ (مَدٌّ بِالأَلِفِ ، مَدٌّ بِالوَاوِ ، مَدٌّ بِاليَاءِ)
                  </h4>
                  <p className="text-xs text-amber-800">
                    الصوت الطويل يُمد بمقدار حركتين ويساوي ضعف الصوت القصير
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white text-amber-800 px-3 py-1 rounded-full border border-amber-300">
                زمن النطق: حركتان ممتدتان ⏳
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(currentData.longVowels).map(([key, vItem]) => (
                <div
                  key={key}
                  onClick={() => handlePlaySound(vItem.text, vItem.name)}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-300 hover:border-amber-600 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 text-center group relative overflow-hidden"
                >
                  <div className="text-xs font-bold text-amber-700 mb-1">{vItem.name}</div>
                  <div className="font-amiri text-5xl font-black text-amber-900 my-2 group-hover:scale-110 transition-transform">
                    {vItem.text}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{vItem.desc}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>أمثلة:</span>
                    <span className="text-amber-800 font-amiri text-sm">{vItem.example}</span>
                  </div>
                  <button 
                    className="absolute top-2 left-2 text-amber-600 group-hover:text-amber-800 p-1"
                    title="استماع"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPARISON TABLE */}
      {activeTab === 'compare' && (
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
          <div className="text-center max-w-xl mx-auto mb-4">
            <h4 className="font-extrabold text-base text-slate-900 font-alexandria">
              مُقَارَنَةٌ حَيَّةٌ بَيْنَ الصَّوْتِ القَصِيرِ وَالصَّوْتِ الطَّوِيلِ
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              استمع إلى الزوجين معاً لملاحظة الفارق الزمني الدقيق في النطق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pair 1: Fatha vs Mad Alif */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 py-1 rounded-xl">
                الفتحة وَمَدُّ الأَلِفِ
              </div>
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold">قصير</span>
                  <span className="font-amiri text-4xl font-black text-emerald-700">{currentData.shortVowels.fatha.text}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-amber-600 font-bold">طويل</span>
                  <span className="font-amiri text-4xl font-black text-amber-700">{currentData.longVowels.madAlif.text}</span>
                </div>
              </div>
              <button
                onClick={() => handleCompareVowels(currentData.shortVowels.fatha.text, currentData.longVowels.madAlif.text)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>نُطْقُ المُقَارَنَةِ</span>
              </button>
            </div>

            {/* Pair 2: Damma vs Mad Waw */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 py-1 rounded-xl">
                الضمة وَمَدُّ الوَاوِ
              </div>
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold">قصير</span>
                  <span className="font-amiri text-4xl font-black text-emerald-700">{currentData.shortVowels.damma.text}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-amber-600 font-bold">طويل</span>
                  <span className="font-amiri text-4xl font-black text-amber-700">{currentData.longVowels.madWaw.text}</span>
                </div>
              </div>
              <button
                onClick={() => handleCompareVowels(currentData.shortVowels.damma.text, currentData.longVowels.madWaw.text)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>نُطْقُ المُقَارَنَةِ</span>
              </button>
            </div>

            {/* Pair 3: Kasra vs Mad Yaa */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 py-1 rounded-xl">
                الكسرة وَمَدُّ اليَاءِ
              </div>
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold">قصير</span>
                  <span className="font-amiri text-4xl font-black text-emerald-700">{currentData.shortVowels.kasra.text}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-amber-600 font-bold">طويل</span>
                  <span className="font-amiri text-4xl font-black text-amber-700">{currentData.longVowels.madYaa.text}</span>
                </div>
              </div>
              <button
                onClick={() => handleCompareVowels(currentData.shortVowels.kasra.text, currentData.longVowels.madYaa.text)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>نُطْقُ المُقَارَنَةِ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LETTER EXTRACTION (تجريد الحرف) */}
      {activeTab === 'extraction' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 font-alexandria">
                أَقْرَأُ الكَلِمَاتِ ثُمَّ أُجَرِّدُ الحَرْفَ (كِتَابُ الطَّالِبِ - ص ١٠٩)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                تجريد الحرف يعني فصله عن الكلمة مع حركته وموضعه للتعرف على صوته المستقل
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentData.extractionWords.map((item, idx) => {
              const isSelected = extractedWordIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setExtractedWordIdx(idx);
                    audioManager.speakArabic(`${item.word}... نُجَرِّدُ مِنْهَا: ${item.extractedLetter}`);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all transform hover:-translate-y-1 ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-300/40' 
                      : 'bg-slate-50 hover:bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400">{item.position}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      {item.vowelType}
                    </span>
                  </div>

                  {/* Word Display */}
                  <div className="text-center py-2">
                    <div className="font-amiri text-3xl font-black text-slate-800">
                      {item.word}
                    </div>
                    <span className="text-[11px] text-slate-500">{item.meaning}</span>
                  </div>

                  {/* Extracted Letter Arrow & Badge */}
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">الحرف المجرد:</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-amiri text-2xl font-black flex items-center justify-center shadow-xs">
                      {item.extractedLetter}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LETTER FORMS & CALLIGRAPHY */}
      {activeTab === 'forms' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 font-alexandria">
              أَشْكَالُ حَرْفِ ({currentData.letter}) عَلَى السَّطْرِ (أَوَّلُ، وَسَطُ، وَآخِرُ الكَلِمَةِ)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              يتعرف الطالب على مواقع الحرف وكيفية اتصاله مع الحروف الأخرى في الكلمة
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(currentData.letterForms).map(([posKey, formItem]) => (
              <div
                key={posKey}
                onClick={() => audioManager.speakArabic(`حَرْفُ ${currentData.name}: ${formItem.name}، مِثْلُ: ${formItem.example}`)}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all text-center group"
              >
                <div className="text-[10px] font-bold text-slate-400 mb-1">{formItem.name}</div>
                {/* Notebook line simulator */}
                <div className="my-3 py-3 bg-white rounded-xl border border-rose-200 relative overflow-hidden">
                  {/* Baseline indicator */}
                  <div className="absolute inset-x-0 bottom-4 h-0.5 bg-rose-400 pointer-events-none"></div>
                  <span className="font-amiri text-4xl sm:text-5xl font-black text-emerald-800 relative z-10">
                    {formItem.shape}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  مثال: <span className="font-amiri text-sm text-emerald-900">{formItem.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
