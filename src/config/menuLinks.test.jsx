import { getConfig } from '@edx/frontend-platform';

import { getCustomMenuLinks } from './menuLinks';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const intl = {
  locale: 'ar',
  formatMessage: ({ defaultMessage }) => defaultMessage,
};

describe('getCustomMenuLinks', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({
      MARKETING_SITE_BASE_URL: 'https://marketing.test/',
      LANGUAGE_CODE: 'ar',
    });
  });

  it('matches the marketing header: Explore, Courses and Contact', () => {
    const links = getCustomMenuLinks(intl);

    expect(links.map((item) => item.type)).toEqual(['item', 'item', 'item']);
    expect(links[1].href).toBe('https://marketing.test/ar/courses');
    expect(links[2].href).toBe('https://marketing.test/ar/contact-us');
  });

  it('deep-links Explore to the marketing home categories', () => {
    const links = getCustomMenuLinks(intl);

    expect(links[0].href).toBe('https://marketing.test/ar#categories');
  });

  it('keeps the learner language in every marketing link', () => {
    const links = getCustomMenuLinks({ ...intl, locale: 'en' });

    expect(links[0].href).toBe('https://marketing.test/en#categories');
    expect(links[1].href).toBe('https://marketing.test/en/courses');
    expect(links[2].href).toBe('https://marketing.test/en/contact-us');
  });

  it('falls back to relative links when the marketing URL is not configured', () => {
    getConfig.mockReturnValue({ LANGUAGE_CODE: 'ar' });

    const links = getCustomMenuLinks(intl);

    expect(links[0].href).toBe('/ar#categories');
    expect(links[1].href).toBe('/ar/courses');
    expect(links[2].href).toBe('/ar/contact-us');
  });
});
