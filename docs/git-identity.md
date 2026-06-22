# Git / GitHub 정체성 방침 — K-Beauty Cards

**작성:** 2026-06-22 (개정)
**범위:** 이 저장소(K-Beauty Cards)

---

## 결론

이 프로젝트는 **단일 개인 계정 `prosaiclee`로 운영**하고, **사업화 시점에 GitHub Organization을 만들어 그쪽으로 저장소를 이전(transfer)** 한다.

> 이전 검토안(전용 개인 계정 `lalangueandseed`로 분리)은 폐기. 이유는 아래 "배경" 참고.

| 항목 | 값 |
|---|---|
| GitHub / git 사용자명 | `prosaiclee` |
| 커밋 이메일 | `150650793+prosaiclee@users.noreply.github.com` (GitHub noreply) |
| 적용 범위 | 이 저장소 한정 (git `--local` 설정) |
| 사업화 시 | GitHub **Organization** 생성 → repo transfer |

---

## 배경 — 왜 두 번째 개인 계정으로 분리하지 않는가

- **사업화의 올바른 그릇은 "두 번째 개인 계정"이 아니라 GitHub Organization이다.** 법인 설립·협업자/투자자 합류 시 표준 절차는 Org 생성 후 repo transfer이며, 그 순간 "이전에 어느 개인 계정에 있었는지"는 무의미해진다.
- 따라서 지금 별도 개인 계정으로 분리해두는 미래 가치는 거의 없고, 두 계정 병행의 **인증 혼동·인지 부담이라는 실재 비용**만 남는다.
- 코드의 법적 소유권은 GitHub 계정과 무관하며, 사업화 시 법인 IP 양도로 정리된다.

## 이전(transfer)이 안전한 근거

- **저장소 transfer는 GitHub 정식 기능** — 커밋 히스토리·이슈·PR·브랜치 보존, 기존 URL 자동 리다이렉트.
- **커밋 attribution은 GitHub 계정이 아니라 커밋 이메일로 귀속** — 호스팅 계정과 독립적.
- 현재 커밋 수가 적어, 필요 시 이메일 표준 변경 비용도 사실상 0.

---

## 적용 방법 (재현용)

```bash
git config --local user.name  "prosaiclee"
git config --local user.email "150650793+prosaiclee@users.noreply.github.com"
```

확인:

```bash
git config --local user.name   # prosaiclee
git config --local user.email  # 150650793+prosaiclee@users.noreply.github.com
git log --format='%an <%ae>'   # 모든 커밋 prosaiclee 확인
```

---

## 사업화 시점 체크리스트

- [ ] GitHub Organization 생성 (제품/브랜드명 기반 권장)
- [ ] 이 저장소를 Organization으로 transfer
- [ ] 로컬 `git remote set-url`로 새 URL 반영
- [ ] (필요 시) 협업자·권한·브랜치 보호 규칙 설정
- [ ] 법인 설립 시 코드 IP 양도 정리
