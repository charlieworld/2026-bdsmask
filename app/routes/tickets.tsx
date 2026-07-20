import type { Route } from "./+types/tickets";
import PartnerSection from "../components/PartnerSection";

export const meta: Route.MetaFunction = () => [
  { title: "售票資訊 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
  {
    property: "og:type",
    content: "website",
  },
  { property: "og:locale", content: "zh_TW" },
  {
    property: "og:title",
    content: "售票資訊 | 第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  {
    property: "og:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 售票資訊",
  },
  {
    property: "og:image",
    content: "https://bdsmask.org/assets/om_image.png",
  },
  { property: "og:url", content: "https://bdsmask.org/tickets.html" },
  {
    property: "og:site_name",
    content: "第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "售票資訊 | 第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  {
    name: "twitter:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 售票資訊",
  },
  {
    name: "twitter:image",
    content: "https://bdsmask.org/assets/om_image.png",
  },
  { name: "twitter:site", content: "@ask2026" },
];

export default function Tickets() {
  return (
    <>
      <header className="pt-32 pb-6 px-6 text-center">
        <h1 className="text-2xl md:text-5xl font-bold text-black mb-6">
          售票資訊
        </h1>
        <p className="text-sm md:text-base text-gray-500 tracking-widest mb-4 uppercase font-medium">
          Tickets
        </p>
        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"></div>
        <a
          href="https://link.oen.tw/ASK2026"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 font-bold hover:bg-orange-600 transition text-center mt-8"
        >
          第二屆亞太禁羈研討會
          <br />
          (A.S.K. II) 售票頁 →
        </a>
      </header>

      {/* 開放報名 manifesto */}
      <section className="section-gray">
        <div className="max-w-3xl mx-auto py-16 px-6 text-center">
          <p className="text-sm text-gray-500 tracking-widest mb-3">
            2026 / 7 / 25-26
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug">
            開放報名！
          </h2>
          <div className="text-base md:text-lg leading-loose text-gray-700 space-y-6">
            <p>
              我們談安全，
              <br />
              因為知道傷害的風險確實存在。
              <br />
              我們談平權，
              <br />
              因為明白權力的建構容易造成腐敗。
            </p>
            <p>
              然而，當「安全」成為口號時，
              <br />
              是否也有某些經驗被忽略？
              <br />
              當「平權」成為共識時，
              <br />
              是否也有某些聲音難以被聽見？
            </p>
            <p>
              那些不夠安全的時刻，
              <br />
              那些不夠平權的關係，
              <br />
              那些曾經受傷、困惑、失落甚至沉默的經驗，
              <br />
              是否也值得被看見、被理解、被討論？
            </p>
            <p>
              而當我們努力追求復元與賦權時，
              <br />
              又是否可能在無意之間，
              <br />
              創造出新的框架、新的期待，
              <br />
              甚至新的不安全與不平權？
            </p>
            <p>
              或許，答案從來不在某個立場之中。
              <br />
              而是在一次次誠實的提問、
              <br />
              一次次願意傾聽彼此的對話裡。
            </p>
            <p>
              第二屆亞太禁羈研討會 A.S.K. II
              <br />
              以「(不)安全 × (不)平權 ⇆ 復元 × 賦權」為主題，
              <br />
              邀請你一起走進這些未必舒適，
              <br />
              卻無比重要的叩問。
            </p>
            <p>
              唯有願意凝視複雜，
              <br />
              我們才可能超越既有的認知。
              <br />
              唯有願意面對差異，
              <br />
              我們才可能看見更寬廣的彼此。
              <br />
              同時，也看見一個嶄新的禁羈世界。
            </p>
          </div>
        </div>
      </section>

      {/* 研討會資訊 */}
      <section className="max-w-3xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            第二屆亞太禁羈研討會 A.S.K. II
          </h3>
          <p className="font-medium text-gray-800">
            主題｜(不)安全 × (不)平權 ⇆ 復元 × 賦權
          </p>
          <p className="text-sm text-gray-400 italic mt-1">
            (Un)Safety × (In)Equality ⇆ (Recovery + Reparation + Resilience) ×
            Empowerment
          </p>
          <div className="mt-6 text-gray-700 font-medium">
            <p>2026 年 7 月 25 日－26 日</p>
            <p>臺灣臺北｜東吳大學城中校區</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">
          今年，有來自不同領域的研究者、實踐者與關心者，可以共同討論：
        </p>
        <ul className="space-y-3 mb-12">
          <li className="flex gap-3">
            <span className="text-emerald-600">✦</span>
            <span>禁羈社群自主規範與法律之辯證關係</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500">✦</span>
            <span>身心障礙與禁羈情欲的交織認同和實踐</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-600">✦</span>
            <span>禁羈實踐與風險</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500">✦</span>
            <span>禁羈研究的現況與未來：在地知識生成、權力與助人行動</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-600">✦</span>
            <span>電影、文學、文化展演中的禁羈愛欲與主體形構</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500">✦</span>
            <span>禁羈認同化的歷程與流變</span>
          </li>
        </ul>

        <div className="bg-white p-6 shadow-sm border accent-border mb-8">
          <h4 className="text-lg font-bold mb-4 pb-2 border-b accent-border">
            靶子論文與評論
          </h4>
          <p className="font-medium leading-relaxed mb-4">
            從抵抗「禁羈恐懼症」、「香草常規性」到批判「禁羈常規性」：臺灣BDSM與禁羈研究的現況及未來可能性
          </p>
          <div className="text-gray-700">
            <p>主講｜高穎超 Ying-Chao Kao</p>
            <p className="text-sm text-gray-500">美國維吉尼亞聯邦大學社會學系副教授</p>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">
          除了論文發表與論壇，也將透過分組主題討論與綜合討論，讓知識不只是被聽見，而能彼此碰撞、交流與生成。
        </p>
      </section>

      {/* 報名資訊 */}
      <section className="section-gray">
        <div className="max-w-3xl mx-auto py-16 px-6">
          <div className="border-2 border-black p-8 text-center bg-white">
            <p className="text-xl md:text-2xl font-bold mb-3">7 月初開放報名</p>
            <p className="text-lg font-medium mb-4">
              早鳥 8 折優惠至
              <span className="text-red-700 font-bold">7 / 11</span> 截止
            </p>
            <p className="text-sm text-gray-500">
              偷偷提醒一下：上一屆開放報名後，不到一週就完售囉！
            </p>
            <a
              href="https://link.oen.tw/ASK2026"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 font-bold hover:bg-orange-600 transition text-center mt-8"
            >
              第二屆亞太禁羈研討會
              <br /> (A.S.K. II) 售票頁 →
            </a>
          </div>
        </div>
      </section>

      {/* 邀請 */}
      <section className="max-w-3xl mx-auto py-16 px-6 text-center">
        <div className="text-base md:text-lg leading-loose text-gray-700 space-y-6">
          <p>
            如果你對禁羈、性／別、法律、文化、社群實踐、助人工作或人權議題感興趣；
            <br />
            如果你在禁羈裡曾經好奇、曾經困惑、曾經受傷、曾經因為與眾不同而感到孤單，
            <br />
            歡迎加入這場對話。
          </p>
          <p>
            我們未必能得到一致的答案，
            <br />
            但或許能一起長出更好的提問。
          </p>
        </div>
      </section>

      <PartnerSection />
    </>
  );
}
