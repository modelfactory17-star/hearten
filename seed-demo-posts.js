// seed-demo-posts.js - One-time script to seed demo posts into Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const demoPosts = [
  {
    emoji: '😔',
    title: '男朋友成日已讀不回，係咪即係唔愛我？',
    preview: '我同男朋友一齊咗半年，最近佢成日已讀不回，幾個鐘先覆一次。我問佢係咪唔想理我，佢又話係我諗多咗...我真係好攰，唔知點算好。',
    body: '我同男朋友一齊咗半年，最初佢好 sweet，msg 幾乎秒回。但近兩個月佢成日已讀不回，有時成四五個鐘先覆一句「返緊工」、「忙緊」。\n\n我問過佢係咪唔想理我，佢每次都話係我諗多咗，佢只係忙。但我見到佢 IG 有 online，仲有 like 其他人嘅 post...\n\n我知自己可能係 overthink，但每次見到「已讀」兩個字，個心就好唔舒服。\n\n我唔敢再問佢，怕佢覺得我煩。但我真係好攰，每晚都瞓唔著。',
    category: '💔 分手復合',
    category_id: 'breakup',
  },
  {
    emoji: '🌍',
    title: '遠距離戀愛 — 英國 vs 香港，8 個鐘時差點維持？',
    preview: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘，慢慢覺得佢好似離我愈嚟愈遠...',
    body: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘。\n\n我同佢一齊咗兩年，佢走之前應承我會每日 video call，但而家一個星期都未必有一次。佢話佢忙學業、忙識新朋友，叫我俾啲空間佢。\n\n我明佢需要適應新環境，但我哋嘅關係好似愈嚟愈疏遠。有時 send 個 msg 俾佢，佢隔咗半日先覆。\n\n我想問問大家：long d 係咪真係咁難維持？定係我太依賴佢？',
    category: '💕 暗戀 · 表白',
    category_id: 'crush',
  },
  {
    emoji: '💔',
    title: '發現佢電話有第二個女仔嘅曖昧訊息',
    preview: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到...係一個叫「Tracy❤️」嘅女仔 send 嚟嘅。',
    body: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到。係一個叫「Tracy❤️」嘅女仔 send 嚟嘅，內容係「今日好開心，多謝你陪我 ❤️」。\n\n我個心即刻涼咗一半。我唔係故意偷睇佢電話，但呢個 msg 我真係冇辦法當睇唔到。\n\n我同佢一齊咗三年，從來冇懷疑過佢。而家成個人都好亂，唔知應唔應該出聲問佢。如果問咗，佢會唔會覺得我唔信佢？但如果唔問，我會唔會越諗越多？\n\n有冇人試過類似情況？可以點處理？',
    category: '💔 分手復合',
    category_id: 'breakup',
  },
  {
    emoji: '😔',
    title: '30歲仲未拍過拖，覺得自己好失敗',
    preview: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題...',
    body: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題，定係緣份未到。\n\n我唔係醜樣，有穩定工作，性格都算開朗。但唔知點解，每次識到新朋友，都唔會發展到下一步。\n\n最近公司有個女同事對我好好，但我完全唔知點樣表達自己嘅感覺。成日驚做錯嘢、講錯嘢。\n\n有時夜晚諗起會喊，覺得自己好失敗。想問下有冇過來人可以俾啲意見？',
    category: '🌳 心靈樹窿',
    category_id: 'treehole',
  },
  {
    emoji: '💍',
    title: '結婚 5 年，老公話對我冇咗感覺',
    preview: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」我好崩潰...',
    body: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」\n\n我好崩潰。我哋一齊咗八年，結婚五年。我以為我哋嘅感情好穩定，冇諗過原來佢一直都有呢種感覺。\n\n佢話唔係有第三者，只係覺得大家之間冇咗火花，變咗好似室友咁。佢話佢仲好錫小朋友，但對我嘅感覺唔同咗。\n\n我唔知點面對。小朋友點算？我哋係咪要離婚？定係仲有得挽救？我好迷茫...',
    category: '💍 婚姻關係',
    category_id: 'marriage',
  },
  {
    emoji: '🌈',
    title: '出櫃之後，屋企人話要斷絕關係',
    preview: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔...',
    body: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔，阿媽日日喊。\n\n我已經 26 歲，做緊嘢，經濟獨立。我以為咁樣會令佢哋容易接受啲，但佢哋嘅反應仲係好大。\n\n我知道我做嘅嘢冇錯。我係同性戀，呢個係事實，唔係我揀嘅。但見到佢哋咁傷心，個心真係好痛。\n\n有冇其他 LGBTQ+ 嘅朋友經歷過類似嘅事？你哋點樣面對屋企人？',
    category: '🌈 LGBTQ+ 社群',
    category_id: 'lgbtq',
  },
  {
    emoji: '🃏',
    title: '塔羅話我今年會遇到真命天子，但係...',
    preview: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象...',
    body: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象。\n\n我知好多人話塔羅唔準，但師傅講中咗我好多嘢，搞到我好信佢。佢話 the one 係一個從事創意行業嘅男仔，會喺工作場合認識。\n\n而家每日返工都會留意身邊嘅人，但完全冇感覺。開始懷疑係咪我太心急？定係真係會有呢個人出現？\n\n你哋信唔信塔羅呢？有冇人試過俾塔羅講中？',
    category: '🃏 塔羅占卜',
    category_id: 'tarot',
  },
];

async function seed() {
  // Get existing users
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id, username');

  if (profileErr || !profiles || profiles.length === 0) {
    console.error('No profiles found. Please register a user first.');
    console.error('Error:', profileErr);
    process.exit(1);
  }

  console.log(`Found ${profiles.length} users. Using first user: ${profiles[0].username}`);

  const userId = profiles[0].id;

  // Insert posts
  for (const post of demoPosts) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        emoji: post.emoji,
        title: post.title,
        preview: post.preview,
        body: post.body,
        category: post.category,
        category_id: post.category_id,
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert "${post.title}":`, error.message);
    } else {
      console.log(`✅ Created: ${post.title}`);
    }

    // Small delay to get different timestamps
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\nDone! All posts seeded.');
}

seed().catch(e => {
  console.error('Seed failed:', e);
  process.exit(1);
});
