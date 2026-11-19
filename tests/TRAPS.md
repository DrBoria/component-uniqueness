# TRAPS — adversarial/component

18 посаженных ловушек для движка **component-uniqueness**.
Канон — `tests/NOT_duplicates`, приложение — `tests/duplicates`. Каждая пара: один компонент там, один тут.
Все компоненты — экспортируемые типизированные React-функции в `.tsx`.

Ожидания: `duplicate` ≥ 0.4, `similar` ≥ 0.2, `none` < 0.2.
Из 18 ловушек **13 положительных** и **5 отрицательных** (c04, c09, c14, c17, c18).

## Таблица

| id | категория | механизм | expect | app | canon |
|---|---|---|---|---|---|
| c01 | a11y | `<button>` vs `<div role=button tabIndex>` + ручной Enter/Space | duplicate | `PressableAction` | `PrimaryAction` |
| c02 | a11y | `aria-label` vs визуально скрытый `<span class=sr-only>` | duplicate | `SheetClose` | `DialogDismiss` |
| c03 | a11y | `aria-labelledby` → свой `h2#id` vs `aria-label`+`title` | duplicate | `InvoiceSection` | `BillingRegion` |
| c04 | a11y | **негатив**: те же пиксели, другое объявление для скринридера | none | `RailCollapse` | `NavToggle` |
| c05 | a11y | ARIA-контракт на глубине 5 обёрток vs 3 обёртки | duplicate | `ProfileDropdown` | `AccountMenu` |
| c06 | styles | tailwind vs styled-components, один и тот же итоговый CSS | duplicate | `AmountBadge` | `PriceTag` |
| c07 | styles | tailwind-база переопределена styled → vs готовый inline style | duplicate | `TestimonialPanel` | `QuoteCard` |
| c08 | styles | styled-база переопределена inline → vs tailwind | duplicate | `StateTag` | `StatusChip` |
| c09 | styles | **негатив**: тот же layout, другой цвет/cursor/поведение | similar | `ColumnCaption` | `SortHeader` |
| c10 | styles | `top/left` vs shorthand `inset` | duplicate | `CornerCounter` | `FloatingBadge` |
| c11 | structure | 6 локальных обёрток vs 7 ДРУГИХ обёрток, то же дерево | duplicate | `AlertBanner` | `NoticeCallout` |
| c12 | structure | 5-уровневая цепочка обёрток vs сырой HTML без обёрток | duplicate | `PhotoTile` | `MediaCard` |
| c13 | structure | guard-clause `null` vs тернарник с `undefined` | duplicate | `ZeroState` | `EmptyInbox` |
| c14 | structure | **негатив**: ветки реально меняют дерево | none | `FilterDrawer` | `CollapsibleFilters` |
| c15 | structure | **ФЛАГМАН**: 33 файла по фичам vs 8 файлов styled-примитивов | duplicate | `WorkspaceDashboard` | `ProjectOverview` |
| c16 | behavior | `onEdit/onPress` vs `onChange/onClick` + spread в другом порядке | duplicate | `SubscribePanel` | `NewsletterSignup` |
| c17 | framework | **негатив**: медиа-транспорт vs пагинация, тот же vocabulary | similar | `PlaylistPager` | `TransportControls` |
| c18 | framework | **негатив**: KPI-плитка vs карточка автора, та же оболочка | similar | `AuthorCard` | `StatCard` |

## Намерение по каждой ловушке

### c01 — button vs div[role=button]
Проверяет, что сигнал a11y понимает *эквивалентность роли*, а не только совпадение
тега. У канона настоящий `<button disabled>`, у приложения `<div role="button"
tabIndex aria-disabled>` с ручным `onKeyDown` на Enter/Space. Имя приходит из
внутреннего текста в обоих случаях, бокс идентичен. Лишний обработчик и другой тег
не должны ломать вердикт.

### c02 — aria-label vs скрытый текст
Одна и та же кнопка закрытия, одно и то же доступное имя «Close dialog», но канон
даёт его через `aria-label`, а приложение — через дополнительный `<span
class="sr-only">`. Дерево отличается на один узел; объявление — нет.

### c03 — aria-labelledby vs aria-label+title
Регион с именем «Billing». Канон ссылается `aria-labelledby` на собственный
`h2#billing-heading`; приложение использует `aria-label` плюс избыточный `title`,
убирает `id` и выносит строки `dl` в локальную обёртку `SummaryRow`. Проверяет
резолв ссылки на имя и терпимость к лишнему уровню декомпозиции.

### c04 — негатив: одинаковые пиксели, разное объявление
Самая злая a11y-ловушка. Визуально `RailCollapse` неотличим от `NavToggle`: тот же
размер, рамка, радиус, цвет, hover. Но для скринридера это **другой контрол**:
имя «Collapse sidebar» вместо «Open navigation menu», `aria-pressed` (toggle)
вместо `aria-expanded`+`aria-controls` (disclosure), глиф выставлен как
`role="img"` с собственным именем вместо `aria-hidden`, добавлен
`role="presentation"`-wrapper, и `tabIndex={-1}` вообще убирает элемент из
tab-order. Ожидаем `none`; вердикт `duplicate` — это FAIL.

### c05 — a11y на глубине пяти обёрток
Полноценное ARIA-меню: `role="menu"` + `aria-label="Account"` на списке,
`role="none"` на `li`, `role="menuitem"` + `tabIndex={-1}` на кнопке. Канон
размазывает контракт по пяти файлам (`AccountMenu → MenuSurface → MenuList →
MenuEntry → MenuButton`), приложение сворачивает его в три уровня с другими
именами. Атрибуты живут на 3–5 компонентов ниже точки входа — движок обязан
раскрыть цепочку кросс-файлово, иначе сигнала a11y просто не будет.

### c06 — tailwind vs styled-components
Один и тот же итоговый CSS на ценнике двумя путями. Канон — tailwind
arbitrary-values (`bg-[#0f172a] px-[14px] py-[6px] text-[18px] font-bold`),
приложение — styled-шаблон с shorthand `padding: 6px 14px` и числовым
`font-weight: 700`. Требует настоящего резолва tailwind v4 **и** парсинга
styled-шаблона, плюс нормализации shorthand ↔ longhand.

### c07 — цепочка переопределений: tailwind → styled
Канон навешивает **вводящие в заблуждение** tailwind-классы (`rounded-[4px]
p-[8px] bg-[#eef2ff]`) на `styled.section`, чей шаблон переопределяет радиус,
padding и фон на `12px / 24px / #ffffff`. Рамка от tailwind выживает, потому что
styled её не задаёт. Приложение пишет уже **разрешённый** CSS прямо в
`style={{...}}`. Совпадают только разрешённые стили — наивное сравнение строк
классов даст промах.

### c08 — цепочка переопределений: styled → inline
Та же идея в обратную сторону. Styled-чип канона серый (`#e2e8f0` / `#334155`),
но `style={{ background: "#dcfce7", color: "#166534" }}` переопределяет его в
зелёную палитру «resolved». Приложение выражает ту же зелёную палитру одним шагом
через tailwind. Оба несут одинаковый `onClick` и точку-индикатор.

### c09 — негатив: тот же layout, другой цвет/cursor
`ColumnCaption` повторяет бокс `SortHeader` целиком — высота, padding, радиус,
gap, размер и вес шрифта. Но это статичная подпись: `text-[#94a3b8]` вместо
индиго, `cursor-default` вместо `cursor-pointer`, `<span>` вместо `<button>`, нет
`onClick`, нет `aria-pressed`, нет шеврона. Layout-сигнал совпадёт, а
typography/color/cursor/behavior — нет. Ожидаем `similar`, не `duplicate`.

### c10 — top/left vs inset
Абсолютно позиционированный бейдж уведомлений. Канон: `left-[16px] top-[12px]`.
Приложение: `inset-[12px_auto_auto_16px]`. Чтобы увидеть совпадение, движок должен
разложить shorthand `inset` на четыре стороны и сопоставить с `top`/`left`.

### c11 — шесть обёрток против семи других
Обе цепочки полностью локальные и кросс-файловые. Канон: `CalloutFrame →
CalloutRow → CalloutBody → CalloutTitle/CalloutText` + лист `CalloutGlyph`
(6 компонентов). Приложение: `BannerShell → BannerLead → BannerInner → BannerCopy
→ BannerHeadline/BannerParagraph` + лист `BannerAccent` (7 компонентов), причём
`BannerCopy` — pass-through через фрагмент и **не порождает DOM**. Ни одного
общего имени, другая группировка, другая глубина — то же раскрытое дерево.

### c12 — обёртки против сырого HTML
Канон собирает `figure/img/figcaption` через пять локальных обёрток, включая
`next/image → img`. Приложение рендерит тот же финальный HTML сырыми элементами в
одном компоненте без обёрток вообще. Это и есть корректная форма ловушки
«React vs pure HTML» (`.html`-файлы движок не сканирует).

### c13 — guard-clause против тернарника
Одно и то же пустое состояние, противоположный control flow. Канон:
`if (messages > 0) return null` и дерево после гарда. Приложение: единственный
`return` с тернарником, у которого вторая ветка — `undefined`, плюс вложенный
тернарник с одинаковым текстом на обеих ветках. Для любого входа отрисованное
дерево совпадает.

### c14 — негатив: ветки действительно меняют дерево
Обе версии переключаются по флагу open/expanded и делят домен фильтров, но ветки
реально разные: `fieldset`/`legend`, два чекбокса и одна кнопка Apply — против
`div[role=region]` с `h3`, тремя чекбоксами и дополнительной кнопкой Reset во
flex-ряду. Отличаются структура, a11y и поведение. Ожидаем `none`.

### c15 — ФЛАГМАН
Реалистичная страница project-overview: липкий хедер (бренд, навигация, поиск,
колокол, аватар), сетка из 8 KPI-плиток, 8 строк задач с чекбоксом/приоритетом/
статусом, 3 карточки майлстоунов с progressbar и `next/image`, форма инвайта,
лента активности, ростер команды, футер.

* **Канон** декомпозирован **по фичам**: 33 файла, до 6 уровней вложенности,
  восемь отдельных компонентов-плиток, отдельные `TaskRow`, `ActivityItem`,
  `TeamMember`, `MilestoneCard`.
* **Приложение** декомпозировано **по виду элемента**: 62 styled-примитива в одном
  файле плюс плоские data-driven секции в 8 файлах, полиморфизм `as={Link}`,
  один обобщённый рендерер плиток вместо восьми.

Ни одного общего имени компонента. **Оба раскрываются в одинаковое дерево из
233 HTML-элементов** (проверено авторским экспандером, 0 различающихся строк).

### c16 — разная проводка обработчиков
Та же форма подписки и тот же финальный HTML. Канон передаёт `onEdit`/`onPress`
инлайн-пропсами и инлайн-стрелкой на submit. Приложение собирает spread-объекты
пропсов в другом порядке ключей, использует именованную стрелку изменения и
именованную функцию submit, а листовые пропсы называет конвенционально
(`onChange`/`onClick`, плюс `loading`+`disabled`). Отличается только проводка.

### c17 — негатив: медиа-транспорт против пагинации
Тот же хром панели, тот же словарь «lucide-иконка в круглой кнопке», та же
проводка `onClick`/`onChange`. Но это пагинация: `nav` вместо `div[role=group]`,
`next/link`-якоря вместо кнопок, счётчик страниц вместо play/pause-тумблера и
`select` вместо `input[type=range]`. Общие framework-сигналы и layout при разной
семантике. Ожидаем `similar`.

### c18 — негатив: KPI-плитка против карточки автора
Идентичная оболочка `article`: ширина, рамка, радиус, padding, gap, типографика.
Но содержимое разное: метрика с трендом против аватара, двухстрочного био и
`next/link`-якоря на профиль. Ожидаем `similar`.

## Что автор ожидает как слабые места (честно)

* **c10 (`inset`)** — самый вероятный промах среди положительных: если tailwind-
  резолв не раскладывает `inset-[12px_auto_auto_16px]` в per-side offsets,
  сигнал стилей по позиционированию не совпадёт.
* **c07 / c08 (цепочки переопределений)** — если движок сравнивает классы и
  styled-шаблоны как независимые слои, а не разрешает каскад до итогового CSS,
  обе ловушки будут пропущены или занижены.
* **c04 (негатив)** — самый вероятный ложный `duplicate`: пиксели идентичны, и
  если a11y-сигнал учитывает только наличие ARIA-атрибутов, а не их значения
  (имя, pressed vs expanded, tabindex), пара будет ошибочно склеена.
* **c02** — лишней `span.sr-only` может хватить, чтобы структурный сигнал просел
  ниже порога, если движок не выкидывает визуально скрытые узлы.
* **c15 (флагман)** — риск не в размере, а в `as={Link}` у styled-примитивов и в
  обобщённом рендерере плиток: если полиморфный `as` не резолвится в целевой тег,
  приложение даст `span`/`a`-расхождения по всему дереву.
* **c09 / c17 / c18 (негативы на `similar`)** — самая спорная градация: они могут
  честно упасть в `none` (что тоже приемлемо по формулировке «none или similar»)
  либо, наоборот, быть переоценены в `duplicate` из-за сильного layout-сигнала.

## Проверки, выполненные автором

Только статические, **без запуска движка, eslint и любого CLI движка**:

* все 103 файла фикстур распарсились как TSX — **0 синтаксических ошибок**;
* все относительные импорты резолвятся в существующие файлы — **0 битых**;
* флагманские деревья раскрыты авторским экспандером на чистом TypeScript-
  компиляторе: **233 строки HTML у канона, 233 у приложения, 0 различий**.
