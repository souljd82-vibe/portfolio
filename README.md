# Vibe Coding Portfolio

바이브 코딩 연습 프로젝트들을 관리하고 전시하는 포트폴리오 웹사이트입니다.

## 🚀 주요 기능

- **프로젝트 관리**: 새로운 프로젝트 추가, 편집, 삭제
- **카테고리 필터링**: 웹, 앱, 게임별로 프로젝트 분류
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **로컬 저장소**: 브라우저 로컬 저장소를 활용한 데이터 영구 보존
- **검색 기능**: 제목, 설명, 기술 스택으로 프로젝트 검색
- **통계 대시보드**: 프로젝트 수, 마지막 업데이트 등 현황 표시

## 📁 파일 구조

```
portfolio/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
└── README.md          # 프로젝트 문서
```

## 🎨 디자인 특징

### 색상 팔레트
- **Primary**: #6366f1 (인디고)
- **Accent**: #10b981 (에메랄드)
- **Background**: #f9fafb (라이트 그레이)
- **Text**: #1f2937 (다크 그레이)

### 기술 스택
- **HTML5**: 시맨틱 구조
- **CSS3**: CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript**: ES6+ 클래스 기반 구조
- **Font Awesome**: 아이콘
- **Google Fonts**: Inter 폰트

## 🛠️ 사용 방법

### 1. 포트폴리오 실행
브라우저에서 `index.html` 파일을 열면 됩니다.

### 2. 새 프로젝트 추가
- **"프로젝트 추가"** 버튼 클릭
- 프로젝트 정보 입력:
  - 제목 (필수)
  - 설명 (필수)
  - 카테고리 (웹/앱/게임)
  - 기술 스택 (쉼표로 구분)
  - 프로젝트 링크
  - 코드 링크 (GitHub 등)
  - 이미지 URL (선택사항)

### 3. 프로젝트 관리
- **편집**: 프로젝트 카드 호버 시 편집 버튼 클릭
- **삭제**: 프로젝트 카드 호버 시 삭제 버튼 클릭
- **필터링**: 상단 네비게이션에서 카테고리별 필터링

### 4. 키보드 단축키
- `Ctrl + N`: 새 프로젝트 추가
- `Escape`: 모달 닫기

## 💾 데이터 저장

프로젝트 데이터는 브라우저의 로컬 저장소(`localStorage`)에 자동 저장됩니다.
- 키: `vibe-portfolio-projects`
- 형식: JSON 배열

### 데이터 구조 예시
```javascript
{
  "id": "생성된ID",
  "title": "프로젝트 제목",
  "description": "프로젝트 설명",
  "category": "web|app|game",
  "tags": ["HTML", "CSS", "JavaScript"],
  "demoLink": "https://demo.example.com",
  "codeLink": "https://github.com/user/repo",
  "imageUrl": "https://image.example.com/screenshot.png",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

## 🎯 확장 가능한 구조

### 새로운 카테고리 추가
`script.js`의 다음 부분을 수정:

```javascript
const categoryIcons = {
    web: 'fas fa-globe',
    app: 'fas fa-mobile-alt',
    game: 'fas fa-gamepad',
    // 새 카테고리 추가
    ai: 'fas fa-robot'
};

const categoryNames = {
    web: '웹',
    app: '앱',
    game: '게임',
    // 새 카테고리 추가
    ai: 'AI'
};
```

HTML의 select 옵션도 업데이트:
```html
<select id="projectCategory" required>
    <option value="">카테고리 선택</option>
    <option value="web">웹</option>
    <option value="app">앱</option>
    <option value="game">게임</option>
    <!-- 새 옵션 추가 -->
    <option value="ai">AI</option>
</select>
```

### 추가 기능 아이디어
- 프로젝트 검색 기능
- 태그별 필터링
- 프로젝트 정렬 (날짜, 제목 등)
- GitHub API 연동
- 이미지 업로드 기능
- 프로젝트 즐겨찾기
- PDF 내보내기
- 다크 모드

## 🌟 특징

### 반응형 디자인
- **모바일**: 1열 그리드, 터치 친화적 버튼
- **태블릿**: 2열 그리드, 적당한 여백
- **데스크톱**: 3열+ 그리드, 호버 효과

### 접근성
- 키보드 네비게이션 지원
- 포커스 표시
- 의미있는 HTML 구조
- ARIA 레이블 (추가 개선 가능)

### 성능
- 바닐라 JavaScript (프레임워크 없음)
- CSS Grid/Flexbox 활용
- 이미지 지연 로딩 준비
- 최소한의 외부 의존성

## 🤝 기여 방법

1. 새로운 기능이나 개선사항 아이디어 제안
2. 버그 발견시 상세한 재현 단계 제공
3. 코드 개선 및 최적화 제안
4. 접근성 및 사용성 피드백

---

**Made with ❤️ for Vibe Coding Practice**