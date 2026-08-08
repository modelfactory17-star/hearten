// POST /api/seed - One-time seed demo posts
// Delete this file after use
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = createClient();

  // Get first user
  const { data: profiles } = await supabase.from('profiles').select('id, username').limit(1);
  if (!profiles || profiles.length === 0) {
    return Response.json({ error: 'No users found. Register first.' }, { status: 400 });
  }
  const userId = profiles[0].id;

  const posts = [
    { emoji: '😔', title: '男朋友成日已讀不回，係咪即係唔愛我？', preview: '我同男朋友一齊咗半年，最近佢成日已讀不回，幾個鐘先覆一次。我問佢係咪唔想理我，佢又話係我諗多咗...我真係好攰，唔知點算好。', body: '我同男朋友一齊咗半年，最初佢好 sweet，msg 幾乎秒回。但近兩個月佢成日已讀不回，有時成四五個鐘先覆一句「返緊工」、「忙緊」。\n\n我問過佢係咪唔想理我，佢每次都話係我諗多咗，佢只係忙。但我見到佢 IG 有 online，仲有 like 其他人嘅 post...\n\n我知自己可能係 overthink，但每次見到「已讀」兩個字，個心就好唔舒服。', category: '💔 分手復合', category_id: 'breakup' },
    { emoji: '🌍', title: '遠距離戀愛 — 英國 vs 香港，8 個鐘時差點維持？', preview: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘...', body: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘。我同佢一齊咗兩年，佢走之前應承我會每日 video call，但而家一個星期都未必有一次。佢話佢忙學業、忙識新朋友，叫我俾啲空間佢。我明佢需要適應新環境，但我哋嘅關係好似愈嚟愈疏遠。有時 send 個 msg 俾佢，佢隔咗半日先覆。long d 係咪真係咁難維持？', category: '💕 暗戀 · 表白', category_id: 'crush' },
    { emoji: '💔', title: '發現佢電話有第二個女仔嘅曖昧訊息', preview: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到...係一個叫 Tracy 嘅女仔 send 嚟嘅。', body: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到。係一個叫「Tracy❤️」嘅女仔 send 嚟嘅，內容係「今日好開心，多謝你陪我 ❤️」。\n\n我個心即刻涼咗一半。我唔係故意偷睇佢電話，但呢個 msg 我真係冇辦法當睇唔到。我同佢一齊咗三年，從來冇懷疑過佢。而家成個人都好亂，唔知應唔應該出聲問佢。有冇人試過類似情況？', category: '💔 分手復合', category_id: 'breakup' },
    { emoji: '😔', title: '30歲仲未拍過拖，覺得自己好失敗', preview: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過...', body: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題，定係緣份未到。我唔係醜樣，有穩定工作，性格都算開朗。但唔知點解，每次識到新朋友，都唔會發展到下一步。最近公司有個女同事對我好好，但我完全唔知點樣表達自己嘅感覺。有時夜晚諗起會喊，覺得自己好失敗。想問下有冇過來人可以俾啲意見？', category: '🌳 心靈樹窿', category_id: 'treehole' },
    { emoji: '💍', title: '結婚 5 年，老公話對我冇咗感覺', preview: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」', body: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」我好崩潰。我哋一齊咗八年，結婚五年。我以為我哋嘅感情好穩定，冇諗過原來佢一直都有呢種感覺。佢話唔係有第三者，只係覺得大家之間冇咗火花。我唔知點面對。小朋友點算？我哋係咪要離婚？定係仲有得挽救？', category: '💍 婚姻關係', category_id: 'marriage' },
    { emoji: '🌈', title: '出櫃之後，屋企人話要斷絕關係', preview: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔...', body: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔，阿媽日日喊。我已經 26 歲，做緊嘢，經濟獨立。我以為咁樣會令佢哋容易接受啲，但佢哋嘅反應仲係好大。我知道我做嘅嘢冇錯。我係同性戀，呢個係事實。但有冇其他 LGBTQ+ 嘅朋友經歷過類似嘅事？你哋點樣面對屋企人？', category: '🌈 LGBTQ+ 社群', category_id: 'lgbtq' },
    { emoji: '🃏', title: '塔羅話我今年會遇到真命天子，但係...', preview: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦...', body: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象。我知好多人話塔羅唔準，但師傅講中咗我好多嘢。佢話 the one 係一個從事創意行業嘅男仔，會喺工作場合認識。而家每日返工都會留意身邊嘅人，但完全冇感覺。你哋信唔信塔羅呢？有冇人試過俾塔羅講中？', category: '🃏 塔羅占卜', category_id: 'tarot' },
  ];

  const results = [];
  for (const post of posts) {
    const { error } = await supabase.from('posts').insert({ user_id: userId, title: post.title, preview: post.preview, body: post.body, category: post.category, category_id: post.category_id });
    results.push(error ? `❌ ${post.title}: ${error.message}` : `✅ ${post.title}`);
  }

  return Response.json({ seeded: results.length, results });
}
