# 콘텐츠 소싱 계획 — K-Beauty Cards

**작성:** 2026-06-22
**대상 학습자:** 한국 여행·쇼핑객 (한국어 초급 + 매장 실전 중심)
**소싱 원칙:** 큐레이션 — 올리브영 랭킹·트렌드는 *단어 선별 신호*로만 사용, 수치/랭킹 자체는 임베드하지 않음
**갱신 주기:** 분기 1회 리뷰 (트렌드 성분·브랜드 변동 반영)

---

## 0. 핵심 발견 — 기존 60장과의 중복 점검

요청하신 4개 카테고리를 현재 [decks.json](../src/data/decks.json)과 대조한 결과:

| 요청 카테고리 | 현재 커버리지 | 작업 성격 |
|---|---|---|
| **브랜드명** | **0장 (공백)** | 🟢 **신규 덱** — 가장 명확한 공백, 최우선 |
| 트렌드 성분 | ingredients 덱 12장 (히알루론산·레티놀·시카·비타민C 등) | 🟡 **보강** — 기존과 안 겹치는 신규 성분만 |
| 제품 종류/카테고리 | basic-skincare + makeup 24장이 상당수 커버 | 🟡 **보강** — 미수록 품목 + 쇼핑객용 매장 어휘 |
| 피부 타입·고민 | shopping·beauty-tips에 일부 산재 (지성/건성/민감성/모공/트러블) | 🟡 **보강** — 미수록 고민·상태어 |

> **권고:** 브랜드는 신규 덱으로, 나머지 셋은 *미수록 항목만 추린 "2탄" 덱* 또는 기존 덱 확장으로. 아래 후보 리스트는 **모두 기존 60장과 중복되지 않도록 선별**했습니다.

---

## 1. 먼저 잠가야 할 규칙 (Conventions)

1. **덱 크기:** 기존과 동일하게 **덱당 12장** 유지(일관성). 후보는 12장보다 넉넉히 제시 → 검수 시 추려서 확정.
2. **로마자 표기:** 기존 스타일(음절 단위 하이픈, 예 `su-bun-keu-rim`)을 표준으로 통일. **브랜드는 `en`에 공식 영문명**, `romanization`은 한글 표기의 음절 로마자.
3. **브랜드 덱 스키마 주의:** `word`=한글 표기(예 이니스프리), `en`=공식 영문명(Innisfree), `meaning_ko/en`=브랜드 설명(가격대·대표 제품·콘셉트). 의미 필드 용도가 단어 덱과 살짝 다름 → 코드/데이터 주석 명시.
4. **라이선스:** 로고·제품 이미지·랭킹 수치는 사용 안 함(현재 이모지만 사용 → 안전 유지). 브랜드명·일반 성분명·카테고리명은 교육적 참조로 사용.

---

## 2. 덱별 후보 어휘 (모두 신규, 검수용)

### 🟢 신규 덱 ① 브랜드명 (가칭 `brands` / 브랜드)
쇼핑객이 매장·패키지에서 즉시 마주치는 브랜드. 한글 읽기 + 외래어 표기 학습 효과 큼.

| 한글 | 로마자 | English | 메모 |
|---|---|---|---|
| 이니스프리 | i-ni-seu-peu-ri | Innisfree | 자연주의, 중저가 |
| 라네즈 | ra-ne-jeu | Laneige | 수분/슬리핑마스크 |
| 설화수 | seol-hwa-su | Sulwhasoo | 한방, 프리미엄 |
| 에뛰드 | e-ttwi-deu | Etude | 색조, 영 타깃 |
| 닥터자르트 | dak-teo-ja-reu-teu | Dr.Jart+ | 더마, 시카페어 |
| 메디힐 | me-di-hil | Mediheal | 마스크팩 강자 |
| 코스알엑스 | ko-seu-al-ek-seu | COSRX | 성분 중심, 글로벌 인기 |
| 아누아 | a-nu-a | Anua | 어성초 토너 |
| 토리든 | to-ri-deun | Torriden | 다이브인 세럼 |
| 라운드랩 | ra-un-deu-raep | Round Lab | 독도 토너 |
| 조선미녀 | jo-seon-mi-nyeo | Beauty of Joseon | 선크림 글로벌 히트 |
| 마녀공장 | ma-nyeo-gong-jang | Manyo Factory | 클렌징오일 |
| 클리오 | keul-li-o | Clio | 색조 |
| 롬앤 | rom-aen | rom&nd | 틴트 인기 |
| 페리페라 | pe-ri-pe-ra | Peripera | 틴트, 영 타깃 |

### 🟡 보강 덱 ② 트렌드 성분 2 (기존 ingredients와 미중복)
| 한글 | 로마자 | English |
|---|---|---|
| PDRN | pi-di-al-en | PDRN (salmon DNA) |
| 콜라겐 | kol-la-gen | collagen |
| 판테놀 | pan-te-nol | panthenol |
| 마데카소사이드 | ma-de-ka-so-sa-i-deu | madecassoside |
| 살리실산 | sal-li-sil-san | salicylic acid (BHA) |
| 아데노신 | a-de-no-sin | adenosine |
| 어성초 | eo-seong-cho | houttuynia extract |
| 알부틴 | al-bu-tin | arbutin |
| 트라넥삼산 | teu-ra-nek-sam-san | tranexamic acid |
| 글루타치온 | geul-lu-ta-chi-on | glutathione |
| 스쿠알란 | seu-ku-al-lan | squalane |
| 글리세린 | geul-li-se-rin | glycerin |

### 🟡 보강 덱 ③ 제품 종류 2 + 매장 어휘 (기존 basic-skincare/makeup와 미중복)
| 한글 | 로마자 | English |
|---|---|---|
| 스킨 | seu-kin | skin (toner, 한국식 표현) |
| 로션 | ro-syeon | lotion (emulsion) |
| 클렌징 오일 | keul-len-jing o-il | cleansing oil |
| 클렌징 워터 | keul-len-jing wo-teo | cleansing water |
| 토너 패드 | to-neo pae-deu | toner pad |
| 마스크팩 | ma-seu-keu-paek | mask pack |
| 코팩 | ko-paek | nose (pore) strip |
| 필링젤 | pil-ling-jel | peeling gel |
| 립밤 | rip-bam | lip balm |
| 핸드크림 | haen-deu-keu-rim | hand cream |
| 향수 | hyang-su | perfume |
| 영양크림 | yeong-yang-keu-rim | nourishing cream |

### 🟡 보강 덱 ④ 피부 고민·상태 (기존 shopping/beauty-tips와 미중복)
| 한글 | 로마자 | English |
|---|---|---|
| 복합성 | bok-hap-seong | combination skin |
| 중성 | jung-seong | normal skin |
| 여드름 | yeo-deu-reum | acne |
| 블랙헤드 | beul-laek-he-deu | blackhead |
| 각질 | gak-jil | dead skin / flaking |
| 홍조 | hong-jo | redness |
| 색소침착 | saek-so-chim-chak | pigmentation |
| 잡티 | jap-ti | blemishes / spots |
| 주름 | ju-reum | wrinkle |
| 탄력 | tal-lyeok | elasticity / firmness |
| 진정 | jin-jeong | soothing / calming |
| 보습 | bo-seup | hydration |
| 자극 | ja-geuk | irritation |
| 피지 | pi-ji | sebum |

---

## 3. 자료 소싱 체크리스트 (큐레이션 작업 시)

각 카드 완성에 필요한 필드별 출처:

- [ ] **단어 선별** — 올영 카테고리/베스트 + 트렌드 기사를 *빈도 신호*로 사용해 위 후보 검증·추가
- [ ] **로마자** — §1 규칙으로 일관 표기 (브랜드는 공식 영문명 확인)
- [ ] **의미(`meaning_ko`/`meaning_en`)** — 쇼핑객 눈높이의 1줄 설명 (성분은 "무슨 효과", 브랜드는 "어떤 브랜드")
- [ ] **예문(`example_ko`/`example_en`)** — **매장 실전 상황** 우선 (예: "민감성 피부에 진정 세럼 추천해 주세요")
- [ ] **이모지** — 기존 톤과 통일
- [ ] **difficulty** — 1~3, 여행객 기준 사용 빈도/발음 난이도로 부여
- [ ] **중복 재확인** — 신규 카드 ID·단어가 기존 60장과 겹치지 않는지 빌드 전 점검

---

## 4. 확정된 결정 (2026-06-22, 권고안대로 진행)

1. ✅ **구조:** 보강 3종 모두 *신규 "2탄" 덱*으로 분리 (기존 덱 미변경).
2. ✅ **덱 크기:** 12장 유지 — 후보에서 추려 덱당 정확히 12장.
3. ✅ **브랜드 덱 의미 필드:** 용도 변경(브랜드 설명)을 `brands` 덱 `description`에 명시.
4. ✅ **로마자 표준:** 기존 음절-하이픈 통용 표기로 통일.

---

## 5. 스프린트와의 관계

이 콘텐츠 작업은 **현 개발 스프린트(데이터 정합성 S1·S2, TTS S3)와 별도 트랙**입니다. 단:
- 콘텐츠가 늘면 **S4(세션 길이/셔플 선택)**의 가치가 커집니다(덱이 12장 초과 시 유용).
- **S3(TTS)** 는 신규 한글 단어가 늘수록 가치 증가 — 발음 학습이 쇼핑객 페르소나에 특히 부합.
- 권고 순서: **개발 스프린트 안정화 → 콘텐츠 트랙 시작.** 단, 위 후보 검수는 병행 가능.

---

## 다음 단계

✅ **완료 (2026-06-22):** 4개 덱 모두 [decks.json](../src/data/decks.json)에 추가 — `brands`·`ingredients-2`·`products-2`·`skin-concerns`, 각 12장(총 60→108장). 의미·예문(매장 실전 상황)·이모지·difficulty 포함, 기존 60장과 ID·단어 무중복 검증 완료.

남은 검수:
- 후보 빈도 신호(올영 베스트/트렌드) 대조로 어휘·예문 미세 조정
- 브랜드 영문명 공식 표기 최종 확인 (rom&nd, Dr.Jart+ 등 특수문자 포함)
- 신규 덱 색상·이모지 톤 검수 후 필요 시 조정
