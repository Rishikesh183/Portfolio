'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  user: string;
  bot: string;
}

interface RecruiterFormState {
  recruiterName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

interface RecruiterFormErrors {
  recruiterName?: string;
  email?: string;
  phone?: string;
}

const emptyRecruiterForm: RecruiterFormState = {
  recruiterName: '',
  company: '',
  email: '',
  phone: '',
  message: '',
};

const shouldReopenRecruiterForm = (message: string) =>
  /(fill.*form again|open.*form again|show.*form again|recruiter form again|open recruiter form|show recruiter form|fill recruiter form)/i.test(
    message,
  );

const recruiterNudges = [
  'Want me to log this properly? Open the recruiter form and I can package everything neatly.',
  'You can use the recruiter form whenever you want to raise one clean final mail.',
  'If this is moving forward, the recruiter form is the quickest way to get everything sent in one go.',
];

const validateRecruiterForm = (form: RecruiterFormState): RecruiterFormErrors => {
  const errors: RecruiterFormErrors = {};

  if (form.recruiterName.trim()) {
    const isValidName = /^[A-Za-z][A-Za-z\s.'-]*$/.test(form.recruiterName.trim());
    if (!isValidName) {
      errors.recruiterName = 'Name must contain only letters and normal name characters.';
    }
  }

  if (form.email.trim()) {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!isValidEmail) {
      errors.email = 'Enter a valid email address with @ and a domain.';
    }
  }

  if (form.phone.trim()) {
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }
  }

  return errors;
};

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [submittingRecruiterForm, setSubmittingRecruiterForm] = useState(false);
  const [showRecruiterForm, setShowRecruiterForm] = useState(true);
  const [recruiterFormCollapsed, setRecruiterFormCollapsed] = useState(true);
  const [recruiterForm, setRecruiterForm] = useState<RecruiterFormState>(emptyRecruiterForm);
  const [recruiterFormErrors, setRecruiterFormErrors] = useState<RecruiterFormErrors>({});
  const [ticketConfirmation, setTicketConfirmation] = useState<{
    ticketId: string;
    emailSubject: string;
  } | null>(null);
  const [recruiterNudge, setRecruiterNudge] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem('rishi-chat-session-id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      return;
    }

    const nextSessionId = crypto.randomUUID();
    window.localStorage.setItem('rishi-chat-session-id', nextSessionId);
    setSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, loading]);

  useEffect(() => {
    if (!showRecruiterForm || ticketConfirmation) {
      setRecruiterNudge('');
      return;
    }

    const showRandomNudge = () => {
      const next =
        recruiterNudges[Math.floor(Math.random() * recruiterNudges.length)];
      setRecruiterNudge(next);
    };

    showRandomNudge();
    const intervalId = window.setInterval(showRandomNudge, 10000);

    return () => window.clearInterval(intervalId);
  }, [showRecruiterForm, ticketConfirmation]);

  const handleRecruiterFieldChange = (
    field: keyof RecruiterFormState,
    value: string,
  ) => {
    setRecruiterFormErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setRecruiterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    if (shouldReopenRecruiterForm(userMessage)) {
      setShowRecruiterForm(true);
      setTicketConfirmation(null);
      setRecruiterFormCollapsed(false);
    }

    setChatLog((prev) => [...prev, { user: userMessage, bot: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: chatLog,
          sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get chat response');
      }

      if (!res.body) {
        const fallbackText = await res.text();
        setChatLog((prev) => {
          const updatedLog = [...prev];
          updatedLog[updatedLog.length - 1].bot =
            fallbackText || 'Sorry, I could not find an answer.';
          return updatedLog;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botMessage += decoder.decode(value, { stream: true });
        setChatLog((prev) => {
          const updatedLog = [...prev];
          updatedLog[updatedLog.length - 1].bot = botMessage;
          return updatedLog;
        });
      }

      botMessage += decoder.decode();
      setChatLog((prev) => {
        const updatedLog = [...prev];
        updatedLog[updatedLog.length - 1].bot =
          botMessage || 'Sorry, I could not find an answer.';
        return updatedLog;
      });
    } catch (err) {
      console.error(err);
      setChatLog((prev) => {
        const updatedLog = [...prev];
        updatedLog[updatedLog.length - 1].bot =
          'Sorry, there was an error processing your request.';
        return updatedLog;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async () => {
    if (!sessionId) return;
    const validationErrors = validateRecruiterForm(recruiterForm);

    if (!recruiterForm.email.trim() && !recruiterForm.phone.trim()) {
      setRecruiterFormErrors({
        ...validationErrors,
        email: validationErrors.email || 'Email or phone is required.',
      });
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setRecruiterFormErrors(validationErrors);
      return;
    }

    setRecruiterFormErrors({});

    setSubmittingRecruiterForm(true);

    try {
      const res = await fetch('/api/recruiter-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          history: chatLog,
          ...recruiterForm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit recruiter details');
      }

      setTicketConfirmation({
        ticketId: data.ticketId,
        emailSubject: data.emailSubject,
      });
      setShowRecruiterForm(false);

      setChatLog((prev) => [
        ...prev,
        {
          user: 'Recruiter form submitted',
          bot: `I've alerted my Gmail about this process and logged it properly. I'll reach out at the earliest with the required details. Your ticket number is ${data.ticketId}, and the subject line is ${data.emailSubject}.`,
        },
      ]);

      setRecruiterForm(emptyRecruiterForm);
      setRecruiterFormErrors({});
    } catch (error) {
      console.error(error);
      setChatLog((prev) => [
        ...prev,
        {
          user: 'Recruiter form submission',
          bot: 'Sorry, I could not finish the recruiter ticket submission just now.',
        },
      ]);
    } finally {
      setSubmittingRecruiterForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-2 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl mx-auto bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 border border-purple-800 shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-300 to-blue-300">
            Chat with Rishi&apos;s AI
          </span>
        </h1>

        {showRecruiterForm ? (
          <div className="rounded-xl border border-blue-700 bg-blue-950/40 p-3 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-blue-100">
                  Recruiter Quick Form
                </h2>
                <p className="text-xs sm:text-sm text-blue-200/80">
                  Fill this once and press Finish to send one mail.
                </p>
              </div>
              <button
                onClick={() => setRecruiterFormCollapsed((prev) => !prev)}
                className="shrink-0 rounded-md border border-blue-700 px-3 py-1 text-xs text-blue-100 hover:bg-blue-900/40"
              >
                {recruiterFormCollapsed ? 'Open' : 'Collapse'}
              </button>
            </div>

            {recruiterNudge && recruiterFormCollapsed && (
              <div className="rounded-lg border border-amber-600/70 bg-amber-950/30 p-3 text-xs sm:text-sm text-amber-100">
                {recruiterNudge}
              </div>
            )}

            {!recruiterFormCollapsed && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={recruiterForm.recruiterName}
                    onChange={(e) => handleRecruiterFieldChange('recruiterName', e.target.value)}
                    placeholder="Recruiter name*"
                    className="w-full rounded-lg bg-black/50 border border-blue-700 px-3 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {recruiterFormErrors.recruiterName && (
                    <p className="sm:col-span-2 -mt-1 text-xs text-red-300">
                      {recruiterFormErrors.recruiterName}
                    </p>
                  )}
                  <input
                    type="text"
                    value={recruiterForm.company}
                    onChange={(e) => handleRecruiterFieldChange('company', e.target.value)}
                    placeholder="Company*"
                    className="w-full rounded-lg bg-black/50 border border-blue-700 px-3 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    value={recruiterForm.email}
                    onChange={(e) => handleRecruiterFieldChange('email', e.target.value)}
                    placeholder="Recruiter email*"
                    className="w-full rounded-lg bg-black/50 border border-blue-700 px-3 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {recruiterFormErrors.email && (
                    <p className="sm:col-span-2 -mt-1 text-xs text-red-300">
                      {recruiterFormErrors.email}
                    </p>
                  )}
                  <input
                    type="text"
                    value={recruiterForm.phone}
                    onChange={(e) => handleRecruiterFieldChange('phone', e.target.value)}
                    placeholder="Phone number*"
                    className="w-full rounded-lg bg-black/50 border border-blue-700 px-3 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {recruiterFormErrors.phone && (
                    <p className="sm:col-span-2 -mt-1 text-xs text-red-300">
                      {recruiterFormErrors.phone}
                    </p>
                  )}
                </div>

                <textarea
                  value={recruiterForm.message}
                  onChange={(e) => handleRecruiterFieldChange('message', e.target.value)}
                  placeholder="What would you like to convey or ask?"
                  rows={3}
                  className="w-full rounded-lg bg-black/50 border border-blue-700 px-3 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleRecruiterSubmit}
                  disabled={
                    submittingRecruiterForm ||
                    (!recruiterForm.email.trim() && !recruiterForm.phone.trim())
                  }
                  className="w-full sm:w-auto bg-linear-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {submittingRecruiterForm ? 'Finishing...' : 'Finish'}
                </button>
              </>
            )}
          </div>
        ) : (
          ticketConfirmation && (
            <div className="rounded-xl border border-emerald-700 bg-emerald-950/40 p-3 sm:p-4 text-sm text-emerald-100">
              I've already alerted my Gmail about this.
              <br />
              Ticket number: <span className="font-semibold">{ticketConfirmation.ticketId}</span>
              <br />
              Mail subject: <span className="font-semibold">{ticketConfirmation.emailSubject}</span>
            </div>
          )
        )}

        <div className="space-y-4 h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-y-auto rounded-lg border border-purple-700 p-2 sm:p-3 md:p-4 bg-black bg-opacity-50">
          {chatLog.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-300 text-center text-sm sm:text-base px-2">
                Ask me anything about Rishikesh&apos;s skills, experience, or projects.
              </p>
            </div>
          ) : (
            chatLog.map((msg, i) => (
              <div key={i} className="mb-3 sm:mb-4">
                <div className="flex items-start mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                    You
                  </div>
                  <div className="ml-2 px-3 py-2 bg-blue-600 bg-opacity-30 rounded-lg border border-blue-700 text-white max-w-[80%] sm:max-w-[85%] text-sm sm:text-base wrap-break-word">
                    {msg.user}
                  </div>
                </div>

                {msg.bot && (
                  <div className="flex items-start mt-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                      AI
                    </div>
                    <div className="ml-2 px-3 py-2 bg-purple-900 bg-opacity-40 rounded-lg border border-purple-800 text-gray-100 whitespace-pre-wrap max-w-[80%] sm:max-w-[85%] text-sm sm:text-base wrap-break-word">
                      {msg.bot}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                AI
              </div>
              <div className="ml-2 px-3 py-2 bg-purple-900 bg-opacity-40 rounded-lg border border-purple-800 text-purple-300">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Ask about Rishikesh or leave recruiter details..."
            className="w-full p-2 sm:p-3 rounded-lg bg-black bg-opacity-60 text-white border border-purple-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-purple-300 text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-sm sm:text-base flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">Wait</span>
            ) : (
              <span className="flex items-center">Send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
