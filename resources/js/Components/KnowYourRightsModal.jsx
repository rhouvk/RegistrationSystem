import React, { useState } from 'react';
import { FaTimes, FaBookOpen, FaIdCard, FaShoppingCart } from 'react-icons/fa';

export default function KnowYourRightsModal({ isOpen, onClose }) {
    const [language, setLanguage] = useState('en');

    if (!isOpen) return null;

    const content = {
        en: {
            title: 'Know Your Rights: PWD Card & Booklet',
            intro: 'Understand the purpose and legal importance of your PWD ID and Purchase Booklet, as mandated by Philippine laws designed to protect and empower Persons with Disabilities.',
            card: {
                title: 'PWD Identification Card',
                law: '(Under RA 10754 & RA 9442)',
                description: 'The PWD ID is the official document that proves your eligibility for government-mandated discounts and privileges. It must be presented during every transaction where a benefit is claimed.',
                uses: 'Key Uses:',
                list: [
                    '20% discount and VAT exemption on:',
                    [
                        'Medicines (must be accompanied by booklet and prescription)',
                        'Medical and dental services',
                        'Transportation (land, sea, air)',
                        'Food and recreation services',
                        'Funeral and burial services'
                    ],
                    'Access to priority lanes in government and commercial establishments',
                    'Participation in programs related to health, education, and social protection'
                ]
            },
            booklet: {
                title: 'PWD Purchase Booklet',
                law: '(As required by DOH Administrative Order No. 2017-0008 and Joint DTI-DA AO No. 02, Series of 2008)',
                description: 'This booklet is used to record transactions and is required in addition to your PWD ID when claiming discounts on certain items.',
                required: 'Required For:',
                requiredItems: [
                    'Medicines – Must be presented with doctor\'s prescription and PWD ID',
                    'Basic Necessities and Prime Commodities (BNPC) – Items such as rice, canned goods, hygiene products, etc., where a 5% special monthly discount applies'
                ],
                purpose: 'Purpose:',
                purposes: [
                    'Tracks eligible discounted purchases',
                    'Prevents abuse and ensures fair access to government benefits',
                    'Serves as official documentation when discounts are claimed'
                ]
            },
            close: 'Close'
        },
        fil: {
            title: 'Alamin ang Iyong Karapatan: PWD Card at Booklet',
            intro: 'Unawain ang layunin at legal na kahalagahan ng iyong PWD ID at Purchase Booklet, alinsunod sa batas na nagpoprotekta at nagpapalakas ng Persons with Disabilities.',
            card: {
                title: 'PWD Identification Card',
                law: '(Ayon sa RA 10754 at RA 9442)',
                description: 'Ang PWD ID ay opisyal na dokumento na nagpapatunay ng iyong karapatang tumanggap ng mga diskwento at benepisyo. Ipinapakita ito sa bawat transaksyong may inaangking benepisyo.',
                uses: 'Pangunahing Gamit:',
                list: [
                    '20% diskwento at VAT exemption sa:',
                    [
                        'Gamot (kasama ang booklet at reseta)',
                        'Serbisyong medikal at dental',
                        'Transportasyon (lupa, dagat, himpapawid)',
                        'Pagkain at libangan',
                        'Serbisyong libing'
                    ],
                    'Access sa priority lanes sa mga establisimyento',
                    'Paglahok sa mga programang pangkalusugan, edukasyon, at panlipunan'
                ]
            },
            booklet: {
                title: 'PWD Purchase Booklet',
                law: '(Alinsunod sa DOH AO No. 2017-0008 at DTI-DA AO No. 02, Serye ng 2008)',
                description: 'Ang booklet na ito ay ginagamit para sa pagrekord ng mga transaksyon at kailangang ipakita kasama ng PWD ID kapag humihingi ng diskwento.',
                required: 'Ginagamit Sa:',
                requiredItems: [
                    'Gamot – Ipakita ang reseta ng doktor at PWD ID',
                    'Pangunahing pangangailangan at mahahalagang bilihin – gaya ng bigas, de-lata, at produktong panlinis, kung saan may 5% diskwento kada buwan'
                ],
                purpose: 'Layunin:',
                purposes: [
                    'Subaybayan ang mga kuwalipikadong biniling may diskwento',
                    'Iwasan ang pang-aabuso at tiyakin ang patas na benepisyo',
                    'Opisyal na patunay sa pag-claim ng diskwento'
                ]
            },
            close: 'Isara'
        },
        ceb: {
            title: 'Ilaa ang Imong Katungod: PWD Card ug Booklet',
            intro: 'Sabta ang katuyoan ug legal nga importansya sa imong PWD ID ug Purchase Booklet, subay sa mga balaod nga nagpanalipod ug nagtabang sa mga taong may kapansanan.',
            card: {
                title: 'PWD Identification Card',
                law: '(Ubos sa RA 10754 ug RA 9442)',
                description: 'Ang PWD ID maoy opisyal nga dokumento nga nagpakita sa imong katungod sa mga diskwento ug benepisyo. Kinahanglan kini ipakita sa matag transaksyon.',
                uses: 'Pangunang Gamit:',
                list: [
                    '20% diskwento ug VAT exemption sa:',
                    [
                        'Tambal (uban ang booklet ug reseta)',
                        'Serbisyong medikal ug dental',
                        'Transportasyon (yuta, dagat, hangin)',
                        'Pagkaon ug kalingawan',
                        'Serbisyong lubong'
                    ],
                    'Access sa priority lanes sa mga establisimyento',
                    'Apil sa mga programa sa kahimsog, edukasyon, ug sosyal nga tabang'
                ]
            },
            booklet: {
                title: 'PWD Purchase Booklet',
                law: '(Subay sa DOH AO No. 2017-0008 ug DTI-DA AO No. 02, Tuig 2008)',
                description: 'Kini nga booklet gigamit sa pagrekord sa mga diskwento ug kinahanglan ipakita uban sa PWD ID.',
                required: 'Gigamit Alang Sa:',
                requiredItems: [
                    'Tambal – Uban ang reseta ug PWD ID',
                    'Batakang Panginahanglanon – sama sa bugas, de lata, ug mga produkto sa kahinlo, nga may 5% diskwento matag bulan'
                ],
                purpose: 'Katuyoan:',
                purposes: [
                    'Subayon ang mga kuwalipikadong transaksyon',
                    'Likayan ang pang-abuso ug patas nga pag-apod',
                    'Opisyal nga dokumento sa pag-angkon sa diskwento'
                ]
            },
            close: 'Sirado'
        }
    };

    const lang = content[language];

    return (
        <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <FaBookOpen className="text-xl text-sky-600" />
                        <h2 className="text-xl font-semibold text-gray-800">{lang.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 text-gray-700 text-sm">
                    <p>{lang.intro}</p>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-sky-700 mb-2 flex items-center gap-2">
                                <FaIdCard /> {lang.card.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{lang.card.law}</p>
                            <p className="mb-2">{lang.card.description}</p>
                            <h4 className="font-medium mb-1">{lang.card.uses}</h4>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                <li>
                                    <strong>{lang.card.list[0]}</strong>
                                    <ul className="list-circle list-inside pl-6 space-y-0.5 mt-1">
                                        {lang.card.list[1].map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </li>
                                {lang.card.list.slice(2).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-sky-700 mb-2 flex items-center gap-2">
                                <FaShoppingCart /> {lang.booklet.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{lang.booklet.law}</p>
                            <p className="mb-2">{lang.booklet.description}</p>
                            <h4 className="font-medium mb-1">{lang.booklet.required}</h4>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                {lang.booklet.requiredItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="font-medium mt-3 mb-1">{lang.booklet.purpose}</h4>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                {lang.booklet.purposes.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`text-sm px-3 py-1 rounded ${
                                language === 'en' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('fil')}
                            className={`text-sm px-3 py-1 rounded ${
                                language === 'fil' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition`}
                        >
                            Filipino
                        </button>
                        <button
                            onClick={() => setLanguage('ceb')}
                            className={`text-sm px-3 py-1 rounded ${
                                language === 'ceb' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition`}
                        >
                            Cebuano
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                    >
                        {lang.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
