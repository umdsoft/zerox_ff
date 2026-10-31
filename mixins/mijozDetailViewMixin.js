/**
 * wave D: pages/qarz-daftari/mijoz/_id/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { buildQarzTimeline } from '@/utils/qarzDaftariTimeline'; // 29.09: Amaliyotlar tarixi kartasi (soni, oxirgi sana); 01.10: aktiv qarz → amaliyot tafsiloti

const TAVSIYA_TONE = { good: 'good', warn: 'warn', bad: 'bad', new: 'none' };

export default {
  computed: {
    turi() { return this.$route.query?.turi || ''; },
    avatarColor() {
      const t = this.currentTuri;
      if (t === 'berish') {return 'bg-gradient-to-br from-blue-500 to-blue-600';}
      if (t === 'olish') {return 'bg-gradient-to-br from-green-500 to-green-600';}
      return 'bg-gradient-to-br from-gray-500 to-gray-600';
    },
    primaryTuri() {
      if (!this.data?.qarzlar?.length) {return null;}
      const counts = { berish: 0, olish: 0 };
      this.data.qarzlar.forEach(q => { counts[q.turi] = (counts[q.turi] || 0) + 1; });
      return counts.berish >= counts.olish ? 'berish' : 'olish';
    },
    /** Sahifa ko'rsatadigan qarzlar — `?turi=` query bo'lsa shu bo'yicha filter, aks holda hammasi */
    scopedQarzlar() {
      const all = this.data?.qarzlar || [];
      if (this.turi === 'berish' || this.turi === 'olish') {
        return all.filter(q => q.turi === this.turi);
      }
      return all;
    },
    activeQarzlar() {
      return this.scopedQarzlar.filter(q => q.status === 'aktiv');
    },
    hasActive() { return this.activeQarzlar.length > 0; },
    lastActiveQarz() {
      if (!this.activeQarzlar.length) {return null;}
      return this.activeQarzlar[0];
    },
    /** Ekranni boshqaruvchi turi: query → lastActiveQarz → primaryTuri */
    currentTuri() {
      return this.turi || this.lastActiveQarz?.turi || this.primaryTuri || 'berish';
    },
    isOlish() { return this.currentTuri === 'olish'; },
    jamiQarzUzs() {
      // Jami qarz = QOLDIQ summasi (qaytarilgan/voz kechilgan chegirilgan), miqdor emas.
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'UZS' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    jamiQarzUsd() {
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'USD' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    // 27.09 (S2-4): quyidagi 3 ta sana computed'i shablonda endi ko'rsatilmaydi (yig'ma sana bloki
    // olib tashlandi), lekin ataylab QOLDIRILDI — sanalar ma'lumotda saqlanadi, kelajakda kerak bo'lishi mumkin.
    lastBerilganSana() {
      return this.lastActiveQarz?.berilgan_sana || this.data?.qarzlar?.[0]?.berilgan_sana || null;
    },
    lastQaytarishSanasi() {
      return this.lastActiveQarz?.qaytarish_sanasi || null;
    },
    lastBolibTolash() {
      if (this.bolibTolashList.length) {return this.bolibTolashList[0];}
      const q = this.lastActiveQarz;
      return (q && (Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0)) ? q : null;
    },
    totalLabel() {
      const parts = [];
      if (this.jamiQarzUzs > 0) {parts.push(this.formatMoney(this.jamiQarzUzs) + ' UZS');}
      if (this.jamiQarzUsd > 0) {parts.push(this.formatMoney(this.jamiQarzUsd) + ' USD');}
      return parts.join(' • ');
    },
    /** Tahrirlash modalidagi "Saqlash" tugmasi o'chiq bo'ladimi */
    editDisabled() {
      return this.editLoading || !String(this.editForm.fish || '').trim();
    },
    /** "Qaytarishni talab qilish" tugmasi o'chiq bo'ladimi */
    talabDisabled() {
      return this.qtBusy || !this.hasActive || !this.lastActiveQarz;
    },
    /** 02.10: talab SMS tarifda yo'q (muddati tugagan/Free) — tugma qulf bilan, bosilsa taklif */
    talabLocked() {
      // Tarif — do'kon EGASINIKI: qarz boshqa egaga tegishli (foydalanuvchi shu do'konda xodim) bo'lsa
      // o'z tarifimiz bo'yicha qulflamaymiz — server egasi tarifini tekshiradi (403 plan-required).
      const ownerId = this.lastActiveQarz && this.lastActiveQarz.user_id;
      const meId = this.$auth && this.$auth.user && this.$auth.user.id;
      if (ownerId && meId && Number(ownerId) !== Number(meId)) { return false; }
      return this.isFeatureLocked('manual_sms_send');
    },
    /** 27.09 (S2-7): `initials` (bosh harflar) olib tashlandi — avatar endi odam siluet ikonkasi. */
    /** 27.09 (S2-6): "Aktiv qarzlar" ro'yxati — sahifa turi (berish/olish) bo'yicha faqat aktivlar */
    activeDebtList() {
      const t = this.currentTuri;
      return this.activeQarzlar.filter((q) => q.turi === t);
    },
    /** SS-DEV (2026-09-26): valyuta bo'yicha Umumiy (qoldiq + undirilgan) / Undirilgan / Qolgan */
    statLines() {
      const s = this.statsBox;
      const rows = [
        { cur: 'UZS', paid: s.undirilganUzs, left: s.qoldiqUzs },
        { cur: 'USD', paid: s.undirilganUsd, left: s.qoldiqUsd },
      ].map((r) => ({ ...r, total: r.paid + r.left }));
      const nonZero = rows.filter((r) => r.total > 0);
      return nonZero.length ? nonZero : [rows[0]];
    },
    /** Jarayon foizi — asosiy valyuta (UZS bo'lsa UZS, aks holda USD) bo'yicha */
    progressPct() {
      const r = this.statLines[0];
      if (!r || !r.total) {return 0;}
      return Math.max(0, Math.min(100, Math.round((r.paid / r.total) * 100)));
    },
    /** SS-DEV (2026-09-26): tavsiya darajasi → matn va ranglar */
    tavsiyaView() {
      const t = this.texts;
      const lv = (this.tavsiya && this.tavsiya.level) || 'new';
      const map = {
        good: { title: t.tvGoodTitle, text: t.tvGoodText, color: '#15803D', style: 'background:#ECFDF5', iconStyle: 'background:#D1FAE5;color:#047857' },
        warn: { title: t.tvWarnTitle, text: t.tvWarnText, color: '#B45309', style: 'background:#FFFBEB', iconStyle: 'background:#FEF3C7;color:#B45309' },
        bad: { title: t.tvBadTitle, text: t.tvBadText, color: '#B91C1C', style: 'background:#FEF2F2', iconStyle: 'background:#FEE2E2;color:#B91C1C' },
        new: { title: t.tvNewTitle, text: t.tvNewText, color: '#4338CA', style: 'background:#EEF2FF', iconStyle: 'background:#E0E7FF;color:#4338CA' },
      };
      return map[lv] || map.new;
    },
    /** 29.09: Tavsiya kartasi rangi va qo'shimcha izohi ("(2/3 o'z vaqtida) · o'rtacha kechikish: 6 kun") */
    tavsiyaTone() {
      return TAVSIYA_TONE[(this.tavsiya && this.tavsiya.level) || 'new'] || 'none';
    },
    tavsiyaMeta() {
      const tv = this.tavsiya;
      if (!tv || tv.level === 'new') {return '';}
      const parts = [];
      if (tv.total) {parts.push(`(${tv.on_time}/${tv.total} ${this.texts.onTime})`);}
      if (Number(tv.avg_delay_days) > 0) {parts.push(`${this.texts.avgDelay}: ${Math.round(Number(tv.avg_delay_days))} ${this.texts.days}`);}
      return parts.join(' · ');
    },
    /** 29.09: to'liq Amaliyotlar tarixi sahifasi havolasi (turi saqlanadi) */
    historyUrl() {
      if (!this.data?.mijoz) {return '#';}
      return this.localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: this.data.mijoz.id } }) + (this.turi ? '?turi=' + this.turi : '');
    },
    /** 29.09: amaliyotlar (to'liq tarix sahifasi bilan AYNAN bir xil qatorlar — utils/qarzDaftariTimeline) */
    timeline() {
      return buildQarzTimeline(this.scopedQarzlar, this.data?.tranzaksiyalar);
    },
    /** Do'kon (savdo faoliyati) nomi — backend history javobida beriladi */
    dokonNomi() {
      return this.data?.mijoz?.savdoFaoliyat?.nomi || '';
    },
    /**
     * Mobil ilovadagi 2 ta katak: "Qoldiq qarz" va "Undirilgan qarz".
     * Backend `history` javobidagi tayyor stats ishlatiladi — u yerda voz
     * kechilgan summa undirilgandan allaqachon ayrilgan (kechirilgan qarz
     * "undirilgan" bo'lib ko'rinmasligi uchun).
     */
    statsBox() {
      const s = this.data?.stats || {};
      const k = this.isOlish ? 'olingan' : 'berilgan';
      const qoldiq = s['qoldiq_' + k] || {};
      const undirilgan = s['undirilgan_' + k] || {};
      return {
        qoldiqUzs: Number(qoldiq.uzs) || 0,
        qoldiqUsd: Number(qoldiq.usd) || 0,
        undirilganUzs: Number(undirilgan.uzs) || 0,
        undirilganUsd: Number(undirilgan.usd) || 0,
      };
    },
    newDebtUrl() {
      if (!this.data?.mijoz?.savdo_faoliyat_id) {return '#';}
      // currentTuri ishlatamiz — badge va Yangi qarz tugma rangi bilan mos
      const t = this.currentTuri || 'berish';
      const name = t === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi';
      return this.localePath({ name, params: { id: this.data.mijoz.savdo_faoliyat_id } }) + `?mijoz_id=${this.data.mijoz.id}`;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarz tafsiloti", back: "Orqaga", history: "Amaliyotlar tarixi", receipt: "Kvitansiya",
          jamiQarz: "Jami qarz",
          lastDateBerish: "Berilgan sana", lastDateOlish: "Olingan sana", lastReturnDate: "Qaytarish sanasi",
          installment: "Bo'lib to'lash", month: "oy",
          installmentTable: "Bo'lib to'lash jadvali",
          actions: "Amallar",
          demand: "Qaytarishni talab qilish", sending: "Yuborilmoqda...",
          cardTitle: "Plastik karta raqami", cardLabel: "Karta raqami",
          cardHint: "Talab SMS'ida qarz oluvchiga pul o'tkazish uchun do'kon kartasi ko'rsatiladi. Karta do'kon ma'lumotlariga saqlanadi.",
          cardHolder: "Karta egasi (FISh)", cardHolderPh: "Ism Familiya", // SS-DEV (2026-09-24): 4-rasm
          cardRule: "16 ta raqam. Faqat O'zbekiston kartasi (Uzcard / Humo).",
          cardInvalid: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak", cardSend: "Saqlash",
          cardOwnerOnly: "Do'kon egasi plastik karta raqamini kiritishi kerak.",
          closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish",
          repay: "Qarzni qaytarish",
          active: "Aktiv", allClosed: "Barchasi yopilgan", noActiveDebts: "Aktiv qarzlar yo'q",
          newDebt: "Yangi qarz qo'shish", newDebtShort: "Yangi qarz",
          qoldiqQarz: "Qoldiq qarz", undirilganQarz: "Undirilgan qarz", qaytarilganQarz: "Qaytarilgan qarz",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Telefon raqami kiritilmagan", storeLabel: "Do'kon",
          actionsApplyTo: "Eng oxirgi aktiv qarzga qo'llanadi",
          qarzOluvchi: "Qarz oluvchi", qarzBeruvchi: "Qarz beruvchi",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
          editTitle: "Qarz oluvchi ma'lumotlarini tahrirlash",
          fishLabel: "F.I.O", fishPlaceholder: "Familiya Ism Sharif",
          phoneLabel: "Telefon raqami", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          fishRequired: "F.I.O kiritilishi shart",
          fishTooLong: "F.I.O 200 belgidan oshmasligi kerak",
          phoneInvalid: "Telefon formati noto'g'ri (+998XXXXXXXXX)",
          saved: "Ma'lumotlar yangilandi",
          saveError: "Saqlashda xatolik yuz berdi",
          // SS-DEV (2026-09-26), 12-band: yangi dizayn + tavsiya
          berilganQarz: "Berilgan qarz", olinganQarz: "Olingan qarz",
          umumiySumma: "Jami qarz", qolgan: "Qoldiq qarz", jarayon: "Undirish ko'rsatkichi", // 29.09 (doc2 1-rasm): faqat shu sahifa qarzSanasi: "Qarz sanasi",
          tavsiya: "Tavsiya", onTime: "o'z vaqtida", avgDelay: "o'rtacha kechikish", days: "kun",
          tvGoodTitle: "Ishonchli mijoz", tvGoodText: "Qarzlarini o'z vaqtida qaytargan.",
          tvWarnTitle: "Ehtiyot bo'ling", tvWarnText: "Ba'zan kechiktirgan.",
          tvBadTitle: "Ehtiyot bo'ling", tvBadText: "Qarzlarini ko'pincha kechiktirib qaytargan.",
          tvNewTitle: "Yangi mijoz", tvNewText: "Tarix yo'q.",
          // 27.09 (S2-1/2/6): faqat shu sahifa uchun qisqa tugma matnlari + aktiv qarzlar ro'yxati
          demandShort: "Talab qilish", forgiveShort: "Voz kechish", activeDebtsTitle: "Aktiv qarzlar", colAmount: "Qarz miqdori", colDue: "Qaytarish sanasi", overdue: "Muddati o'tgan", openDebt: "Amaliyot tafsilotini ochish", activeDebtsEmptyHint: "Bu mijoz bilan barcha qarzlar yopilgan.",
          // 29.09 (doc2 1-rasm): Amaliyotlar tarixi kartasi
          opsSuffix: "ta amaliyot", lastOp: "oxirgisi", viewAll: "Barchasini ko'rish", noOps: "Hali amaliyotlar yo'q", moreOps: "Yana {n} ta amaliyot — barchasini ko'rish", openOp: "Amaliyot tafsilotini ochish",
          cntGiven: "Berildi", cntTaken: "Olindi", cntRepaid: "Qaytarildi", cntForgiven: "Voz kechildi",
          amalBerish: "Qarz berildi", amalOlish: "Qarz olindi", amalQaytarish: "Qarz qaytarildi", amalVoz: "Qarzdan voz kechildi",
        },
        ru: {
          title: "Детали долга", back: "Назад", history: "История операций", receipt: "Квитанция",
          jamiQarz: "Общий долг",
          lastDateBerish: "Дата выдачи", lastDateOlish: "Дата получения", lastReturnDate: "Дата возврата",
          installment: "Рассрочка", month: "мес",
          installmentTable: "График рассрочки",
          actions: "Действия",
          demand: "Потребовать возврат", sending: "Отправка...",
          cardTitle: "Номер пластиковой карты", cardLabel: "Номер карты",
          cardHint: "В SMS-требовании должнику будет указана карта магазина для перевода. Карта сохранится в данных магазина.",
          cardHolder: "Владелец карты (ФИО)", cardHolderPh: "Имя Фамилия",
          cardRule: "16 цифр. Только карты Узбекистана (Uzcard / Humo).",
          cardInvalid: "Номер карты должен содержать 16 цифр", cardSend: "Сохранить",
          cardOwnerOnly: "Номер карты должен ввести владелец магазина.",
          closeDebt: "Закрыть долг", forgive: "Простить долг",
          repay: "Вернуть долг",
          active: "Активный", allClosed: "Все закрыты", noActiveDebts: "Нет активных долгов",
          newDebt: "Добавить новый долг", newDebtShort: "Новый долг",
          qoldiqQarz: "Остаток долга", undirilganQarz: "Взысканный долг", qaytarilganQarz: "Возвращённый долг",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Номер телефона не указан", storeLabel: "Магазин",
          actionsApplyTo: "Применяется к последнему активному долгу",
          qarzOluvchi: "Должник", qarzBeruvchi: "Кредитор",
          errorTitle: "Клиент не найден или нет доступа",
          editTitle: "Редактировать данные должника",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Имя Отчество",
          phoneLabel: "Номер телефона", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          fishRequired: "Ф.И.О обязательно",
          fishTooLong: "Ф.И.О не должно превышать 200 символов",
          phoneInvalid: "Неверный формат телефона (+998XXXXXXXXX)",
          saved: "Данные обновлены",
          saveError: "Ошибка при сохранении",
          berilganQarz: "Выданный долг", olinganQarz: "Полученный долг",
          umumiySumma: "Общий долг", qolgan: "Остаток долга", jarayon: "Показатель взыскания", // 29.09 qarzSanasi: "Дата долга",
          tavsiya: "Рекомендация", onTime: "вовремя", avgDelay: "средняя задержка", days: "дн.",
          tvGoodTitle: "Надёжный клиент", tvGoodText: "Возвращал долги вовремя.",
          tvWarnTitle: "Будьте осторожны", tvWarnText: "Иногда задерживал.",
          tvBadTitle: "Будьте осторожны", tvBadText: "Часто возвращал долги с задержкой.",
          tvNewTitle: "Новый клиент", tvNewText: "Истории нет.",
          // 27.09 (S2-1/2/6)
          demandShort: "Потребовать", forgiveShort: "Простить", activeDebtsTitle: "Активные долги", colAmount: "Сумма долга", colDue: "Дата возврата", overdue: "Просрочен", openDebt: "Открыть детали операции", activeDebtsEmptyHint: "Все долги с этим клиентом закрыты.",
          opsSuffix: "операций", lastOp: "последняя", viewAll: "Смотреть все", noOps: "Операций пока нет", moreOps: "Ещё {n} операций — смотреть все", openOp: "Открыть детали операции",
          cntGiven: "Выдано", cntTaken: "Получено", cntRepaid: "Возвращено", cntForgiven: "Прощено",
          amalBerish: "Долг выдан", amalOlish: "Долг получен", amalQaytarish: "Долг возвращён", amalVoz: "Долг прощён",
        },
        kr: {
          title: "Қарз тафсилоти", back: "Орқага", history: "Амалиётлар тарихи", receipt: "Квитансия",
          jamiQarz: "Жами қарз",
          lastDateBerish: "Берилган сана", lastDateOlish: "Олинган сана", lastReturnDate: "Қайтариш санаси",
          installment: "Бўлиб тўлаш", month: "ой",
          installmentTable: "Бўлиб тўлаш жадвали",
          actions: "Амаллар",
          demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...",
          cardTitle: "Пластик карта рақами", cardLabel: "Карта рақами",
          cardHint: "Талаб SMS'ида қарз олувчига пул ўтказиш учун дўкон картаси кўрсатилади. Карта дўкон маълумотларига сақланади.",
          cardHolder: "Карта эгаси (ФИШ)", cardHolderPh: "Исм Фамилия",
          cardRule: "16 та рақам. Фақат Ўзбекистон картаси (Uzcard / Humo).",
          cardInvalid: "Карта рақами 16 та рақамдан иборат бўлиши керак", cardSend: "Сақлаш",
          cardOwnerOnly: "Дўкон эгаси пластик карта рақамини киритиши керак.",
          closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш",
          repay: "Қарзни қайтариш",
          active: "Актив", allClosed: "Барчаси ёпилган", noActiveDebts: "Актив қарзлар йўқ",
          newDebt: "Янги қарз қўшиш", newDebtShort: "Янги қарз",
          qoldiqQarz: "Қолдиқ қарз", undirilganQarz: "Ундирилган қарз", qaytarilganQarz: "Қайтарилган қарз",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Телефон рақами киритилмаган", storeLabel: "Дўкон",
          actionsApplyTo: "Энг охирги актив қарзга қўлланади",
          qarzOluvchi: "Қарз олувчи", qarzBeruvchi: "Қарз берувчи",
          errorTitle: "Мижоз топилмади ёки рухсат йўқ",
          editTitle: "Қарз олувчи маълумотларини таҳрирлаш",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Исм Шариф",
          phoneLabel: "Телефон рақами", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          fishRequired: "Ф.И.О киритилиши шарт",
          fishTooLong: "Ф.И.О 200 белгидан ошмаслиги керак",
          phoneInvalid: "Телефон формати нотўғри (+998XXXXXXXXX)",
          saved: "Маълумотлар янгиланди",
          saveError: "Сақлашда хатолик юз берди",
          berilganQarz: "Берилган қарз", olinganQarz: "Олинган қарз",
          umumiySumma: "Жами қарз", qolgan: "Қолдиқ қарз", jarayon: "Ундириш кўрсаткичи", // 29.09 qarzSanasi: "Қарз санаси",
          tavsiya: "Тавсия", onTime: "ўз вақтида", avgDelay: "ўртача кечикиш", days: "кун",
          tvGoodTitle: "Ишончли мижоз", tvGoodText: "Қарзларини ўз вақтида қайтарган.",
          tvWarnTitle: "Эҳтиёт бўлинг", tvWarnText: "Баъзан кечиктирган.",
          tvBadTitle: "Эҳтиёт бўлинг", tvBadText: "Қарзларини кўпинча кечиктириб қайтарган.",
          tvNewTitle: "Янги мижоз", tvNewText: "Тарих йўқ.",
          // 27.09 (S2-1/2/6)
          demandShort: "Талаб қилиш", forgiveShort: "Воз кечиш", activeDebtsTitle: "Актив қарзлар", colAmount: "Қарз миқдори", colDue: "Қайтариш санаси", overdue: "Муддати ўтган", openDebt: "Амалиёт тафсилотини очиш", activeDebtsEmptyHint: "Бу мижоз билан барча қарзлар ёпилган.",
          opsSuffix: "та амалиёт", lastOp: "охиргиси", viewAll: "Барчасини кўриш", noOps: "Ҳали амалиётлар йўқ", moreOps: "Яна {n} та амалиёт — барчасини кўриш", openOp: "Амалиёт тафсилотини очиш",
          cntGiven: "Берилди", cntTaken: "Олинди", cntRepaid: "Қайтарилди", cntForgiven: "Воз кечилди",
          amalBerish: "Қарз берилди", amalOlish: "Қарз олинди", amalQaytarish: "Қарз қайтарилди", amalVoz: "Қарздан воз кечилди",
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          title: "Debt details", back: "Back", history: "Transaction history", receipt: "Receipt",
          jamiQarz: "Total debt",
          lastDateBerish: "Date given", lastDateOlish: "Date received", lastReturnDate: "Repayment date",
          installment: "Instalments", month: "months",
          installmentTable: "Instalment schedule",
          actions: "Actions",
          demand: "Demand repayment", sending: "Sending...",
          cardTitle: "Bank card number", cardLabel: "Card number",
          cardHint: "The shop card is shown in the demand SMS so the borrower can transfer money. The card is saved to the shop details.",
          cardHolder: "Card holder (full name)", cardHolderPh: "First name Last name",
          cardRule: "16 digits. Uzbekistan cards only (Uzcard / Humo).",
          cardInvalid: "The card number must consist of 16 digits", cardSend: "Save",
          cardOwnerOnly: "The shop owner must enter the bank card number.",
          closeDebt: "Close the debt", forgive: "Waive the debt",
          repay: "Repay the debt",
          active: "Active", allClosed: "All closed", noActiveDebts: "No active debts",
          newDebt: "Add a new debt", newDebtShort: "New debt",
          qoldiqQarz: "Remaining debt", undirilganQarz: "Collected debt", qaytarilganQarz: "Repaid debt",
          noPhone: "No phone number entered", storeLabel: "Shop",
          actionsApplyTo: "Applies to the most recent active debt",
          qarzOluvchi: "Borrower", qarzBeruvchi: "Lender",
          errorTitle: "Customer not found or access denied",
          editTitle: "Edit borrower details",
          fishLabel: "Full name", fishPlaceholder: "Last name First name Patronymic",
          phoneLabel: "Phone number", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Cancel", save: "Save", saving: "Saving...",
          fishRequired: "Full name is required",
          fishTooLong: "Full name must not exceed 200 characters",
          phoneInvalid: "Invalid phone format (+998XXXXXXXXX)",
          saved: "Details updated",
          saveError: "An error occurred while saving",
          berilganQarz: "Debt given", olinganQarz: "Debt received",
          umumiySumma: "Total debt", qolgan: "Remaining debt", jarayon: "Collection rate", // 29.09 qarzSanasi: "Debt date",
          tavsiya: "Recommendation", onTime: "on time", avgDelay: "average delay", days: "days",
          tvGoodTitle: "Reliable customer", tvGoodText: "Repaid debts on time.",
          tvWarnTitle: "Be careful", tvWarnText: "Sometimes repaid late.",
          tvBadTitle: "Be careful", tvBadText: "Often repaid debts late.",
          tvNewTitle: "New customer", tvNewText: "No history.",
          // 27.09 (S2-1/2/6)
          demandShort: "Demand", forgiveShort: "Waive", activeDebtsTitle: "Active debts", colAmount: "Debt amount", colDue: "Repayment date", overdue: "Overdue", openDebt: "Open transaction details", activeDebtsEmptyHint: "All debts with this customer are closed.",
          opsSuffix: "transactions", lastOp: "latest", viewAll: "View all", noOps: "No transactions yet", moreOps: "{n} more transactions — view all", openOp: "Open transaction details",
          cntGiven: "Given", cntTaken: "Received", cntRepaid: "Repaid", cntForgiven: "Waived",
          amalBerish: "Debt given", amalOlish: "Debt received", amalQaytarish: "Debt repaid", amalVoz: "Debt waived",
        },
        kaa: {
          title: "Qarız detalları", back: "Artqa", history: "Ámeliyatlar tariyxı", receipt: "Kvitanciya",
          jamiQarz: "Jámi qarız",
          lastDateBerish: "Berilgen sáne", lastDateOlish: "Alınǵan sáne", lastReturnDate: "Qaytarıw sánesi",
          installment: "Bólip tólew", month: "ay",
          installmentTable: "Bólip tólew kestesi",
          actions: "Ámeller",
          demand: "Qaytarıwdı talap etiw", sending: "Jiberilmekte...",
          cardTitle: "Plastik karta nomeri", cardLabel: "Karta nomeri",
          cardHint: "Talap SMS'inde qarız alıwshıǵa aqsha ótkeriw ushın dúkan kartası kórsetiledi. Karta dúkan maǵlıwmatlarına saqlanadı.",
          cardHolder: "Karta iyesi (F.A.Á.)", cardHolderPh: "Atı Familiyası",
          cardRule: "16 san. Tek Ózbekstan kartası (Uzcard / Humo).",
          cardInvalid: "Karta nomeri 16 sannan ibarat bolıwı kerek", cardSend: "Saqlaw",
          cardOwnerOnly: "Dúkan iyesi plastik karta nomerin kiritiwi kerek.",
          closeDebt: "Qarızdı jabıw", forgive: "Qarızdan waz keshiw",
          repay: "Qarızdı qaytarıw",
          active: "Aktiv", allClosed: "Hámmesi jabılǵan", noActiveDebts: "Aktiv qarızlar joq",
          newDebt: "Jańa qarız qosıw", newDebtShort: "Jańa qarız",
          qoldiqQarz: "Qalǵan qarız", undirilganQarz: "Óndirilgen qarız", qaytarilganQarz: "Qaytarılǵan qarız",
          noPhone: "Telefon nomeri kiritilmegen", storeLabel: "Dúkan",
          actionsApplyTo: "Eń sońǵı aktiv qarızǵa qollanıladı",
          qarzOluvchi: "Qarız alıwshı", qarzBeruvchi: "Qarız beriwshi",
          errorTitle: "Klient tabılmadı yamasa kiriw ruqsatı joq",
          editTitle: "Qarız alıwshı maǵlıwmatların ózgertiw",
          fishLabel: "F.A.Á.", fishPlaceholder: "Familiyası Atı Ákesiniń atı",
          phoneLabel: "Telefon nomeri", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Biykar etiw", save: "Saqlaw", saving: "Saqlanbaqta...",
          fishRequired: "F.A.Á. kiritiliwi shárt",
          fishTooLong: "F.A.Á. 200 belgiden aspawı kerek",
          phoneInvalid: "Telefon formatı nadurıs (+998XXXXXXXXX)",
          saved: "Maǵlıwmatlar jańalandı",
          saveError: "Saqlawda qátelik júz berdi",
          berilganQarz: "Berilgen qarız", olinganQarz: "Alınǵan qarız",
          umumiySumma: "Jámi qarız", qolgan: "Qaldıq qarız", jarayon: "Óndiriw kórsetkishi", // 29.09 qarzSanasi: "Qarız sánesi",
          tavsiya: "Usınıs", onTime: "óz waqtında", avgDelay: "ortasha keshigiw", days: "kún",
          tvGoodTitle: "Isenimli klient", tvGoodText: "Qarızların óz waqtında qaytarǵan.",
          tvWarnTitle: "Abaylı bolıń", tvWarnText: "Geyde keshiktirgen.",
          tvBadTitle: "Abaylı bolıń", tvBadText: "Qarızların kóbinese keshiktirip qaytarǵan.",
          tvNewTitle: "Jańa klient", tvNewText: "Tariyx joq.",
          // 27.09 (S2-1/2/6)
          demandShort: "Talap etiw", forgiveShort: "Waz keshiw", activeDebtsTitle: "Aktiv qarızlar", colAmount: "Qarız muǵdarı", colDue: "Qaytarıw sánesi", overdue: "Múddeti ótken", openDebt: "Ámeliyat detalların ashıw", activeDebtsEmptyHint: "Bul klient penen barlıq qarızlar jabılǵan.",
          opsSuffix: "ámeliyat", lastOp: "sońǵısı", viewAll: "Barlıǵın kóriw", noOps: "Ele ámeliyatlar joq", moreOps: "Jáne {n} ámeliyat — barlıǵın kóriw", openOp: "Ámeliyat detalların ashıw",
          cntGiven: "Berildi", cntTaken: "Alındı", cntRepaid: "Qaytarıldı", cntForgiven: "Waz keshildi",
          amalBerish: "Qarız berildi", amalOlish: "Qarız alındı", amalQaytarish: "Qarız qaytarıldı", amalVoz: "Qarızdan waz keshildi",
        },
      };
      return t[l] || t.uz;
    },
  },
};
