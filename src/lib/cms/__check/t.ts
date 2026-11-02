import d from "../defaults/__test.json";
import { resolvePageContent } from "../page-content";
const r = resolvePageContent(d, []);
const s: string = r.hero.meta.badge;
const h: string = r.hero.meta.ctas[0].href;
const t: string = r.plain.title;
const o: string[] = r._order;
export { s, h, t, o };
