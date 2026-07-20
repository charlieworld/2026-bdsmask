import type { Route } from "./+types/staff";
import PartnerSection from "../components/PartnerSection";

export const meta: Route.MetaFunction = () => [
  { title: "工作人員 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "zh_TW" },
  {
    property: "og:title",
    content: "工作人員 | 第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  {
    property: "og:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 工作人員",
  },
  { property: "og:image", content: "https://bdsmask.org/assets/om_image.png" },
  { property: "og:url", content: "https://bdsmask.org/staff.html" },
  {
    property: "og:site_name",
    content: "第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "工作人員 | 第二屆亞太禁羈研討會 (A.S.K. II)",
  },
  {
    name: "twitter:description",
    content:
      "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）- 工作人員",
  },
  {
    name: "twitter:image",
    content: "https://bdsmask.org/assets/om_image.png",
  },
  { name: "twitter:site", content: "@ask2026" },
];

type Member = {
  avatar: string; // filename without extension, under /assets/avatars/
  alt: string;
  name: string;
  chair?: boolean;
  group: string;
  body: React.ReactNode;
};

const academicMembers: Member[] = [
  {
    avatar: "gao",
    alt: "高穎超",
    name: "高穎超",
    chair: true,
    group: "學術組",
    body: (
      <>
        <p className="mb-3 last:mb-0">
          高穎超為美國維吉尼亞聯邦大學社會學系副教授、社會學研究所所長，兼屬於性別、性制與婦女研究系。其擔任美國社會學會所屬期刊{" "}
          <em>Sex and Sexualities </em>
          助理編輯，研究領域包含：性別與性制(gender and
          sexualities)、宗教社會學，酷兒亞洲研究，種族政治與社會不平等，與全球化與跨國社會學。
        </p>
        <p className="mb-3 last:mb-0">
          穎超的第一本學術專書《
          <em>
            <a
              href="https://nyupress.org/9781479832132/fear-of-queer-taiwan/"
              target="_blank"
              rel="noopener"
              className="underline break-all hover:text-gray-600"
            >
              Fear of Queer Taiwan: Anti-LGBTQ Movements between Taiwan and the
              U.S. Religious Right
            </a>
          </em>
          》（暫譯：《液化保守性：臺灣反同志平權運動的興衰及臺美跨國流動之酷兒解析》），英文版已由美國紐約大學出版社
          (NYU Press)
          於2026年出版。本書聚焦於臺灣護家反同運動與婚姻平權、性別平等教育政策的辯證互動，分析其動機、組織及跨國網絡。穎超其他的研究案也探索了蒙受污名的BDSM性實踐社群如何建構新的性制正當性。
        </p>
        <p className="mb-3 last:mb-0">
          高穎超的研究成果發表於期刊<em>Sexualities</em>, <em>Contexts</em>,{" "}
          <em>International Journal of Taiwan Studies</em>,{" "}
          <em>Taiwan Journal of Democracy</em>,
          及《性別平等教育季刊》。書評見於<em>American Journal of Sociology</em>
          ，專書書章發表於
          <em>
            <a
              href="https://www.routledge.com/Global-Feminist-Autoethnographies-During-COVID-19-Displacements-and-Disruptions/Heath-Darkwah-Beoku-Betts-Purkayastha/p/book/9781032122625"
              target="_blank"
              rel="noopener"
              className="underline break-all hover:text-gray-600"
            >
              Global Feminist Autoethnographies During COVID-19: Displacements
              and Disruptions
            </a>{" "}
          </em>
          (Routledge, 2022)，陽剛氣質研究發表於合輯
          <em>East Asian Men: Masculinity, Sexuality and Desire</em> (Palgrave
          Macmillan, 2016) 和<em>Masculinities in a Global Era</em> (Springer,
          2013)（與畢恒達合著）。
        </p>
        <p className="mb-3 last:mb-0">
          穎超翻譯的性社會學經典《茶室交易》（群學出版，2016），榮獲2017年台北國際書展編輯獎。他發表於期刊{" "}
          <em>Sexualities</em> 的文章 “The Coloniality of Queer Theory: The
          Effects of ‘Homonormativity’ on Transnational Taiwan’s Path to
          Equality”
          贏得了社會問題研究學會（Society for the Study of Social
          Problems）性別、性行為、政治與社區組（Division of Gender, Sexual
          Behavior, Politics, and Communities）的2025年傑出論文獎。
        </p>
        <p className="mb-3 last:mb-0">
          穎超其他的研究文章見於《質／性別研究》及《以身為度、如是我做：田野工作的教與學》。另有公共社會學評論刊於《性別平等教育季刊》、《巷仔口社會學》、《上報》、《端傳媒》、《蘋果日報》、《關鍵評論網》和<em>Taipei Times</em>等。
        </p>
        <p className="mb-3 last:mb-0">
          穎超樂於透過講學、座談分享知識，曾受邀於美國、加拿大、英國、冰島、奧地利、台灣等地進行主題演講、主題論壇等不同形式之發表。
        </p>
        <p className="mb-3 last:mb-0">
          工作用電郵：
          <a
            href="mailto:yckao512@gmail.com"
            target="_blank"
            rel="noopener"
            className="underline break-all hover:text-gray-600"
          >
            yckao512@gmail.com
          </a>
          ;{" "}
          <a
            href="mailto:yckao@vcu.edu"
            target="_blank"
            rel="noopener"
            className="underline break-all hover:text-gray-600"
          >
            yckao@vcu.edu
          </a>
        </p>
        <p className="mb-3 last:mb-0">
          網站：
          <a
            href="https://sociology.vcu.edu/directory/kaoyingchao.html"
            target="_blank"
            rel="noopener"
            className="underline break-all hover:text-gray-600"
          >
            https://sociology.vcu.edu/directory/kaoyingchao.html
          </a>
        </p>
      </>
    ),
  },
  {
    avatar: "xiaolin",
    alt: "小林繩霧",
    name: "小林繩霧",
    group: "學術組",
    body: <p className="mb-3 last:mb-0">繩手、禁羈實踐、倡議、研究。</p>,
  },
  {
    avatar: "elza",
    alt: "王婉瑜 / ELZA",
    name: "王婉瑜 / ELZA",
    group: "學術組",
    body: (
      <>
        <p className="mb-2 last:mb-0">
          社團法人台灣情感教育協會、皮繩愉虐邦
        </p>
        <p className="mb-2 last:mb-0">
          Taiwan Relationships Education Association、Taiwan BDSM Company
        </p>
      </>
    ),
  },
  {
    avatar: "you",
    alt: "游清舒",
    name: "游清舒",
    group: "學術組",
    body: <p className="mb-2 last:mb-0">諮商心理師</p>,
  },
  {
    avatar: "zhong",
    alt: "鍾道詮",
    name: "鍾道詮",
    group: "學術組",
    body: <p className="mb-2 last:mb-0">東吳大學社會工作學系副教授</p>,
  },
];

const adminMembers: Member[] = [
  {
    avatar: "della",
    alt: "千霂Della",
    name: "千霂Della",
    chair: true,
    group: "行政組/規劃",
    body: (
      <p className="mb-2 last:mb-0">社團法人台灣情感教育協會 常務理事</p>
    ),
  },
  {
    avatar: "huban",
    alt: "虎斑",
    name: "虎斑",
    group: "行政組",
    body: (
      <p className="mb-2 last:mb-0">
        台大BDSM社前社長、現任幹部。「禁羈會社」共同主辦人。
      </p>
    ),
  },
  {
    avatar: "cara",
    alt: "Cara",
    name: "Cara",
    group: "行政組／現場統籌",
    body: (
      <p className="mb-2 last:mb-0">
        禁羈會社共同創辦者、同志諮詢熱線義工。平常會主辦禁羈活動、擔任講座或工作坊分享者與帶領者、活動小幫手/助教、表演者。其他資訊：
        <a
          href="https://portaly.cc/caracolette"
          target="_blank"
          rel="noopener"
          className="underline break-all hover:text-gray-600"
        >
          https://portaly.cc/caracolette
        </a>
      </p>
    ),
  },
  {
    avatar: "esther",
    alt: "Esther(EST)",
    name: "Esther(EST)",
    group: "行政組/派對小組",
    body: (
      <>
        <p className="mb-2 last:mb-0">
          人生online的點數都點到幸運的player。
        </p>
        <p className="mb-2 last:mb-0">
          給自己的成年禮是Spanking的私約實踐，以至少一週一次的頻率持續約兩年，直到2015年才開始參加BDSM的公開活動
          ，在Kinky的旅途中，從spankee到spanko，從bottom到switch，從混跡各式活動到常駐MS，因緣際會獲得小精靈稱號，協辦活動、受邀參與演出、科普講座等。常任Maya
          公開繩課之助教/繩模及入門課講者。喜歡學習各類新技能，對未知事物充滿好奇，持續收集各種成就，不定時更新粉專：羈本來說。
        </p>
      </>
    ),
  },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 bg-white p-6 shadow-sm border accent-border">
      <div className="shrink-0 flex sm:block justify-center">
        <picture>
          <source srcSet={`/assets/avatars/${member.avatar}.webp`} type="image/webp" />
          <img
            src={`/assets/avatars/${member.avatar}.jpg`}
            alt={member.alt}
            width={112}
            height={112}
            className="w-28 h-28 rounded-full object-cover"
          />
        </picture>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
          <h5 className="text-xl font-bold">{member.name}</h5>
          {member.chair && (
            <span className="text-xs bg-black text-white px-2 py-1">
              主席 Chair
            </span>
          )}
          <span className="text-xs bg-zinc-100 text-gray-600 px-2 py-1">
            {member.group}
          </span>
        </div>
        <div className="text-gray-700 text-sm leading-relaxed">{member.body}</div>
      </div>
    </div>
  );
}

const conferenceVolunteers = [
  "Aki",
  "ikEa",
  "Janey 傑尼",
  "Josephine",
  "Melody",
  "小樂",
  "瓜瓜",
  "利嘎",
  "芳賢",
  "兔兔",
  "蝶骨",
  "蹦蹦",
  "檸檬",
];

const partyVolunteers = [
  "Aki",
  "Josephine",
  "Melody",
  "Yu",
  "小E",
  "小樂",
  "瓜瓜",
  "芳賢",
  "兔兔",
  "海晴",
  "蝶骨",
  "蹦蹦",
  "檸檬",
];

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="bg-zinc-100 px-3 py-1 text-sm">{children}</span>;
}

export default function Staff() {
  return (
    <>
      <header className="pt-32 px-6 text-center">
        <h1 className="text-2xl md:text-5xl font-bold text-black mb-6">
          工作人員
        </h1>
        <p className="text-sm md:text-base text-gray-500 tracking-widest mb-4 uppercase font-medium">
          Staff
        </p>
        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"></div>
      </header>

      {/* 2026禁羈籌備委員會介紹 */}
      <section className="max-w-5xl mx-auto pt-16 pb-10 px-6">
        <h3 className="text-2xl font-bold mb-8 border-l-8 border-black pl-5">
          2026 禁羈籌備委員會介紹
        </h3>
        <h4 className="text-lg font-bold mb-6 pb-2 border-b accent-border">
          學術組
        </h4>
        <div className="space-y-6 mb-14">
          {academicMembers.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>
        <h4 className="text-lg font-bold mb-6 pb-2 border-b accent-border">
          行政組
        </h4>
        <div className="space-y-6 mb-14">
          {adminMembers.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>
      </section>

      {/* 特別感謝 Special Thanks */}
      <section className="max-w-5xl mx-auto py-10 px-6 min-h-[40vh]">
        <h3 className="text-2xl font-bold mb-2 border-l-8 border-black pl-5">
          特別感謝{" "}
          <span className="text-gray-400 font-medium">Special Thanks</span>
        </h3>
        <p className="text-sm text-gray-500 mb-10 pl-5">
          以下順序依照英文名字首字母排序
          <br />
          The following order is sorted alphabetically.
        </p>

        <div className="space-y-8">
          {/* 研討會 */}
          <div className="bg-white p-6 shadow-sm border accent-border">
            <h4 className="text-lg font-bold mb-6 pb-2 border-b accent-border">
              研討會
            </h4>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                  現場協力義工
                </span>
                <div className="flex flex-wrap gap-2">
                  {conferenceVolunteers.map((v) => (
                    <Tag key={v}>{v}</Tag>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                  攝影
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag>Alex</Tag>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                  直播組
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag>TinaTea 小緹</Tag>
                  <Tag>柚子泥</Tag>
                  <Tag>利嘎</Tag>
                </div>
              </div>
            </div>
          </div>

          {/* 派對 */}
          <div className="bg-white p-6 shadow-sm border accent-border">
            <h4 className="text-lg font-bold mb-6 pb-2 border-b accent-border">
              派對
            </h4>
            <div className="flex flex-col sm:flex-row sm:gap-6">
              <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                現場協力義工
              </span>
              <div className="flex flex-wrap gap-2">
                {partyVolunteers.map((v) => (
                  <Tag key={v}>{v}</Tag>
                ))}
              </div>
            </div>
          </div>

          {/* 其他協力 */}
          <div className="bg-white p-6 shadow-sm border accent-border">
            <h4 className="text-lg font-bold mb-6 pb-2 border-b accent-border">
              其他協力
            </h4>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                  視覺設計協力
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://instagram.com/gamma._.design"
                    target="_blank"
                    rel="noopener"
                    className="bg-zinc-100 px-3 py-1 text-sm hover:bg-zinc-200 underline decoration-dotted underline-offset-4 transition"
                  >
                    Gamma
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <span className="w-full sm:w-32 shrink-0 font-medium text-gray-500 mb-2 sm:mb-0">
                  網頁製作協力
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag>TinaTea 小緹</Tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerSection />
    </>
  );
}
