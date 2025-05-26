import React, { useState } from 'react';

export default function RequiredDocumentsModal({ isOpen, onClose }) {
  // State to manage the active language
  const [language, setLanguage] = useState('english'); // Default to English

  // Define translations for the modal content
  const translations = {
    english: {
      title: 'Required Documents',
      basicRequirements: {
        heading: 'Basic Requirements',
        items: [
          'Barangay Certificate',
          'Birth Certificate or Any Valid ID',
        ],
      },
      apparentDisabilities: {
        heading: 'For Apparent Disabilities',
        note: '(Disabilities that are visible or easily noticeable)',
        items: [
          'Certificate of Disability (Duly signed by a Registered Social Worker with License Number)',
        ],
      },
      nonApparentDisabilities: {
        heading: 'For Non-Apparent Disabilities',
        note: '(Disabilities that are not immediately visible and require medical diagnosis)',
        items: [
          'Medical Certificate (Duly signed by a Medical Doctor with License Number)',
          'Certificate of Disability (Duly signed by a Medical Doctor with License Number)',
        ],
      },
      pwdAccountValidation: {
        heading: 'PWD Account Validation',
        text: 'Please present these documents to the PDAO (Person with Disability Affairs Office) for the validation of your PWD account.',
      },
      closeButton: 'Close',
    },
    filipino: {
      title: 'Mga Kinakailangang Dokumento',
      basicRequirements: {
        heading: 'Mga Pangunahing Kinakailangan',
        items: [
          'Sertipiko ng Barangay',
          'Birth Certificate o Anumang Balidong ID',
        ],
      },
      apparentDisabilities: {
        heading: 'Para sa mga Nakikitang Kapansanan',
        note: '(Mga kapansanan na nakikita o madaling mapansin)',
        items: [
          'Certificate of Disability (Nilagdaan ng isang Rehistradong Social Worker na may License Number)',
        ],
      },
      nonApparentDisabilities: {
        heading: 'Para sa mga Hindi Nakikitang Kapansanan',
        note: '(Mga kapansanan na hindi agad nakikita at nangangailangan ng medikal na pagsusuri)',
        items: [
          'Medical Certificate (Nilagdaan ng isang Medical Doctor na may License Number)',
          'Certificate of Disability (Nilagdaan ng isang Medical Doctor na may License Number)',
        ],
      },
      pwdAccountValidation: {
        heading: 'Pagpapatunay ng PWD Account',
        text: 'Mangyaring iharap ang mga dokumentong ito sa PDAO (Person with Disability Affairs Office) para sa pagpapatunay ng iyong PWD account.',
      },
      closeButton: 'Isara',
    },
    cebuano: {
      title: 'Mga Gikinahanglang Dokumento',
      basicRequirements: {
        heading: 'Mga Batakang Kinahanglanon',
        items: [
          'Barangay Certificate',
          'Birth Certificate o Bisan Unsang Balidong ID',
        ],
      },
      apparentDisabilities: {
        heading: 'Para sa mga Makita nga Kakulian',
        note: '(Mga kakulian nga makita o dali ra mamatikdan)',
        items: [
          'Certificate of Disability (Nipirmahan sa usa ka Rehistradong Social Worker nga adunay naay License Number)',
        ],
      },
      nonApparentDisabilities: {
        heading: 'Para sa mga Dili Makita nga Kakulian',
        note: '(Mga kakulian nga dili dayon makita ug nagkinahanglan og medikal nga pagdayagnos)',
        items: [
          'Medical Certificate (Nipirmahan sa usa ka Medical Doctor nga adunay naay License Number)',
          'Certificate of Disability (Nipirmahan sa usa ka Medical Doctor nga adunay naay License Number)',
        ],
      },
      pwdAccountValidation: {
        heading: 'Pagpamatud sa PWD Account',
        text: 'Palihug ipresentar kini nga mga dokumento sa PDAO (Person with Disability Affairs Office) para sa pagpamatud sa imong PWD account.',
      },
      closeButton: 'Sirado',
    },
  };

  // Get the current translation based on the selected language
  const currentTranslation = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Modal Backdrop */}
        <div
          className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-lg px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
              {currentTranslation.title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  language === 'english'
                    ? 'bg-white text-teal-700 shadow'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('filipino')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  language === 'filipino'
                    ? 'bg-white text-teal-700 shadow'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                Filipino
              </button>
              <button
                onClick={() => setLanguage('cebuano')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  language === 'cebuano'
                    ? 'bg-white text-teal-700 shadow'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                Cebuano
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Basic Requirements */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTranslation.basicRequirements.heading}
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {currentTranslation.basicRequirements.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Apparent Disabilities */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTranslation.apparentDisabilities.heading}
                </h4>
                <p className="text-sm text-gray-600 italic mb-2">
                  {currentTranslation.apparentDisabilities.note}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {currentTranslation.apparentDisabilities.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Non-Apparent Disabilities */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTranslation.nonApparentDisabilities.heading}
                </h4>
                <p className="text-sm text-gray-600 italic mb-2">
                  {currentTranslation.nonApparentDisabilities.note}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {currentTranslation.nonApparentDisabilities.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* PWD Account Validation */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTranslation.pwdAccountValidation.heading}
                </h4>
                <p className="text-gray-700">
                  {currentTranslation.pwdAccountValidation.text}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              {currentTranslation.closeButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
