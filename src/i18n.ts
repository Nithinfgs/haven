export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ur' | 'kn' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil',   nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi',   nativeName: 'हिन्दी' },
  { code: 'ur', name: 'Urdu',    nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu',  nativeName: 'తెలుగు' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    connect: 'Connect',
    community: 'Community',
    resources: 'Resources',
    wellbeing: 'Wellbeing',
    helpNow: 'Help now',
    therapistPortal: 'Therapist Portal',
    settings: 'Settings',
    signOut: 'Sign out',

    // Sanctuary Header
    sanctuaryBadge: 'Self-Awareness & Safe Connection',
    sanctuaryTitle: 'A quiet place for yourself',
    sanctuarySubtitle: 'Notice how you are feeling, take one small gentle action, or connect with peers who understand.',
    
    // Haven Moment
    takeHavenMoment: 'Take a Haven Moment',
    havenMomentDesc: "When stress builds up, you don't need a 10-step plan. Tell us what you're experiencing, and we’ll guide you through one small next step.",
    havenMomentTag: 'Signature Reset',
    inTheMomentTag: 'In the moment:',

    // Daily Check-In
    dailyCheckIn: 'Daily Check-In (1 min)',
    checkedInToday: 'Checked in today',
    dailyResilience: 'Daily Resilience',
    noPressureTag: 'No pressure • Micro step',
    stepForToday: 'Step for Today',
    fiveMins: '5 minutes',
    complete: 'Complete',
    done: 'Done',
    organizeDeskTitle: 'Organize your immediate workspace surface',
    organizeDeskDesc: 'Clear just the area in front of your keyboard or notebook. Physical micro-order gently lowers cognitive friction.',

    // Patterns Over Time
    patternsOverTime: 'Your Patterns Over Time (Real Correlations)',
    sleepStressTitle: 'Sleep & Stress Correlation',
    sleepStressDesc: 'When your sleep is rated deep & restful, your next-day stress drops by 42%.',
    communityConnTitle: 'Community Connection',
    communityConnDesc: 'Participating in "I need someone to listen" reduced reported isolation in 4 of your last 5 check-ins.',

    // Support Spaces
    structuredSpaces: 'Structured Support Spaces',
    structuredSpacesDesc: 'Not a generic social feed — intentional rooms for what you actually feel right now.',
    growthCircles: 'Moderated Growth Circles',
    growthCirclesDesc: 'Safe group spaces focused on steady lifestyle habits, sleep, and emotional balance.',
    viewAll: 'View all',
    inTheMoment: 'In the Moment',
    active: 'active',
    joinArrow: 'Join →',

    // Room Titles & Descriptions
    'listen-space': 'I need someone to listen',
    'listen-desc': 'A dedicated space when you want to be heard without unsolicited advice. Empathetic listeners only.',
    'lonely-space': 'I’m feeling lonely',
    'lonely-desc': 'Low-pressure presence for when you feel disconnected and just want quiet company.',
    'academic-stress': 'Academic & school pressure',
    'academic-desc': 'Talk through homework overload, exam anxiety, and heavy expectations with peers who get it.',
    'motivation-space': 'Motivation & gentle focus',
    'motivation-desc': 'Body-doubling and micro-goals for getting through study blocks together.',
    'family-dynamics': 'Family dynamics & boundaries',
    'family-desc': 'Navigating difficult conversations, expectations, and household stress.',
    'general-venting': 'General anonymous venting',
    'general-desc': 'Let out the daily frustrations without judgment or unsolicited advice.',
    'circle-sleep': 'Circle: Sleep & Evening Reset',
    'circle-sleep-desc': 'Weekly check-ins, wind-down routines, and gentle circadian habits.',
    'circle-stress': 'Circle: De-stress & Nervous System',
    'circle-stress-desc': 'Micro-grounding practices, physiological sighs, and somatic balance.',
    'circle-focus': 'Circle: Focus & Anti-Procrastination',
    'circle-focus-desc': 'Low-friction work blocks, dopamine resets, and structured focus.',
    'circle-boundaries': 'Circle: Healthy Boundaries & Saying No',
    'circle-boundaries-desc': 'Roleplaying social boundaries and building self-confidence.',

    // Sidebar Right Column
    supportListenerTitle: '1-on-1 Support Listener',
    supportListenerDesc: 'If peer spaces aren’t enough right now, start a private, judgment-free conversation with a trained listener or licensed counselor.',
    connectPrivately: 'Connect Privately',
    avgWait: 'Average wait: < 2 mins',
    findTherapist: 'Find licensed therapist →',
    dailyWellbeing: 'Daily Wellbeing',
    openTracker: 'Open tracker',
    missedDayQuote: '"You missed a day? It means you took a restful day for yourself."',
    safePrivateTitle: 'Safe, Private & Anonymous',
    safePrivateDesc: 'You are in complete control of your data. Share only what feels right with therapists.',
    needCrisisHelp: 'Need crisis assistance? Get help now →',

    // Settings
    languagePreference: 'Language Preference (Interface & Content)',
    termsAndDisclaimers: 'Terms of Service, Legal & Liability Governance',
  },

  ta: {
    // Navigation
    home: 'முகப்பு',
    connect: 'தொடர்பு',
    community: 'சமூகம்',
    resources: 'வளங்கள்',
    wellbeing: 'நலவாழ்வு',
    helpNow: 'உடனடி உதவி',
    therapistPortal: 'மருத்துவர் தளம்',
    settings: 'அமைப்புகள்',
    signOut: 'வெளியேறு',

    // Sanctuary Header
    sanctuaryBadge: 'சுய விழிப்புணர்வு & பாதுகாப்பான இணைப்பு',
    sanctuaryTitle: 'உங்களுக்கான அமைதியான இடம்',
    sanctuarySubtitle: 'உங்கள் உணர்வுகளைப் புரிந்து கொள்ளுங்கள், ஒரு சிறிய மென்மையான செயலைச் செய்யுங்கள், அல்லது ஆதரவான தோழர்களுடன் இணையுங்கள்.',
    
    // Haven Moment
    takeHavenMoment: 'ஹேவன் தருணம் தொடங்குங்கள்',
    havenMomentDesc: 'மன அழுத்தம் ஏற்படும் போது, 10 படிகள் தேவையில்லை. உங்கள் நிலையைச் சொல்லுங்கள், ஒரு எளிய அடுத்த படியை நாங்கள் வழிகாட்டுகிறோம்.',
    havenMomentTag: 'சிறப்பு பயிற்சி',
    inTheMomentTag: 'இந்த தருணத்தில்:',

    // Daily Check-In
    dailyCheckIn: 'தினசரி பதிவு (1 நிமிடம்)',
    checkedInToday: 'இன்று பதிவு செய்யப்பட்டது',
    dailyResilience: 'தினசரி உறுதி',
    noPressureTag: 'அழுத்தம் இல்லை • சிறிய படி',
    stepForToday: 'இன்றைய சிறிய செயல்',
    fiveMins: '5 நிமிடங்கள்',
    complete: 'முடிக்கவும்',
    done: 'முடிந்தது',
    organizeDeskTitle: 'உங்கள் மேசையைச் சீரமைக்கவும்',
    organizeDeskDesc: 'உங்கள் விசைப்பலகை அல்லது குறிப்பேட்டின் முன் உள்ள இடத்தை மட்டும் சுத்தம் செய்யுங்கள். சிறிய ஒழுங்கு மன அழுத்தத்தைக் குறைக்கும்.',

    // Patterns Over Time
    patternsOverTime: 'உங்கள் காலப்போக்கிலான வடிவங்கள் (உண்மையான தொடர்பு)',
    sleepStressTitle: 'தூக்கம் & மன அழுத்த தொடர்பு',
    sleepStressDesc: 'உங்கள் தூக்கம் ஆழ்ந்ததாகவும் நிம்மதியாகவும் இருக்கும்போது, அடுத்த நாள் மன அழுத்தம் 42% குறைகிறது.',
    communityConnTitle: 'சமூக தொடர்பு',
    communityConnDesc: '"யாராவது கேட்க வேண்டும்" பகுதியில் பங்கேற்றது உங்கள் தனிமை உணர்வை 4/5 முறை குறைத்துள்ளது.',

    // Support Spaces
    structuredSpaces: 'உடனடி உரையாடல் வெளிகள்',
    structuredSpacesDesc: 'சமூக வலைத்தள இரைச்சல் இல்லாத உண்மையான உணர்வுகளுக்கான இடங்கள்.',
    growthCircles: 'வளர்ச்சி வட்டங்கள்',
    growthCirclesDesc: 'தூக்கம், மன அழுத்தம் மற்றும் சமநிலைக்கான வழிகாட்டப்பட்ட குழுக்கள்.',
    viewAll: 'அனைத்தையும் பார்',
    inTheMoment: 'இந்தத் தருணம்',
    active: 'செயலில்',
    joinArrow: 'இணையுங்கள் →',

    // Room Titles & Descriptions
    'listen-space': 'யாராவது கேட்க வேண்டும்',
    'listen-desc': 'அறிவுரைகள் இன்றி உங்களை ஒருவர் கேட்க விரும்பும் போதான இடம்.',
    'lonely-space': 'தனிமையாக உணர்கிறேன்',
    'lonely-desc': 'தனிமை உணரும் போது அமைதியான தோழமைக்கான இடம்.',
    'academic-stress': 'படிப்பு & தேர்வு அழுத்தம்',
    'academic-desc': 'வீட்டுப்பாடம், தேர்வு பயம் மற்றும் எதிர்பார்ப்புகளைப் பகிர்ந்து கொள்ளும் இடம்.',
    'motivation-space': 'ஊக்கம் & மென்மையான கவனம்',
    'motivation-desc': 'படிப்பில் கவனம் செலுத்த உதவும் சிறிய இலக்குகள்.',
    'family-dynamics': 'குடும்ப உறவுகள் & எல்லைகள்',
    'family-desc': 'குடும்ப அழுத்தங்கள் மற்றும் எல்லைகளைக் கையாளுதல்.',
    'general-venting': 'பொதுவான மனக்குமுறல்',
    'general-desc': 'அன்றாட விரக்திகளை வெளிப்படையாகப் பேசும் இடம்.',
    'circle-sleep': 'வட்டம்: தூக்கம் & இரவு வழக்கம்',
    'circle-sleep-desc': 'வாராந்திர கண்காணிப்பு மற்றும் அமைதியான தூக்கப் பழக்கங்கள்.',
    'circle-stress': 'வட்டம்: மன அழுத்தக் குறைப்பு',
    'circle-stress-desc': 'மூச்சுப் பயிற்சிகள் மற்றும் நரம்பு மண்டல அமைதி.',
    'circle-focus': 'வட்டம்: கவனம் & தாமதமின்மை',
    'circle-focus-desc': 'கவனம் மற்றும் இலக்குகளை அடைய உதவும் பழக்கங்கள்.',
    'circle-boundaries': 'வட்டம்: தனிநபர் எல்லைகள்',
    'circle-boundaries-desc': 'தன்னம்பிக்கை மற்றும் எல்லைகளை அமைத்தல்.',

    // Sidebar Right Column
    supportListenerTitle: '1-க்கு-1 ஆதரவு கேட்பவர்',
    supportListenerDesc: 'குழு இடங்கள் போதவில்லை எனில், பயிற்சி பெற்ற கேட்பவருடன் தனிப்பட்ட உரையாடலைத் தொடங்குங்கள்.',
    connectPrivately: 'தனிப்பட்ட முறையில் பேசுங்கள்',
    avgWait: 'சராசரி நேரம்: < 2 நிமிடம்',
    findTherapist: 'மருத்துவரைத் தேடுங்கள் →',
    dailyWellbeing: 'தினசரி நலவாழ்வு',
    openTracker: 'டிராக்கரைத் திறக்கவும்',
    missedDayQuote: '"ஒரு நாள் விடுபட்டதா? உங்களுக்காக நீங்கள் ஓய்வெடுத்தீர்கள் என்று பொருள்."',
    safePrivateTitle: 'பாதுகாப்பானது, தனிப்பட்டது & பெயர் குறிப்பிடப்படாதது',
    safePrivateDesc: 'உங்கள் தரவு உங்கள் கட்டுப்பாட்டில் உள்ளது. உங்களுக்குத் திருப்தியானதை மட்டும் பகிருங்கள்.',
    needCrisisHelp: 'அவசர உதவி தேவையா? உடனடியாகப் பெறுங்கள் →',

    // Settings
    languagePreference: 'மொழி தேர்வு (முழு இடைமுகம்)',
    termsAndDisclaimers: 'விதிமுறைகள், சட்டம் & பொறுப்புத்துறப்பு',
  },

  hi: {
    // Navigation
    home: 'होम',
    connect: 'बातचीत',
    community: 'समुदाय',
    resources: 'संसाधन',
    wellbeing: 'कल्याण',
    helpNow: 'तुरंत मदद',
    therapistPortal: 'थेरेपिस्ट पोर्टल',
    settings: 'सेटिंग्स',
    signOut: 'साइन आउट',

    // Sanctuary Header
    sanctuaryBadge: 'आत्म-जागरूकता और सुरक्षित स्थान',
    sanctuaryTitle: 'आपके लिए एक शांत स्थान',
    sanctuarySubtitle: 'अपनी भावनाओं को पहचानें, एक छोटा कदम उठाएं, या उन साथियों से जुड़ें जो समझते हैं।',
    
    // Haven Moment
    takeHavenMoment: 'हेवन मोमेंट शुरू करें',
    havenMomentDesc: 'जब तनाव बढ़ जाए, तो आपको 10 चरणों की योजना की आवश्यकता नहीं है। हम आपको एक छोटे अगले कदम के लिए मार्गदर्शन करेंगे।',
    havenMomentTag: 'विशेष रीसेट',
    inTheMomentTag: 'इस क्षण में:',

    // Daily Check-In
    dailyCheckIn: 'दैनिक चेक-इन (1 मिनट)',
    checkedInToday: 'आज चेक-इन किया गया',
    dailyResilience: 'दैनिक लचीलापन',
    noPressureTag: 'कोई दबाव नहीं • छोटा कदम',
    stepForToday: 'आज का छोटा कदम',
    fiveMins: '5 मिनट',
    complete: 'पूरा करें',
    done: 'हो गया',
    organizeDeskTitle: 'अपनी डेस्क को व्यवस्थित करें',
    organizeDeskDesc: 'बस अपने कीबोर्ड या नोटबुक के सामने के क्षेत्र को साफ करें। थोड़ा सा क्रम मानसिक तनाव कम करता है।',

    // Patterns Over Time
    patternsOverTime: 'समय के साथ आपके पैटर्न (वास्तविक संबंध)',
    sleepStressTitle: 'नींद और तनाव का संबंध',
    sleepStressDesc: 'जब आपकी नींद गहरी होती है, तो अगले दिन का तनाव 42% तक कम हो जाता है।',
    communityConnTitle: 'सामुदायिक जुड़ाव',
    communityConnDesc: '"मुझे कोई सुनने वाला चाहिए" में भाग लेने से अकेलेपन में भारी कमी आई है।',

    // Support Spaces
    structuredSpaces: 'संरचित समर्थन स्थान',
    structuredSpacesDesc: 'बिना किसी सोशल मीडिया शोर के अपनी वास्तविक भावनाओं को साझा करने के सुरक्षित स्थान।',
    growthCircles: 'विकास मंडल',
    growthCirclesDesc: 'नींद, तनाव प्रबंधन और व्यक्तिगत विकास के लिए समूह।',
    viewAll: 'सभी देखें',
    inTheMoment: 'इस क्षण में',
    active: 'सक्रिय',
    joinArrow: 'शामिल हों →',

    // Room Titles & Descriptions
    'listen-space': 'मुझे कोई सुनने वाला चाहिए',
    'listen-desc': 'बिना किसी अनचाही सलाह के सुने जाने का एक सुरक्षित स्थान।',
    'lonely-space': 'अकेलापन महसूस हो रहा है',
    'lonely-desc': 'जब आप अलग-थलग महसूस करें तो शांत साथियों की मौजूदगी।',
    'academic-stress': 'पढ़ाई और परीक्षा का तनाव',
    'academic-desc': 'होमवर्क और परीक्षा की चिंता को साथियों के साथ साझा करें।',
    'motivation-space': 'प्रेरणा और सौम्य ध्यान',
    'motivation-desc': 'एक साथ पढ़ाई और काम करने के लिए छोटे लक्ष्य।',
    'family-dynamics': 'पारिवारिक संबंध और सीमाएं',
    'family-desc': 'पारिवारिक तनाव और व्यक्तिगत सीमाओं को संभालना।',
    'general-venting': 'सामान्य विचार साझा करें',
    'general-desc': 'बिना किसी निर्णय के अपनी दैनिक निराशाओं को व्यक्त करें।',
    'circle-sleep': 'मंडल: नींद और शाम की दिनचर्या',
    'circle-sleep-desc': 'साप्ताहिक चेक-इन और आरामदायक नींद की आदतें।',
    'circle-stress': 'मंडल: तनावमुक्ति और तंत्रिका तंत्र',
    'circle-stress-desc': 'सांस लेने के अभ्यास और शारीरिक संतुलन।',
    'circle-focus': 'मंडल: एकाग्रता और समय प्रबंधन',
    'circle-focus-desc': 'काम पर ध्यान केंद्रित करने की आदतें।',
    'circle-boundaries': 'मंडल: व्यक्तिगत सीमाएं',
    'circle-boundaries-desc': 'आत्मविश्वास और सीमाओं का निर्माण।',

    // Sidebar Right Column
    supportListenerTitle: '1-ऑन-1 श्रोता',
    supportListenerDesc: 'यदि सहकर्मी स्थान पर्याप्त नहीं हैं, तो प्रशिक्षित श्रोता या लाइसेंस प्राप्त परामर्शदाता से बात करें।',
    connectPrivately: 'निजी तौर पर जुड़ें',
    avgWait: 'औसत प्रतीक्षा: < 2 मिनट',
    findTherapist: 'थेरेपिस्ट खोजें →',
    dailyWellbeing: 'दैनिक कल्याण',
    openTracker: 'ट्रैकर खोलें',
    missedDayQuote: '"एक दिन छूट गया? इसका मतलब है कि आपने अपने लिए आराम का दिन लिया।"',
    safePrivateTitle: 'सुरक्षित, निजी और अनाम',
    safePrivateDesc: 'आपका डेटा पूरी तरह आपके नियंत्रण में है। केवल वही साझा करें जो सही लगे।',
    needCrisisHelp: 'आपातकालीन सहायता चाहिए? अभी प्राप्त करें →',

    // Settings
    languagePreference: 'भाषा प्राथमिकता (इंटरफ़ेस और सामग्री)',
    termsAndDisclaimers: 'नियम, कानूनी और दायित्व अस्वीकरण',
  },

  ur: {
    // Navigation
    home: 'ہوم',
    connect: 'رابطہ',
    community: 'کمیونٹی',
    resources: 'وسائل',
    wellbeing: 'صحت و تندرستی',
    helpNow: 'فوری مدد',
    therapistPortal: 'تھراپسٹ پورٹل',
    settings: 'ترتیبات',
    signOut: 'سائن آؤٹ',

    // Sanctuary Header
    sanctuaryBadge: 'خود آگاہی اور محفوظ جگہ',
    sanctuaryTitle: 'آپ کے لیے ایک پرسکون جگہ',
    sanctuarySubtitle: 'اپنے جذبات کو سمجھیں، ایک چھوٹا قدم اٹھائیں، یا سمجھنے والے ساتھیوں سے جڑیں۔',
    
    // Haven Moment
    takeHavenMoment: 'ہیون لمحہ لیں',
    havenMomentDesc: 'جب تناؤ بڑھ جائے تو ہم آپ کو ایک چھوٹے سے اگلے قدم کی رہنمائی کریں گے۔',
    havenMomentTag: 'خصوصی ری سیٹ',
    inTheMomentTag: 'اس لمحے میں:',

    // Daily Check-In
    dailyCheckIn: 'روزانہ چیک ان (1 منٹ)',
    checkedInToday: 'آج چیک ان مکمل',
    dailyResilience: 'روزانہ لچکداری',
    noPressureTag: 'کوئی دباؤ نہیں • چھوٹا قدم',
    stepForToday: 'آج کا چھوٹا قدم',
    fiveMins: '5 منٹ',
    complete: 'مکمل کریں',
    done: 'مکمل ہو گیا',
    organizeDeskTitle: 'اپنی میز کو ترتیب دیں',
    organizeDeskDesc: 'صرف اپنے کی بورڈ کے سامنے کی جگہ صاف کریں۔ تھوڑی سی ترتیب ذہنی دباؤ کم کرتی ہے۔',

    // Patterns Over Time
    patternsOverTime: 'وقت کے ساتھ آپ کے پیٹرن',
    sleepStressTitle: 'نیند اور تناؤ کا تعلق',
    sleepStressDesc: 'جب آپ کی نیند گہری ہوتی ہے تو اگلے دن کا تناؤ 42 فیصد کم ہو جاتا ہے۔',
    communityConnTitle: 'کمیونٹی رابطہ',
    communityConnDesc: 'گفتگو کے کمروں میں شرکت نے تنہائی کو نمایاں طور پر کم کیا ہے۔',

    // Support Spaces
    structuredSpaces: 'مددگار جگہیں',
    structuredSpacesDesc: 'سوشل میڈیا کے شور کے بغیر محفوظ گفتگو کے کمرے۔',
    growthCircles: 'ترقیاتی حلقے',
    growthCirclesDesc: 'نیند، تناؤ اور ذاتی ترقی کے لیے رہنمائی شدہ حلقے۔',
    viewAll: 'تمام دیکھیں',
    inTheMoment: 'اس لمحے میں',
    active: 'فعال',
    joinArrow: 'شامل ہوں →',

    // Room Titles & Descriptions
    'listen-space': 'مجھے کسی سننے والے کی ضرورت ہے',
    'listen-desc': 'بغیر کسی مشورے کے سنے جانے کی محفوظ جگہ۔',
    'lonely-space': 'تنہائی محسوس ہو رہی ہے',
    'lonely-desc': 'تنہائی کے احساس کے وقت پرسکون ساتھی۔',
    'academic-stress': 'تعلیمی اور امتحانی دباؤ',
    'academic-desc': 'ہوم ورک اور امتحانات کے دباؤ کو ساتھیوں کے ساتھ بانٹیں۔',
    'motivation-space': 'حوصلہ افزائی اور توجہ',
    'motivation-desc': 'پڑھائی اور کام پر توجہ دینے کے چھوٹے اہداف۔',
    'family-dynamics': 'خاندانی تعلقات اور حدود',
    'family-desc': 'خاندانی تناؤ اور حدود کو سنبھالنا۔',
    'general-venting': 'عام گفتگو',
    'general-desc': 'بغیر کسی ججمنٹ کے اپنی بات کہنا۔',
    'circle-sleep': 'حلقہ: نیند اور رات کی روٹین',
    'circle-sleep-desc': 'آرام دہ نیند کے معمولات۔',
    'circle-stress': 'حلقہ: تناؤ میں کمی',
    'circle-stress-desc': 'سانس کی مشقیں اور سکون۔',
    'circle-focus': 'حلقہ: توجہ اور محنت',
    'circle-focus-desc': 'کام پر توجہ مرکوز کرنے کی عادات۔',
    'circle-boundaries': 'حلقہ: ذاتی حدود',
    'circle-boundaries-desc': 'خود اعتمادی اور حدود کا تعین۔',

    // Sidebar Right Column
    supportListenerTitle: '1-آن-1 مددگار',
    supportListenerDesc: 'کسی تربیت یافتہ مددگار یا کونسلر سے نجی گفتگو شروع کریں۔',
    connectPrivately: 'نجی طور پر بات کریں',
    avgWait: 'اوسط انتظار: < 2 منٹ',
    findTherapist: 'تھراپسٹ تلاش کریں →',
    dailyWellbeing: 'روزانہ تندرستی',
    openTracker: 'ٹریکر کھولیں',
    missedDayQuote: '"ایک دن چھوٹ گیا؟ اس کا مطلب ہے کہ آپ نے اپنے لیے آرام کیا۔"',
    safePrivateTitle: 'محفوظ، نجی اور گمنام',
    safePrivateDesc: 'آپ کا ڈیٹا آپ کے مکمل کنٹرول میں ہے۔',
    needCrisisHelp: 'فوری مدد چاہیے؟ ابھی حاصل کریں →',

    // Settings
    languagePreference: 'زبان کی ترجیح',
    termsAndDisclaimers: 'شرائط و ضوابط اور ڈس کلیمر',
  },

  kn: {
    // Navigation
    home: 'ಮುಖಪುಟ',
    connect: 'ಸಂಪರ್ಕ',
    community: 'ಸಮುದಾಯ',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    wellbeing: 'ಯೋಗಕ್ಷೇಮ',
    helpNow: 'ತುರ್ತು ಸಹಾಯ',
    therapistPortal: 'ಥೆರಪಿಸ್ಟ್ ಪೋರ್ಟಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    signOut: 'ಸೈನ್ ಔಟ್',

    // Sanctuary Header
    sanctuaryBadge: 'ಸ್ವಯಂ ಜಾಗೃತಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಸ್ಥಳ',
    sanctuaryTitle: 'ನಿಮಗಾಗಿ ಒಂದು ಪ್ರಶಾಂತ ಸ್ಥಳ',
    sanctuarySubtitle: 'ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ಗಮನಿಸಿ, ಒಂದು ಸಣ್ಣ ಹೆಜ್ಜೆಯನ್ನು ಇರಿಸಿ, ಅಥವಾ ನಿಮ್ಮನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ಸ್ನೇಹಿತರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ.',
    
    // Haven Moment
    takeHavenMoment: 'ಹೇವನ್ ಕ್ಷಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    havenMomentDesc: 'ಒತ್ತಡ ಉಂಟಾದಾಗ, ಒಂದು ಸಣ್ಣ ಮುಂದಿನ ಹೆಜ್ಜೆಯ ಮೂಲಕ ನಾವು ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇವೆ.',
    havenMomentTag: 'ವಿಶೇಷ ಮರುಹೊಂದಿಸುವಿಕೆ',
    inTheMomentTag: 'ಈ ಕ್ಷಣದಲ್ಲಿ:',

    // Daily Check-In
    dailyCheckIn: 'ದೈನಂದಿನ ಚೆಕ್-ಇನ್ (1 ನಿಮಿಷ)',
    checkedInToday: 'ಇಂದು ಪೂರ್ಣಗೊಂಡಿದೆ',
    dailyResilience: 'ದೈನಂದಿನ ಚೇತರಿಕೆ',
    noPressureTag: 'ಒತ್ತಡವಿಲ್ಲ • ಸಣ್ಣ ಹೆಜ್ಜೆ',
    stepForToday: 'ಇಂದಿನ ಸಣ್ಣ ಹೆಜ್ಜೆ',
    fiveMins: '5 ನಿಮಿಷಗಳು',
    complete: 'ಪೂರ್ಣಗೊಳಿಸಿ',
    done: 'ಆಗಿದೆ',
    organizeDeskTitle: 'ನಿಮ್ಮ ಡೆಸ್ಕ್ ಅನ್ನು ಸರಿಪಡಿಸಿ',
    organizeDeskDesc: 'ನಿಮ್ಮ ಕೀಬೋರ್ಡ್ ಮುಂದಿನ ಜಾಗವನ್ನು ಮಾತ್ರ ಸ್ವಚ್ಛಗೊಳಿಸಿ. ಸಣ್ಣ ಕ್ರಮವು ಮಾನಸಿಕ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',

    // Patterns Over Time
    patternsOverTime: 'ನಿಮ್ಮ ಮಾದರಿಗಳು (ನೈಜ ಸಂಬಂಧಗಳು)',
    sleepStressTitle: 'ನಿದ್ರೆ ಮತ್ತು ಒತ್ತಡದ ಸಂಬಂಧ',
    sleepStressDesc: 'ನಿಮ್ಮ ನಿದ್ರೆ ಆಳವಾಗಿದ್ದಾಗ, ಮರುದಿನದ ಒತ್ತಡವು 42% ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
    communityConnTitle: 'ಸಮುದಾಯ ಸಂಪರ್ಕ',
    communityConnDesc: 'ಸಹಾಯ ಸ್ಥಳಗಳಲ್ಲಿ ಭಾಗವಹಿಸುವುದು ನಿಮ್ಮ ಒಂಟಿತನವನ್ನು ಕಡಿಮೆ ಮಾಡಿದೆ.',

    // Support Spaces
    structuredSpaces: 'ಸಹಾಯ ಸ್ಥಳಗಳು',
    structuredSpacesDesc: 'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮದ ಶಬ್ದವಿಲ್ಲದೆ ನೈಜ ಭಾವನೆಗಳಿಗಾಗಿ ಸುರಕ್ಷಿತ ಕೊಠಡಿಗಳು.',
    growthCircles: 'ಬೆಳವಣಿಗೆ ವಲಯಗಳು',
    growthCirclesDesc: 'ನಿದ್ರೆ, ಒತ್ತಡ ನಿರ್ವಹಣೆ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಸಮತೋಲನದ ಗುಂಪುಗಳು.',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    inTheMoment: 'ಈ ಕ್ಷಣದಲ್ಲಿ',
    active: 'ಸಕ್ರಿಯ',
    joinArrow: 'ಸೇರಿ →',

    // Room Titles & Descriptions
    'listen-space': 'ನನ್ನನ್ನು ಯಾರಾದರೂ ಕೇಳಬೇಕು',
    'listen-desc': 'ಯಾವುದೇ ಸಲಹೆಯಿಲ್ಲದೆ ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳುವ ಸುರಕ್ಷಿತ ಸ್ಥಳ.',
    'lonely-space': 'ಒಂಟಿತನ ಕಾಡುತ್ತಿದೆ',
    'lonely-desc': 'ಒಂಟಿತನ ಕಾಡಿದಾಗ ಶಾಂತ ಸ್ನೇಹಿತರ ಒಡನಾಟ.',
    'academic-stress': 'ಶಿಕ್ಷಣ ಮತ್ತು ಪರೀಕ್ಷಾ ಒತ್ತಡ',
    'academic-desc': 'ಪರೀಕ್ಷಾ ಆತಂಕ ಮತ್ತು ಒತ್ತಡವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    'motivation-space': 'ಪ್ರೇರಣೆ ಮತ್ತು ಸೌಮ್ಯ ಗಮನ',
    'motivation-desc': 'ಅಧ್ಯಯನದಲ್ಲಿ ಗಮನ ಕೇಂದ್ರೀಕರಿಸಲು ಸಣ್ಣ ಗುರಿಗಳು.',
    'family-dynamics': 'ಕುಟುಂಬ ಸಂಬಂಧಗಳು & ಗಡಿಗಳು',
    'family-desc': 'ಕುಟುಂಬದ ಒತ್ತಡ ಮತ್ತು ಗಡಿಗಳನ್ನು ನಿರ್ವಹಿಸುವುದು.',
    'general-venting': 'ಸಾಮಾನ್ಯ ಮುಕ್ತ ಮಾತು',
    'general-desc': 'ದೈನಂದಿನ ಬೇಸರವನ್ನು ಮುಕ್ತವಾಗಿ ವ್ಯಕ್ತಪಡಿಸಿ.',
    'circle-sleep': 'ವಲಯ: ನಿದ್ರೆ ಮತ್ತು ಸಂಜೆ ದಿನಚರಿ',
    'circle-sleep-desc': 'ಆರಾಮದಾಯಕ ನಿದ್ರೆಯ ಅಭ್ಯಾಸಗಳು.',
    'circle-stress': 'ವಲಯ: ಒತ್ತಡ ನಿವಾರಣೆ',
    'circle-stress-desc': 'ಉಸಿರಾಟದ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಶಾಂತಿ.',
    'circle-focus': 'ವಲಯ: ಗಮನ ಮತ್ತು ಶ್ರಮ',
    'circle-focus-desc': 'ಕೆಲಸದ ಮೇಲೆ ಗಮನ ಕೇಂದ್ರೀಕರಿಸುವ ಅಭ್ಯಾಸಗಳು.',
    'circle-boundaries': 'ವಲಯ: ವೈಯಕ್ತಿಕ ಗಡಿಗಳು',
    'circle-boundaries-desc': 'ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಗಡಿಗಳ ನಿರ್ಮಾಣ.',

    // Sidebar Right Column
    supportListenerTitle: '1-ಆನ್-1 ಕೇಳುಗ',
    supportListenerDesc: 'ತರಬೇತಿ ಪಡೆದ ಕೇಳುಗರು ಅಥವಾ ಆಪ್ತಸಮಾಲೋಚಕರೊಂದಿಗೆ ಖಾಸಗಿ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ.',
    connectPrivately: 'ಖಾಸಗಿಯಾಗಿ ಸಂಪರ್ಕಿಸಿ',
    avgWait: 'ಸರಾಸರಿ ಕಾಯುವಿಕೆ: < 2 ನಿಮಿಷ',
    findTherapist: 'ಥೆರಪಿಸ್ಟ್ ಹುಡುಕಿ →',
    dailyWellbeing: 'ದೈನಂದಿನ ಯೋಗಕ್ಷೇಮ',
    openTracker: 'ಟ್ರ್ಯಾಕರ್ ತೆರೆಯಿರಿ',
    missedDayQuote: '"ಒಂದು ದಿನ ತಪ್ಪಿಹೋಯಿತೇ? ನಿಮಗಾಗಿ ನೀವು ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ ಎಂದರ್ಥ."',
    safePrivateTitle: 'ಸುರಕ್ಷಿತ, ಖಾಸಗಿ ಮತ್ತು ಅನಾಮಧೇಯ',
    safePrivateDesc: 'ನಿಮ್ಮ ಡೇಟಾ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣದಲ್ಲಿದೆ.',
    needCrisisHelp: 'ತುರ್ತು ಸಹಾಯ ಬೇಕೇ? ತಕ್ಷಣ ಪಡೆಯಿರಿ →',

    // Settings
    languagePreference: 'ಭಾಷಾ ಆಯ್ಕೆ',
    termsAndDisclaimers: 'ನಿಯಮಗಳು ಮತ್ತು ಹಕ್ಕುತ್ಯಾಗ',
  },

  te: {
    // Navigation
    home: 'హోమ్',
    connect: 'కనెక్ట్',
    community: 'కమ్యూనిటీ',
    resources: 'వనరులు',
    wellbeing: 'ఆరోగ్యం',
    helpNow: 'తక్షణ సహాయం',
    therapistPortal: 'థెరపిస్ట్ పోర్టల్',
    settings: 'సెట్టింగ్‌లు',
    signOut: 'సైన్ అవుట్',

    // Sanctuary Header
    sanctuaryBadge: 'స్వీయ అవగాహన మరియు సురక్షిత ప్రదేశం',
    sanctuaryTitle: 'మీ కోసం ఒక ప్రశాంతమైన ప్రదేశం',
    sanctuarySubtitle: 'మీ భావాలను అర్థం చేసుకోండి, ఒక చిన్న అడుగు వేయండి, లేదా అర్థం చేసుకునే స్నేహితులతో మాట్లాడండి.',
    
    // Haven Moment
    takeHavenMoment: 'హేవెన్ మూమెంట్‌ను ప్రారంభించండి',
    havenMomentDesc: 'ఒత్తిడి పెరిగినప్పుడు, ఒక చిన్న తదుపరి దశ ద్వారా మేము మీకు మార్గనిర్దేశం చేస్తాము.',
    havenMomentTag: 'ప్రత్యేక రీసెట్',
    inTheMomentTag: 'ఈ క్షణంలో:',

    // Daily Check-In
    dailyCheckIn: 'రోజువారీ చెక్-ఇన్ (1 నిమిషం)',
    checkedInToday: 'ఈ రోజు పూర్తయింది',
    dailyResilience: 'రోజువారీ బలం',
    noPressureTag: 'ఒత్తిడి లేదు • చిన్న అడుగు',
    stepForToday: 'ఈ రోజు చిన్న అడుగు',
    fiveMins: '5 నిమిషాలు',
    complete: 'పూర్తి చేయండి',
    done: 'పూర్తయింది',
    organizeDeskTitle: 'మీ డెస్క్‌ను సర్దుకోండి',
    organizeDeskDesc: 'మీ కీబోర్డ్ ముందు ఉన్న భాగాన్ని మాత్రమే శుభ్రం చేయండి. చిన్న క్రమం మానసిక ఒత్తిడిని తగ్గిస్తుంది.',

    // Patterns Over Time
    patternsOverTime: 'మీ నమూనాలు (నిజమైన సంబంధాలు)',
    sleepStressTitle: 'నిద్ర మరియు ఒత్తిడి సంబంధం',
    sleepStressDesc: 'మీ నిద్ర గాఢంగా ఉన్నప్పుడు, తర్వాతి రోజు ఒత్తిడి 42% తగ్గుతుంది.',
    communityConnTitle: 'కమ్యూనిటీ కనెక్షన్',
    communityConnDesc: 'సహాయక గదుల్లో పాల్గొనడం ఒంటరితనాన్ని తగ్గించింది.',

    // Support Spaces
    structuredSpaces: 'సహాయక ప్రదేశాలు',
    structuredSpacesDesc: 'సోషల్ మీడియా గందరగోళం లేకుండా నిజమైన భావాల కోసం సురక్షిత గదులు.',
    growthCircles: 'వృద్ధి సర్కిల్స్',
    growthCirclesDesc: 'నిద్ర, ఒత్తిడి తగ్గింపు మరియు మానసిక సమతుల్యత కోసం సమూహాలు.',
    viewAll: 'అన్నీ చూడండి',
    inTheMoment: 'ఈ క్షణంలో',
    active: 'యాక్టివ్',
    joinArrow: 'చేరండి →',

    // Room Titles & Descriptions
    'listen-space': 'నా మాట వినేవారు కావాలి',
    'listen-desc': 'ఎలాంటి సలహాలు లేకుండా మీ మాట వినే సురక్షిత ప్రదేశం.',
    'lonely-space': 'ఒంటరిగా అనిపిస్తోంది',
    'lonely-desc': 'ఒంటరిగా అనిపించినప్పుడు ప్రశాంత స్నేహితుల సాంగత్యం.',
    'academic-stress': 'చదువు మరియు పరీక్షల ఒత్తిడి',
    'academic-desc': 'హోమ్‌వర్క్ మరియు పరీక్షల ఒత్తిడిని స్నేహితులతో పంచుకోండి.',
    'motivation-space': 'ప్రేరణ మరియు శ్రద్ధ',
    'motivation-desc': 'చదువుపై దృష్టి పెట్టడానికి చిన్న లక్ష్యాలు.',
    'family-dynamics': 'కుటుంబ సంబంధాలు & సరిహద్దులు',
    'family-desc': 'కుటుంబ ఒత్తిళ్లు మరియు సరిహద్దులను నిర్వహించడం.',
    'general-venting': 'సాధారణ సంభాషణ',
    'general-desc': 'ఎలాంటి జడ్జ్‌మెంట్ లేకుండా మీ బాధలను పంచుకోండి.',
    'circle-sleep': 'సర్కిల్: నిద్ర మరియు రాత్రి దినచర్య',
    'circle-sleep-desc': 'ప్రశాంతమైన నిద్ర అలవాట్లు.',
    'circle-stress': 'సర్కిల్: ఒత్తిడి తగ్గింపు',
    'circle-stress-desc': 'శ్వాస వ్యాయామాలు మరియు ప్రశాంతత.',
    'circle-focus': 'సర్కిల్: ఏకాగ్రత మరియు శ్రమ',
    'circle-focus-desc': 'పనిపై శ్రద్ధ పెట్టే అలవాట్లు.',
    'circle-boundaries': 'సర్కిల్: వ్యక్తిగత సరిహద్దులు',
    'circle-boundaries-desc': 'ఆత్మవిశ్వాసం మరియు సరిహద్దుల నిర్మాణం.',

    // Sidebar Right Column
    supportListenerTitle: '1-ఆన్-1 వినేవారు',
    supportListenerDesc: 'శిక్షణ పొందిన వినేవారు లేదా కౌన్సిలర్‌తో ప్రైవేట్ సంభాషణ ప్రారంభించండి.',
    connectPrivately: 'వ్యక్తిగతంగా మాట్లాడండి',
    avgWait: 'సగటు నిరీక్షణ: < 2 నిమిషాలు',
    findTherapist: 'థెరపిస్ట్‌ను కనుగొనండి →',
    dailyWellbeing: 'రోజువారీ ఆరోగ్యం',
    openTracker: 'ట్రాకర్ తెరవండి',
    missedDayQuote: '"ఒక రోజు తప్పిపోయిందా? మీ కోసం మీరు విశ్రాంతి తీసుకున్నారని అర్థం."',
    safePrivateTitle: 'సురక్షితం, ప్రైవేట్ మరియు అనామకం',
    safePrivateDesc: 'మీ డేటా మీ పూర్తి నియంత్రణలో ఉంటుంది.',
    needCrisisHelp: 'అత్యవసర సహాయం కావాలా? ఇప్పుడే పొందండి →',

    // Settings
    languagePreference: 'భాష ప్రాధాన్యత',
    termsAndDisclaimers: 'నిబంధనలు మరియు నిరాకరణ',
  }
};

export const getTranslation = (lang: SupportedLanguage = 'en', key: string, fallback?: string): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || fallback || key;
};
