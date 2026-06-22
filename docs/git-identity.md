# Git / GitHub 정체성 규칙 — K-Beauty Cards

**작성:** 2026-06-22
**범위:** 이 저장소(K-Beauty Cards)에 한정

---

## 규칙

이 프로젝트의 모든 git 커밋과 GitHub 활동은 **개인 아이디와 분리된 전용 아이디**로 진행한다.

| 항목 | 값 |
|---|---|
| GitHub / git 사용자명 | `lalangueandseed` |
| 커밋 이메일 | `lalangueandseed@gmail.com` |
| 적용 범위 | **이 저장소 한정** (git `--local` 설정) |

> 다른 개인 프로젝트는 별도 아이디를 계속 사용할 수 있으며, 이 규칙은 본 저장소에만 적용된다.

---

## 배경

- 이 프로젝트는 향후 **유료 사업화**를 계획하고 있어, 커밋 기록을 처음부터 개인 활동 이력과 분리해 둔다.
- 저장소 이관·공개·협업자 합류 시 개인 정체성과 섞이지 않도록 하기 위함.

---

## 적용 방법 (재현용)

저장소 로컬 설정으로 고정한다 (전역 설정과 무관하게 이 프로젝트에만 적용):

```bash
git config --local user.name  "lalangueandseed"
git config --local user.email "lalangueandseed@gmail.com"
```

확인:

```bash
git config --local user.name   # lalangueandseed
git config --local user.email  # lalangueandseed@gmail.com
```

---

## 향후 분리 강화 (사업화 시점 권고)

현재 `lalangueandseed@gmail.com`은 본인 개인 메일과 동일하다. 진짜 사업 정체성 분리를 위해서는 유료화/공개 시점에 한 단계 더 분리할 것을 권장한다.

- [ ] 사업 전용 이메일 확보 (도메인 메일 또는 분리된 gmail)
- [ ] 해당 메일로 별도 GitHub 계정 또는 Organization 생성 → 저장소 이관
- [ ] 핸들을 제품/브랜드명 기반으로 검토 (신뢰도 측면)

> **팁:** 커밋 수가 적을 때 정체성을 바꾸는 비용이 가장 작다. 최종 식별자는 빠를수록 좋다.
