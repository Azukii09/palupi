// lib/utils/getDeepKeys.ts

type AnyObject = Record<string, unknown>;

function traverseObject(
    obj: AnyObject,
    prefix: string,
    out: Set<string>
) {
    for (const key of Object.keys(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        out.add(path);

        const val = obj[key];
        if (val !== null && typeof val === 'object') {
            if (Array.isArray(val)) {
                (val as unknown[]).forEach(el => {
                    if (el !== null && typeof el === 'object') {
                        traverseObject(el as AnyObject, `${path}[]`, out);
                    }
                });
            } else {
                traverseObject(val as AnyObject, path, out);
            }
        }
    }
}

export interface GetDeepKeysOptions {
    skipParents?: boolean;
    stripPrefixes?: string[];
    renameMap?: Record<string, string>;
    customTransform?: (path: string) => string;
    excludeParents?: string[];
}

export function getDeepKeys(
    data?: AnyObject[],
    options: GetDeepKeysOptions = {}
): string[] {
    const {
        skipParents = false,
        stripPrefixes = [],
        renameMap = {},
        customTransform,
        excludeParents = [],
    } = options;

    // 1) Kumpulkan semua path mentah
    const keySet = new Set<string>();
    for (const item of data || []) {
        traverseObject(item, '', keySet);
    }
    let paths = Array.from(keySet);

    // 2) Skip semua parent jika diinginkan
    if (skipParents) {
        paths = paths.filter(p =>
            !paths.some(q =>
                q !== p && (q.startsWith(`${p}.`) || q.startsWith(`${p}[]`))
            )
        );
    }

    // 3) Strip prefix tertentu
    if (stripPrefixes.length) {
        paths = paths.map(p => {
            for (const prefix of stripPrefixes) {
                const re = new RegExp(`^${prefix}\\.`);
                if (re.test(p)) return p.replace(re, '');
            }
            return p;
        });
    }

    // 4) Rename via map
    if (Object.keys(renameMap).length) {
        paths = paths.map(p => renameMap[p] ?? p);
    }

    // 5) Transform kustom
    if (customTransform) {
        paths = paths.map(p => customTransform(p));
    }

    // 6) Exclude parent spesifik
    if (excludeParents.length) {
        paths = paths.filter(p => !excludeParents.includes(p));
    }

    // 7) Dedupe
    return Array.from(new Set(paths));
}
