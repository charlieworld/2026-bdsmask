import type { Route } from "./+types/agenda";

export const meta: Route.MetaFunction = () => [
  { title: "議程 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
  {
    name: "description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 議程",
  },
  { property: "og:title", content: "議程 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
  {
    property: "og:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 議程",
  },
  { property: "og:url", content: "https://bdsmask.org/agenda" },
  { name: "twitter:title", content: "議程 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
  {
    name: "twitter:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 議程",
  },
];

type Slot = { time: string; label: string; dim?: boolean };

function AgendaRow({ time, label, dim, wide }: Slot & { wide?: boolean }) {
  const width = wide ? "w-24 sm:w-28" : "w-16 sm:w-20";
  return (
    <div className="flex gap-4 sm:gap-6 py-3 border-b accent-border last:border-0">
      <span
        className={`${width} shrink-0 font-bold ${
          dim ? "text-gray-400" : "text-gray-900"
        } text-sm sm:text-base tabular-nums`}
      >
        {time}
      </span>
      <span
        className={`${
          dim ? "text-gray-400" : "text-gray-800"
        } text-sm sm:text-base leading-relaxed`}
      >
        {label}
      </span>
    </div>
  );
}

const day1: Slot[] = [
  { time: "08:30", label: "報到", dim: true },
  { time: "09:00", label: "開調（會議規則、安全介紹）" },
  {
    time: "09:10",
    label:
      "【靶子論文＋評論】從抵抗「禁羈恐懼症」、「香草常規性」到批判「禁羈常規性」：臺灣 BDSM 與禁羈研究的現況及未來可能性",
  },
  { time: "10:35", label: "早場咖啡餐敘", dim: true },
  { time: "10:45", label: "【禁羈社群自主規範與法律之辯證關係】" },
  { time: "12:10", label: "午餐，開吃！", dim: true },
  { time: "13:00", label: "【身心障礙與禁羈情欲的交織認同和實踐】" },
  { time: "14:20", label: "下午茶點", dim: true },
  { time: "14:30", label: "【禁羈實踐與風險】" },
  { time: "15:30", label: "【論壇】臺灣禁羈空間的發展及其與社群文化之關係" },
  { time: "16:30", label: "第一天綜合討論：Open Mic!" },
  { time: "18:00", label: "交流派對 After Party", dim: true },
];

const day2: Slot[] = [
  { time: "08:30", label: "報到", dim: true },
  { time: "09:00", label: "【禁羈研究的現況與未來：在地知識生成、權力與助人行動】" },
  { time: "10:00", label: "早場咖啡餐敘", dim: true },
  { time: "10:15", label: "【電影、文學、文化展演中的禁羈愛欲與主體形構】" },
  { time: "12:10", label: "午餐時間", dim: true },
  { time: "13:00", label: "【禁羈認同化的歷程與流變】" },
  { time: "14:20", label: "大會報告：換場之後的論壇與分組討論進行方式" },
  { time: "14:30", label: "下午茶點（一）", dim: true },
  { time: "14:40", label: "【環遊禁羈多重宇宙】分組主題討論" },
  { time: "16:00", label: "下午茶點（二）整理思緒、想像下一步行動", dim: true },
  {
    time: "16:15",
    label:
      "第二天的綜合討論：綜整議題、釐清差異，討論未來兩年禁羈研究發表出版、集體行動與實踐的各種可能性。",
  },
  { time: "17:00", label: "學術調教結束，下次再會！" },
];

const liveDay1: Slot[] = [
  { time: "08:30-09:00", label: "報到", dim: true },
  { time: "09:00-09:10", label: "開調（會議規則、安全介紹）" },
  {
    time: "09:10-10:35",
    label:
      "【靶子論文＋評論】從抵抗「禁羈恐懼症」、「香草常規性」到批判「禁羈常規性」：臺灣 BDSM 與禁羈研究的現況及未來可能性",
  },
  { time: "10:45-12:00", label: "【禁羈社群自主規範與法律之辯證關係】" },
  { time: "13:40-14:20", label: "【身心障礙與禁羈情欲的交織認同和實踐 二】" },
  { time: "14:30-15:00", label: "【禁羈實踐與風險一】" },
];

const liveDay2: Slot[] = [
  { time: "08:30-09:00", label: "報到", dim: true },
  { time: "09:30-10:00", label: "【禁羈研究的現況與未來：在地知識生成、權力與助人行動】" },
  { time: "10:15-12:00", label: "【電影、文學、文化展演中的禁羈愛欲與主體形構】" },
  { time: "13:00-14:20", label: "【禁羈認同化的歷程與流變】" },
  { time: "14:40-16:00", label: "【環遊禁羈多重宇宙】分組主題討論（線上版）" },
  {
    time: "16:15-17:00",
    label:
      "第二天的綜合討論：綜整議題、釐清差異，討論未來兩年禁羈研究發表出版、集體行動與實踐的各種可能性。",
  },
  { time: "17:00", label: "學術調教結束，下次再會！" },
];

function DayCard({
  accent,
  badge,
  date,
  slots,
  wide,
}: {
  accent: "emerald" | "orange";
  badge: string;
  date: string;
  slots: Slot[];
  wide?: boolean;
}) {
  const border =
    accent === "emerald" ? "border-emerald-600" : "border-orange-500";
  const badgeBg = accent === "emerald" ? "bg-emerald-600" : "bg-orange-500";
  return (
    <div
      className={`border-t-4 ${border} bg-white shadow-sm border accent-border p-6 sm:p-8`}
    >
      <div className="flex items-baseline gap-3 mb-6">
        <span className={`${badgeBg} text-white font-bold px-3 py-1 text-sm`}>
          {badge}
        </span>
        <span className="text-lg font-bold text-gray-800">{date}</span>
      </div>
      <div>
        {slots.map((slot, i) => (
          <AgendaRow key={i} {...slot} wide={wide} />
        ))}
      </div>
    </div>
  );
}

const pdfUrl =
  "https://drive.google.com/file/d/1xJKEIw1isOJEpI8VCotP5kTnFHqMn-j5/view";

export default function Agenda() {
  return (
    <>
      <header className="pt-32 px-6 text-center">
        <h1 className="text-2xl md:text-5xl font-bold text-black mb-6">議程</h1>
        <p className="text-sm md:text-base text-gray-500 tracking-widest mb-4 uppercase font-medium">
          Agenda
        </p>
        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"></div>
      </header>

      {/* 議程下載 */}
      <section className="max-w-4xl mx-auto pt-8 pb-4 px-6 text-center">
        <p className="text-gray-600 mb-6">
          2026 年 7 月 25 日－26 日｜臺灣臺北
          東吳大學城中校區。以下為議程摘要，完整場次與細節請下載 PDF。
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-4 font-bold hover:bg-gray-800 transition text-center"
        >
          下載完整議程 (PDF) ↓
        </a>
      </section>

      {/* 完整議程 */}
      <section className="max-w-4xl mx-auto py-12 px-6">
        <h3 className="text-2xl font-bold mb-8 border-l-8 border-black pl-5">
          完整議程
        </h3>
        <div className="space-y-8">
          <DayCard
            accent="emerald"
            badge="Day 1"
            date="7/25（六）"
            slots={day1}
          />
          <DayCard accent="orange" badge="Day 2" date="7/26（日）" slots={day2} />
        </div>
      </section>

      {/* 有直播之議程 */}
      <section className="section-gray">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <h3 className="text-2xl font-bold mb-2 border-l-8 border-black pl-5">
            有直播之議程
          </h3>
          <p className="text-sm text-gray-500 mb-8 pl-5">
            以下場次提供線上直播，其他細節請見完整版議程。
          </p>
          <div className="space-y-8">
            <DayCard
              accent="emerald"
              badge="Day 1"
              date="7/25（六）"
              slots={liveDay1}
              wide
            />
            <DayCard
              accent="orange"
              badge="Day 2"
              date="7/26（日）"
              slots={liveDay2}
              wide
            />
          </div>
          <div className="text-center mt-10">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-4 font-bold hover:bg-gray-800 transition text-center"
            >
              下載完整議程 (PDF) ↓
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-10 px-6">
        <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
          主辦單位與協辦單位
        </h3>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* 主辦單位 */}
            <div className="col-span-1 sm:col-span-2 md:col-span-3">
              <h4 className="text-lg font-bold mb-4">主辦單位</h4>
              <div className="flex flex-wrap gap-6 justify-start items-center">
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <img
                    src="/assets/partner/禁羈學術委員會.png"
                    alt="禁羈學術委員會"
                    className="h-16 object-contain mb-2"
                  />
                  <span className="font-medium text-center">
                    禁羈學術委員會
                    <br />
                    <span className="text-xs text-gray-500">
                      Kink Academic Committee
                    </span>
                  </span>
                </div>
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <a
                    href="https://www.trea.org.tw/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/partner/社團法人台灣情感教育協會.jpg"
                      alt="社團法人台灣情感教育協會"
                      className="h-16 object-contain mb-2"
                    />
                  </a>
                  <span className="font-medium text-center">
                    社團法人台灣情感教育協會
                    <br />
                    <span className="text-xs text-gray-500">
                      Taiwan Relationships Education Association
                    </span>
                  </span>
                </div>
              </div>
            </div>
            {/* 協辦單位 */}
            <div className="col-span-1 sm:col-span-2 md:col-span-3 mt-10">
              <h4 className="text-lg font-bold mb-4">協辦單位</h4>
              <div className="flex flex-wrap gap-6 justify-start items-center">
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <a
                    href="https://www.bdsmtw.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/partner/皮繩愉虐邦 .jpg"
                      alt="皮繩愉虐邦 "
                      className="h-16 object-contain mb-2"
                    />
                  </a>
                  <span className="font-medium text-center">
                    皮繩愉虐邦{" "}
                    <br />
                    <span className="text-xs text-gray-500">
                      Taiwan BDSM Company
                    </span>
                  </span>
                </div>
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <a
                    href="https://shibaru.life/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/partner/縛.生.png"
                      alt="縛.生"
                      className="h-16 object-contain mb-2"
                    />
                  </a>
                  <span className="font-medium text-center">
                    縛.生
                    <br />
                    <span className="text-xs text-gray-500">shibaru.life</span>
                  </span>
                </div>
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <a
                    href="https://www.scu.edu.tw/sw/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/partner/東吳大學社會工作學系.jpg"
                      alt="東吳大學社會工作學系"
                      className="h-16 object-contain mb-2"
                    />
                  </a>
                  <span className="font-medium text-center">
                    東吳大學社會工作學系
                    <br />
                    <span className="text-xs text-gray-500">
                      Department of Social Work Soochow University
                    </span>
                  </span>
                </div>
                <div
                  className="flex flex-col items-center w-40"
                  style={{ maxWidth: "10rem" }}
                >
                  <a
                    href="https://hsokinky.capy.tw/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/partner/好色喔禁羈相談室.png"
                      alt="好色喔！禁羈相談室"
                      className="h-16 object-contain mb-2"
                    />
                  </a>
                  <span className="font-medium text-center">
                    好色喔！禁羈相談室
                    <br />
                    <span className="text-xs text-gray-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
