type AnyObject = Record<string, unknown>;

export function flattenObject(
    obj: AnyObject | null | undefined,
    prefix = '',
    result: Record<string, unknown> = {}
): Record<string, unknown> {
    if (!obj || typeof obj !== 'object') {
        return result;
    }

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        // nested object
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            flattenObject(value as AnyObject, path, result);

            // array
        } else if (Array.isArray(value)) {
            const arr = value as unknown[];
            const allPrimitives = arr.every(
                v => v === null || typeof v !== 'object'
            );

            if (allPrimitives) {
                result[path] = arr.join(', ');
            } else {
                result[`${path}[]`] = arr
                    .map(el =>
                        el !== null && typeof el === 'object'
                            ? JSON.stringify(el)
                            : String(el)
                    )
                    .join(' | ');
            }

            // primitive or null
        } else {
            result[path] = value;
        }
    }

    return result;
}
