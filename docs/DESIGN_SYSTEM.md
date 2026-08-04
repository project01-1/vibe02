# Design System

## 원칙

- 미래지향적이되 학습 내용을 압도하지 않는다.
- 깊은 네이비 배경, 블루 인디고 표면, 바이올렛 주 강조, 시안 보조 강조를 사용한다.
- 상태는 색상만으로 전달하지 않고 아이콘·문구를 함께 쓴다.

## 토큰

- Background: `#060B1D`, secondary `#0A1128`
- Surface: `#131F43` 계열 반투명 패널
- Primary: `#6659F6`, secondary `#3BD7E6`
- Success `#57E5B2`, warning `#FFC857`, error `#FF7184`
- Radius: 버튼 12px, 카드 15~20px

## 타이포그래피와 간격

- 시스템 한글 산세리프, 코드에는 Consolas/Monaco.
- 본문 최소 14px(핵심 학습 화면은 상황에 따라 11px 이상), 터치 영역 최소 40px.
- 8px 기반 간격, 섹션 78~108px.

## 접근성·반응형·모션

- 명확한 focus ring, 의미 있는 aria label/live region.
- 1020/760/480px에서 3열 → 2열 → 단일 열로 전환.
- 성공·실행 등 의미 있는 순간만 애니메이션하고 reduced motion에서 최소화한다.
