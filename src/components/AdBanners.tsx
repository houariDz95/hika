import Script from "next/script";

interface AdSlotProps {
  adKey: string;
  src: string;
  width: number;
  height: number;
  className?: string;
}

function AdSlot({ adKey, src, width, height, className }: AdSlotProps) {
  const scriptCode = `var atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;

  return (
    <div className={`mx-auto ${className ?? ""}`}>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-neutral-100"
        style={{ width: "100%", maxWidth: width, minHeight: height }}
      >
        <Script
          id={`${adKey}-options`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: scriptCode }}
        />
        <Script
          id={`${adKey}-loader`}
          strategy="afterInteractive"
          src={src}
        />
      </div>
    </div>
  );
}

export function AdBanner728({ className }: { className?: string }) {
  return (
    <AdSlot
      adKey="66778a438a159cea9fd1281508e2e1dc"
      src="https://www.highperformanceformat.com/66778a438a159cea9fd1281508e2e1dc/invoke.js"
      width={728}
      height={90}
      className={className}
    />
  );
}

export function AdBanner300({ className }: { className?: string }) {
  return (
    <AdSlot
      adKey="39e359f5381103073cba6aa53002abf9"
      src="https://www.highperformanceformat.com/39e359f5381103073cba6aa53002abf9/invoke.js"
      width={300}
      height={250}
      className={className}
    />
  );
}

export function AdBannerMobile({ className }: { className?: string }) {
  return (
    <AdSlot
      adKey="a6a914cf5fa889b418822868cc0ecef1"
      src="https://www.highperformanceformat.com/a6a914cf5fa889b418822868cc0ecef1/invoke.js"
      width={320}
      height={50}
      className={className}
    />
  );
}

export function SocialBarAd({ className }: { className?: string }) {
  return (
    <div className={`mx-auto ${className ?? ""}`}>
      <div className="w-full max-w-3xl rounded-2xl bg-neutral-100 px-2 py-4">
        <Script
          id="social-bar-ad"
          strategy="afterInteractive"
          src="https://pl29778345.effectivecpmnetwork.com/c4/59/32/c45932d7b39a3e5ef2bfa150e22ea855.js"
        />
      </div>
    </div>
  );
}
