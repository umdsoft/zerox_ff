import { describe, it, expect } from 'vitest';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import GapPage from '@/pages/finance/gap/_id.vue';
import gapBirthdaysMixin from '@/mixins/gapBirthdaysMixin';
import gapVenueMixin from '@/mixins/gapVenueMixin';
import gapMembersMixin from '@/mixins/gapMembersMixin';

// wave D: gap/_id.vue mixin'lariga bo'lingan — metodlar sahifada saqlanib qolgani va shablon child'lari ro'yxatdan o'tgani.

describe('gap page split', () => {
  it('page still exposes every moved method (via mixins)', () => {
    const moved = [...Object.keys(gapBirthdaysMixin.methods), ...Object.keys(gapVenueMixin.methods), ...Object.keys(gapMembersMixin.methods)];
    expect(moved).toEqual(expect.arrayContaining(['loadBirthdays', 'initVenueMap', 'destroyVenueMap', 'saveVenue', 'sendInvite', 'addMember', 'saveSettings', 'submitRestart', 'canSendNotice']));
    expect(GapPage.mixins).toEqual([gapBirthdaysMixin, gapVenueMixin, gapMembersMixin]);
    expect(Object.keys(GapPage.components)).toEqual(expect.arrayContaining(['GapMembersDraft', 'GapAddMemberModal', 'GapSettingsModal', 'GapRemoveModal', 'GapRestartModal', 'GapBirthdays']));
    // hech bir metod ikki joyda e'lon qilinmagan
    expect(new Set(moved).size).toBe(moved.length);
    for (const k of moved) { expect(Object.keys(GapPage.methods || {})).not.toContain(k); }
  });
});

describe.skipIf(!RENDER_ENABLED)('gap page SSR', () => {
  const base = {
    id: 1, name: 'Gap A', status: 'active', currency: 'UZS', is_organizer: true, organizer_id: 1, frequency: 'monthly', day_of_month: 5,
    members: [{ id: 1, user_id: 1, name: 'Ali', phone: '998901112233', turn_order: 1, amount: 1000 }], rounds: [], telegram_groups: [],
  };
  const withGap = (gap, extra = {}) => ({ ...GapPage, data() { return { ...GapPage.data.call(this), loading: false, gap, ...extra }; } });
  const mocks = {
    $t: (k) => k, $i18n: { locale: 'uz' }, $route: { params: { id: 1 } }, $auth: { user: { id: 1 } }, localePath: (x) => x, $api: {},
  };
  const stubs = ['date-picker', 'ConfirmModal', 'nuxt-link'];
  it('active gap + settings + restart + birthdays + venue modals render with all children', async () => {
    const html = await renderToHtml(withGap(base, { showSettings: true, showRestart: true, showVenue: true, venueRound: { id: 1, recipient_name: 'X' }, bdOpen: true }), { mocks, stubs });
    expect(html).toContain('finance.gap_settings');
    expect(html).toContain('finance.gap_restart_title');
    expect(html).toContain('Gap A');
  });
  it('draft gap renders members draft + add member modal', async () => {
    const html = await renderToHtml(withGap({ ...base, status: 'draft' }, { showAddMember: true }), { mocks, stubs });
    expect(html).toContain('Ali');
  });
});
