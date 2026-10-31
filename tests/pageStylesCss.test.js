import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { compiledRules } from './helpers/cssRules';

// wave D: <style> bloklari tashqi faylga (`<style scoped src=...>`) ko'chirilgan sahifalar — kompilyatsiya qilingan qoidalar ro'yxati
// (kontekst|selektor|deklaratsiyalar) HEAD'dagi bilan AYNAN bir xil. Fixture: HEAD'dagi .vue <style> bloklaridan.
// Yangilash (faqat bo'lishdan oldingi manbadan!): `UPDATE_CSS=name=<eski .vue yo'li> npx vitest run tests/pageStylesCss.test.js`.
const FIXTURE = path.join(__dirname, 'fixtures', 'css', 'pageStyles.json');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');
const ROOT = path.join(__dirname, '..');
const asVue = (cssFile) => {
  const lang = cssFile.endsWith('.scss') ? ' lang="scss"' : '';
  return `<template><div/></template><style${lang}>${fs.readFileSync(path.join(ROOT, cssFile), 'utf8')}</style>`;
};
const NEW = {
  'active-device': 'assets/page-styles/active-device.css',
  family: 'assets/page-styles/family.css',
  login: 'assets/page-styles/login.scss',
  index: 'assets/page-styles/index.css',
};

describe('page styles moved to external files keep the same compiled rules', () => {
  const fx = fs.existsSync(FIXTURE) ? JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) : {};
  if (process.env.UPDATE_CSS) {
    it('writes fixture', () => {
      const [name, file] = process.env.UPDATE_CSS.split('=');
      fx[name] = compiledRules(fs.readFileSync(file, 'utf8')).map(sha);
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, JSON.stringify(fx, null, 1));
      expect(fx[name].length).toBeGreaterThan(5);
    });
    return;
  }
  for (const [name, cssFile] of Object.entries(NEW)) {
    it(name, () => {
      expect(compiledRules(asVue(cssFile)).map(sha)).toEqual(fx[name]);
      expect(fx[name].length).toBeGreaterThan(5);
    });
  }
});
