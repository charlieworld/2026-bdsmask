export default function PartnerSection({ borderTop = false }: { borderTop?: boolean }) {
  return (
    <section
      className={`max-w-5xl mx-auto py-10 px-6${
        borderTop ? " border-t accent-border" : ""
      }`}
    >
      <h3 className="text-2xl font-bold mb-10 border-l-8 border-black pl-5">
        主辦單位、協辦單位與贊助單位
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
              <Partner
                href="https://www.bdsmtw.com/"
                image="/assets/partner/皮繩愉虐邦 .jpg"
                alt="皮繩愉虐邦 "
                name="皮繩愉虐邦"
                nameEN="Taiwan BDSM Company"
              />
              <Partner
                href="https://shibaru.life/"
                image="/assets/partner/縛.生.png"
                alt="縛.生"
                name="縛.生"
                nameEN="shibaru.life"
              />
              <Partner
                href="https://www.scu.edu.tw/sw/"
                image="/assets/partner/東吳大學社會工作學系.jpg"
                alt="東吳大學社會工作學系"
                name="東吳大學社會工作學系"
                nameEN="Department of Social Work Soochow University"
              />
              <Partner
                href="https://hsokinky.capy.tw/"
                image="/assets/partner/好色喔禁羈相談室.png"
                alt="好色喔！禁羈相談室"
                name="好色喔！禁羈相談室"
              />
            </div>
          </div>
          {/* 贊助單位 */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 mt-10">
            <h4 className="text-lg font-bold mb-4">贊助單位</h4>
            <div className="flex flex-wrap gap-6 justify-start items-center">
              <Partner
                href="https://www.redino.tw"
                image="/assets/partner/Redino.png"
                alt="紅犀牛"
                name="紅犀牛"
                nameEN="REDINO"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Partner({
  href,
  image,
  alt,
  name,
  nameEN,
}: {
  href: string;
  image: string;
  alt: string;
  name: string;
  nameEN?: string;
}) {
  return (
    <div
      className="flex flex-col items-center w-40"
      style={{ maxWidth: "10rem" }}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <img src={image} alt={alt} className="h-16 object-contain mb-2" />
      </a>
      <span className="font-medium text-center">
        {name}
        <br />
        {nameEN && <span className="text-xs text-gray-500">{nameEN}</span>}
      </span>
    </div>
  );
}
