export interface Post {
  id: string;
  emoji: string;
  title: string;
  body: string;
  preview: string;
  category: string;
  categoryId: string;
  hearts: number;
  replies: number;
  time: string;
  anonymous: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;       // for user-generated nested replies
  emoji: string;
  anonymous: string;
  body: string;
  time: string;
  hearts: number;
  isOP: boolean;
  replies: Comment[];
}

export const posts: Post[] = [
  {
    id: '1',
    emoji: '😔',
    title: '男朋友成日已讀不回，係咪即係唔愛我？',
    preview: '我同男朋友一齊咗半年，最近佢成日已讀不回，幾個鐘先覆一次。我問佢係咪唔想理我，佢又話係我諗多咗...我真係好攰，唔知點算好。',
    body: `我同男朋友一齊咗半年，最初佢好 sweet，msg 幾乎秒回。但近兩個月佢成日已讀不回，有時成四五個鐘先覆一句「返緊工」、「忙緊」。

我問過佢係咪唔想理我，佢每次都話係我諗多咗，佢只係忙。但我見到佢 IG 有 online，仲有 like 其他人嘅 post...

我知自己可能係 overthink，但每次見到「已讀」兩個字，個心就好唔舒服。成日諗係咪我做錯咗咩？定係佢已經冇咁愛我？

我唔敢再問佢，怕佢覺得我煩。但我真係好攰，每晚都瞓唔著。

有冇人試過類似情況？可以點處理？`,
    category: '💔 分手復合',
    categoryId: 'breakup',
    hearts: 42,
    replies: 18,
    time: '2 小時前',
    anonymous: '匿名小熊',
  },
  {
    id: '2',
    emoji: '🌍',
    title: '遠距離戀愛 — 英國 vs 香港，8 個鐘時差點維持？',
    preview: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘，慢慢覺得佢好似離我愈嚟愈遠...大家有冇試過 long d？',
    body: `男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘，慢慢覺得佢好似離我愈嚟愈遠...大家有冇試過 long d？`,
    category: '💕 暗戀 · 表白',
    categoryId: 'crush',
    hearts: 67,
    replies: 34,
    time: '5 小時前',
    anonymous: '倫敦的月光',
  },
  {
    id: '3',
    emoji: '💔',
    title: '發現佢電話有第二個女仔嘅曖昧訊息',
    preview: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到...係一個叫「Tracy❤️」嘅女仔 send 嚟嘅。我個心即刻涼咗一半，唔知應唔應該出聲...',
    body: `噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到...係一個叫「Tracy❤️」嘅女仔 send 嚟嘅。我個心即刻涼咗一半，唔知應唔應該出聲...`,
    category: '💔 分手復合',
    categoryId: 'breakup',
    hearts: 128,
    replies: 56,
    time: '8 小時前',
    anonymous: '心碎的魚',
  },
  {
    id: '4',
    emoji: '😔',
    title: '30歲仲係處男/女，覺得自己好失敗',
    preview: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題，定係緣份未到...有時夜晚諗起會喊。',
    body: `身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題，定係緣份未到...有時夜晚諗起會喊。`,
    category: '🌳 心靈樹窿',
    categoryId: 'treehole',
    hearts: 89,
    replies: 47,
    time: '12 小時前',
    anonymous: '深夜咖啡',
  },
  {
    id: '5',
    emoji: '💍',
    title: '結婚 5 年，老公話對我冇咗感覺',
    preview: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」我好崩潰，唔知點面對...小朋友點算...',
    body: `我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」我好崩潰，唔知點面對...小朋友點算...`,
    category: '💍 婚姻關係',
    categoryId: 'marriage',
    hearts: 203,
    replies: 89,
    time: '1 日前',
    anonymous: '迷失的媽媽',
  },
  {
    id: '6',
    emoji: '🌈',
    title: '出櫃之後，屋企人話要斷絕關係',
    preview: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔，阿媽日日喊。我知我做嘅嘢冇錯，但個心真係好痛...',
    body: `上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔，阿媽日日喊。我知我做嘅嘢冇錯，但個心真係好痛...`,
    category: '🌈 LGBTQ+ 社群',
    categoryId: 'lgbtq',
    hearts: 312,
    replies: 124,
    time: '1 日前',
    anonymous: '彩虹下的我',
  },
  {
    id: '7',
    emoji: '🃏',
    title: '塔羅話我今年會遇到真命天子，但係...',
    preview: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象...係咪我太心急？定係塔羅唔準？',
    body: `搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象...係咪我太心急？定係塔羅唔準？`,
    category: '🃏 塔羅占卜',
    categoryId: 'tarot',
    hearts: 45,
    replies: 22,
    time: '2 日前',
    anonymous: '等愛的玫瑰',
  },
];

export const comments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    emoji: '🐱',
    anonymous: '月光下的貓',
    body: '我明你感受！之前我男朋友都係咁，後來發現原來佢真係只係忙，但我同佢傾完之後，佢開始會主動話俾我知佢幾時忙、幾時得閒。溝通真係好重要，唔好自己亂諗。',
    time: '1 小時前',
    hearts: 23,
    isOP: false,
    replies: [
      {
        id: 'c1r1',
        postId: '1',
        emoji: '🐻',
        anonymous: '匿名小熊',
        body: '多謝你嘅建議...我都知應該要傾，但又怕佢覺得我煩 😢 你嗰陣點樣開口㗎？',
        time: '45 分鐘前',
        hearts: 8,
        isOP: true,
        replies: [
          {
            id: 'c1r1r1',
            postId: '1',
            emoji: '🐱',
            anonymous: '月光下的貓',
            body: '我冇直接話「你做咩唔覆我」，而係話「我有啲擔心你，可以定個時間每日傾一陣嗎？」咁樣佢唔會覺得被指責，反而覺得你關心佢 💕',
            time: '30 分鐘前',
            hearts: 15,
            isOP: false,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    postId: '1',
    emoji: '🍋',
    anonymous: '檸檬茶走甜',
    body: '佢 online 但唔覆你 msg？呢個係 red flag 嚟㗎。唔係話一定有事，但至少證明你喺佢 priority list 唔係最高。半年就咁樣，你自己諗清楚值唔值得。',
    time: '1 小時前',
    hearts: 42,
    isOP: false,
    replies: [],
  },
  {
    id: 'c3',
    postId: '1',
    emoji: '🌊',
    anonymous: '維港的風',
    body: '我有類似經歷，最後發現佢原來一直同 ex 有聯絡。唔係嚇你，但建議你留意多啲。不過都唔好一口咬定，觀察下先。',
    time: '55 分鐘前',
    hearts: 18,
    isOP: false,
    replies: [],
  },
  {
    id: 'c4',
    postId: '3',
    emoji: '🐱',
    anonymous: '月光下的貓',
    body: 'Tracy❤️？個名仲要加心心 emoji...樓主你絕對有權出聲問清楚。唔好啞忍，呢啲嘢拖得愈耐愈傷。',
    time: '6 小時前',
    hearts: 56,
    isOP: false,
    replies: [],
  },
  {
    id: 'c5',
    postId: '3',
    emoji: '🚌',
    anonymous: '深夜巴士',
    body: '唔好衝動住。一係你直接問佢「Tracy係邊個」，睇佢反應。如果佢即刻發脾氣或者兜大圈，咁你就知答案。',
    time: '5 小時前',
    hearts: 34,
    isOP: false,
    replies: [],
  },
];

export interface User {
  id: string;
  emoji: string;
  name: string;
  bio: string;
  status: string; // 感情狀態
  joined: string;
  posts_count: number;
  comments_count: number;
  hearts_received: number;
}

export const users: User[] = [
  {
    id: 'user1',
    emoji: '🐱',
    name: '月光下的貓',
    bio: '失戀中，但相信明天會更好',
    status: '單身',
    joined: '2024年8月',
    posts_count: 32,
    comments_count: 156,
    hearts_received: 1248,
  },
  {
    id: 'user2',
    emoji: '🍋',
    name: '檸檬茶走甜',
    bio: '愛情唔係必需品，係調味料',
    status: '單身',
    joined: '2024年7月',
    posts_count: 19,
    comments_count: 87,
    hearts_received: 643,
  },
  {
    id: 'user3',
    emoji: '🌊',
    name: '維港的風',
    bio: '聽咗好多故事，今次輪到我講',
    status: '戀愛中',
    joined: '2024年6月',
    posts_count: 17,
    comments_count: 92,
    hearts_received: 891,
  },
  {
    id: 'user4',
    emoji: '🐻',
    name: '匿名小熊',
    bio: '匿埋喺樹窿嘅小熊',
    status: '戀愛中',
    joined: '2024年9月',
    posts_count: 8,
    comments_count: 23,
    hearts_received: 256,
  },
  {
    id: 'user5',
    emoji: '🚌',
    name: '深夜巴士',
    bio: '搭緊深夜巴士嘅人',
    status: '單身',
    joined: '2024年5月',
    posts_count: 15,
    comments_count: 67,
    hearts_received: 432,
  },
];

export function getUserByName(name: string): User | undefined {
  return users.find((u) => u.name === name);
}
