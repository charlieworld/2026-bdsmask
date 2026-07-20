import PartnerSection from "../components/PartnerSection";

export default function Index() {
  return (
    <>
      <header className="pt-32 pb-10 px-6 text-center accent-border">
        <h1 className="text-2xl md:text-5xl font-bold text-black mb-6">
          第二屆亞太禁羈研討會
        </h1>
        <p className="text-sm md:text-base text-gray-500 tracking-widest mb-4 uppercase font-medium">
          A.S.K. II: The Second Asia-Pacific Symposium on KINK
        </p>
        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"></div>
        <div className="max-w-4xl mx-auto py-8 border-y accent-border my-8">
          <h2 className="font-light text-gray-800 flex justify-center">
            <div className="flex flex-wrap items-center justify-center font-bold gap-x-4">
              <span className="text-2xl">主題：</span>

              <div className="flex items-start">
                <span className="text-xs mt-1">(不)</span>
                <span className="text-2xl">安全</span>
              </div>

              <span className="text-3xl mx-1">×</span>

              <div className="flex items-start">
                <span className="text-xs mt-1">(不)</span>
                <span className="text-2xl">平權</span>
              </div>

              <span className="text-2xl mx-2">⇆</span>

              <span className="text-2xl">復元</span>

              <span className="text-2xl mx-1">×</span>
              <span className="text-2xl">賦權</span>
            </div>
          </h2>
          <p className="text-sm text-gray-400 mt-3 italic tracking-wide">
            (Un)Safety × (In)Equality ⇆ (Recovery + Reparation + Resilience) ×
            Empowerment
          </p>
        </div>
        <div className="mt-8 text-gray-600 font-medium">
          <p>2026年7月25日-26日（週六、日）臺灣臺北 東吳大學城中校區</p>
        </div>
      </header>

      <section className="px-6 pb-4">
        <div className="max-w-md mx-auto">
          <picture>
            <source srcSet="/assets/poster-2026.webp" type="image/webp" />
            <img
              src="/assets/poster-2026.jpg"
              alt="第二屆亞太禁羈研討會 A.S.K. II 主視覺海報｜(不)安全 × (不)平權 ⇆ 復元 × 賦權｜2026.07.25-26 東吳大學城中校區"
              width={708}
              height={1000}
              className="w-full h-auto shadow-lg"
            />
          </picture>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-10 px-6">
        <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
          【徵稿啟事】
        </h3>
        <div>
          <h3 className="text-xl font-bold mb-4">臺灣禁羈知識地景的生成</h3>
          <p className="mb-4">
            臺灣社會對於BDSM與禁羈（Kink）文化與社群的系統性理解，始自2004年「皮繩愉虐邦」的倡議，在接下來20多年各式出版、媒體、空間與活動的創造，至今已成長為蓬勃發展且多樣異質的文化社群。從2015年在臺灣大學舉辦的「禁羈民主與惡趣技藝：亞太地區皮繩愉虐情慾與文化國際學術研討會」，到2024年在東吳大學舉辦的「亞太禁羈研討會：飛／非典、借／解構」，臺灣作為亞太地區性別平等與言論自由的唯一華語系民主社會，正延續著解嚴以來民主運動、婦女與性別平權運動、同志運動等學術與社運所積累的豐厚肌理，進一步探索關於禁羈（Kink）、BDSM（Bondage/Discipline,
            Dominance/submission,
            Sadism/masochism），以及各種邊緣、另類的性實踐、性認同與情慾關係類型，將其認真對待，並以嚴謹、系統性的學術知識生產勞動，產製相關分析、檔案、歷史等知識產物。
          </p>
          <p className="mb-4">
            過去的禁羈與BDSM社運與學術討論，多著重於以社群觀點對抗異性戀常規性的主流社會中所充斥的「禁羈恐懼症」（kinkphobia）和「香草常規性」（vanilla
            normativity）體制。
          </p>
          <p className="mb-4">
            邁入第二屆的「亞太禁羈研討會」系列，除了繼續開放學者、研究生的自由投稿之外，研討會團隊選擇將焦點轉向社群內部的自我省察，認真看待並討論存在於禁羈與BDSM社群內的階級、種族／族群與性／別不平等，對特定身體的羞辱，壓迫身心障礙朋友的健全主義（ableism）等交織性的種種排擠、壓迫與歧視。
          </p>
          <h3 className="text-xl font-bold mb-4">（不）安全 × （不）平權</h3>
          <p className="mb-4">
            我們探問：當「禁羈與BDSM情慾、情感與社群」是奠基在戲耍權力不平等的性腳本之上，我們在追求
            BDSM
            的正當化、合法性和創造性發展的同時，是否必然會與「階級、種族／族群與性／別平權，乃至各種交織性主體的平權」產生衝突？兩股力量有何複雜的互動關係？同時，BDSM與禁羈社群與實踐面對著哪些來自社群內部與外部的風險、安全疑慮呢？
          </p>
          <h3 className="text-xl font-bold mb-4">復元 × 賦權</h3>
          <p className="mb-4">
            充滿創意與智慧的社群成員，經過了20餘年的經驗累積，又已累積出何種進行風險控管的保安策略（security
            strategies），以抵抗來自法律、道德、宗教、家庭、政治經濟、親密關係、地緣政治與全球保守勢力等的威脅和侵擾，在維繫自身與關係安全的同時，能夠面對過往的創傷（trauma）、苦痛、污名、壓迫，讓禁羈與BDSM實踐，成為達成自我復元（Recovery）與療癒的途徑之一，進而展現個人和社會集體的韌性（Resilience），讓禁羈與BDSM成為達成修復式正義（reparative
            justice）的行動策略，與臺灣、亞太社會一同面對來自個人生活與地緣政治的風險和權力不平等，思考如何集體行動。
          </p>
          <h3 className="text-xl font-bold mb-4">徵稿邀請</h3>
          <p className="mb-4">
            本次研討會以<b>「（不）安全 × （不）平權 ⇆ 復元 × 賦權」</b>
            為核心命題，邀請各領域的碩博士生、學者、研究者，認真審議安全與平權的動態辯證關係，集體探索從不安全的創傷經驗、不平權的現況，如何朝向復元、韌性、修復的可能性，並達到自我賦權、集體增能的目的。此外，我們也歡迎所有「禁羈與BDSM相關的論文摘要」投稿。禁羈與BDSM研究本身的跨領域特質，歡迎來自人文歷史、藝術創作、社會科學、政治經濟法律、心理社工、健康醫療照護等助人工作領域，以及其他跨學科研究者投入禁羈與BDSM研究，透過本研討會平台進行難得的深入對話與交流，協助彼此進行期刊論文、學術專著或學術合輯書章的發表，或在發展碩博士論文上獲得友善學術社群的協助。
          </p>
          <p className="mb-4">
            本次研討會歡迎（A）學術論文摘要，與（B）圓桌論壇與工作坊投稿，詳見摘要範例格式。投稿單篇「學術論文摘要」者，歡迎參考研討會的「徵稿主題」節以利發想，更歡迎投稿任何與禁羈、BDSM相關的論文。欲投稿「圓桌論壇與工作坊」者，我們預計組幾種論壇形式，歡迎相關興趣者投稿，也誠摯邀請您自行組成不同主題的論壇投稿。
          </p>
          <p className="mb-4">
            所有投稿都將循一般學術研討會運作方式，先送外部委員審查、評選後，由研討會主辦單位的學術組委員會，根據外部審查意見作為接受與否的憑據。若投稿者接受研討會邀請、在時程上得以配合者，將能順利排入議程進行發表或研討。
          </p>
          <h3 className="text-xl font-bold mb-4">出版可能性</h3>
          <p className="mb-4">
            「亞太禁羈研討會」系列也將開始與發表者、研究社群溝通，一起探索並累積學術合輯以英文、華語出版的可能性。
          </p>
          <h3 className="text-xl font-bold mb-4">研討會資訊</h3>
          <div>
            <div>
              官方網站：
              <a href="https://bdsmask.org" target="_blank" rel="noreferrer">
                https://bdsmask.org
              </a>
            </div>
            <div>
              聯絡方式：
              <a className="underline" href="mailto:bdsmaskorg@gmail.com">
                bdsmaskorg@gmail.com
              </a>
            </div>
            <div>
              其他資訊：
              <a
                href="https://linktr.ee/bdsmask"
                target="_blank"
                rel="noreferrer"
              >
                https://linktr.ee/bdsmask
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://link.oen.tw/ASK2026"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-4 font-bold hover:bg-gray-800 transition text-center"
              >
                2026第二屆亞太禁羈研討會【ASK 2026】售票頁 →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-10 px-6">
        <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
          重要日期
        </h3>
        <div className="max-w-2xl mx-auto border accent-border">
          <div className="flex border-b accent-border p-4">
            <span className="w-1/2 text-gray-500">徵稿啟事公布：</span>
            <span className="w-1/2 font-medium">2025年12月22日</span>
          </div>
          <div className="flex border-b accent-border p-4 bg-zinc-50 text-red-700">
            <span className="w-1/2 font-bold">摘要截稿日期：</span>
            <span className="w-1/2 font-bold underline decoration-double">
              2026年2月28日
            </span>
          </div>
          <div className="flex border-b accent-border p-4">
            <span className="w-1/2 text-gray-500">摘要審查結果通知：</span>
            <span className="w-1/2 font-medium">2026年4月15-20日</span>
          </div>
          <div className="flex border-b accent-border p-4">
            <span className="w-1/2 text-gray-500">論文全文上傳：</span>
            <span className="w-1/2 font-medium">2026年6月30日</span>
          </div>
          <div className="flex p-4 bg-black text-white">
            <span className="w-1/2 font-bold">研討會日期：</span>
            <span className="w-1/2 font-bold underline">
              2026年7月25日-26日（週六、日）台北
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-20 px-6 section-gray">
        <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
          徵稿主題
        </h3>
        <p className="mb-4 text-sm text-gray-500 italic">
          （以下子題僅供發想創意，投稿主題包括但不限於以下子題，任何與禁羈、BDSM文化相關的論文摘要皆歡迎喔！）
        </p>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">
                一、禁羈、BDSM與交織性(intersectionality)
              </h5>
              <p className="text-sm text-gray-500">
                1-1、禁羈、BDSM與性、性別(sex and gender)<br />
                1-2、禁羈、BDSM與社會性別(gender) <br />
                1-3、禁羈、BDSM與批判／社會性(sexualities)<br />
                1-4、禁羈、BDSM與種族／族群(race/ethnicity)<br />
                1-5、禁羈、BDSM與階級(class)<br />
                1-6、禁羈、BDSM、性輔具與身心障礙或特能者的性(ability/disability)<br />
                1-7、禁羈、BDSM與國際遷移中的勞動與親密關係<br />
                1-8、禁羈、BDSM與文學、語言及美學<br />
                1-9、禁羈、BDSM與宗教信仰及受苦異象
              </p>
            </div>
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">
                二、直面禁羈、BDSM的羞恥、禁忌與污名、愉悅與情趣
              </h5>
              <p className="text-sm text-gray-500">
                2-1、禁羈、BDSM與心理、諮商、醫療、藥物 <br />
                2-2、禁羈、BDSM的文化禁忌與社會污名<br />
                2-3、禁羈、BDSM與大眾及社群媒體再現<br />
                2-4、禁羈、BDSM與台灣女性主義性戰爭中缺席的<br />
                2-5、禁羈、BDSM的愉悅與情趣
              </p>
            </div>
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">
                三、禁羈、BDSM的脈絡、歷史與社群反思
              </h5>
              <p className="text-xs text-gray-500">
                3-1、台灣的禁羈、BDSM史與文化<br />
                3-2、亞太地區與全球的禁羈、BDSM史與文化<br />
                3-3、禁羈、BDSM社群內的合作與衝突<br />
                3-4、禁羈、BDSM實踐的（不）安全、（不）神智與（不）知情同意<br />
                3-5、禁羈、BDSM的（不）倫理與（不）共識<br />
                3-6、禁羈、BDSM之繩縛技藝(B/D)<br />
                3-7、禁羈、BDSM之情慾權力嬉戲(D/S)<br />
                3-8、禁羈、BDSM之施虐、受虐、痛／快(S/M)<br />
                3-9、打屁股社群<br />
                3-10、物戀(fetishism)、調教與角色扮演<br />
                3-11、動物扮演、角色扮演<br />
                3-12、其他與禁羈、BDSM相關之情慾實踐與文化社群<br />
              </p>
            </div>
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">四、禁羈民主與權力</h5>
              <p className="text-sm text-gray-500">
                4-1、禁羈、BDSM與（性）政治<br />
                4-2、禁羈、BDSM與台灣、香港、日本、美國、中國等地緣政治<br />
                4-3、禁羈、BDSM、經濟、不平等與新自由主義<br />
                4-4、禁羈、BDSM與社會運動<br />
                4-5、禁羈、BDSM與殖民主義及解殖民力量<br />
                4-6、禁羈、BDSM的教育政策及校園實踐<br />
                4-7、（不）友善禁羈、BDSM空間的建置與破壞<br />
                4-8、禁羈、BDSM相關的憲法、法律、規定研究<br />
                4-9、壓抑與解放禁羈、BDSM的相關法令實施機制與運作
              </p>
            </div>
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">
                五、禁羈、BDSM課程、教材、教學與助人專業
              </h5>
              <p className="text-sm text-gray-500">
                5-1、禁羈、BDSM融入各級學校各學習領域課程與教學之想像<br />
                5-2、禁羈、BDSM、貞潔教育與貞操帶之實踐<br />
                5-3、禁羈、BDSM與性教育（含全面性教育、愛滋友善教育）<br />
                5-4、禁羈、BDSM與同志友善教育<br />
                5-5、禁羈、BDSM與情感教育<br />
                5-6、禁羈、BDSM與性侵害、性騷擾、性霸凌、師生戀及專業倫理<br />
                5-7、禁羈、BDSM與助人專業（如：心理、諮商、輔導、精神醫學、身心科、社會
              </p>
            </div>
            <div className="bg-white p-6 shadow-sm border accent-border">
              <h5 className="font-bold mb-3 border-b pb-2">
                六、禁羈、BDSM知識與實踐的拓邊
              </h5>
              <p className="text-sm text-gray-500">
                6-1、禁羈、BDSM新興議題研究 <br />
                6-2、其他禁羈、BDSM相關研究與實踐
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto section-gray my-10 py-10 px-6">
        <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
          投稿說明
        </h3>
        <p className="mb-12 text-sm text-gray-500">
          投稿之語言不予以硬性限定，但建議以華語語系寫成。請在2026/02/28前繳交長度約800字之論文摘要或座談大綱（議程委員可能不予閱讀超出此限之部分），詳見摘要範例格式。議程委員將選出適合發表之論文或座談並給予建議。議程委員亦可投稿，但不審有利益衝突的稿件。
          <br />
          <br />
          投稿人請點選下方連結至 [Easy Chair](
          <a
            href="https://easychair.org/conferences/?conf=ask2026"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://easychair.org/conferences/?conf=ask2026
          </a>
          ) 網站註冊並上傳 PDF格式之稿件。若對主題、格式、過程有任何疑難，請洽議程主委（
          <a className="underline" href="mailto:ask2026@easychair.org">
            ask2026@easychair.org
          </a>
          ）
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://easychair.org/conferences/?conf=ask2026"
            className="flex-1 bg-black text-white px-4 py-4 font-bold hover:bg-gray-800 transition min-w-[150px] text-center"
            target="_blank"
            rel="noreferrer"
          >
            投稿網址
          </a>
          <a
            href="https://docs.google.com/document/d/1ma4Z3mvjjpq76jciF43K64Hfuhoe4A0mJhNt1EvBuLE/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-4 font-bold border-2 border-black hover:bg-black hover:text-white transition min-w-[150px] text-center"
          >
            研究論文摘要提案範例
          </a>
          <a
            href="https://docs.google.com/document/d/1932vnrI5JxdM51wKv2Mod1ysybE83uWOD6Xp3fGEnT8/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-4 font-bold border-2 border-black hover:bg-black hover:text-white transition min-w-[150px] text-center"
          >
            座談與工作坊提案範例
          </a>
        </div>
      </section>

      <PartnerSection />
    </>
  );
}
