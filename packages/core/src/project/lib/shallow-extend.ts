/**
 * @param {{ [key: string]: unknown }} json
 * @param {{ [key: string]: unknown }} defaults
 */
export function shallowExtend(json: { [key: string]: any }, defaults: { [key: string]: any } = {}) {
  return Object.keys(json).reduce((obj, key) => {
    const val = json[key];

    if (Array.isArray(val)) {
      // always clobber arrays, merging isn't worth unexpected complexity
      obj[key] = val.slice();
    } else if (val && typeof val === 'object') {
      obj[key] = shallowExtend(val, obj[key]);
    } else {
      obj[key] = val;
    }

    return obj;
  }, defaults);
}
