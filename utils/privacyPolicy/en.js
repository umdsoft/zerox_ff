/**
 * ZeroX — Privacy Policy (English translation; the Uzbek text prevails in case of discrepancy).
 * Structure (sections, ids, blocks) mirrors uz.js — change all 5 languages together.
 */
export default {
  docLabel: 'PRIVACY POLICY',
  title: 'On the processing and protection of personal data in the “ZeroX” system',
  effectiveLabel: 'Effective date',
  effectiveDate: '30.09.2026',
  operatorLabel: 'Operator',
  operator: '“ZEROX” LLC',
  tocTitle: 'TABLE OF CONTENTS',
  print: 'Print',
  toTop: 'Back to top',
  offerLink: 'Public offer',
  homeLink: 'Home',
  intro: [
    "This Privacy Policy (the “Policy”) sets out how “ZEROX” LLC (the “Company”) collects, processes, stores, protects and discloses to third parties the personal data of users of the www.zerox.uz website, the “ZeroX” mobile application (Android, iOS) and the ZeroX Telegram bot (together, the “System”).",
    "The Policy has been prepared in accordance with the Laws of the Republic of Uzbekistan “On Personal Data” (No. ZRU-547), “On Informatization”, “On Electronic Commerce”, other applicable legislation and the Public Offer on the use of the “ZeroX” system (the “Offer”), and forms an integral part of the Offer.",
    "The Policy is organised around the System’s functions: for each function (registration, MyID identification, loan agreements, “Debt Book”, “Personal Debts”, “Personal Finance”, “Gap”, the Telegram bot, payments, notifications, etc.) separate sections describe what data is processed, for what purpose and on what legal basis, to whom it is disclosed and how long it is kept.",
  ],
  sections: [
    {
      id: 'pp1',
      title: '1. General provisions',
      blocks: [
        { p: "1.1. The Policy applies to all individuals and legal entities registered in or using the System (the “User”)." },
        { p: "1.2. By entering their mobile phone number and the confirmation code sent by SMS during registration, the User confirms that they have read this Policy, fully accept its terms and consent to the processing of their personal data for the purposes and in the manner set out in the Policy." },
        { p: "1.3. Consent for optional functions (MyID identification, the Telegram bot, “Family Budget”, “Gap”, voice messages, geolocation, etc.) is given at the moment the User activates the respective function. To use the loan agreement functions, the User additionally accepts the Offer separately." },
        { p: "1.4. If the User does not agree with the terms of the Policy, they must not register in or use the System." },
        { p: "1.5. Terms used but not defined in the Policy have the meanings given in the Offer and the legislation of the Republic of Uzbekistan. Sections 3–14 describe the data and purposes for each function, and sections 15–21 set out the rules common to all functions." },
      ],
    },
    {
      id: 'pp2',
      title: '2. Key definitions',
      blocks: [
        {
          list: [
            "Personal data — information recorded electronically, on paper and/or other tangible media that relates to a specific individual or allows them to be identified;",
            "Data subject — the individual to whom the personal data relates;",
            "Owner and operator — “ZEROX” LLC, which owns the personal data database and processes the data;",
            "Processing — any set of operations involving the collection, systematization, storage, alteration, supplementing, use, provision, dissemination, transfer, anonymization and destruction of personal data;",
            "Third party — any person other than the Company and the User;",
            "Counterparty — another person indicated in a loan agreement, debt book, personal debt or other record as a party to a relationship with the User;",
            "Cross-border transfer — the transfer of personal data to persons or services outside the territory of the Republic of Uzbekistan;",
            "Anonymization — bringing data into a state in which it can no longer be attributed to a specific person;",
            "System — the www.zerox.uz website, the “ZeroX” mobile application, the ZeroX Telegram bot and the Telegram Mini App.",
          ],
        },
      ],
    },
    {
      id: 'pp3',
      title: '3. Registration, sign-in and sessions',
      blocks: [
        { p: "3.1. The following is processed when registering and signing in to the System:" },
        {
          list: [
            "mobile phone number — the primary account identifier. A one-time confirmation code is sent to it by SMS; SMS messages are delivered via the SMS provider “Eskiz” (eskiz.uz), which receives only the phone number and the message text;",
            "one-time confirmation code — used only to confirm the phone number and valid for a short time;",
            "password — stored only as an irreversible hash produced by the bcrypt algorithm; even Company staff cannot see the original password;",
            "internal ID number in the System, interface language, registration date and account status;",
            "for legal entities (in the mobile app, via an “E-imzo” electronic digital signature key) — organisation name, TIN, full name of the director, address and contact phone number.",
          ],
        },
        { p: "3.2. Sessions and “Connected devices”. On sign-in, a short-lived access token (JWT, usually 30 minutes) and a refresh token (up to 7 days) are issued. For each session the device and browser details (user-agent: device model, operating system, browser), IP address, sign-in source (website, app, Telegram Mini App), session creation time and last activity time are stored. In the “Connected devices” section the User can see their active sessions and end the session on any device or all sessions except the current one; an ended session stops working immediately." },
        { p: "3.3. Sign-in history and security logs. For each sign-in, the IP address, device name, date and time and an approximate region (city, province) derived from the IP address are recorded; to determine the region, the IP address is sent to the external service “ip-api.com” (sections 16 and 17). Failed sign-in attempts and request rates (rate limiting) are recorded to protect the account against password guessing and abuse." },
        { p: "3.4. Password recovery and phone number changes are carried out using a confirmation code sent by SMS. The PIN code and biometric sign-in (fingerprint, Face ID) in the mobile app are verified only on the User’s device; biometric data is not transferred to the Company." },
        { p: "3.5. Purpose — creating and maintaining the account, authenticating the User and preventing unauthorised access. Legal basis — the User’s consent and the need to perform the Offer. The System cannot be used without a phone number." },
      ],
    },
    {
      id: 'pp4',
      title: '4. Identity verification (MyID)',
      blocks: [
        { p: "4.1. To conclude loan agreements and perform other legally significant actions, an individual is identified through the state identification system “MyID” (UZINFOCOM). The biometric face check (liveness detection and comparison with passport data) is carried out entirely on the “MyID” side: the Company does not receive or store the face image (selfie, video). MyID provides the Company with the verification result and the following data:" },
        {
          list: [
            "surname, first name, patronymic;",
            "date of birth, gender, nationality and citizenship;",
            "personal identification number of the individual (PINFL);",
            "passport (ID card) series and number, date of issue, issuing authority and expiry date;",
            "permanent registration address (province, district, address).",
          ],
        },
        { p: "4.2. This data is stored in the User’s profile and used to identify the party in loan agreements, acts and other documents (section 5). One PINFL can be linked to only one account. After identification the full name is treated as official and cannot be edited manually by the User; passport data is updated only through a new “MyID” check." },
        { p: "4.3. An audit record is kept for each MyID session: session identifier, operation type, result status and code, PINFL, passport series and number, date of birth, IP address, date and time. To bind a session to a specific person, the PINFL and date of birth may be sent to MyID. These records are kept to prove the lawfulness of the identification process and to prevent fraud." },
        { p: "4.4. A User who has not passed MyID may enter their full name once themselves so that it appears in personal-debt documents (receipt, SMS); such data is considered not verified by the state system and is replaced with MyID data after identification." },
        { p: "4.5. Legal basis — the User’s consent (the User initiates identification) and necessity for concluding a loan agreement (clauses 2.3–2.4 of the Offer). A User who has not been identified cannot use the loan agreement functions but can use the other sections of the System." },
      ],
    },
    {
      id: 'pp5',
      title: '5. Loan agreements',
      blocks: [
        { p: "5.1. When an electronic loan agreement is concluded between Users, the following is processed:" },
        {
          list: [
            "the parties (lender and borrower): full name, gender, passport data, PINFL, address, phone number, ID number in the System; for a legal entity — name, TIN and director;",
            "terms of the agreement: amount, currency, issue and repayment dates, agreement number and status, times of conclusion, confirmation and closing;",
            "actions and acts under the agreement: full or partial repayment, extension of the term, repayment demand, full or partial waiver of the debt, their confirmation or rejection, outstanding balance and dates;",
            "the mark of acceptance of the public offer and the time of acceptance — loan agreement actions are available only to a User who has accepted the offer;",
            "counterparty search data: the counterparty is searched by ID number in the System and date of birth (for a legal entity — by TIN), and only their full name (name) is shown as a result.",
          ],
        },
        { p: "5.2. The agreement, acts and annexes are generated as PDF files by the Company’s own PDF service. The document shows the parties’ details listed above, and a QR code may be placed on it for verification. The PDF service receives data only through a protected server-to-server channel and only the fields required for the document (passwords, balances and tokens are never provided)." },
        { p: "5.3. The other party is notified of the conclusion and confirmation of the agreement and of each request and act by an in-System notification, a push notification, a Telegram message (if the bot is connected) and, in some cases, an SMS. The message shows the full name of the requesting party, the amount and the dates." },
        { p: "5.4. The User’s Status (rating) indicator is calculated automatically on the basis of repayment discipline under agreements (clause 4.1.18 of the Offer). Other Users may be shown only the aggregated information provided for in clauses 4.2.5 and 8.2.1 of the Offer (Status, total amount of receivables and payables, including overdue debts); with whom the debts were concluded is not disclosed." },
        { p: "5.5. Purpose — concluding, storing and providing loan relationships to the parties in electronic form (clauses 2.2, 4.2.1 of the Offer). Legal basis — the need to conclude and perform the agreement, the User’s consent and legal requirements. Agreements, as legally significant documents, are kept for the periods specified in section 18." },
      ],
    },
    {
      id: 'pp6',
      title: '6. “Debt Book” and “Nasiya”',
      blocks: [
        { p: "6.1. The “Debt Book” allows a User engaged in trade (a shop owner) to keep records of goods sold to customers on credit and of debts. The following is processed:" },
        {
          list: [
            "trading activity (shop): name, province and district; optionally — a bank card number for debt repayment and the cardholder’s name, and a Telegram phone number for payment messages;",
            "customers (borrowers): full name and phone number — entered by the shop owner or their employee;",
            "debt records: amount, currency, goods or comment, issue and repayment dates, instalment schedule, payments, balance, status (active, closed, waived) and history of actions;",
            "employees: full name, phone number, password hash (bcrypt), invitation token hash, activity status; an employee sees only the data of the shop they are assigned to, and each of their actions is recorded with the employee identifier;",
            "customer complaints: reason, comment, date, full name and phone number of the complainant.",
          ],
        },
        { p: "6.2. SMS notifications. Depending on the shop owner’s tariff and SMS package, SMS messages are sent to the customer via “Eskiz”: that a debt has been recorded, that a payment has been received, a reminder on the repayment day (automatic, one consolidated reminder per customer) and a repayment demand. The demand SMS contains the shop name and the card number and Telegram phone number entered by the shop owner. The history of sent SMS (recipient phone, text, type, status, time) is kept in the shop owner’s account." },
        { p: "6.3. Customer’s view of their debt. If the customer is registered in the System with the specified phone number, they see their debt at that shop (shop name, amount, dates, payments) in their own account and may file a complaint about an incorrect record. The complaint is delivered to the shop owner as an in-System notification and (if Telegram is connected) as a Telegram message together with the complainant’s full name and phone number." },
        { p: "6.4. In the “Nasiya” section (within the tariff) the shop owner may enter information about instalment customers: full name, phone and additional phone, address, workplace, guarantor’s full name and phone, photo, credit limit and notes, as well as information about goods, instalment agreements and payments." },
        { p: "6.5. The data of customers, guarantors and employees in this section is entered by the shop owner, who is responsible for entering it lawfully and obtaining the necessary consents (section 21). The Company processes this data only to provide the function. Debt Book data can be exported (Excel, PDF) only by the shop owner. Legal basis — the need to perform the contract (Offer) with the shop owner." },
      ],
    },
    {
      id: 'pp7',
      title: '7. “Personal Debts”',
      blocks: [
        { p: "7.1. The User may keep records of personal debts they have lent or borrowed. The following is processed:" },
        {
          list: [
            "counterparty: name (full name) and phone number entered by the User, type of debt source (bank, family, friend, employer, other);",
            "debt terms: type (lent or borrowed), amount, currency, interest rate, start and repayment dates, balance, status, notes, payment history;",
            "the User’s payment details (optional): bank card number for debt repayment and the cardholder’s name, Telegram phone number;",
            "debtor profiles and payment links (tariff-dependent function): debtor’s name, phone, total and paid amounts;",
            "counterparty complaints: reason, comment and date.",
          ],
        },
        { p: "7.2. Visibility to the counterparty (“mirror” record). If the counterparty is registered in the System with the specified phone number, the record is also shown in their account: they see the name of the User who entered the debt, the amount and the dates, but cannot change the record. They may file a complaint about an incorrect record, which is delivered to the record owner as a notification and a Telegram message." },
        { p: "7.3. SMS and demands. At the User’s request, an SMS may be sent to the counterparty via “Eskiz” (debt recorded, payment, repayment demand). The demand SMS contains the User’s name and the card number and Telegram phone number they entered (if not entered — the account phone number). The User enters these details voluntarily and, by sending a demand, agrees to their disclosure to the counterparty." },
        { p: "7.4. Reliability recommendation. When a debt record is viewed, the System automatically calculates a reliability level (reliable, medium, risky) from the history of debts that the User themselves previously recorded with that person (by phone number or name) — the share repaid on time and late — and shows it only to that User. Other Users’ records are not taken into account; the recommendation is informational, has no legal effect and is not disclosed to other persons." },
        { p: "7.5. Purpose — keeping records of personal debts, reminders and simplifying settlements with the counterparty. Legal basis — the User’s consent and provision of services under the Offer. The rules of section 21 apply when entering counterparty data." },
      ],
    },
    {
      id: 'pp8',
      title: '8. “Personal Finance” and “Family Budget”',
      blocks: [
        { p: "8.1. In the “Personal Finance” section the following data entered by the User is processed:" },
        {
          list: [
            "income and expenses: amount, currency, date, category, comment and source (manual, receipt, Gap, debt payment, etc.);",
            "categories, budgets and spending limits, financial goals and the funds contributed to them;",
            "scheduled payments and expected income, and reminders about them;",
            "purchase receipts: the parameters of the fiscal receipt QR code scanned by the User (terminal number, receipt number, date, fiscal sign) are sent to the OFD system of the State Tax Committee (ofd.soliq.uz), and the receipt data returned (point of sale, goods, amount, date) is saved as an expense;",
            "analytics and recommendations: based on this data, the System automatically generates statistics and recommendations (limit exceeded, spending growth, etc.) and shows them only to the User.",
          ],
        },
        { p: "8.2. “Family Budget”. The User may invite a family member by phone number; no data is shared until the invited person accepts the invitation. After acceptance, depending on the chosen role (watcher or watched member), one party sees the full or summarised data of the other party for the permitted sections, and monthly and category limits may be set. The following is processed: members’ ID number, phone, relationship label, role, permissions, limits and link status." },
        { p: "8.3. Either party may cancel the family link at any time, after which data sharing stops. Family budget notifications are sent in the System and via Telegram." },
        { p: "8.4. Purpose — recording, planning and analysing personal and family finances. Legal basis — the User’s consent; for the family budget — the consent of both parties." },
      ],
    },
    {
      id: 'pp9',
      title: '9. “Gap” (rotating savings groups)',
      blocks: [
        { p: "9.1. In the “Gap” function the organiser creates a group and adds members by phone number. The following is processed:" },
        {
          list: [
            "group: name, contribution amount and currency, frequency, start date, organiser and members (name, phone number, ID if they have an account in the System), order of turns and round schedule;",
            "payment marks: who paid and who received in each round; when a payment is marked “paid”, it is automatically reflected in the payer’s expenses and the recipient’s income;",
            "meeting details: address text, location marked on the map (coordinates), card number and cardholder’s name for receiving funds, members’ “I’ll come / I can’t come” answers;",
            "members’ birthdays — only if they are entered, for greetings;",
            "linked Telegram groups: group identifier and title.",
          ],
        },
        { p: "9.2. Group data (members’ names, order, payment status, meeting place and card number) is visible to the members of that Gap and to the organiser. If the organiser links the Gap to a Telegram group, the bot posts reminders, the order, payment status and greetings in the group — this information is visible to all members of the Telegram group." },
        { p: "9.3. Location. The “Yandex Maps” service is used to choose the meeting place on the map; the device’s geolocation is requested only with the User’s permission and only to open the map at the current location. Location is not tracked in the background — only the meeting point chosen by the User is saved." },
        { p: "9.4. Purpose — organising the savings group, recording payments and informing members. Legal basis — the consent of the organiser and members; an organiser adding members must obtain their consent (section 21)." },
      ],
    },
    {
      id: 'pp10',
      title: '10. ZeroX Telegram bot and Mini App',
      blocks: [
        { p: "10.1. When the User links the Telegram bot to their account and uses it, the following is processed:" },
        {
          list: [
            "Telegram identifier (ID), username, name in Telegram and bot language;",
            "the phone number voluntarily sent by the User via the “Share contact” button — to link the account, with an SMS confirmation code;",
            "the Mini App PIN code — stored only as a bcrypt hash; the number of failed attempts and the temporary lock period; PIN recovery is done via an SMS code;",
            "records entered via the bot (expenses, income, debts, etc.) and a log of sent messages (type, short text, time sent);",
            "groups to which the bot has been added: group identifier and title, birthdays entered by group members themselves (Telegram ID and date).",
          ],
        },
        { p: "10.2. Voice messages. If the User adds a record by sending a voice message to the bot (when the function is enabled), the audio is sent to OpenAI’s speech recognition service (Whisper API, USA) for conversion to text; the resulting text is used only to create the record. To avoid this function, it is enough to enter the record as text." },
        { p: "10.3. Telegram messages are delivered via the Telegram platform and are also subject to Telegram’s own privacy policy. The User may stop (block) the bot at any time, after which no messages are sent to them via the bot." },
        { p: "10.4. Purpose — managing the account and records via the bot, sending notifications and serving Gap groups. Legal basis — the User’s consent (the User starts the bot and links it to their account)." },
      ],
    },
    {
      id: 'pp11',
      title: '11. Payments, “Mobile account” and tariffs',
      blocks: [
        { p: "11.1. Paid services in the System (tariffs, SMS packages) are paid from the “Mobile account” balance. The balance is topped up via the “Payme” and “Click” payment systems." },
        { p: "11.2. Bank card details (card number, expiry date, SMS code) are entered only on the payment system’s own page or app and are not transferred to the Company. The Company receives from the payment system and stores only the transaction identifier, amount, status, time of creation, completion or cancellation and information about which account the payment relates to." },
        { p: "11.3. The following is also processed: the balance and the log of its changes, transfers to another User by their ID number (amount, sender and recipient), the activated tariff, its term and status, SMS packages and SMS balance, and the history of sent SMS." },
        { p: "11.4. Purpose — carrying out settlements, confirming payments, resolving disputes, and keeping accounting and tax records. Legal basis — performance of the Offer and legal requirements. Warnings about tariff expiry are sent via the channels listed in section 12." },
      ],
    },
    {
      id: 'pp12',
      title: '12. Notifications',
      blocks: [
        { p: "12.1. The System informs the User through the following channels:" },
        {
          list: [
            "in-System notifications — the type, parties concerned, amount and time are stored in the System database; while the website or app is open they are delivered in real time (via a WebSocket connection);",
            "push notifications — the mobile app obtains a device token from the Google Firebase Cloud Messaging (FCM) service, the token is stored in the User’s account and the notification text is sent to the device via FCM;",
            "SMS — via the “Eskiz” provider: confirmation codes, debt and payment messages, reminders;",
            "Telegram — if the bot is linked: messages about debts, Gap, the family budget and other events.",
          ],
        },
        { p: "12.2. Service messages (confirmation codes, messages about agreements and payments) are an integral part of using the System. The User can turn off push notifications in the device settings and Telegram messages by stopping the bot. Advertising messages are sent only with the User’s consent (clause 11.3 of the Offer) and can be declined at any time." },
      ],
    },
    {
      id: 'pp13',
      title: '13. Mobile application: permissions and technical data',
      blocks: [
        { p: "13.1. The mobile application requests the following permissions only when the relevant function is used; they can be revoked at any time in the device settings:" },
        {
          list: [
            "camera — to scan QR codes (receipts, documents) and for the face check via “MyID” (the image is processed by MyID);",
            "location — only when choosing a “Gap” meeting place on the map; not tracked in the background;",
            "notifications — to display push messages;",
            "gallery (photos) — to attach an image selected by the User;",
            "biometrics (fingerprint, Face ID) — to confirm sign-in to the app; the check is performed only on the device.",
          ],
        },
        { p: "13.2. Technical data: IP address, device model and name, operating system and its version, app version, language settings, request and error logs. They are used for security, session management and troubleshooting." },
        { p: "13.3. App crash and error reports are sent automatically to the Google Firebase Crashlytics service: device model, operating system and app versions, error description and time, and a technical app-installation identifier. The Company does not intentionally include the User’s financial records or document data in these reports; they are used only to keep the app stable." },
      ],
    },
    {
      id: 'pp14',
      title: '14. Website: cookies, browser storage and analytics',
      blocks: [
        { p: "14.1. The website uses cookies and browser storage (localStorage, sessionStorage) to keep the sign-in session (access token), the selected language and interface settings. The personal cabinet does not work without these necessary files; if they are deleted, the User may need to sign in again." },
        { p: "14.2. The following external services are connected to the website:" },
        {
          list: [
            "“Yandex.Metrica” — statistics on visits, pages, link clicks and a click map, as well as the “Webvisor” feature (recording of the page interaction session, including cursor movements and scrolling);",
            "Google Tag (Google Analytics) — Google’s tag script, which may transmit technical data about the browser, device and visit to Google;",
            "Telegram WebApp SDK — for interaction with Telegram when the website is opened as a Telegram Mini App.",
          ],
        },
        { p: "14.3. The Company does not intentionally pass identifying data such as phone numbers or full names to analytics services and uses the resulting statistics in aggregated form. These services set their own cookies and may process data outside the Republic of Uzbekistan (section 17). The User can restrict analytics cookies in the browser settings or with tracking blockers; this does not affect the main functions of the website." },
      ],
    },
    {
      id: 'pp15',
      title: '15. Purposes and legal bases of processing',
      blocks: [
        { p: '15.1. Summary of purposes:' },
        {
          list: [
            "registering, identifying and authenticating the User and maintaining the account;",
            "providing the System’s functions (sections 3–14), including concluding, storing and providing loan agreements and documents;",
            "generating the User’s Status (reliability) indicator (clause 4.1.18 of the Offer);",
            "sending notifications (in the System, push, SMS, Telegram);",
            "carrying out payments and settlements;",
            "ensuring the security of the System and Users, preventing fraud and abuse;",
            "handling requests and complaints, providing technical support;",
            "anonymized statistical analysis to improve the quality of the System;",
            "fulfilling obligations established by law;",
            "sending information about the Company’s new services with the User’s consent (clause 11.3 of the Offer).",
          ],
        },
        { p: '15.2. Legal bases (Law No. ZRU-547):' },
        {
          list: [
            "consent of the data subject — given by entering the confirmation code at registration, accepting the Offer and activating optional functions;",
            "the need to conclude and perform the Offer and agreements concluded between Users;",
            "obligations established by the legislation of the Republic of Uzbekistan (accounting and tax records, lawful requests of competent authorities, etc.);",
            "legitimate interest in ensuring the security of the System and Users.",
          ],
        },
        { p: "15.3. The Company does not process data in a volume that is excessive or incompatible with the purposes of collection and does not use it for other purposes without the User’s consent. The Status and reliability indicators are informational; the System does not take decisions producing legal effects for the User based solely on automated processing." },
      ],
    },
    {
      id: 'pp16',
      title: '16. Disclosure of data to third parties',
      blocks: [
        { p: "16.1. The Company does not sell Users’ personal data and does not disclose it to third parties for advertising purposes." },
        { p: "16.2. Data is disclosed only to the following recipients and only to the extent necessary for the relevant function:" },
        {
          list: [
            "other Users — according to the nature of the function: to the parties of a loan agreement — the agreement details; to a Debt Book customer and a personal-debt counterparty — the record, the name of the person or shop that entered it and the payment details provided; to family members and Gap members — within the permissions granted; to all Users — the aggregated information under clause 4.2.5 of the Offer;",
            "“MyID” (UZINFOCOM) — the PINFL and date of birth for the identification session; “E-imzo” — when registering a legal entity;",
            "the SMS provider “Eskiz” — the recipient’s phone number and the SMS text;",
            "the “Payme” and “Click” payment systems — the payment amount and the User’s account identifier;",
            "Google (Firebase Cloud Messaging, Firebase Crashlytics, Google Tag) — push token and notification text, app error reports, technical data on website visits;",
            "Telegram — the text of messages sent via the bot and the Telegram identifier;",
            "Yandex — website analytics (Yandex.Metrica) and choosing a place on the map (Yandex Maps);",
            "OpenAI — only when a voice message is sent to the bot, the audio recording;",
            "ip-api.com — the IP address, to determine the approximate region in the sign-in history;",
            "the OFD system of the State Tax Committee — the fiscal parameters of a scanned receipt;",
            "providers of server, hosting and backup services — on the Company’s instructions and subject to confidentiality;",
            "courts, law enforcement and other competent state authorities — in the cases and manner provided by law (clauses 4.2.9, 8.2.2 of the Offer);",
            "in the event of the Company’s reorganisation — to its legal successor, subject to the terms of this Policy.",
          ],
        },
        { p: "16.3. Partners providing services process data only to provide the relevant service. External services (Telegram, Google, Yandex, OpenAI, payment systems) also process data in accordance with their own privacy policies." },
      ],
    },
    {
      id: 'pp17',
      title: '17. Place of storage and cross-border transfer',
      blocks: [
        { p: "17.1. In accordance with Article 27¹ of the Law “On Personal Data”, the personal data of citizens of the Republic of Uzbekistan is collected, systematized and stored in the System’s main databases on servers located in the territory of the Republic of Uzbekistan." },
        { p: "17.2. Some functions work through foreign services, so the related data (to the extent specified in clause 16.2) is transferred outside the Republic of Uzbekistan or may be processed abroad:" },
        {
          list: [
            "Telegram — the Telegram bot, Mini App and Gap groups;",
            "Google — Firebase push notifications, Crashlytics error reports, Google Tag;",
            "Yandex — Yandex.Metrica and Yandex Maps;",
            "OpenAI (USA) — converting voice messages to text;",
            "ip-api.com — determining the approximate region by IP address.",
          ],
        },
        { p: "17.3. Cross-border transfer is carried out only to the minimum extent necessary for the relevant function; no copy of the main database is transferred abroad. By using these functions (the Telegram bot, voice messages, push notifications, choosing a place on the map), the User consents to the cross-border transfer of the related data; to withhold consent, the User can refrain from using or disable these functions. Website analytics can be restricted in the ways described in clause 14.3." },
      ],
    },
    {
      id: 'pp18',
      title: '18. Retention periods and account deletion',
      blocks: [
        { p: "18.1. Data is kept until the purposes of processing are achieved and for the following periods:" },
        {
          list: [
            "account and profile data — for as long as the account is active;",
            "loan agreements, acts, Debt Book and personal-debt records — as legally significant documents for the periods established by clause 7.5 of the Offer and by law, including the limitation period after obligations have been fulfilled;",
            "payment transactions and settlement documents — for the periods established by accounting and tax legislation;",
            "one-time SMS codes — until used or expired; session tokens — until they expire or the session is ended;",
            "sign-in history, MyID sessions, audit and security logs — for the period necessary to ensure security and resolve disputes;",
            "records deleted by the User (for example, a customer or debt record) — removed from the interface immediately, but may be kept in an archived state for a certain time to preserve the integrity of settlements and protect the rights of other parties.",
          ],
        },
        { p: "18.2. Account deletion. The User may request deletion of their account and personal data through the contact channels listed in section 24. The Company verifies that the request comes from the account holder and checks for active or pending loan agreements and unsettled Debt Book balances; if such obligations exist, the account is not deleted until they are completed." },
        { p: "18.3. When the request is granted, the User’s profile data is deleted or anonymized, their sessions are ended, and the push token and Telegram link are removed. Agreements and documents concluded with other Users, payment records and data that must be kept by law remain stored for the periods specified in clause 18.1, as they relate to the rights of other parties." },
      ],
    },
    {
      id: 'pp19',
      title: '19. Data protection measures',
      blocks: [
        { p: "19.1. The Company takes legal, organisational and technical measures to protect personal data against unauthorised access, alteration, disclosure and destruction, including:" },
        {
          list: [
            "transmitting data between the website, app and server only over an encrypted connection (HTTPS/TLS);",
            "storing passwords, the Telegram PIN code and employee passwords only as bcrypt hashes, and invitation tokens as SHA-256 hashes;",
            "short-lived access tokens, rotation of refresh tokens and the ability to end sessions remotely;",
            "limiting failed sign-in attempts and request rates, temporary lock when PIN attempts are exceeded;",
            "checking data ownership on every request, restricting employees to their own shop’s data, and secret-key-protected channels for internal services (PDF service);",
            "not writing card numbers and other confidential values to system logs, and recording System administration actions in an audit log;",
            "restricting data access to authorised staff bound by confidentiality obligations, monitoring and backups.",
          ],
        },
        { p: "19.2. The User undertakes not to disclose their password, PIN code and confirmation codes to other persons (clauses 4.1.6, 6.7 of the Offer); the Company is not liable for the consequences of their disclosure through the User’s fault. If a data security breach is detected, the Company takes the measures required by law and, where necessary, notifies Users." },
      ],
    },
    {
      id: 'pp20',
      title: '20. User rights',
      blocks: [
        { p: "20.1. In accordance with the Law “On Personal Data”, the User (data subject) has the right to:" },
        {
          list: [
            "receive information about the processing of their personal data, its composition, purposes, sources, recipients and retention periods;",
            "access their data — most of it is visible in the personal cabinet, the rest is provided on request;",
            "request correction and updating of inaccurate or outdated data (data obtained via MyID is updated by re-identification);",
            "request deletion or anonymization of data or restriction of its processing (within section 18);",
            "withdraw consent to processing — in which case the relevant functions or System services may become partially or fully unavailable;",
            "opt out of advertising messages and optional notifications, and turn off optional functions (Telegram bot, family budget, Gap, geolocation);",
            "if they believe their rights have been violated, apply to the authorized state body in the field of personal data or to a court.",
          ],
        },
        { p: "20.2. Some rights the User can exercise independently: ending sessions in “Connected devices”, editing the profile and payment details, deleting their records, cancelling a family link and revoking permissions in the device settings. To exercise other rights, the User contacts the Company through the channels listed in section 24; requests are considered within the time limits established by law." },
      ],
    },
    {
      id: 'pp21',
      title: '21. Data of other persons entered by the User',
      blocks: [
        { p: "21.1. When entering data of third parties into the System (Debt Book customers, personal-debt counterparties, employees, family members, Gap members, Nasiya guarantors), the User confirms that they have obtained their consent or have another lawful basis, and is personally responsible for entering the data correctly and lawfully." },
        { p: "21.2. Such data is shown only to the User who entered it and within the relevant function (for example, to the owner of the phone number as a “mirror” record or SMS). A person who believes their data was entered into the System without their consent may use the in-System complaint function or the contact channels listed in section 24; the Company reviews the request and, if it is justified, restricts the processing of the data or deletes it." },
      ],
    },
    {
      id: 'pp22',
      title: '22. Minors',
      blocks: [
        { p: "The System is intended for persons with full legal capacity under the legislation of the Republic of Uzbekistan. The Company does not knowingly collect data of persons under 18; if such a case is identified, the data is deleted." },
      ],
    },
    {
      id: 'pp23',
      title: '23. Changes to the Policy',
      blocks: [
        { p: "23.1. The Company may amend and supplement the Policy, including when new functions are added to the System. A new version takes effect upon its publication in the System (www.zerox.uz/privacy-policy) unless it specifies a different date." },
        { p: "23.2. The Company notifies Users of material changes affecting their rights in the manner established by clause 7.4 of the Offer, at least 10 (ten) days in advance, via the personal cabinet or a notification. Continued use of the System after the changes means acceptance of the new version." },
      ],
    },
    {
      id: 'pp24',
      title: '24. Contacts and Company details',
      blocks: [
        {
          list: [
            '“ZEROX” LLC',
            'Legal and postal address: 6 Tinchlik street, Urgench city, Khorezm region, Republic of Uzbekistan',
            'TIN: 309 053 853',
            'Website: www.zerox.uz',
            'Email: info@zerox.uz',
            'Support service: Telegram — @Zeroxlbot',
          ],
        },
        { p: "When contacting us about personal data, we recommend stating your ID number in the System or your registered phone number; additional information may be requested to confirm that you are the account holder." },
      ],
    },
  ],
};
