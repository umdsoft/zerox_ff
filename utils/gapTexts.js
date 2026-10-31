/**
 * wave C: pages/finance/gap/_id.vue matn lug'atlari (2-tashkilotchi / tug'ilgan kunlar / oy nomlari) — AYNAN ko'chirildi.
 */
export const COORG_TEXTS = {
  uz: { pendingBadge: 'Telegram orqali', pendingHint: "ZeroX'ga hali kirmagan. Telegram botga o'z telefon raqamini ulashgach, guruhdagi «To'landi» tugmalari orqali to'lovni belgilay oladi.", addedPending: "Tashkilotchi qilindi. U ZeroX botiga (Telegram) o'z telefon raqamini ulashgach, to'lovlarni belgilay oladi.", added: "Qo'shimcha tashkilotchi qo'shildi" },
  ru: { pendingBadge: 'через Telegram', pendingHint: 'Ещё не заходил в ZeroX. После того как поделится номером телефона в Telegram-боте, сможет отмечать платежи кнопками в группе.', addedPending: 'Назначен организатором. Сможет отмечать платежи после того, как поделится номером телефона в боте ZeroX (Telegram).', added: 'Дополнительный организатор добавлен' },
  kr: { pendingBadge: 'Telegram орқали', pendingHint: "ZeroX'га ҳали кирмаган. Telegram ботга ўз телефон рақамини улашгач, гуруҳдаги «Тўланди» тугмалари орқали тўловни белгилай олади.", addedPending: "Ташкилотчи қилинди. У ZeroX ботига (Telegram) ўз телефон рақамини улашгач, тўловларни белгилай олади.", added: "Қўшимча ташкилотчи қўшилди" },
  kaa: { pendingBadge: 'Telegram arqalı', pendingHint: "ZeroX'qa ele kirmegen. Telegram botqa óz telefon nomerin bólisken soń, topardaǵı «Tólendi» túymeleri arqalı tólemdi belgiley aladı.", addedPending: "Shólkemlestiriwshi etildi. Ol ZeroX botına (Telegram) óz telefon nomerin bólisken soń, tólemlerdi belgiley aladı.", added: "Qosımsha shólkemlestiriwshi qosıldı" },
  en: { pendingBadge: 'via Telegram', pendingHint: 'Has not signed in to ZeroX yet. After sharing their phone number with the Telegram bot, they can mark payments with the buttons in the group.', addedPending: 'Made an organizer. They can mark payments after sharing their phone number with the ZeroX bot (Telegram).', added: 'Additional organizer added' },
};

export const BIRTHDAY_TEXTS = {
  uz: { title: "Tug'ilgan kunlar", sync: "Telegram'dan olish", syncing: 'Olinmoqda…', hint: "A'zoning tug'ilgan kuni Telegram profilidan olinadi (kiritgan bo'lsa), aks holda qo'lda kiriting. O'sha kuni ertalab 07:00 da bot gap guruhiga tabrik yuboradi.", loading: 'Yuklanmoqda…', manual: "qo'lda", notSet: 'Kiritilmagan', day: 'Kun', month: 'Oy', year: 'Yil', save: 'Saqlash', empty: "A'zolar yo'q", saved: 'Saqlandi', synced: (n) => `Telegram'dan ${n} ta tug'ilgan kun olindi`, none: "Telegram profillarida tug'ilgan kun topilmadi — qo'lda kiriting", collapsedHint: "Ochish uchun bosing — a'zolar va qo'shimcha odamlarning tug'ilgan kunlari", extrasTitle: "Gap a'zosi bo'lmagan guruhdoshlar", extrasHint: "Telegram guruhda bor, lekin gapga qo'shilmagan odamlarni qo'lda qo'shing — ular ham tabriklanadi.", extraName: 'Ism', extraTag: "guruhdosh", add: "Qo'shish", remove: "Olib tashlash", added: "Qo'shildi", removed: "Olib tashlandi" },
  ru: { title: 'Дни рождения', sync: 'Взять из Telegram', syncing: 'Загрузка…', hint: 'Дата рождения берётся из профиля Telegram (если указана), иначе введите вручную. В этот день в 07:00 бот отправит поздравление в группу.', loading: 'Загрузка…', manual: 'вручную', notSet: 'Не указано', day: 'День', month: 'Месяц', year: 'Год', save: 'Сохранить', empty: 'Нет участников', saved: 'Сохранено', synced: (n) => `Из Telegram получено ${n} дат`, none: 'В профилях Telegram даты не найдены — введите вручную', collapsedHint: 'Нажмите, чтобы открыть — дни рождения участников и дополнительных людей', extrasTitle: 'Не участники гапа (из Telegram-группы)', extrasHint: 'Добавьте вручную тех, кто есть в Telegram-группе, но не в гапе — их тоже поздравим.', extraName: 'Имя', extraTag: 'из группы', add: 'Добавить', remove: 'Удалить', added: 'Добавлено', removed: 'Удалено' },
  kr: { title: 'Туғилган кунлар', sync: "Telegram'дан олиш", syncing: 'Олинмоқда…', hint: "Аъзонинг туғилган куни Telegram профилидан олинади (киритган бўлса), акс ҳолда қўлда киритинг. Ўша куни эрталаб 07:00 да бот гап гуруҳига табрик юборади.", loading: 'Юкланмоқда…', manual: 'қўлда', notSet: 'Киритилмаган', day: 'Кун', month: 'Ой', year: 'Йил', save: 'Сақлаш', empty: 'Аъзолар йўқ', saved: 'Сақланди', synced: (n) => `Telegram'дан ${n} та туғилган кун олинди`, none: 'Telegram профилларида туғилган кун топилмади — қўлда киритинг', collapsedHint: 'Очиш учун босинг — аъзолар ва қўшимча одамларнинг туғилган кунлари', extrasTitle: 'Гап аъзоси бўлмаган гуруҳдошлар', extrasHint: 'Telegram гуруҳда бор, лекин гапга қўшилмаган одамларни қўлда қўшинг — улар ҳам табрикланади.', extraName: 'Исм', extraTag: 'гуруҳдош', add: 'Қўшиш', remove: 'Олиб ташлаш', added: 'Қўшилди', removed: 'Олиб ташланди' },
  // SS-DEV (2026-09-26): en/kaa
  en: { title: "Birthdays", sync: "Get from Telegram", syncing: 'Fetching…', hint: "A member's birthday is taken from their Telegram profile (if set), otherwise enter it manually. On that day at 07:00 the bot sends a greeting to the Gap group.", loading: 'Loading…', manual: "manual", notSet: 'Not set', day: 'Day', month: 'Month', year: 'Year', save: 'Save', empty: "No members", saved: 'Saved', synced: (n) => `${n} birthdays fetched from Telegram`, none: "No birthdays found in Telegram profiles — enter them manually", collapsedHint: "Click to expand — birthdays of members and additional people", extrasTitle: "Group members who are not Gap members", extrasHint: "Manually add people who are in the Telegram group but not in the Gap — they will be greeted too.", extraName: 'Name', extraTag: "group member", add: "Add", remove: "Remove", added: "Added", removed: "Removed" },
  kaa: { title: "Tuwılǵan kúnler", sync: "Telegram'nan alıw", syncing: 'Alınbaqta…', hint: "Aǵzanıń tuwılǵan kúni Telegram profilinen alınadı (kiritken bolsa), keri jaǵdayda qolda kiritiń. Sol kúni azanda 07:00 de bot gap toparına qutlıqlaw jiberedi.", loading: 'Júklenbekte…', manual: "qolda", notSet: 'Kiritilmegen', day: 'Kún', month: 'Ay', year: 'Jıl', save: 'Saqlaw', empty: "Aǵzalar joq", saved: 'Saqlandı', synced: (n) => `Telegram'nan ${n} tuwılǵan kún alındı`, none: "Telegram profillerinde tuwılǵan kún tabılmadı — qolda kiritiń", collapsedHint: "Ashıw ushın basıń — aǵzalar hám qosımsha adamlardıń tuwılǵan kúnleri", extrasTitle: "Gap aǵzası bolmaǵan toparlaslar", extrasHint: "Telegram toparda bar, biraq gapqa qosılmaǵan adamlardı qolda qosıń — olar da qutlıqlanadı.", extraName: 'Atı', extraTag: "toparlas", add: "Qosıw", remove: "Alıp taslaw", added: "Qosıldı", removed: "Alıp taslandı" },
};

/** Oy nomlari: ru / kr / lotin (default). */
export function getBirthdayMonths(locale) {
  const loc = locale || 'uz';
  if (loc === 'ru') {return ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']}
  if (loc === 'kr') {return ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр']}
  return ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
}

const pick = (table, locale) => table[locale || 'uz'] || table.uz;

export function getCoOrgTexts(locale) {
  return pick(COORG_TEXTS, locale);
}

export function getBirthdayTexts(locale) {
  return pick(BIRTHDAY_TEXTS, locale);
}
