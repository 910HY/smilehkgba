import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

const ReportPage = () => {
  // 從 URL 參數取得診所資訊
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const clinicName = urlParams.get('clinic') || '';

  const [submitted, setSubmitted] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // 監聽表單提交事件
  useEffect(() => {
    const handleFormSubmit = (event: any) => {
      if (event.target.action?.includes('formspree.io')) {
        setIsFormSubmitting(true);
      }
    };

    // 監聽 formspree 的表單提交完成事件
    const handleFormSubmitDone = () => {
      if (isFormSubmitting) {
        setSubmitted(true);
        setIsFormSubmitting(false);
      }
    };

    // 添加事件監聽器
    document.addEventListener('submit', handleFormSubmit);
    window.addEventListener('message', (e) => {
      if (e.data.formspreeResponse && isFormSubmitting) {
        handleFormSubmitDone();
      }
    });

    // 清理函數
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [isFormSubmitting]);

  // 返回首頁
  const goHome = () => {
    setLocation("/");
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#FF7A00]">感謝你的回報！</h2>
        <p className="text-[#FDBA74] mb-6">我們會儘快處理診所資料錯誤。</p>
        <button 
          onClick={goHome}
          className="bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 text-[#FF7A00] font-medium py-2 px-4 rounded text-center transition border border-[#FDBA74]/30"
        >
          返回首頁
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#FF7A00] mb-4">回報診所資料錯誤</h2>
      
      <form
        action="https://formspree.io/f/meoaprzb"
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" name="clinic" value={clinicName} />

        <div>
          <label className="block text-sm text-[#FF7A00] mb-1">診所名稱</label>
          <input
            type="text"
            name="clinic"
            defaultValue={clinicName}
            readOnly
            className="w-full p-2 border border-[#FDBA74]/50 rounded bg-[#0f172a] text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#FF7A00] mb-1">錯誤類型</label>
          <input
            type="text"
            name="issue"
            required
            placeholder="例如：電話錯誤 / 地址錯誤 / 已結業"
            className="w-full p-2 border border-[#FDBA74]/50 rounded bg-[#0f172a] text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#FF7A00] mb-1">詳細說明</label>
          <textarea
            name="detail"
            rows={4}
            placeholder="請補充更多說明，例如正確資料為？"
            className="w-full p-2 border border-[#FDBA74]/50 rounded bg-[#0f172a] text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#FF7A00] mb-1">聯絡方式（選填）</label>
          <input
            type="text"
            name="contact"
            placeholder="電郵或電話，方便我們聯絡你"
            className="w-full p-2 border border-[#FDBA74]/50 rounded bg-[#0f172a] text-white"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-[#FF7A00] text-white font-bold px-6 py-2 rounded hover:bg-[#ff6000] transition"
          >
            提交報錯
          </button>
          
          <button
            type="button"
            onClick={goHome}
            className="bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 text-[#FF7A00] font-medium py-2 px-4 rounded text-center transition border border-[#FDBA74]/30"
          >
            返回首頁
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportPage;