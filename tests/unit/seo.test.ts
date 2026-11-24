import { describe, expect, it } from 'vitest';
import { jsonLd, personJsonLd } from '@/lib/seo';

describe('seo helpers', () => {
  it('escapes < so JSON-LD cannot close the script tag', () => {
    expect(jsonLd({ a: '</script>' })).toBe('{"a":"\\u003c/script>"}');
  });

  it('person JSON-LD only links real URLs', () => {
    const person = personJsonLd();
    expect(person['@type']).toBe('Person');
    expect(person.sameAs.every((url: string) => url.startsWith('http'))).toBe(true);
  });
});
