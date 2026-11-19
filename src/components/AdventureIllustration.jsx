const pines = [
  [50, 680, 1.08], [118, 645, 0.82], [176, 720, 1.2], [242, 654, 0.78],
  [322, 705, 0.96], [405, 650, 0.74], [1010, 672, 0.78], [1088, 716, 1.06],
  [1170, 646, 0.82], [1244, 702, 1.14], [1320, 650, 0.92], [1390, 720, 1.12],
  [485, 594, 0.6], [542, 572, 0.52], [890, 590, 0.62], [952, 565, 0.5],
];

function Pine({ x, y, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-4 2 0-72 4 2Z" fill="#473f35" />
      <path d="M0-92-25-52H-12L-34-22H-13L-28 0H28L13-22H34L12-52H25Z" fill="#29483f" />
      <path d="M0-91-5-52H-12L-25-52H-12L-34-22H-13L-28 0H0Z" fill="#42634f" opacity=".72" />
      <path d="M-19-23H-8M-12-52H-3" stroke="#91a27b" strokeOpacity=".35" strokeWidth="2" />
    </g>
  );
}

function Cottage({ x, y, scale = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d="M-42 0V-42L0-72 45-42V0Z" fill="#8e8c76" />
      <path d="M-50-40 0-82 53-40 43-34 0-69-41-34Z" fill="#594b43" />
      <path d="M-13 0V-32Q0-47 13-32V0Z" fill="#493e36" />
      <path d="M-33-36H-21V-22H-33ZM22-36H34V-22H22Z" fill="#d6b47c" />
      <path d="M-27-36V-22M-33-29H-21M28-36V-22M22-29H34" stroke="#665448" strokeWidth="2" />
      <path d="M-40-1H44" stroke="#c1b28f" strokeWidth="3" opacity=".5" />
      <path d="M27-66V-91H39V-57" fill="#777567" />
      <path d="M-48 2H50" stroke="#493e36" strokeWidth="4" />
    </g>
  );
}

export default function AdventureIllustration() {
  return (
    <svg
      className="game-world-art absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="illustrated-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7099a7" />
          <stop offset=".48" stopColor="#b9c1ae" />
          <stop offset="1" stopColor="#d0b990" />
        </linearGradient>
        <linearGradient id="illustrated-trail" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#aa916d" />
          <stop offset="1" stopColor="#77664f" />
        </linearGradient>
        <linearGradient id="illustrated-foreground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#526b57" />
          <stop offset="1" stopColor="#31483f" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#illustrated-sky)" />
      <circle cx="1110" cy="190" r="62" fill="#f1d7a4" opacity=".64" />
      <circle cx="1110" cy="190" r="92" fill="#f1d7a4" opacity=".12" />

      <g fill="#e8e6d8" opacity=".28">
        <path d="M76 194c13-28 56-31 75-5 24-14 55 1 56 27H52c0-11 9-20 24-22ZM1027 238c16-32 60-35 82-8 28-15 61 1 63 30H998c1-12 12-21 29-22ZM408 153c11-22 43-24 58-5 20-11 42 1 44 21H387c1-9 9-15 21-16Z" />
      </g>

      <path d="M0 438Q70 405 139 419T267 389Q306 367 345 316Q371 344 410 366T487 288Q518 326 551 341T609 320Q637 344 666 371T731 326Q755 347 782 370T853 298Q883 327 916 351T992 306Q1020 337 1051 368T1125 322Q1160 344 1196 369T1263 302Q1292 326 1321 344T1384 322Q1411 334 1440 344V605H0Z" fill="#819295" />
      <path d="m154 411 58-61 55 39-33-5-22 20ZM281 370l64-54 65 50-38-16-27 22ZM423 344l64-56 64 53-34-18-32 29ZM789 364l64-62 63 49-31-13-30 26ZM1198 367l65-65 58 42-33-5-24 24Z" fill="#a8b0a7" opacity=".36" />
      <path d="M0 501Q52 472 104 452T192 469Q240 446 283 423Q330 450 378 474T475 426Q516 447 559 469T654 426Q693 448 732 466T822 418Q874 443 925 465T1018 423Q1064 442 1110 462T1192 419Q1242 439 1291 458T1377 424Q1409 436 1440 449V900H0Z" fill="#6e8274" />
      <path d="M0 568Q168 492 318 545T624 531Q768 493 916 541T1210 515Q1330 490 1440 532V900H0Z" fill="#5b755f" />

      <path d="M738 912C700 832 776 782 787 730S741 659 755 615 790 577 775 550" fill="none" stroke="#695b48" strokeWidth="38" strokeLinecap="round" opacity=".74" />
      <path d="M738 912C700 832 776 782 787 730S741 659 755 615 790 577 775 550" fill="none" stroke="url(#illustrated-trail)" strokeWidth="30" strokeLinecap="round" opacity=".8" />
      <path d="M738 912C700 832 776 782 787 730S741 659 755 615 790 577 775 550" fill="none" stroke="#d1b58a" strokeOpacity=".22" strokeWidth="1.5" strokeDasharray="3 14" />

      <g opacity=".9">
        {pines.map(([x, y, scale]) => <Pine key={`${x}-${y}`} x={x} y={y} scale={scale} />)}
      </g>

      <g fill="#857d67">
        <path d="m76 794 34-28 39 28-8 11H84ZM1276 790l31-24 38 24-7 12h-56Z" />
        <path d="m363 826 20-16 25 16-5 8h-36ZM1042 840l22-19 26 19-5 8h-37Z" />
      </g>

      <path d="M0 786Q190 732 356 781T702 756Q883 729 1050 780T1440 757V900H0Z" fill="url(#illustrated-foreground)" />
      <path d="M0 790Q190 736 356 785T702 760Q883 733 1050 784T1440 761" fill="none" stroke="#839375" strokeWidth="3" opacity=".55" />
      <Cottage x={112} y={823} scale={0.74} />
      <Cottage x={1312} y={815} scale={0.72} flip />
      <g opacity=".62">
        {pines.filter((_, index) => index % 3 !== 1).map(([x, y, scale]) => (
          <Pine key={`front-${x}-${y}`} x={x + (x < 720 ? -35 : 35)} y={y + 160} scale={scale * 1.28} />
        ))}
      </g>
    </svg>
  );
}
