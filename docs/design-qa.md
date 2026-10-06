# Creation flow and seamless banner QA

final result: passed

## Architecture reorganization — 2026-10-06

This section supersedes the previous directory and dependency descriptions. Earlier entries remain historical evidence.

- Covered startup, routing, navigation, all pages and artwork editors, models, state, persistence and migration, preview playback, drawing, fonts, transitions, presets, export formats and packaging, translations, styles, assets, build/deployment configuration, tests and documentation.
- Organized source into `app`, `core`, `application`, `features`, `infrastructure` and `shared`. Pure models have no framework/browser imports. Feature internals cannot import other features; application composition reaches artwork modules only through the catalog. Editors and custom creation fields load dynamically.
- Artwork modules register creation defaults, previews, renderers, editor loaders, localized copy and optional export layouts. Export formats and text transitions each have a registry. Creation/editor/render/export dispatch no longer repeats type branches. Project state receives prepared artwork and does not depend on settings state.
- Storage adapters accept an injectable `Storage`; historical migrations remain isolated. Shared canvas playback consumes a neutral preview source. Encoding and ZIP code do not know artwork types. Public assets and their URLs are preserved.
- Architecture tests enforce imports and layer boundaries and reject eager runtime cycles. An extension test supplies a split layout to the text module and verifies the existing coordinator produces a numbered ZIP without additional type branches.
- `pnpm test`: 21 passing tests across architecture, registration/localized resources, migration, persistence/order, settings and scoped clearing, cached rendering/fade/crops/snapshots, codecs/ZIP utilities and the full export coordinator. Canvas/recorder helpers are mocks; their checks do not claim real browser media binaries.
- Browser regression: all three editors open saved projects; actual static text/sticker WebP, animated text WebM and animated banner ZIP generation produce retryable download links. Opening projects preserves sidebar order. All six saved projects remain.
- Chinese and English creation demos use the requested phrases. Banner-specific fields load on selection; changing unsaved count to seven updates preview width to 700 px. Empty names cannot create a project. No test project was saved. Language was restored to Chinese.
- Responsive checks at 390 × 844 px: Home has no project sidebar/drawer control; Create and banner have no horizontal overflow; mobile project navigation opens and selects the saved banner. Viewport override reset after verification. Console warning/error inspection returned no new entries.
- Screenshots inspected: `/tmp/stickgram-architecture-banner.png` (desktop, 1280 × 720), `/tmp/stickgram-architecture-mobile.png` (mobile, 390 × 844, drawer closed).
- Type checks, production build, formatting and whitespace checks pass. Extension steps and responsibilities are documented in `docs/architecture.md`.

Browser-generated download links were verified; retrieved browser files and Telegram upload/playback remain unverified. ZIP binary preservation and export orchestration are covered independently by tests.

## Project consolidation — 2026-10-05

This section describes the current implementation and supersedes the earlier architecture, routes and validation details below. Those sections remain historical evidence.

- One discriminated project model replaces frames, layers and separate template fields. Existing project/detail records are converted at the storage boundary into one persisted collection. Opening editors and refreshing thumbnails preserve ordering timestamps.
- Editors live under `features`; domain rules under `domain`; drawing under `renderers`. A shared canvas preview, editor composable and export controls replace three duplicated playback/save/download pipelines. Font and text layout preparation occurs on configuration changes rather than animation frames.
- Removed the unused Konva editor, its store/composable, Lottie/frame export code and related dependencies. Removed obsolete template routes, ineffective autosave settings, placeholder links and unused translations/styles. Default format now initializes the creation flow.
- Configuration ranges are enforced by controls. Removed redundant renderer clamps and catch-and-fallback storage handling; retained actual external-resource errors, asynchronous preview invalidation and media/object-URL cleanup.
- Added README architecture/run instructions, formatting configuration and strict unused-symbol checks. Application and Vite configuration both type-check without emitting root build artifacts.
- `pnpm test`: 12 passing tests for migration, consolidated persistence, thumbnail versus edit ordering, independent copies, localized defaults, cached rendering, whole English phrases, sequential fade, adjacent banner slices, nested-proxy snapshots, ZIP binary preservation and synchronized recording cleanup.
- Browser regression verified all three editors, static text/sticker WebP links, static/dynamic banner ZIP links and dynamic text WebM links. All six saved projects remain. Opening four different existing projects preserved the sidebar order.
- Font controls persisted 800 / 1° across reload; original 700 / 0° values were restored. Empty project names cannot create a project via either the disabled button or Enter. Creation exposes only static/video and the requested demo phrases.
- At 390 × 844, text editor, banner editor and creation have no horizontal overflow. Home has neither sidebar nor project drawer button. The project drawer opens from creation and selects the saved banner. Temporary viewport override reset.
- Final rendered editor had no alert messages. Console inspection after the fixes returned no new warnings/errors. Screenshots: `/tmp/stickgram-refactor-editor.png` (1280 × 720), `/tmp/stickgram-refactor-mobile.png` (390 × 844).
- Production build, type checks and diff whitespace check pass. Browser downloads were verified through generated links; retrieved files and Telegram upload/playback remain unverified. ZIP contents and recording coordination were validated separately in tests.

## Current navigation: projects in the sidebar

This update supersedes the standalone template library in the earlier sections, which remain historical evidence.

- Sidebar now lists persisted projects, with thumbnails, names, type/format metadata, a count, search and an active-project highlight. Home and Settings are links in the top bar.
- Standalone template library, standalone text-template editor and mobile bottom navigation components were removed. Old `/templates` and `/template/text-emoji` links redirect to `/create`. Banner styles remain selectable inside the project editor.
- Desktop proof: `/tmp/stickgram-project-sidebar-settings.png` (1285 × 980 px crop of the 1285 × 1314 CSS viewport, 1:1 screenshot density), Chinese/light theme, Settings active, six existing projects listed. This is a functional navigation change specified by the user, not an exact visual clone of the previous banner reference.
- Mobile proof: `/tmp/stickgram-top-nav-mobile.png` and `/tmp/stickgram-project-drawer-mobile.png`, viewport 390 × 844 px. Home/Settings stay in the top bar; the project button opens a left drawer. Selecting a project closes the drawer.
- Verified desktop search for “霓虹” returns the existing neon project; selecting it opens the saved editor and sets `aria-current="page"`. A nonmatching search shows the empty-search state. Clearing search restores all six projects. No project data was removed.
- Verified top-bar Home/Settings navigation, mobile drawer selection/closure, no mobile bottom nav, and both old template-route redirects. Existing editor presets remain available.
- Checked 820 px desktop layout and 390 px mobile layout without horizontal overflow. Responsive override reset before handoff; the original Settings route restored. Console warning/error inspection returned no entries.
- Typography and metadata fit the compact project rows; long names truncate with full titles. Spacing keeps search, project rows and top navigation distinct. Selection uses existing blue tokens. Thumbnails use actual saved artwork. Labels are localized and keyboard links expose active-page semantics.
- `pnpm type-check`, `pnpm build` and `git diff --check` pass for the navigation changes.

## Latest update: long banner template collection

- Rendered implementation: `http://127.0.0.1:5173/templates`, banner category selected, Chinese, light theme.
- Screenshot: `/tmp/stickgram-banner-templates.png`, 1285 × 980 px crop of the 1285 × 1314 CSS viewport, screenshot density 1:1.
- Both source and latest rendered implementation together: `/tmp/stickgram-banner-templates-comparison.png` (1993 × 1020 px). Focused source pink tile strip/rendered berry banner: `/tmp/stickgram-banner-templates-focus.png` (620 × 110 px). Source remains the 708 × 836 px reference listed below; source pixels are preserved, no source density is assumed.
- Editor evidence: `/tmp/stickgram-banner-template-editor.png`; mobile evidence: `/tmp/stickgram-banner-templates-mobile.png`, `/tmp/stickgram-banner-template-editor-mobile.png`, viewport 390 × 844 CSS px.
- Nine actual canvas templates: berry, neon, cream, arcade, mint, sunset, gold, candy, minimal. Their master aspect ratios are 5:1, 6:1, 6:1, 6:1, 6:1, 8:1, 7:1, 5:1, 4:1. All are long horizontal banners rather than square tile mockups.
- **Typography:** Different bundled fonts produce visibly distinct heavy, outline, handwriting and serif designs. Template text is centered, fitted and readable. Font options retain actual-content previews. License notices and links have been removed from the product UI as requested; bundled license files remain intact.
- **Spacing/layout:** Desktop gallery has three columns; mobile gallery stacks the long banners without horizontal overflow. Editor template choices have two columns. Inner banner content stays continuous; borders, grids and dots are rendered once on the master canvas and then cropped.
- **Colors/tokens:** Berry preserves the original pink/purple direction. Neon cyan, cream brown, arcade lime, mint green, sunset warm tones, black/gold, pastel candy and blue/white are intentional new alternatives, not fidelity drift from the original pink reference.
- **Image quality:** Templates are editable canvas artwork shared with export, with crisp text, borders and patterns. No raster illustrations, logos or source assets were replaced with handcrafted substitutes.
- **Copy:** Upload hint is exactly “按编号顺序上传即可。” in Chinese. The long technical paragraph and the font licensing notice are absent. Preview copy applies to both square and rounded banner ends.
- **Interaction checks:** Selecting neon in the library opens creation at static/animated selection with the real preset preview, six slices and preset name. Static creation opens the matching editor. Switching to candy after editing preserves “快乐每一天” and count 5, changes the style, and survives refresh. Static ZIP export generates a retryable download link; editing invalidates the old link. The sample was restored to neon after the checks.
- **Responsive/console checks:** Gallery and editor both have `documentElement.scrollWidth === innerWidth === 390`. No warnings/errors were captured during the checked flows. Temporary viewport overrides were reset.
- **Comparison history:** Latest combined full-view and focused comparisons found no actionable P0/P1/P2 findings; no visual fixes were needed in response. Alternative designs and lack of picker gaps are intentional. The full-view screenshot makes all nine designs legible; the focused comparison checks the retained berry motif.
- **Validation:** Type check, production build and diff whitespace check pass. Download-to-disk and Telegram playback remain the residual gaps described below.

## Comparison target and evidence

- Source visual truth: `/var/folders/yb/ldltyc717tv79cnq3c0f5gzr0000gn/T/codex-clipboard-e95083b1-8294-4af0-b654-aabe3e748307.png` (708 × 836 px).
- Rendered banner: `/tmp/stickgram-banner-editor.png` (1285 × 1314 px), `http://127.0.0.1:5173/editor/Z2gLRuYfGEmnITQIF90RH`.
- Full comparison, both artifacts in one input: `/tmp/stickgram-banner-comparison.png` (1993 × 1354 px).
- Focused comparison: `/tmp/stickgram-banner-focus.png` (510 × 387 px), including the source pink tile strip and the complete rendered banner.
- Creation screenshot: `/tmp/stickgram-create-redesign.png` (1285 × 810 px, a viewport crop preserving app navigation and all three cards).
- Mobile evidence: `/tmp/stickgram-create-mobile.png`, `/tmp/stickgram-banner-mobile.png`; CSS viewport 390 × 844 px, no horizontal overflow.
- Additional evidence: `/tmp/stickgram-sticker-editor.png`, `/tmp/stickgram-text-static.png`.
- Desktop CSS viewport 1285 × 1314 px; screenshot scale is 1 pixel per CSS pixel. Source capture density is unspecified. Comparison boards preserve source pixels; no density normalization or exact popup fidelity is claimed.
- State: Chinese, light theme, saved five-part banner, “今天也要开心”, Noto Sans SC, pink/purple gradient, long shadow, golden dots, outer rounding, animation paused, guides off.

The supplied screenshot is a visual reference for banner artwork, not a request to clone Telegram's emoji picker. The original picker has spacing between separate tiles; the requested joined preview intentionally has no spacing. The app retains its own navigation, controls and layout. Country flags and country-name content are intentionally replaced with editable banner text.

## Findings

No actionable P0/P1/P2 differences remain within this adaptation's scope.

- **Fonts/typography:** White bold Chinese display type and long diagonal shadows preserve the reference motif. Noto Sans SC is a close functional substitute, not a claim of exact font identification. Banner text fits the available width; font cards preview actual content. Six bundled fonts have local OFL license files.
- **Spacing/layout:** Full banner, actual message size and numbered export pieces are separate panels. Full banner has outer rounding only. Numbered piece gallery uses gaps to distinguish files; the joined preview and exported master crops do not. Desktop controls and preview form two columns; mobile stacks them and retains scroll access to controls.
- **Colors/tokens:** Pink-to-purple background, white lettering, darker translucent shadow and small gold dots match the reference direction. Alternative blue and green palettes are explicit user choices. Selection/focus uses the existing app blue.
- **Image quality/assets:** The sticker card uses an original generated transparent PNG, not a placeholder glyph. The banner and text emoji are real canvas output from editable data, and their previews use the same rendering functions as exports. The canvas gradient is functional artwork authored by the editor, not a bitmap stand-in for a reference illustration.
- **Copy/content:** Type cards explain use and dimensions; format cards show exactly static WebP and animated VP9 WebM. Banner export explains ordering and 100 × 100 px pieces. Empty project names cannot advance to creation.

## Comparison history

The first combined source/rendered visual comparison found no P0/P1/P2 visual issues and no visual changes were made in response. Earlier implementation checks resolved stale download links after edits and updated text thumbnails after changes; these were functional checks, not claimed visual QA iterations.

## Verified behavior

- All three creation demos render; static and animated are the only format options.
- Banner creation opens a working editor. Text/count updates change preview and crop count, and survive refresh.
- Static sticker and static text projects open their corresponding editors and generate WebP download links.
- Font selection changes actual preview text and survives refresh. Static text has no hidden second-text font preview or animation controls.
- Animated banner export generates a ZIP download link without console errors.
- ZIP utility round-trip preserves five numbered binary entries and a preview entry.
- Recording utility test checks a shared drawing clock, five VP9 recorders, unsupported-codec rejection and stopped media tracks. Browser preview/export checks confirm actual VP9 availability separately.
- Desktop and mobile creation/banner screenshots inspected. Mobile `documentElement.scrollWidth === innerWidth === 390`.
- Console warning/error inspection returned no entries in tested flows.
- `pnpm type-check`, `pnpm build`, and `git diff --check` pass. Added Node type declarations to repair the existing Vite configuration build error.

## Residual test gaps

The in-app browser's download-event capture could not retrieve blob downloads. Export completion and retryable download links were verified, but actual downloaded files on disk and Telegram upload/playback were not verified. ZIP contents were checked through the utility round-trip, not by claiming a retrieved browser archive.

## Asset provenance

- Saved sticker: `public/demos/reaction-cat.png`, original generated image, 1254 × 1254 px with transparency.
- Final prompt: “cheerful chubby orange-and-cream cat waving and holding ‘收到’, flat cartoon illustration with thick dark outlines and white sticker border.”

## Implementation checklist

- [x] Real demos for all three creation types.
- [x] Static/animated format choice only.
- [x] Working text, sticker and banner editors with persistence.
- [x] Single master banner, adjacent crops and numbered ZIP export.
- [x] Actual font previews and bundled licenses.
- [x] Browser-rendered evidence and combined source comparison.
- [x] Desktop/mobile checks, build and type checks.

## Project ordering and creation preview update — 2026-10-05

- Opening an editor refreshes only its thumbnail cache. Thumbnail changes and identical saves preserve `updatedAt`; actual content edits advance it.
- Pure update-helper assertions cover identical nested values, thumbnail-only changes, real edits, and sorted-list behavior.
- Browser regression: opened the static text, static sticker, static banner, and animated banner projects; all four kept the original six-project sidebar order.
- Homepage has no project sidebar on desktop and no project drawer button at 390 × 844. Home and Create have no horizontal overflow at that mobile size.
- Chinese creation examples are “天天开心 / 好运连连” and “这是一段文字”. English examples are “STAY HAPPY / GOOD LUCK” and “This is a line of text”; English phrases render in full.
- Shared creation previews contain artwork only; removed the example sender name and joined-emoji caption.
- Browser screenshots: `/tmp/stickgram-create-clean-preview-zh.png`, `/tmp/stickgram-create-clean-preview-en.png`, `/tmp/stickgram-home-no-sidebar.png`.
- Type check and production build passed; browser app console inspection returned no warning/error entries.

## Font weight and slant — 2026-10-05

- Added weight 100–900 and slant -20°–20° to static/animated text emoji and banner editors, persisted in project configuration.
- Main, context, transition and font-card previews use the selected style. Canvas exports use the same rendering path; text fitting accounts for slanted glyph bounds.
- Existing projects retain their font family's original default weight and upright appearance. Font loading is keyed by both family and requested weight.
- Browser test changed weight to 800 and slant to 12°, verified persistence after reload and matching font-card styles, and generated a WebM download link. Original visible values (700 / 0°) were restored afterward.
- Static emoji and static banner both expose the new controls. No browser console errors during verification.
- Assertions passed for family defaults, weight bounds, slant matrix direction/center, and separate loads for different font weights. Production build and diff whitespace checks passed.
- Final screenshot: `/tmp/stickgram-font-weight-slant.png`. Browser download file retrieval remains unverified, as documented above.
