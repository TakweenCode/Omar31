export interface WishBalloon {
  id: string;
  label: string;
  wish: string;
  color: string;
  highlight: string;
}

export type ParticipantGender = 'boy' | 'girl';

export interface DreamOption {
  id: string;
  boy: {
    emoji: string;
    title: string;
  };
  girl: {
    emoji: string;
    title: string;
  };
}

export interface CardTheme {
  id: 'twilight' | 'sunrise' | 'meadow';
  name: string;
  gradientStops: [string, string, string];
  previewBg: string;
  accentBorder: string;
}

export const ATTRIBUTION = {
  studentDefault: 'عمر',
  studentFullName: 'عمر المالكي',
  teacher: 'المعلمة نورة الحصيني',
  school: 'الروضة 31',
  occasion: 'يوم الطفل العالمي',
  dateLabel: '20 نوفمبر',
  footerSummary: 'يوم الطفل العالمي · 20 نوفمبر · الروضة 31',
  closingQuote: 'الطفولة لعب وضحك وأحلام كبيرة',
} as const;

export const WISH_BALLOONS: WishBalloon[] = [
  {
    id: 'w1',
    label: 'البالون المرجاني',
    wish: 'أتمنى أن يكون كل الأطفال سعداء 😊',
    color: '#F43F5E',
    highlight: '#FDA4AF',
  },
  {
    id: 'w2',
    label: 'البالون الذهبي',
    wish: 'أحب اللعب مع أصدقائي في الروضة ⚽',
    color: '#F59E0B',
    highlight: '#FDE68A',
  },
  {
    id: 'w3',
    label: 'البالون السماوي',
    wish: 'أحب أمي وأبي كثيراً ❤️',
    color: '#2563EB',
    highlight: '#93C5FD',
  },
  {
    id: 'w4',
    label: 'البالون الأخضر',
    wish: 'أتمنى أن يتعلم كل الأطفال ويلعبوا بأمان 📚',
    color: '#10B981',
    highlight: '#A7F3D0',
  },
];

export const DREAM_OPTIONS: DreamOption[] = [
  {
    id: 'doctor',
    boy: {emoji: '👨‍⚕️', title: 'طبيب'},
    girl: {emoji: '👩‍⚕️', title: 'طبيبة'},
  },
  {
    id: 'pilot',
    boy: {emoji: '👨‍✈️', title: 'كابتن طائرة'},
    girl: {emoji: '👩‍✈️', title: 'كابتن طائرة'},
  },
  {
    id: 'teacher',
    boy: {emoji: '👨‍🏫', title: 'معلم'},
    girl: {emoji: '👩‍🏫', title: 'معلمة'},
  },
  {
    id: 'astronaut',
    boy: {emoji: '👨‍🚀', title: 'رائد فضاء'},
    girl: {emoji: '👩‍🚀', title: 'رائدة فضاء'},
  },
  {
    id: 'footballer',
    boy: {emoji: '⚽', title: 'لاعب كرة قدم'},
    girl: {emoji: '⚽', title: 'لاعبة كرة قدم'},
  },
  {
    id: 'police',
    boy: {emoji: '👮‍♂️', title: 'شرطي'},
    girl: {emoji: '👮‍♀️', title: 'شرطية'},
  },
  {
    id: 'artist',
    boy: {emoji: '🎨', title: 'فنان'},
    girl: {emoji: '🎨', title: 'فنانة'},
  },
];

export const CELEBRATION_PHRASES: string[] = [
  'أحب أن ألعب وأتعلم وأضحك كل يوم',
  'من حقي أن ألعب وأتعلم في أمان وسلام',
  'الطفولة أجمل بالحب واللعب',
  'اللعب حقي والتعلّم حلمي',
  'كل الأطفال متساوون ولهم حقوق',
  'أحلم بعالم مليء بالفرح والسلام',
];

export const DRAW_COLORS: {hex: string; name: string}[] = [
  {hex: '#E63946', name: 'أحمر'},
  {hex: '#FF9F1C', name: 'برتقالي'},
  {hex: '#FFD60A', name: 'أصفر'},
  {hex: '#10B981', name: 'أخضر'},
  {hex: '#2563EB', name: 'أزرق'},
  {hex: '#7C3AED', name: 'بنفسجي'},
  {hex: '#EC4899', name: 'وردي'},
  {hex: '#6D4C41', name: 'بني'},
  {hex: '#1E293B', name: 'أسود'},
];

export const CANVAS_STAMPS: string[] = ['⭐', '❤️', '🎈', '🎨', '🌻', '⚽'];

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'twilight',
    name: 'سماء الألوان',
    gradientStops: ['#4F7DF3', '#9D62C6', '#FF859D'],
    previewBg: 'linear-gradient(135deg, #4F7DF3, #9D62C6, #FF859D)',
    accentBorder: '#E4DEFA',
  },
  {
    id: 'sunrise',
    name: 'شمس الصباح',
    gradientStops: ['#F59E0B', '#F97316', '#FB7185'],
    previewBg: 'linear-gradient(135deg, #F59E0B, #F97316, #FB7185)',
    accentBorder: '#FDE68A',
  },
  {
    id: 'meadow',
    name: 'ربيع الروضة',
    gradientStops: ['#0284C7', '#0EA5E9', '#10B981'],
    previewBg: 'linear-gradient(135deg, #0284C7, #0EA5E9, #10B981)',
    accentBorder: '#BAE6FD',
  },
];
