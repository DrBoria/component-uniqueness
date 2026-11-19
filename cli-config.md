# Component duplicates (component-level funnel)

Scanned 165 app file(s), 165 app component(s) against 109 canonical component(s).

Found 23 duplicate component(s) and 60 similar component(s), plus 15 component(s) grouped under 5 potentially missing component(s), plus 57 raw-html element(s), plus 38 copied part(s).

## High-confidence duplicates (confidence ≥ duplicate threshold) (23)

| Id | Local component | Location | Canonical | Canonical location | Confidence | Top signal | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `duplicate:tests/duplicates/structure/flow/ZeroState.tsx#ZeroState=>tests/NOT_duplicates/structure/flow/EmptyInbox.tsx#EmptyInbox` | ZeroState | `tests/duplicates/structure/flow/ZeroState.tsx:12` | EmptyInbox | `tests/NOT_duplicates/structure/flow/EmptyInbox.tsx:9` | 0.77 | Structure | Replace `ZeroState` with `EmptyInbox` from `tests/NOT_duplicates/structure/flow/EmptyInbox.tsx` — they are the same component. |
| `duplicate:tests/duplicates/a11y/PressableAction.tsx#PressableAction=>tests/NOT_duplicates/a11y/PrimaryAction.tsx#PrimaryAction` | PressableAction | `tests/duplicates/a11y/PressableAction.tsx:11` | PrimaryAction | `tests/NOT_duplicates/a11y/PrimaryAction.tsx:8` | 0.74 | Structure | Replace `PressableAction` with `PrimaryAction` from `tests/NOT_duplicates/a11y/PrimaryAction.tsx` — they are the same component. |
| `duplicate:tests/duplicates/behavior/ActionButton.tsx#ActionButton=>tests/NOT_duplicates/behavior/SubmitControl.tsx#SubmitControl` | ActionButton | `tests/duplicates/behavior/ActionButton.tsx:9` | SubmitControl | `tests/NOT_duplicates/behavior/SubmitControl.tsx:8` | 0.72 | Structure | Replace `ActionButton` with `SubmitControl` from `tests/NOT_duplicates/behavior/SubmitControl.tsx` — they are the same component. |
| `duplicate:tests/duplicates/mui/MuiFormOverrideDup.tsx#MuiFormOverrideDup=>tests/NOT_duplicates/mui/MuiFormOverride.tsx#MuiFormOverride` | MuiFormOverrideDup | `tests/duplicates/mui/MuiFormOverrideDup.tsx:36` | MuiFormOverride | `tests/NOT_duplicates/mui/MuiFormOverride.tsx:36` | 0.68 | Structure | Replace `MuiFormOverrideDup` with `MuiFormOverride` from `tests/NOT_duplicates/mui/MuiFormOverride.tsx` — they are the same component. |
| `duplicate:tests/duplicates/mui/MuiFormOverrideDup.tsx#MuiFormOverrideDup=>tests/NOT_duplicates/mui/MuiForm.tsx#MuiForm` | MuiFormOverrideDup | `tests/duplicates/mui/MuiFormOverrideDup.tsx:36` | MuiForm | `tests/NOT_duplicates/mui/MuiForm.tsx:23` | 0.65 | Structure | Replace `MuiFormOverrideDup` with `MuiForm` from `tests/NOT_duplicates/mui/MuiForm.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/DeliveryTracks.tsx#DeliveryTracks=>tests/NOT_duplicates/flagship/content/main/MilestoneCard.tsx#MilestoneCard` | DeliveryTracks | `tests/duplicates/flagship/DeliveryTracks.tsx:49` | MilestoneCard | `tests/NOT_duplicates/flagship/content/main/MilestoneCard.tsx:5` | 0.65 | Structure | Replace `DeliveryTracks` with `MilestoneCard` from `tests/NOT_duplicates/flagship/content/main/MilestoneCard.tsx` — they are the same component. |
| `duplicate:tests/duplicates/a11y/menu/OptionList.tsx#OptionList=>tests/NOT_duplicates/a11y/menu/MenuList.tsx#MenuList` | OptionList | `tests/duplicates/a11y/menu/OptionList.tsx:9` | MenuList | `tests/NOT_duplicates/a11y/menu/MenuList.tsx:10` | 0.65 | Structure | Replace `OptionList` with `MenuList` from `tests/NOT_duplicates/a11y/menu/MenuList.tsx` — they are the same component. |
| `duplicate:tests/duplicates/structure/banner/BannerShell.tsx#BannerShell=>tests/NOT_duplicates/structure/callout/CalloutFrame.tsx#CalloutFrame` | BannerShell | `tests/duplicates/structure/banner/BannerShell.tsx:8` | CalloutFrame | `tests/NOT_duplicates/structure/callout/CalloutFrame.tsx:8` | 0.65 | Structure | Replace `BannerShell` with `CalloutFrame` from `tests/NOT_duplicates/structure/callout/CalloutFrame.tsx` — they are the same component. |
| `duplicate:tests/duplicates/a11y/SheetClose.tsx#SheetClose=>tests/NOT_duplicates/a11y/DialogDismiss.tsx#DialogDismiss` | SheetClose | `tests/duplicates/a11y/SheetClose.tsx:8` | DialogDismiss | `tests/NOT_duplicates/a11y/DialogDismiss.tsx:8` | 0.64 | Structure | Replace `SheetClose` with `DialogDismiss` from `tests/NOT_duplicates/a11y/DialogDismiss.tsx` — they are the same component. |
| `duplicate:tests/duplicates/behavior/EmailInput.tsx#EmailInput=>tests/NOT_duplicates/behavior/SignupField.tsx#SignupField` | EmailInput | `tests/duplicates/behavior/EmailInput.tsx:7` | SignupField | `tests/NOT_duplicates/behavior/SignupField.tsx:7` | 0.60 | Structure | Replace `EmailInput` with `SignupField` from `tests/NOT_duplicates/behavior/SignupField.tsx` — they are the same component. |
| `duplicate:tests/duplicates/structure/banner/BannerAccent.tsx#BannerAccent=>tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx#CalloutGlyph` | BannerAccent | `tests/duplicates/structure/banner/BannerAccent.tsx:5` | CalloutGlyph | `tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx:5` | 0.59 | Structure | Replace `BannerAccent` with `CalloutGlyph` from `tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx` — they are the same component. |
| `duplicate:tests/duplicates/a11y/InvoiceSection.tsx#InvoiceSection=>tests/NOT_duplicates/a11y/BillingRegion.tsx#BillingRegion` | InvoiceSection | `tests/duplicates/a11y/InvoiceSection.tsx:21` | BillingRegion | `tests/NOT_duplicates/a11y/BillingRegion.tsx:7` | 0.57 | Structure | Replace `InvoiceSection` with `BillingRegion` from `tests/NOT_duplicates/a11y/BillingRegion.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx#BlockedTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | BlockedTile | `tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `BlockedTile` from `tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx#CoverageTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | CoverageTile | `tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `CoverageTile` from `tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/DeploysTile.tsx#DeploysTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | DeploysTile | `tests/NOT_duplicates/flagship/tiles/DeploysTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `DeploysTile` from `tests/NOT_duplicates/flagship/tiles/DeploysTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/IssuesTile.tsx#IssuesTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | IssuesTile | `tests/NOT_duplicates/flagship/tiles/IssuesTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `IssuesTile` from `tests/NOT_duplicates/flagship/tiles/IssuesTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/ShippedTile.tsx#ShippedTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | ShippedTile | `tests/NOT_duplicates/flagship/tiles/ShippedTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `ShippedTile` from `tests/NOT_duplicates/flagship/tiles/ShippedTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/VelocityTile.tsx#VelocityTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | VelocityTile | `tests/NOT_duplicates/flagship/tiles/VelocityTile.tsx:7` | 0.56 | Structure | Replace `MetricTiles` with `VelocityTile` from `tests/NOT_duplicates/flagship/tiles/VelocityTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/CycleTimeTile.tsx#CycleTimeTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | CycleTimeTile | `tests/NOT_duplicates/flagship/tiles/CycleTimeTile.tsx:7` | 0.55 | Structure | Replace `MetricTiles` with `CycleTimeTile` from `tests/NOT_duplicates/flagship/tiles/CycleTimeTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/flagship/tiles/ReviewLatencyTile.tsx#ReviewLatencyTile` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | ReviewLatencyTile | `tests/NOT_duplicates/flagship/tiles/ReviewLatencyTile.tsx:7` | 0.55 | Structure | Replace `MetricTiles` with `ReviewLatencyTile` from `tests/NOT_duplicates/flagship/tiles/ReviewLatencyTile.tsx` — they are the same component. |
| `duplicate:tests/duplicates/structure/banner/AlertBanner.tsx#AlertBanner=>tests/NOT_duplicates/structure/callout/NoticeCallout.tsx#NoticeCallout` | AlertBanner | `tests/duplicates/structure/banner/AlertBanner.tsx:18` | NoticeCallout | `tests/NOT_duplicates/structure/callout/NoticeCallout.tsx:17` | 0.55 | Structure | Replace `AlertBanner` with `NoticeCallout` from `tests/NOT_duplicates/structure/callout/NoticeCallout.tsx` — they are the same component. |
| `duplicate:tests/duplicates/structure/banner/BannerInner.tsx#BannerInner=>tests/NOT_duplicates/structure/callout/CalloutBody.tsx#CalloutBody` | BannerInner | `tests/duplicates/structure/banner/BannerInner.tsx:3` | CalloutBody | `tests/NOT_duplicates/structure/callout/CalloutBody.tsx:3` | 0.55 | Structure | Replace `BannerInner` with `CalloutBody` from `tests/NOT_duplicates/structure/callout/CalloutBody.tsx` — they are the same component. |
| `duplicate:tests/duplicates/structure/banner/BannerLead.tsx#BannerLead=>tests/NOT_duplicates/structure/callout/CalloutRow.tsx#CalloutRow` | BannerLead | `tests/duplicates/structure/banner/BannerLead.tsx:9` | CalloutRow | `tests/NOT_duplicates/structure/callout/CalloutRow.tsx:9` | 0.55 | Structure | Replace `BannerLead` with `CalloutRow` from `tests/NOT_duplicates/structure/callout/CalloutRow.tsx` — they are the same component. |

### Why each one matched

- **ZeroState** — `ZeroState` duplicates canonical `EmptyInbox` — 0.77 (77%) confidence. Use the canonical component instead.
  scores  Structure 94%  ·  Styles 100%  ·  Behavior 50%  ·  Accessibility 67%  ·  Framework 100%  ·  Name 0%
  Structure  94%  structure (tree)
    chain 5/5  ·  quality 94%  ·  CSS agreement 100%
    matched nodes  div, svg, h3, p, button
  Styles  100%  styles (6/6 properties agree across 2 node pair(s))
    div  align-items: center, display: flex, flex-direction: column, gap: 12px, padding-block: 40px, padding-inline: 32px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  67%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  100%  1 shared component usage(s)  (1↔1)
    shared  Inbox
    passed props  Inbox: aria-hidden
  **Fix** — Replace `ZeroState` with `EmptyInbox` from `tests/NOT_duplicates/structure/flow/EmptyInbox.tsx` — they are the same component.

- **PressableAction** — `PressableAction` duplicates canonical `PrimaryAction` — 0.74 (75%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 50%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  100%  structure (tree)
    chain 3/3  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div↔button, svg, span
  Styles  100%  styles (6/6 properties agree across 2 node pair(s))
    div  align-items: center, display: inline-flex, font-size: 13px, gap: 8px, padding-block: 8px, padding-inline: 16px
  Behavior  50%  1 shared event(s)  (2↔1)
    shared  click
    only local  keydown
  Accessibility  100%  1 shared a11y token(s)  (3↔1)
    shared  aria-hidden:true
    only local  aria-disabled:true, role:button
  Name  20%  PressableAction ↔ PrimaryAction
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `PressableAction` with `PrimaryAction` from `tests/NOT_duplicates/a11y/PrimaryAction.tsx` — they are the same component.

- **ActionButton** — `ActionButton` duplicates canonical `SubmitControl` — 0.72 (73%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 50%  ·  Accessibility 100%  ·  Framework 100%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 3/3  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  button, svg, span
  Styles  33%  styles (1/1 properties agree across 2 node pair(s))
    button  font-size: 13px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  100%  1 shared component usage(s)  (1↔1)
    shared  Loader2
    passed props  Loader2: aria-hidden
  **Fix** — Replace `ActionButton` with `SubmitControl` from `tests/NOT_duplicates/behavior/SubmitControl.tsx` — they are the same component.

- **MuiFormOverrideDup** — `MuiFormOverrideDup` duplicates canonical `MuiFormOverride` — 0.68 (68%) confidence. Use the canonical component instead.
  scores  Structure 94%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 90%  ·  Name 40%
  Structure  94%  structure (tree)
    chain 16/17  ·  quality 100%  ·  CSS agreement 0%
    matched nodes  Typography, Alert, Stack, TextField, TextField, FormControl, InputLabel, select, MenuItem, MenuItem, FormHelperText, FormControlLabel, Divider, Stack, button, button
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  submit
  Framework  90%  16 shared component usage(s)  (17↔17)
    shared  Typography, Alert, Stack, TextField, TextField, FormControl, InputLabel, Select, MenuItem, MenuItem, FormHelperText, FormControlLabel, Divider, Stack, Button, Button
    passed props  Typography: component, variant  ·  Alert: severity  ·  Stack: spacing, sx  ·  TextField: fullWidth, label, required, variant  ·  TextField: fullWidth, label, required, type, variant  ·  FormControl: fullWidth, required, variant  ·  InputLabel: id  ·  Select: label, labelId  ·  MenuItem: value  ·  MenuItem: value  ·  FormControlLabel: control, label  ·  Stack: direction, justifyContent, spacing  ·  Button: variant  ·  Button: type, variant
    only local  ElevatedForm
    only canonical  CardForm
  Name  40%  MuiFormOverrideDup ↔ MuiFormOverride
    match  word-overlap  ·  word overlap 67%
  **Fix** — Replace `MuiFormOverrideDup` with `MuiFormOverride` from `tests/NOT_duplicates/mui/MuiFormOverride.tsx` — they are the same component.

- **MuiFormOverrideDup** — `MuiFormOverrideDup` duplicates canonical `MuiForm` — 0.65 (65%) confidence. Use the canonical component instead.
  scores  Structure 92%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 90%  ·  Name 20%
  Structure  92%  structure (tree)
    chain 16/17  ·  quality 98%  ·  CSS agreement 0%
    matched nodes  Typography, Alert, Stack, TextField, TextField, FormControl, InputLabel, select, MenuItem, MenuItem, FormHelperText, FormControlLabel, Divider, Stack, button, button
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  submit
  Framework  90%  16 shared component usage(s)  (17↔17)
    shared  Typography, Alert, Stack, TextField, TextField, FormControl, InputLabel, Select, MenuItem, MenuItem, FormHelperText, FormControlLabel, Divider, Stack, Button, Button
    passed props  Typography: component, variant  ·  Alert: severity  ·  Stack: spacing, sx  ·  TextField: fullWidth, label, required, variant  ·  TextField: fullWidth, label, required, type, variant  ·  FormControl: fullWidth, required, variant  ·  InputLabel: id  ·  Select: label, labelId  ·  MenuItem: value  ·  MenuItem: value  ·  FormControlLabel: control, label  ·  Stack: direction, justifyContent, spacing  ·  Button: variant  ·  Button: type, variant
    only local  ElevatedForm
    only canonical  Box
  Name  20%  MuiFormOverrideDup ↔ MuiForm
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MuiFormOverrideDup` with `MuiForm` from `tests/NOT_duplicates/mui/MuiForm.tsx` — they are the same component.

- **DeliveryTracks** — `DeliveryTracks` duplicates canonical `MilestoneCard` — 0.65 (65%) confidence. Use the canonical component instead.
  scores  Structure 92%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 35%  ·  Name 0%
  Structure  92%  structure (tree)
    chain 11/12  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, img, h3, p, div, div, div, span, footer, span, a
  Styles  100%  styles (17/17 properties agree across 4 node pair(s))
    article  display: flex, flex-direction: column, gap: 8px, padding: 14px, padding-bottom: 14px, padding-left: 14px, padding-right: 14px, padding-top: 14px
    div  align-items: center, display: flex, gap: 8px, flex: 1 1 0%, flex-basis: 0%, flex-grow: 1, height: 6px, overflow: hidden
  Accessibility  100%  5 shared a11y token(s)  (5↔5)
    shared  aria-label: progress, aria-valuemax:true, aria-valuemin:true, aria-valuenow:true, role:progressbar
  Framework  35%  1 shared component usage(s)  (12↔2)
    shared  Image
    passed props  Image: alt, height, src, width
    only local  BoardGrid, BoardCard, CardTitle, CardText, MeterRow, MeterTrack, MeterFill, MeterValue, CardFoot, TinyMuted, TinyLink
    only canonical  Link
  **Fix** — Replace `DeliveryTracks` with `MilestoneCard` from `tests/NOT_duplicates/flagship/content/main/MilestoneCard.tsx` — they are the same component.

- **OptionList** — `OptionList` duplicates canonical `MenuList` — 0.65 (65%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 3/3  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  ul, li, button
  Styles  100%  styles (3/3 properties agree across 3 node pair(s))
    ul  display: flex, flex-direction: column
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  choose
    only canonical  pick
  Accessibility  100%  2 shared a11y token(s)  (2↔2)
    shared  aria-label:account, role:menu
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  OptionRow
    only canonical  MenuEntry
  **Fix** — Replace `OptionList` with `MenuList` from `tests/NOT_duplicates/a11y/menu/MenuList.tsx` — they are the same component.

- **BannerShell** — `BannerShell` duplicates canonical `CalloutFrame` — 0.65 (65%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div
  Styles  100%  styles (8/8 properties agree across 1 node pair(s))
    div  display: flex, flex-direction: column, gap: 8px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  role:alert
  **Fix** — Replace `BannerShell` with `CalloutFrame` from `tests/NOT_duplicates/structure/callout/CalloutFrame.tsx` — they are the same component.

- **SheetClose** — `SheetClose` duplicates canonical `DialogDismiss` — 0.64 (64%) confidence. Use the canonical component instead.
  scores  Structure 67%  ·  Styles 100%  ·  Behavior 50%  ·  Accessibility 50%  ·  Framework 100%  ·  Name 0%
  Structure  67%  structure (tree)
    chain 2/3  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  button, svg
  Styles  100%  styles (8/8 properties agree across 2 node pair(s))
    button  padding: 6px, padding-bottom: 6px, padding-left: 6px, padding-right: 6px, padding-top: 6px, position: absolute, right: 12px, top: 12px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  50%  1 shared a11y token(s)  (1↔2)
    shared  aria-hidden:true
    only canonical  aria-label:close dialog
  Framework  100%  1 shared component usage(s)  (1↔1)
    shared  X
    passed props  X: aria-hidden
  **Fix** — Replace `SheetClose` with `DialogDismiss` from `tests/NOT_duplicates/a11y/DialogDismiss.tsx` — they are the same component.

- **EmailInput** — `EmailInput` duplicates canonical `SignupField` — 0.60 (60%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 100%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 2/2  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  label, input
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    label  font-size: 12px
  Behavior  100%  2 shared event(s)  (2↔2)
    shared  change, click
  **Fix** — Replace `EmailInput` with `SignupField` from `tests/NOT_duplicates/behavior/SignupField.tsx` — they are the same component.

- **BannerAccent** — `BannerAccent` duplicates canonical `CalloutGlyph` — 0.59 (59%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 100%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  svg
  Accessibility  0%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  100%  1 shared component usage(s)  (1↔1)
    shared  Info
    passed props  Info: aria-hidden
  **Fix** — Replace `BannerAccent` with `CalloutGlyph` from `tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx` — they are the same component.

- **InvoiceSection** — `InvoiceSection` duplicates canonical `BillingRegion` — 0.57 (57%) confidence. Use the canonical component instead.
  scores  Structure 93%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 50%  ·  Framework 0%  ·  Name 0%
  Structure  93%  structure (tree)
    chain 9/9  ·  quality 93%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  section, h2, dl, div, dt, dd, div, dt, dd
  Styles  100%  styles (12/12 properties agree across 4 node pair(s))
    section  padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px
    dl  margin: 12px 0 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 12px
    div  display: flex, justify-content: space-between
  Accessibility  50%  0 shared a11y token(s)  (1↔1)
    only local  aria-label:billing
    only canonical  aria-labelledby:billing-heading
  Framework  0%  0 shared component usage(s)  (2↔0)
    only local  SummaryRow, SummaryRow
  **Fix** — Replace `InvoiceSection` with `BillingRegion` from `tests/NOT_duplicates/a11y/BillingRegion.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `BlockedTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ BlockedTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `BlockedTile` from `tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `CoverageTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ CoverageTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `CoverageTile` from `tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `DeploysTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ DeploysTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `DeploysTile` from `tests/NOT_duplicates/flagship/tiles/DeploysTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `IssuesTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ IssuesTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `IssuesTile` from `tests/NOT_duplicates/flagship/tiles/IssuesTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `ShippedTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ ShippedTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `ShippedTile` from `tests/NOT_duplicates/flagship/tiles/ShippedTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `VelocityTile` — 0.56 (56%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 20%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  20%  MetricTiles ↔ VelocityTile
    match  word-overlap  ·  word overlap 33%
  **Fix** — Replace `MetricTiles` with `VelocityTile` from `tests/NOT_duplicates/flagship/tiles/VelocityTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `CycleTimeTile` — 0.55 (55%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 15%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  15%  MetricTiles ↔ CycleTimeTile
    match  word-overlap  ·  word overlap 25%
  **Fix** — Replace `MetricTiles` with `CycleTimeTile` from `tests/NOT_duplicates/flagship/tiles/CycleTimeTile.tsx` — they are the same component.

- **MetricTiles** — `MetricTiles` duplicates canonical `ReviewLatencyTile` — 0.55 (55%) confidence. Use the canonical component instead.
  scores  Structure 71%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 15%
  Structure  71%  structure (tree)
    chain 5/7  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  100%  styles (12/12 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔4)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  Name  15%  MetricTiles ↔ ReviewLatencyTile
    match  word-overlap  ·  word overlap 25%
  **Fix** — Replace `MetricTiles` with `ReviewLatencyTile` from `tests/NOT_duplicates/flagship/tiles/ReviewLatencyTile.tsx` — they are the same component.

- **AlertBanner** — `AlertBanner` duplicates canonical `NoticeCallout` — 0.55 (55%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 6/6  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div, div, svg, div, strong, p
  Styles  100%  styles (18/18 properties agree across 4 node pair(s))
    div  display: flex, flex-direction: column, gap: 8px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px, align-items: flex-start, gap: 10px, flex: 1 1 0%, flex-basis: 0%, flex-grow: 1, gap: 2px
    strong  font-size: 13px
  Framework  0%  0 shared component usage(s)  (6↔5)
    only local  BannerShell, BannerLead, BannerInner, BannerCopy, BannerHeadline, BannerParagraph
    only canonical  CalloutFrame, CalloutRow, CalloutBody, CalloutTitle, CalloutText
  **Fix** — Replace `AlertBanner` with `NoticeCallout` from `tests/NOT_duplicates/structure/callout/NoticeCallout.tsx` — they are the same component.

- **BannerInner** — `BannerInner` duplicates canonical `CalloutBody` — 0.55 (55%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div
  Styles  100%  styles (6/6 properties agree across 1 node pair(s))
    div  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-direction: column, flex-grow: 1, gap: 2px
  **Fix** — Replace `BannerInner` with `CalloutBody` from `tests/NOT_duplicates/structure/callout/CalloutBody.tsx` — they are the same component.

- **BannerLead** — `BannerLead` duplicates canonical `CalloutRow` — 0.55 (55%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 2/2  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div, svg
  Styles  100%  styles (3/3 properties agree across 2 node pair(s))
    div  align-items: flex-start, display: flex, gap: 10px
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  BannerAccent
    only canonical  CalloutGlyph
  **Fix** — Replace `BannerLead` with `CalloutRow` from `tests/NOT_duplicates/structure/callout/CalloutRow.tsx` — they are the same component.

## Weak similarity (similar ≤ confidence < duplicate) (60)

| Id | Local component | Location | Canonical | Canonical location | Confidence | Top signal | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `similar:tests/duplicates/a11y/RailCollapse.tsx#RailCollapse=>tests/NOT_duplicates/a11y/NavToggle.tsx#NavToggle` | RailCollapse | `tests/duplicates/a11y/RailCollapse.tsx:14` | NavToggle | `tests/NOT_duplicates/a11y/NavToggle.tsx:9` | 0.57 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/OptionRow.tsx#OptionRow=>tests/NOT_duplicates/a11y/menu/MenuEntry.tsx#MenuEntry` | OptionRow | `tests/duplicates/a11y/menu/OptionRow.tsx:9` | MenuEntry | `tests/NOT_duplicates/a11y/menu/MenuEntry.tsx:10` | 0.54 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/ProfileDropdown.tsx#ProfileDropdown=>tests/NOT_duplicates/a11y/menu/AccountMenu.tsx#AccountMenu` | ProfileDropdown | `tests/duplicates/a11y/menu/ProfileDropdown.tsx:14` | AccountMenu | `tests/NOT_duplicates/a11y/menu/AccountMenu.tsx:16` | 0.54 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/media/PhotoTile.tsx#PhotoTile=>tests/NOT_duplicates/structure/media/MediaCard.tsx#MediaCard` | PhotoTile | `tests/duplicates/structure/media/PhotoTile.tsx:12` | MediaCard | `tests/NOT_duplicates/structure/media/MediaCard.tsx:15` | 0.54 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styles/TestimonialPanel.tsx#TestimonialPanel=>tests/NOT_duplicates/styles/QuoteCard.tsx#QuoteCard` | TestimonialPanel | `tests/duplicates/styles/TestimonialPanel.tsx:8` | QuoteCard | `tests/NOT_duplicates/styles/QuoteCard.tsx:20` | 0.54 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/WorkQueue.tsx#WorkQueue=>tests/NOT_duplicates/flagship/content/main/TaskRow.tsx#TaskRow` | WorkQueue | `tests/duplicates/flagship/WorkQueue.tsx:34` | TaskRow | `tests/NOT_duplicates/flagship/content/main/TaskRow.tsx:8` | 0.54 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/PaperDup.tsx#PaperDup=>tests/NOT_duplicates/Paper.tsx#Paper` | PaperDup | `tests/duplicates/PaperDup.tsx:8` | Paper | `tests/NOT_duplicates/Paper.tsx:3` | 0.53 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DashboardSidebar.tsx#DashboardSidebar=>tests/NOT_duplicates/flagship/content/aside/OverviewAside.tsx#OverviewAside` | DashboardSidebar | `tests/duplicates/flagship/DashboardSidebar.tsx:49` | OverviewAside | `tests/NOT_duplicates/flagship/content/aside/OverviewAside.tsx:11` | 0.52 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styles/StateTag.tsx#StateTag=>tests/NOT_duplicates/styles/StatusChip.tsx#StatusChip` | StateTag | `tests/duplicates/styles/StateTag.tsx:7` | StatusChip | `tests/NOT_duplicates/styles/StatusChip.tsx:23` | 0.52 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/PlaylistPager.tsx#PlaylistPager=>tests/NOT_duplicates/behavior/TransportControls.tsx#TransportControls` | PlaylistPager | `tests/duplicates/behavior/PlaylistPager.tsx:18` | TransportControls | `tests/NOT_duplicates/behavior/TransportControls.tsx:14` | 0.51 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DashboardColophon.tsx#DashboardColophon=>tests/NOT_duplicates/flagship/content/OverviewFooter.tsx#OverviewFooter` | DashboardColophon | `tests/duplicates/flagship/DashboardColophon.tsx:11` | OverviewFooter | `tests/NOT_duplicates/flagship/content/OverviewFooter.tsx:10` | 0.51 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/MetricTiles.tsx#MetricTiles=>tests/NOT_duplicates/structure/StatCard.tsx#StatCard` | MetricTiles | `tests/duplicates/flagship/MetricTiles.tsx:45` | StatCard | `tests/NOT_duplicates/structure/StatCard.tsx:10` | 0.51 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styles/CornerCounter.tsx#CornerCounter=>tests/NOT_duplicates/styles/FloatingBadge.tsx#FloatingBadge` | CornerCounter | `tests/duplicates/styles/CornerCounter.tsx:6` | FloatingBadge | `tests/NOT_duplicates/styles/FloatingBadge.tsx:6` | 0.50 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/FullBadgeDup.tsx#FullBadgeDup=>tests/NOT_duplicates/Badge.tsx#Badge` | FullBadgeDup | `tests/duplicates/FullBadgeDup.tsx:3` | Badge | `tests/NOT_duplicates/Badge.tsx:3` | 0.48 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styled/StyledBadgeDup.tsx#StyledBadgeDup=>tests/NOT_duplicates/styled/StyledBadge.tsx#StyledBadgeComponent` | StyledBadgeDup | `tests/duplicates/styled/StyledBadgeDup.tsx:15` | StyledBadgeComponent | `tests/NOT_duplicates/styled/StyledBadge.tsx:15` | 0.47 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DashboardMasthead.tsx#DashboardMasthead=>tests/NOT_duplicates/flagship/header/OverviewHeader.tsx#OverviewHeader` | DashboardMasthead | `tests/duplicates/flagship/DashboardMasthead.tsx:31` | OverviewHeader | `tests/NOT_duplicates/flagship/header/OverviewHeader.tsx:13` | 0.47 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styles/AmountBadge.tsx#AmountBadge=>tests/NOT_duplicates/styles/PriceTag.tsx#PriceTag` | AmountBadge | `tests/duplicates/styles/AmountBadge.tsx:27` | PriceTag | `tests/NOT_duplicates/styles/PriceTag.tsx:7` | 0.47 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/PaperDup.tsx#PaperDup=>tests/NOT_duplicates/Panel.tsx#Panel` | PaperDup | `tests/duplicates/PaperDup.tsx:8` | Panel | `tests/NOT_duplicates/Panel.tsx:3` | 0.46 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/OptionList.tsx#OptionList=>tests/NOT_duplicates/a11y/menu/AccountMenu.tsx#AccountMenu` | OptionList | `tests/duplicates/a11y/menu/OptionList.tsx:9` | AccountMenu | `tests/NOT_duplicates/a11y/menu/AccountMenu.tsx:16` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/ProfileDropdown.tsx#ProfileDropdown=>tests/NOT_duplicates/a11y/menu/MenuList.tsx#MenuList` | ProfileDropdown | `tests/duplicates/a11y/menu/ProfileDropdown.tsx:14` | MenuList | `tests/NOT_duplicates/a11y/menu/MenuList.tsx:10` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DeliveryTracks.tsx#DeliveryTracks=>tests/NOT_duplicates/flagship/content/main/MilestoneBoard.tsx#MilestoneBoard` | DeliveryTracks | `tests/duplicates/flagship/DeliveryTracks.tsx:49` | MilestoneBoard | `tests/NOT_duplicates/flagship/content/main/MilestoneBoard.tsx:35` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerHeadline.tsx#BannerHeadline=>tests/NOT_duplicates/structure/callout/CalloutTitle.tsx#CalloutTitle` | BannerHeadline | `tests/duplicates/structure/banner/BannerHeadline.tsx:3` | CalloutTitle | `tests/NOT_duplicates/structure/callout/CalloutTitle.tsx:3` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerParagraph.tsx#BannerParagraph=>tests/NOT_duplicates/structure/callout/CalloutText.tsx#CalloutText` | BannerParagraph | `tests/duplicates/structure/banner/BannerParagraph.tsx:3` | CalloutText | `tests/NOT_duplicates/structure/callout/CalloutText.tsx:3` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/SubscribePanel.tsx#SubscribePanel=>tests/NOT_duplicates/behavior/NewsletterSignup.tsx#NewsletterSignup` | SubscribePanel | `tests/duplicates/behavior/SubscribePanel.tsx:16` | NewsletterSignup | `tests/NOT_duplicates/behavior/NewsletterSignup.tsx:15` | 0.45 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/OptionRow.tsx#OptionRow=>tests/NOT_duplicates/a11y/menu/MenuButton.tsx#MenuButton` | OptionRow | `tests/duplicates/a11y/menu/OptionRow.tsx:9` | MenuButton | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx:9` | 0.43 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/ActionButton.tsx#ActionButton=>tests/NOT_duplicates/a11y/PrimaryAction.tsx#PrimaryAction` | ActionButton | `tests/duplicates/behavior/ActionButton.tsx:9` | PrimaryAction | `tests/NOT_duplicates/a11y/PrimaryAction.tsx:8` | 0.41 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerShell.tsx#BannerShell=>tests/NOT_duplicates/flagship/tiles/TileFrame.tsx#TileFrame` | BannerShell | `tests/duplicates/structure/banner/BannerShell.tsx:8` | TileFrame | `tests/NOT_duplicates/flagship/tiles/TileFrame.tsx:4` | 0.41 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styles/ColumnCaption.tsx#ColumnCaption=>tests/NOT_duplicates/styles/StatusChip.tsx#StatusChip` | ColumnCaption | `tests/duplicates/styles/ColumnCaption.tsx:11` | StatusChip | `tests/NOT_duplicates/styles/StatusChip.tsx:23` | 0.40 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/WorkspaceDashboard.tsx#WorkspaceDashboard=>tests/NOT_duplicates/flagship/ProjectOverview.tsx#ProjectOverview` | WorkspaceDashboard | `tests/duplicates/flagship/WorkspaceDashboard.tsx:36` | ProjectOverview | `tests/NOT_duplicates/flagship/ProjectOverview.tsx:21` | 0.38 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DashboardMasthead.tsx#DashboardMasthead=>tests/NOT_duplicates/flagship/header/SearchBox.tsx#SearchBox` | DashboardMasthead | `tests/duplicates/flagship/DashboardMasthead.tsx:31` | SearchBox | `tests/NOT_duplicates/flagship/header/SearchBox.tsx:9` | 0.37 | Styles | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/menu/OptionList.tsx#OptionList=>tests/NOT_duplicates/a11y/menu/MenuEntry.tsx#MenuEntry` | OptionList | `tests/duplicates/a11y/menu/OptionList.tsx:9` | MenuEntry | `tests/NOT_duplicates/a11y/menu/MenuEntry.tsx:10` | 0.37 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/WorkspaceDashboard.tsx#WorkspaceDashboard=>tests/NOT_duplicates/flagship/content/OverviewContent.tsx#OverviewContent` | WorkspaceDashboard | `tests/duplicates/flagship/WorkspaceDashboard.tsx:36` | OverviewContent | `tests/NOT_duplicates/flagship/content/OverviewContent.tsx:12` | 0.36 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/WorkQueue.tsx#WorkQueue=>tests/NOT_duplicates/flagship/content/main/TaskList.tsx#TaskList` | WorkQueue | `tests/duplicates/flagship/WorkQueue.tsx:34` | TaskList | `tests/NOT_duplicates/flagship/content/main/TaskList.tsx:24` | 0.35 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/PressableAction.tsx#PressableAction=>tests/NOT_duplicates/behavior/SubmitControl.tsx#SubmitControl` | PressableAction | `tests/duplicates/a11y/PressableAction.tsx:11` | SubmitControl | `tests/NOT_duplicates/behavior/SubmitControl.tsx:8` | 0.34 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/PressableAction.tsx#PressableAction=>tests/NOT_duplicates/a11y/DialogDismiss.tsx#DialogDismiss` | PressableAction | `tests/duplicates/a11y/PressableAction.tsx:11` | DialogDismiss | `tests/NOT_duplicates/a11y/DialogDismiss.tsx:8` | 0.32 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerParagraph.tsx#BannerParagraph=>tests/NOT_duplicates/structure/media/MediaNote.tsx#MediaNote` | BannerParagraph | `tests/duplicates/structure/banner/BannerParagraph.tsx:3` | MediaNote | `tests/NOT_duplicates/structure/media/MediaNote.tsx:3` | 0.31 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/AuthorCard.tsx#AuthorCard=>tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx#BlockedTile` | AuthorCard | `tests/duplicates/structure/AuthorCard.tsx:16` | BlockedTile | `tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx:7` | 0.31 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/AuthorCard.tsx#AuthorCard=>tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx#CoverageTile` | AuthorCard | `tests/duplicates/structure/AuthorCard.tsx:16` | CoverageTile | `tests/NOT_duplicates/flagship/tiles/CoverageTile.tsx:7` | 0.31 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/styled/StyledBadgeDup.tsx#StyledBadgeDup=>tests/NOT_duplicates/flagship/tiles/TileDelta.tsx#TileDelta` | StyledBadgeDup | `tests/duplicates/styled/StyledBadgeDup.tsx:15` | TileDelta | `tests/NOT_duplicates/flagship/tiles/TileDelta.tsx:6` | 0.31 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/SheetClose.tsx#SheetClose=>tests/NOT_duplicates/a11y/PrimaryAction.tsx#PrimaryAction` | SheetClose | `tests/duplicates/a11y/SheetClose.tsx:8` | PrimaryAction | `tests/NOT_duplicates/a11y/PrimaryAction.tsx:8` | 0.30 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/flow/FilterDrawer.tsx#FilterDrawer=>tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx#CollapsibleFilters` | FilterDrawer | `tests/duplicates/structure/flow/FilterDrawer.tsx:14` | CollapsibleFilters | `tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx:9` | 0.29 | Styles | No action needed beyond the note. |
| `similar:tests/duplicates/a11y/RailCollapse.tsx#RailCollapse=>tests/NOT_duplicates/flagship/header/NotificationBell.tsx#NotificationBell` | RailCollapse | `tests/duplicates/a11y/RailCollapse.tsx:14` | NotificationBell | `tests/NOT_duplicates/flagship/header/NotificationBell.tsx:3` | 0.29 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/EmailInput.tsx#EmailInput=>tests/NOT_duplicates/a11y/menu/MenuButton.tsx#MenuButton` | EmailInput | `tests/duplicates/behavior/EmailInput.tsx:7` | MenuButton | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx:9` | 0.27 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerInner.tsx#BannerInner=>tests/NOT_duplicates/Box.tsx#Box` | BannerInner | `tests/duplicates/structure/banner/BannerInner.tsx:3` | Box | `tests/NOT_duplicates/Box.tsx:3` | 0.26 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerInner.tsx#BannerInner=>tests/NOT_duplicates/Stack.tsx#Stack` | BannerInner | `tests/duplicates/structure/banner/BannerInner.tsx:3` | Stack | `tests/NOT_duplicates/Stack.tsx:3` | 0.26 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/ActionButton.tsx#ActionButton=>tests/NOT_duplicates/behavior/NewsletterSignup.tsx#NewsletterSignup` | ActionButton | `tests/duplicates/behavior/ActionButton.tsx:9` | NewsletterSignup | `tests/NOT_duplicates/behavior/NewsletterSignup.tsx:15` | 0.25 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/SubscribePanel.tsx#SubscribePanel=>tests/NOT_duplicates/behavior/SignupField.tsx#SignupField` | SubscribePanel | `tests/duplicates/behavior/SubscribePanel.tsx:16` | SignupField | `tests/NOT_duplicates/behavior/SignupField.tsx:7` | 0.25 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/flagship/DashboardSidebar.tsx#DashboardSidebar=>tests/NOT_duplicates/flagship/content/aside/InviteTeammate.tsx#InviteTeammate` | DashboardSidebar | `tests/duplicates/flagship/DashboardSidebar.tsx:49` | InviteTeammate | `tests/NOT_duplicates/flagship/content/aside/InviteTeammate.tsx:7` | 0.25 | Styles | No action needed beyond the note. |
| `similar:tests/duplicates/styles/ColumnCaption.tsx#ColumnCaption=>tests/NOT_duplicates/flagship/tiles/TileDelta.tsx#TileDelta` | ColumnCaption | `tests/duplicates/styles/ColumnCaption.tsx:11` | TileDelta | `tests/NOT_duplicates/flagship/tiles/TileDelta.tsx:6` | 0.25 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerShell.tsx#BannerShell=>tests/NOT_duplicates/Container.tsx#Container` | BannerShell | `tests/duplicates/structure/banner/BannerShell.tsx:8` | Container | `tests/NOT_duplicates/Container.tsx:3` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerAccent.tsx#BannerAccent=>tests/NOT_duplicates/structure/callout/CalloutRow.tsx#CalloutRow` | BannerAccent | `tests/duplicates/structure/banner/BannerAccent.tsx:5` | CalloutRow | `tests/NOT_duplicates/structure/callout/CalloutRow.tsx:9` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/BannerLead.tsx#BannerLead=>tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx#CalloutGlyph` | BannerLead | `tests/duplicates/structure/banner/BannerLead.tsx:9` | CalloutGlyph | `tests/NOT_duplicates/structure/callout/CalloutGlyph.tsx:5` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/PrimaryAction.tsx#PrimaryAction=>tests/NOT_duplicates/a11y/NavToggle.tsx#NavToggle` | PrimaryAction | `tests/duplicates/PrimaryAction.tsx:3` | NavToggle | `tests/NOT_duplicates/a11y/NavToggle.tsx:9` | 0.23 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/SecondaryAction.tsx#SecondaryAction=>tests/NOT_duplicates/a11y/NavToggle.tsx#NavToggle` | SecondaryAction | `tests/duplicates/SecondaryAction.tsx:3` | NavToggle | `tests/NOT_duplicates/a11y/NavToggle.tsx:9` | 0.23 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/TertiaryAction.tsx#TertiaryAction=>tests/NOT_duplicates/a11y/NavToggle.tsx#NavToggle` | TertiaryAction | `tests/duplicates/TertiaryAction.tsx:3` | NavToggle | `tests/NOT_duplicates/a11y/NavToggle.tsx:9` | 0.23 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/behavior/EmailInput.tsx#EmailInput=>tests/NOT_duplicates/a11y/NavToggle.tsx#NavToggle` | EmailInput | `tests/duplicates/behavior/EmailInput.tsx:7` | NavToggle | `tests/NOT_duplicates/a11y/NavToggle.tsx:9` | 0.21 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/structure/banner/AlertBanner.tsx#AlertBanner=>tests/NOT_duplicates/structure/StatCard.tsx#StatCard` | AlertBanner | `tests/duplicates/structure/banner/AlertBanner.tsx:18` | StatCard | `tests/NOT_duplicates/structure/StatCard.tsx:10` | 0.21 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/LabResultCard.tsx#LabResultCard=>tests/NOT_duplicates/Accordion.tsx#Accordion` | LabResultCard | `tests/duplicates/LabResultCard.tsx:3` | Accordion | `tests/NOT_duplicates/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/PatientCard.tsx#PatientCard=>tests/NOT_duplicates/Accordion.tsx#Accordion` | PatientCard | `tests/duplicates/PatientCard.tsx:3` | Accordion | `tests/NOT_duplicates/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |
| `similar:tests/duplicates/VitalsCard.tsx#VitalsCard=>tests/NOT_duplicates/Accordion.tsx#Accordion` | VitalsCard | `tests/duplicates/VitalsCard.tsx:3` | Accordion | `tests/NOT_duplicates/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |

### Why each one matched

- **RailCollapse** — `RailCollapse` looks like canonical `NavToggle`, but not closely enough to call it a copy — 0.57 (57%).
  scores  Structure 67%  ·  Styles 100%  ·  Behavior 50%  ·  Accessibility 10%  ·  Framework 70%  ·  Name 0%
  Structure  67%  structure (tree)
    chain 2/3  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  div↔button, svg
  Styles  100%  styles (5/5 properties agree across 1 node pair(s))
    div  align-items: center, display: inline-flex, height: 36px, justify-content: center, width: 36px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  10%  0 shared a11y token(s)  (6↔4)
    only local  aria-label:collapse sidebar, aria-label:sidebar glyph, aria-pressed:true, role:button, role:img, role:presentation
    only canonical  aria-controls:primary-nav, aria-expanded:true, aria-hidden:true, aria-label:open navigation menu
  Framework  70%  1 shared component usage(s)  (1↔1)
    shared  Menu
  **Fix** — No action needed beyond the note.

- **OptionRow** — `OptionRow` looks like canonical `MenuEntry`, but not closely enough to call it a copy — 0.54 (54%).
  scores  Structure 98%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 2/2  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  li, button
  Styles  33%  styles (1/1 properties agree across 2 node pair(s))
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  click
    only canonical  pick
  Accessibility  100%  1 shared a11y token(s)  (2↔1)
    shared  role:none
    only local  role:menuitem
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  MenuButton
  **Fix** — No action needed beyond the note.

- **ProfileDropdown** — `ProfileDropdown` looks like canonical `AccountMenu`, but not closely enough to call it a copy — 0.54 (54%).
  scores  Structure 98%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 4/4  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  div, ul, li, button
  Styles  100%  styles (9/9 properties agree across 4 node pair(s))
    div  padding: 4px, padding-bottom: 4px, padding-left: 4px, padding-right: 4px, padding-top: 4px, width: 220px
    ul  display: flex, flex-direction: column
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  choose
    only canonical  pick
  Framework  0%  0 shared component usage(s)  (1↔2)
    only local  OptionList
    only canonical  MenuSurface, MenuList
  **Fix** — No action needed beyond the note.

- **PhotoTile** — `PhotoTile` looks like canonical `MediaCard`, but not closely enough to call it a copy — 0.54 (54%).
  scores  Structure 98%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 6/6  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  figure, div, img, figcaption, h3, p
  Styles  100%  styles (10/10 properties agree across 3 node pair(s))
    figure  margin: 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 0, overflow: hidden, width: 280px
    div  height: 160px, position: relative, width: 100%
  Framework  0%  0 shared component usage(s)  (0↔5)
    only canonical  MediaFigure, MediaFrame, MediaCaption, MediaHeading, MediaNote
  **Fix** — No action needed beyond the note.

- **TestimonialPanel** — `TestimonialPanel` looks like canonical `QuoteCard`, but not closely enough to call it a copy — 0.54 (54%).
  scores  Structure 98%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 4/4  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  section, blockquote, footer, span
  Styles  100%  styles (11/11 properties agree across 3 node pair(s))
    section  padding: 24px, padding-bottom: 24px, padding-left: 24px, padding-right: 24px, padding-top: 24px
    footer  margin: 12px 0 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 12px
    span  font-size: 12px
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Surface
  **Fix** — No action needed beyond the note.

- **WorkQueue** — `WorkQueue` looks like canonical `TaskRow`, but not closely enough to call it a copy — 0.54 (54%).
  scores  Structure 75%  ·  Styles 56%  ·  Behavior 50%  ·  Accessibility 75%  ·  Framework 0%  ·  Name 0%
  Structure  75%  structure (tree)
    chain 7/8  ·  quality 86%  ·  CSS agreement 42%  ·  class names differ
    matched nodes  li, input, div, span, span, span, span
  Styles  56%  styles (9/16 properties agree across 3 node pair(s))
    li  align-items: center, display: flex, gap: 12px
    div  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-direction: column, flex-grow: 1
    span  font-size: 13px
    only local  li padding: 12px 20px, li padding-bottom: 12px, li padding-left: 20px, li padding-right: 20px, li padding-top: 12px
    only canonical  li padding-block: 12px, li padding-inline: 20px
  Behavior  50%  1 shared event(s)  (1↔2)
    shared  change
    only canonical  click
  Accessibility  75%  1 shared a11y token(s)  (1↔1)
    shared  aria-label:mark 
  Framework  0%  0 shared component usage(s)  (8↔0)
    only local  RowList, Row, RowCheck, RowMain, RowTitle, RowMeta, OutlinePill, StatusPill
  **Fix** — No action needed beyond the note.

- **PaperDup** — `PaperDup` looks like canonical `Paper`, but not closely enough to call it a copy — 0.53 (53%).
  scores  Structure 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 52%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%
    matched nodes  div
  Name  52%  PaperDup ↔ Paper
    match  fuzzy-name  ·  word overlap 50%
  **Fix** — No action needed beyond the note.

- **DashboardSidebar** — `DashboardSidebar` looks like canonical `OverviewAside`, but not closely enough to call it a copy — 0.52 (52%).
  scores  Structure 94%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  94%  structure (tree)
    chain 23/24  ·  quality 98%  ·  CSS agreement 88%  ·  class names differ
    matched nodes  section, h2, form, label, input, button, section, h2, ol, li, Icon, div, span, span, section, h2, ul, li, img, div, …+3 more
  Styles  100%  styles (24/24 properties agree across 5 node pair(s))
    section  padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px
    ol  display: flex, flex-direction: column, gap: 12px, margin: 12px 0 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 12px, padding: 0, padding-bottom: 0, padding-left: 0, padding-right: 0, padding-top: 0
    li  align-items: flex-start, display: flex, gap: 8px
    div  display: flex, flex-direction: column
    span  font-size: 12px
  Behavior  0%  0 shared event(s)  (2↔2)
    only local  change, submit
    only canonical  invite, inviteemailchange
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (23↔3)
    only local  PaddedPanel, PanelTitle, InviteForm, FieldLabel, TextField, DarkAction, PaddedPanel, PanelTitle, Feed, FeedRow, Icon, FeedMain, FeedText, TinyMuted, PaddedPanel, PanelTitle, Roster, RosterRow, Image, RowMain, RosterName, TinyMuted, TinyLink
    only canonical  InviteTeammate, ActivityFeed, TeamRoster
  **Fix** — No action needed beyond the note.

- **StateTag** — `StateTag` looks like canonical `StatusChip`, but not closely enough to call it a copy — 0.52 (52%).
  scores  Structure 87%  ·  Styles 67%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  87%  structure (tree)
    chain 2/2  ·  quality 87%  ·  CSS agreement 50%  ·  class names differ
    matched nodes  span, span
  Styles  67%  styles (2/2 properties agree across 2 node pair(s))
    span  font-size: 12px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Chip
  **Fix** — No action needed beyond the note.

- **PlaylistPager** — `PlaylistPager` looks like canonical `TransportControls`, but not closely enough to call it a copy — 0.51 (51%).
  scores  Structure 51%  ·  Styles 100%  ·  Behavior 100%  ·  Accessibility 3%  ·  Framework 0%  ·  Name 0%
  Structure  51%  structure (tree)
    chain 6/10  ·  quality 91%  ·  CSS agreement 73%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  nav↔div, a↔button, svg, a↔button, svg, select↔input
  Styles  100%  styles (5/5 properties agree across 3 node pair(s))
    nav  align-items: center, display: flex, gap: 12px, padding-block: 12px, padding-inline: 16px
  Behavior  100%  2 shared event(s)  (2↔2)
    shared  change, click
  Accessibility  3%  1 shared a11y token(s)  (5↔8)
    shared  aria-hidden:true
    only local  aria-label:next page, aria-label:pagination, aria-label:previous page, aria-label:rows per page
    only canonical  aria-label:next track, aria-label:pause, aria-label:playback, aria-label:previous track, aria-label:seek, aria-pressed:true, role:group
  Framework  0%  0 shared component usage(s)  (4↔3)
    only local  Link, ChevronLeft, Link, ChevronRight
    only canonical  SkipBack, Play, SkipForward
  **Fix** — No action needed beyond the note.

- **DashboardColophon** — `DashboardColophon` looks like canonical `OverviewFooter`, but not closely enough to call it a copy — 0.51 (51%).
  scores  Structure 87%  ·  Styles 38%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  87%  structure (tree)
    chain 5/5  ·  quality 87%  ·  CSS agreement 52%  ·  class names differ
    matched nodes  footer, div, p, nav, a
  Styles  38%  styles (8/21 properties agree across 4 node pair(s))
    div  align-items: center, display: flex, justify-content: space-between, max-width: 1120px
    nav  align-items: center, display: flex, gap: 16px
    a  font-size: 12px
    only local  footer padding: 16px 24px, footer padding-bottom: 16px, footer padding-left: 24px, footer padding-right: 24px, footer padding-top: 16px, div margin: 0 auto, div margin-bottom: 0, div margin-left: auto, div margin-right: auto, div margin-top: 0
    only canonical  footer padding-block: 16px, footer padding-inline: 24px, div margin-inline: auto
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-label:footer
  Framework  0%  0 shared component usage(s)  (5↔1)
    only local  PageFoot, FootInner, Copyright, NavBar, FootLink
    only canonical  Link
  **Fix** — No action needed beyond the note.

- **MetricTiles** — `MetricTiles` looks like canonical `StatCard`, but not closely enough to call it a copy — 0.51 (51%).
  scores  Structure 67%  ·  Styles 92%  ·  Behavior 0%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  67%  structure (tree)
    chain 5/7  ·  quality 97%  ·  CSS agreement 89%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  article, header, h3, p, span
  Styles  92%  styles (12/13 properties agree across 3 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    header  align-items: center, display: flex, gap: 6px
    h3  font-size: 12px
    only canonical  article width: 220px
  Accessibility  100%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (7↔1)
    only local  TileGrid, Tile, TileHead, Icon, TileLabel, TileNumber, TileTrend
    only canonical  TrendingUp
  **Fix** — No action needed beyond the note.

- **CornerCounter** — `CornerCounter` looks like canonical `FloatingBadge`, but not closely enough to call it a copy — 0.50 (50%).
  scores  Structure 95%  ·  Styles 79%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  95%  structure (tree)
    chain 2/2  ·  quality 95%  ·  CSS agreement 79%  ·  class names differ
    matched nodes  div, span
  Styles  79%  styles (11/14 properties agree across 2 node pair(s))
    div  height: 64px, position: relative, width: 64px
    span  align-items: center, display: inline-flex, font-size: 11px, height: 20px, justify-content: center, min-width: 20px, padding-inline: 6px, position: absolute
    only local  span inset: 12px auto auto 16px
    only canonical  span left: 16px, span top: 12px
  **Fix** — No action needed beyond the note.

- **FullBadgeDup** — `FullBadgeDup` looks like canonical `Badge`, but not closely enough to call it a copy — 0.48 (49%).
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 35%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: var(--text-xs)
  Name  35%  FullBadgeDup ↔ Badge
    match  fuzzy-name  ·  word overlap 0%
  **Fix** — No action needed beyond the note.

- **StyledBadgeDup** — `StyledBadgeDup` looks like canonical `StyledBadgeComponent`, but not closely enough to call it a copy — 0.47 (47%).
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 20%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: 12px
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  Pill
    only canonical  StyledBadge
  Name  20%  StyledBadgeDup ↔ StyledBadgeComponent
    match  word-overlap  ·  word overlap 33%
  **Fix** — No action needed beyond the note.

- **DashboardMasthead** — `DashboardMasthead` looks like canonical `OverviewHeader`, but not closely enough to call it a copy — 0.47 (47%).
  scores  Structure 90%  ·  Styles 71%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  90%  structure (tree)
    chain 13/14  ·  quality 97%  ·  CSS agreement 84%  ·  class names differ
    matched nodes  header, a, nav, a, form, label, input, button, svg, button, svg, span, img
  Styles  71%  styles (15/21 properties agree across 4 node pair(s))
    header  align-items: center, display: flex, gap: 24px, height: 64px, position: sticky, top: 0, z-index: 10
    form  align-items: center, display: flex, gap: 8px, margin: 0 0 0 auto, margin-bottom: 0, margin-left: auto, margin-right: 0, margin-top: 0
    only local  header padding: 0 24px, header padding-bottom: 0, header padding-left: 24px, header padding-right: 24px, header padding-top: 0
    only canonical  header padding-inline: 24px
  Behavior  0%  0 shared event(s)  (3↔3)
    only local  change, click, submit
    only canonical  open, querychange, search
  Accessibility  0%  0 shared a11y token(s)  (6↔0)
    only local  aria-current:page, aria-hidden:true, aria-label:main, aria-label:notifications, aria-label:search, role:search
  Framework  0%  0 shared component usage(s)  (14↔5)
    only local  TopBar, Wordmark, NavBar, CurrentNavItem, NavItem, SearchForm, ScreenReaderText, SearchField, IconSubmit, Search, RoundIcon, Bell, UnreadDot, Image
    only canonical  BrandMark, PrimaryNav, SearchBox, NotificationBell, HeaderAvatar
  **Fix** — No action needed beyond the note.

- **AmountBadge** — `AmountBadge` looks like canonical `PriceTag`, but not closely enough to call it a copy — 0.47 (47%).
  scores  Structure 92%  ·  Styles 67%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  92%  structure (tree)
    chain 3/3  ·  quality 92%  ·  CSS agreement 46%  ·  class names differ
    matched nodes  span, span, span
  Styles  67%  styles (2/2 properties agree across 2 node pair(s))
    span  font-size: 18px
  Framework  0%  0 shared component usage(s)  (2↔0)
    only local  Tag, Unit
  **Fix** — No action needed beyond the note.

- **PaperDup** — `PaperDup` looks like canonical `Panel`, but not closely enough to call it a copy — 0.46 (46%).
  scores  Structure 98%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  **Fix** — No action needed beyond the note.

- **OptionList** — `OptionList` looks like canonical `AccountMenu`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 75%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  75%  structure (tree)
    chain 3/4  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  ul, li, button
  Styles  100%  styles (3/3 properties agree across 3 node pair(s))
    ul  display: flex, flex-direction: column
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  choose
    only canonical  pick
  Accessibility  0%  0 shared a11y token(s)  (2↔0)
    only local  aria-label:account, role:menu
  Framework  0%  0 shared component usage(s)  (1↔2)
    only local  OptionRow
    only canonical  MenuSurface, MenuList
  **Fix** — No action needed beyond the note.

- **ProfileDropdown** — `ProfileDropdown` looks like canonical `MenuList`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 75%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  75%  structure (tree)
    chain 3/4  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  ul, li, button
  Styles  100%  styles (3/3 properties agree across 3 node pair(s))
    ul  display: flex, flex-direction: column
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  choose
    only canonical  pick
  Accessibility  0%  0 shared a11y token(s)  (0↔2)
    only canonical  aria-label:account, role:menu
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  OptionList
    only canonical  MenuEntry
  **Fix** — No action needed beyond the note.

- **DeliveryTracks** — `DeliveryTracks` looks like canonical `MilestoneBoard`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 75%  ·  Styles 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  75%  structure (tree)
    chain 12/16  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  div, article, img, h3, p, div, div, div, span, footer, span, a
  Styles  100%  styles (25/25 properties agree across 5 node pair(s))
    div  display: grid, gap: 12px, grid-template-columns: repeat(3, minmax(0, 1fr)), padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px, align-items: center, display: flex, gap: 8px, flex: 1 1 0%, flex-basis: 0%, flex-grow: 1, height: 6px, overflow: hidden
    article  display: flex, flex-direction: column, gap: 8px, padding: 14px, padding-bottom: 14px, padding-left: 14px, padding-right: 14px, padding-top: 14px
  Accessibility  0%  0 shared a11y token(s)  (5↔0)
    only local  aria-label: progress, aria-valuemax:true, aria-valuemin:true, aria-valuenow:true, role:progressbar
  Framework  0%  0 shared component usage(s)  (12↔1)
    only local  BoardGrid, BoardCard, Image, CardTitle, CardText, MeterRow, MeterTrack, MeterFill, MeterValue, CardFoot, TinyMuted, TinyLink
    only canonical  MilestoneCard
  **Fix** — No action needed beyond the note.

- **BannerHeadline** — `BannerHeadline` looks like canonical `CalloutTitle`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  strong
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    strong  font-size: 13px
  **Fix** — No action needed beyond the note.

- **BannerParagraph** — `BannerParagraph` looks like canonical `CalloutText`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  p
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    p  font-size: 13px
  **Fix** — No action needed beyond the note.

- **SubscribePanel** — `SubscribePanel` looks like canonical `NewsletterSignup`, but not closely enough to call it a copy — 0.45 (45%).
  scores  Structure 61%  ·  Styles 100%  ·  Behavior 33%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  61%  structure (tree)
    chain 4/6  ·  quality 96%  ·  CSS agreement 81%  ·  1 CSS conflict(s)
    matched nodes  form, label, input, button
  Styles  100%  styles (10/10 properties agree across 2 node pair(s))
    form  display: flex, flex-direction: column, gap: 8px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px, width: 360px
    label  font-size: 12px
  Behavior  33%  1 shared event(s)  (1↔3)
    shared  submit
    only canonical  edit, press
  Framework  0%  0 shared component usage(s)  (2↔2)
    only local  EmailInput, ActionButton
    only canonical  SignupField, SubmitControl
  **Fix** — No action needed beyond the note.

- **OptionRow** — `OptionRow` looks like canonical `MenuButton`, but not closely enough to call it a copy — 0.43 (43%).
  scores  Structure 50%  ·  Styles 33%  ·  Behavior 50%  ·  Accessibility 100%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 1/2  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  button
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    button  font-size: 13px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  100%  1 shared a11y token(s)  (2↔1)
    shared  role:menuitem
    only local  role:none
  **Fix** — No action needed beyond the note.

- **ActionButton** — `ActionButton` looks like canonical `PrimaryAction`, but not closely enough to call it a copy — 0.41 (41%).
  scores  Structure 46%  ·  Styles 67%  ·  Behavior 50%  ·  Accessibility 25%  ·  Framework 0%  ·  Name 30%
  Structure  46%  structure (tree)
    chain 3/3  ·  quality 70%  ·  CSS agreement 30%  ·  4 CSS conflict(s)  ·  class names differ
    matched nodes  button, svg, span
  Styles  67%  styles (2/2 properties agree across 2 node pair(s))
    button  font-size: 13px
    span  font-size: 13px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  25%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (1↔0)
    only local  Loader2
  Name  30%  ActionButton ↔ PrimaryAction
    match  word-overlap  ·  word overlap 50%
  **Fix** — No action needed beyond the note.

- **BannerShell** — `BannerShell` looks like canonical `TileFrame`, but not closely enough to call it a copy — 0.41 (41%).
  scores  Structure 69%  ·  Styles 88%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  69%  structure (tree)
    chain 1/1  ·  quality 76%  ·  CSS agreement 78%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  div↔article
  Styles  88%  styles (7/8 properties agree across 1 node pair(s))
    div  display: flex, flex-direction: column, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    differ  div gap: 8px ≠ 6px
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  role:alert
  **Fix** — No action needed beyond the note.

- **ColumnCaption** — `ColumnCaption` looks like canonical `StatusChip`, but not closely enough to call it a copy — 0.40 (40%).
  scores  Structure 74%  ·  Styles 67%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  74%  structure (tree)
    chain 2/2  ·  quality 74%  ·  CSS agreement 36%  ·  class names differ
    matched nodes  span, span
  Styles  67%  styles (2/2 properties agree across 2 node pair(s))
    span  font-size: 12px
  Behavior  0%  0 shared event(s)  (0↔1)
    only canonical  click
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-disabled:true
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Chip
  **Fix** — No action needed beyond the note.

- **WorkspaceDashboard** — `WorkspaceDashboard` looks like canonical `ProjectOverview`, but not closely enough to call it a copy — 0.38 (38%).
  scores  Structure 67%  ·  Styles 76%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  67%  structure (tree)
    chain 83/118  ·  quality 95%  ·  CSS agreement 75%  ·  class names differ
    matched nodes  div, header, a, nav, a, form, label, input, button, svg, button, svg, span, img, div, main, section, header, h2, button, …+63 more
  Styles  76%  styles (41/54 properties agree across 9 node pair(s))
    div  display: flex, flex-direction: column, min-height: 100vh, flex: 1 1 0%, flex-basis: 0%, flex-grow: 1, gap: 24px, max-width: 1120px, width: 100%, display: grid, gap: 12px, grid-template-columns: repeat(3, minmax(0, 1fr)), padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px, align-items: center, gap: 8px, height: 6px, overflow: hidden
    main  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-direction: column, flex-grow: 1, gap: 24px
    article  display: flex, flex-direction: column, gap: 8px, padding: 14px, padding-bottom: 14px, padding-left: 14px, padding-right: 14px, padding-top: 14px
    only local  div margin: 0 auto, div margin-bottom: 0, div margin-left: auto, div margin-right: auto, div margin-top: 0, div padding: 24px, div padding-bottom: 24px, div padding-left: 24px, div padding-right: 24px, div padding-top: 24px
    only canonical  div margin-inline: auto, div padding-block: 24px, div padding-inline: 24px
  Behavior  0%  0 shared event(s)  (6↔6)
    only local  click, email, runsearch, sendinvite, term, toggle
    only canonical  invite, inviteemailchange, newtask, querychange, search, toggletask
  Framework  0%  0 shared component usage(s)  (22↔3)
    only local  Shell, DashboardMasthead, Body, Primary, Panel, PanelHead, PanelTitle, PrimaryAction, MetricTiles, Panel, PanelHead, PanelTitle, CountPill, WorkQueue, Panel, PanelHead, PanelTitle, MutedNote, DeliveryTracks, Secondary, DashboardSidebar, DashboardColophon
    only canonical  OverviewHeader, OverviewContent, OverviewFooter
  **Fix** — No action needed beyond the note.

- **DashboardMasthead** — `DashboardMasthead` looks like canonical `SearchBox`, but not closely enough to call it a copy — 0.37 (37%).
  scores  Structure 0%  ·  Styles 100%  ·  Behavior 100%  ·  Accessibility 36%  ·  Framework 35%  ·  Name 0%
  Structure  0%  structure (tree)
    chain 5/14  ·  quality 95%  ·  CSS agreement 85%  ·  class names differ
    matched nodes  form, label, input, button, svg
  Styles  100%  styles (8/8 properties agree across 3 node pair(s))
    form  align-items: center, display: flex, gap: 8px, margin: 0 0 0 auto, margin-bottom: 0, margin-left: auto, margin-right: 0, margin-top: 0
  Behavior  100%  3 shared event(s)  (3↔3)
    shared  change, click, submit
  Accessibility  36%  3 shared a11y token(s)  (6↔3)
    shared  aria-hidden:true, aria-label:search, role:search
    only local  aria-current:page, aria-label:main, aria-label:notifications
  Framework  35%  1 shared component usage(s)  (14↔1)
    shared  Search
    passed props  Search: aria-hidden
    only local  TopBar, Wordmark, NavBar, CurrentNavItem, NavItem, SearchForm, ScreenReaderText, SearchField, IconSubmit, RoundIcon, Bell, UnreadDot, Image
  **Fix** — No action needed beyond the note.

- **OptionList** — `OptionList` looks like canonical `MenuEntry`, but not closely enough to call it a copy — 0.37 (37%).
  scores  Structure 67%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 50%  ·  Framework 0%  ·  Name 0%
  Structure  67%  structure (tree)
    chain 2/3  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  li, button
  Styles  33%  styles (1/1 properties agree across 2 node pair(s))
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  choose
    only canonical  pick
  Accessibility  50%  0 shared a11y token(s)  (2↔1)
    only local  aria-label:account, role:menu
    only canonical  role:none
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  OptionRow
    only canonical  MenuButton
  **Fix** — No action needed beyond the note.

- **WorkspaceDashboard** — `WorkspaceDashboard` looks like canonical `OverviewContent`, but not closely enough to call it a copy — 0.36 (36%).
  scores  Structure 62%  ·  Styles 75%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  62%  structure (tree)
    chain 64/99  ·  quality 95%  ·  CSS agreement 75%  ·  class names differ
    matched nodes  div, main, section, header, h2, button, div, article, header, h3, p, span, section, header, h2, span, ul, li, input, div, …+44 more
  Styles  75%  styles (38/51 properties agree across 8 node pair(s))
    div  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-grow: 1, gap: 24px, max-width: 1120px, width: 100%, display: grid, gap: 12px, grid-template-columns: repeat(3, minmax(0, 1fr)), padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px, align-items: center, gap: 8px, height: 6px, overflow: hidden
    main  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-direction: column, flex-grow: 1, gap: 24px
    article  display: flex, flex-direction: column, gap: 8px, padding: 14px, padding-bottom: 14px, padding-left: 14px, padding-right: 14px, padding-top: 14px
    only local  div margin: 0 auto, div margin-bottom: 0, div margin-left: auto, div margin-right: auto, div margin-top: 0, div padding: 24px, div padding-bottom: 24px, div padding-left: 24px, div padding-right: 24px, div padding-top: 24px
    only canonical  div margin-inline: auto, div padding-block: 24px, div padding-inline: 24px
  Behavior  0%  0 shared event(s)  (6↔4)
    only local  click, email, runsearch, sendinvite, term, toggle
    only canonical  invite, inviteemailchange, newtask, toggletask
  Framework  0%  0 shared component usage(s)  (22↔2)
    only local  Shell, DashboardMasthead, Body, Primary, Panel, PanelHead, PanelTitle, PrimaryAction, MetricTiles, Panel, PanelHead, PanelTitle, CountPill, WorkQueue, Panel, PanelHead, PanelTitle, MutedNote, DeliveryTracks, Secondary, DashboardSidebar, DashboardColophon
    only canonical  OverviewMain, OverviewAside
  **Fix** — No action needed beyond the note.

- **WorkQueue** — `WorkQueue` looks like canonical `TaskList`, but not closely enough to call it a copy — 0.35 (35%).
  scores  Structure 59%  ·  Styles 75%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  59%  structure (tree)
    chain 8/12  ·  quality 88%  ·  CSS agreement 56%  ·  class names differ
    matched nodes  ul, li, input, div, span, span, span, span
  Styles  75%  styles (21/28 properties agree across 4 node pair(s))
    ul  display: flex, flex-direction: column, margin: 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 0, padding: 0, padding-bottom: 0, padding-left: 0, padding-right: 0, padding-top: 0
    li  align-items: center, display: flex, gap: 12px
    div  display: flex, flex: 1 1 0%, flex-basis: 0%, flex-direction: column, flex-grow: 1
    span  font-size: 13px
    only local  li padding: 12px 20px, li padding-bottom: 12px, li padding-left: 20px, li padding-right: 20px, li padding-top: 12px
    only canonical  li padding-block: 12px, li padding-inline: 20px
  Behavior  0%  0 shared event(s)  (1↔1)
    only local  change
    only canonical  toggletask
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-label:mark 
  Framework  0%  0 shared component usage(s)  (8↔1)
    only local  RowList, Row, RowCheck, RowMain, RowTitle, RowMeta, OutlinePill, StatusPill
    only canonical  TaskRow
  **Fix** — No action needed beyond the note.

- **PressableAction** — `PressableAction` looks like canonical `SubmitControl`, but not closely enough to call it a copy — 0.34 (34%).
  scores  Structure 46%  ·  Styles 38%  ·  Behavior 50%  ·  Accessibility 25%  ·  Framework 0%  ·  Name 0%
  Structure  46%  structure (tree)
    chain 3/3  ·  quality 70%  ·  CSS agreement 30%  ·  4 CSS conflict(s)  ·  class names differ
    matched nodes  div↔button, svg, span
  Styles  38%  styles (5/13 properties agree across 2 node pair(s))
    div  align-items: center, display: inline-flex, font-size: 13px, padding-block: 8px
    span  font-size: 13px
    differ  div gap: 8px ≠ 6px, div padding-inline: 16px ≠ 14px
    only canonical  div justify-content: center, div margin: 4px 0 0, div margin-bottom: 0, div margin-left: 0, div margin-right: 0, div margin-top: 4px
  Behavior  50%  1 shared event(s)  (2↔1)
    shared  click
    only local  keydown
  Accessibility  25%  1 shared a11y token(s)  (3↔1)
    shared  aria-hidden:true
    only local  aria-disabled:true, role:button
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Loader2
  **Fix** — No action needed beyond the note.

- **PressableAction** — `PressableAction` looks like canonical `DialogDismiss`, but not closely enough to call it a copy — 0.32 (32%).
  scores  Structure 49%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 50%  ·  Framework 0%  ·  Name 0%
  Structure  49%  structure (tree)
    chain 2/3  ·  quality 73%  ·  CSS agreement 12%  ·  class names differ
    matched nodes  div↔button, svg
  Styles  0%  styles (0/14 properties agree across 2 node pair(s))
    only local  div align-items: center, div display: inline-flex, div font-size: 13px, div gap: 8px, div padding-block: 8px, div padding-inline: 16px
    only canonical  div padding: 6px, div padding-bottom: 6px, div padding-left: 6px, div padding-right: 6px, div padding-top: 6px, div position: absolute, div right: 12px, div top: 12px
  Behavior  50%  1 shared event(s)  (2↔1)
    shared  click
    only local  keydown
  Accessibility  50%  1 shared a11y token(s)  (3↔2)
    shared  aria-hidden:true
    only local  aria-disabled:true, role:button
    only canonical  aria-label:close dialog
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  X
  **Fix** — No action needed beyond the note.

- **BannerParagraph** — `BannerParagraph` looks like canonical `MediaNote`, but not closely enough to call it a copy — 0.31 (31%).
  scores  Structure 79%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  79%  structure (tree)
    chain 1/1  ·  quality 89%  ·  CSS agreement 71%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  p
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    differ  p font-size: 13px ≠ 12px
  **Fix** — No action needed beyond the note.

- **AuthorCard** — `AuthorCard` looks like canonical `BlockedTile`, but not closely enough to call it a copy — 0.31 (31%).
  scores  Structure 49%  ·  Styles 80%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  49%  structure (tree)
    chain 3/5  ·  quality 91%  ·  CSS agreement 78%  ·  2 CSS conflict(s)  ·  class names differ
    matched nodes  article, h3, p
  Styles  80%  styles (8/10 properties agree across 2 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    differ  p font-size: 12px ≠ 24px
    only local  article width: 220px
  Accessibility  0%  0 shared a11y token(s)  (0↔1)
    only canonical  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (2↔4)
    only local  Image, Link
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  **Fix** — No action needed beyond the note.

- **AuthorCard** — `AuthorCard` looks like canonical `CoverageTile`, but not closely enough to call it a copy — 0.31 (31%).
  scores  Structure 49%  ·  Styles 80%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  49%  structure (tree)
    chain 3/5  ·  quality 91%  ·  CSS agreement 78%  ·  2 CSS conflict(s)  ·  class names differ
    matched nodes  article, h3, p
  Styles  80%  styles (8/10 properties agree across 2 node pair(s))
    article  display: flex, flex-direction: column, gap: 6px, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    differ  p font-size: 12px ≠ 24px
    only local  article width: 220px
  Accessibility  0%  0 shared a11y token(s)  (0↔1)
    only canonical  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (2↔4)
    only local  Image, Link
    only canonical  TileFrame, TileHeading, TileValue, TileDelta
  **Fix** — No action needed beyond the note.

- **StyledBadgeDup** — `StyledBadgeDup` looks like canonical `TileDelta`, but not closely enough to call it a copy — 0.31 (31%).
  scores  Structure 65%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  65%  structure (tree)
    chain 1/1  ·  quality 65%  ·  CSS agreement 13%  ·  class names differ
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: 12px
  Framework  0%  0 shared component usage(s)  (1↔0)
    only local  Pill
  **Fix** — No action needed beyond the note.

- **SheetClose** — `SheetClose` looks like canonical `PrimaryAction`, but not closely enough to call it a copy — 0.30 (30%).
  scores  Structure 49%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 25%  ·  Framework 0%  ·  Name 0%
  Structure  49%  structure (tree)
    chain 2/3  ·  quality 73%  ·  CSS agreement 12%  ·  class names differ
    matched nodes  button, svg
  Styles  0%  styles (0/14 properties agree across 2 node pair(s))
    only local  button padding: 6px, button padding-bottom: 6px, button padding-left: 6px, button padding-right: 6px, button padding-top: 6px, button position: absolute, button right: 12px, button top: 12px
    only canonical  button align-items: center, button display: inline-flex, button font-size: 13px, button gap: 8px, button padding-block: 8px, button padding-inline: 16px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  25%  1 shared a11y token(s)  (1↔1)
    shared  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (1↔0)
    only local  X
  **Fix** — No action needed beyond the note.

- **FilterDrawer** — `FilterDrawer` looks like canonical `CollapsibleFilters`, but not closely enough to call it a copy — 0.29 (30%).
  scores  Structure 0%  ·  Styles 100%  ·  Behavior 50%  ·  Accessibility 50%  ·  Framework 0%  ·  Name 20%
  Structure  0%  structure (tree)
    chain 6/14  ·  quality 98%  ·  CSS agreement 93%  ·  class names differ
    matched nodes  div, label, input, label, input, button
  Styles  100%  styles (15/15 properties agree across 4 node pair(s))
    div  padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px, display: flex, flex-direction: column, gap: 8px, margin: 12px 0 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 12px
    label  font-size: 13px
    input  font-size: 13px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  50%  1 shared a11y token(s)  (3↔1)
    shared  aria-expanded:true
    only local  aria-label:product filters, role:region
  Name  20%  FilterDrawer ↔ CollapsibleFilters
    match  word-overlap  ·  word overlap 33%
  **Fix** — No action needed beyond the note.

- **RailCollapse** — `RailCollapse` looks like canonical `NotificationBell`, but not closely enough to call it a copy — 0.29 (29%).
  scores  Structure 34%  ·  Styles 45%  ·  Behavior 50%  ·  Accessibility 10%  ·  Framework 0%  ·  Name 0%
  Structure  34%  structure (tree)
    chain 2/3  ·  quality 77%  ·  CSS agreement 50%  ·  2 CSS conflict(s)  ·  class names differ
    matched nodes  div↔button, svg
  Styles  45%  styles (5/11 properties agree across 2 node pair(s))
    div  align-items: center, display: inline-flex, height: 36px, justify-content: center, width: 36px
    only canonical  div position: relative, span height: 8px, span position: absolute, span right: 6px, span top: 6px, span width: 8px
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  10%  0 shared a11y token(s)  (6↔2)
    only local  aria-label:collapse sidebar, aria-label:sidebar glyph, aria-pressed:true, role:button, role:img, role:presentation
    only canonical  aria-hidden:true, aria-label:notifications
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  Menu
    only canonical  Bell
  **Fix** — No action needed beyond the note.

- **EmailInput** — `EmailInput` looks like canonical `MenuButton`, but not closely enough to call it a copy — 0.27 (27%).
  scores  Structure 36%  ·  Styles 33%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  36%  structure (tree)
    chain 1/2  ·  quality 71%  ·  CSS agreement 29%  ·  class names differ
    matched nodes  input↔button
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    input  font-size: 13px
  Behavior  50%  1 shared event(s)  (2↔1)
    shared  click
    only local  change
  Accessibility  0%  0 shared a11y token(s)  (0↔1)
    only canonical  role:menuitem
  **Fix** — No action needed beyond the note.

- **BannerInner** — `BannerInner` looks like canonical `Box`, but not closely enough to call it a copy — 0.26 (26%).
  scores  Structure 51%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  51%  structure (tree)
    chain 1/1  ·  quality 71%  ·  CSS agreement 29%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  div
  Styles  33%  styles (2/6 properties agree across 1 node pair(s))
    div  display: flex, flex-direction: column
    differ  div gap: 2px ≠ calc(var(--spacing) * 2)
    only local  div flex: 1 1 0%, div flex-basis: 0%, div flex-grow: 1
  **Fix** — No action needed beyond the note.

- **BannerInner** — `BannerInner` looks like canonical `Stack`, but not closely enough to call it a copy — 0.26 (26%).
  scores  Structure 51%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  51%  structure (tree)
    chain 1/1  ·  quality 71%  ·  CSS agreement 29%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  div
  Styles  33%  styles (2/6 properties agree across 1 node pair(s))
    div  display: flex, flex-direction: column
    differ  div gap: 2px ≠ calc(var(--spacing) * 3)
    only local  div flex: 1 1 0%, div flex-basis: 0%, div flex-grow: 1
  **Fix** — No action needed beyond the note.

- **ActionButton** — `ActionButton` looks like canonical `NewsletterSignup`, but not closely enough to call it a copy — 0.25 (25%).
  scores  Structure 50%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 3/6  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  button, svg, span
  Styles  33%  styles (1/1 properties agree across 2 node pair(s))
    button  font-size: 13px
  Behavior  0%  0 shared event(s)  (1↔3)
    only local  click
    only canonical  edit, press, submit
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (1↔2)
    only local  Loader2
    only canonical  SignupField, SubmitControl
  **Fix** — No action needed beyond the note.

- **SubscribePanel** — `SubscribePanel` looks like canonical `SignupField`, but not closely enough to call it a copy — 0.25 (25%).
  scores  Structure 50%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 2/4  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  label, input
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    label  font-size: 12px
  Behavior  0%  0 shared event(s)  (1↔2)
    only local  submit
    only canonical  change, click
  Framework  0%  0 shared component usage(s)  (2↔0)
    only local  EmailInput, ActionButton
  **Fix** — No action needed beyond the note.

- **DashboardSidebar** — `DashboardSidebar` looks like canonical `InviteTeammate`, but not closely enough to call it a copy — 0.25 (25%).
  scores  Structure 0%  ·  Styles 100%  ·  Behavior 67%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  0%  structure (tree)
    chain 6/23  ·  quality 91%  ·  CSS agreement 64%  ·  class names differ
    matched nodes  section, h2, form, label, input, button
  Styles  100%  styles (14/14 properties agree across 3 node pair(s))
    section  padding: 20px, padding-bottom: 20px, padding-left: 20px, padding-right: 20px, padding-top: 20px
    form  display: flex, flex-direction: column, gap: 8px, margin: 12px 0 0, margin-bottom: 0, margin-left: 0, margin-right: 0, margin-top: 12px
    label  font-size: 12px
  Behavior  67%  2 shared event(s)  (2↔3)
    shared  change, submit
    only canonical  click
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (23↔0)
    only local  PaddedPanel, PanelTitle, InviteForm, FieldLabel, TextField, DarkAction, PaddedPanel, PanelTitle, Feed, FeedRow, Icon, FeedMain, FeedText, TinyMuted, PaddedPanel, PanelTitle, Roster, RosterRow, Image, RowMain, RosterName, TinyMuted, TinyLink
  **Fix** — No action needed beyond the note.

- **ColumnCaption** — `ColumnCaption` looks like canonical `TileDelta`, but not closely enough to call it a copy — 0.25 (25%).
  scores  Structure 50%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 1/2  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: 12px
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-disabled:true
  **Fix** — No action needed beyond the note.

- **BannerShell** — `BannerShell` looks like canonical `Container`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 60%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  60%  structure (tree)
    chain 1/1  ·  quality 60%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  Styles  0%  styles (0/10 properties agree across 1 node pair(s))
    only local  div display: flex, div flex-direction: column, div gap: 8px, div padding: 16px, div padding-bottom: 16px, div padding-left: 16px, div padding-right: 16px, div padding-top: 16px
    only canonical  div margin-inline: auto, div max-width: var(--container-2xl)
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  role:alert
  **Fix** — No action needed beyond the note.

- **BannerAccent** — `BannerAccent` looks like canonical `CalloutRow`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 50%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 1/2  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  svg
  Accessibility  0%  0 shared a11y token(s)  (1↔0)
    only local  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  Info
    only canonical  CalloutGlyph
  **Fix** — No action needed beyond the note.

- **BannerLead** — `BannerLead` looks like canonical `CalloutGlyph`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 50%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  50%  structure (tree)
    chain 1/2  ·  quality 100%  ·  CSS agreement 100%  ·  class names differ
    matched nodes  svg
  Accessibility  0%  0 shared a11y token(s)  (0↔1)
    only canonical  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (1↔1)
    only local  BannerAccent
    only canonical  Info
  **Fix** — No action needed beyond the note.

- **PrimaryAction** — `PrimaryAction` looks like canonical `NavToggle`, but not closely enough to call it a copy — 0.23 (23%).
  scores  Structure 38%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  38%  structure (tree)
    chain 1/2  ·  quality 75%  ·  CSS agreement 38%  ·  class names differ
    matched nodes  button
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    only local  button font-size: var(--text-sm)
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:primary-nav, aria-expanded:true, aria-hidden:true, aria-label:open navigation menu
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Menu
  **Fix** — No action needed beyond the note.

- **SecondaryAction** — `SecondaryAction` looks like canonical `NavToggle`, but not closely enough to call it a copy — 0.23 (23%).
  scores  Structure 38%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  38%  structure (tree)
    chain 1/2  ·  quality 75%  ·  CSS agreement 38%  ·  class names differ
    matched nodes  button
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    only local  button font-size: var(--text-sm)
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:primary-nav, aria-expanded:true, aria-hidden:true, aria-label:open navigation menu
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Menu
  **Fix** — No action needed beyond the note.

- **TertiaryAction** — `TertiaryAction` looks like canonical `NavToggle`, but not closely enough to call it a copy — 0.23 (23%).
  scores  Structure 38%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  38%  structure (tree)
    chain 1/2  ·  quality 75%  ·  CSS agreement 38%  ·  class names differ
    matched nodes  button
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    only local  button font-size: var(--text-sm)
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:primary-nav, aria-expanded:true, aria-hidden:true, aria-label:open navigation menu
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Menu
  **Fix** — No action needed beyond the note.

- **EmailInput** — `EmailInput` looks like canonical `NavToggle`, but not closely enough to call it a copy — 0.21 (21%).
  scores  Structure 33%  ·  Styles 0%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  33%  structure (tree)
    chain 1/2  ·  quality 66%  ·  CSS agreement 14%  ·  class names differ
    matched nodes  input↔button
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    only local  input font-size: 13px
  Behavior  50%  1 shared event(s)  (2↔1)
    shared  click
    only local  change
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:primary-nav, aria-expanded:true, aria-hidden:true, aria-label:open navigation menu
  Framework  0%  0 shared component usage(s)  (0↔1)
    only canonical  Menu
  **Fix** — No action needed beyond the note.

- **AlertBanner** — `AlertBanner` looks like canonical `StatCard`, but not closely enough to call it a copy — 0.21 (21%).
  scores  Structure 27%  ·  Styles 67%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  27%  structure (tree)
    chain 4/6  ·  quality 68%  ·  CSS agreement 43%  ·  6 CSS conflict(s)  ·  class names differ
    matched nodes  div↔article, div↔header, svg, p
  Styles  67%  styles (8/12 properties agree across 3 node pair(s))
    div  display: flex, flex-direction: column, padding: 16px, padding-bottom: 16px, padding-left: 16px, padding-right: 16px, padding-top: 16px
    differ  div gap: 8px ≠ 6px, div align-items: flex-start ≠ center, div gap: 10px ≠ 6px
    only canonical  div width: 220px
  Accessibility  0%  0 shared a11y token(s)  (0↔1)
    only canonical  aria-hidden:true
  Framework  0%  0 shared component usage(s)  (6↔1)
    only local  BannerShell, BannerLead, BannerInner, BannerCopy, BannerHeadline, BannerParagraph
    only canonical  TrendingUp
  **Fix** — No action needed beyond the note.

- **LabResultCard** — `LabResultCard` looks like canonical `Accordion`, but not closely enough to call it a copy — 0.20 (20%).
  scores  Structure 41%  ·  Styles 25%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  41%  structure (tree)
    chain 4/7  ·  quality 72%  ·  CSS agreement 9%  ·  class names differ
    matched nodes  div, div, span, div
  Styles  25%  styles (2/8 properties agree across 3 node pair(s))
    div  padding-inline: calc(var(--spacing) * 4)
    span  font-size: var(--text-sm)
    only local  div align-items: center, div display: flex, div justify-content: space-between, div padding-block: calc(var(--spacing) * 2)
    only canonical  span padding: 0 0 calc(var(--spacing) * 4), span padding-bottom: calc(var(--spacing) * 4)
  Behavior  0%  0 shared event(s)  (0↔1)
    only canonical  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:panel-, aria-expanded:true, aria-hidden:true, role:region
  **Fix** — No action needed beyond the note.

- **PatientCard** — `PatientCard` looks like canonical `Accordion`, but not closely enough to call it a copy — 0.20 (20%).
  scores  Structure 41%  ·  Styles 25%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  41%  structure (tree)
    chain 4/7  ·  quality 72%  ·  CSS agreement 9%  ·  class names differ
    matched nodes  div, div, span, div
  Styles  25%  styles (2/8 properties agree across 3 node pair(s))
    div  padding-inline: calc(var(--spacing) * 4)
    span  font-size: var(--text-sm)
    only local  div align-items: center, div display: flex, div justify-content: space-between, div padding-block: calc(var(--spacing) * 2)
    only canonical  span padding: 0 0 calc(var(--spacing) * 4), span padding-bottom: calc(var(--spacing) * 4)
  Behavior  0%  0 shared event(s)  (0↔1)
    only canonical  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:panel-, aria-expanded:true, aria-hidden:true, role:region
  **Fix** — No action needed beyond the note.

- **VitalsCard** — `VitalsCard` looks like canonical `Accordion`, but not closely enough to call it a copy — 0.20 (20%).
  scores  Structure 41%  ·  Styles 25%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  41%  structure (tree)
    chain 4/7  ·  quality 72%  ·  CSS agreement 9%  ·  class names differ
    matched nodes  div, div, span, div
  Styles  25%  styles (2/8 properties agree across 3 node pair(s))
    div  padding-inline: calc(var(--spacing) * 4)
    span  font-size: var(--text-sm)
    only local  div align-items: center, div display: flex, div justify-content: space-between, div padding-block: calc(var(--spacing) * 2)
    only canonical  span padding: 0 0 calc(var(--spacing) * 4), span padding-bottom: calc(var(--spacing) * 4)
  Behavior  0%  0 shared event(s)  (0↔1)
    only canonical  click
  Accessibility  0%  0 shared a11y token(s)  (0↔4)
    only canonical  aria-controls:panel-, aria-expanded:true, aria-hidden:true, role:region
  **Fix** — No action needed beyond the note.

## Potentially missing component (5)

Several distinct components all matched the same canonical. The codebase is missing a shared component that would unify them — not that any single one is a duplicate.

### ActionButton

3 distinct components all matched canonical `Button`. A shared component is likely missing — weakest link 0.52.

| Component | Location | Confidence |
| --- | --- | --- |
| PrimaryAction | `tests/duplicates/PrimaryAction.tsx:3` | 0.52 |
| SecondaryAction | `tests/duplicates/SecondaryAction.tsx:3` | 0.52 |
| TertiaryAction | `tests/duplicates/TertiaryAction.tsx:3` | 0.52 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### ModalModal

3 distinct components all matched canonical `Modal`. A shared component is likely missing — weakest link 0.63.

| Component | Location | Confidence |
| --- | --- | --- |
| FullModalDup | `tests/duplicates/FullModalDup.tsx:10` | 0.77 |
| TailwindModalDup | `tests/duplicates/TailwindModalDup.tsx:10` | 0.77 |
| RawModalLike | `tests/duplicates/raw/RawModalLike.tsx:8` | 0.63 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### ModalStyledModal

3 distinct components all matched canonical `StyledModal`. A shared component is likely missing — weakest link 0.45.

| Component | Location | Confidence |
| --- | --- | --- |
| FullModalDup | `tests/duplicates/FullModalDup.tsx:10` | 0.57 |
| TailwindModalDup | `tests/duplicates/TailwindModalDup.tsx:10` | 0.57 |
| RawModalLike | `tests/duplicates/raw/RawModalLike.tsx:8` | 0.45 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### SharedDataCard

3 distinct components all matched canonical `DataCard`. A shared component is likely missing — weakest link 0.55.

| Component | Location | Confidence |
| --- | --- | --- |
| LabResultCard | `tests/duplicates/LabResultCard.tsx:3` | 0.55 |
| PatientCard | `tests/duplicates/PatientCard.tsx:3` | 0.55 |
| VitalsCard | `tests/duplicates/VitalsCard.tsx:3` | 0.55 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### SharedDetailPanel

3 distinct components all matched canonical `DetailPanel`. A shared component is likely missing — weakest link 0.60.

| Component | Location | Confidence |
| --- | --- | --- |
| LabOrderPanel | `tests/duplicates/LabOrderPanel.tsx:3` | 0.60 |
| PatientSummaryPanel | `tests/duplicates/PatientSummaryPanel.tsx:3` | 0.60 |
| VitalsTrendPanel | `tests/duplicates/VitalsTrendPanel.tsx:3` | 0.60 |

**Fix** — Extract a shared component for this group and have all 3 use it.

## Raw HTML outside canonical packages (57)

| Element | Location | Replace with | From | Why |
| --- | --- | --- | --- | --- |
| <div> | `tests/duplicates/FullModalDup.tsx:13` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.63 (name 0.00, structure 0.98, styles 0.67, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/FullModalDup.tsx:14` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.75 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.20, framework 0.00) |
| <button> | `tests/duplicates/FullModalDup.tsx:17` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.52 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/LabOrderPanel.tsx:8` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.49 (name 0.35, structure 0.67, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/LabOrderPanel.tsx:21` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.48 (name 0.35, structure 0.65, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <label> | `tests/duplicates/PartialDup.tsx:13` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.39 (name 0.00, structure 0.60, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <input> | `tests/duplicates/PartialDup.tsx:15` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.50 (name 0.00, structure 0.68, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/PartialDup.tsx:21` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.56 (name 0.35, structure 0.80, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/PartialDup.tsx:24` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.56 (name 0.35, structure 0.80, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/PatientSummaryPanel.tsx:8` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.49 (name 0.35, structure 0.67, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/PatientSummaryPanel.tsx:21` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.48 (name 0.35, structure 0.65, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/PrimaryAction.tsx:5` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.65 (name 0.35, structure 0.98, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/SecondaryAction.tsx:5` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.65 (name 0.35, structure 0.98, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/TailwindModalDup.tsx:13` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.63 (name 0.00, structure 0.98, styles 0.67, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/TailwindModalDup.tsx:14` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.75 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.20, framework 0.00) |
| <button> | `tests/duplicates/TailwindModalDup.tsx:17` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.52 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/TertiaryAction.tsx:5` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.65 (name 0.35, structure 0.98, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/VitalsTrendPanel.tsx:8` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.49 (name 0.35, structure 0.67, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/VitalsTrendPanel.tsx:21` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.48 (name 0.35, structure 0.65, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <section> | `tests/duplicates/a11y/InvoiceSection.tsx:23` | `InviteTeammate` | `tests/NOT_duplicates/flagship/content/aside/InviteTeammate.tsx` | confidence 0.72 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/a11y/PressableAction.tsx:19` | `PrimaryAction` | `tests/NOT_duplicates/a11y/PrimaryAction.tsx` | confidence 0.69 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <svg> | `tests/duplicates/a11y/PressableAction.tsx:31` | `DialogDismiss` | `tests/NOT_duplicates/a11y/DialogDismiss.tsx` | confidence 0.65 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/a11y/RailCollapse.tsx:16` | `NavToggle` | `tests/NOT_duplicates/a11y/NavToggle.tsx` | confidence 0.69 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/a11y/SheetClose.tsx:10` | `DialogDismiss` | `tests/NOT_duplicates/a11y/DialogDismiss.tsx` | confidence 0.77 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <ul> | `tests/duplicates/a11y/menu/OptionList.tsx:11` | `MenuList` | `tests/NOT_duplicates/a11y/menu/MenuList.tsx` | confidence 0.73 (name 0.00, structure 1.00, styles 0.67, behavior 0.00, a11y 0.50, framework 0.00) |
| <li> | `tests/duplicates/a11y/menu/OptionRow.tsx:11` | `MenuEntry` | `tests/NOT_duplicates/a11y/menu/MenuEntry.tsx` | confidence 0.67 (name 0.00, structure 1.00, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/a11y/menu/OptionRow.tsx:12` | `MenuButton` | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx` | confidence 0.69 (name 0.00, structure 1.00, styles 0.33, behavior 0.50, a11y 1.00, framework 0.00) |
| <button> | `tests/duplicates/behavior/ActionButton.tsx:11` | `SubmitControl` | `tests/NOT_duplicates/behavior/SubmitControl.tsx` | confidence 0.58 (name 0.00, structure 0.85, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <label> | `tests/duplicates/behavior/EmailInput.tsx:10` | `OverviewFooter` | `tests/NOT_duplicates/flagship/content/OverviewFooter.tsx` | confidence 0.55 (name 0.00, structure 0.98, styles 0.33, behavior 0.00, a11y 0.00, framework 0.00) |
| <input> | `tests/duplicates/behavior/EmailInput.tsx:13` | `SignupField` | `tests/NOT_duplicates/behavior/SignupField.tsx` | confidence 0.74 (name 0.00, structure 0.98, styles 0.33, behavior 1.00, a11y 0.00, framework 0.00) |
| <nav> | `tests/duplicates/behavior/PlaylistPager.tsx:20` | `TransportControls` | `tests/NOT_duplicates/behavior/TransportControls.tsx` | confidence 0.65 (name 0.00, structure 0.85, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <select> | `tests/duplicates/behavior/PlaylistPager.tsx:43` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.35 (name 0.00, structure 0.60, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <option> | `tests/duplicates/behavior/PlaylistPager.tsx:49` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.62 (name 0.00, structure 1.00, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <option> | `tests/duplicates/behavior/PlaylistPager.tsx:50` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.62 (name 0.00, structure 1.00, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <option> | `tests/duplicates/behavior/PlaylistPager.tsx:51` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.62 (name 0.00, structure 1.00, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <form> | `tests/duplicates/behavior/SubscribePanel.tsx:39` | `NewsletterSignup` | `tests/NOT_duplicates/behavior/NewsletterSignup.tsx` | confidence 0.78 (name 0.00, structure 1.00, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/raw/RawButtons.tsx:6` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.65 (name 0.35, structure 0.98, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/raw/RawButtons.tsx:9` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.57 (name 0.35, structure 0.98, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/raw/RawModalLike.tsx:11` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.63 (name 0.00, structure 0.98, styles 0.67, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/raw/RawModalLike.tsx:12` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.75 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.20, framework 0.00) |
| <button> | `tests/duplicates/raw/RawModalLike.tsx:15` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.52 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/raw/RawModalLike.tsx:23` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.56 (name 0.35, structure 0.80, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/raw/RawModalLike.tsx:26` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.56 (name 0.35, structure 0.80, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <div> | `tests/duplicates/structure/banner/BannerShell.tsx:10` | `CalloutFrame` | `tests/NOT_duplicates/structure/callout/CalloutFrame.tsx` | confidence 0.87 (name 0.00, structure 1.00, styles 1.00, behavior 0.00, a11y 1.00, framework 0.00) |
| <div> | `tests/duplicates/structure/flow/FilterDrawer.tsx:16` | `CalloutFrame` | `tests/NOT_duplicates/structure/callout/CalloutFrame.tsx` | confidence 0.58 (name 0.00, structure 0.85, styles 0.63, behavior 0.00, a11y 0.00, framework 0.00) |
| <label> | `tests/duplicates/structure/flow/FilterDrawer.tsx:24` | `MenuButton` | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx` | confidence 0.54 (name 0.00, structure 0.77, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <input> | `tests/duplicates/structure/flow/FilterDrawer.tsx:25` | `CollapsibleFilters` | `tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx` | confidence 0.54 (name 0.00, structure 0.90, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <label> | `tests/duplicates/structure/flow/FilterDrawer.tsx:28` | `MenuButton` | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx` | confidence 0.54 (name 0.00, structure 0.77, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <input> | `tests/duplicates/structure/flow/FilterDrawer.tsx:29` | `CollapsibleFilters` | `tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx` | confidence 0.54 (name 0.00, structure 0.90, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <label> | `tests/duplicates/structure/flow/FilterDrawer.tsx:32` | `MenuButton` | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx` | confidence 0.54 (name 0.00, structure 0.77, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <input> | `tests/duplicates/structure/flow/FilterDrawer.tsx:33` | `CollapsibleFilters` | `tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx` | confidence 0.54 (name 0.00, structure 0.90, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/structure/flow/FilterDrawer.tsx:37` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.39 (name 0.35, structure 0.60, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/structure/flow/FilterDrawer.tsx:44` | `Button` | `tests/NOT_duplicates/Button.tsx` | confidence 0.39 (name 0.35, structure 0.60, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/structure/flow/FilterDrawer.tsx:56` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.52 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
| <button> | `tests/duplicates/structure/flow/ZeroState.tsx:22` | `MenuButton` | `tests/NOT_duplicates/a11y/menu/MenuButton.tsx` | confidence 0.51 (name 0.00, structure 0.71, styles 0.33, behavior 0.50, a11y 0.00, framework 0.00) |
| <span> | `tests/duplicates/styles/ColumnCaption.tsx:13` | `StyledBadgeComponent` | `tests/NOT_duplicates/styled/StyledBadge.tsx` | confidence 0.44 (name 0.00, structure 0.71, styles 0.33, behavior 0.00, a11y 0.00, framework 0.00) |
| <span> | `tests/duplicates/styles/StateTag.tsx:9` | `StyledBadgeComponent` | `tests/NOT_duplicates/styled/StyledBadge.tsx` | confidence 0.42 (name 0.00, structure 0.71, styles 0.33, behavior 0.00, a11y 0.00, framework 0.00) |

## Partial duplicates (parts) (38)

| Part | Location | Replace with | From | Why |
| --- | --- | --- | --- | --- |
| FullModalDup › <div> | `tests/duplicates/FullModalDup.tsx:14` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.80 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 1.00, framework 0.00) |
| LabOrderPanel › <header> | `tests/duplicates/LabOrderPanel.tsx:6` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.77 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| LabOrderPanel › <div> | `tests/duplicates/LabOrderPanel.tsx:12` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.83 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| LabOrderPanel › <div> | `tests/duplicates/LabOrderPanel.tsx:14` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.78 (name 0.00, structure 0.96, styles 0.83, behavior 0.00, a11y 0.00, framework 0.00) |
| LabResultCard › <div> | `tests/duplicates/LabResultCard.tsx:6` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.99 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| PartialDup › <div> | `tests/duplicates/PartialDup.tsx:20` | `Box` | `tests/NOT_duplicates/Box.tsx` | confidence 0.49 (name 0.00, structure 0.80, styles 0.50, behavior 0.00, a11y 0.00, framework 0.00) |
| PatientCard › <div> | `tests/duplicates/PatientCard.tsx:6` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.99 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| PatientSummaryPanel › <header> | `tests/duplicates/PatientSummaryPanel.tsx:6` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.77 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| PatientSummaryPanel › <div> | `tests/duplicates/PatientSummaryPanel.tsx:12` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.83 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| PatientSummaryPanel › <div> | `tests/duplicates/PatientSummaryPanel.tsx:14` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.78 (name 0.00, structure 0.96, styles 0.83, behavior 0.00, a11y 0.00, framework 0.00) |
| TailwindModalDup › <div> | `tests/duplicates/TailwindModalDup.tsx:14` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.80 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 1.00, framework 0.00) |
| VitalsCard › <div> | `tests/duplicates/VitalsCard.tsx:6` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.99 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| VitalsTrendPanel › <header> | `tests/duplicates/VitalsTrendPanel.tsx:6` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.77 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| VitalsTrendPanel › <div> | `tests/duplicates/VitalsTrendPanel.tsx:12` | `DetailPanel` | `tests/NOT_duplicates/DetailPanel.tsx` | confidence 0.83 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| VitalsTrendPanel › <div> | `tests/duplicates/VitalsTrendPanel.tsx:14` | `DataCard` | `tests/NOT_duplicates/DataCard.tsx` | confidence 0.78 (name 0.00, structure 0.96, styles 0.83, behavior 0.00, a11y 0.00, framework 0.00) |
| InvoiceSection › <dl> | `tests/duplicates/a11y/InvoiceSection.tsx:29` | `BillingRegion` | `tests/NOT_duplicates/a11y/BillingRegion.tsx` | confidence 0.83 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| DashboardMasthead › <NavBar> | `tests/duplicates/flagship/DashboardMasthead.tsx:42` | `PrimaryNav` | `tests/NOT_duplicates/flagship/header/PrimaryNav.tsx` | confidence 0.54 (name 0.00, structure 0.67, styles 1.00, behavior 0.00, a11y 0.67, framework 0.00) |
| DashboardMasthead › <SearchForm> | `tests/duplicates/flagship/DashboardMasthead.tsx:55` | `SearchBox` | `tests/NOT_duplicates/flagship/header/SearchBox.tsx` | confidence 0.99 (name 0.00, structure 0.98, styles 1.00, behavior 1.00, a11y 1.00, framework 1.00) |
| DashboardMasthead › <RoundIcon> | `tests/duplicates/flagship/DashboardMasthead.tsx:68` | `NotificationBell` | `tests/NOT_duplicates/flagship/header/NotificationBell.tsx` | confidence 0.91 (name 0.00, structure 0.98, styles 1.00, behavior 0.50, a11y 1.00, framework 1.00) |
| DashboardSidebar › <PaddedPanel> | `tests/duplicates/flagship/DashboardSidebar.tsx:57` | `InviteTeammate` | `tests/NOT_duplicates/flagship/content/aside/InviteTeammate.tsx` | confidence 0.86 (name 0.00, structure 0.98, styles 1.00, behavior 1.00, a11y 0.00, framework 0.00) |
| DashboardSidebar › <PaddedPanel> | `tests/duplicates/flagship/DashboardSidebar.tsx:72` | `ActivityFeed` | `tests/NOT_duplicates/flagship/content/aside/ActivityFeed.tsx` | confidence 0.72 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| DashboardSidebar › <Feed> | `tests/duplicates/flagship/DashboardSidebar.tsx:74` | `ActivityItem` | `tests/NOT_duplicates/flagship/content/aside/ActivityItem.tsx` | confidence 0.84 (name 0.00, structure 0.83, styles 1.00, behavior 0.00, a11y 0.50, framework 1.00) |
| DashboardSidebar › <PaddedPanel> | `tests/duplicates/flagship/DashboardSidebar.tsx:87` | `OverviewAside` | `tests/NOT_duplicates/flagship/content/aside/OverviewAside.tsx` | confidence 0.68 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| DashboardSidebar › <Roster> | `tests/duplicates/flagship/DashboardSidebar.tsx:89` | `TeamMember` | `tests/NOT_duplicates/flagship/content/aside/TeamMember.tsx` | confidence 0.70 (name 0.00, structure 0.86, styles 1.00, behavior 0.00, a11y 0.00, framework 0.65) |
| DeliveryTracks › <BoardCard> | `tests/duplicates/flagship/DeliveryTracks.tsx:53` | `MilestoneCard` | `tests/NOT_duplicates/flagship/content/main/MilestoneCard.tsx` | confidence 0.79 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 1.00, framework 0.65) |
| MetricTiles › <Tile> | `tests/duplicates/flagship/MetricTiles.tsx:49` | `StatCard` | `tests/NOT_duplicates/structure/StatCard.tsx` | confidence 0.84 (name 0.00, structure 0.98, styles 0.92, behavior 0.00, a11y 1.00, framework 0.00) |
| MetricTiles › <TileHead> | `tests/duplicates/flagship/MetricTiles.tsx:50` | `BlockedTile` | `tests/NOT_duplicates/flagship/tiles/BlockedTile.tsx` | confidence 0.86 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 1.00, framework 0.00) |
| WorkQueue › <RowMain> | `tests/duplicates/flagship/WorkQueue.tsx:45` | `TaskRow` | `tests/NOT_duplicates/flagship/content/main/TaskRow.tsx` | confidence 0.99 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| WorkspaceDashboard › <Body> | `tests/duplicates/flagship/WorkspaceDashboard.tsx:49` | `OverviewMain` | `tests/NOT_duplicates/flagship/content/main/OverviewMain.tsx` | confidence 0.68 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| WorkspaceDashboard › <Primary> | `tests/duplicates/flagship/WorkspaceDashboard.tsx:50` | `ProjectOverview` | `tests/NOT_duplicates/flagship/ProjectOverview.tsx` | confidence 0.68 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| WorkspaceDashboard › <Panel> | `tests/duplicates/flagship/WorkspaceDashboard.tsx:51` | `StatCard` | `tests/NOT_duplicates/structure/StatCard.tsx` | confidence 0.44 (name 0.00, structure 0.54, styles 0.92, behavior 0.00, a11y 0.00, framework 0.00) |
| WorkspaceDashboard › <Panel> | `tests/duplicates/flagship/WorkspaceDashboard.tsx:69` | `MilestoneBoard` | `tests/NOT_duplicates/flagship/content/main/MilestoneBoard.tsx` | confidence 0.68 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| MuiFormOverrideDup › <Stack> | `tests/duplicates/mui/MuiFormOverrideDup.tsx:43` | `MuiForm` | `tests/NOT_duplicates/mui/MuiForm.tsx` | confidence 0.97 (name 0.00, structure 1.00, styles 0.00, behavior 0.00, a11y 0.00, framework 0.84) |
| RawModalLike › <div> | `tests/duplicates/raw/RawModalLike.tsx:12` | `Modal` | `tests/NOT_duplicates/Modal.tsx` | confidence 0.71 (name 0.00, structure 0.89, styles 1.00, behavior 0.50, a11y 0.63, framework 0.00) |
| AlertBanner › <BannerLead> | `tests/duplicates/structure/banner/AlertBanner.tsx:21` | `NoticeCallout` | `tests/NOT_duplicates/structure/callout/NoticeCallout.tsx` | confidence 0.83 (name 0.00, structure 0.98, styles 1.00, behavior 0.00, a11y 0.00, framework 0.00) |
| FilterDrawer › <div> | `tests/duplicates/structure/flow/FilterDrawer.tsx:23` | `CollapsibleFilters` | `tests/NOT_duplicates/structure/flow/CollapsibleFilters.tsx` | confidence 0.73 (name 0.00, structure 0.90, styles 1.00, behavior 0.50, a11y 0.00, framework 0.00) |
| FilterDrawer › <div> | `tests/duplicates/structure/flow/FilterDrawer.tsx:36` | `GenericBlock` | `tests/NOT_duplicates/GenericBlock.tsx` | confidence 0.39 (name 0.00, structure 0.60, styles 0.00, behavior 0.50, a11y 0.00, framework 0.00) |
| PhotoTile › <figcaption> | `tests/duplicates/structure/media/PhotoTile.tsx:18` | `MediaCaption` | `tests/NOT_duplicates/structure/media/MediaCaption.tsx` | confidence 0.98 (name 0.00, structure 0.98, styles 0.00, behavior 0.00, a11y 0.00, framework 0.00) |
