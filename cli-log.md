# Component duplicates (component-level funnel)

Scanned 31 app file(s), 32 app component(s) against 29 canonical component(s).

Found 8 duplicate component(s) and 9 similar component(s), plus 15 component(s) grouped under 5 potentially missing component(s).

## High-confidence duplicates (confidence ≥ duplicate threshold) (8)

| Id | Local component | Location | Canonical | Canonical location | Confidence | Top signal | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `duplicate:tests/components/duplicates/mui/MuiFormOverrideDup.tsx#MuiFormOverrideDup=>tests/components/lib/mui/MuiFormOverride.tsx#MuiFormOverride` | MuiFormOverrideDup | `tests/components/duplicates/mui/MuiFormOverrideDup.tsx:36` | MuiFormOverride | `tests/components/lib/mui/MuiFormOverride.tsx:36` | 0.68 | Structure | Replace `MuiFormOverrideDup` with `MuiFormOverride` from `tests/components/lib/mui/MuiFormOverride.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/mui/MuiFormOverrideDup.tsx#MuiFormOverrideDup=>tests/components/lib/mui/MuiForm.tsx#MuiForm` | MuiFormOverrideDup | `tests/components/duplicates/mui/MuiFormOverrideDup.tsx:36` | MuiForm | `tests/components/lib/mui/MuiForm.tsx:23` | 0.65 | Structure | Replace `MuiFormOverrideDup` with `MuiForm` from `tests/components/lib/mui/MuiForm.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Paper.tsx#Paper` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Paper | `tests/components/lib/Paper.tsx:3` | 0.53 | Structure | Replace `PaperDup` with `Paper` from `tests/components/lib/Paper.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/FullBadgeDup.tsx#FullBadgeDup=>tests/components/lib/Badge.tsx#Badge` | FullBadgeDup | `tests/components/duplicates/FullBadgeDup.tsx:3` | Badge | `tests/components/lib/Badge.tsx:3` | 0.48 | Structure | Replace `FullBadgeDup` with `Badge` from `tests/components/lib/Badge.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/styled/StyledBadgeDup.tsx#StyledBadgeDup=>tests/components/lib/styled/StyledBadge.tsx#StyledBadgeComponent` | StyledBadgeDup | `tests/components/duplicates/styled/StyledBadgeDup.tsx:15` | StyledBadgeComponent | `tests/components/lib/styled/StyledBadge.tsx:15` | 0.47 | Structure | Replace `StyledBadgeDup` with `StyledBadgeComponent` from `tests/components/lib/styled/StyledBadge.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Panel.tsx#Panel` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Panel | `tests/components/lib/Panel.tsx:3` | 0.46 | Structure | Replace `PaperDup` with `Panel` from `tests/components/lib/Panel.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Passthrough.tsx#Passthrough` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Passthrough | `tests/components/lib/Passthrough.tsx:3` | 0.46 | Structure | Replace `PaperDup` with `Passthrough` from `tests/components/lib/Passthrough.tsx` — they are the same component. |
| `duplicate:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Section.tsx#Section` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Section | `tests/components/lib/Section.tsx:3` | 0.46 | Structure | Replace `PaperDup` with `Section` from `tests/components/lib/Section.tsx` — they are the same component. |

### Why each one matched

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
  **Fix** — Replace `MuiFormOverrideDup` with `MuiFormOverride` from `tests/components/lib/mui/MuiFormOverride.tsx` — they are the same component.

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
  **Fix** — Replace `MuiFormOverrideDup` with `MuiForm` from `tests/components/lib/mui/MuiForm.tsx` — they are the same component.

- **PaperDup** — `PaperDup` duplicates canonical `Paper` — 0.53 (53%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 52%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%
    matched nodes  div
  Name  52%  PaperDup ↔ Paper
    match  fuzzy-name  ·  word overlap 50%
  **Fix** — Replace `PaperDup` with `Paper` from `tests/components/lib/Paper.tsx` — they are the same component.

- **FullBadgeDup** — `FullBadgeDup` duplicates canonical `Badge` — 0.48 (49%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 35%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: var(--text-xs)
  Name  35%  FullBadgeDup ↔ Badge
    match  fuzzy-name  ·  word overlap 0%
  **Fix** — Replace `FullBadgeDup` with `Badge` from `tests/components/lib/Badge.tsx` — they are the same component.

- **StyledBadgeDup** — `StyledBadgeDup` duplicates canonical `StyledBadgeComponent` — 0.47 (47%) confidence. Use the canonical component instead.
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
  **Fix** — Replace `StyledBadgeDup` with `StyledBadgeComponent` from `tests/components/lib/styled/StyledBadge.tsx` — they are the same component.

- **PaperDup** — `PaperDup` duplicates canonical `Panel` — 0.46 (46%) confidence. Use the canonical component instead.
  scores  Structure 98%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  **Fix** — Replace `PaperDup` with `Panel` from `tests/components/lib/Panel.tsx` — they are the same component.

- **PaperDup** — `PaperDup` duplicates canonical `Passthrough` — 0.46 (46%) confidence. Use the canonical component instead.
  scores  Structure 98%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  **Fix** — Replace `PaperDup` with `Passthrough` from `tests/components/lib/Passthrough.tsx` — they are the same component.

- **PaperDup** — `PaperDup` duplicates canonical `Section` — 0.46 (46%) confidence. Use the canonical component instead.
  scores  Structure 98%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  98%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  **Fix** — Replace `PaperDup` with `Section` from `tests/components/lib/Section.tsx` — they are the same component.

## Weak similarity (similar ≤ confidence < duplicate) (9)

| Id | Local component | Location | Canonical | Canonical location | Confidence | Top signal | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `similar:tests/components/NOT_duplicates/SaveButton.tsx#SaveButton=>tests/components/lib/MiniButton.tsx#MiniButton` | SaveButton | `tests/components/NOT_duplicates/SaveButton.tsx:3` | MiniButton | `tests/components/lib/MiniButton.tsx:3` | 0.27 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Box.tsx#Box` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Box | `tests/components/lib/Box.tsx:3` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/PaperDup.tsx#PaperDup=>tests/components/lib/Container.tsx#Container` | PaperDup | `tests/components/duplicates/PaperDup.tsx:8` | Container | `tests/components/lib/Container.tsx:3` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/components/NOT_duplicates/GenericBlock.tsx#GenericBlock=>tests/components/lib/Box.tsx#Box` | GenericBlock | `tests/components/NOT_duplicates/GenericBlock.tsx:8` | Box | `tests/components/lib/Box.tsx:3` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/components/NOT_duplicates/GenericBlock.tsx#GenericBlock=>tests/components/lib/Container.tsx#Container` | GenericBlock | `tests/components/NOT_duplicates/GenericBlock.tsx:8` | Container | `tests/components/lib/Container.tsx:3` | 0.24 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/styled/StyledBadgeDup.tsx#StyledBadgeDup=>tests/components/lib/Badge.tsx#Badge` | StyledBadgeDup | `tests/components/duplicates/styled/StyledBadgeDup.tsx:15` | Badge | `tests/components/lib/Badge.tsx:3` | 0.22 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/LabResultCard.tsx#LabResultCard=>tests/components/lib/Accordion.tsx#Accordion` | LabResultCard | `tests/components/duplicates/LabResultCard.tsx:3` | Accordion | `tests/components/lib/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/PatientCard.tsx#PatientCard=>tests/components/lib/Accordion.tsx#Accordion` | PatientCard | `tests/components/duplicates/PatientCard.tsx:3` | Accordion | `tests/components/lib/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |
| `similar:tests/components/duplicates/VitalsCard.tsx#VitalsCard=>tests/components/lib/Accordion.tsx#Accordion` | VitalsCard | `tests/components/duplicates/VitalsCard.tsx:3` | Accordion | `tests/components/lib/Accordion.tsx:9` | 0.20 | Structure | No action needed beyond the note. |

### Why each one matched

- **SaveButton** — `SaveButton` looks like canonical `MiniButton`, but not closely enough to call it a copy — 0.27 (27%).
  scores  Structure 36%  ·  Styles 33%  ·  Behavior 50%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  36%  structure (tree)
    chain 1/1  ·  quality 56%  ·  CSS agreement 50%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  button
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    button  font-size: var(--text-xs)
  Behavior  50%  1 shared event(s)  (1↔1)
    shared  click
  **Fix** — No action needed beyond the note.

- **PaperDup** — `PaperDup` looks like canonical `Box`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 60%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  60%  structure (tree)
    chain 1/1  ·  quality 60%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  Styles  0%  styles (0/3 properties agree across 1 node pair(s))
    only canonical  div display: flex, div flex-direction: column, div gap: calc(var(--spacing) * 2)
  **Fix** — No action needed beyond the note.

- **PaperDup** — `PaperDup` looks like canonical `Container`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 60%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  60%  structure (tree)
    chain 1/1  ·  quality 60%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  Styles  0%  styles (0/2 properties agree across 1 node pair(s))
    only canonical  div margin-inline: auto, div max-width: var(--container-2xl)
  **Fix** — No action needed beyond the note.

- **GenericBlock** — `GenericBlock` looks like canonical `Box`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 60%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  60%  structure (tree)
    chain 1/1  ·  quality 60%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  Styles  0%  styles (0/6 properties agree across 1 node pair(s))
    only local  div padding: 0 0 calc(var(--spacing) * 2) calc(var(--spacing) * 4), div padding-bottom: calc(var(--spacing) * 2), div padding-left: calc(var(--spacing) * 4)
    only canonical  div display: flex, div flex-direction: column, div gap: calc(var(--spacing) * 2)
  Behavior  0%  0 shared event(s)  (1↔0)
    only local  click
  **Fix** — No action needed beyond the note.

- **GenericBlock** — `GenericBlock` looks like canonical `Container`, but not closely enough to call it a copy — 0.24 (24%).
  scores  Structure 60%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 0%
  Structure  60%  structure (tree)
    chain 1/1  ·  quality 60%  ·  CSS agreement 0%  ·  class names differ
    matched nodes  div
  Styles  0%  styles (0/5 properties agree across 1 node pair(s))
    only local  div padding: 0 0 calc(var(--spacing) * 2) calc(var(--spacing) * 4), div padding-bottom: calc(var(--spacing) * 2), div padding-left: calc(var(--spacing) * 4)
    only canonical  div margin-inline: auto, div max-width: var(--container-2xl)
  Behavior  0%  0 shared event(s)  (1↔0)
    only local  click
  **Fix** — No action needed beyond the note.

- **StyledBadgeDup** — `StyledBadgeDup` looks like canonical `Badge`, but not closely enough to call it a copy — 0.22 (22%).
  scores  Structure 47%  ·  Styles 0%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 35%
  Structure  47%  structure (tree)
    chain 1/1  ·  quality 67%  ·  CSS agreement 18%  ·  1 CSS conflict(s)  ·  class names differ
    matched nodes  span
  Styles  0%  styles (0/1 properties agree across 1 node pair(s))
    differ  span font-size: 12px ≠ var(--text-xs)
  Framework  0%  0 shared component usage(s)  (1↔0)
    only local  Pill
  Name  35%  StyledBadgeDup ↔ Badge
    match  fuzzy-name  ·  word overlap 0%
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
| PrimaryAction | `tests/components/duplicates/PrimaryAction.tsx:3` | 0.52 |
| SecondaryAction | `tests/components/duplicates/SecondaryAction.tsx:3` | 0.52 |
| TertiaryAction | `tests/components/duplicates/TertiaryAction.tsx:3` | 0.52 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### ModalModal

3 distinct components all matched canonical `Modal`. A shared component is likely missing — weakest link 0.63.

| Component | Location | Confidence |
| --- | --- | --- |
| FullModalDup | `tests/components/duplicates/FullModalDup.tsx:10` | 0.77 |
| TailwindModalDup | `tests/components/duplicates/TailwindModalDup.tsx:10` | 0.77 |
| RawModalLike | `tests/components/duplicates/raw/RawModalLike.tsx:8` | 0.63 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### ModalStyledModal

3 distinct components all matched canonical `StyledModal`. A shared component is likely missing — weakest link 0.45.

| Component | Location | Confidence |
| --- | --- | --- |
| FullModalDup | `tests/components/duplicates/FullModalDup.tsx:10` | 0.57 |
| TailwindModalDup | `tests/components/duplicates/TailwindModalDup.tsx:10` | 0.57 |
| RawModalLike | `tests/components/duplicates/raw/RawModalLike.tsx:8` | 0.45 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### SharedDataCard

3 distinct components all matched canonical `DataCard`. A shared component is likely missing — weakest link 0.55.

| Component | Location | Confidence |
| --- | --- | --- |
| LabResultCard | `tests/components/duplicates/LabResultCard.tsx:3` | 0.55 |
| PatientCard | `tests/components/duplicates/PatientCard.tsx:3` | 0.55 |
| VitalsCard | `tests/components/duplicates/VitalsCard.tsx:3` | 0.55 |

**Fix** — Extract a shared component for this group and have all 3 use it.

### SharedDetailPanel

3 distinct components all matched canonical `DetailPanel`. A shared component is likely missing — weakest link 0.60.

| Component | Location | Confidence |
| --- | --- | --- |
| LabOrderPanel | `tests/components/duplicates/LabOrderPanel.tsx:3` | 0.60 |
| PatientSummaryPanel | `tests/components/duplicates/PatientSummaryPanel.tsx:3` | 0.60 |
| VitalsTrendPanel | `tests/components/duplicates/VitalsTrendPanel.tsx:3` | 0.60 |

**Fix** — Extract a shared component for this group and have all 3 use it.
