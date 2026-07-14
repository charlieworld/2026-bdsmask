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
  "熱血的",
  "溫柔的",
  "神祕的",
  "調皮的",
  "優雅的",
  "勇敢的",
  "慵懶的",
  "好奇的",
  "閃亮的",
  "淡定的",
  "傲嬌的",
  "毛茸茸的",
  "自由的",
  "睏睏的",
  "元氣的",
];

const ANIMALS = [
  "長頸鹿",
  "水獺",
  "貓頭鷹",
  "刺蝟",
  "海豚",
  "樹懶",
  "狐狸",
  "企鵝",
  "浣熊",
  "羊駝",
  "章魚",
  "柴犬",
  "貓咪",
  "兔子",
  "鯨魚",
];

/** 產生隨機趣味暱稱，如「熱血的長頸鹿」。 */
export function randomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
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
