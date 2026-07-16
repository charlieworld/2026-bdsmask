/**
 * 匿名身分工具。所有函式都存取 localStorage / crypto，只能在 client 端呼叫
 * （useEffect 或事件 handler 內）。prerender 期間不要碰。
 */

const VOTER_KEY = "ask2026_voter_id";
const NICK_KEY = "ask2026_nickname";
const HUE_KEY = "ask2026_hue";

/** 取得（或建立）此瀏覽器的匿名 voter id，存於 localStorage。 */
export function getVoterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

const ADJECTIVES = [
  "性感的",
  "高貴的",
  "傲嬌的",
  "深情的",
  "悲壯的",
  "華麗的",
  "神聖的",
  "憂鬱的",
  "狂野的",
  "霸氣的",
  "浪漫的",
  "危險的",
  "尊爵的",
  "冷豔的",
  "熱血的",
  "優雅的",
  "犀利的",
  "迷幻的",
  "復古的",
  "頹廢的",
  "佛系的",
  "中二的",
  "社畜的",
  "精緻的",
  "樸實的",
  "深沉的",
  "純情的",
  "暴走的",
  "治癒的",
  "傳說中的",
  "究極的",
  "隱藏版的",
  "限量版的",
  "手工的",
  "天選的",
  "魅惑的",
  "奢華的",
  "狂放的",
  "憂傷的",
  "孤傲的",
  "熱情的",
  "火辣的",
  "妖豔的",
  "慵懶的",
  "神祕的",
  "執著的",
  "逆天的",
  "狂霸的",
  "尊貴的",
  "深邃的",
  "燦爛的",
  "傲慢的",
  "溫暖的",
  "帥氣的",
  "甜美的",
  "高冷的",
  "狂熱的",
  "內斂的",
  "奔放的",
  "灑脫的",
  "沉穩的",
  "驚豔的",
  "磅礴的",
  "極致的",
  "撩人的",
];

const NOUNS = [
  "微波爐",
  "電風扇",
  "拖鞋",
  "衛生紙",
  "滷味攤",
  "資源回收桶",
  "電線桿",
  "麻辣燙",
  "老鼠夾",
  "除濕機",
  "洗衣機",
  "檳榔攤",
  "大同電鍋",
  "熱水瓶",
  "蚊香",
  "電蚊拍",
  "曬衣架",
  "便利貼",
  "迴紋針",
  "訂書機",
  "橡皮筋",
  "螺絲起子",
  "菜瓜布",
  "垃圾桶",
  "路由器",
  "延長線",
  "遙控器",
  "電池",
  "塑膠袋",
  "保鮮膜",
  "洗碗精",
  "掃把",
  "畚箕",
  "拖把",
  "電鍋",
  "熱狗",
  "御飯糰",
  "茶葉蛋",
  "涼麵",
  "豆漿",
  "燒餅油條",
  "珍珠奶茶",
  "滷蛋",
  "關東煮",
  "麻糬",
  "麻布袋",
  "電蒸鍋",
  "蚵仔煎",
  "大腸包小腸",
  "臭豆腐",
  "鹽酥雞",
  "雞排",
  "刈包",
  "肉圓",
  "蘿蔔糕",
  "蔥油餅",
  "碗粿",
  "胡椒餅",
  "豬血糕",
  "甜不辣",
  "小貓",
  "小狗",
  "兔子",
  "倉鼠",
  "水豚",
  "柴犬",
  "貓熊",
  "浣熊",
  "水獺",
  "刺蝟",
  "樹懶",
  "羊駝",
  "企鵝",
  "海豹",
  "松鼠",
  "小鹿",
  "柯基",
  "龍貓",
  "海獺",
  "小雞",
];

/** 產生隨機趣味暱稱，形容詞與名詞反差越大越好笑，如「性感的微波爐」。 */
export function randomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

/** 取得暱稱：localStorage 有就用，沒有則產生隨機暱稱並存回。 */
export function getNickname(): string {
  let nick = localStorage.getItem(NICK_KEY);
  if (!nick) {
    nick = randomNickname();
    localStorage.setItem(NICK_KEY, nick);
  }
  return nick;
}

/** 更新暱稱並存回 localStorage。 */
export function setNickname(nick: string): void {
  localStorage.setItem(NICK_KEY, nick);
}

/** 取得暱稱顏色拉桿值（0–100），localStorage 沒有則預設 0。 */
export function getHue(): number {
  const raw = localStorage.getItem(HUE_KEY);
  if (raw === null) return 0;
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

/** 更新暱稱顏色拉桿值並存回 localStorage。 */
export function setHue(hue: number): void {
  localStorage.setItem(HUE_KEY, String(hue));
}
