import React from 'react';

interface MinistryOfEducationLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem-only' | 'horizontal';
  showEnglish?: boolean;
}

export const MinistryOfEducationLogo: React.FC<MinistryOfEducationLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showEnglish = true
}) => {
  // Dimensions based on size
  const sizeMap = {
    sm: { width: 110, height: 75 },
    md: { width: 160, height: 110 },
    lg: { width: 220, height: 150 },
    xl: { width: 280, height: 190 }
  };

  const dims = sizeMap[size];

  if (variant === 'emblem-only') {
    return (
      <svg
        viewBox="0 0 300 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: dims.width * 0.7, height: 'auto' }}
        aria-label="شعار وزارة التعليم - المملكة العربية السعودية"
      >
        <g id="moe-dots-emblem">
          {/* Center Point */}
          <circle cx="150" cy="115" r="4" fill="#007D79" />

          {/* Left Wing Dots */}
          <circle cx="138" cy="102" r="4.5" fill="#008080" />
          <circle cx="127" cy="90" r="5" fill="#008381" />
          <circle cx="118" cy="78" r="5.5" fill="#008785" />
          <circle cx="111" cy="67" r="6" fill="#008C89" />
          <circle cx="106" cy="55" r="6.5" fill="#00908C" />

          <circle cx="140" cy="85" r="4" fill="#008885" />
          <circle cx="129" cy="72" r="4.8" fill="#008F8B" />
          <circle cx="120" cy="59" r="5.5" fill="#009591" />
          <circle cx="113" cy="46" r="6.2" fill="#009C97" />
          <circle cx="108" cy="33" r="6.8" fill="#00A39E" />

          <circle cx="142" cy="68" r="3.8" fill="#009490" />
          <circle cx="131" cy="54" r="4.5" fill="#009C98" />
          <circle cx="122" cy="40" r="5.2" fill="#00A4A0" />
          <circle cx="115" cy="26" r="6" fill="#00ADA8" />

          <circle cx="103" cy="42" r="7.5" fill="#007C78" />
          <circle cx="98" cy="58" r="7.5" fill="#008480" />
          <circle cx="93" cy="74" r="7.5" fill="#008C88" />

          <circle cx="89" cy="32" r="8.2" fill="#008480" />
          <circle cx="84" cy="48" r="8.2" fill="#008C88" />
          <circle cx="79" cy="65" r="8.2" fill="#009590" />

          <circle cx="75" cy="22" r="9" fill="#008C87" />
          <circle cx="70" cy="40" r="9" fill="#009590" />
          <circle cx="65" cy="57" r="9" fill="#009E98" />

          {/* Right Wing Dots (Symmetrical) */}
          <circle cx="162" cy="102" r="4.5" fill="#008080" />
          <circle cx="173" cy="90" r="5" fill="#008381" />
          <circle cx="182" cy="78" r="5.5" fill="#008785" />
          <circle cx="189" cy="67" r="6" fill="#008C89" />
          <circle cx="194" cy="55" r="6.5" fill="#00908C" />

          <circle cx="160" cy="85" r="4" fill="#008885" />
          <circle cx="171" cy="72" r="4.8" fill="#008F8B" />
          <circle cx="180" cy="59" r="5.5" fill="#009591" />
          <circle cx="187" cy="46" r="6.2" fill="#009C97" />
          <circle cx="192" cy="33" r="6.8" fill="#00A39E" />

          <circle cx="158" cy="68" r="3.8" fill="#009490" />
          <circle cx="169" cy="54" r="4.5" fill="#009C98" />
          <circle cx="178" cy="40" r="5.2" fill="#00A4A0" />
          <circle cx="185" cy="26" r="6" fill="#00ADA8" />

          <circle cx="197" cy="42" r="7.5" fill="#007C78" />
          <circle cx="202" cy="58" r="7.5" fill="#008480" />
          <circle cx="207" cy="74" r="7.5" fill="#008C88" />

          <circle cx="211" cy="32" r="8.2" fill="#008480" />
          <circle cx="216" cy="48" r="8.2" fill="#008C88" />
          <circle cx="221" cy="65" r="8.2" fill="#009590" />

          <circle cx="225" cy="22" r="9" fill="#008C87" />
          <circle cx="230" cy="40" r="9" fill="#009590" />
          <circle cx="235" cy="57" r="9" fill="#009E98" />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none text-center ${className}`}>
      {/* High Fidelity SVG matching official Ministry of Education Saudi Arabia Identity */}
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: dims.width, height: 'auto', maxWidth: '100%' }}
        aria-label="وزارة التعليم - المملكة العربية السعودية"
      >
        {/* Emblem Dots (Book / Palm Form) */}
        <g id="moe-emblem">
          {/* Center Point */}
          <circle cx="160" cy="100" r="4" fill="#007D79" />

          {/* Left Wing Inner Dots */}
          <circle cx="148" cy="88" r="4.5" fill="#008080" />
          <circle cx="137" cy="76" r="5" fill="#008381" />
          <circle cx="128" cy="65" r="5.5" fill="#008785" />
          <circle cx="120" cy="54" r="6" fill="#008C89" />
          <circle cx="114" cy="42" r="6.5" fill="#00908C" />

          {/* Left Wing Middle Dots */}
          <circle cx="150" cy="72" r="4" fill="#008885" />
          <circle cx="139" cy="59" r="4.8" fill="#008F8B" />
          <circle cx="130" cy="46" r="5.5" fill="#009591" />
          <circle cx="122" cy="33" r="6.2" fill="#009C97" />
          <circle cx="116" cy="20" r="6.8" fill="#00A39E" />

          {/* Left Wing Outer High Dots */}
          <circle cx="102" cy="32" r="7.5" fill="#007C78" />
          <circle cx="96" cy="48" r="7.5" fill="#008480" />
          <circle cx="90" cy="64" r="7.5" fill="#008C88" />

          <circle cx="86" cy="22" r="8.2" fill="#008480" />
          <circle cx="80" cy="38" r="8.2" fill="#008C88" />
          <circle cx="74" cy="55" r="8.2" fill="#009590" />

          <circle cx="70" cy="12" r="9" fill="#008C87" />
          <circle cx="64" cy="30" r="9" fill="#009590" />
          <circle cx="58" cy="47" r="9" fill="#009E98" />

          {/* Right Wing Inner Dots */}
          <circle cx="172" cy="88" r="4.5" fill="#008080" />
          <circle cx="183" cy="76" r="5" fill="#008381" />
          <circle cx="192" cy="65" r="5.5" fill="#008785" />
          <circle cx="200" cy="54" r="6" fill="#008C89" />
          <circle cx="206" cy="42" r="6.5" fill="#00908C" />

          {/* Right Wing Middle Dots */}
          <circle cx="170" cy="72" r="4" fill="#008885" />
          <circle cx="181" cy="59" r="4.8" fill="#008F8B" />
          <circle cx="190" cy="46" r="5.5" fill="#009591" />
          <circle cx="198" cy="33" r="6.2" fill="#009C97" />
          <circle cx="204" cy="20" r="6.8" fill="#00A39E" />

          {/* Right Wing Outer High Dots */}
          <circle cx="218" cy="32" r="7.5" fill="#007C78" />
          <circle cx="224" cy="48" r="7.5" fill="#008480" />
          <circle cx="230" cy="64" r="7.5" fill="#008C88" />

          <circle cx="234" cy="22" r="8.2" fill="#008480" />
          <circle cx="240" cy="38" r="8.2" fill="#008C88" />
          <circle cx="246" cy="55" r="8.2" fill="#009590" />

          <circle cx="250" cy="12" r="9" fill="#008C87" />
          <circle cx="256" cy="30" r="9" fill="#009590" />
          <circle cx="262" cy="47" r="9" fill="#009E98" />
        </g>

        {/* Official Arabic Typography: وزارة التعليم */}
        <g id="moe-arabic-text" fill="#006C67">
          {/* Custom Stylized Font Geometry for 'وزارة التعليم' */}
          <text
            x="160"
            y="158"
            textAnchor="middle"
            fontFamily="'Alexandria', 'Tajawal', 'Segoe UI', 'Arial', sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="1px"
            fill="#006C67"
          >
            وزارة الـتـعـلـيـم
          </text>
        </g>

        {/* English Subtitle: Ministry of Education */}
        {showEnglish && (
          <g id="moe-english-text">
            <text
              x="160"
              y="190"
              textAnchor="middle"
              fontFamily="'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif"
              fontWeight="500"
              fontSize="16.5"
              letterSpacing="0.8px"
              fill="#636E72"
            >
              Ministry of Education
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
