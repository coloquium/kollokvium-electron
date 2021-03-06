"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transcriber = void 0;
class Transcriber {
    constructor(peeId, mediaStream, lang) {
        this.peeId = peeId;
        this.lang = lang;
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        if (this.lang) {
            this.recognition.lang = lang;
        }
        this.recognition.onspeechend = (event) => {
            if (this.isRunning)
                this.onStop(event);
            this.isRunning = false;
        };
        this.recognition.onspeechstart = () => {
        };
        this.recognition.onaudiostart = (event) => {
        };
        this.recognition.onaudioend = e => {
        };
        this.recognition.onend = (event) => {
            if (this.isRunning)
                this.onStop(event);
            this.isRunning = false;
        };
        this.recognition.onerror = (event) => {
            if (this.onError)
                this.onError(event);
        };
        this.recognition.onstart = () => {
            this.isRunning = true;
        };
        this.recognition.onresult = (event) => {
            let interim = '';
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                }
                else {
                    interim += event.results[i][0].transcript;
                }
            }
            if (final.length > 0 && this.onFinal) {
                if (this.onInterim)
                    this.onInterim(interim, final, this.lang || navigator.language);
                this.onFinal(this.peeId, final, this.lang || navigator.language);
            }
            if (interim.length > 0 && this.onInterim) {
                this.onInterim(interim, final, this.lang || navigator.language);
            }
        };
        this.stop = () => {
            if (this.isRunning) {
                this.isRunning = false;
                this.recognition.stop();
                this.onStop(event);
            }
        };
        this.start = () => {
            if (!this.isRunning) {
                this.recognition.start();
            }
        };
        if (this.onReady)
            this.onReady(this);
    }
    static textToSpeech(phrase, lang) {
        const chooseVoice = (l) => __awaiter(this, void 0, void 0, function* () {
            const voice = (yield this.getVoices()).find(voice => voice.lang == l);
            return new Promise(resolve => {
                resolve(voice);
            });
        });
        const message = new SpeechSynthesisUtterance(phrase);
        chooseVoice(lang).then((v) => {
            if (v)
                message.voice = v;
            speechSynthesis.speak(message);
        });
    }
    static getVoices() {
        return new Promise((resolve) => {
            let voices = speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
                return;
            }
            const voiceschanged = () => {
                voices = speechSynthesis.getVoices();
                resolve(voices);
                speechSynthesis.onvoiceschanged = voiceschanged;
            };
        });
    }
    static getlanguagePicker() {
        let selectLanguage = document.createElement("select");
        selectLanguage.classList.add("selected-language", "form-control");
        let notset = document.createElement("option");
        notset.value = "";
        notset.textContent = "Not set (use browser language)";
        selectLanguage.append(notset);
        Transcriber.languages.forEach((entry) => {
            let country = entry[0];
            let dialects = entry[1];
            if (dialects.length === 1) {
                let option = document.createElement("option");
                option.value = dialects[0];
                option.textContent = `${country} (${dialects[0]})`;
                selectLanguage.append(option);
            }
            else {
                let prefix = "";
                entry.forEach((a) => {
                    if (!Array.isArray(a)) {
                        prefix = a;
                    }
                    else {
                        let option = document.createElement("option");
                        option.value = a[0];
                        option.textContent = `${prefix} - ${a[1]} (${a[0]})`;
                        selectLanguage.append(option);
                    }
                });
            }
        });
        return selectLanguage;
    }
    static translateCaptions(key, phrase, from, to) {
        let payload = {
            source: from.indexOf("-") > -1 ? from.substr(0, 2) : from,
            target: to.indexOf("-") > -1 ? to.substr(0, 2) : to,
            q: phrase
        };
        return new Promise((resolve, reject) => {
            let result = fetch(`https://www.googleapis.com/language/translate/v2/?key=${key}`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            result.then((response) => {
                response.json().then((result) => {
                    if (Array.isArray(result.data.translations)) {
                        resolve(result.data.translations[0].translatedText);
                    }
                    else
                        resolve(phrase);
                }).catch(() => {
                    resolve(phrase); // pass non translated text back
                });
            }).catch(() => {
                reject(phrase);
            });
        });
    }
}
exports.Transcriber = Transcriber;
Transcriber.languages = [
    ['Afrikaans', ['af-ZA']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']],
    ['Euskara', ['eu-ES']],
    ['Français', ['fr-FR']],
    ['Galego', ['gl-ES']],
    ['Hrvatski', ['hr_HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']],
    ['Magyar', ['hu-HU']],
    ['Nederlands', ['nl-NL']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']],
    ['Română', ['ro-RO']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Türkçe', ['tr-TR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['한국어', ['ko-KR']],
    ['中文', ['zh-CN', '普通话 (中国大陆)'],
        ['zh-HK', '普通话 (香港)'],
        ['zh-TW', '中文 (台灣)'],
        ['zh-HK', '粵語 (香港)']],
    ['日本語', ['ja-JP']],
    ['Lingua latīna', ['la']]
];
